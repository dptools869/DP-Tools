
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Globe, FileCheck, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { webToPdf, WebToPdfOutput } from '@/ai/flows/web-to-pdf';
import AdBanner from '@/components/ad-banner';

export default function WebToPdfPage() {
  const [url, setUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<WebToPdfOutput | null>(null);
  const { toast } = useToast();

  const isUrlValid = (url: string) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  }

  const convertUrl = async () => {
    if (!isUrlValid(url)) {
      toast({
        variant: 'destructive',
        title: 'Invalid URL',
        description: 'Please enter a valid web address (e.g., https://example.com).',
      });
      return;
    }

    setIsConverting(true);
    setConversionResult(null);

    try {
        const result = await webToPdf({ url });
        setConversionResult(result);
        toast({
        title: 'Conversion Successful',
        description: 'Your PDF is ready for download.',
        });
    } catch (error) {
        toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: `An error occurred during conversion. ${error instanceof Error ? error.message : ''}`,
        });
    } finally {
        setIsConverting(false);
    }
  };

  const downloadPdf = () => {
    if (conversionResult) {
      const link = document.createElement('a');
      link.href = conversionResult.pdfDataUri;
      link.download = conversionResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setUrl('');
    setIsConverting(false);
    setConversionResult(null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Globe className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Web to PDF Converter</CardTitle>
              <CardDescription className="text-lg">
                Enter a URL to convert any webpage into a high-quality PDF document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!conversionResult && (
                <div className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor="url-input" className="text-lg font-medium">Website URL</Label>
                        <Input
                          id="url-input"
                          type="url"
                          placeholder="https://example.com"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={isConverting}
                          className="h-12 text-lg"
                        />
                    </div>
                   <Button onClick={convertUrl} className="w-full text-lg py-6" size="lg" disabled={!url || isConverting}>
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      'Convert to PDF'
                    )}
                  </Button>
                </div>
              )}

              {conversionResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Conversion Successful!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">File <span className="font-semibold">{conversionResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline">
                                Convert Another URL
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">The conversion time depends on the complexity of the page. Please be patient.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Save Any Webpage as a PDF</h2>
            <p>Our Web to PDF converter is a powerful tool that allows you to turn any live webpage into a high-quality, portable PDF document. This is perfect for archiving articles, saving online receipts, creating offline reading lists, or capturing a snapshot of a website at a specific moment in time. Simply enter the URL, and our tool will render the page and convert it into a perfectly formatted PDF file, preserving the layout, text, and images.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does the Web to PDF Converter Work?</h2>
            <p>When you enter a URL, our service uses a sophisticated rendering engine, similar to a web browser, to load the webpage in a virtual environment. It executes the HTML, CSS, and JavaScript to ensure the page is fully loaded and displayed correctly. Once the page is rendered, it is "printed" to a digital PDF document. This process ensures that the resulting PDF is a faithful, high-fidelity representation of the original live webpage.</p>
            <h3>Key Features and Benefits</h3>
            <ul>
              <li><strong>High-Fidelity Conversion:</strong> Preserves the original layout, images, links, and styling of the webpage.</li>
              <li><strong>Easy to Use:</strong> No need to upload files. Just paste a URL and click convert.</li>
              <li><strong>Archiving and Offline Reading:</strong> Save important web content for your records or read it later without an internet connection.</li>
              <li><strong>Secure and Private:</strong> We don't store the URLs you enter or the PDFs you create. The process is secure and private.</li>
              <li><strong>Completely Free:</strong> Convert as many webpages as you like without any cost or limitations.</li>
            </ul>
            <p>This "Web to PDF" or "URL to PDF" converter is an essential utility for anyone who works with online content. It's the simplest way to capture the web in a format that's easy to share, print, and store. Try it today and see how easy it is to save the web.</p>
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
