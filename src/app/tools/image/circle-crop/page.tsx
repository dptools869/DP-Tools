
'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Crop, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { getCroppedImg } from '@/lib/crop-image';

export default function CircleCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name.split('.').slice(0, -1).join('.') + '-cropped.png');
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setCroppedImage(null);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       setFileName(file.name.split('.').slice(0, -1).join('.') + '-cropped.png');
       let imageDataUrl = await readFile(file);
       setImageSrc(imageDataUrl as string);
       setCroppedImage(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a valid image file.',
      });
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      toast({
          title: 'Crop Successful',
          description: 'Your circular image is ready.',
      })
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Cropping Failed',
        description: 'An error occurred while cropping the image.',
      });
    } finally {
        setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, toast]);

  const resetTool = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
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
                <Crop className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Circle Crop Tool</CardTitle>
              <CardDescription className="text-lg">
                Create perfect circular profile pictures and logos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
                {!imageSrc && (
                    <Label
                        htmlFor="file-upload"
                        className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <span className="text-lg font-medium text-foreground">
                                Drag & drop your image here
                            </span>
                            <span className="text-muted-foreground">or click to browse</span>
                        </div>
                        <Input id="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                    </Label>
                )}

                {imageSrc && !croppedImage && (
                    <div className="space-y-4">
                        <div className="relative h-96 w-full bg-muted/30 rounded-lg">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zoom-slider">Zoom</Label>
                            <Slider
                                id="zoom-slider"
                                min={1}
                                max={3}
                                step={0.1}
                                value={[zoom]}
                                onValueChange={(val) => setZoom(val[0])}
                            />
                        </div>
                         <Button onClick={showCroppedImage} className="w-full" disabled={isCropping}>
                            {isCropping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cropping...</> : 'Crop Image'}
                        </Button>
                    </div>
                )}
                
                {croppedImage && (
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                        <CardHeader className="text-center">
                             <img src={croppedImage} alt="Cropped" className="max-w-48 max-h-48 mx-auto rounded-full border-4 border-background shadow-lg" />
                             <AlertTitle className="font-bold text-2xl mt-4">Crop Successful!</AlertTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center">
                            <a href={croppedImage} download={fileName}>
                                <Button size="lg" className="w-full sm:w-auto">
                                    <Download className="mr-2 h-5 w-5" />
                                    Download Image
                                </Button>
                            </a>
                            <Button onClick={resetTool} size="lg" variant="outline" className="w-full sm:w-auto">
                                Crop Another
                            </Button>
                        </CardContent>
                    </Alert>
                )}

            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your images are processed securely on your device and are never uploaded to our servers.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Create Perfect Circular Images</h2>
            <p>Our Circle Crop tool provides an easy and intuitive way to crop your photos into a perfect circle. This is ideal for creating profile pictures for social media, avatars for forums, or unique design elements for your website. Simply upload your image, adjust the zoom and position, and download your high-quality circular image with a transparent background.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How to Use the Circle Crop Tool</h2>
            <p>The process is designed for simplicity and control:</p>
            <ol>
              <li><strong>Upload Your Image:</strong> Drag and drop an image file or click to browse and select one from your device.</li>
              <li><strong>Adjust the Crop:</strong> A circular overlay will appear on your image. You can drag the image to position it perfectly within the circle. Use the zoom slider to get the framing just right.</li>
              <li><strong>Crop and Download:</strong> Once you're happy with the preview, click the "Crop Image" button. Our tool will process the image and provide you with a high-quality, circular PNG file with a transparent background, ready for you to download.</li>
            </ol>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>Easy to Use:</strong> A simple, intuitive interface with zoom and pan controls.</li>
              <li><strong>High-Quality Output:</strong> Creates crisp, clean circular images in PNG format.</li>
              <li><strong>Transparent Background:</strong> The area outside the circle is transparent, perfect for any background.</li>
              <li><strong>Client-Side Processing:</strong> Your images are processed directly in your browser for maximum privacy and speed. Nothing is uploaded to our servers.</li>
              <li><strong>Completely Free:</strong> Use this tool to crop as many images as you need, at no cost.</li>
            </ul>
            <p>Get the perfect circular crop for your profile pictures, logos, and designs every time with our free and secure online tool.</p>
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

function readFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}
