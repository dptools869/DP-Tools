
import type { Metadata } from 'next';
import { ProtectPdfClient } from './client';

export const metadata: Metadata = {
    title: 'Password Protect PDF Free | Add Password to PDF Online (2025 Guide)',
    description: 'Easily password protect your PDF files online for free. Learn how to add a password to a PDF without Adobe Acrobat. Secure, fast, and no installation required.',
    keywords: [
        'protect pdf',
        'password protect pdf',
        'protect pdf document',
        'how to password protect pdf',
        'add password to pdf without acrobat',
        'password protect pdf free',
        'how to protect pdf documents online',
        'adobe reader password protect pdf',
        'how do you password protect pdf files',
        'PDF encryption',
        'secure PDF sharing',
        'lock PDF files',
        'protect confidential documents',
        'encrypted PDF download'
    ]
};

export default function ProtectPdfPage() {
    return <ProtectPdfClient />;
}
