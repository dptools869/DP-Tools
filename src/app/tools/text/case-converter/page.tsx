
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

export default function TextCaseConverterPage() {
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <CaseSensitive className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Text Case Converter</CardTitle>
              <CardDescription className="text-lg">
                Easily convert text between different letter cases.
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
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Mastering Text Transformation with a Case Converter</h2>
            <p>A text case converter is an essential utility for writers, editors, developers, and marketers. It provides a quick and easy way to change the capitalization of your text to fit specific formatting requirements without having to manually retype everything. Our tool offers a wide variety of conversion options to suit any need.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Common Use Cases</h3>
             <ul>
              <li><strong>UPPERCASE:</strong> For headlines, titles, or to make text stand out.</li>
              <li><strong>lowercase:</strong> To standardize text or for stylistic purposes.</li>
              <li><strong>Sentence case:</strong> The standard for most writing, ensuring proper capitalization at the beginning of sentences.</li>
              <li><strong>Title Case:</strong> Often used for headlines and book titles, capitalizing the first letter of each major word.</li>
              <li><strong>snake_case & kebab-case:</strong> Commonly used by programmers for variable and file naming conventions.</li>
            </ul>
            <p>Our tool is designed to be intuitive and efficient. Simply paste your text into the input box, click the button for the desired case, and your converted text will instantly appear in the output box, ready to be copied. It's a simple way to save time and ensure your text meets any formatting standard.</p>
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
