
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileText, Loader2, Download, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfToText, PdfToTextOutput } from '@/ai/flows/pdf-to-text';
import AdBanner from '@/components/ad-banner';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function PdfToTextClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfToTextOutput | null>(null);
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
          const result = await pdfToText({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Text has been extracted from your PDF.',
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

  const downloadText = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.textDataUri;
      link.download = conversionResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = () => {
    if (conversionResult) {
      navigator.clipboard.writeText(conversionResult.textContent);
      toast({
        title: 'Copied to Clipboard',
        description: 'The extracted text has been copied.',
      });
    }
  }

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
              <CardTitle className="text-3xl font-headline">PDF to Text Converter</CardTitle>
              <CardDescription className="text-lg">
                Extract all the text content from your PDF into a plain text format.
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
                      'Extract Text'
                    )}
                  </Button>
                </div>
              )}

              {conversionResult && (
                 <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                        <FileCheck className="h-5 w-5 text-current" />
                        <AlertTitle className="font-bold">Extraction Complete!</AlertTitle>
                        <AlertDescription>
                            Your text is ready below. You can copy it or download it as a .txt file.
                        </AlertDescription>
                    </Alert>
                    <Textarea
                        readOnly
                        value={conversionResult.textContent}
                        className="h-64 resize-y"
                        placeholder="Extracted text will appear here..."
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={copyToClipboard} size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                        </Button>
                        <Button onClick={downloadText} size="sm" variant="secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Download .txt
                        </Button>
                        <Button onClick={resetTool} size="sm" variant="outline" className="sm:ml-auto">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Convert Another
                        </Button>
                    </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Unlock Your Content: PDF to Text Conversion</h2>
            <p>Free your content from the confines of the PDF format. Our PDF to Text converter is a simple yet powerful tool that extracts all readable text from your PDF files and presents it in a clean, plain text format. This is incredibly useful for repurposing content, data analysis, or simply making the text from a PDF easily accessible for reading and editing. By converting a "PDF to text," you strip away all formatting and get straight to the valuable information within.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF to Text Extraction Work?</h2>
            <p>Our tool uses an advanced parsing engine to read the text layer of your PDF document. It systematically goes through the file, identifies all text-based content, and extracts it while ignoring images and complex formatting. If the PDF is a scanned document without a text layer, our integrated OCR (Optical Character Recognition) technology will automatically activate to recognize the characters in the image and convert them into machine-readable text.</p>
            <h3>Key Benefits of Using Our PDF to Text Tool</h3>
            <ul>
              <li><strong>Pure Content Extraction:</strong> Get a clean, unformatted plain text version of your document's content.</li>
              <li><strong>Easy to Copy and Edit:</strong> The extracted text can be easily copied and pasted into any word processor, code editor, or other application.</li>
              <li><strong>Data Analysis:</strong> Plain text is the perfect format for feeding into data analysis pipelines or natural language processing applications.</li>
              <li><strong>OCR for Scanned PDFs:</strong> Even image-based PDFs can be processed, making this a versatile "PDF text extractor."</li>
              <li><strong>Secure and Private:</strong> Your files are uploaded over a secure connection and are permanently deleted from our servers after processing.</li>
            </ul>
             <h3>Tips to Get the Best Results with PDF to Text Conversion</h3>
            <p>To improve accuracy:</p>
            <ul>
                <li>✔ Use high-quality PDFs without blur</li>
                <li>✔ Prefer grayscale instead of pure black-white scans</li>
                <li>✔ Select the correct OCR language</li>
                <li>✔ Avoid tilted pages or dark photos</li>
                <li>✔ Make sure the text in the PDF is readable</li>
            </ul>
            <p>Better input = better OCR output.</p>
            
            <h3>Related Tools:</h3>
             <ul>
              <li><Link href="/tools/pdf/ocr">PDF OCR Tool</Link></li>
              <li><Link href="/tools/pdf/to-docx">PDF to Word Converter</Link></li>
              <li><Link href="/tools/pdf/merge">Merge PDF</Link></li>
              <li><Link href="/tools/pdf/split">Split PDF</Link></li>
              <li><Link href="/tools/pdf/compress">Compress PDF</Link></li>
            </ul>
            <h2>Frequently Asked Questions (FAQ)</h2>
            <ol>
                <li><strong>Is PDF to Text conversion free?</strong><br/>Yes. Many online tools allow free PDF-to-text conversion.</li>
                <li><strong>Will formatting be preserved?</strong><br/>Plain text output removes formatting but keeps all the written content.</li>
                <li><strong>Can scanned PDFs be converted to text?</strong><br/>Yes. Use a tool that supports OCR for scanned PDF files.</li>
                <li><strong>Is it safe to convert PDFs online?</strong><br/>Trusted tools secure your uploads and automatically delete files after conversion.</li>
                <li><strong>Can I turn a PDF into Word after extracting text?</strong><br/>Yes — first extract text, then save it to Word or use a <Link href="/tools/pdf/to-docx">PDF to Word converter</Link>.</li>
            </ol>
            <p>Using a "free PDF to text converter" is the fastest way to get the raw content out of a PDF. Whether you're a researcher, a data scientist, or just someone who needs to grab some text from a PDF quickly, our tool provides a fast, free, and secure solution.</p>

            <hr />
            <h3>About the Author – Piyush (DigitalPiyush)</h3>
            <p>I am a developer and productivity tool researcher with 5+ years of hands-on experience testing PDF tools, OCR engines, AI document analyzers, and file converters. My articles are based on real usage and practical results — not theory. I share only reliable, easy-to-use, and privacy-safe solutions for students, professionals, and businesses.</p>
            <h2>Final Summary</h2>
            <p>Converting PDF to text is the easiest way to extract content from PDF files without manually retyping. Whether your PDF is digital or scanned, an online PDF to text converter can help you extract readable, editable, and searchable text instantly. It’s fast, free, and works on any device — ideal for students, researchers, office workers, and professionals who work with documents daily.</p>
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
