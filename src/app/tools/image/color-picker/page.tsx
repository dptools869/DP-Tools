
import type { Metadata } from 'next';
import { ColorPickerClient } from './client';

export const metadata: Metadata = {
    title: 'Color Picker - Find and Copy the Perfect Colour Instantly',
    description: 'Instantly find, match, and copy colors with our free online Color Picker tool. Get accurate HEX, RGB, and HSL codes for web, design, and print projects.',
};

export default function ColorPickerPage() {
    return <ColorPickerClient />;
}
