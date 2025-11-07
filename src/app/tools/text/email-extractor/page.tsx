
import type { Metadata } from 'next';
import { EmailExtractorClient } from './client';

export const metadata: Metadata = {
    title: 'Free Online Email Extractor | Quickly Extract Valid Email Addresses',
    description: 'Extract email addresses instantly from text or files. This is a fast, accurate, and secure email extractor online, with no signup required. Try it free today!',
    keywords: [
        "Email extractor",
        "Data cleaning",
        "Duplicate removal",
        "Extract email addresses",
        "Download email list",
        "Smart validation",
        "Free email tool",
        "Online email extraction",
        "Secure email extraction",
        "Valid email detection"
    ]
};

export default function EmailExtractorPage() {
    return <EmailExtractorClient />;
}
