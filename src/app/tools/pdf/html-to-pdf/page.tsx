
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileType, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { htmlToPdf, HtmlToPdfOutput } from '@/ai/flows/html-to-pdf';
import AdBanner from '@/components/ad-banner';

export default function HtmlToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<HtmlToPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/html') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setConversionResult(null); // Reset previous result
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an HTML file (.html).',
        });
        event.target.value = ''; // Reset file input
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'text/html') {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setConversionResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop an HTML file (.html).',
      });
    }
  };
  
  const convertFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select an HTML file to convert.',
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
          const result = await htmlToPdf({ htmlDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your PDF is ready for download.',
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
              <CardTitle className="text-3xl font-headline">HTML to PDF Converter</CardTitle>
              <CardDescription className="text-lg">
                Effortlessly convert your HTML files into professional, high-quality PDFs.
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
                            {fileName || 'Drag & drop your HTML file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".html" disabled={isConverting} />
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
                       Your file <span className="font-semibold">{conversionResult.fileName}</span> is ready.
                        <div className="flex gap-2">
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
            <h2 id="about-tool">Mastering HTML to PDF Conversion</h2>
            <p>In the digital age, the ability to transform content from one format to another is not just a convenience—it's a necessity. Our HTML to PDF converter stands at the forefront of this transformation, offering a seamless, powerful, and free solution to convert your web documents into universally accessible PDF files. This tool is meticulously engineered for developers, content creators, and business professionals who demand precision, quality, and efficiency in their document management workflows. Whether you're archiving web pages, creating reports from dynamic data, or preparing documents for printing, our tool ensures your content retains its structure, style, and integrity.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does the HTML to PDF Converter Work?</h2>
            <p>Our converter leverages advanced rendering engines to accurately interpret and translate HTML and CSS into a PDF format. The process is designed to be intuitive and straightforward. When you upload an HTML file, our system processes the markup, styles, and scripts to replicate the visual representation of the web page. This includes preserving layouts, fonts, images, and links. The core of this technology lies in a virtual browser environment that "prints" the webpage to a PDF file, much like a physical printer would, but with digital precision. This ensures that what you see in your browser is what you get in your PDF. We prioritize security and privacy; your uploaded files are encrypted during transit and automatically deleted from our servers after a short period, guaranteeing your data remains confidential.</p>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>High-Fidelity Conversion:</strong> Retain the exact look and feel of your original HTML document. Our tool accurately processes complex CSS, JavaScript, and various web fonts to produce pixel-perfect PDFs.</li>
              <li><strong>SEO-Friendly Content Preservation:</strong> When you convert articles or web content, all text remains searchable and selectable within the PDF, which is crucial for accessibility and content indexing. Keywords like "HTML to PDF," "convert web page to PDF," and "free online PDF converter" are embedded naturally in the content's context.</li>
              <li><strong>User-Friendly Interface:</strong> With a simple drag-and-drop mechanism, converting a file takes only a few clicks. No complex settings or configurations are required, making it accessible for everyone.</li>
              <li><strong>Secure and Private:</strong> We understand the importance of data security. All connections are secured with SSL encryption, and your files are never shared or stored long-term.</li>
              <li><strong>Completely Free:</strong> DP Tools is committed to providing powerful utilities at no cost. This HTML to PDF converter is free for unlimited use, without watermarks or hidden fees.</li>
            </ul>
            <h2 id="use-cases">Practical Use-Cases for HTML to PDF</h2>
            <p>The applications of this tool are vast. Businesses can generate professional invoices, reports, and documentation from their web applications. For example, an e-commerce site can generate a PDF receipt from an HTML order confirmation page. Legal professionals can archive web pages as evidence, with the PDF format providing a stable, timestamped snapshot. Educators and students can save online articles, research papers, and tutorials for offline reading and annotation. By providing a reliable "web to PDF" conversion, we empower users to capture, share, and preserve digital information in a format that is both portable and professional. This process is essential for maintaining a consistent "document workflow" in any organization that values digital record-keeping and efficient "content management."</p>
            <p>In essence, the DP Tools HTML to PDF converter is more than just a utility; it's a bridge between the dynamic web and the static, reliable world of PDF documents. It's an indispensable asset for anyone looking to streamline their digital life, enhance productivity, and ensure their content is presented professionally across all platforms. Experience the power of seamless conversion and unlock the full potential of your web documents today.</p>
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
