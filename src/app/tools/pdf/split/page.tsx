
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Split, Loader2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '@/components/ad-banner';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  
  const [fromPage, setFromPage] = useState<string>('1');
  const [toPage, setToPage] = useState<string>('');

  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResultUrl, setSplitResultUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const bytes = reader.result as ArrayBuffer;
        setPdfBytes(bytes);
        const pdfDoc = await PDFDocument.load(bytes);
        const pages = pdfDoc.getPageCount();
        setTotalPages(pages);
        setFromPage('1');
        setToPage(pages.toString());
      } catch (e) {
        toast({ variant: 'destructive', title: 'Invalid PDF', description: 'Could not read the uploaded PDF file.' });
        resetTool();
      }
    };

    return () => {
      if (splitResultUrl) URL.revokeObjectURL(splitResultUrl);
    };
  }, [file]);

  const processFile = async () => {
    if (!pdfBytes) {
      toast({ variant: 'destructive', title: 'No File Selected' });
      return;
    }

    const start = parseInt(fromPage);
    const end = parseInt(toPage);

    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      toast({
        variant: 'destructive',
        title: 'Invalid Page Range',
        description: `Please enter a valid range between 1 and ${totalPages}.`,
      });
      return;
    }

    setIsSplitting(true);

    try {
      const originalPdf = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
      
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      
      if (splitResultUrl) URL.revokeObjectURL(splitResultUrl);
      setSplitResultUrl(URL.createObjectURL(blob));

      toast({
        title: 'Split Successful',
        description: `Your new PDF with pages ${start}-${end} is ready.`,
      });

    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Split Failed',
        description: `An error occurred during the split process. ${error instanceof Error ? error.message : ''}`,
      });
    } finally {
        setIsSplitting(false);
    }
  };
  
  const downloadPdf = () => {
    if (splitResultUrl) {
      const link = document.createElement('a');
      link.href = splitResultUrl;
      link.download = `${file?.name.replace('.pdf', '')}-pages-${fromPage}-${toPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPdfBytes(null);
    setTotalPages(0);
    setFromPage('1');
    setToPage('');
    setIsSplitting(false);
    if(splitResultUrl) URL.revokeObjectURL(splitResultUrl);
    setSplitResultUrl(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF file.' });
    }
  }

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else if (droppedFile) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please drop a PDF file.' });
      }
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Split className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Split PDF</CardTitle>
              <CardDescription className="text-lg">
                Extract a range of pages from your PDF into a new document.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Split PDF Tool</CardTitle>
                <CardDescription>Upload a PDF and select a page range to extract.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              {!file ? (
                <div className="space-y-6">
                  <Label
                    htmlFor="file-upload"
                    className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={e => e.preventDefault()}
                    onDrop={onDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                        <UploadCloud className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-foreground">
                            Drag & drop your PDF file here
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isSplitting} />
                  </Label>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                      <Label>Preview ({file.name})</Label>
                      <div className="h-[600px] border rounded-lg bg-muted/30">
                        {pdfBytes && <iframe src={URL.createObjectURL(new Blob([pdfBytes], {type: 'application/pdf'}))} className="w-full h-full" title="PDF Preview"/>}
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center rounded-lg border p-4">
                      <div className="space-y-2 sm:col-span-1">
                          <Label>Total Pages: {totalPages}</Label>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                          <Label htmlFor="fromPage" className="whitespace-nowrap">From Page</Label>
                          <Input id="fromPage" type="number" value={fromPage} onChange={e => setFromPage(e.target.value)} min={1} max={totalPages} />
                          <Label htmlFor="toPage" className="whitespace-nowrap">To Page</Label>
                          <Input id="toPage" type="number" value={toPage} onChange={e => setToPage(e.target.value)} min={1} max={totalPages} />
                      </div>
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={isSplitting}>
                    {isSplitting ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Splitting...
                      </>
                    ) : (
                      'Split PDF'
                    )}
                  </Button>
                </>
              )}

              {splitResultUrl && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Split Successful!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">
                          Your new PDF is ready.
                       </p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                            <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>
                                Split Another
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely in your browser and are never uploaded to our servers.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Effortlessly Split Your PDFs</h2>
            <p>Our PDF Splitter tool provides a simple and efficient way to break down large PDF documents. Whether you need to extract a single chapter, separate a report into sections, or grab just a few relevant pages, this tool gives you the power to manage your documents with precision. It's essential for anyone who needs to reorganize, share, or archive specific parts of a PDF file without sending the entire document.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How to Split a PDF</h2>
            <p>The process is incredibly straightforward. Simply upload your PDF file, and our tool will display a preview and the total number of pages. You then specify the page range you want to extract using the "From Page" and "To Page" fields. Click "Split PDF", and our tool will create a new PDF containing only the pages from your selected range. All processing happens directly in your browser, ensuring your files remain private and secure.</p>
            <h3>Key Benefits of Using Our PDF Splitter</h3>
            <ul>
                <li><strong>Precise Page Extraction:</strong> Select the exact range of pages you need to create a new, smaller PDF.</li>
                <li><strong>Client-Side Processing:</strong> All operations are performed in your browser, meaning your files are never uploaded to our servers. This is faster and more secure.</li>
                <li><strong>Easy to Use:</strong> A simple interface makes the process quick and painless. No complex options to configure.</li>
                <li><strong>Completely Free:</strong> Split as many PDFs as you need without any cost, subscriptions, or limitations.</li>
            </ul>
            <p>By using a reliable "PDF splitter," you gain more control over your documents. It’s the perfect solution for creating custom excerpts, reducing file size for emailing, or simply organizing your digital library more effectively. Try our free "online PDF splitting tool" today and simplify your document workflow.</p>
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
