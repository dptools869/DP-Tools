
import type { Metadata } from 'next';
import BmrCalculatorClient from './client';

export const metadata: Metadata = {
    title: 'BMR Calculator | Basal Metabolic Rate',
    description: 'Estimate your Basal Metabolic Rate (BMR) with our free online calculator. Understand the calories your body needs at rest for weight management. Uses Mifflin-St Jeor equation.',
    keywords: ['BMR calculator', 'basal metabolic rate', 'calculate BMR', 'metabolism calculator', 'calorie needs at rest']
};

export default function BmrCalculatorPage() {
    return <BmrCalculatorClient />;
}
