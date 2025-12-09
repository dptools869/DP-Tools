
import type { Metadata } from 'next';
import { UnlockPdfClient } from './client';

export const metadata: Metadata = {
    title: 'Unlock PDF Online Free – How to Remove PDF Password Protection Safely & Easily (2025 Guide)',
    description: 'Learn how to unlock PDF files for free, remove passwords, and access restricted documents online. A complete guide to unlocking PDFs safely without Adobe Acrobat.',
    keywords: [
        "unlock pdf",
        "unlock pdf online",
        "unlock pdf free",
        "remove pdf password",
        "unlock pdf documents"
    ]
};

export default function UnlockPdfPage() {
    return <UnlockPdfClient />;
}
