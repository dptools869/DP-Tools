
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Copyright, Loader2, Download, RefreshCw, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/ad-banner';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type WatermarkType = 'text' | 'image';
type Position = 'topLeft' | 'topCenter' | 'topRight' | 'center' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export function WatermarkPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [text, setText] = useState('CONFIDENTIAL');
  const [font, setFont] = useState(StandardFonts.Helvetica);
  const [fontSize, setFontSize] = useState(50);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBytes, setImageBytes] = useState<ArrayBuffer | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const [imageSize, setImageSize] = useState(150);

  const [position, setPosition] = useState<Position>('center');
  const [fromPage, setFromPage] = useState('');
  const [toPage, setToPage] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [finalPdfUrl, setFinalPdfUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      setPdfBytes(reader.result as ArrayBuffer);
      const blob = new Blob([reader.result as ArrayBuffer], { type: 'application/pdf' });
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(URL.createObjectURL(blob));
    };
    return () => {
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      if (finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.readAsArrayBuffer(imageFile);
    reader.onload = () => setImageBytes(reader.result as ArrayBuffer);
  }, [imageFile]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (type === 'pdf' && selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else if (type === 'image' && selectedFile.type.startsWith('image/')) {
        setImageFile(selectedFile);
      } else {
        toast({ variant: 'destructive', title: 'Invalid File Type' });
      }
      event.target.value = '';
    }
  };

  const processPdf = async () => {
    if (!pdfBytes) {
      toast({ variant: 'destructive', title: 'Please upload a PDF.' });
      return;
    }
    if (watermarkType === 'image' && !imageBytes) {
      toast({ variant: 'destructive', title: 'Please upload a watermark image.' });
      return;
    }
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      const startPage = fromPage ? parseInt(fromPage) - 1 : 0;
      const endPage = toPage ? parseInt(toPage) - 1 : pages.length - 1;

      for (let i = startPage; i <= endPage && i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        if (watermarkType === 'text') {
          const fontObj = await pdfDoc.embedFont(font);
          const textWidth = fontObj.widthOfTextAtSize(text, fontSize);
          const textHeight = fontObj.heightAtSize(fontSize);
          
          let x, y;
          const margin = 20;
          const rgbColor = hexToRgb(color);

          switch (position) {
            case 'topLeft': x = margin; y = height - textHeight - margin; break;
            case 'topCenter': x = (width - textWidth) / 2; y = height - textHeight - margin; break;
            case 'topRight': x = width - textWidth - margin; y = height - textHeight - margin; break;
            case 'center': x = (width - textWidth) / 2; y = (height - textHeight) / 2; break;
            case 'bottomLeft': x = margin; y = margin; break;
            case 'bottomCenter': x = (width - textWidth) / 2; y = margin; break;
            case 'bottomRight': x = width - textWidth - margin; y = margin; break;
          }

          page.drawText(text, { x, y, font: fontObj, size: fontSize, color: rgb(rgbColor.r, rgbColor.g, rgbColor.b), opacity, rotate: degrees(rotation) });
        } else if (watermarkType === 'image' && imageBytes) {
          const watermarkImage = await pdfDoc.embedPng(imageBytes);
          const { width: imgWidth, height: imgHeight } = watermarkImage.scaleToFit(imageSize, imageSize);

          let x, y;
          const margin = 20;

          switch (position) {
            case 'topLeft': x = margin; y = height - imgHeight - margin; break;
            case 'topCenter': x = (width - imgWidth) / 2; y = height - imgHeight - margin; break;
            case 'topRight': x = width - imgWidth - margin; y = height - imgHeight - margin; break;
            case 'center': x = (width - imgWidth) / 2; y = (height - imgHeight) / 2; break;
            case 'bottomLeft': x = margin; y = margin; break;
            case 'bottomCenter': x = (width - imgWidth) / 2; y = margin; break;
            case 'bottomRight': x = width - imgWidth - margin; y = margin; break;
          }

          page.drawImage(watermarkImage, { x, y, width: imgWidth, height: imgHeight, opacity: imageOpacity });
        }
      }

      const pdfBytesResult = await pdfDoc.save();
      const blob = new Blob([pdfBytesResult], { type: 'application/pdf' });
      if (finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
      setFinalPdfUrl(URL.createObjectURL(blob));
      toast({ title: 'Watermark Applied Successfully!' });

    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'An error occurred.', description: 'Could not process the PDF.' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r: r / 255, g: g / 255, b: b / 255 };
  }

  const downloadPdf = () => {
    if (finalPdfUrl) {
      const link = document.createElement('a');
      link.href = finalPdfUrl;
      link.download = file?.name.replace('.pdf', '-watermarked.pdf') || 'watermarked.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setPdfBytes(null);
    if(pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl(null);
    setWatermarkType('text');
    setText('CONFIDENTIAL');
    setFont(StandardFonts.Helvetica);
    setFontSize(50);
    setColor('#000000');
    setOpacity(0.3);
    setRotation(0);
    setImageFile(null);
    setImageBytes(null);
    setImageOpacity(0.5);
    setImageSize(150);
    setPosition('center');
    setFromPage('');
    setToPage('');
    setIsProcessing(false);
    if(finalPdfUrl) URL.revokeObjectURL(finalPdfUrl);
    setFinalPdfUrl(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Copyright className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Watermark PDF</CardTitle>
              <CardDescription className="text-lg">
                Add a text or image watermark to your PDF with advanced customization.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
              {!file ? (
                <Label htmlFor="pdf-upload" className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <span className="mt-2 block text-sm font-semibold text-foreground">Drag & drop a PDF file or click to upload</span>
                  <Input id="pdf-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'pdf')} accept=".pdf" />
                </Label>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text"><FileText className="w-4 h-4 mr-2"/>Text Watermark</TabsTrigger>
                        <TabsTrigger value="image"><ImageIcon className="w-4 h-4 mr-2"/>Image Watermark</TabsTrigger>
                      </TabsList>
                      <TabsContent value="text" className="pt-4 space-y-4">
                        <div className="space-y-2"><Label>Text</Label><Input value={text} onChange={(e) => setText(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Font Family</Label>
                          <Select value={font} onValueChange={(v) => setFont(v as StandardFonts)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                              {Object.values(StandardFonts).map(f => <SelectItem key={f} value={f}>{f.replace('Helvetica', 'Helvetica ')}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>Font Size</Label><Input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value, 10))} /></div>
                          <div className="space-y-2"><Label>Color</Label><Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10"/></div>
                        </div>
                        <div className="space-y-2"><Label>Opacity ({Math.round(opacity * 100)}%)</Label><Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0} max={1} step={0.01} /></div>
                        <div className="space-y-2"><Label>Rotation ({rotation}°)</Label><Slider value={[rotation]} onValueChange={([v]) => setRotation(v)} min={0} max={360} step={1} /></div>
                      </TabsContent>
                      <TabsContent value="image" className="pt-4 space-y-4">
                         {!imageFile ? (
                           <Label htmlFor="image-upload" className="relative block w-full rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center hover:border-primary/50 cursor-pointer">
                              <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                              <span className="mt-2 block text-sm font-semibold text-foreground">Upload Watermark Image</span>
                              <Input id="image-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'image')} accept="image/png,image/jpeg" />
                           </Label>
                          ) : (
                              <div className="text-center text-sm p-2 bg-muted rounded-md">{imageFile.name}</div>
                          )}
                        <div className="space-y-2"><Label>Size</Label><Slider value={[imageSize]} onValueChange={([v]) => setImageSize(v)} min={50} max={1000} step={10} /></div>
                        <div className="space-y-2"><Label>Opacity ({Math.round(imageOpacity * 100)}%)</Label><Slider value={[imageOpacity]} onValueChange={([v]) => setImageOpacity(v)} min={0} max={1} step={0.01} /></div>
                      </TabsContent>
                    </Tabs>
                    <div className="space-y-2"><Label>Watermark Position</Label>
                      <div className="grid grid-cols-3 gap-2">
                          {(['topLeft', 'topCenter', 'topRight', 'center', 'bottomLeft', 'bottomCenter', 'bottomRight'] as Position[]).map(p => (
                              <Button key={p} variant={position === p ? 'default' : 'outline'} onClick={() => setPosition(p)} className="capitalize text-xs h-10">{p.replace(/([A-Z])/g, ' $1').trim()}</Button>
                          ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>From Page</Label><Input type="number" placeholder="Start" value={fromPage} onChange={e => setFromPage(e.target.value)} /></div>
                        <div className="space-y-2"><Label>To Page</Label><Input type="number" placeholder="End" value={toPage} onChange={e => setToPage(e.target.value)} /></div>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2 pt-4">
                       <Button onClick={processPdf} disabled={isProcessing} className="w-full">
                         {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying Watermark...</> : 'Generate PDF'}
                       </Button>
                       <Button onClick={resetTool} variant="outline" className="w-full">
                         <RefreshCw className="mr-2 h-4 w-4" /> Reset
                       </Button>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Preview</Label>
                    <div className="h-[600px] border rounded-lg bg-muted/30">
                       {pdfPreviewUrl && <iframe src={finalPdfUrl || pdfPreviewUrl} className="w-full h-full" title="PDF Preview"/>}
                    </div>
                    {finalPdfUrl && <Button onClick={downloadPdf} className="w-full"><Download className="mr-2"/>Download Watermarked PDF</Button>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Watermark PDF Online — Protect Your Documents by Adding or Removing Watermarks (Complete Guide 2025)</h2>
            <p>PDF files have become the standard format for sharing documents at school, work, business, and legal environments. But when you need to protect your PDF from unauthorized use or branding issues, adding a watermark is one of the most effective solutions. Similarly, many users also need to remove watermarks from PDFs when they are distracting or no longer required. Whether you want to add watermark to PDF, remove watermark from PDF, or simply understand how to watermark a PDF without Adobe Acrobat, this guide explains everything in a simple and user-friendly way.</p>
            <h3>What Does “Watermark PDF” Mean?</h3>
            <p>A watermark is a piece of text or an image placed over a document — usually in the background — to show ownership, security, copyright, branding, or confidentiality.</p>
            <p>Examples of common watermarks: "Confidential", "Draft", "Company logo", "Do Not Copy", "Paid Invoice", "Copyright ©". Watermarking ensures your documents remain protected and recognizable even if they are shared online.</p>
            <h3>Why Should You Add a Watermark to a PDF?</h3>
            <p>Here are the most important benefits: Copyright & ownership (Prevent content misuse), Branding (Add logo or company name), Security (Mark documents as confidential/private), Version control (Mark drafts vs final versions), Professionalism (PDF looks official and consistent). If you share proposals, invoices, ebooks, certificates, digital notes, or reports, watermarking is a must.</p>
            <h3>How to Add a Watermark to a PDF (Step-by-Step Guide)</h3>
            <p>You don’t need Adobe Acrobat or expensive software. Most users now prefer online Add Watermark PDF tools because they are quick and free.</p>
            <ol>
              <li>Open an online Watermark PDF tool</li>
              <li>Upload your document</li>
              <li>Enter watermark details (text or image)</li>
              <li>Adjust settings like font, position, transparency, and rotation</li>
              <li>Download your watermarked PDF</li>
            </ol>
            <p>Tip: For sensitive client documents, use transparent diagonal watermarks — they ensure maximum protection.</p>
            
            <AdBanner type="top-banner" className="my-8"/>

            <h3>Removing a Watermark from a PDF — Is It Possible?</h3>
            <p>Yes — if the watermark is embedded in a visible layer, a Remove Watermark PDF tool can extract it. However, watermark removal should only be used when: You own the document, or You have editing rights or permission. Removing watermarks from copyrighted PDFs without permission is not allowed and is against Google/AdSense policy. So always ensure you respect copyright rules.</p>
            
            <h3>Best Use Cases for Watermarking PDF Documents</h3>
            <p>Business (Contracts, proposals, invoices), Academics (Research papers, study materials), Photography / Design (Copyright protection), Digital products (E-books, templates, certificates), Legal (Agreements, confidential notices). If your PDF contains valuable or sensitive information, watermarking is the simplest way to protect it.</p>
            
            <h3>Expert Tips for Professional-Looking Watermarks</h3>
            <ul>
              <li>Use semi-transparent text for clean readability</li>
              <li>Avoid too-bold watermarks — they can hide text</li>
              <li>Prefer diagonal placement for better protection</li>
              <li>Use image/logo watermark for branding</li>
              <li>Always keep a copy of the original document</li>
            </ul>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <ol>
                <li><strong>What is a watermark in a PDF?</strong> A watermark is a text or logo added to a PDF to show ownership or protect content.</li>
                <li><strong>Can I watermark a PDF without Adobe Acrobat?</strong> Yes — online Watermark PDF tools allow watermarking for free without installing software.</li>
                <li><strong>Can I remove a watermark from a PDF?</strong> Yes — if you own the document and have permission.</li>
                <li><strong>Is watermarking PDFs free?</strong> Yes — most online watermark tools are free for basic use.</li>
                <li><strong>What file types support watermark conversion?</strong> Most tools support PDF from invoices, certificates, research papers, textbooks, agreements, etc.</li>
            </ol>
            
            <h3>Conclusion</h3>
            <p>Watermarking is one of the easiest ways to secure and brand your documents. Whether you want to put your company name on client invoices, mark files as confidential, or protect digital products from misuse, a Watermark PDF tool helps you add text or logo watermarks instantly — without installing software. Always protect original work and use watermark removal only when you legally own the document.</p>
          </article>

          <AdBanner type="bottom-banner" className="mt-12" />

        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
