
import type { Metadata } from 'next';
import { ImageResizerClient } from './client';

export const metadata: Metadata = {
    title: 'Free Image Resizer Online | Resize Images Without Losing Quality',
    description: 'Resize images online quickly and easily. Adjust dimensions, reduce file size, and maintain quality, all for free. No downloads or sign-ups needed.',
    keywords: [
        'Image Size Reducer',
        'Free Image Resizer',
        'Reduce File Size',
        'Image Resolution Enhancer',
        'Image Enlarger',
        'Online Image Resizer',
        'Bulk Image Resizer',
        'Total Control',
        'Resize Images Online',
        'Compress Images Online',
        'Enhance Images',
        'Image Size Increase',
        'AI Image Resizer',
        'Resize Image to 20KB',
        'Resize Image to 100KB',
        'Increase Image Size in KB',
        'Resize Photos Online',
        'Web Performance Optimization',
        'Fast and Efficient',
        'Image Resizer Tool',
        'Best Image Resizer',
        'Resize Images Without Losing Quality',
        'Free Forever',
        'Social Media Image Resizer',
        'Image Re-sizer',
        'Free Online Tool'
    ]
};

export default function ImageResizerPage() {
    return <ImageResizerClient />;
}
