
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
import AdBanner from '@/components/ad-banner';

export default function PdfToDocxPage() {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF to Word Converter</CardTitle>
              <CardDescription className="text-lg">
                Transform your PDFs into editable Word (DOCX) documents with ease.
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

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Unlock Your Documents: From PDF to Editable Word</h2>
            <p>The PDF format is excellent for sharing and preserving the layout of documents, but it falls short when you need to make edits. Our PDF to Word converter bridges this gap, transforming your static PDFs into fully editable DOCX files. This tool is designed for anyone who needs to reuse, update, or repurpose content locked within a PDF. Whether you're a student needing to quote a research paper, an administrator updating a form, or a professional modifying a report, our converter provides a fast, reliable, and high-fidelity solution. Keywords like "PDF to Word," "convert PDF to DOCX," and "free PDF converter" are at the heart of our service.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Our High-Fidelity Conversion Works</h2>
            <p>Our tool uses advanced Optical Character Recognition (OCR) and layout analysis to accurately reconstruct your PDF in an editable Word format. When you upload a PDF, our system meticulously analyzes text, images, tables, and formatting. It identifies paragraphs, columns, and headers, ensuring that the structure of your original document is preserved. The result is a well-formatted DOCX file that looks just like your PDF but is completely editable in Microsoft Word or other compatible word processors.</p>
            <ul>
              <li><strong>Layout Retention:</strong> Columns, headers, footers, and other formatting elements are accurately maintained.</li>
              <li><strong>Text Recognition:</strong> Even in scanned documents, our OCR technology extracts text with high accuracy.</li>
              <li><strong>Table and Image Extraction:</strong> Tables are converted into editable Word tables, and images are placed correctly within the document.</li>
            </ul>
            <h2>Why Convert PDF to Word?</h2>
            <p>The need to "edit a PDF" is a common challenge. Converting to Word opens up a world of possibilities:</p>
            <ul>
              <li><strong>Effortless Editing:</strong> Correct typos, update information, or rewrite entire sections without needing specialized PDF editing software.</li>
              <li><strong>Content Reuse:</strong> Easily copy and paste text, tables, and images into other documents or presentations.</li>
              <li><strong>Collaboration:</strong> Share the converted DOCX file with colleagues who can use Track Changes and commenting features in Microsoft Word.</li>
              <li><strong>Accessibility:</strong> Word documents can be more accessible for users with screen readers compared to some PDF files.</li>
            </ul>
            <p>Our free "online PDF to DOCX converter" is secure, fast, and easy to use. Simply upload your file, and let our powerful engine do the heavy lifting. Your documents are handled securely and deleted from our servers after conversion, respecting your privacy. Start unlocking the potential of your PDFs today!</p>
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
