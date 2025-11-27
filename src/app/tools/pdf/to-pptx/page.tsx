
import type { Metadata } from 'next';
import { PdfToPptxClient } from './client';

export const metadata: Metadata = {
    title: 'PDF to PowerPoint Conversion (2025 Guide): How to Convert PDF to PPT Easily & Free',
    description: 'Learn how to convert PDF to PowerPoint quickly, accurately, and for free. This 2025 guide explains the best PDF to PPT tools, step-by-step methods, tips for high-quality conversion, common problems, and expert advice based on hands-on experience.',
    keywords: [
        'PDF to PowerPoint conversion',
        'PDF to PPT converter',
        'convert PDF to PowerPoint',
        'PDF to PPTX online',
        'free PDF to PowerPoint tool',
        'best PDF to PPT converter online',
        'how to convert PDF to PPT easily',
        'convert PDF slides to PowerPoint',
        'PDF to PPT conversion with OCR',
        'editable PowerPoint from PDF',
        'convert scanned PDF to PPT',
        'PDF conversion tools',
        'PPT slide editing',
        'online file converters',
        'PowerPoint redesign',
        'presentation tools'
    ]
};

export default function PdfToPptxPage() {
    return <PdfToPptxClient />;
}
