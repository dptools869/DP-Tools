
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Merge, Loader2, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mergePdf, MergePdfOutput } from '@/ai/flows/merge-pdf';
import AdBanner from '@/components/ad-banner';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState<MergePdfOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== selectedFiles.length) {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'One or more selected files were not PDFs and have been ignored.',
          });
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMergeResult(null);
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== droppedFiles.length) {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'One or more dropped files were not PDFs and have been ignored.',
          });
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMergeResult(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  }
  
  const processFiles = async () => {
    if (files.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Files',
        description: 'Please select at least two PDF files to merge.',
      });
      return;
    }

    setIsMerging(true);
    setMergeResult(null);

    try {
      const dataUris = await Promise.all(
        files.map(file => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        }))
      );
      
      const result = await mergePdf({ 
        pdfDataUris: dataUris, 
        fileName: 'merged-document.pdf'
      });

      setMergeResult(result);
      toast({
        title: 'Merge Successful',
        description: 'Your PDF has been merged.',
      });

    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Merge Failed',
        description: `An error occurred during the merge process. ${error instanceof Error ? error.message : ''}`,
      });
    } finally {
        setIsMerging(false);
    }
  };
  
  const downloadPdf = () => {
    if (mergeResult) {
      const link = document.createElement('a');
      link.href = mergeResult.pdfDataUri;
      link.download = mergeResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setIsMerging(false);
    setMergeResult(null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Merge className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF Merger</CardTitle>
              <CardDescription className="text-lg">
                Combine multiple PDF files into one single document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!mergeResult && (
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
                            Drag & drop your PDF files here
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" multiple disabled={isMerging} />
                  </Label>

                  {files.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selected Files ({files.length}):</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((file, index) => (
                           <li key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50 border">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="truncate text-sm">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                  <X className="h-4 w-4"/>
                              </Button>
                           </li>
                        ))}
                      </ul>
                    </div>
                  )}

                   <Button onClick={processFiles} className="w-full text-lg py-6" size="lg" disabled={files.length < 2 || isMerging}>
                    {isMerging ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      `Merge ${files.length > 1 ? files.length : ''} PDFs`
                    )}
                  </Button>
                </div>
              )}

              {mergeResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Merge Successful!</AlertTitle>
                    <AlertDescription>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                           <p className="font-semibold text-center sm:text-left">
                                Your new merged PDF is ready.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Merged PDF
                                </Button>
                                <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>
                                    Merge More
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Streamline Your Documents: The Ultimate PDF Merger</h2>
            <p>Combining multiple PDF documents into one cohesive file is a common need for professionals, students, and anyone managing digital paperwork. Our PDF Merger tool simplifies this process, allowing you to quickly and securely combine several PDFs into a single, organized document. Whether you're assembling a report from various sources, compiling receipts for an expense claim, or creating a portfolio, our tool provides a fast, reliable, and user-friendly solution. Keywords like "merge PDF," "combine PDF," and "free PDF joiner" are central to our service.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF Merging Work?</h2>
            <p>Our PDF Merger makes it easy to combine your files. Simply upload two or more PDF files using our drag-and-drop interface. You can reorder the files as needed to ensure the correct sequence in the final document. Once you're ready, click the "Merge PDF" button. Our powerful backend service takes your individual files and stitches them together, page by page, into a new, single PDF document. The process preserves the original formatting, orientation, and quality of each source file.</p>
            <h3>Key Benefits of Using Our PDF Merger</h3>
            <ul>
              <li><strong>Combine Multiple Files:</strong> Merge an unlimited number of PDF files in one go.</li>
              <li><strong>Simple Reordering:</strong> Easily drag and drop to arrange files in the desired order before merging.</li>
              <li><strong>High-Quality Output:</strong> The merged PDF retains the quality and formatting of your original documents.</li>
              <li><strong>Fast and Secure:</strong> Our tool quickly processes your files with 256-bit SSL encryption for security. All files are automatically deleted from our servers after a short period.</li>
              <li><strong>Completely Free:</strong> Merge PDFs without any cost, watermarks, or file size limitations.</li>
            </ul>
            <h2>Why Merging PDFs is Essential</h2>
            <p>A "combined PDF" is easier to store, share, and review than a folder full of individual files. It streamlines document management, ensuring that related information stays together. Sending a single, consolidated file is more professional and convenient for the recipient than sending multiple attachments. Whether you need to "join PDF files" for work, school, or personal projects, our tool is the perfect solution for efficient document management.</p>
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
