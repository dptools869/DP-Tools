
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileType, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfToHtml, PdfToHtmlOutput } from '@/ai/flows/pdf-to-html';
import AdBanner from '@/components/ad-banner';
import Link from 'next/link';

export function PdfToHtmlClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfToHtmlOutput | null>(null);
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
          const result = await pdfToHtml({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your HTML file is ready for download.',
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

  const downloadHtml = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.htmlDataUri;
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
            <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <FileType className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-headline">PDF to HTML Converter</CardTitle>
                    <CardDescription className="text-lg">
                        Transform your PDFs into web-ready HTML documents.
                    </CardDescription>
                </CardHeader>
            </Card>
          
          <Card>
            <CardHeader className="md:hidden">
                <CardTitle>PDF to HTML Converter</CardTitle>
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
                      'Convert to HTML'
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
                             <Button onClick={downloadHtml} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download HTML
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
            <div className="text-center mb-12">
                <p>PDF files are widely used for sharing documents, but sometimes you need the flexibility and SEO advantages of HTML. Whether you are a content creator, developer, student, marketer, or business owner, converting a PDF into clean HTML unlocks new possibilities—better editing, better search visibility, and better user experience on the web.</p>
            </div>
            <h2>PDF to HTML Conversion: The Complete, SEO-Friendly, Beginner-Safe Guide (2025 Updated)</h2>
            <p>This guide explains everything you need to know about PDF to HTML conversion—including how it works, tools you can use, SEO benefits, best practices, practical examples, and expert insights.</p>
            
            <h3>What Is PDF to HTML Conversion?</h3>
            <p>PDF to HTML conversion is the process of turning a PDF document into an editable webpage (.html). A good converter extracts text, headings, images, tables, links, structure, and formatting, and outputs clean, web-ready HTML code. This is useful for publishing content online, making documents responsive, or reusing PDF data.</p>
            
            <h3>Why Convert PDF to HTML? (Real-World Reasons)</h3>
            <ol>
                <li><strong>HTML Is Easier to Edit:</strong> HTML allows updates anytime using any editor—WordPress, Notepad, VSCode, or any CMS.</li>
                <li><strong>SEO Advantage:</strong> Google can crawl & index HTML far better than PDFs, improving ranking, visibility, and traffic.</li>
                <li><strong>Faster Loading & Better UX:</strong> HTML pages load faster than large PDFs, especially on mobile.</li>
                <li><strong>Responsive & Mobile-Friendly:</strong> PDFs are static. HTML adapts to all devices automatically.</li>
                <li><strong>Content Reuse Made Easy:</strong> Convert PDF to HTML to repurpose into blog content, landing pages, documentation, product pages, tutorials, or newsletters.</li>
                <li><strong>Better Social Sharing:</strong> HTML pages display previews on WhatsApp, Facebook, LinkedIn, etc. PDFs do not.</li>
            </ol>
            
            <h3>Best Ways to Convert PDF to HTML (2025)</h3>
            <h4>1. Online PDF to HTML Converters (Fast & Free)</h4>
            <p>Perfect for everyday users, beginners, students, and bloggers. Benefits include being free, requiring no installation, working on any device, and converting images, tables, text, and links.</p>
            
            <h4>2. Desktop Software (For Professionals)</h4>
            <p>Ideal when you need accurate layout preservation, batch conversion, offline processing, OCR for scanned PDFs, and high-quality HTML output. Examples include Adobe Acrobat, PDFelement, and PDF Converter Pro.</p>
            
            <h4>3. Browser Print Tools (Quick but Limited)</h4>
            <p>Most browsers allow: CTRL + P → Save as HTML / Save as PDF workaround. Good for simple text PDFs but not reliable for complex formatting.</p>

            <h4>4. Developer APIs (For Automation)</h4>
            <p>If you run a SaaS, website, or automated system, APIs allow programmatic PDF to HTML conversion. Used by developers for auto-generating HTML documents, converting reports, extracting PDF content, and dynamic documentation.</p>

            <AdBanner type="top-banner" className="my-8"/>

            <h3>Features to Look for in a Good PDF to HTML Converter</h3>
            <p>A reliable converter should provide: clean HTML output, support for scanned PDFs (OCR), proper table extraction, accurate image placement, mobile-friendly output, batch conversion, and retained formatting.</p>
            
            <h3>Common Uses of PDF to HTML Conversion</h3>
            <ul>
                <li>Turn PDFs into Webpages for tutorials, articles, guides, educational content, and manuals.</li>
                <li>Extract Text & Images Easily for assignments, reports, and graphics.</li>
                <li>Republish PDFs for SEO, as HTML gives better ranking potential.</li>
                <li>Create Mobile-Friendly Documents.</li>
                <li>Build Documentation & Help Centers.</li>
                <li>Develop Online Courses & E-Learning Platforms.</li>
            </ul>
            
            <h3>How to Convert PDF to HTML Online (Step-by-Step)</h3>
            <ol>
                <li>Open a trusted PDF to HTML converter.</li>
                <li>Upload your PDF file.</li>
                <li>Wait while the system extracts text, images, and formatting.</li>
                <li>Download your generated HTML file.</li>
                <li>Edit using any HTML editor or upload to your website.</li>
                <li>Publish or integrate the content as needed.</li>
            </ol>
            
            <h3>Best Practices for High-Quality PDF to HTML Conversion</h3>
            <ol>
                <li><strong>Clean Your PDF First:</strong> Remove unnecessary images, duplicate pages, blank spaces, and unwanted objects.</li>
                <li><strong>Use Standard Fonts:</strong> Google-safe fonts improve compatibility.</li>
                <li><strong>Compress Large Images:</strong> Reduces file size while keeping quality. Consider using an <a href="/tools/image/compress">Image Compressor</a>.</li>
                <li><strong>Keep Layout Simple:</strong> Avoid overly complex PDF designs.</li>
                <li><strong>Use OCR for Scanned PDFs:</strong> Necessary if the PDF is image-based. Our <a href="/tools/pdf/ocr">PDF OCR tool</a> can help.</li>
                <li><strong>Check Responsiveness:</strong> Make sure the final HTML looks good on mobile.</li>
                <li><strong>Review Code Before Publishing:</strong> Remove inline styles or add CSS classes for a cleaner structure.</li>
            </ol>
            
            <h3>SEO Benefits of PDF to HTML Conversion</h3>
            <p>PDF to HTML conversion boosts SEO in multiple ways: HTML pages rank better, Google can crawl text, headings, and links, improved user experience, better Core Web Vitals, faster page load speed, better keyword optimization, structured data support, and higher click-through rate (CTR). This makes it extremely powerful for bloggers, businesses, and digital marketers.</p>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <ul>
                <li><strong>Is PDF to HTML conversion free?</strong> Yes. Many online tools, including ours, allow completely free conversion.</li>
                <li><strong>Does the formatting stay the same after converting?</strong> High-quality converters preserve layout, text, tables, and images.</li>
                <li><strong>Can I convert scanned PDFs?</strong> Yes, but only if the tool supports OCR.</li>
                <li><strong>Is online conversion safe?</strong> Trusted websites delete your files automatically and use encryption.</li>
                <li><strong>Can PDF to HTML help SEO?</strong> Absolutely. HTML pages are fully indexable.</li>
                <li><strong>Can I edit the HTML after converting?</strong> Yes, HTML can be edited using any code editor or CMS.</li>
            </ul>
            
            <h3>Conclusion</h3>
            <p>PDF to HTML conversion is more than a simple file transformation—it is a fast and effective way to repurpose content, improve website SEO, make documents mobile-friendly, and enable easy editing. Whether you are a student converting study materials, a business republishing reports, a developer building automated systems, a blogger turning PDFs into web content, or a designer extracting images, a reliable PDF to HTML converter simplifies your workflow and saves hours of manual work. With online tools, desktop software, and API options, converting PDFs has never been easier. Start optimizing your content today and transform your PDFs into clean, responsive HTML that works everywhere.</p>
            
            <hr/>
            
            <h3>About the Author — Piyush (Digital Piyush)</h3>
            <p>Piyush is a web tools developer, UI/UX researcher, and expert tester with 5+ years of hands-on experience analyzing digital tools, online converters, and productivity platforms. He has completed hundreds of user-testing sessions for global brands and specializes in building simple, accurate, and user-friendly online utilities for creators, students, and professionals. At DPToolsPro.com, he focuses on creating high-quality, secure, and fast tools that solve real problems with zero complexity.</p>
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
