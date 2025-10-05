
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, RefreshCw, Shrink, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { Slider } from '@/components/ui/slider';
import { formatBytes } from '@/lib/utils';
import Image from 'next/image';

export default function ImageCompressorPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [compressedImage, setCompressedImage] = useState<{ url: string; size: number } | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setImage(img);
          setOriginalFile(file);
          setCompressedImage(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file.',
      });
    }
  };

  const handleCompress = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(image, 0, 0);
    
    const mimeType = originalFile?.type || 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    const byteString = atob(dataUrl.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });

    setCompressedImage({ url: dataUrl, size: blob.size });
  };
  
  const handleDownload = () => {
      if(!compressedImage) return;
      const link = document.createElement('a');
      link.href = compressedImage.url;
      link.download = `compressed-${originalFile?.name}`;
      link.click();
  }

  const resetTool = () => {
    setImage(null);
    setOriginalFile(null);
    setCompressedImage(null);
    setQuality(0.75);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      handleFileChange(event.dataTransfer.files?.[0] || null);
  }

  const compressionPercentage = originalFile && compressedImage ? Math.round((1 - compressedImage.size / originalFile.size) * 100) : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Shrink className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Image Compressor</CardTitle>
              <CardDescription className="text-lg">
                Reduce image file sizes while balancing quality.
              </CardDescription>
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
                                Drag & drop your image here
                            </span>
                            <span className="text-muted-foreground">or click to browse</span>
                        </div>
                        <Input ref={fileInputRef} id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept="image/jpeg,image/png,image/webp" />
                    </Label>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Control Panel */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Compression Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Quality ({Math.round(quality * 100)}%)</Label>
                                    <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={0.1} max={1} step={0.05} onValueChangeCommitted={handleCompress} />
                                    <p className="text-xs text-muted-foreground">Lower quality means smaller file size.</p>
                                  </div>
                                   <Button onClick={handleCompress} className="w-full">Compress Image</Button>
                                </CardContent>
                            </Card>

                             {compressedImage && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Result</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-center">
                                        <div className="text-4xl font-bold text-green-500">-{compressionPercentage}%</div>
                                        <div className="flex justify-around text-sm">
                                            <div>
                                                <p className="font-bold">Original</p>
                                                <p>{formatBytes(originalFile?.size || 0)}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <ArrowRight className="w-4 h-4"/>
                                            </div>
                                            <div>
                                                <p className="font-bold">Compressed</p>
                                                <p>{formatBytes(compressedImage.size)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col gap-2">
                                        <Button onClick={handleDownload} size="lg" className="w-full"><Download className="mr-2"/>Download</Button>
                                        <Button onClick={resetTool} variant="outline" className="w-full"><RefreshCw className="mr-2"/>Compress Another</Button>
                                    </CardFooter>
                                </Card>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <Label>Preview</Label>
                            <div className="p-4 border rounded-lg bg-muted/30 aspect-video flex items-center justify-center">
                                <Image src={compressedImage?.url || image.src} alt="Preview" width={400} height={300} style={{maxWidth: '100%', height: 'auto', objectFit: 'contain'}} />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">Your images are processed securely in your browser and are never uploaded to our servers.</p>
            </CardFooter>
          </Card>
        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
