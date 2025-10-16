
'use client';

import { useState, useRef, useEffect } from 'react';
import { Cropper, CircleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Crop, Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { useIsMobile } from "@/hooks/use-mobile";

export default function CircleCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [fileName, setFileName] = useState('');
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleFile = (file: File | undefined | null) => {
    if (file && file.type.startsWith('image/')) {
        setFileName(file.name.split('.').slice(0, -1).join('.') + '-cropped.png');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImageSrc(reader.result as string);
          setCroppedImage(null);
        });
        reader.readAsDataURL(file);
      } else if (file) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid image file.',
        });
      }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleDesktopUploadClick = () => {
      // On desktop, clicking the area triggers the file input.
      fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
        setIsCropping(true);
        const cropper = cropperRef.current;
        const canvas = cropper.getCanvas();
        if (canvas) {
            const outputCanvas = document.createElement('canvas');
            const outputContext = outputCanvas.getContext('2d');
            const { width, height } = cropper.getCoordinates();

            outputCanvas.width = width;
            outputCanvas.height = height;

            if (outputContext) {
                outputContext.beginPath();
                outputContext.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
                outputContext.closePath();
                outputContext.clip();
                outputContext.drawImage(canvas, 0, 0);
                
                setCroppedImage(outputCanvas.toDataURL('image/png'));

                toast({
                    title: 'Crop Successful',
                    description: 'Your circular image is ready.',
                });
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Cropping Failed',
                description: 'Could not get the cropped image.',
            });
        }
        setIsCropping(false);
    }
  };

  const resetTool = () => {
    setImageSrc(null);
    setCroppedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
                Create perfect circular profile pictures and logos with a resizable crop area.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!imageSrc && (
                <div>
                  {/* --- Desktop Uploader: Drag-and-drop area --- */}
                  <div
                    role="button"
                    aria-label="Upload an image"
                    className="hidden md:block relative w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={handleDesktopUploadClick}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <UploadCloud className="h-12 w-12 text-muted-foreground" />
                      <span className="text-lg font-medium text-foreground">
                        Drag & drop an image or tap to upload
                      </span>
                    </div>
                  </div>

                  {/* --- Mobile Uploader: Visible Button --- */}
                  <div className="md:hidden text-center">
                     <Label htmlFor="file-upload-mobile" className="inline-flex items-center justify-center h-12 px-8 text-lg font-semibold text-white bg-primary rounded-md cursor-pointer hover:bg-primary/90">
                          <UploadCloud className="mr-2 h-5 w-5" />
                          Choose Image
                      </Label>
                  </div>

                  {/* --- Hidden file input for both --- */}
                  <Input ref={fileInputRef} id="file-upload-mobile" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                </div>
              )}

              {imageSrc && !croppedImage && (
                <div className="space-y-4">
                  <div className="h-[300px] sm:h-[500px] w-full bg-muted/30 rounded-lg">
                    <Cropper
                      ref={cropperRef}
                      src={imageSrc}
                      stencilComponent={CircleStencil}
                      stencilProps={{
                        aspectRatio: 1,
                      }}
                      className={'cropper'}
                    />
                  </div>
                  <Button onClick={handleCrop} className="w-full" disabled={isCropping}>
                    {isCropping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cropping...</> : 'Crop Image'}
                  </Button>
                   <Button onClick={resetTool} variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> Start Over
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
            <h2>Create Perfect Circular Images with a Resizable Crop Area</h2>
            <p>Our Circle Crop tool provides an easy and intuitive way to crop your photos into a perfect circle. This is ideal for creating profile pictures for social media, avatars for forums, or unique design elements for your website. Now with a resizable crop area, you have even more control. Simply upload your image, adjust the zoom, position, and circle size, and download your high-quality circular image with a transparent background.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How to Use the Circle Crop Tool</h2>
            <p>The process is designed for maximum flexibility:</p>
            <ol>
              <li><strong>Upload Your Image:</strong> Drag and drop an image file or tap the upload area to select one from your device.</li>
              <li><strong>Adjust the Crop:</strong> A circular overlay will appear. You can drag the image to position it, use your mouse wheel to zoom, and drag the corners of the circle to resize it.</li>
              <li><strong>Crop and Download:</strong> Once you're happy with the preview, click the "Crop Image" button. Our tool will process the image and provide you with a high-quality, circular PNG file with a transparent background, ready for you to download.</li>
            </ol>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>Resizable Circle:</strong> Adjust the size of the circular crop area to perfectly frame your subject.</li>
              <li><strong>Easy to Use:</strong> A simple, intuitive interface with zoom, pan, and resize controls.</li>
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
