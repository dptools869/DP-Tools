

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calculator, FileText, ImageIcon, Send, View, Palette, Crop, Ratio, Link as LinkIcon, CaseSensitive, Bolt, UserPlus } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { YouTubeEmbed } from '@/components/youtube-embed';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const categories = [
  {
    title: 'PDF Tools',
    description: 'Merge, split, compress, and convert your PDF files with ease.',
    icon: <FileText className="w-12 h-12 text-primary" />,
    href: '/pdf-tools',
  },
  {
    title: 'Image Tools',
    description: 'Resize, crop, convert, and edit your images in seconds.',
    icon: <ImageIcon className="w-12 h-12 text-primary" />,
    href: '/image-tools',
  },
  {
    title: 'Text & SEO Tools',
    description: 'A collection of tools to analyze and manipulate text.',
    icon: <CaseSensitive className="w-12 h-12 text-primary" />,
    href: '/text-tools',
  },
  {
    title: 'Calculator Tools',
    description: 'A collection of calculators for finance, health, and mathematics.',
    icon: <Calculator className="w-12 h-12 text-primary" />,
    href: '/calculator-tools',
  },
  {
    title: 'Thumbnail Preview',
    description: 'See how your video thumbnails will look on different platforms.',
    icon: <View className="w-12 h-12 text-primary" />,
    href: '/thumbnail-preview',
  },
   {
    title: 'Color Picker',
    description: 'Explore colors, get codes, and create palettes for your projects.',
    icon: <Palette className="w-12 h-12 text-primary" />,
    href: '/tools/image/color-picker',
  },
  {
    title: 'Circle Crop Tool',
    description: 'Crop your images into a perfect circle for profiles and logos.',
    icon: <Crop className="w-12 h-12 text-primary" />,
    href: '/tools/image/circle-crop',
  },
  {
    title: 'Aspect Ratio Calculator',
    description: 'Calculate image dimensions for a specific aspect ratio.',
    icon: <Ratio className="w-12 h-12 text-primary" />,
    href: '/tools/calculator/aspect-ratio',
  },
  {
    title: 'Permalink Generator',
    description: 'Create clean, SEO-friendly URLs for your blog posts and pages.',
    icon: <LinkIcon className="w-12 h-12 text-primary" />,
    href: '/tools/text/permalink-generator',
  },
  {
    title: 'Energy Consumption Calculator',
    description: 'Estimate your electricity usage and cost.',
    icon: <Bolt className="w-12 h-12 text-primary" />,
    href: '/tools/calculator/energy-consumption',
  },
  {
    title: 'Nickname Generator',
    description: 'Generate creative and unique nicknames.',
    icon: <UserPlus className="w-12 h-12 text-primary" />,
    href: '/tools/text/nickname-generator',
  }
];

const youtubeVideos = [
  'https://www.youtube.com/watch?v=k_2k-4K0fM4',
  'https://www.youtube.com/watch?v=GQpP-1oAN_A',
  'https://www.youtube.com/watch?v=F1OK94tJ9_E',
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-green-900 via-card to-black">
        <div className="relative z-10 flex flex-col items-center gap-4 p-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-headline animate-fade-in-down">
            The Ultimate Suite of Online Tools
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-foreground/80 animate-fade-in-up">
            From <span className="text-green-400">PDFs</span> and <span className="text-blue-400">Images</span> to everyday calculations.
          </p>
          <p className="max-w-2xl text-md md:text-lg text-muted-foreground animate-fade-in-up animation-delay-300">
            Fast, reliable, and smart utilities for all your digital needs.
          </p>
        </div>
      </section>

      <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* Top Banner Ad */}
            <AdBanner type="top-banner" />

            {/* Main Categories Section */}
            <section id="categories" className="scroll-mt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <Card key={category.title} className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                    <CardHeader className="items-center text-center">
                      {category.icon}
                      <CardTitle className="text-2xl font-headline mt-4">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription>{category.description}</CardDescription>
                      <Button asChild variant="ghost" className="mt-4 text-primary hover:text-accent-foreground">
                        <Link href={category.href}>
                          Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* YouTube & Telegram Section */}
            <section>
              <h2 className="text-3xl font-bold text-center mb-8 font-headline">Learn & Connect</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {youtubeVideos.map((url, index) => (
                  <div key={index}>
                    <YouTubeEmbed url={url} />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-5 w-5" />
                    Join our Telegram Channel
                  </Link>
                </Button>
              </div>
            </section>

            {/* Bottom Banner Ad */}
            <AdBanner type="bottom-banner" />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8 sticky top-24 self-start">
            <AdBanner type="sidebar" />
            <AdBanner type="sidebar" />
          </aside>
        </div>
      </div>
    </div>
  );
}
