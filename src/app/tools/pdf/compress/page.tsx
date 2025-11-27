
import type { Metadata } from 'next';
import { CompressPdfClient } from './client';

export const metadata: Metadata = {
    title: 'Compress PDF Online (2025 Guide): Reduce File Size Without Losing Quality',
    description: 'Learn how to compress PDF files without losing quality. Simple steps, best tools, tips, FAQs, and mistakes to avoid. Make your PDFs lighter and easier to share.',
    keywords: [
        'compress PDF',
        'PDF compressor',
        'reduce PDF size',
        'compress PDF online',
        'PDF compression',
        'shrink PDF file',
        'PDF optimize',
        'reduce PDF file size without losing quality',
        'online PDF compressor',
        'best PDF compression tool',
        'how to compress a large PDF',
        'compress PDF for email',
        'compress scanned PDF',
        'shrink PDF for web upload'
    ]
};

export default function CompressPdfPage() {
    return <CompressPdfClient />;
}
