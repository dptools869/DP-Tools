
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
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
            <h2>Create Clean URLs in Seconds.</h2>
            <p>Manually creating SEO-friendly permalinks from titles and headings can be time-consuming and often results in messy URLs. Our Permalink Generator simplifies URL creation, saving you time: paste your text or title, and it will instantly convert it into a clean, web-ready permalink you can use right away.</p>
            <p>This free web-based permalink tool is perfect for bloggers, web developers, content managers, and digital marketers who need properly formatted URLs fast. It helps you create search-engine optimized links while keeping everything readable and professional.</p>
          </div>

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
            <p>The tool gets it done in moments. Paste a title, add some text, or drop in multiple headings, and it will process everything and generate clean permalinks instantly. No need to manually format or worry about memorable characters —you get perfect results ready to copy or download right away.</p>
            <h3>Great for:</h3>
            <ul>
                <li>Bloggers create SEO-friendly URLs for articles, posts, and page titles.</li>
                <li>Web developers generate clean link structures for websites and applications.</li>
                <li>Content managers organize page URLs for CMS platforms and documentation sites.</li>
                <li>SEO specialists are building optimized URL structures for better search rankings.</li>
            </ul>
            <h2>How the Permalink Generator Functions: What Happens Behind the Scenes</h2>
            <p>The tool uses innovative text-processing technology to convert any text into URL-safe permalinks in seconds. It automatically removes special characters, converts spaces, and formats everything according to web standards.</p>
            <h3>What it handles:</h3>
            <ul>
                <li><strong>Quick Generation:</strong> Turns any text into a clean permalink immediately.</li>
                <li><strong>Various Formats:</strong> Creates lowercase URLs, hyphen-separated, underscore-separated, and custom styles.</li>
                <li><strong>Smart Cleaning:</strong> Automatically removes special characters, accents, and symbols.</li>
                <li><strong>Easy Downloads:</strong> Grab your generated permalinks in whatever format works best for you.</li>
            </ul>
            <h2>How does our Permalink Generator Work?</h2>
            <h3>Smart Processing Technology</h3>
            <p>The system examines every character, removing punctuation, converting spaces to hyphens, and lowercasing everything. It handles accented characters, special symbols, and unusual formatting automatically.</p>
            <h3>Multiple Input Support</h3>
            <p>Your content can be in any standard format —plain text, Word doc titles, CSV lists, or even bulk text. Just paste whatever you have, and permalinks get generated within moments, giving you the power to handle diverse content types.</p>
            <h3>Built-in Optimization Process</h3>
            <p>URLs get formatted according to best practices, removing stop words if needed, limiting length, and ensuring readability. The tool creates SEO-friendly structures while keeping your links meaningful and clean.</p>
            <h3>Ready to Use</h3>
            <p>Copy results straight to your clipboard, download as a list, or export to CSV. Whatever you need for your next project, the generated permalinks are prepared and waiting.</p>
            <h2>Why You Need a Permalink Generation Tool</h2>
            <p>A Permalink Generator streamlines URL creation and keeps everything consistent across all your web content. Whether you're building a new website, organizing blog posts, or restructuring existing pages, this tool handles it smoothly.</p>
            <p>Benefits include:</p>
            <ul>
                <li><strong>Faster Workflow:</strong> Generate dozens of clean URLs instantly instead of formatting manually.</li>
                <li><strong>Improved SEO:</strong> Create search-engine-friendly links that boost your rankings.</li>
                <li><strong>Better Consistency:</strong> Keep URL structure uniform throughout all your pages.</li>
                <li><strong>Clean Organization:</strong> Maintain professional link quality across everything you publish.</li>
            </ul>
            <p>This free generation tool prioritizes accuracy, speed, and SEO standards, helping you get more done in less time.</p>
            <h3>Secure and Confidential Processing</h3>
            <p>Your content passes through encrypted connections and gets wiped after generation completes. Nothing gets stored on our servers; we respect your privacy entirely, ensuring your data is secure and confidential.</p>
            <h2>Begin Generating Permalinks Right Now</h2>
            <p>Get clean, SEO-ready URLs with minimal effort.</p>
            <p>Paste your titles or content, pick your preferred URL style, and watch it transform instantly. No cost, lightning fast, and totally secure!</p>
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
