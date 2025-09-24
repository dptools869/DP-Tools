
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Info, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfMetadata, PdfMetadataOutput } from '@/ai/flows/pdf-metadata';
import AdBanner from '@/components/ad-banner';

function formatBytes(bytes: number | undefined, decimals = 2) {
    if (bytes === undefined) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export default function PdfMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<PdfMetadataOutput | null>(null);
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
        description: 'Please select a PDF file to view its metadata.',
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
          const result = await pdfMetadata({ 
            pdfDataUri: base64File, 
            fileName: file.name
          });
          setProcessResult(result);
          toast({
            title: 'Metadata Extracted Successfully',
            description: 'The metadata for your PDF is displayed below.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred while extracting metadata. ${error instanceof Error ? error.message : ''}`,
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

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setIsProcessing(false);
    setProcessResult(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const MetadataItem = ({ label, value }: { label: string, value: string | number | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between border-b py-2 text-sm">
            <span className="font-semibold text-muted-foreground">{label}</span>
            <span className="text-right">{label === 'File Size' ? formatBytes(value as number) : value}</span>
        </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Info className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF Metadata Viewer</CardTitle>
              <CardDescription className="text-lg">
                View and extract the hidden metadata from your PDF files.
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
                  
                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      'View Metadata'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                        <FileCheck className="h-5 w-5 text-current" />
                        <AlertTitle className="font-bold">Extraction Complete!</AlertTitle>
                        <AlertDescription>
                            Metadata for <span className="font-semibold">{fileName}</span> is shown below.
                        </AlertDescription>
                    </Alert>
                    <Card>
                        <CardContent className="pt-6">
                           <MetadataItem label="Title" value={processResult.Title} />
                           <MetadataItem label="Author" value={processResult.Author} />
                           <MetadataItem label="Subject" value={processResult.Subject} />
                           <MetadataItem label="Keywords" value={processResult.Keywords} />
                           <MetadataItem label="Creator" value={processResult.Creator} />
                           <MetadataItem label="Producer" value={processResult.Producer} />
                           <MetadataItem label="Creation Date" value={processResult.CreationDate} />
                           <MetadataItem label="Modification Date" value={processResult.ModDate} />
                           <MetadataItem label="Trapped" value={processResult.Trapped} />
                           <MetadataItem label="Page Count" value={processResult.PageCount} />
                           <MetadataItem label="File Size" value={processResult.FileSize} />
                        </CardContent>
                    </Card>
                     <Button onClick={resetTool} size="lg" variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Check Another PDF
                    </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after viewing.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Uncovering PDF Metadata</h2>
            <p>Every PDF file contains a hidden layer of information known as metadata. This can include details like the author's name, the document title, creation date, and the software used to create it. Our PDF Metadata Viewer is a simple tool that allows you to upload a PDF and instantly see all of this embedded information. This can be incredibly useful for verifying the authenticity of a document, understanding its history, or for general file management.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does Metadata Extraction Work?</h2>
            <p>When you upload a PDF, our tool communicates with a specialized API that reads the file's metadata structure without processing the visible content of the document. It extracts all available metadata fields and presents them to you in a clean, easy-to-read format. The process is fast, and since it only reads metadata, it's very secure. Your file is never stored on our servers.</p>
            <h3>Key Benefits of Viewing PDF Metadata</h3>
            <ul>
              <li><strong>Verify Document Origin:</strong> See who created the document and with what software.</li>
              <li><strong>Check Timestamps:</strong> View the creation and modification dates to understand the document's timeline.</li>
              <li><strong>Discover Keywords:</strong> The keywords field can give you a quick summary of the document's content.</li>
              <li><strong>Simple and Secure:</strong> No need to download any software. Just upload your file and view the data securely in your browser.</li>
              <li><strong>Completely Free:</strong> View metadata for as many PDFs as you need, without any cost.</li>
            </ul>
            <p>Our "PDF metadata viewer" is a simple but powerful tool for anyone who works with PDF files. It provides transparency and insight into your documents, helping you manage your digital files more effectively.</p>
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
