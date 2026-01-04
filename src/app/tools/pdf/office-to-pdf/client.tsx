
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileType, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { officeToPdf, OfficeToPdfOutput } from '@/ai/flows/office-to-pdf';
import AdBanner from '@/components/ad-banner';
import Link from 'next/link';

const acceptedExtensions = [
    '.docx', '.doc', '.dot', '.dotx', '.wpd', '.rtf', '.log', 
    '.potx', '.pps', '.ppsx', '.ppt', '.pptx', 
    '.csv', '.xls', '.xlsb', '.xlsx', '.xltx'
];

export function OfficeToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<OfficeToPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const isFileValid = (file: File) => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return acceptedExtensions.includes(fileExtension);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (isFileValid(selectedFile)) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setConversionResult(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a supported Office document.',
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
    if (droppedFile && isFileValid(droppedFile)) {
      setFile(droppedFile);
      setConversionResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a supported Office document.',
      });
    }
  };
  
  const convertFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select an Office file to convert.',
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
          const result = await officeToPdf({ fileDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: 'Your PDF file is ready for download.',
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileType className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Office to PDF Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert Word, PowerPoint, Excel, and other Office documents to PDF.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="md:hidden">
                <CardTitle>Office to PDF Converter</CardTitle>
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
                            {fileName || 'Drag & drop your Office file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={acceptedExtensions.join(',')} disabled={isConverting} />
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
               <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
                    <p>In today’s digital world, converting office documents to PDF is a must-have skill for students, professionals, freelancers, and businesses. Whether you're preparing official reports, sharing resumes, sending spreadsheets, or submitting assignments, PDFs ensure that your formatting stays clean and consistent on every device.</p>
                    <p>If you’ve ever wondered how to save a Word file as PDF, how to convert Excel to PDF, or how to download Google Docs as PDF, this guide will teach you everything — step-by-step, with best practices and helpful tips.</p>
                    <h2>The Ultimate Guide to Converting Office Files to PDF (Microsoft & Google Methods Explained)</h2>
                    <p>This guide explains everything you need to know about converting office documents to PDF—including why it matters, step-by-step instructions for Microsoft Office and Google Workspace, and advanced tips for the best results.</p>
                    <h3>Why Convert Office Documents to PDF?</h3>
                    <ul>
                        <li><strong>Preserves Formatting:</strong> Your fonts, spacing, images, and layout stay exactly the same.</li>
                        <li><strong>Prevents Unwanted Editing:</strong> PDFs are read-only by default, ideal for final versions.</li>
                        <li><strong>Universal Compatibility:</strong> Works on all devices and operating systems.</li>
                        <li><strong>Smaller File Size:</strong> Can be easily compressed for emails and web uploads.</li>
                        <li><strong>Professional & Clean:</strong> The standard for business, academic, and legal documents.</li>
                    </ul>

                    <AdBanner type="top-banner" className="my-8"/>

                    <h2>Converting Microsoft Office Files to PDF</h2>
                    <p>Microsoft Word, Excel, and PowerPoint have built-in features for easy PDF export.</p>
                    <h3>1. Convert Word to PDF</h3>
                    <p>Use <strong>File → Export → Create PDF/XPS</strong> for the best results, as it preserves hyperlinks and advanced formatting better than "Save As."</p>
                    <h3>2. Convert Excel to PDF</h3>
                    <p>Go to <strong>File → Save As → PDF</strong>, but click <strong>Options</strong> first to define the print area (e.g., "Active sheet(s)" or "Entire workbook") to avoid cutting off tables.</p>
                    <h3>3. Convert PowerPoint to PDF</h3>
                    <p>Use <strong>File → Save As → PDF</strong>. Use the <strong>Options</strong> button to export specific slides, notes pages, or handouts.</p>

                    <h2>Google Workspace (Docs, Sheets, Slides) to PDF</h2>
                    <p>Google's suite makes it incredibly simple.</p>
                    <p>In Google Docs, Sheets, or Slides, just go to <strong>File → Download → PDF Document (.pdf)</strong>. Google Sheets provides extra customization options for page size, orientation, and margins before exporting.</p>

                    <h2>When to Use Professional PDF Tools</h2>
                    <p>While built-in options are great for simple conversions, online tools like DPToolsPro offer more power when you need to:</p>
                    <ul>
                        <li><Link href="/tools/pdf/merge">Merge multiple PDFs</Link></li>
                        <li><Link href="/tools/pdf/split">Split a PDF into pages</Link></li>
                        <li><Link href="/tools/pdf/compress">Compress PDF for email</Link></li>
                        <li><Link href="/tools/pdf/to-docx">Convert PDF back to Word</Link></li>
                        <li><Link href="/tools/pdf/protect">Protect PDF with a password</Link></li>
                        <li>Batch convert many files at once</li>
                    </ul>

                    <h3>Common Mistakes to Avoid</h3>
                    <ul>
                        <li><strong>Forgetting to check page breaks in Excel:</strong> Can lead to cut-off tables.</li>
                        <li><strong>Not embedding fonts:</strong> Custom fonts may not display correctly on other devices.</li>
                        <li><strong>Using "Print to PDF" for complex layouts:</strong> Can sometimes break styling; "Export" is often better.</li>
                    </ul>

                    <h3>Conclusion</h3>
                    <p>Converting Office documents to PDF is an essential skill. With built-in options and powerful online tools, you can manage, share, and archive your documents professionally and efficiently. For fast, reliable conversions and advanced features, platforms like DPToolsPro.com make the process seamless.</p>

                    <hr/>
                    <h3>About the Author — Piyush (Digital Piyush)</h3>
                    <p>Piyush is a full-stack developer and digital tools specialist with 5+ years of experience testing, reviewing, and building document-conversion tools and productivity apps. He has hands-on knowledge of PDF workflows, Office file formats, cloud tools, and performance optimization. Through DPToolsPro, he helps users convert, manage, and secure documents with simple, reliable web-based tools.</p>
                </article>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

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

    