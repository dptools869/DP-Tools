
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
import Link from 'next/link';

export function PdfToPptxClient() {
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Presentation className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF to PowerPoint Converter</CardTitle>
              <CardDescription className="text-lg">
                Transform your PDFs into editable PowerPoint (PPTX) presentations.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
            <p>PowerPoint presentations are used everywhere—schools, offices, marketing teams, online training, and business meetings. But many important files come in PDF format, which is not editable. When you want to redesign slides, extract visuals, modify layouts, or reuse content, manually copy-pasting from PDF to PPT takes too much time.</p>
            <p>This is where PDF to PowerPoint conversion becomes extremely valuable.</p>
          </div>

          <Card>
            <CardHeader>
                <CardTitle>PDF to PowerPoint Converter</CardTitle>
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
            <h2>PDF to PowerPoint Conversion (2025 Guide): How to Convert PDF to PPT Easily, Accurately & Professionally</h2>
            <p>Whether you’re a student preparing class presentations, a business owner redesigning a pitch deck, or a marketer converting brochures into slides—this complete guide will show you how to convert PDF to PPT smoothly, accurately, and without losing quality.</p>
            <h3>What Is “PDF to PowerPoint Conversion”?</h3>
            <p>PDF to PowerPoint conversion is the process of turning a PDF file into an editable PPT or PPTX format. Once converted, you can freely edit text, change fonts, adjust colors, resize elements, add animations, insert new images or icons, and rearrange slides. PDFs are fixed-layout documents. PowerPoint is editable. Conversion bridges the gap and gives you full creative control.</p>
            <p>Most users prefer online PDF to PPT converters because they’re fast, secure, and require no installation. You upload the PDF → download the converted PPT → and start editing instantly.</p>
            
            <h3>Why Convert PDF to PPT? (Real Benefits)</h3>
            <ol>
                <li><strong>Convert Non-Editable PDFs into Editable Slides:</strong> PDFs often lock content. When converted, all elements become editable: text, headings, charts, icons, images, and shapes. Perfect for teachers, students, and professionals who often need to update PDF-based files.</li>
                <li><strong>Save Time & Manual Effort:</strong> Manually copying content from a PDF into PowerPoint can take hours. A converter does all the work in seconds, saving time for more important tasks.</li>
                <li><strong>Redesign Slides for Better Presentation Quality:</strong> You can modernize old PDFs by applying new slide templates, adding animations, improving colors, updating branding, and restructuring content. This is especially useful for marketing teams and business presentations.</li>
                <li><strong>Maintain High-Quality Formatting:</strong> Today’s best tools preserve layout, fonts, images, tables, charts, and color themes. This ensures your PowerPoint looks polished and professional without distortion.</li>
                <li><strong>Perfect for Presentations, Reports & Training Material:</strong> Many training modules, research papers, product guides, and business documents come as PDFs. Converting them into PowerPoint helps you display information clearly on slides.</li>
            </ol>

            <AdBanner type="top-banner" className="my-8"/>

            <h3>How to Convert PDF to PowerPoint (Step-by-Step Guide)</h3>
            <p>Here’s a beginner-friendly method using online conversion tools:</p>
            <ol>
                <li><strong>Open a PDF to PowerPoint Converter:</strong> Search for "PDF to PPT online free" and choose a trusted tool.</li>
                <li><strong>Upload Your PDF File:</strong> Click the "Upload" button → select your PDF → or drag & drop it.</li>
                <li><strong>Wait for Automatic Conversion:</strong> Most tools take 5–10 seconds depending on file size.</li>
                <li><strong>Download the PPTX File:</strong> You’ll receive an editable .pptx file ready to open in PowerPoint.</li>
            </ol>
            <p>That’s it — your PDF is now fully editable.</p>

            <h3>Best Tools for PDF to PPT Conversion (Trusted Options)</h3>
            <p>Here are reliable tools users search for regularly:</p>
            <ol>
                <li><strong>Adobe PDF to PowerPoint Converter:</strong> High accuracy but requires subscription.</li>
                <li><strong>Smallpdf PDF to PPT:</strong> Fast, simple, and great for beginners.</li>
                <li><strong>iLovePDF PDF to PowerPoint:</strong> Good for bulk conversion.</li>
                <li><strong>HiPDF PDF to PPTX Tool:</strong> Free option with OCR support.</li>
                <li><strong>PDF2Go’s PDF to PPT Converter:</strong> Works well with scanned PDFs.</li>
                <li><strong>DPToolsPro – <Link href="/tools/pdf/to-pptx">PDF to PowerPoint Converter</Link></strong></li>
            </ol>

            <h3>Tips for High-Quality PDF to PowerPoint Conversion</h3>
            <ul>
                <li><strong>Use a High-Resolution PDF:</strong> Blurry PDFs produce blurry slides.</li>
                <li><strong>Choose a Converter With OCR:</strong> OCR is needed for scanned PDFs, photo-based PDFs, and handwritten text. OCR converts images into editable text.</li>
                <li><strong>Check Formatting After Conversion:</strong> Sometimes spacing or alignment requires minor adjustments.</li>
                <li><strong>Save the Final File as PPTX:</strong> PPTX is lighter, modern, and supports more features.</li>
                <li><strong>Use Built-In PowerPoint Designer:</strong> PowerPoint Designer can instantly beautify old converted slides.</li>
            </ul>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <ul>
                <li><strong>Is PDF to PowerPoint conversion free?</strong> Yes. Many online tools offer free, high-quality conversion without software installation.</li>
                <li><strong>Will the formatting remain the same after conversion?</strong> Most modern converters preserve layout, fonts, images, and colors accurately.</li>
                <li><strong>Can I convert scanned PDFs to editable PowerPoint?</strong> Yes — but only with tools that support OCR technology.</li>
                <li><strong>Is it safe to convert PDF to PPT online?</strong> Trusted converters delete files automatically and use secure (HTTPS) encryption.</li>
                <li><strong>Which format is better — PPT or PPTX?</strong> PPTX is newer, lighter, and more compatible with the latest PowerPoint versions.</li>
            </ul>

            <h3>Conclusion</h3>
            <p>Converting PDF to PowerPoint is a simple yet powerful way to turn static documents into dynamic, editable presentations. With the right tool, you can convert files in seconds, preserve quality, and redesign slides with full freedom. Whether you're a student, professional, marketer, or business owner, PDF to PPT conversion helps you create clear, attractive, and polished presentations without manual work.</p>
            <p>To get started easily, try a reliable online converter or explore additional tools on DPToolsPro.com to manage, edit, and optimize your documents.</p>
            
            <hr/>
            <h3>About the Author — Piyush (Digital Piyush)</h3>
            <p>Piyush is a full-time developer & digital tools tester with 5+ years of hands-on experience in building, reviewing, and optimizing online productivity tools. He has tested 200+ converters, resizers, PDF utilities, and document automation apps for real-world performance. My goal is to simplify tech for everyday users through accurate, practical, and trusted guides.</p>
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
