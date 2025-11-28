
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Merge, Loader2, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mergePdf, MergePdfOutput } from '@/ai/flows/merge-pdf';
import AdBanner from '@/components/ad-banner';
import Link from 'next/link';
import Image from 'next/image';

export function MergePdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState<MergePdfOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== selectedFiles.length) {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'One or more selected files were not PDFs and have been ignored.',
          });
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMergeResult(null);
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf');
      if (newFiles.length !== droppedFiles.length) {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'One or more dropped files were not PDFs and have been ignored.',
          });
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMergeResult(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  }
  
  const processFiles = async () => {
    if (files.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Not Enough Files',
        description: 'Please select at least two PDF files to merge.',
      });
      return;
    }

    setIsMerging(true);
    setMergeResult(null);

    try {
      const dataUris = await Promise.all(
        files.map(file => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        }))
      );
      
      const result = await mergePdf({ 
        pdfDataUris: dataUris, 
        fileName: 'merged-document.pdf'
      });

      setMergeResult(result);
      toast({
        title: 'Merge Successful',
        description: 'Your PDF has been merged.',
      });

    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Merge Failed',
        description: `An error occurred during the merge process. ${error instanceof Error ? error.message : ''}`,
      });
    } finally {
        setIsMerging(false);
    }
  };
  
  const downloadPdf = () => {
    if (mergeResult) {
      const link = document.createElement('a');
      link.href = mergeResult.pdfDataUri;
      link.download = mergeResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFiles([]);
    setIsMerging(false);
    setMergeResult(null);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Merge className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Merge PDF Files Easily</CardTitle>
              <CardDescription className="text-lg">
                Combine multiple PDF files into one single document.
              </CardDescription>
            </CardHeader>
          </Card>
          
           <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
                <p>PDF files are widely trusted because they preserve formatting, look the same on every device, and are easy to share. But when you have several related documents—such as invoices, notes, scanned pages, assignments, contracts, or reports—managing dozens of separate PDFs can become messy.</p>
                <p>This is where merging PDF files becomes extremely useful. Whether you’re a student, professional, or business owner, combining multiple PDFs into one organized document can simplify your work, improve sharing, and save valuable time.</p>
           </div>

          <Card>
             <CardHeader>
                <CardTitle className="text-center">Merge PDF Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!mergeResult && (
                <div className="space-y-6">
                  <Label
                    htmlFor="file-upload"
                    className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-colors duration-300 bg-background/30"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                        <UploadCloud className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-foreground">
                            Drag & drop your PDF files here
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" multiple disabled={isMerging} />
                  </Label>

                  {files.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selected Files ({files.length}):</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((file, index) => (
                           <li key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50 border">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="truncate text-sm">{file.name}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                  <X className="h-4 w-4"/>
                              </Button>
                           </li>
                        ))}
                      </ul>
                    </div>
                  )}

                   <Button onClick={processFiles} className="w-full text-lg py-6" size="lg" disabled={files.length < 2 || isMerging}>
                    {isMerging ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      `Merge ${files.length > 1 ? files.length : ''} PDFs`
                    )}
                  </Button>
                </div>
              )}

              {mergeResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">Merge Successful!</AlertTitle>
                    <AlertDescription>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                           <p className="font-semibold text-center sm:text-left">
                                Your new merged PDF is ready.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Merged PDF
                                </Button>
                                <Button onClick={resetTool} size="sm" variant="outline" className='bg-background/80'>
                                    Merge More
                                </Button>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after conversion.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>The Complete Guide to Combining PDF Files Easily and Securely</h2>
            <p>This guide explains everything you need to know about merging PDFs safely and efficiently, along with the best tools and expert tips to get the best results.</p>
            
            <h3>Why Should You Merge PDF Files?</h3>
            <p>Merging PDFs is more than just convenience — it improves organization and professionalism. Here are the top benefits:</p>
            <ul>
                <li><strong>Easier to Manage:</strong> Instead of opening 10 separate documents, you work with only one combined file.</li>
                <li><strong>Cleaner Sharing:</strong> Perfect for sending client reports, legal bundles, or school submissions.</li>
                <li><strong>More Organized:</strong> Group documents like receipts, forms, contracts, or study materials together.</li>
                <li><strong>Professional Presentation:</strong> A single, well-structured PDF looks cleaner and more polished.</li>
            </ul>

            <h3>What Is a PDF Merger?</h3>
            <p>A PDF merger, or PDF combiner, is a tool that allows you to upload multiple PDF files, arrange them in the correct order, and combine them into one final PDF. PDF mergers are available as online tools (convenient and fast), desktop software (best for sensitive files), and mobile apps (perfect on the go).</p>
            <p>If you need a fast and secure online tool, try the <Link href="/tools/pdf/merge">Merge PDF Tool on DPToolsPro</Link>.</p>

            <h3>Important Features to Look for in a PDF Merger</h3>
            <ul>
                <li>Simple, user-friendly design</li>
                <li>Drag-and-drop upload</li>
                <li>Secure processing (HTTPS encryption, auto-delete files)</li>
                <li>No watermarks</li>
                <li>Fast merging</li>
            </ul>
            <p>DPToolsPro’s Merge PDF, Split PDF, Compress PDF, and PDF to Word tools meet all these standards.</p>

            <AdBanner type="top-banner" className="my-8"/>

            <h3>How to Merge PDF Files Online (Step-by-Step)</h3>
            <ol>
                <li>Open a trusted online PDF combiner like the <Link href="/tools/pdf/merge">DPToolsPro Merge PDF</Link> tool.</li>
                <li>Upload your PDF files by dragging and dropping or selecting from your device.</li>
            </ol>
            <Image src="https://storage.googleapis.com/project-spark-301121.appspot.com/97882255-6677-4c12-9c3f-916c5b057704" alt="Merge PDF Tool interface" width={1000} height={429} className="rounded-lg border my-4" data-ai-hint="PDF merge tool" />
            <ol start={3}>
                <li>Arrange the documents in the order you want them combined.</li>
                <li>Click "Merge PDF".</li>
                <li>Download your combined PDF.</li>
            </ol>
            <p>This method works on any device — laptop, tablet, or smartphone.</p>

            <h3>Desktop and Mobile PDF Merging Options</h3>
            <h4>Desktop Software (For Maximum Privacy)</h4>
            <p>Recommended when working with confidential files like legal documents or financial statements. Popular options include: Adobe Acrobat, PDFsam, and Foxit PDF Editor. Advantages: No internet needed, full privacy, batch merging, and advanced editing features.</p>
            <h4>Mobile Apps (For On-the-Go Use)</h4>
            <p>Useful for students, sales professionals, and remote workers. Apps on iOS and Android allow you to merge PDFs, reorder pages, scan and convert documents, and share files instantly. DPToolsPro tools also work smoothly on mobile browsers.</p>

            <h3>Security and Privacy Tips When Merging PDFs</h3>
            <p>Always ensure the website uses HTTPS encryption and has a clear privacy policy stating that files are auto-deleted. For highly sensitive information, offline desktop software is recommended. DPToolsPro ensures secure processing and auto-deletion for all PDFs.</p>

            <h3>Advanced PDF Merging Tips</h3>
            <ul>
                <li><strong>Combine Multiple File Types:</strong> Convert other formats like Word, Excel, or images to PDF first using our <Link href="/tools/pdf/office-to-pdf">Office to PDF</Link> or <Link href="/tools/image/jpg-to-pdf">Image to PDF</Link> converters, then merge.</li>
                <li><strong>Split and Reorder Pages:</strong> Use a <Link href="/tools/pdf/split">Split PDF</Link> tool to remove unwanted pages or reorder sections before merging.</li>
                <li><strong>Compress the Final PDF:</strong> If your merged PDF is too large, reduce its size with our <Link href="/tools/pdf/compress">Compress PDF</Link> tool.</li>
                <li><strong>Add Bookmarks or Table of Contents:</strong> Useful for long reports, case files, manuals, or study guides. It makes navigation much easier.</li>
            </ul>

            <h3>Common Use Cases for Merging PDFs</h3>
            <ul>
                <li><strong>Business:</strong> Combine invoices, contracts, proposals, financial documents.</li>
                <li><strong>Education:</strong> Merge notes, assignments, reference PDFs, exam materials.</li>
                <li><strong>Legal:</strong> Combine case files, evidence documents, court paperwork.</li>
                <li><strong>Personal:</strong> Organize scanned receipts, bills, certificates, and IDs.</li>
            </ul>

            <h3>Frequently Asked Questions</h3>
            <p><strong>Is it safe to use an online PDF merger?</strong><br/>Yes, as long as the tool uses encrypted connections and auto-deletes your files.</p>
            <p><strong>Can I merge PDF files for free?</strong><br/>Yes. Many online tools, including DPToolsPro, offer free merging without watermarks.</p>
            <p><strong>Will merging PDFs reduce quality?</strong><br/>No. Merging keeps the original quality intact.</p>

            <h3>Conclusion</h3>
            <p>Merging PDF files is an easy and powerful way to organize information, improve productivity, and present documents professionally. Whether you prefer online tools, desktop software, or mobile apps, combining PDFs takes only a few clicks. For fast and secure merging, try the DPToolsPro Merge PDF Tool — it’s simple, safe, and works on all devices.</p>
            <p>Make your document workflow easier today with a trusted PDF combiner.</p>
            
            <hr/>

            <h3>About the Author — Piyush (Digital Piyush)</h3>
            <p>Piyush is a web developer and digital productivity tool creator with over 5 years of hands-on experience testing, building, and optimizing PDF tools and document converters. He has reviewed dozens of PDF compressors, file optimizers, and workflow utilities to understand what works best in real-world use. Through DPToolsPro.com, he focuses on creating simple, fast, and secure tools that help students, professionals, and businesses manage documents more efficiently.</p>
          </article>
        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
