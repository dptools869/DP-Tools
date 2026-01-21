
import type { Metadata } from 'next';
import CalorieCalculatorClient from './client';

export const metadata: Metadata = {
    title: 'Daily Calorie Calculator | TDEE Calculator',
    description: 'Estimate your daily calorie needs for weight loss, maintenance, or gain with our free Total Daily Energy Expenditure (TDEE) calculator. Based on your BMR and activity level.',
    keywords: ['calorie calculator', 'TDEE calculator', 'daily calorie needs', 'maintenance calories', 'weight loss calculator', 'calorie intake']
};

export default function CalorieCalculatorPage() {
    return <CalorieCalculatorClient />;
}
