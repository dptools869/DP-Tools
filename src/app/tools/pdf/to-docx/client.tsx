
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileText, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfToDocx, PdfToDocxOutput } from '@/ai/flows/pdf-to-docx';

export function PdfToDocxClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfToDocxOutput | null>(null);
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
          const result = await pdfToDocx({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your DOCX file is ready for download.',
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

  const downloadDocx = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.docxDataUri;
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
    <Card>
      <CardHeader>
          <CardTitle>PDF to Word Converter</CardTitle>
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
                'Convert to Word'
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
                       <Button onClick={downloadDocx} size="sm" className="bg-primary hover:bg-primary/90">
                          <Download className="mr-2 h-4 w-4" />
                          Download DOCX
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
  );
}
