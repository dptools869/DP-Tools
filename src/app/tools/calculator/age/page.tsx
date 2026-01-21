
import type { Metadata } from 'next';
import AgeCalculatorClient from './client';

export const metadata: Metadata = {
    title: 'Age Calculator | Calculate Your Exact Age in Years, Months, and Days',
    description: 'Find out your precise age in years, months, and days with our free online Age Calculator. Also calculates total days, weeks, months, and time until your next birthday.',
    keywords: ['age calculator', 'how old am I', 'calculate age', 'date of birth calculator', 'exact age calculator', 'birthday countdown']
};

export default function AgeCalculatorPage() {
    return <AgeCalculatorClient />;
}
