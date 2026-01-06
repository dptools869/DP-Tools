
'use client';

import { useState, useRef } from 'react';
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

export function CircleCropClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [fileName, setFileName] = useState('');
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  
  const handleUploadAreaClick = () => {
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
                // This creates the circular clipping path
                outputContext.beginPath();
                outputContext.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
                outputContext.closePath();
                outputContext.clip();
                
                // This draws the cropped image from the cropper's canvas into the clipped area
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Crop className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Circle Crop Tool Free | Instantly Turn Images Into Perfect Circles</CardTitle>
              <CardDescription className="text-lg">
                 Use our free Circle Crop Tool to convert any photo or graphic into a clean, round image in seconds. No signup needed, transparent background, ready for web or socials.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Circle Crop Tool</CardTitle>
              <CardDescription>
                Your complete image cropping toolkit for designing, web, and creative projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!imageSrc && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload an image"
                  className="relative w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleUploadAreaClick}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadAreaClick(); }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <span className="text-lg font-medium text-foreground">
                      Drag & drop an image or tap to upload
                    </span>
                  </div>
                  <Input ref={fileInputRef} id="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                </div>
              )}

              {imageSrc && !croppedImage && (
                <div className="space-y-4">
                  <div className="h-[300px] sm:h-[500px] w-full bg-muted/30 rounded-lg" style={{ touchAction: 'none' }}>
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

          <div className="prose prose-lg dark:prose-invert max-w-none text-center my-12">
            <h2 className="md:hidden">Crop the Perfect Circle in Seconds</h2>
            <p>DP Tools' Circle Crop tool helps creators, designers, and developers easily crop and create precise circular images. Whether you're building a website, designing a profile picture, or editing a photo, it delivers accurate results quickly and effortlessly.</p>
            <p>All you have to do is upload an image and adjust the circle. After this, you will be able to see the perfectly cropped circular result of any image.</p>
          </div>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How Does Our Circle Crop Tool Work?</h2>
            <p>Our tool is the universal solution for circular cropping. You see an image your eyes can see, but we provide the exact circular crop in every format that matters.</p>
            <p>The tool offers an easy-to-use interface for instantly cropping and converting images. After uploading an image, the system will automatically apply the correct circular crop for web design, graphic projects, and digital platforms.</p>
            <h3>Here’s what you get:</h3>
            <p>You can crop an image by clicking anywhere on the preview or use the sliders to make small changes. If you already have specific dimensions, you can type them in to automatically crop images.</p>
            <h3>Get Every Format Instantly</h3>
            <p>When you crop an image, you’ll see it in PNG format for websites, with transparent backgrounds for digital designs, in JPG format for standard photos, and in high resolution for printing. Everything updates right away with accurate results.</p>
            <h3>One-Click Download</h3>
            <p>Want to use the cropped image somewhere else? Just press the download button next to the format you need, and it will be ready to paste into your design tool, website, or any other place.</p>
            <h2>Why Use a Circle Crop Tool?</h2>
            <p>A Circle Crop Tool should be a great tool to have when dealing with visuals. It helps you to be consistent and accurate throughout your projects.</p>
            <h3>Here’s how it helps:</h3>
            <ul>
                <li><strong>Design Consistency:</strong> You can easily and exactly crop circular images for your brand or UI designs.</li>
                <li><strong>Quick Web Development:</strong> Get the correct circular crop for CSS or HTML.</li>
                <li><strong>Creative Inspiration:</strong> Create new circular designs and save them for your future project.</li>
                <li><strong>Quick Adjustments:</strong> Modify and change crop sizes in real time to make your project even more precise.</li>
            </ul>
            <p>If you are a designer, marketer, hobbyist, or any other user, it is easy to find and use the best circle crop tool at any time, as our online circle crop tool is free and user-friendly.</p>
            <h3>Safe, Simple, and Fast</h3>
            <p>No download or registration required. All you have to do is open our online circle crop tool and start cropping images. All your work is safe and confidential here.</p>
            <h3>Try Out Different Sizes</h3>
            <p>With this tool, you can test circle sizes side by side and see what fits best. It helps you understand how circular images look on different screens or backgrounds. If you're unsure which size to use, try a few. Mix small and large, tight and loose. You'll quickly see what feels right for your design. The live preview shows you what each circular crop will look like before you use it.</p>
            <h2>Free Circle Crop Tool Online - Start Cropping Images Now</h2>
            <p>Circular images tell stories. They shape how people feel when they see your work. Using the right crop can make a design friendly, attractive, or professional.</p>
            <p>Our free tool helps you explore endless sizes and discover fresh circular designs. You don't have to be a pro to use it, just experiment and see what fits your needs.</p>
            <p>It's simple and made for anyone who loves creating. Try adjusting different circle sizes to find what feels right for your project. Sometimes, the slightest size change can make the most significant difference.</p>
            <p>So you are just one click away from creating your own perfect circular image. Crop images with the free Circle Crop Tool, and make your projects even more precise.</p>
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
