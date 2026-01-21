
import type { Metadata } from 'next';
import BmiCalculatorClient from './client';

export const metadata: Metadata = {
    title: 'BMI Calculator | Calculate Your Body Mass Index',
    description: 'Use our free BMI calculator to check your Body Mass Index and understand your weight status. Works with metric (kg, cm) and imperial (lbs, ft, in) units.',
    keywords: ['BMI calculator', 'body mass index', 'calculate BMI', 'health calculator', 'weight status']
};

export default function BmiCalculatorPage() {
    return <BmiCalculatorClient />;
}
