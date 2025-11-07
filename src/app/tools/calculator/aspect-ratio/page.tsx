
import type { Metadata } from 'next';
import { AspectRatioClient } from './client';

export const metadata: Metadata = {
    title: 'Free Aspect Ratio Calculator | Maintain Perfect Dimensions Online',
    description: 'Use our free Aspect Ratio Calculator to find the perfect width and height for images or videos. Keep visuals proportional, professional, and distortion-free instantly.',
    keywords: [
        'aspect ratio calculator',
        'image aspect ratio calculator',
        'aspect ratio converter',
        'Calculate the aspect ratio',
        '16:9 aspect ratio calculator',
        'aspect ratio chart',
        '4:3 aspect ratio calculator',
        'aspect ratio for YouTube videos',
        'resize image aspect ratio',
        'photo aspect ratio calculator'
    ]
};

export default function AspectRatioCalculatorPage() {
    return <AspectRatioClient />;
}
