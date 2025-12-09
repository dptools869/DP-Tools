
import type { Metadata } from 'next';
import { RotatePdfClient } from './client';

export const metadata: Metadata = {
    title: 'Rotate PDF Online – Rotate PDF Pages Permanently for Free (2025 Guide)',
    description: 'Rotate PDF pages online for free. Turn PDF pages left or right, rotate a single page or whole document, and save permanently without Adobe Acrobat.',
    keywords: [
        'rotate pdf',
        'rotate pdf document',
        'rotate pdf pages',
        'rotate pdf online',
        'rotate pdf free',
        'how to rotate pdf and save',
        'rotate pdf page permanently',
        'rotate pdf single page',
        'rotate pdf online free',
        'rotate pdf without adobe acrobat'
    ]
};

export default function RotatePdfPage() {
    return <RotatePdfClient />;
}
