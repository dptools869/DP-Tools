
import type { Metadata } from 'next';
import { CircleCropClient } from './client';

export const metadata: Metadata = {
    title: 'Circle Crop Tool Free | Instantly Turn Images Into Perfect Circles',
    description: 'Use our free Circle Crop Tool to convert any photo or graphic into a clean, round image in seconds. No signup needed, transparent background, ready for web or socials.',
    keywords: [
        'crop images online',
        'online image cropper',
        'Crop the image into a circle',
        'round image cropper',
        'circle crop tool',
        'online circle crop'
    ]
};

export default function CircleCropPage() {
    return <CircleCropClient />;
}
