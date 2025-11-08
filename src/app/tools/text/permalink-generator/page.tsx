
import type { Metadata } from 'next';
import { PermalinkGeneratorClient } from './client';

export const metadata: Metadata = {
    title: 'Free Permalink Generator | Create SEO-Friendly URLs',
    description: 'Generate clean, keyword-rich, and SEO-friendly URLs with our free Permalink Generator. Perfect for blogs, eCommerce, and websites. Fast, simple, and accurate.',
    keywords: [
        'permalink generator',
        'SEO URL generator',
        'URL generator tool',
        'URL optimization tool',
        'clean link generator'
    ]
};

export default function PermalinkGeneratorPage() {
    return <PermalinkGeneratorClient />;
}
