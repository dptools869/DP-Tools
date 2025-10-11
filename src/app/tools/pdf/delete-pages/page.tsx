
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, FileMinus, Loader2, Download, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import AdBanner from '@/components/ad-banner';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

interface PageThumbnail {
  url: string;
  pageNumber: number;
}

export default function DeletePdfPagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageThumbnails, setPageThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [finalPdfUrl, setFinalPdfUrl] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState('');

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        resetTool();
        setFile(selectedFile);
      } else {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF file (.pdf).' });
        event.target.value = '';
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      resetTool();
      setFile(droppedFile);
    } else {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please drop a PDF file (.pdf).' });
    }
  };

  const loadPdf = useCallback(async (file: File) => {
    setIsLoadingPdf(true);
    setPageThumbnails([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdfDoc.numPages);

      const thumbnails: PageThumbnail[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Use a smaller scale for thumbnails
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        if(context){
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            thumbnails.push({ url: canvas.toDataURL(), pageNumber: i });
        }
      }
      setPageThumbnails(thumbnails);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error loading PDF', description: 'The file might be corrupted or protected.' });
      resetTool();
    } finally {
      setIsLoadingPdf(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (file) {
      loadPdf(file);
    }
  }, [file, loadPdf]);

  const togglePageSelection = (pageNumber: number) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNumber)) {
      newSelection.delete(pageNumber);
    } else {
      newSelection.add(pageNumber);
    }
    setSelectedPages(newSelection);
    setPageRange(Array.from(newSelection).sort((a,b) => a-b).join(', '));
  };
  
  const handlePageRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPageRange(value);
      const newSelection = new Set<number>();
      const parts = value.split(',');
      parts.forEach(part => {
          part = part.trim();
          if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end) && start <= end) {
                  for (let i = start; i <= end; i++) {
                      if (i > 0 && i <= totalPages) newSelection.add(i);
                  }
              }
          } else {
              const num = Number(part);
              if (!isNaN(num) && num > 0 && num <= totalPages) {
                  newSelection.add(num);
              }
          }
      });
      setSelectedPages(newSelection);
  }

  const deletePages = async () => {
    if (!file || selectedPages.size === 0) {
      toast({ variant: 'destructive', title: 'No pages selected', description: 'Please select pages to delete.' });
      return;
    }
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pagesToDelete = Array.from(selectedPages).sort((a, b) => b - a);
      pagesToDelete.forEach(pageNum => pdfDoc.removePage(pageNum - 1));

      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      if(finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
      setFinalPdfUrl(URL.createObjectURL(blob));
      toast({ title: 'Pages Deleted Successfully' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error Deleting Pages' });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setTotalPages(0);
    setPageThumbnails([]);
    setSelectedPages(new Set());
    setPageRange('');
    setIsProcessing(false);
    if (finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
    setFinalPdfUrl(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };
  
  if (finalPdfUrl) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="max-w-4xl mx-auto">
          <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
            <FileCheck className="h-5 w-5 text-current" />
            <AlertTitle className="font-bold">Pages Deleted Successfully!</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
               <p className="text-center sm:text-left">Your modified PDF is ready for download.</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                     <a href={finalPdfUrl} download={`${file?.name.replace('.pdf', '')}-modified.pdf`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 w-full">
                           <Download className="mr-2 h-4 w-4" />
                           Download PDF
                        </Button>
                     </a>
                     <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80 w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Delete More Pages
                     </Button>
                </div>
            </AlertDescription>
        </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <FileMinus className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Delete PDF Pages</CardTitle>
              <CardDescription className="text-lg">
                Visually select pages to remove from your PDF document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!file ? (
                <Label
                  htmlFor="file-upload"
                  className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <span className="text-lg font-medium text-foreground">Drag & drop your PDF file here</span>
                    <span className="text-muted-foreground">or click to browse</span>
                  </div>
                  <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                </Label>
              ) : (
                <div className="space-y-6">
                  {isLoadingPdf && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                  {pageThumbnails.length > 0 && (
                    <div className="space-y-4">
                      <Label>Select pages to delete (Total: {totalPages})</Label>
                      <ScrollArea className="max-h-[600px] h-auto border p-4 rounded-md">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                          {pageThumbnails.map(({ url, pageNumber }) => (
                            <div
                              key={pageNumber}
                              onClick={() => togglePageSelection(pageNumber)}
                              className={cn(
                                "relative aspect-[7/9] border-2 rounded-md flex flex-col items-center justify-center cursor-pointer transition-all bg-white hover:border-primary",
                                selectedPages.has(pageNumber) ? 'border-destructive ring-2 ring-destructive ring-offset-2' : 'border-transparent'
                              )}
                            >
                              <img src={url} alt={`Page ${pageNumber}`} className="w-full h-full object-contain"/>
                              <span className="absolute bottom-1 right-1 text-xs font-bold bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                                {pageNumber}
                              </span>
                              {selectedPages.has(pageNumber) && (
                                <div className="absolute inset-0 bg-destructive/70 flex items-center justify-center">
                                  <X className="w-1/2 h-1/2 text-destructive-foreground"/>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="page-range">Selected Pages / Range</Label>
                    <Input 
                      id="page-range"
                      type="text"
                      placeholder="e.g., 1, 3-5, 8"
                      value={pageRange}
                      onChange={handlePageRangeChange}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={deletePages} className="flex-1 text-lg py-6" size="lg" disabled={isProcessing || selectedPages.size === 0}>
                      {isProcessing ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Deleting...</> : `Delete ${selectedPages.size} Page(s)`}
                    </Button>
                    <Button onClick={resetTool} variant="outline" size="lg">
                      <RefreshCw className="w-5 h-5"/>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely in your browser and are never uploaded.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Visually Delete PDF Pages with Ease</h2>
            <p>Our enhanced Delete PDF Pages tool offers a simple and intuitive way to remove unwanted pages from your PDF files. Whether you need to eliminate blank pages, get rid of irrelevant sections, or create a more concise document, our visual interface makes the process effortless. It's perfect for cleaning up reports, customizing documents for sharing, or removing sensitive information before distribution.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How to Delete Pages from a PDF</h2>
            <p>The process is incredibly straightforward. Simply upload your PDF document. Our tool will then generate a thumbnail preview for every page. From there, you have two options:</p>
            <ol>
                <li><strong>Visual Selection:</strong> Simply click on the thumbnail of any page you wish to delete. A red overlay will confirm your selection. Click again to deselect.</li>
                <li><strong>Manual Input:</strong> Use the input box to type page numbers or ranges you want to remove. For example, you can enter <code>1, 5, 8-12</code> to delete pages 1, 5, and 8 through 12.</li>
            </ol>
            <p>Once you've made your selection, click "Delete Pages," and our tool will generate a new PDF for you to download, with the chosen pages removed.</p>
            <h3>Key Benefits of Our PDF Page Deleter</h3>
            <ul>
              <li><strong>Interactive Visual Interface:</strong> See all your pages at a glance and click to select the ones you want to remove.</li>
              <li><strong>Client-Side Security:</strong> All processing happens directly in your browser. Your files are never uploaded to a server, ensuring maximum privacy.</li>
              <li><strong>Flexible Selection:</strong> Choose individual pages by clicking or specify ranges manually for faster selection in large documents.</li>
              <li><strong>Fast and Free:</strong> No software to install and no fees. Just a simple, effective online tool for all your PDF editing needs.</li>
            </ul>
            <p>Using a "PDF page remover" is an essential skill for efficient document management. Clean up your files and make them more manageable with our free, fast, and secure "Delete PDF Pages online" tool.</p>
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
