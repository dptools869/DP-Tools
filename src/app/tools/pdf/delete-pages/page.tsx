
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileMinus, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deletePdfPages, DeletePdfPagesOutput } from '@/ai/flows/delete-pdf-pages';
import AdBanner from '@/components/ad-banner';

export default function DeletePdfPagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<DeletePdfPagesOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setProcessResult(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file (.pdf).',
        });
        event.target.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setProcessResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a PDF file (.pdf).',
      });
    }
  };

  const processFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a PDF file.',
      });
      return;
    }
    if (!pageRange.trim()) {
      toast({
        variant: 'destructive',
        title: 'Page Range Required',
        description: 'Please enter the page(s) to delete.',
      });
      return;
    }

    setIsProcessing(true);
    setProcessResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result as string;
        try {
          const result = await deletePdfPages({ 
            pdfDataUri: base64File, 
            fileName: file.name, 
            pageRange 
          });
          setProcessResult(result);
          toast({
            title: 'Pages Deleted Successfully',
            description: 'Your modified PDF is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred while deleting pages. ${error instanceof Error ? error.message : ''}`,
          });
        } finally {
            setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
          });
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An unexpected error occurred. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };

  const downloadPdf = () => {
    if (processResult) {
      const link = document.createElement('a');
      link.href = processResult.pdfDataUri;
      link.download = processResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setPageRange('');
    setIsProcessing(false);
    setProcessResult(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileMinus className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Delete PDF Pages</CardTitle>
              <CardDescription className="text-lg">
                Remove one or more pages from your PDF document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!processResult && (
                <div className="space-y-6">
                  <Label
                    htmlFor="file-upload"
                    className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                        <UploadCloud className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-foreground">
                            {fileName || 'Drag & drop your PDF file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isProcessing} />
                  </Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-range">Pages to Delete</Label>
                    <Input 
                      id="page-range"
                      type="text"
                      placeholder="e.g., 1, 3-5, 8"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-muted-foreground">Enter page numbers or ranges, separated by commas.</p>
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || !pageRange.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Deleting Pages...
                      </>
                    ) : (
                      'Delete Pages'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Pages Deleted!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{processResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Process Another
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after modification.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Streamline Your Documents by Deleting PDF Pages</h2>
            <p>Our Delete PDF Pages tool provides a simple and effective way to remove unwanted pages from your PDF files. Whether you need to get rid of blank pages, remove irrelevant sections, or extract just the essential parts of a document, this tool makes it easy. It's perfect for cleaning up reports, creating concise versions of documents for sharing, or removing sensitive information before distribution.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How to Delete Pages from a PDF</h2>
            <p>The process is incredibly simple. First, upload your PDF document. Second, in the "Pages to Delete" input box, specify which pages you want to remove. You can enter individual page numbers (like <code>1, 3, 8</code>), page ranges (like <code>4-7</code>), or a combination of both (like <code>1, 4-7, 10</code>). Our tool will then process the file, remove the specified pages, and create a new, modified PDF for you to download. All other pages will remain in their original order.</p>
            <h3>Key Benefits of Using Our PDF Page Deletion Tool</h3>
            <ul>
              <li><strong>Precise Control:</strong> Specify exactly which pages or page ranges to remove from your document.</li>
              <li><strong>Create Smaller Files:</strong> By removing unnecessary pages, you can reduce the overall file size, making it easier to store and share.</li>
              <li><strong>Improve Document Clarity:</strong> Present only the most relevant information by getting rid of clutter.</li>
              <li><strong>Fast and Secure:</strong> Your files are processed quickly over an encrypted connection and are permanently deleted from our servers after a short period.</li>
              <li><strong>Free and Easy to Use:</strong> No software to install and no fees. Just a simple, effective online tool.</li>
            </ul>
            <p>Using a "PDF page remover" is an essential skill for efficient document management. Clean up your files and make them more manageable with our free, fast, and secure "Delete PDF Pages online" tool.</p>
          </article>

          <AdBanner type="bottom-banner" className="mt-12" />

        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
