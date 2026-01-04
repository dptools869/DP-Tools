
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Shrink, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { compressPdf, CompressPdfOutput } from '@/ai/flows/compress-pdf';
import AdBanner from '@/components/ad-banner';
import Link from 'next/link';

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setCompressionResult(null); // Reset previous result
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
      setCompressionResult(null);
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
        description: 'Please select a PDF file to compress.',
      });
      return;
    }

    setIsCompressing(true);
    setCompressionResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result as string;
        try {
          const result = await compressPdf({ pdfDataUri: base64File, fileName: file.name });
          setCompressionResult(result);
          toast({
            title: 'Compression Successful',
            description: 'Your PDF has been compressed.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: `An error occurred during compression. ${error instanceof Error ? error.message : ''}`,
          });
        } finally {
            setIsCompressing(false);
        }
      };
      reader.onerror = (error) => {
        setIsCompressing(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
          });
      }
    } catch (error) {
      setIsCompressing(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An unexpected error occurred. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };
  
  const downloadPdf = () => {
    if (compressionResult) {
      const link = document.createElement('a');
      link.href = compressionResult.pdfDataUri;
      link.download = compressionResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setIsCompressing(false);
    setCompressionResult(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const getCompressionPercentage = () => {
    if (!compressionResult) return 0;
    const { originalSize, compressedSize } = compressionResult;
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Shrink className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Compress PDF Tool</CardTitle>
              <CardDescription className="text-lg max-w-3xl mx-auto">
                Reduce the file size of your PDF files while optimizing for quality.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="md:hidden">
              <CardTitle>Compress PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!compressionResult && (
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
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isCompressing} />
                  </Label>
                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || isCompressing}>
                    {isCompressing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      'Compress PDF'
                    )}
                  </Button>
                </div>
              )}

              {compressionResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Compression Successful!</AlertTitle>
                    <AlertDescription>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                           <p className="font-semibold text-center sm:text-left">
                                Reduced by {getCompressionPercentage()}%! ({formatBytes(compressionResult.originalSize)} to {formatBytes(compressionResult.compressedSize)})
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                                <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>
                                    Compress Another
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
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary prose-li:my-1 prose-headings:my-4">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>PDF files are one of the most common document formats used today. We use them for assignments, invoices, e-books, office documents, scanned files, and more. But large PDF files can quickly become a problem — they slow down uploads, take longer to send, and often exceed email or website size limits.</p>
                <p>If you’ve ever faced the message “File size too large”, this guide will help you understand how to compress a PDF properly without ruining the quality.</p>
              </div>

              <h2>The Complete, Easy Guide to Reducing PDF File Size (2025 Updated)</h2>
              <p>This article explains:</p>
              <ul>
                  <li>Why PDF compression matters</li>
                  <li>How PDF compression actually works</li>
                  <li>The best ways to compress PDFs</li>
                  <li>Tools you can use</li>
                  <li>Helpful tips to keep your files small and clean</li>
              </ul>

              <h3>Why Do You Need to Compress PDF Files?</h3>
              <p>There are many situations where reducing PDF size becomes necessary. Here are the most common reasons:</p>
              <ol>
                  <li><strong>Faster Uploads and Downloads:</strong> A lighter file uploads instantly and downloads faster — especially important for mobile users or slow internet connections.</li>
                  <li><strong>Easy Sharing:</strong> Email platforms like Gmail have attachment limits (usually 25MB). A compressed PDF is far more likely to fit.</li>
                  <li><strong>Saves Storage Space:</strong> Smaller files take up less space on your device or cloud storage, helping you stay organized.</li>
                  <li><strong>Better Performance:</strong> Large PDFs can become slow to open, scroll, or search—especially on older laptops or phones. Smaller files work smoothly.</li>
              </ol>
              <p>In short, compressing PDFs makes life easier, faster, and more efficient.</p>

              <AdBanner type="top-banner" className="my-8"/>

              <h3>How PDF Compression Works (Simple Explanation)</h3>
              <p>PDF compression reduces file size by removing unnecessary data or lowering image resolution. There are two main types:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <h4>1. Lossless Compression</h4>
                      <ul>
                          <li>No quality loss</li>
                          <li>Best for text-heavy files</li>
                          <li>Keeps fonts, layout, and images the same</li>
                      </ul>
                  </div>
                  <div>
                      <h4>2. Lossy Compression</h4>
                       <ul>
                          <li>Slight quality reduction (mostly in images)</li>
                          <li>Compresses much more</li>
                          <li>Best for scanned PDFs or image-heavy documents</li>
                      </ul>
                  </div>
              </div>
              <p>Most online tools let you choose between: High compression (smaller file, lower quality), Medium compression (balanced), or Low compression (larger file, best quality).</p>
              
              <h3>Best Ways to Compress PDF Files</h3>
              <h4>1. Compress PDF Online (Fastest Method)</h4>
              <p>Online tools are the easiest option because they require no installation. You upload your PDF, compress it, and download the smaller version.</p>
              
              <h4>2. Desktop PDF Compression Software</h4>
              <p>If you work with private or sensitive files, consider offline software like Adobe Acrobat Pro, PDFsam, or Foxit PDF Editor. These apps allow for batch compression, better privacy, and more control over compression settings. Ideal for businesses, lawyers, financial documents, or anyone who prefers offline tools.</p>
              
              <h4>3. Built-In “Reduce File Size” Options</h4>
              <p>Many PDF editors have compression built in. For example: Adobe Acrobat → File → Reduce File Size, Mac Preview → Export → Quartz Filter → Reduce File Size, or Foxit PDF → Optimize PDF. This method is convenient if you already use a PDF editor.</p>
              
              <h3>Related Tools You May Need</h3>
              <p>These tools often go hand-in-hand with compression:</p>
              <ul>
                  <li>Convert PDF to Word → <Link href="/tools/pdf/to-docx">PDF to Word</Link></li>
                  <li>Split PDF pages → <Link href="/tools/pdf/split">Split PDF</Link></li>
                  <li>Merge multiple PDFs → <Link href="/tools/pdf/merge">Merge PDF</Link></li>
              </ul>

              <h3>Expert Tips for Better PDF Compression</h3>
              <ol>
                  <li><strong>Remove Unnecessary Pages:</strong> Delete blank pages, repeated pages, or unused content.</li>
                  <li><strong>Lower Image Resolution:</strong> If the document is only for web use, 150 DPI is enough.</li>
                  <li><strong>Avoid Scanning in High Resolution:</strong> Scan at 150–200 DPI unless you need print quality.</li>
                  <li><strong>Use Fonts Wisely:</strong> Avoid embedding too many custom fonts.</li>
                  <li><strong>Choose the Right Compression Level:</strong> Higher compression = smaller file, but slightly lower image quality.</li>
              </ol>
              <p>These tips help create clean and professional PDFs every time.</p>
              
              <h3>FAQ (Human-Friendly)</h3>
              <h4>1. Will compressing a PDF reduce quality?</h4>
              <p>Lossless compression keeps quality the same. Lossy compression may slightly reduce image clarity.</p>
              <h4>2. Is online PDF compression safe?</h4>
              <p>Most trusted tools use secure connections and auto-delete files. However, avoid uploading sensitive documents (bank statements, legal files).</p>
              <h4>3. Can I compress multiple PDFs at once?</h4>
              <p>Yes — desktop apps like Adobe Acrobat Pro and PDFsam support batch compression.</p>
              <h4>4. What is the best free PDF compressor?</h4>
              <p>Tools like SmallPDF, ILovePDF, and DPToolsPro PDF Compressor are reliable.</p>
              <h4>5. How much can I compress a PDF?</h4>
              <p>Usually: Text-only PDFs → up to 70% reduction, Image-heavy PDFs → 20–60% reduction.</p>

              <hr/>
              
              <h3>About the Author — Piyush (Digital Piyush)</h3>
              <p>Piyush is a web developer and digital productivity tool creator with over 5 years of hands-on experience testing, building, and optimizing PDF tools and document converters. He has reviewed dozens of PDF compressors, file optimizers, and workflow utilities to understand what works best in real-world use. Through DPToolsPro.com, he focuses on creating simple, fast, and secure tools that help students, professionals, and businesses manage documents more efficiently.</p>
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
