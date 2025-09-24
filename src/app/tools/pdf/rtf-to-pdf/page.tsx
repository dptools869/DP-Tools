
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileType, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rtfToPdf, RtfToPdfOutput } from '@/ai/flows/rtf-to-pdf';
import AdBanner from '@/components/ad-banner';

const acceptedMimeTypes = ['application/rtf', 'text/rtf'];
const acceptedExtensions = ['.rtf'];

export default function RtfToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<RtfToPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const isFileValid = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return acceptedMimeTypes.includes(file.type) || acceptedExtensions.includes(fileExtension);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (isFileValid(selectedFile)) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setConversionResult(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a Rich Text Format file (.rtf).',
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
    if (droppedFile && isFileValid(droppedFile)) {
      setFile(droppedFile);
      setConversionResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a Rich Text Format file (.rtf).',
      });
    }
  };
  
  const convertFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select an RTF file to convert.',
      });
      return;
    }

    setIsConverting(true);
    setConversionResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result as string;
        try {
          const result = await rtfToPdf({ rtfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your PDF file is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: `An error occurred during conversion. ${error instanceof Error ? error.message : ''}`,
          });
        } finally {
            setIsConverting(false);
        }
      };
      reader.onerror = (error) => {
        setIsConverting(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
          });
      }
    } catch (error) {
      setIsConverting(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An unexpected error occurred. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };
  
  const downloadPdf = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.pdfDataUri;
      link.download = conversionResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setIsConverting(false);
    setConversionResult(null);
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
                <FileType className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">RTF to PDF Converter</CardTitle>
              <CardDescription className="text-lg">
                Easily convert your Rich Text Format (.rtf) files to professional PDF documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!conversionResult && (
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
                            {fileName || 'Drag & drop your RTF file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".rtf,application/rtf,text/rtf" disabled={isConverting} />
                  </Label>
                   <Button onClick={convertFile} className="w-full text-lg py-6" size="lg" disabled={!file || isConverting}>
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      'Convert to PDF'
                    )}
                  </Button>
                </div>
              )}

              {conversionResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Conversion Successful!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{conversionResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline">
                                Convert Another File
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
            <h2 id="about-tool">Convert RTF to PDF with Ease</h2>
            <p>Our RTF to PDF converter provides a simple and reliable way to turn your Rich Text Format files into universal PDF documents. PDF is the standard for sharing formatted documents because it preserves layout, fonts, and images across all devices. Whether you need to archive old documents, share a file with someone who doesn't have a compatible word processor, or ensure your formatting is locked in, this tool is the perfect solution.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does RTF to PDF Conversion Work?</h2>
            <p>The process is straightforward. When you upload your RTF document, our system uses an advanced conversion engine to meticulously replicate your file's content into a high-quality PDF. The layout, fonts, images, and other rich text features are preserved, ensuring your PDF looks just like the original RTF. We prioritize your privacy; all files are handled securely over an encrypted connection and are automatically deleted from our servers after processing.</p>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>High-Fidelity Conversion:</strong> Retains the original layout, fonts, and images of your RTF document.</li>
              <li><strong>Universal Compatibility:</strong> Create PDFs that can be opened on any device or operating system, regardless of what software they have installed.</li>
              <li><strong>User-Friendly Interface:</strong> Simply drag and drop your file to begin the conversion process instantly.</li>
              <li><strong>Secure and Private:</strong> Your files are processed securely and are never stored on our servers.</li>
              <li><strong>Completely Free:</strong> Convert as many RTF documents to PDF as you need, at no cost.</li>
            </ul>
            <p>Make your documents universally accessible and professional by converting them to PDF. Experience the simplicity and quality of our free online conversion tool today!</p>
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
