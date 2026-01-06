
'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, View, Image as ImageIcon, MoreHorizontal, CheckCircle, AlertCircle, Tv, Smartphone, History, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import Image from 'next/image';
import { cn } from '@/lib/utils';


// Helper to generate random-ish but consistent metadata
const useSampleMetadata = (seed: string) => {
  return useMemo(() => {
    // Using a simple hashing function to generate numbers from a seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }

    const views = (Math.abs(hash) % 5000 + 100) / 10;
    const time = (Math.abs(hash) % 20) + 1;
    return `${views.toFixed(1)}K views \u2022 ${time} hours ago`;
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
            <Image src={image} alt="Thumbnail" fill objectFit="cover" />
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


export function ThumbnailPreviewClient() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetImage(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    validateAndSetImage(file);
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

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style>{`
        .mobile-only-button {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-only-uploader {
            display: none;
          }
          .mobile-only-button {
            display: inline-flex;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <View className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Thumbnail Preview Generator | Free Online Tool</CardTitle>
              <CardDescription className="text-lg">
                Create and preview thumbnails instantly with our free Thumbnail Preview tool. Perfect for YouTube, blogs, and social media, quick, clear, and accurate.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Thumbnail Upload</CardTitle>
                <CardDescription>Upload a 1280x720 image to see how your thumbnail will look on YouTube.</CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto space-y-6">
                 {/* --- Desktop Uploader --- */}
                <div
                    className="desktop-only-uploader relative w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 sm:p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={handleUploadAreaClick}
                    role="button"
                    aria-label="Upload thumbnail for desktop"
                >
                    {image ? (
                        <div className="flex flex-col items-center gap-2">
                           <CheckCircle className="h-12 w-12 text-green-500" />
                           <span className="text-lg font-medium text-foreground">Image Accepted!</span>
                           <span className="text-sm text-muted-foreground">Drag a new file or tap to replace.</span>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center space-y-4">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <span className="text-lg font-medium text-foreground">
                                Drag & drop your 1280x720 thumbnail
                            </span>
                            <span className="text-muted-foreground">or tap to browse</span>
                        </div>
                    )}
                </div>

                {/* --- Mobile Uploader --- */}
                <Button asChild className="mobile-only-button w-full" size="lg">
                    <label htmlFor="thumbnail-upload-mobile">
                        <UploadCloud className="mr-2 h-5 w-5" />
                        Choose Thumbnail
                    </label>
                </Button>
                
                {/* --- Hidden file input for both --- */}
                <Input ref={fileInputRef} id="thumbnail-upload-mobile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />


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
          
           <div className="prose prose-lg dark:prose-invert max-w-none text-center my-12 hidden md:block">
            <p>Our Thumbnail Preview is free and lets you easily preview, test, and optimize your thumbnails across platforms without installing software.</p>
            <p>Thumbnail testing does not necessarily involve complexity. You are a designer, developer, content creator, or just a user: no matter your role, our online thumbnail preview tool makes your workflow easier.</p>
            <p>You can preview thumbnails for social media platforms, check how they appear in different sizes, test them for YouTube, blogs, or websites, or even verify their appearance for web design —all in your browser.</p>
            <p>No advanced editing software is required, and you do not need technical expertise. Our platform thumbnail preview tool is quick, user-friendly, and safe. All you need to do is upload your thumbnail, preview it across different platforms, and verify your optimized visual within a couple of seconds.</p>
          </div>

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
                 <PreviewCard title="Web - Sidebar" icon={<Monitor className="w-4 h-4"/>}><SidebarPreview image={image} title={title} seed="e5f6a1b2c3d4e5f6" /></PreviewCard>
                 <PreviewCard title="Apple TV" icon={<Tv className="w-4 h-4"/>}><AppleTVPreview image={image} title={title} /></PreviewCard>
              </div>
            </div>
          )}
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Our Most Popular Thumbnail Preview Features</h2>
            <ul>
              <li><strong>YouTube Thumbnail Preview:</strong> Preview thumbnails by width and height without quality loss. YouTube Thumbnail Preview helps create the proper look for videos, channel pages, search results, and recommended content. You are free to test proportions or have your own dimensions; your thumbnail will remain sharp and clear.</li>
              <li><strong>Facebook Thumbnail Preview:</strong> Large thumbnail files are time-consuming and can cause excessive loading time. Facebook Thumbnail Preview is used to test thumbnails without losing clarity or color quality.</li>
              <li><strong>Instagram Thumbnail Preview:</strong> Switch between feed view, story view, and profile view with a single mouse click. Our Instagram Thumbnail Preview is compatible with all platforms and devices and maintains quality.</li>
              <li><strong>Twitter/X Thumbnail Preview:</strong> Preview the appearance of your thumbnails on Twitter/X. The Twitter Thumbnail Preview lets you control the visual presentation, helping you create the perfect thumbnail for a social media platform or content layout.</li>
              <li><strong>LinkedIn Thumbnail Preview:</strong> Easily preview thumbnail appearance across different LinkedIn formats or verify thumbnails for posts or articles to get the best visual. Our LinkedIn Thumbnail Preview is easy and very powerful, as you can verify your thumbnail instantly.</li>
              <li><strong>Blog Thumbnail Preview:</strong> Content creators love precision. With our Blog Thumbnail Preview, you can immediately preview any thumbnail's appearance across different blog layouts, featured images, or post previews. Your thumbnails will always look correct, whether you are matching brand guidelines or perfecting your content. This tool will provide you with the utmost accuracy in your presentations.</li>
            </ul>

            <AdBanner type="top-banner" className="my-8"/>
            
            <h2>What Is So Special about our Online Thumbnail Preview?</h2>
            <p>Our thumbnail preview tool is fast, precise, and simple to use, and it will enable you to handle thumbnail testing in very little time. Here's why users choose us:</p>
            <ul>
              <li><strong>100% Free and Online:</strong> There is no downloading or registration; everything is in your web browser.</li>
              <li><strong>Lightning speed:</strong> Preview thumbnails in seconds, regardless of their size.</li>
              <li><strong>Quality Results:</strong> Intelligent preview and scaling ensure that your thumbnails are sharp and professional.</li>
              <li><strong>Secret and classified:</strong> Your files are stored safely and automatically removed from our servers after use.</li>
              <li><strong>Cross-Platform:</strong> Optimally works on desktop, tablet, and mobile.</li>
              <li><strong>All-in-One Solution:</strong> YouTube and Facebook to Instagram and blog previews—everything is in one place.</li>
            </ul>

            <h2>Perfect for Every Use Case</h2>
            <p>Our tool is designed to include all types of users:</p>
            <ul>
              <li><strong>Content Creators:</strong> Optimize thumbnails to have good engagement on platforms.</li>
              <li><strong>Marketers:</strong> Develop social media-ready thumbnails without outsourcing.</li>
              <li><strong>YouTubers:</strong> Preview thumbnail appearances easily by testing across different views.</li>
              <li><strong>Students and Teachers:</strong> Prepare thumbnails on projects, assignments, and presentations.</li>
              <li><strong>Business Owners:</strong> Control thumbnail images or marketing visuals consistently in terms of quality and appearance.</li>
            </ul>

            <h2>Safe, Secure, and Private</h2>
            <p>We value your privacy. All thumbnails uploaded to it are done safely in encrypted links. As soon as your thumbnail is previewed, tested, or verified, it will be automatically removed from our servers. You always have complete control over your content. We want to give you the freedom to preview and optimize your thumbnails while ensuring your data remains secure.</p>
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

    