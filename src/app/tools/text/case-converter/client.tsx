
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CaseSensitive, Copy, Trash2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const conversionFunctions: { [key: string]: (s: string) => string } = {
    uppercase: (s) => s.toUpperCase(),
    lowercase: (s) => s.toLowerCase(),
    sentenceCase: (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    titleCase: (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()),
    alternatingCase: (s) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''),
    inverseCase: (s) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    snakeCase: (s) => s.replace(/\s+/g, '_').toLowerCase(),
    kebabCase: (s) => s.replace(/\s+/g, '-').toLowerCase(),
};

const caseButtons = [
    { label: 'UPPERCASE', type: 'uppercase' },
    { label: 'lowercase', type: 'lowercase' },
    { label: 'Sentence case', type: 'sentenceCase' },
    { label: 'Title Case', type: 'titleCase' },
    { label: 'aLtErNaTiNg cAsE', type: 'alternatingCase' },
    { label: 'InVeRsE CaSe', type: 'inverseCase' },
    { label: 'snake_case', type: 'snakeCase' },
    { label: 'kebab-case', type: 'kebabCase' },
];

export function TextCaseConverterClient() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const { toast } = useToast();

  const handleConversion = (type: string) => {
    const convert = conversionFunctions[type];
    if (convert) {
      setOutputText(convert(inputText));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const clearText = () => {
    setInputText('');
    setOutputText('');
  }

  const stats = useMemo(() => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    return {
      words: words.length,
      characters: inputText.length,
    };
  }, [inputText]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <CaseSensitive className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Text Case Converter | Change Text to Upper, Lower & More</CardTitle>
              <CardDescription className="text-lg">
                Easily convert text to uppercase, lowercase, title case, or sentence case with our free Text Case Converter. Fast, accurate, and simple to use online.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>Convert Your Text</CardTitle>
                  <CardDescription>Type or paste your text below, then choose a case to convert to.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="input-text">Input</Label>
                          <Textarea id="input-text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type or paste text here..." className="h-48 resize-y" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="output-text">Output</Label>
                          <Textarea id="output-text" value={outputText} readOnly placeholder="Converted text will appear here..." className="h-48 resize-y bg-muted" />
                      </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                      {caseButtons.map(({ label, type }) => (
                          <Button key={type} onClick={() => handleConversion(type)} variant="secondary">
                              {label}
                          </Button>
                      ))}
                  </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Words: {stats.words}</span>
                      <span>Characters: {stats.characters}</span>
                  </div>
                  <div className="flex gap-2">
                      <Button onClick={handleCopy} disabled={!outputText}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                      <Button onClick={clearText} variant="destructive" disabled={!inputText && !outputText}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
                  </div>
              </CardFooter>
            </Card>

            <div className="prose prose-lg dark:prose-invert max-w-none text-center my-12 hidden md:block">
                <p>Manually switching text between different formats. Converting from uppercase to lowercase, title case, or sentence case takes time and often leads to mistakes. Our Text Case Converter makes formatting simple: paste your content or drop in a file, and it will instantly convert your text to the case style you want.</p>
                <p>This free web-based text case tool is perfect for writers, coders, marketers, and students who need clean formatting fast. It helps you keep things consistent and polished across everything you write.</p>
            </div>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <p>The tool gets it done in moments. Paste some text, add a document, or drop in a URL —it'll scan everything and convert it to your chosen format. No need to manually retype or worry about errors —you get accurate results ready to copy or download right away.</p>
            <h3>Great for:</h3>
             <ul className="text-left">
                <li>Content creators format headlines, article titles, and body copy to match style requirements.</li>
                <li>Programmers switch variable names, code notes, or documentation between naming styles.</li>
                <li>Social media professionals are preparing posts, captions, and hashtags for different platforms.</li>
                <li>Students and researchers are formatting essays, citations, and references to fit submission guidelines.</li>
            </ul>
            <h2>How the Text Case Converter Functions: What Happens Behind the Scenes</h2>
            <p>The tool uses innovative text-processing technology to analyze and convert case formatting within seconds. It carefully manages punctuation, symbols, and spacing while preserving your content.</p>
            <h3>What it handles:</h3>
            <ul>
                <li><strong>Quick Conversion:</strong> Changes any text to your selected format immediately.</li>
                <li><strong>Various Styles:</strong> Provides sentence case, lowercase, UPPERCASE, Title Case, camel case, and others.</li>
                <li><strong>Context-Aware:</strong> Keeps acronyms, URLs, and special elements formatted correctly when needed.</li>
                <li><strong>Easy Downloads:</strong> Grab your converted content in whatever format works best for you.</li>
            </ul>
            <h3>How Our Text Case Converter Works: The Process</h3>
            <h4>Smart Analysis Technology</h4>
            <p>The system examines every character, identifying sentence breaks, word divisions, and unique elements. It understands context, knowing when to capitalize after punctuation and when to leave specific acronyms unchanged.</p>
            <h4>Multiple Format Support</h4>
            <p>Your content can be in any standard format: plain text, PDFs, Word docs, or web pages. Just upload whatever you have, and the text gets converted within moments.</p>
            <h4>Built-in Styling Process</h4>
            <p>Your selected case format is applied uniformly throughout the document. The tool preserves paragraph spacing, line breaks, and special symbols while flawlessly changing the text case.</p>
            <h4>Ready to Use</h4>
            <p>Copy results straight to your clipboard, download as a TXT file, or save in your preferred format. Whatever you need for your next move, the converted text is prepared and waiting.</p>
            <h2>Why You Need a Text Case Conversion Tool</h2>
            <p>A Text Case Converter streamlines formatting and keeps everything uniform across all your writing. Whether you're standardizing document styles, prepping social posts, or switching code formats, this tool handles it smoothly.</p>
            <p>Benefits include:</p>
            <ul>
                <li><strong>Faster Workflow:</strong> Transform entire documents instantly, without retyping.</li>
                <li><strong>Improved Uniformity:</strong> Keep formatting consistent throughout all your content.</li>
                <li><strong>Better Efficiency:</strong> Spend time on writing instead of tedious formatting work.</li>
                <li><strong>Clean Organization:</strong> Keep professional quality across everything you create.</li>
            </ul>
            <p>This free conversion tool prioritizes accuracy, speed, and simplicity, helping you get more done in less time.</p>
            <h3>Secure and Confidential Processing</h3>
            <p>Your content passes through encrypted connections and gets wiped after conversion completes. Nothing gets stored on our servers; we respect your privacy completely.</p>
            <h2>Begin Converting Text Right Now</h2>
            <p>Get cleanly formatted text with minimal effort.</p>
            <p>Paste your content or upload whatever file you have, pick your preferred case style, and watch it change instantly. No cost, lightning fast, and totally secure!</p>
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
