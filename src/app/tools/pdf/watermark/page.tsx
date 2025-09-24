
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Copyright, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { watermarkPdf, WatermarkPdfOutput } from '@/ai/flows/watermark-pdf';
import AdBanner from '@/components/ad-banner';

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<WatermarkPdfOutput | null>(null);
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
        description: 'Please select a PDF file to watermark.',
      });
      return;
    }
    if (!watermarkText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Watermark Text Required',
        description: 'Please enter the text for the watermark.',
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
          const result = await watermarkPdf({ 
            pdfDataUri: base64File, 
            fileName: file.name, 
            watermarkText 
          });
          setProcessResult(result);
          toast({
            title: 'Watermark Applied Successfully',
            description: 'Your watermarked PDF is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred during watermarking. ${error instanceof Error ? error.message : ''}`,
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
    setWatermarkText('');
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
                <Copyright className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Watermark PDF</CardTitle>
              <CardDescription className="text-lg">
                Add a custom text watermark to protect your PDF documents.
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
                    <Label htmlFor="watermark-text">Watermark Text</Label>
                    <Input 
                      id="watermark-text"
                      type="text"
                      placeholder="e.g., CONFIDENTIAL, DRAFT, %PAGE%/%PAGES%"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-muted-foreground">Use variables like %PAGE%, %PAGES%, %DATE%, %TIME%.</p>
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || !watermarkText.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Applying Watermark...
                      </>
                    ) : (
                      'Add Watermark'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Watermark Applied!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{processResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Watermark Another
                            </Button>
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
            <h2>Protect Your Documents with a Custom Watermark</h2>
            <p>Adding a watermark to your PDF is a simple yet effective way to protect your intellectual property, assert ownership, or indicate the status of a document. Our Watermark PDF tool allows you to easily add custom text watermarks to your files. Whether you need to mark a document as a "DRAFT," label it "CONFIDENTIAL," or add your company name or copyright notice, this tool provides a quick and secure solution.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does PDF Watermarking Work?</h2>
            <p>The process is straightforward. First, you upload the PDF document you wish to watermark. Next, you enter the desired text for your watermark in the input field. You can use dynamic variables like <code>%PAGE%</code> for the current page number, <code>%PAGES%</code> for the total number of pages, or <code>%DATE%</code> for the current date. When you click the "Add Watermark" button, our tool overlays the text onto each page of your PDF. The service offers various customization options such as font, size, color, and position to ensure the watermark meets your needs without obscuring the original content. The result is a new, watermarked PDF that is ready for you to download.</p>
            <h3>Key Benefits of Using Our Watermark PDF Tool</h3>
            <ul>
              <li><strong>Protect Your Content:</strong> Discourage unauthorized use and distribution of your documents by clearly marking them with your ownership details.</li>
              <li><strong>Indicate Document Status:</strong> Use watermarks like "DRAFT," "SAMPLE," or "CONFIDENTIAL" to prevent misuse of non-final or sensitive documents.</li>
              <li><strong>Dynamic Text:</strong> Automatically insert page numbers, dates, and other information into your watermark.</li>
              <li><strong>Easy and Fast:</strong> The simple interface allows you to upload a file, enter your text, and get your watermarked PDF in seconds.</li>
              <li><strong>Secure Processing:</strong> Your files are always handled over a secure, encrypted connection and are deleted from our servers after processing to ensure your privacy.</li>
              <li><strong>Free to Use:</strong> Add watermarks to as many PDF files as you need, completely free of charge.</li>
            </ul>
            <p>Using a "PDF watermark tool" is a crucial step in professional document management. It adds a layer of security and context to your files, ensuring they are handled correctly by recipients. Our free "online watermark tool" is the perfect solution for anyone needing to quickly and reliably add text watermarks to their PDFs.</p>
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
