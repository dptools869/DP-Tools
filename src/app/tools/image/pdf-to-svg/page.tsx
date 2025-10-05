
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfToSvg, PdfToSvgOutput } from '@/ai/flows/pdf-to-svg';
import AdBanner from '@/components/ad-banner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SvgImage {
    fileName: string;
    svgDataUri: string;
}

export default function PdfToSvgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<PdfToSvgOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setConversionResult(null);
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
          const result = await pdfToSvg({ pdfDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: `Your PDF has been converted into ${result.imageCount} SVG image(s).`,
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

  const downloadImage = (image: SvgImage) => {
    const link = document.createElement('a');
    link.href = image.svgDataUri;
    link.download = image.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadAllImages = () => {
      conversionResult?.svgs.forEach((image, index) => {
          setTimeout(() => {
              downloadImage(image);
          }, index * 300); // Stagger downloads to prevent browser blocking
      });
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
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">PDF to SVG Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert each page of your PDF file into high-quality SVG vector images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
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
                      'Convert to SVG'
                    )}
                  </Button>
                </div>
              
              {conversionResult && conversionResult.svgs.length > 0 && (
                 <div className="space-y-4">
                  <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Conversion Complete!</AlertTitle>
                    <AlertDescription className='flex flex-col sm:flex-row justify-between items-center mt-2 gap-2'>
                        Your images are ready. Download them individually below or all at once.
                         <div className="flex gap-2">
                             <Button onClick={downloadAllImages} size="sm" variant="secondary" className="bg-background/80">Download All</Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>Start Over</Button>
                         </div>
                    </AlertDescription>
                  </Alert>

                  <ScrollArea className="h-[600px] border rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {conversionResult.svgs.map((image, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-2 flex items-center justify-center bg-white">
                              <img src={image.svgDataUri} alt={`Page ${index + 1}`} className="w-full h-auto aspect-[8.5/11] object-contain"/>
                            </CardContent>
                            <CardFooter className="p-2 flex-col items-start text-xs">
                              <p className="font-semibold truncate">{image.fileName}</p>
                              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => downloadImage(image)}>
                                Download SVG
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Convert PDF to Scalable Vector Graphics (SVG)</h2>
            <p>Our PDF to SVG converter is an essential tool for designers and developers who need to extract graphics and text from a PDF in a scalable, editable vector format. Unlike raster formats like JPG or PNG, SVG images can be scaled to any size without losing quality, making them perfect for logos, icons, illustrations, and web graphics. This tool processes each page of your PDF and converts it into a high-fidelity SVG file, packaging them all into a convenient ZIP archive for download.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>Why Convert PDF to SVG?</h2>
            <p>SVG offers several advantages over other image formats when dealing with graphics originating from a PDF. Because PDFs themselves are often vector-based, converting to SVG preserves this native quality.</p>
            <ul>
              <li><strong>Infinite Scalability:</strong> Scale your graphics up or down without any pixelation or loss of clarity.</li>
              <li><strong>Editable Content:</strong> Open the SVG files in vector editing software like Adobe Illustrator or Inkscape to modify paths, colors, and text.</li>
              <li><strong>Smaller File Sizes:</strong> For simple graphics and text, SVG can offer smaller file sizes compared to raster formats.</li>
              <li><strong>Web and SEO Friendly:</strong> SVGs are XML-based, meaning they can be indexed by search engines and manipulated with CSS and JavaScript.</li>
            </ul>
            <p>Use our free, secure, and fast "PDF to SVG converter" to unlock the vector content in your documents. It's the perfect way to repurpose PDF assets for web design, application development, and print media.</p>
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
