

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calculator, FileText, ImageIcon, Send, View, Palette, Crop, Ratio, Link as LinkIcon, CaseSensitive, Bolt, UserPlus, Mail, Ruler, KeyRound, Wifi, Gem, Zap, Lock } from 'lucide-react';
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
    title: 'Image Resizer',
    description: 'Change the dimensions of your images quickly by percentage or pixels.',
    icon: <Ruler className="w-12 h-12 text-primary" />,
    href: '/tools/image/resize',
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
    title: 'Internet Speed Checker',
    description: 'Test your internet download and upload speed.',
    icon: <Wifi className="w-12 h-12 text-primary" />,
    href: '/tools/internet-speed-checker',
  },
   {
    title: 'Password Generator',
    description: 'Generate strong, secure passwords for your social media accounts.',
    icon: <KeyRound className="w-12 h-12 text-primary" />,
    href: '/tools/text/password-generator',
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
  },
  {
    title: 'Email Extractor',
    description: 'Extract email addresses from any text.',
    icon: <Mail className="w-12 h-12 text-primary" />,
    href: '/tools/text/email-extractor',
  }
];

const youtubeVideos = [
  'https://www.youtube.com/watch?v=k_2k-4K0fM4',
  'https://www.youtube.com/watch?v=GQpP-1oAN_A',
  'https://www.youtube.com/watch?v=F1OK94tJ9_E',
];

const features = [
  { text: 'No Sign-Up Required', icon: <Lock className="w-5 h-5 text-primary" /> },
  { text: 'Always Free to Use', icon: <Gem className="w-5 h-5 text-primary" /> },
  { text: 'Fast & Secure', icon: <Zap className="w-5 h-5 text-primary" /> },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[60vh] w-full flex items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-green-900 via-card to-black">
        <div className="relative z-10 flex flex-col items-center gap-4 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-headline animate-fade-in-down">
            DP Tools – Smart, Simple & Free Online Tools
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl md:text-2xl text-foreground/80 animate-fade-in-up">
            Get quick access to calculators, PDF tools, and image utilities. Stay tuned – we’re expanding with new tools every month.
          </p>
           <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-fade-in-up">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span className="font-semibold text-md sm:text-lg text-foreground group-hover:text-primary transition-colors">{feature.text}</span>
              </div>
            ))}
          </div>
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
                <Button asChild size="lg">
                  <Link href="https://linktr.ee/DIGITAL_PIYUSH" target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Us
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
