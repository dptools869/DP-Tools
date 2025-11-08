
import type { Metadata } from 'next';
import { TextCaseConverterClient } from './client';

export const metadata: Metadata = {
    title: 'Text Case Converter | Change Text to Upper, Lower & More',
    description: 'Easily convert text to uppercase, lowercase, title case, or sentence case with our free Text Case Converter. Fast, accurate, and simple to use online.',
    keywords: [
        'text case changer',
        'text case converter',
        'case converter online',
        'convert text to lowercase',
        'convert text to uppercase',
        'lowercase text converter',
        'online text case converter',
        'text formatting online'
    ]
};

export default function TextCaseConverterPage() {
    return <TextCaseConverterClient />;
}
