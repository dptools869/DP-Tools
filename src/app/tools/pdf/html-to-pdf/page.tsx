
import type { Metadata } from 'next';
import { HtmlToPdfClient } from './client';

export const metadata: Metadata = {
    title: 'HTML to PDF Conversion Guide (2025): Simple, Accurate & Fast',
    description: 'Learn how to convert HTML pages to PDF quickly and accurately. Easy methods, tools, tips, FAQs, and best practices for clean, professional output.',
};

export default function HtmlToPdfPage() {
    return <HtmlToPdfClient />;
}
