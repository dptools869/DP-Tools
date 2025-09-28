
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Copy, Trash2, Download } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EmailExtractorPage() {
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  const extractedEmails = useMemo(() => {
    if (!inputText) return [];
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = inputText.match(emailRegex);
    if (!matches) return [];
    // Return unique emails, case-insensitively
    return [...new Set(matches.map(email => email.toLowerCase()))];
  }, [inputText]);

  const handleCopy = () => {
    if (extractedEmails.length > 0) {
      const textToCopy = extractedEmails.join('\n');
      navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied to clipboard!',
        description: `${extractedEmails.length} emails copied.`,
      });
    }
  };
  
  const handleDownload = () => {
    if (extractedEmails.length > 0) {
        const textToCopy = extractedEmails.join('\n');
        const blob = new Blob([textToCopy], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted-emails.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
  };

  const clearText = () => {
    setInputText('');
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Email Extractor</CardTitle>
              <CardDescription className="text-lg">
                Paste any text to extract all email addresses automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Extract Emails</CardTitle>
                  <CardDescription>Type or paste your text below to find and extract all email addresses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="input-text">Input Text</Label>
                          <Textarea id="input-text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste text containing emails here..." className="h-64 resize-y" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="output-text">Extracted Emails ({extractedEmails.length})</Label>
                           <ScrollArea className="h-64 border rounded-md">
                                <pre className="p-4 text-sm">{extractedEmails.join('\n')}</pre>
                           </ScrollArea>
                      </div>
                  </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 justify-end">
                  <Button onClick={handleCopy} disabled={extractedEmails.length === 0}><Copy className="mr-2 h-4 w-4" /> Copy All</Button>
                  <Button onClick={handleDownload} disabled={extractedEmails.length === 0} variant="secondary"><Download className="mr-2 h-4 w-4" /> Download .txt</Button>
                  <Button onClick={clearText} variant="destructive" disabled={!inputText}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Use the Email Extractor Tool</h2>
            <p>Our Email Extractor is a simple yet powerful tool designed to save you time by automatically finding and pulling all email addresses from a large block of text. Whether you have a long list of contacts, a webpage's source code, or any document with scattered email addresses, this tool can consolidate them for you in seconds.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Simple Steps to Extract Emails:</h3>
             <ol>
              <li><strong>Paste Your Text:</strong> Copy the text from which you want to extract email addresses and paste it into the input box.</li>
              <li><strong>Instant Results:</strong> The tool will automatically process the text and display all unique email addresses it finds in the results box.</li>
              <li><strong>Copy or Download:</strong> You can then use the "Copy All" button to copy the list to your clipboard or download it as a simple text file.</li>
            </ol>
            <p>This tool is invaluable for marketers creating mailing lists, researchers gathering contact information, or anyone who needs to quickly compile a list of email addresses from unstructured text. It's fast, free, and does all the work on your device, ensuring your data remains private.</p>
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
