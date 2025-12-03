
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, ScanText, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfOcr, PdfOcrOutput } from '@/ai/flows/pdf-ocr';
import AdBanner from '@/components/ad-banner';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'PDF OCR Tool Online – Convert Scanned PDFs to Text or Word Easily',
    description: 'Use the best PDF OCR tool to extract text from scanned PDFs instantly. Convert PDF OCR to text, Word, or searchable PDF online for free.',
    keywords: [
        'PDF OCR',
        'PDF OCR Tool',
        'OCR a PDF',
        'PDF OCR to text',
        'PDF OCR to Word',
        'PDF OCR conversion',
        'PDF OCR to PDF',
        'OCR scanned PDF online free',
        'convert PDF OCR easily',
        'PDF OCR without software',
        'extract text from scanned PDF',
        'best free PDF OCR converter 2025'
    ]
};


export default function PdfOcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfOcrOutput | null>(null);
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
        description: 'Please select a PDF file to process.',
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
          const result = await pdfOcr({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'OCR Successful',
            description: 'Your PDF is now searchable.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'OCR Failed',
            description: `An error occurred during processing. ${error instanceof Error ? error.message : ''}`,
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
                <ScanText className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF OCR Tool Online – Convert Scanned PDFs to Text or Word Easily</CardTitle>
              <CardDescription className="text-lg">
                Use the best PDF OCR tool to extract text from scanned PDFs instantly. Convert PDF OCR to text, Word, or searchable PDF online for free.
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
                        Processing...
                      </>
                    ) : (
                      'Make PDF Searchable'
                    )}
                  </Button>
                </div>
              )}

              {conversionResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Process Complete!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{conversionResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Process Another File
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
            <h2>Unlock Your Scans: The Power of PDF OCR</h2>
            <p>Ever had a scanned document or an image-based PDF that you couldn't search or copy text from? Our PDF OCR (Optical Character Recognition) tool is the solution. It transforms your non-searchable PDFs into fully searchable archives, making your information accessible and easy to manage. This technology is crucial for digitizing paper records, archiving invoices, or making academic papers and e-books fully searchable. Keywords like "PDF OCR," "searchable PDF," and "extract text from PDF" are at the core of what this tool provides.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does Optical Character Recognition (OCR) Work?</h2>
            <p>When you upload a scanned PDF, our OCR engine analyzes the images of text on each page. It identifies letters, numbers, and symbols, and then creates an invisible text layer that sits behind the original image. This means the visual appearance of your document remains exactly the same, but now you can select text, copy it, and use search functions (like Ctrl+F or Cmd+F) to find words or phrases within the file. The process is highly accurate, supporting a wide range of fonts and languages. Even handwritten notes can be converted if scanning quality is good.</p>
            <h3>Key Benefits of Using Our PDF OCR Tool</h3>
            <ul>
              <li><strong>Make PDFs Searchable:</strong> Instantly find information in large documents without having to read through every page.</li>
              <li><strong>Enable Text Copying:</strong> Easily copy and paste text from your scanned PDFs into other applications like Microsoft Word, emails, or notes.</li>
              <li><strong>Improve Accessibility:</strong> Searchable PDFs are more accessible to users with visual impairments who rely on screen reader technology.</li>
              <li><strong>Preserve Original Layout:</strong> The OCR process adds a text layer without altering the original look and feel of your document.</li>
              <li><strong>Secure and Private:</strong> Your files are uploaded over a secure connection and are automatically deleted from our servers after processing.</li>
            </ul>
            <h3>Related Tools:</h3>
            <ul>
              <li><Link href="/tools/pdf/to-word">PDF to Word Converter</Link></li>
              <li><Link href="/tools/pdf/to-text">PDF to Text Converter</Link></li>
              <li><Link href="/tools/pdf/merge">Merge PDF</Link></li>
              <li><Link href="/tools/pdf/compress">Compress PDF</Link></li>
              <li><Link href="/tools/pdf/split">Split PDF</Link></li>
            </ul>
            <h2>Why OCR is Essential for Modern Document Management</h2>
            <p>In today's digital workflow, having searchable documents is not a luxury—it's a necessity. It saves countless hours that would otherwise be spent manually sifting through files. Legal professionals can quickly find case details, researchers can locate specific data points in academic papers, and businesses can efficiently archive and retrieve invoices and reports. By using a reliable "PDF OCR online" tool, you are not just converting a file; you are upgrading your entire document management process, making it faster, more efficient, and more productive.</p>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <ol>
                <li><strong>What is the purpose of PDF OCR?</strong><br/>OCR converts scanned PDF files into editable text so you can copy, edit, or search the content.</li>
                <li><strong>Is PDF OCR free?</strong><br/>Yes — many online tools allow free PDF OCR conversion without installation.</li>
                <li><strong>What file formats can OCR export to?</strong><br/>TXT, searchable PDF, Word (DOCX), and sometimes Excel.</li>
                <li><strong>Does OCR work on handwritten PDFs?</strong><br/>Yes — if the handwriting is clean and properly scanned.</li>
                <li><strong>Can PDF OCR be used on mobile?</strong><br/>Yes — online OCR tools work on mobile browsers without apps.</li>
            </ol>

            <hr/>
            <h3>About the Author – Piyush (DigitalPiyush)</h3>
            <p>I am a developer and productivity tool researcher with 5+ years of hands-on experience testing PDF tools, OCR engines, AI document analyzers, and file converters. My articles are based on real usage and practical results — not theory. I share only reliable, easy-to-use, and privacy-safe solutions for students, professionals, and businesses.</p>
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
