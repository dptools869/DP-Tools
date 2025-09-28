
'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Download, RefreshCw, Ruler, Lock, Unlock, Percent, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ResizeMode = 'dimensions' | 'percentage';
type OutputFormat = 'jpeg' | 'png' | 'webp';

export default function ImageResizerPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [resizeMode, setResizeMode] = useState<ResizeMode>('dimensions');
  
  const [width, setWidth] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [percentage, setPercentage] = useState<number | string>(50);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      setFileName(file.name.split('.').slice(0, -1).join('.'));
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file.',
      });
    }
  };

  const handleWidthChange = (newWidth: number | string) => {
    setWidth(newWidth);
    if (keepAspectRatio && image && typeof newWidth === 'number' && newWidth > 0) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };
  
  const handleHeightChange = (newHeight: number | string) => {
    setHeight(newHeight);
    if (keepAspectRatio && image && typeof newHeight === 'number' && newHeight > 0) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };
  
  const handlePercentageChange = (newPercentage: number | string) => {
    setPercentage(newPercentage);
    if (image && typeof newPercentage === 'number' && newPercentage > 0) {
      const factor = newPercentage / 100;
      setWidth(Math.round(image.naturalWidth * factor));
      setHeight(Math.round(image.naturalHeight * factor));
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const w = typeof width === 'number' ? width : parseInt(width);
    const h = typeof height === 'number' ? height : parseInt(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        toast({variant: 'destructive', title: 'Invalid Dimensions', description: 'Please enter valid width and height.'});
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(image, 0, 0, w, h);
    
    const mimeType = `image/${outputFormat}`;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}-resized.${outputFormat}`;
    link.click();
  };

  const resetTool = () => {
    setImage(null);
    setFileName('');
    setWidth('');
    setHeight('');
    setPercentage(50);
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Ruler className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Image Resizer</CardTitle>
              <CardDescription className="text-lg">
                Easily resize images by dimensions or percentage while maintaining quality.
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
                        <Input ref={fileInputRef} id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept="image/*" />
                    </Label>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Control Panel */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resize Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex justify-around bg-muted p-1 rounded-md">
                                        <Button variant={resizeMode === 'dimensions' ? 'secondary' : 'ghost'} onClick={() => setResizeMode('dimensions')} className="w-full">By Dimensions</Button>
                                        <Button variant={resizeMode === 'percentage' ? 'secondary' : 'ghost'} onClick={() => setResizeMode('percentage')} className="w-full">By Percentage</Button>
                                    </div>
                                    
                                    {resizeMode === 'dimensions' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="space-y-2 flex-1"><Label htmlFor="width">Width (px)</Label><Input id="width" type="number" value={width} onChange={(e) => handleWidthChange(e.target.value === '' ? '' : parseInt(e.target.value))}/></div>
                                                <div className="self-end pb-2">x</div>
                                                <div className="space-y-2 flex-1"><Label htmlFor="height">Height (px)</Label><Input id="height" type="number" value={height} onChange={(e) => handleHeightChange(e.target.value === '' ? '' : parseInt(e.target.value))}/></div>
                                            </div>
                                        </div>
                                    )}

                                    {resizeMode === 'percentage' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="percentage">Scale Percentage</Label>
                                            <div className="flex items-center gap-2"><Input id="percentage" type="number" value={percentage} onChange={(e) => handlePercentageChange(e.target.value === '' ? '' : parseInt(e.target.value))} /><Percent className="w-5 h-5 text-muted-foreground"/></div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="aspect-ratio" className="flex items-center gap-2">
                                           {keepAspectRatio ? <Lock className="w-4 h-4"/> : <Unlock className="w-4 h-4"/>}
                                           Keep Aspect Ratio
                                        </Label>
                                        <Switch id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={setKeepAspectRatio} />
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader><CardTitle>Output Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="output-format">Format</Label>
                                        <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
                                            <SelectTrigger id="output-format"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="jpeg">JPG</SelectItem>
                                                <SelectItem value="png">PNG</SelectItem>
                                                <SelectItem value="webp">WEBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button onClick={handleDownload} size="lg"><Download className="mr-2"/>Download Resized Image</Button>
                                <Button onClick={resetTool} variant="outline"><RefreshCw className="mr-2"/>Resize Another</Button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <Label>Preview</Label>
                            <div className="p-4 border rounded-lg bg-muted/30 aspect-video flex items-center justify-center">
                                <img src={image.src} alt="Preview" style={{width: '100%', height: 'auto', objectFit: 'contain'}} />
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                                Original: {image.naturalWidth} x {image.naturalHeight}px
                                <ArrowRight className="inline mx-2 w-4 h-4"/>
                                New: {width} x {height}px
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Resize Images with Precision</h2>
            <p>Our Image Resizer tool provides a simple yet powerful way to change the dimensions of your images. Whether you need to scale an image down for a website to improve loading times, or resize it to specific dimensions for a social media post, our tool gives you the control you need. You can resize by specifying exact pixel dimensions or by a simple percentage.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How to Use the Image Resizer</h2>
            <p>The process is designed for ease of use and flexibility:</p>
            <ol>
                <li><strong>Upload Your Image:</strong> Drag and drop your image file or click to select one from your device.</li>
                <li><strong>Choose Your Resize Method:</strong> Select whether you want to resize by specific dimensions (pixels) or by a percentage.</li>
                <li><strong>Enter New Values:</strong> Input your desired width, height, or percentage. If "Keep Aspect Ratio" is enabled, the other dimension will update automatically to prevent distortion.</li>
                <li><strong>Select Output Format:</strong> Choose your desired file format: JPG, PNG, or WEBP.</li>
                <li><strong>Download:</strong> Click the download button to save your newly resized image.</li>
            </ol>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>Flexible Resizing:</strong> Scale by pixels or percentage to fit your needs.</li>
              <li><strong>Aspect Ratio Lock:</strong> Easily maintain your image's original proportions to avoid stretching or squashing.</li>
              <li><strong>Multiple Formats:</strong> Export your resized image as a JPG, PNG, or modern WEBP file.</li>
              <li><strong>Client-Side Processing:</strong> All resizing happens directly in your browser. Your images are never uploaded to a server, ensuring your privacy.</li>
              <li><strong>Completely Free:</strong> Resize as many images as you need, at no cost.</li>
            </ul>
            <p>Get the perfect size for your images every time with our fast, secure, and free online Image Resizer.</p>
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
