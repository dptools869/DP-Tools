
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dwgToJpg, DwgToJpgOutput } from '@/ai/flows/dwg-to-jpg';
import AdBanner from '@/components/ad-banner';

const acceptedExtensions = ['.dwg', '.dxf', '.dwf'];

export default function DwgToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<DwgToJpgOutput | null>(null);
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
          description: 'Please upload a supported AutoCAD file (.dwg, .dxf, .dwf).',
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
        description: 'Please drop a supported AutoCAD file.',
      });
    }
  };

  const convertFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a drawing file to convert.',
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
          const result = await dwgToJpg({ drawingDataUri: base64File, fileName: file.name });
          setConversionResult(result);
          toast({
            title: 'Conversion Successful',
            description: `Your drawing has been converted into ${result.imageCount} JPG image(s).`,
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

  const downloadZip = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.zipDataUri;
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
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">DWG to JPG Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert AutoCAD drawings (DWG, DXF, DWF) to high-quality JPG images.
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
                            {fileName || 'Drag & drop your AutoCAD file here'}
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
                      'Convert to JPG'
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
                                {conversionResult.imageCount} image(s) zipped in <span className="font-bold">{conversionResult.fileName}</span>.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={downloadZip} size="sm" className="bg-primary hover:bg-primary/90">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download ZIP
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
            <h2 id="about-tool">Convert AutoCAD Drawings (DWG, DXF) to JPG</h2>
            <p>Our DWG to JPG converter provides a powerful way to convert your AutoCAD design files into high-quality JPG images. This is essential for engineers, architects, and designers who need to share previews of their work, include drawings in reports, or display them on websites without requiring specialized CAD software.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does DWG to JPG Conversion Work?</h2>
            <p>The conversion process is designed for accuracy and ease of use. When you upload your DWG, DXF, or DWF file, our system renders the drawing and converts it into high-quality JPG images. For multi-layout drawings, each layout is converted into a separate image, and all images are bundled into a convenient ZIP archive for easy download. We prioritize your privacy; all files are handled securely and are automatically deleted from our servers after processing.</p>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>High-Quality Raster Images:</strong> Creates crisp, clear JPG images that accurately represent your drawings.</li>
              <li><strong>Broad Format Support:</strong> Supports DWG, DXF, and DWF file formats.</li>
              <li><strong>Easy Sharing:</strong> JPG is a universal image format that can be viewed on any device.</li>
              <li><strong>User-Friendly Interface:</strong> Simply drag and drop your file to begin the conversion process instantly.</li>
              <li><strong>Secure and Private:</strong> Your intellectual property is safe. Files are processed over an encrypted connection and are not stored.</li>
              <li><strong>Completely Free:</strong> Convert as many AutoCAD files to JPG as you need, at no cost.</li>
            </ul>
            <p>Make your technical drawings more accessible by converting them to JPG. Experience the simplicity and quality of our free online conversion tool today!</p>
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
