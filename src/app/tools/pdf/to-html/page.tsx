
import type { Metadata } from 'next';
import { PdfToHtmlClient } from './client';

export const metadata: Metadata = {
    title: 'PDF to HTML Conversion Guide (2025) – Best Tools, Methods & SEO-Friendly Practices',
    description: 'Learn how to convert PDF to HTML easily using online tools, software, and APIs. A complete 2025 guide with SEO tips, best practices, benefits, FAQs, and professional insights.',
    keywords: [
        'PDF to HTML',
        'convert PDF',
        'HTML converter',
        'PDF to HTML online',
        'PDF conversion',
        'how to convert PDF to HTML step by step',
        'best PDF to HTML converter tools',
        'free PDF to HTML conversion online',
        'PDF to HTML for SEO',
        'convert scanned PDF to HTML',
        'clean HTML from PDF',
        'professional PDF to HTML software',
        'responsive HTML from PDF',
    ]
};

export default function PdfToHtmlPage() {
    return <PdfToHtmlClient />;
}
