
import type { Metadata } from 'next';
import { MergePdfClient } from './client';

export const metadata: Metadata = {
    title: 'Merge PDF Files Easily: A Complete Guide to Combining PDFs Securely (2025)',
    description: 'Learn how to merge PDF files quickly and safely using online tools, desktop software, and mobile apps. Step-by-step guide, best PDF combiners, security tips, and expert recommendations.',
    keywords: ['merge pdf', 'pdf merger', 'combine pdf', 'pdf combiner', 'merge pdf online', 'online pdf merger', 'secure pdf merge', 'pdf combine tool', 'merge multiple pdfs', 'free pdf merger'],
};

export default function MergePdfPage() {
    return <MergePdfClient />;
}
