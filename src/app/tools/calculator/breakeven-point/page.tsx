'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Banknote } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CURRENCIES = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];


export default function BreakevenPointCalculatorPage() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [result, setResult] = useState<{ units: string, revenue: string } | null>(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    setCurrency(selected);
  };

  const handleCalculate = () => {
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);

    if (!isNaN(fc) && !isNaN(vc) && !isNaN(sp) && sp > vc) {
      const breakevenUnits = fc / (sp - vc);
      const breakevenRevenue = breakevenUnits * sp;

      setResult({
        units: breakevenUnits.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
        revenue: breakevenRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      });
    } else {
        setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Calculator className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Breakeven Point Calculator</CardTitle>
              <CardDescription className="text-lg">
                Determine the sales volume needed to cover your costs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Enter Your Business Costs and Price</CardTitle>
                        <CardDescription>Find the point where your revenue equals your costs.</CardDescription>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency" className="flex items-center gap-1"><Banknote className="w-4 h-4"/> Currency</Label>
                        <Select value={currency.code} onValueChange={handleCurrencyChange}>
                            <SelectTrigger id="currency" className="w-[180px]">
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCIES.map(c => (
                                    <SelectItem key={c.code} value={c.code}>{c.name} ({c.symbol})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="fixed-costs">Total Fixed Costs ({currency.symbol})</Label>
                    <Input id="fixed-costs" type="number" placeholder="e.g., 10000" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="variable-cost">Variable Cost Per Unit ({currency.symbol})</Label>
                    <Input id="variable-cost" type="number" placeholder="e.g., 12.50" value={variableCost} onChange={e => setVariableCost(e.target.value)} />
                  </div>
                   <div className='space-y-2'>
                    <Label htmlFor="selling-price">Selling Price Per Unit ({currency.symbol})</Label>
                    <Input id="selling-price" type="number" placeholder="e.g., 25.00" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Breakeven Point</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Breakeven Point (Units)</Label>
                        <div className="text-2xl font-bold text-primary">{result.units} units</div>
                    </div>
                    <div>
                        <Label>Breakeven Point (Revenue)</Label>
                        <div className="text-2xl font-bold text-green-500">{currency.symbol}{result.revenue}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate the Breakeven Point</h2>
            <p>The breakeven point is a crucial financial metric for any business, indicating the point at which total costs and total revenue are equal, meaning there is no net loss or gain. Understanding your breakeven point helps in setting prices, managing costs, and determining sales targets.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Breakeven Point Formula</h3>
            <p>The calculation is based on your fixed costs, variable costs, and selling price:</p>
             <ol>
              <li><strong>Identify Fixed Costs:</strong> These are costs that do not change with the number of units produced, such as rent, salaries, and insurance.</li>
              <li><strong>Identify Variable Cost Per Unit:</strong> These are the costs that change directly with the number of units produced, such as raw materials and direct labor.</li>
              <li><strong>Determine Selling Price Per Unit:</strong> This is the price at which you sell a single unit of your product or service.</li>
            </ol>
            <p>The formula to calculate the breakeven point in units is: <strong>Breakeven Point (Units) = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)</strong>. The denominator (Selling Price - Variable Cost) is known as the contribution margin per unit.</p>
            <p>Our calculator simplifies this formula, giving you a clear and immediate understanding of your business's financial hurdles and paving the way for profitable decision-making.</p>
          </article>

          <AdBanner type="bottom-banner" className="mt-12" />
        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
