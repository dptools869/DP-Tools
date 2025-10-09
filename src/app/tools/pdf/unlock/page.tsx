
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileCheck, Unlock, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { unlockPdf, UnlockPdfOutput } from '@/ai/flows/unlock-pdf';
import AdBanner from '@/components/ad-banner';

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<UnlockPdfOutput | null>(null);
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
        description: 'Please select a PDF file to unlock.',
      });
      return;
    }
    if (!password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Password Required',
        description: 'Please enter the password to unlock the file.',
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
          const result = await unlockPdf({ 
            pdfDataUri: base64File, 
            fileName: file.name, 
            password
          });
          setProcessResult(result);
          toast({
            title: 'PDF Unlocked Successfully',
            description: 'Your unlocked PDF is ready for download.',
          });
        } catch (error) {
           toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: `An error occurred while unlocking the file. It might be the wrong password. ${error instanceof Error ? error.message : ''}`,
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Unlock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Unlock PDF</CardTitle>
              <CardDescription className="text-lg">
                Remove the password from your PDF file.
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Enter the PDF password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>

                   <Button onClick={processFile} className="w-full text-lg py-6" size="lg" disabled={!file || !password.trim() || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      'Unlock PDF'
                    )}
                  </Button>
                </div>
              )}

              {processResult && (
                 <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
                    <FileCheck className="h-5 w-5 text-current" />
                    <AlertTitle className="font-bold">PDF Unlocked!</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                       <p className="text-center sm:text-left">Your file <span className="font-semibold">{processResult.fileName}</span> is ready.</p>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                             <Button onClick={downloadPdf} size="sm" className="bg-primary hover:bg-primary/90">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                             <Button onClick={resetTool} size="sm" variant="outline" className="bg-background/80">
                                Unlock Another
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">By using this tool, you confirm you have the right to remove the password from this file.</p>
            </CardFooter>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Remove PDF Passwords with Ease</h2>
            <p>Our Unlock PDF tool provides a simple way to remove password protection from your PDF files, making them accessible for viewing and editing without needing to enter a password every time. This is perfect for when you have the password to a document but want to create an unrestricted version for easier access or for sharing with others who do not need the security layer.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2 id="how-it-works">How Does PDF Unlocking Work?</h2>
            <p>The process is secure and straightforward. You upload your password-protected PDF, provide the correct password, and our tool will create a new version of the file with the encryption removed. The content and layout of your document remain completely unchanged. Your privacy is our priority; all files and passwords are handled securely and are automatically deleted from our servers after a short period.</p>
            <h3>Key Benefits of Using Our Unlock PDF Tool</h3>
            <ul>
              <li><strong>Easy Access:</strong> Open your PDF without needing to enter a password every time.</li>
              <li><strong>Simple to Use:</strong> A straightforward interface allows you to unlock your files in just a few clicks.</li>
              <li><strong>Preserves Quality:</strong> The content and quality of your original document are fully maintained.</li>
              <li><strong>Fast and Secure Processing:</strong> Your files are handled quickly over an encrypted connection and are permanently deleted from our servers.</li>
              <li><strong>Completely Free:</strong> Remove passwords from as many PDFs as you need, without any cost or limitations.</li>
            </ul>
            <p>Using a "PDF password remover" is a convenient way to manage your documents. Please ensure you have the legal right to remove the password from the file. Unlock your PDFs today with our free, fast, and secure online tool.</p>
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
