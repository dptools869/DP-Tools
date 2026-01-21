
import type { Metadata } from 'next';
import BreakevenPointCalculatorClient from './client';

export const metadata: Metadata = {
    title: 'Breakeven Point Calculator | Find Your Business Breakeven Point',
    description: 'Use our free breakeven point calculator to determine the sales volume or revenue needed to cover your costs. Essential for business planning, pricing strategies, and financial health.',
    keywords: ['breakeven point calculator', 'break even analysis', 'calculate breakeven', 'business calculator', 'financial calculator', 'fixed costs', 'variable costs']
};

export default function BreakevenPointCalculatorPage() {
    return <BreakevenPointCalculatorClient />;
}
