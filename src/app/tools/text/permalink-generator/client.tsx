
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Copy, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

const generateSlug = (text: string, separator: string, maxLength: number): string => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  let slug = text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

  if (separator !== '-') {
      slug = slug.replace(/-/g, separator);
  }
  
  if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength);
      // Ensure we don't cut in the middle of a word if possible
      if (slug.includes(separator)) {
        slug = slug.substring(0, slug.lastIndexOf(separator));
      }
  }

  return slug;
};


export function PermalinkGeneratorClient() {
  const [title, setTitle] = useState('');
  const [separator, setSeparator] = useState('-');
  const [maxLength, setMaxLength] = useState(60);
  const { toast } = useToast();
  
  const slug = useMemo(() => {
      return generateSlug(title, separator, maxLength);
  }, [title, separator, maxLength]);

  const handleCopy = () => {
    if (slug) {
        navigator.clipboard.writeText(slug);
        toast({
            title: 'Copied to clipboard!',
            description: slug,
        });
    }
  };

  const handleReset = () => {
      setTitle('');
      setSeparator('-');
      setMaxLength(60);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <LinkIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Free Permalink Generator | Create SEO-Friendly URLs</CardTitle>
              <CardDescription className="text-lg">
                Generate clean, keyword-rich, and SEO-friendly URLs with our free Permalink Generator. Perfect for blogs, eCommerce, and websites. Fast, simple, and accurate.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Generate Your Permalink</CardTitle>
                <CardDescription>Enter your post title to create an optimized URL slug.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title-input">Title or Text</Label>
                    <Input id="title-input" placeholder="e.g., My Awesome Blog Post" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg h-12" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label>Separator</Label>
                        <RadioGroup value={separator} onValueChange={(val) => setSeparator(val)} className="flex gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="-" id="hyphen" /><Label htmlFor="hyphen">Hyphen (-)</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="_" id="underscore" /><Label htmlFor="underscore">Underscore (_)</Label></div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="max-length">Max Length</Label>
                            <span className="text-sm font-medium">{maxLength}</span>
                        </div>
                        <Slider id="max-length" value={[maxLength]} onValueChange={(val) => setMaxLength(val[0])} min={20} max={100} step={5} />
                    </div>
                </div>

                {title && (
                    <div className="space-y-2 pt-4 border-t">
                        <Label>Generated Permalink</Label>
                        <div className="flex gap-2">
                           <Input value={slug} readOnly className="font-mono bg-muted text-lg h-12" />
                           <Button onClick={handleCopy} variant="outline" size="icon" aria-label="Copy permalink"><Copy className="w-5 h-5"/></Button>
                        </div>
                    </div>
                )}
                
              </CardContent>
              <CardFooter>
                 <Button onClick={handleReset} variant="ghost"><RefreshCw className="mr-2 h-4 w-4"/> Reset</Button>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>What is a Permalink and Why is it Important?</h2>
            <p>A permalink, or permanent link, is the full URL you see for a webpage. A clean, descriptive, and SEO-friendly permalink is crucial for both user experience and search engine optimization. It helps users and search engines understand what the page is about at a glance. Our Permalink Generator helps you create these optimized URL "slugs" instantly.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Best Practices for Permalinks</h3>
             <ul>
              <li><strong>Keep it Short and Descriptive:</strong> A good permalink is concise and clearly indicates the content of the page.</li>
              <li><strong>Use Keywords:</strong> Including your primary keyword helps search engines understand and rank your page.</li>
              <li><strong>Use Hyphens as Separators:</strong> Hyphens are the standard and most search engine-friendly way to separate words in a URL.</li>
              <li><strong>Use Lowercase Letters:</strong> To avoid potential issues with duplicate content on case-sensitive servers, always use lowercase.</li>
              <li><strong>Remove Stop Words:</strong> Words like "a", "an", "the", "and" can often be removed to make the slug shorter without losing meaning.</li>
            </ul>
            <p>Our tool automates these best practices for you. Simply type your blog post title, and it will instantly generate a clean, optimized permalink ready for you to copy and paste into your content management system (CMS) like WordPress, Shopify, or any other platform.</p>
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
