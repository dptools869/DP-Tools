
import type { Metadata } from 'next';
import { PdfOcrClient } from './client';

export const metadata: Metadata = {
    title: 'PDF OCR Tool Online – Convert Scanned PDFs to Text or Word Easily',
    description: 'Use the best PDF OCR tool to extract text from scanned PDFs instantly. Convert PDF OCR to text, Word, or searchable PDF online for free.',
    keywords: [
        'PDF OCR',
        'PDF OCR Tool',
        'OCR a PDF',
        'PDF OCR to text',
        'PDF OCR to Word',
        'PDF OCR conversion',
        'PDF OCR to PDF',
        'OCR scanned PDF online free',
        'convert PDF OCR easily',
        'PDF OCR without software',
        'extract text from scanned PDF',
        'best free PDF OCR converter 2025'
    ]
};

export default function PdfOcrPage() {
    return <PdfOcrClient />;
}
