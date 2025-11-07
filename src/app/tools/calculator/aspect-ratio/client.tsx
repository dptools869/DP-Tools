
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ratio, ArrowRight, X } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Button } from '@/components/ui/button';

export function AspectRatioClient() {
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Ratio className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Free Aspect Ratio Calculator | Maintain Perfect Dimensions Online</CardTitle>
              <CardDescription className="text-lg">
                Use our free Aspect Ratio Calculator to find the perfect width and height for images or videos. Keep visuals proportional, professional, and distortion-free instantly.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
              <h2>Keep Every Pixel in Perfect Proportion</h2>
              <p>Be it editing pictures, making videos, or designing web- or print-based graphics, it is essential to maintain the correct aspect ratio. An inappropriate ratio can make your images look stretched, squashed, or unprofessional.</p>
              <p>With our free Aspect Ratio Calculator, if you know the exact dimensions you want to use, you can adjust them using our tool instantly, accurately, and without any guesswork.</p>
          </div>

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
            <p>The aspect ratio is the ratio of an image or video's width to its height. For example, a 16:9 ratio indicates that the image is 16 units wide for every nine units of height—the most common ratio of modern screens. Using our calculator, you can quickly adjust one dimension while keeping the other in the correct proportion.</p>
            <p>This is an ideal tool for photographers, graphic designers, video editors, social media creators, and web developers who want their visuals to look very professional and balanced across devices and platforms.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Aspect ratio Calculator: How to Use it.</h3>
            <p>Using our calculator is simple; no math or design experience is required.</p>
            <ol>
                <li><strong>Enter dimensions original size:</strong> Enter the width and height of your image or video.</li>
                <li><strong>Resize your image:</strong> Choose the width and height you want.</li>
                <li><strong>Calculate an ideal proportion:</strong> The calculator is programmed to compute the missing value to maintain the same ratio.</li>
            </ol>
            <p>Once you have the results, you can use the new dimensions in your image editor, video software, or website layout, ensuring a perfect fit every time.</p>
            <h3>Why Aspect Ratios Matter</h3>
            <p>Aspect ratios describe how your images will look on your screens, in print, and on the internet. Incorrect ratios will cause distortion, video cropping, or black bars. The correct ratio will make your work appear consistent, professional, and pleasing to the eye, regardless of the display's location.</p>
            <p>For example:</p>
            <ul>
                <li>Photographers cut pictures without compromising on the quality.</li>
                <li>YouTube (16:9) or TikTok (9:16) are the video formats that video editors export.</li>
                <li>Designers rely on it to maintain balance in website layouts or posters.</li>
                <li>Social media managers use it to resize content to fit each platform perfectly.</li>
            </ul>
            <h3>Key Features of Our Aspect Ratio Calculator</h3>
            <ul>
                <li><strong>Proper Dimensions:</strong> Achieve accurate dimensions anytime.</li>
                <li><strong>Instant Results:</strong> There are no numbers to write or complex procedures to follow to get results; enter the numbers and see them immediately.</li>
                <li><strong>Support All Setting Ratios:</strong> From 1:1 to 4:3 up to 16:1 (and 9:16 to 16:1), you can get any.</li>
                <li><strong>Maintain Image Resolution:</strong> When resizing images, avoid stretching or squashing.</li>
                <li><strong>Free and Secure:</strong> 100% web-based, no downloads or sign-ups.</li>
                <li><strong>Creator-Friendly:</strong> Photographers, videographers, and content creators are busy people who appreciate a fast, free web development platform that is easy to use.</li>
            </ul>
            <h3>Why Choose DP Tools Aspect Ratio Calculator?</h3>
            <p>At DPTools, we specialize in providing free, trustworthy, and easy-to-use tools to simplify daily computer tasks. Our Aspect Ratio Calculator is the tool that ensures your images and videos always appear professional, clean, and ready to go to press. It is quick, web-based, and requires no registration —enter your information, press calculate, and get your results in a flash.</p>
            <h2>Start Calculating Now</h2>
            <p>No need for complex software or tedious resizing. Use our Aspect Ratio Calculator today to maintain perfect proportions across all your visual projects. Whether you're resizing a photo for Instagram, editing a YouTube video, or designing a poster, this tool ensures your work looks sharp and balanced, every single time.</p>
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
