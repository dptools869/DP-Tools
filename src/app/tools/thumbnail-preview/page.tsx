

'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, View, Image as ImageIcon, Search, ThumbsUp, MessageCircle, Share2, MoreHorizontal, CheckCircle, AlertCircle, Tv, Smartphone, History, ListVideo, Monitor, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import Image from 'next/image';
import { cn } from '@/lib/utils';


// Helper to generate random-ish but consistent metadata
const useSampleMetadata = (seed: string) => {
  return useMemo(() => {
    const views = (parseInt(seed.slice(0, 5), 16) % 500 + 10) / 10;
    const time = (parseInt(seed.slice(5, 10), 16) % 12) + 1;
    return `${views.toFixed(1)}k views \u2022 ${time} hours ago`;
  }, [seed]);
};

// Preview Components
const PreviewCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="border rounded-lg overflow-hidden bg-card/50">
    <div className="p-3 bg-muted/30 border-b flex items-center gap-2">
      {icon}
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="p-4 flex justify-center">{children}</div>
  </div>
);

const WebHomeLargePreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
  const metadata = useSampleMetadata(seed);
  return (
    <div className="w-full max-w-md">
      <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover" />
      <div className="flex gap-3 pt-3">
        <div className="w-9 h-9 rounded-full bg-muted mt-1 flex-shrink-0"></div>
        <div className="flex-grow">
          <h4 className="font-bold text-base line-clamp-2 leading-snug">{title || "Your Awesome Video Title"}</h4>
          <p className="text-xs text-muted-foreground mt-1">Your Channel</p>
          <p className="text-xs text-muted-foreground">{metadata}</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );
};

const WebHomeSmallPreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
  const metadata = useSampleMetadata(seed);
  return (
    <div className="w-full max-w-sm">
      <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover" />
      <div className="flex gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-muted mt-1 flex-shrink-0"></div>
        <div className="flex-grow">
          <h4 className="font-semibold text-sm line-clamp-2 leading-snug">{title || "Your Awesome Video Title"}</h4>
          <p className="text-xs text-muted-foreground mt-1">Your Channel</p>
          <p className="text-xs text-muted-foreground">{metadata}</p>
        </div>
      </div>
    </div>
  );
};

const SidebarPreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
  const metadata = useSampleMetadata(seed);
  return (
    <div className="flex gap-2 w-full max-w-xs">
      <div className="w-40 flex-shrink-0">
        <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-md aspect-video object-cover" />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-xs line-clamp-2 leading-tight">{title || "Your Awesome Video Title"}</h4>
        <p className="text-xs text-muted-foreground mt-1">Your Channel</p>
        <p className="text-xs text-muted-foreground">{metadata}</p>
      </div>
    </div>
  );
};

const ChannelPageGridPreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
    const metadata = useSampleMetadata(seed);
    return (
      <div className="w-full max-w-xs">
        <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover" />
        <div className="pt-2">
          <h4 className="font-semibold text-sm line-clamp-2 leading-snug">{title || "Your Awesome Video Title"}</h4>
          <p className="text-xs text-muted-foreground mt-1">{metadata}</p>
        </div>
      </div>
    );
};

const HistoryListPreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
    const metadata = useSampleMetadata(seed);
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <div className="w-full sm:w-56 flex-shrink-0">
          <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover" />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-base line-clamp-2 leading-snug">{title || "Your Awesome Video Title"}</h4>
          <p className="text-sm text-muted-foreground mt-1">Your Channel \u2022 {metadata}</p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    );
};

const MobileHomePreview = ({ image, title, seed }: { image: string, title: string, seed: string }) => {
    const metadata = useSampleMetadata(seed);
    return (
        <div className="bg-background max-w-sm mx-auto rounded-md border w-full">
            <Image src={image} alt="Thumbnail" width={1280} height={720} className="w-full h-auto aspect-video object-cover"/>
            <div className="flex gap-3 p-3">
                <div className="w-9 h-9 rounded-full bg-muted mt-1 flex-shrink-0"></div>
                <div className="flex-grow">
                    <h4 className="font-semibold text-sm line-clamp-2">{title || "Your Awesome Video Title"}</h4>
                    <p className="text-xs text-muted-foreground">Your Channel \u2022 {metadata}</p>
                </div>
                <MoreHorizontal className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
        </div>
    );
}

const AppleTVPreview = ({ image, title }: { image: string, title: string }) => {
    return (
        <div className="relative aspect-video w-full max-w-xl rounded-lg overflow-hidden bg-muted">
            <Image src={image} alt="Thumbnail" layout="fill" objectFit="cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="font-bold text-lg sm:text-2xl text-white shadow-lg line-clamp-2">{title || "Your Awesome Video Title"}</h4>
                <p className="text-sm sm:text-base text-white/80 shadow-md mt-1">Your Channel</p>
            </div>
        </div>
    );
}

const OriginalImagePreview = ({ image }: { image: string }) => {
    return (
        <div className="w-full max-w-2xl">
            <Image src={image} alt="Original Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg border-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">Original size: 1280 × 720 px</p>
        </div>
    );
}


export default function ThumbnailPreviewPage() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetImage(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    validateAndSetImage(file);
  };
  
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndSetImage = (file: File | undefined | null) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                if (img.naturalWidth === 1280 && img.naturalHeight === 720) {
                    setImage(img.src);
                    setError(null);
                    toast({
                        variant: 'default',
                        className: 'bg-green-100 dark:bg-green-900 border-green-500',
                        title: 'Image accepted',
                        description: 'Exact 1280x720 dimensions verified.',
                    });
                } else {
                    setImage(null);
                    setError(`Image must be exactly 1280 × 720 pixels. Your image is ${img.naturalWidth} × ${img.naturalHeight}.`);
                }
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
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <View className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">YouTube Thumbnail Preview</CardTitle>
              <CardDescription className="text-lg">
                Upload a 1280x720 image to see how your thumbnail will look on YouTube.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                    {/* Desktop Uploader */}
                    <div
                        className="relative hidden md:block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 sm:p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={handleUploadAreaClick}
                        role="button"
                        aria-label="Upload thumbnail"
                    >
                        {image ? (
                            <div className="flex flex-col items-center gap-2">
                               <CheckCircle className="h-12 w-12 text-green-500" />
                               <span className="text-lg font-medium text-foreground">Image Accepted!</span>
                               <span className="text-sm text-muted-foreground">Drag a new file or click to replace.</span>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center space-y-4">
                                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                                <span className="text-lg font-medium text-foreground">
                                    Drag & drop your 1280x720 thumbnail
                                </span>
                                <span className="text-muted-foreground">or click to browse</span>
                            </div>
                        )}
                       
                        <Input ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </div>

                    {/* Mobile Uploader */}
                    <div className="block md:hidden">
                        <Label htmlFor="thumbnail-upload-mobile" className="mb-2 block">Upload Thumbnail (1280x720)</Label>
                        <Input id="thumbnail-upload-mobile" type="file" className="w-full" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-destructive font-medium p-3 rounded-md bg-destructive/10 border border-destructive/20">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
                 <div className="space-y-2">
                    <Label htmlFor="title-input">Enter your title</Label>
                    <Input id="title-input" placeholder="Enter your title — see how it looks" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
            </CardContent>
          </Card>

          {image && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold font-headline mb-6 text-center">Thumbnail Previews</h2>
              <div className="grid grid-cols-1 gap-8">
                 <PreviewCard title="Original Image" icon={<ImageIcon className="w-4 h-4"/>}><OriginalImagePreview image={image} /></PreviewCard>
                 <PreviewCard title="Web - Channel Page (Large)" icon={<Monitor className="w-4 h-4"/>}><WebHomeLargePreview image={image} title={title} seed="a1b2c3d4e5f6" /></PreviewCard>
                 <PreviewCard title="Web - History/List View" icon={<History className="w-4 h-4"/>}><HistoryListPreview image={image} title={title} seed="f6e5d4c3b2a1" /></PreviewCard>
                 <PreviewCard title="Web - Home Feed (Small)" icon={<Monitor className="w-4 h-4"/>}><WebHomeSmallPreview image={image} title={title} seed="1a2b3c4d5e6f" /></PreviewCard>
                 <PreviewCard title="Mobile - Home Feed" icon={<Smartphone className="w-4 h-4"/>}><MobileHomePreview image={image} title={title} seed="6f5e4d3c2b1a" /></PreviewCard>
                 <PreviewCard title="Web - Channel Page (Small Grid)" icon={<Monitor className="w-4 h-4"/>}><ChannelPageGridPreview image={image} title={title} seed="c3b2a1d4e5f6" /></PreviewCard>
                 <PreviewCard title="Web - Sidebar" icon={<Monitor className="w-4 h-4"/>}><SidebarPreview image={image} title={title} seed="e5f6a1b2c3d4" /></PreviewCard>
                 <PreviewCard title="Apple TV" icon={<Tv className="w-4 h-4"/>}><AppleTVPreview image={image} title={title} /></PreviewCard>
              </div>
            </div>
          )}
          
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

