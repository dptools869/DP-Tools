
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio, ArrowRight, X } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Button } from '@/components/ui/button';

export default function AspectRatioCalculatorPage() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('');
  const [h2, setH2] = useState('');
  const [lastChanged, setLastChanged] = useState<'w2' | 'h2' | null>(null);

  useMemo(() => {
    const originalWidth = parseFloat(w1);
    const originalHeight = parseFloat(h1);
    const newWidth = parseFloat(w2);
    const newHeight = parseFloat(h2);

    if (isNaN(originalWidth) || isNaN(originalHeight) || originalWidth <= 0 || originalHeight <= 0) {
      return;
    }

    if (lastChanged === 'w2' && !isNaN(newWidth)) {
      const calculatedHeight = (newWidth * originalHeight) / originalWidth;
      setH2(Math.round(calculatedHeight).toString());
    } else if (lastChanged === 'h2' && !isNaN(newHeight)) {
      const calculatedWidth = (newHeight * originalWidth) / originalHeight;
      setW2(Math.round(calculatedWidth).toString());
    }
  }, [w1, h1, w2, h2, lastChanged]);
  
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const simplifiedRatio = useMemo(() => {
      const width = parseFloat(w1);
      const height = parseFloat(h1);
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) return 'N/A';
      const divisor = gcd(width, height);
      return `${width / divisor}:${height / divisor}`;
  }, [w1, h1]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <AspectRatio className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Aspect Ratio Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate image dimensions for a specific aspect ratio.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Calculate Dimensions</CardTitle>
                <CardDescription>Enter your original dimensions and one new dimension to find the other.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {/* Original Dimensions */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <Label className="font-bold">Original Size</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" placeholder="Width 1" value={w1} onChange={e => setW1(e.target.value)} />
                            <X className="w-4 h-4 text-muted-foreground" />
                            <Input type="number" placeholder="Height 1" value={h1} onChange={e => setH1(e.target.value)} />
                        </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-muted-foreground justify-self-center hidden sm:block"/>

                    {/* New Dimensions */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <Label className="font-bold">New Size</Label>
                        <div className="flex items-center gap-2">
                             <Input type="number" placeholder="Width 2" value={w2} onChange={e => {setW2(e.target.value); setLastChanged('w2')}} />
                            <X className="w-4 h-4 text-muted-foreground" />
                            <Input type="number" placeholder="Height 2" value={h2} onChange={e => {setH2(e.target.value); setLastChanged('h2')}} />
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex justify-center items-center text-center">
                  <div>
                    <Label className="text-sm font-normal">Simplified Aspect Ratio</Label>
                    <div className="text-4xl font-bold text-primary">{simplifiedRatio}</div>
                  </div>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Aspect Ratio</h2>
            <p>Aspect ratio describes the proportional relationship between the width and height of an image or screen. It's written as two numbers separated by a colon, such as 16:9. Understanding and calculating aspect ratios is crucial for designers, photographers, and video editors to ensure that images and videos are displayed correctly without distortion.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How to Calculate Aspect Ratio</h3>
            <p>To calculate a new dimension while maintaining the aspect ratio, you can use a simple cross-multiplication formula:</p>
            <p><strong>(Original Width / Original Height) = (New Width / New Height)</strong></p>
            <p>Our calculator automates this for you. Just enter your original dimensions (W1 and H1). Then, enter one of the new dimensions you want (either W2 or H2), and the calculator will find the corresponding dimension that preserves the original aspect ratio.</p>
            
            <h3>Common Aspect Ratios</h3>
             <ul>
              <li><strong>16:9:</strong> The standard for widescreen displays, including HDTVs, computer monitors, and most online video.</li>
              <li><strong>4:3:</strong> The standard for older televisions and computer monitors.</li>
              <li><strong>1:1:</strong> The square format popular on social media platforms like Instagram.</li>
              <li><strong>3:2:</strong> Common in photography, used by many DSLR and mirrorless cameras.</li>
            </ul>
            <p>Whether you're resizing a photo for a blog post, cropping a video for social media, or designing a graphic for a specific display, our Aspect Ratio Calculator makes it easy to get your dimensions right every time.</p>
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
