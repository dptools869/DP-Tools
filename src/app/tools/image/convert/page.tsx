
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, RefreshCw, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'gif';

export default function ImageConverterPage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [originalFormat, setOriginalFormat] = useState('');

  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      setFileName(file.name.split('.').slice(0, -1).join('.'));
      setOriginalFormat(file.type.split('/')[1]);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file.',
      });
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(image, 0, 0);
    
    const mimeType = `image/${outputFormat}`;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
    link.click();
    
    toast({
      title: 'Conversion Successful!',
      description: 'Your PNG image has been downloaded.',
    });
  };

  const resetTool = () => {
    setImage(null);
    setFileName('');
    setOriginalFormat('');
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
              <CardTitle className="text-3xl font-headline">Image Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert your images to JPG, PNG, WEBP, and GIF formats.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="md:hidden">
              <CardTitle>Image Converter</CardTitle>
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
                                <CardHeader><CardTitle>Output Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="output-format">Convert To</Label>
                                        <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
                                            <SelectTrigger id="output-format"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="jpeg">JPG</SelectItem>
                                                <SelectItem value="png">PNG</SelectItem>
                                                <SelectItem value="webp">WEBP</SelectItem>
                                                <SelectItem value="gif">GIF</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                                      <div className="space-y-2">
                                        <Label>Quality ({Math.round(quality * 100)}%)</Label>
                                        <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={0.1} max={1} step={0.05} />
                                      </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button onClick={handleDownload} size="lg"><Download className="mr-2"/>Download Converted Image</Button>
                                <Button onClick={resetTool} variant="outline"><RefreshCw className="mr-2"/>Convert Another</Button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-4">
                            <Label>Preview</Label>
                            <div className="p-4 border rounded-lg bg-muted/30 aspect-video flex items-center justify-center">
                                <Image src={image.src} alt="Preview" width={400} height={300} style={{maxWidth: '100%', height: 'auto', objectFit: 'contain'}} />
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                               Original Format: {originalFormat.toUpperCase()}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
             <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">Your images are processed securely in your browser and are never uploaded to our servers.</p>
            </CardFooter>
          </Card>

           <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Convert Images with Ease</h2>
            <p>Our Image Converter tool provides a simple way to change the format of your images. Whether you need to convert a PNG to a JPG for a smaller file size, or a JPG to a WEBP for better web performance, our tool handles it all right in your browser.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How to Use the Image Converter</h3>
            <ol>
                <li><strong>Upload Your Image:</strong> Drag and drop your image file or click to select one from your device.</li>
                <li><strong>Choose Output Format:</strong> Select your desired format from the dropdown: JPG, PNG, WEBP, or GIF.</li>
                <li><strong>Adjust Quality (Optional):</strong> For JPG and WEBP formats, you can adjust the quality slider to balance file size and visual fidelity.</li>
                <li><strong>Download:</strong> Click the download button to save your newly converted image.</li>
            </ol>
            <h3 id="key-features">Key Features and Benefits</h3>
            <ul>
              <li><strong>Multiple Formats:</strong> Convert to and from popular formats like JPG, PNG, WEBP, and GIF.</li>
              <li><strong>Quality Control:</strong> Adjust the compression quality for JPG and WEBP files to meet your needs.</li>
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
