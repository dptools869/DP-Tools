
import type { Metadata } from 'next';
import { InternetSpeedCheckerClient } from './client';

export const metadata: Metadata = {
    title: 'Free Internet Speed Checker | Test Speed Online Instantly',
    description: 'Check your internet speed instantly. Test download, upload, and ping in seconds with our free Internet Speed Checker—fast, accurate, and secure results.',
    keywords: [
        'wifi speed test',
        'test internet speed',
        'network speed test',
        'ping test',
        'download speed test',
        'internet connection test',
        'upload speed test',
        'Check the internet connection',
        'internet speed checker',
        'Check upload speed'
    ]
};

export default function InternetSpeedCheckerPage() {
    return <InternetSpeedCheckerClient />;
}
