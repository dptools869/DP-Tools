
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, RefreshCw, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import Image from 'next/image';

export default function JpgToPngPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setImage(img);
          setOriginalFile(file);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a JPG or JPEG image file.',
      });
    }
  };

  const handleDownload = () => {
    if (!image || !originalFile) return;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(image, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${originalFile.name.split('.').slice(0, -1).join('.')}.png`;
    link.click();
    
    toast({
      title: 'Conversion Successful!',
      description: 'Your PNG image has been downloaded.',
    });
  };

  const resetTool = () => {
    setImage(null);
    setOriginalFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      handleFileChange(event.dataTransfer.files?.[0] || null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Repeat className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">JPG to PNG Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert your JPG images to the high-quality, lossless PNG format.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
             <CardHeader className="md:hidden">
                <CardTitle>JPG to PNG Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
                {!image ? (
                    <Label
                        htmlFor="file-upload"
                        className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <span className="text-lg font-medium text-foreground">
                                Drag & drop your JPG/JPEG image here
                            </span>
                            <span className="text-muted-foreground">or click to browse</span>
                        </div>
                        <Input ref={fileInputRef} id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept="image/jpeg,image/jpg" />
                    </Label>
                ) : (
                    <div className="space-y-6">
                       <div className="p-4 border rounded-lg bg-muted/30 aspect-video flex items-center justify-center">
                          <Image src={image.src} alt="Preview" width={400} height={300} style={{maxWidth: '100%', height: 'auto', objectFit: 'contain'}} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleDownload} size="lg"><Download className="mr-2"/>Download as PNG</Button>
                            <Button onClick={resetTool} variant="outline"><RefreshCw className="mr-2"/>Convert Another</Button>
                        </div>
                    </div>
                )}
            </CardContent>
             <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">Your images are processed securely in your browser and are never uploaded to our servers.</p>
            </CardFooter>
          </Card>

           <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Why Convert from JPG to PNG?</h2>
            <p>While JPG is excellent for photographs due to its high compression, PNG is often superior for graphics, logos, and screenshots. PNG uses lossless compression, meaning no quality is lost, which results in sharper text and cleaner lines. Most importantly, PNG supports transparency, allowing you to place your image on any background without a white box. Our tool makes this conversion simple and instant.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>Lossless Quality:</strong> Convert to PNG to preserve the exact quality of your image.</li>
              <li><strong>Transparency Support:</strong> PNG is the ideal format if you need to create an image with a transparent background.</li>
              <li><strong>Client-Side Processing:</strong> All conversions happen directly in your browser. Your images are never uploaded to a server, ensuring your privacy.</li>
              <li><strong>Completely Free:</strong> Convert as many images as you need, at no cost.</li>
            </ul>
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
