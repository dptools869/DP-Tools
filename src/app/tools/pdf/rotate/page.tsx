
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Repeat, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { rotatePdf, RotatePdfOutput } from '@/ai/flows/rotate-pdf';
import AdBanner from '@/components/ad-banner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type RotationAngle = '90' | '180' | '270';

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<RotationAngle>('90');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<RotatePdfOutput | null>(null);
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
        description: 'Please select a PDF file to rotate.',
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
          const result = await rotatePdf({ 
            pdfDataUri: base64File, 
            fileName: file.name, 
            angle: angle
          });
          setProcessResult(result);
          toast({
            title: 'Rotation Successful',
            description: 'Your rotated PDF is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred during rotation. ${error instanceof Error ? error.message : ''}`,
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
    setAngle('90');
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
                <Repeat className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Rotate PDF</CardTitle>
              <CardDescription className="text-lg">
                Easily rotate the pages of your PDF documents.
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
                  
                  <div className="space-y-3">
                    <Label>Rotation Angle</Label>
                     <RadioGroup 
                        defaultValue="90" 
                        onValueChange={(value: string) => setAngle(value as RotationAngle)}
                        className="flex flex-col sm:flex-row gap-4"
                        disabled={isProcessing}
                    >
                        <Label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                            <RadioGroupItem value="90" id="r1" />
                            90° Clockwise
                        </Label>
                        <Label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                            <RadioGroupItem value="180" id="r2" />
                            180°
                        </Label>
                        <Label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                            <RadioGroupItem value="270" id="r3" />
                            270° Clockwise (90° Counter-clockwise)
                        </Label>
                    </RadioGroup>
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Rotating...
                      </>
                    ) : (
                      'Rotate PDF'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Rotation Successful!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{processResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Rotate Another
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after rotation.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Correct Your PDF Orientation</h2>
            <p>Our Rotate PDF tool makes it easy to fix the orientation of your PDF files. Whether you have a scanned document that's upside down or a report with pages in landscape instead of portrait, this tool allows you to rotate all pages by 90, 180, or 270 degrees. It's a simple, quick solution for ensuring your documents are easy to read and professionally presented.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF Rotation Work?</h2>
            <p>The process is straightforward. Upload your PDF file, select the desired angle of rotation, and our tool does the rest. It applies the rotation to every page in the document, creating a new, correctly oriented PDF file for you to download. This is particularly useful for scanned documents or files generated from other sources that may not have the correct orientation.</p>
            <h3>Key Benefits of Using Our Rotate PDF Tool</h3>
            <ul>
              <li><strong>Simple Rotation Options:</strong> Choose from 90°, 180°, or 270° rotations to fix any orientation issue.</li>
              <li><strong>Batch Rotation:</strong> The selected angle is applied to all pages in the document at once, saving you time.</li>
              <li><strong>Preserves Quality:</strong> The rotation process does not re-compress or degrade the quality of your original document.</li>
              <li><strong>Fast and Secure:</strong> Your files are processed quickly over an encrypted connection and are automatically deleted from our servers.</li>
              <li><strong>Free to Use:</strong> Correct the orientation of as many PDFs as you need, completely free of charge.</li>
            </ul>
            <p>Using a "PDF rotator" is a simple fix for a common problem. Ensure your documents are always presented correctly with our easy-to-use, free online tool.</p>
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
