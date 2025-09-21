
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Presentation, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfToPptx, PdfToPptxOutput } from '@/ai/flows/pdf-to-pptx';
import AdBanner from '@/components/ad-banner';

export default function PdfToPptxPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfToPptxOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setConversionResult(null); // Reset previous result
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
      setConversionResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a PDF file (.pdf).',
      });
    }
  };

  const convertFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a PDF file to convert.',
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
          const result = await pdfToPptx({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your PowerPoint file is ready for download.',
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

  const downloadPptx = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.pptxDataUri;
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
                <Presentation className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF to PowerPoint Converter</CardTitle>
              <CardDescription className="text-lg">
                Transform your PDFs into editable PowerPoint (PPTX) presentations.
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
                            {fileName || 'Drag & drop your PDF file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isConverting} />
                  </Label>
                   <Button onClick={convertFile} className="w-full text-lg py-6" size="lg" disabled={!file || isConverting}>
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      'Convert to PowerPoint'
                    )}
                  </Button>
                </div>
              )}

              {conversionResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Conversion Successful!</AlertTitle>
                    <AlertDescription>
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                        <p className="font-semibold text-center sm:text-left">
                          Your PowerPoint file <span className="font-bold">{conversionResult.fileName}</span> is ready.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button onClick={downloadPptx} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PPTX
                            </Button>
                            <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>
                                Convert Another
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
            <h2>Transform PDFs into Dynamic Presentations</h2>
            <p>Unlock the content from your static PDF files and convert them into fully editable PowerPoint (PPTX) presentations. Our PDF to PowerPoint converter is the perfect tool for students, educators, and business professionals who need to repurpose document content for slideshows. Whether you're creating a lecture from a research paper, a business proposal from a report, or a visual presentation from a brochure, this tool streamlines the process, saving you time and effort.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF to PPTX Conversion Work?</h2>
            <p>Our converter uses advanced technology to analyze the structure of your PDF. It identifies text, images, and layout elements on each page and intelligently reconstructs them as individual, editable slides in a PowerPoint presentation. The engine attempts to preserve the original formatting, fonts, and positioning as closely as possible, giving you a solid foundation to build upon. Each page of the PDF becomes a separate slide in the resulting PPTX file.</p>
            <h3>Key Benefits of Converting PDF to PowerPoint</h3>
            <ul>
              <li><strong>Editable Slides:</strong> Easily edit text, move images, and change the layout of your slides in Microsoft PowerPoint or other presentation software.</li>
              <li><strong>Content Repurposing:</strong> Quickly turn reports, articles, and other PDF documents into engaging visual presentations.</li>
              <li><strong>Preserves Visuals:</strong> Images and graphics from your PDF are embedded directly into the PowerPoint slides.</li>
              <li><strong>Fast and Secure:</strong> The conversion process is quick, and your files are protected with encryption before being automatically deleted from our servers.</li>
              <li><strong>Completely Free:</strong> Convert your PDFs to PPTX presentations without any cost or registration.</li>
            </ul>
            <p>Stop manually copying and pasting content from PDFs. With our "PDF to PPTX converter," you can efficiently transform your documents into presentation-ready slides, ready for you to customize and deliver. It's the ideal solution for anyone who needs to "convert PDF to editable presentation" quickly and easily.</p>
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
