
import type { Metadata } from 'next';
import { ThumbnailPreviewClient } from './client';

export const metadata: Metadata = {
    title: 'Thumbnail Preview Generator | Free Online Tool',
    description: 'Create and preview thumbnails instantly with our free Thumbnail Preview tool. Perfect for YouTube, blogs, and social media, quick, clear, and accurate.',
    keywords: [
        'YouTube thumbnail preview',
        'Instagram thumbnail preview',
        'Twitter thumbnail preview',
    ]
};

export default function ThumbnailPreviewPage() {
    return <ThumbnailPreviewClient />;
}
