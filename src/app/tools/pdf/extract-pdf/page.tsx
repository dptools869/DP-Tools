
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, BrainCircuit, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractPdf, ExtractPdfOutput } from '@/ai/flows/extract-pdf';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

type DocumentType = 'auto' | 'invoice' | 'receipt' | 'contract' | 'identification' | 'financial' | 'form';

export default function ExtractPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ExtractPdfOutput | null>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setProcessResult(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a PDF file (.pdf).',
        });
        event.target.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setProcessResult(null);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please drop a PDF file (.pdf).',
      });
    }
  };

  const processFile = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a PDF file to extract data from.',
      });
      return;
    }

    setIsProcessing(true);
    setProcessResult(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result as string;
        try {
          const result = await extractPdf({ 
            pdfDataUri: base64File, 
            fileName: file.name,
            documentType,
          });
          setProcessResult(result);
          toast({
            title: 'Data Extracted Successfully',
            description: 'The extracted data from your PDF is displayed below.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred while extracting data. ${error instanceof Error ? error.message : ''}`,
          });
        } finally {
            setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
          });
      }
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An unexpected error occurred. ${error instanceof Error ? error.message : ''}`,
      });
    }
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setDocumentType('auto');
    setIsProcessing(false);
    setProcessResult(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BrainCircuit className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">AI PDF Data Extractor</CardTitle>
              <CardDescription className="text-lg">
                Extract structured data from invoices, receipts, contracts, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 mt-6">
              {!processResult && (
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
                            {fileName || 'Drag & drop your PDF file here'}
                        </span>
                        <span className="text-muted-foreground">or click to browse</span>
                    </div>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" disabled={isProcessing} />
                  </Label>

                  <div className="space-y-2">
                    <Label htmlFor="document-type">Document Type</Label>
                     <Select
                        value={documentType}
                        onValueChange={(value) => setDocumentType(value as DocumentType)}
                        disabled={isProcessing}
                     >
                        <SelectTrigger id="document-type">
                            <SelectValue placeholder="Select document type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="invoice">Invoice</SelectItem>
                            <SelectItem value="receipt">Receipt</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="identification">Identification (ID)</SelectItem>
                            <SelectItem value="financial">Financial Document</SelectItem>
                            <SelectItem value="form">Form</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Selecting the correct type improves extraction accuracy.</p>
                  </div>
                  
                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Extracting Data...
                      </>
                    ) : (
                      'Extract Data'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                        <FileCheck className="h-5 w-5 text-current" />
                        <AlertTitle className="font-bold">Extraction Complete!</AlertTitle>
                        <AlertDescription>
                            Extracted data for <span className="font-semibold">{fileName}</span> is shown below.
                        </AlertDescription>
                    </Alert>
                    <Card>
                        <CardContent className="p-0">
                            <ScrollArea className="h-96 w-full">
                                <pre className="p-4 text-xs bg-muted/50 rounded-md">{JSON.stringify(processResult.extractedData, null, 2)}</pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                     <Button onClick={resetTool} size="lg" variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Extract From Another PDF
                    </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">Your files are processed securely and deleted from our servers after data extraction.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Unlock Structured Data with AI PDF Extraction</h2>
            <p>Our AI PDF Data Extractor transforms unstructured PDFs into organized, structured data. This powerful tool is designed to understand the context of various document types, intelligently identifying and extracting key information such as invoice numbers, vendor details, contract dates, and line items. It's an essential utility for businesses and individuals looking to automate data entry, streamline document processing, and unlock valuable insights from their files.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does AI Data Extraction Work?</h2>
            <p>When you upload a PDF and select a document type, our tool uses a specialized AI model trained for that category. The AI scans the document, identifies relevant fields based on its training, and extracts the corresponding values. For example, when "Invoice" is selected, the AI actively looks for an invoice number, due date, total amount, and line items. This structured data is then returned to you in a clean JSON format, ready for use in other applications or databases.</p>
            <h3>Key Benefits of AI PDF Extraction</h3>
            <ul>
              <li><strong>Automated Data Entry:</strong> Save countless hours by eliminating manual data entry from documents like invoices and receipts.</li>
              <li><strong>High Accuracy:</strong> Our AI models are optimized for specific document types, leading to highly accurate data extraction.</li>
              <li><strong>Structured Output:</strong> Get data in a predictable JSON format, making it easy to integrate with your other systems.</li>
              <li><strong>Versatile Use-Cases:</strong> Process invoices, receipts, contracts, ID cards, and more with specialized models.</li>
              <li><strong>Secure and Private:</strong> Your files are processed securely and are never stored on our servers, ensuring your data remains confidential.</li>
            </ul>
            <p>From accounts payable automation to contract analysis, our "AI PDF extractor" provides the foundation for a more efficient and data-driven workflow. Start transforming your documents into actionable data today.</p>
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
