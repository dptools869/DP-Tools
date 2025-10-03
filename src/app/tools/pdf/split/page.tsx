
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Split, Loader2, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { splitPdf, SplitPdfOutput } from '@/ai/flows/split-pdf';
import AdBanner from '@/components/ad-banner';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setSplitResult(null);
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
      setSplitResult(null);
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
        description: 'Please select a PDF file to split.',
      });
      return;
    }

    setIsSplitting(true);
    setSplitResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result as string;
        try {
          const result = await splitPdf({ pdfDataUri: base64File, fileName: file.name });
          setSplitResult(result);
          toast({
            title: 'Split Successful',
            description: `Your PDF has been split into ${result.fileCount} files.`,
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Split Failed',
            description: `An error occurred during the split process. ${error instanceof Error ? error.message : ''}`,
          });
        } finally {
            setIsSplitting(false);
        }
      };
      reader.onerror = (error) => {
        setIsSplitting(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
          });
      }
    } catch (error) {
      setIsSplitting(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An unexpected error occurred. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };

  const downloadFile = (pdfDataUri: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setIsSplitting(false);
    setSplitResult(null);
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
                <Split className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Split PDF</CardTitle>
              <CardDescription className="text-lg">
                Extract all pages from a PDF into separate PDF files.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!splitResult && (
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
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isSplitting} />
                  </Label>
                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || isSplitting}>
                    {isSplitting ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Splitting...
                      </>
                    ) : (
                      'Split PDF'
                    )}
                  </Button>
                </div>
              )}

              {splitResult && (
                 <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                        <FileCheck className="h-5 w-5 text-current" />
                        <AlertTitle className="font-bold">Split Successful!</AlertTitle>
                        <AlertDescription>
                           Your PDF has been split into {splitResult.fileCount} separate files.
                        </AlertDescription>
                    </Alert>
                     <ScrollArea className="h-72 w-full rounded-md border p-4">
                        <div className="space-y-2">
                            {splitResult.files.map((splitFile, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="text-sm font-medium truncate">{splitFile.fileName}</span>
                                    </div>
                                    <Button size="sm" onClick={() => downloadFile(splitFile.pdfDataUri, splitFile.fileName)}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                     </ScrollArea>
                     <Button onClick={resetTool} variant="outline" className="w-full">
                        Split Another PDF
                    </Button>
                 </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Effortlessly Split Your PDFs</h2>
            <p>Our PDF Splitter tool provides a simple and efficient way to break down large PDF documents into individual pages. Whether you need to extract a single page, separate chapters of a book, or divide a report into sections, this tool gives you the power to manage your documents with precision. This is essential for anyone who needs to reorganize, share, or archive specific parts of a PDF file without sending the entire document.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF Splitting Work?</h2>
            <p>The process is incredibly straightforward. Simply upload your PDF file, and our tool will automatically separate each page into its own individual PDF document. For your convenience, all the newly created files are then displayed in a list, making it easy to download them one by one. Our tool handles the entire process securely and efficiently, ensuring your data is protected and the results are delivered quickly.</p>
            <h3>Key Benefits of Using Our PDF Splitter</h3>
            <ul>
                <li><strong>Extract Every Page:</strong> Instantly convert each page of your PDF into a separate file.</li>
                <li><strong>Easy to Use:</strong> A simple drag-and-drop interface makes the process quick and painless. No complex options to configure.</li>
                <li><strong>Convenient Download:</strong> All your split files are provided in a clear list for individual downloads.</li>
                <li><strong>Secure and Private:</strong> We prioritize your privacy. All uploaded and processed files are encrypted and automatically deleted from our servers after a short period.</li>
                <li><strong>Completely Free:</strong> Split as many PDFs as you need without any cost, subscriptions, or limitations.</li>
            </ul>
            <p>By using a reliable "PDF splitter," you gain more control over your documents. It’s the perfect solution for breaking up large files for easier emailing, extracting specific pages for reports, or simply organizing your digital library more effectively. Try our free "online PDF splitting tool" today and simplify your document workflow.</p>
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
