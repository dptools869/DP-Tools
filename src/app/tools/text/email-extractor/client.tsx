
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

export function EmailExtractorClient() {
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
              <CardTitle className="text-3xl font-headline">Free Online Email Extractor | Quickly Extract Valid Email Addresses</CardTitle>
              <CardDescription className="text-lg">
                Extract email addresses instantly from text or files. This is a fast, accurate, and secure email extractor online, with no signup required. Try it free today!
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
            <h2>Search and Gather Emails in Real Time.</h2>
            <p>Searching for email addresses in text, documents, or web data is time-consuming when done manually. With our Email Extractor tool, it's never been a problem: just copy and paste or upload a file, and it automatically finds and extracts all the valid email addresses you need.</p>
            <p>Our free online email extractor is perfect for time-saving tasks for recruiters, researchers, or business owners. It allows you to save time and collect contacts in an organized, efficient way.</p>
            <p>Our email extractor does this work in seconds. You type in your text, attach a document, or simply place a URL. We will automatically search through it and find every email address. There will be no scanning, copying, or errors—just instant results that you can download easily.</p>
            <h3>Perfect for:</h3>
             <ul className="text-left">
                <li>Sales Professionals who create prospect lists based on business directories or industry reports.</li>
                <li>Recruiters obtain candidates' email addresses from resumes and applications.</li>
                <li>Event organizers gather the attendees' email addresses during the registration forms or sign-up sheets.</li>
                <li>Researchers who collect contact data through academic publications or research databases.</li>
            </ul>
          </div>

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
                                <pre className="p-4 text-sm whitespace-pre-wrap break-all">{extractedEmails.join('\n')}</pre>
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
            <h2>How Our Email Extractor Works: The Principle Behind It</h2>
            <p>Our tool is powered by sophisticated pattern recognition that searches all email addresses in a few seconds. It sifts through duplicates and invalid email formats, leaving you with a clean, ready-to-use list of confirmed emails.</p>
            <p>Here’s what it does:</p>
            <ul>
                <li><strong>Instant Detection:</strong> This tool detects any valid email address in your document or text.</li>
                <li><strong>Duplicate Removal:</strong> Cleans up your list by eliminating duplicate addresses.</li>
                <li><strong>Smart Validation:</strong> Removes the incorrect or incomplete emails.</li>
                <li><strong>Download Option:</strong> You can easily download the email list extracted for easy use.</li>
            </ul>
            <p>That is what happens when you extract emails using our tool:</p>
            <h3>Intelligent Scanning</h3>
            <p>We examine your characters, searching for the characteristic signature of email addresses and text followed by @ or a domain name. We pick up emails when they are hidden in tables, between other text, or under paragraphs.</p>
            <h3>Format Recognition</h3>
            <p>No matter what type of text you have —simple, in a PDF, Word document, Excel spreadsheet, or on a website —we can read it. Drag any file and drop it on the standard file, and we will extract the emails within seconds.</p>
            <h3>Automatic Cleaning</h3>
            <p>We will automatically eliminate duplicate emails so you do not receive the same email several times. We verify every email to ensure it is in the correct format. We remove any additional characters or formatting that could accompany the text.</p>
            <h3>Export Ready</h3>
            <p>Export your results in a simple list format, save it to Excel or Google Sheets, and save it as CSV or TXT. Your next move can be in whatever format you want, and we are ready.</p>
            <h2>Why Use an Email Extractor?</h2>
            <p>Contact information can be easily organized and gathered with an Email Extractor. This tool makes it easier to compile a list of emails, handle customer data, or clean old lists.</p>
            <p>Here’s how it helps:</p>
            <ul>
                <li><strong>Save Time:</strong> Search hundreds of emails immediately without manual searching.</li>
                <li><strong>Better Accuracy:</strong> Avoid misspellings or typographical errors in addresses.</li>
                <li><strong>Increase Productivity:</strong> Focus on outreach rather than text sorting.</li>
                <li><strong>Arrange Data:</strong> Export ya usable, clean list from our CRM or marketing tool.</li>
            </ul>
            <p>Our free email extraction software is designed to be the most precise, quick, and confidential —so you can work smarter and faster.</p>
            <h3>Safe, Secure, and Private</h3>
            <p>Your information is transmitted over a secure network and is deleted once the data has been extracted. We do not archive or save your files or results; we always respect your privacy.</p>
            <h2>Start Extracting Emails Now</h2>
            <p>Get the right email lists with a single click.</p>
            <p>Copy and paste or upload your file, hit Extract, and it will automatically download all of the email addresses in seconds. It is free, fast, and safe!</p>
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
