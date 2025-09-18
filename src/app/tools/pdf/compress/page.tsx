
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

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function CompressPdfPage() {
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
            title: 'Compression Failed',
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Shrink className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF Compressor</CardTitle>
              <CardDescription className="text-lg">
                Reduce the file size of your PDFs while maintaining optimal quality.
              </CardDescription>
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

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Optimize Your PDFs: The Ultimate Guide to PDF Compression</h2>
            <p>In a world where digital document exchange is paramount, the size of your files matters. Large PDF files can be cumbersome to email, slow to upload, and can consume valuable storage space. That's where our free online PDF Compressor comes in. This powerful tool is designed to drastically reduce the file size of your PDFs while intelligently balancing file size with quality. Whether you're a student submitting an assignment, a professional sending a report, or just looking to archive documents efficiently, our tool provides a simple, fast, and secure solution. Keywords like "compress PDF," "reduce PDF file size," and "free PDF optimizer" are central to what we offer.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does PDF Compression Work?</h2>
            <p>Our PDF compressor employs a variety of sophisticated techniques to shrink your file size without compromising readability. When you upload a PDF, the tool analyzes its structure and content. It identifies elements that can be optimized, such as high-resolution images, redundant data, and un-embedded fonts. The core of the process involves several methods:</p>
            <ul>
              <li><strong>Image Optimization:</strong> Images are often the biggest contributors to a large PDF file size. Our tool re-samples images to a lower resolution (e.g., 144 DPI) suitable for screen viewing and applies compression algorithms like JPEG or JBIG2 to reduce their data footprint.</li>
              <li><strong>Data Removal:</strong> PDFs can contain hidden data like metadata, annotations, and form fields that aren't always necessary. The compressor can strip out this non-essential information.</li>
              <li><strong>Content Stream Compression:</strong> The text and vector graphics within a PDF are held in content streams. Our tool applies lossless compression algorithms like Flate or LZW to these streams, packing the data more efficiently.</li>
              <li><strong>Font Subsetting:</strong> Instead of embedding entire font character sets, the compressor can subset fonts to include only the characters actually used in the document, saving a significant amount of space.</li>
            </ul>
            <p>This multi-faceted approach ensures a "smart PDF compression" that yields the best possible results. The entire process is automated; you simply upload your file, and our server handles the complex "PDF size reduction" tasks for you.</p>
            <h3>Key Benefits of Using Our PDF Compressor</h3>
            <ul>
              <li><strong>Significant Size Reduction:</strong> Achieve up to 80% reduction in file size, making your PDFs easier to share and store.</li>
              <li><strong>Quality Control:</strong> Our tool prioritizes maintaining the visual integrity of your document. Text remains sharp, and images are optimized for a balance of quality and size.</li>
              <li><strong>Fast and Easy:</strong> The user-friendly drag-and-drop interface allows for quick uploads. The compression process takes just seconds for most files.</li>
              <li><strong>Secure and Private:</strong> We value your privacy. All uploaded files are protected with 256-bit SSL encryption and are automatically deleted from our servers after a few hours.</li>
              <li><strong>Completely Free:</strong> Access powerful "PDF compression online" without any cost, subscriptions, or watermarks.</li>
            </ul>
            <h2>Why Compressing PDFs is Essential Today</h2>
            <p>The need to "make a PDF smaller" is more relevant than ever. Many email servers have attachment size limits (e.g., 25MB), and uploading large files to web portals can be slow and frustrating. A compressed PDF is more "email-friendly" and web-friendly. For businesses, smaller files lead to reduced bandwidth costs and faster loading times for customers accessing documents on a website. For individuals, it means quicker sharing with friends, family, or colleagues and less storage used on your devices. By using a reliable "document compressor," you streamline your digital workflow and ensure your information is transmitted efficiently and professionally. Our tool is your go-to solution for all your PDF optimization needs.</p>
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
