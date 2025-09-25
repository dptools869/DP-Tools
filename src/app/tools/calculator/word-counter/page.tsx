
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CaseSensitive } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Button } from '@/components/ui/button';

export default function WordCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmedText = text.trim();
    
    const words = trimmedText ? trimmedText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    const charCountWithSpaces = text.length;

    const charCountWithoutSpaces = text.replace(/\s/g, '').length;

    const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
    const sentenceCount = sentences.length;

    const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(p => p.trim().length > 0) : [];
    const paragraphCount = paragraphs.length;

    return {
      wordCount,
      charCountWithSpaces,
      charCountWithoutSpaces,
      sentenceCount,
      paragraphCount,
    };
  }, [text]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <CaseSensitive className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Word and Character Counter</CardTitle>
              <CardDescription className="text-lg">
                Instantly count words, characters, sentences, and paragraphs in your text.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Your Text</CardTitle>
                <CardDescription>Paste your text below to see the stats.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea 
                    placeholder="Start typing or paste your text here..."
                    className="h-64 resize-y text-base"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Words</Label>
                        <div className="text-2xl font-bold">{stats.wordCount.toLocaleString()}</div>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Characters</Label>
                        <div className="text-2xl font-bold">{stats.charCountWithSpaces.toLocaleString()}</div>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Characters (no spaces)</Label>
                        <div className="text-2xl font-bold">{stats.charCountWithoutSpaces.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Sentences</Label>
                        <div className="text-2xl font-bold">{stats.sentenceCount.toLocaleString()}</div>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <Label className="text-sm">Paragraphs</Label>
                        <div className="text-2xl font-bold">{stats.paragraphCount.toLocaleString()}</div>
                    </div>
                </div>
                 <Button variant="outline" onClick={() => setText('')} disabled={!text}>Clear Text</Button>
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Why is a Word Counter Important?</h2>
            <p>A word and character counter is an essential tool for writers, students, social media managers, and anyone who works with text. It provides immediate feedback on the length of your content, which is crucial for meeting specific requirements for essays, reports, tweets, blog posts, and more. Our tool goes beyond a simple word count, giving you a comprehensive breakdown of your text's statistics.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>What Our Tool Counts:</h3>
             <ul>
              <li><strong>Word Count:</strong> The total number of words in your text, perfect for essays and articles.</li>
              <li><strong>Character Count:</strong> The total number of characters, including and excluding spaces. This is vital for platforms with character limits, like Twitter.</li>
              <li><strong>Sentence Count:</strong> Helps you analyze your writing style and check for readability by identifying the number of sentences.</li>
              <li><strong>Paragraph Count:</strong> Useful for structuring your document and ensuring it is well-organized and easy to read.</li>
            </ul>
            <p>Our calculator analyzes your text in real-time as you type or paste it, providing instant and accurate statistics to help you refine your writing and meet any length requirements with ease.</p>
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
