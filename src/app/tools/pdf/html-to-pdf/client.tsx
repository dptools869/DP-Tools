
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
import Link from 'next/link';

export function HtmlToPdfClient() {
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
    if (droppedFile && droppedFile.type === 'text/html') {
      setFile(droppedFile);
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileType className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">HTML to PDF Converter</CardTitle>
              <CardDescription className="text-lg">
                Effortlessly convert your HTML files into professional, high-quality PDFs.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Convert HTML to PDF</CardTitle>
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
            <p>In today’s digital environment, we deal with web pages more than ever—articles, invoices, receipts, certificates, dashboards, reports, templates, and more. But web pages (HTML) cannot always be shared easily, especially when you need a clean, consistent, and printable format. That is where HTML to PDF conversion becomes useful.</p>
            <p>PDF files maintain their formatting, look professional on every device, and are perfect for sharing, archiving, and printing. Whether you are a student saving research material, a developer generating reports, a small business owner creating invoices, or a designer exporting layouts, learning how to convert HTML to PDF is extremely helpful.</p>
            <h2>HTML to PDF Conversion: The Complete, Simple & Practical Guide (2025 Updated)</h2>
            <p>This guide covers everything you need to know—including methods, tools, best practices, and common use cases—written in a clean, simple style that anyone can follow.</p>
            
            <h3>What Is HTML to PDF Conversion?</h3>
            <p>HTML (Hypertext Markup Language) is the language used to create websites. It includes text, images, links, CSS styling, JavaScript, and layout elements.</p>
            <p>PDF (Portable Document Format) is a universal document format that preserves structure, fonts, images, and design across all devices.</p>
            <p>HTML to PDF conversion means turning a webpage or HTML file into a downloadable PDF while maintaining: Layout, Images, Text, Styles, Formatting, and Fonts. People use it for saving articles, creating invoices, generating certificates, producing printable documents, backing up online content, and sharing pages in a consistent format. It is widely used in education, business, development, design, and content creation.</p>
            
            <h3>Why Convert HTML to PDF?</h3>
            <p>HTML to PDF is useful for multiple reasons, especially when you want clarity, security, or a professional appearance.</p>
            <ol>
                <li><strong>Consistent Formatting:</strong> PDF ensures your content looks identical on every screen—desktop, mobile, tablet, or print.</li>
                <li><strong>Professional Look & Feel:</strong> Businesses prefer PDFs for invoices, receipts, contracts, reports, and certificates because they appear polished and trustworthy.</li>
                <li><strong>Easier to Share:</strong> PDFs are simple to send through email, messaging apps, cloud storage, websites, and school portals. One file works everywhere.</li>
                <li><strong>Better Security:</strong> PDFs can be password-protected, watermarked, or encrypted, making them safer than raw HTML pages.</li>
                <li><strong>Offline Access:</strong> Once converted, the PDF can be opened without an internet connection.</li>
                <li><strong>Long-Term Archiving:</strong> PDFs maintain structure perfectly even years later—unlike websites that may change or go offline.</li>
            </ol>
            
            <h3>Best Ways to Convert HTML to PDF</h3>
            <p>There are several ways to convert HTML to PDF depending on your skills and needs. Below are the most reliable and widely used methods.</p>

            <h4>1. Online HTML to PDF Converters (Beginner Friendly)</h4>
            <p>This is the easiest and fastest method. Online converters allow you to upload an HTML file or paste a webpage link to get a PDF instantly. Benefits include being free, requiring no installation, working on any device, and converting full webpages. These tools are great for students, professionals, and casual users. You can try the DPToolsPro <Link href="/tools/pdf/html-to-pdf">HTML to PDF tool</Link> right here.</p>
            
            <h4>2. Desktop Software (For Professionals)</h4>
            <p>If you need more control, offline desktop tools like Adobe Acrobat Pro, PDFsam, or Foxit PDF Editor are more powerful. They offer page size control, margin customization, high-quality rendering, batch conversions, and better stability. They are ideal for designers, offices, legal work, and sensitive files.</p>
            
            <h4>3. Browser’s Built-In “Print to PDF” Feature</h4>
            <p>Most browsers today let you quickly export webpages as PDFs by pressing Ctrl + P and choosing "Save as PDF". This method works well for short pages, basic layouts, and articles, though some complex pages may lose styling.</p>

            <h4>4. Developer Tools (APIs, Libraries & Automation)</h4>
            <p>For developers or businesses needing automated PDF generation for invoices, receipts, or reports, solutions like Node.js libraries, Python converters, headless browsers (e.g., Puppeteer), and HTML to PDF APIs are popular.</p>
            
            <h3>Important Features to Look for in an HTML to PDF Tool</h3>
            <p>To ensure high-quality output, choose a tool with high rendering quality, mobile-responsive conversion, support for CSS & custom fonts, security features, fast processing, and batch conversion capabilities.</p>

            <h3>Common Uses of HTML to PDF Conversion</h3>
            <ul>
                <li>Saving webpages for offline use (e.g., research articles).</li>
                <li>Business document generation (invoices, reports).</li>
                <li>Web archiving for long-term record-keeping.</li>
                <li>Sharing printable versions of online content.</li>
                <li>Legal and professional workflows where editing must be prevented.</li>
            </ul>

            <h3>Expert Tips for Better PDF Compression</h3>
            <p>After converting, you might want to optimize your file size. You can use the <Link href="/tools/pdf/compress">Compress PDF tool</Link> on DPToolsPro. Other tips include removing unnecessary pages using a <Link href="/tools/pdf/split">Split PDF</Link> tool or combining documents with a <Link href="/tools/pdf/merge">Merge PDF</Link> tool.</p>

            <h3>FAQ (Human-Friendly)</h3>
            <ul>
                <li><strong>Is HTML to PDF conversion free?</strong> Yes, many online tools, including ours, offer free conversions.</li>
                <li><strong>Does the formatting stay the same after converting?</strong> Modern converters keep layout, fonts, and images intact.</li>
                <li><strong>Can I convert long webpages?</strong> Yes, most tools convert full-length pages.</li>
                <li><strong>Is it safe to use online tools?</strong> Reputable converters use secure connections and delete files automatically.</li>
                <li><strong>Can developers automate this?</strong> Yes. APIs and libraries allow automated HTML to PDF generation.</li>
            </ul>

            <h3>Conclusion</h3>
            <p>HTML to PDF conversion is one of the simplest yet most powerful ways to create professional, shareable, and secure documents from webpages. Whether you are saving research material, generating invoices, creating printable layouts, or automating a business workflow, the PDF format keeps your content organized and accessible.</p>
            <p>With online tools, desktop software, browser features, and developer libraries, converting HTML to PDF is now easier than ever. For beginners, online tools provide quick results. For professionals and developers, advanced converters offer full control and automation capabilities.</p>
            <p>Start using HTML to PDF tools to work faster, stay organized, and produce high-quality documents without any technical difficulty.</p>
            
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
