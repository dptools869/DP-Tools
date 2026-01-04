
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Lock, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { protectPdf, ProtectPdfOutput } from '@/ai/flows/protect-pdf';
import AdBanner from '@/components/ad-banner';
import Link from 'next/link';


export function ProtectPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProtectPdfOutput | null>(null);
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
        description: 'Please select a PDF file to protect.',
      });
      return;
    }
    if (!password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Password Required',
        description: 'Please enter a password to protect the file.',
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
          const result = await protectPdf({ 
            pdfDataUri: base64File, 
            fileName: file.name, 
            password
          });
          setProcessResult(result);
          toast({
            title: 'PDF Protected Successfully',
            description: 'Your protected PDF is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred while protecting the file. ${error instanceof Error ? error.message : ''}`,
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

  const downloadPdf = () => {
    if (processResult) {
      const link = document.createElement('a');
      link.href = processResult.pdfDataUri;
      link.download = processResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetTool = () => {
    setFile(null);
    setFileName('');
    setPassword('');
    setIsProcessing(false);
    setProcessResult(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Password Protect PDF Free | Add Password to PDF Online (2025 Guide)</CardTitle>
              <CardDescription className="text-lg">
                Add a password to your PDF to encrypt it and prevent unauthorized access.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="md:hidden">
              <CardTitle>Password Protect PDF</CardTitle>
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Enter password to protect the file"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || !password.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Protecting...
                      </>
                    ) : (
                      'Protect PDF'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">PDF Protected!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{processResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Protect Another
                            </Button>
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
            <h2>Secure Your Documents with Password Protection</h2>
            <p>In an age of digital information, securing your sensitive documents is more important than ever. Our Protect PDF tool provides a robust and easy-to-use solution to encrypt your PDF files with a password. This prevents unauthorized users from opening and viewing the contents of your document, adding a crucial layer of security. Whether you are sharing confidential business reports, personal records, or any other sensitive information, our tool ensures that only recipients with the password can access it.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does PDF Protection Work?</h2>
            <p>Our tool uses strong encryption to secure your file. The process is simple: upload your PDF, enter a strong password in the provided field, and click the "Protect PDF" button. Our service will then encrypt the document using your password. The resulting PDF will require this password to be entered every time someone tries to open it. This process is handled securely, and your files and passwords are never stored on our servers, guaranteeing your privacy.</p>
            <h3>Key Benefits of Using Our Protect PDF Tool</h3>
            <ul>
              <li><strong>Strong Encryption:</strong> We use industry-standard encryption to ensure your document is secure.</li>
              <li><strong>Prevent Unauthorized Access:</strong> Only users with the correct password can open and view your PDF.</li>
              <li><strong>Simple to Use:</strong> A straightforward interface allows you to protect your files in just a few clicks.</li>
              <li><strong>Fast and Secure Processing:</strong> Your files are handled quickly over an encrypted connection and are permanently deleted from our servers after processing.</li>
              <li><strong>Completely Free:</strong> Add password protection to as many PDFs as you need, without any cost or limitations.</li>
            </ul>
            <p>Using a "PDF password protector" is a fundamental step in responsible document management. It gives you control over who can see your information, providing peace of mind when sharing files online. Secure your confidential documents with our free, fast, and reliable "Protect PDF online" tool today.</p>
            
            <h4>Related Tools</h4>
            <ul>
                <li><Link href="/tools/pdf/merge">Merge PDF</Link></li>
                <li><Link href="/tools/pdf/compress">Compress PDF</Link></li>
                <li><Link href="/tools/pdf/split">Split PDF</Link></li>
                <li><Link href="/tools/pdf/unlock">Unlock PDF</Link></li>
                <li><Link href="/tools/pdf/to-docx">PDF to Word Converter</Link></li>
            </ul>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <ol>
                <li><strong>How do you password protect a PDF file for free?</strong><br/>Use a free Protect PDF online tool→ upload file → enter password → download locked PDF.</li>
                <li><strong>Is online password protection safe?</strong><br/>Yes, if the platform uses secure encryption and deletes files automatically after processing.</li>
                <li><strong>Can I protect multiple PDF files at once?</strong><br/>Some desktop tools support batch encryption. Online tools usually protect one file per conversion.</li>
                <li><strong>Can I remove a password later?</strong><br/>Yes — simply use an <Link href="/tools/pdf/unlock">“Unlock PDF” or “Remove PDF Password”</Link> tool.</li>
                <li><strong>Do I need Adobe Acrobat to protect a PDF?</strong><br/>No, you can add a password to a PDF without Adobe Acrobat using free online tools.</li>
            </ol>
             
            <hr/>
            <h3>Author Bio</h3>
            <p>Written by: Piyush — PDF Tools Developer & UX Researcher</p>
            <p>With more than 5 years of hands-on experience in testing, developing, and reviewing PDF conversion and encryption tools, Piyush helps users choose secure and high-performance productivity tools. He actively performs user-testing on document management apps and automation tools to provide reliable information backed by real usage and expert insights.</p>
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
