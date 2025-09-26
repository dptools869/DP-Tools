
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, View, Image as ImageIcon, Search, ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import Image from 'next/image';

export default function ThumbnailPreviewPage() {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a valid image file.',
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a valid image file.',
      });
    }
  };
  
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
                See how your thumbnail will look on YouTube before you publish.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Label
                    htmlFor="thumbnail-upload"
                    className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {thumbnail ? (
                        <Image src={thumbnail} alt="Uploaded thumbnail" width={1280} height={720} className="w-full h-auto rounded-md object-contain max-h-48" />
                    ) : (
                         <div className="flex flex-col items-center space-y-4">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <span className="text-lg font-medium text-foreground">
                                Drag & drop your thumbnail image here
                            </span>
                            <span className="text-muted-foreground">or click to browse</span>
                        </div>
                    )}
                   
                    <Input id="thumbnail-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </Label>
            </CardContent>
          </Card>

          {thumbnail && (
            <Tabs defaultValue="video-page" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="video-page">Video Page</TabsTrigger>
                <TabsTrigger value="home-feed">Home Feed</TabsTrigger>
                <TabsTrigger value="channel-page">Channel Page</TabsTrigger>
              </TabsList>

              <TabsContent value="video-page" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Video Page Preview (Desktop)</CardTitle></CardHeader>
                  <CardContent className="bg-muted/30 p-4 md:p-8 rounded-lg">
                    <div className="bg-[#0f0f0f] text-white rounded-lg overflow-hidden shadow-2xl">
                        <div className="aspect-video w-full bg-black flex items-center justify-center">
                            <Image src={thumbnail} alt="Thumbnail" width={1280} height={720} className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-4">
                            <h1 className="text-xl font-bold">Your Awesome Video Title Goes Here</h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                                    <div>
                                        <p className="font-semibold text-white">Your Channel</p>
                                        <p>1.23M subscribers</p>
                                    </div>
                                </div>
                                <Button variant="secondary" className="bg-white text-black hover:bg-gray-200 rounded-full ml-4">Subscribe</Button>
                                <div className="flex items-center gap-2 ml-auto">
                                    <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 rounded-full">
                                        <ThumbsUp className="mr-2"/> 15K
                                    </Button>
                                     <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 rounded-full">
                                        <Share2 className="mr-2"/> Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="home-feed" className="mt-6">
                <Card>
                  <CardHeader><CardTitle>Home Feed / Search Results</CardTitle></CardHeader>
                  <CardContent className="bg-muted/30 p-4 rounded-lg space-y-6">
                    {/* Desktop View */}
                    <div>
                        <h3 className="font-semibold mb-2">Desktop View</h3>
                        <div className="bg-[#0f0f0f] p-4 rounded-lg">
                             <div className="flex gap-4">
                                <div className="w-64 flex-shrink-0">
                                     <Image src={thumbnail} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover"/>
                                </div>
                                <div className="text-white">
                                    <h4 className="font-bold text-lg">Your Awesome Video Title Goes Here</h4>
                                    <p className="text-sm text-gray-400">1.2M views • 2 weeks ago</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                                        <p className="text-sm text-gray-400 font-semibold">Your Channel</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">A short, catchy description of your video content to draw viewers in and get them to click...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Mobile View */}
                    <div>
                        <h3 className="font-semibold mb-2">Mobile View</h3>
                        <div className="bg-[#0f0f0f] p-2 rounded-lg max-w-sm mx-auto">
                             <div className="flex flex-col">
                                <Image src={thumbnail} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover"/>
                                <div className="flex gap-3 p-3 text-white">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 mt-1 flex-shrink-0"></div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-base line-clamp-2">Your Awesome Video Title Goes Here</h4>
                                        <p className="text-xs text-gray-400">Your Channel • 1.2M views • 2 weeks ago</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-white"><MoreHorizontal /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="channel-page" className="mt-6">
                <Card>
                   <CardHeader><CardTitle>Channel Page Video Grid</CardTitle></CardHeader>
                   <CardContent className="bg-muted/30 p-4 rounded-lg">
                        <div className="bg-[#0f0f0f] p-4 rounded-lg">
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                     <div key={i}>
                                        <Image src={thumbnail} alt="Thumbnail" width={1280} height={720} className="w-full h-auto rounded-lg aspect-video object-cover"/>
                                        <div className="text-white mt-2">
                                            <h5 className="font-semibold text-sm line-clamp-2">Your Awesome Video Title</h5>
                                            <p className="text-xs text-gray-400">1.2M views</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
