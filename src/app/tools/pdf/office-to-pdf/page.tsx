
import type { Metadata } from 'next';
import { OfficeToPdfClient } from './client';

export const metadata: Metadata = {
    title: 'Convert Office Files to PDF: Complete Guide for Microsoft & Google (2025)',
    description: 'Learn how to convert Word, Excel, PowerPoint, Google Docs, Sheets, and Slides to PDF. Step-by-step guide, tips, mistakes to avoid, and advanced PDF tools.',
    keywords: [
        'convert office files to pdf',
        'word to pdf',
        'excel to pdf',
        'powerpoint to pdf',
        'google docs to pdf',
        'save as pdf',
        'export to pdf',
        'download as pdf',
        'convert spreadsheets to pdf',
        'pdf conversion tools',
        'office to pdf converter',
        'google workspace pdf export',
        'best pdf converter online',
        'how to convert google docs to pdf step by step',
        'convert excel to pdf without losing format',
        'why does pdf change formatting',
        'office files to pdf online free',
        'compress pdf for email'
    ]
};

export default function OfficeToPdfPage() {
    return <OfficeToPdfClient />;
}
