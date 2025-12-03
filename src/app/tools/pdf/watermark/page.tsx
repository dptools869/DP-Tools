
import type { Metadata } from 'next';
import { WatermarkPdfClient } from './client';

export const metadata: Metadata = {
    title: 'Watermark PDF Online – Add or Remove Watermark from PDF Easily (Free Tool)',
    description: 'Add watermark to PDF or remove watermark from PDF online for free. Protect PDF documents with text or image watermarks without Adobe Acrobat.',
    keywords: [
        'watermark PDF',
        'add watermark PDF',
        'remove watermark PDF',
        'how to watermark a PDF',
        'watermark PDF document',
        'add watermark to PDF without Acrobat',
        'apply watermark to PDF online free',
        'protect PDF with watermark',
        'how to add watermark to PDF easily',
        'watermark PDF tool online'
    ]
};

export default function WatermarkPdfPage() {
    return <WatermarkPdfClient />;
}
