
import type { Metadata } from 'next';
import { PdfToTextClient } from './client';

export const metadata: Metadata = {
    title: 'PDF to Text Converter | Extract Text From PDF Free (OCR)',
    description: 'Use the best PDF to Text converter to extract text from scanned and digital PDFs instantly. Our online OCR tool is free, fast, and requires no software.',
    keywords: [
        'PDF to text',
        'PDF to text converter',
        'PDF to text recognition',
        'PDF to text reader',
        'Turn PDF to text',
        'PDF to text OCR online',
        'PDF to text conversion free',
        'PDF to text online converter',
        'Convert PDF to text without software',
        'PDF to text translator tool',
        'Extract text from scanned PDF'
    ]
};

export default function PdfToTextPage() {
    return <PdfToTextClient />;
}
