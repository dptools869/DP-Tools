
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function ProfitMarginCalculatorPage() {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [result, setResult] = useState<{ profit: string, margin: string } | null>(null);

  const handleCalculate = () => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);

    if (!isNaN(c) && !isNaN(r) && r > 0) {
      const profit = r - c;
      const margin = (profit / r) * 100;

      setResult({
        profit: profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        margin: margin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
                <Percent className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Profit Margin Calculator</CardTitle>
              <CardDescription className="text-lg">
                Quickly calculate your profit margin to assess business profitability.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Enter Cost and Revenue</CardTitle>
                <CardDescription>Find out your net profit and profit margin percentage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="cost">Cost of Goods Sold ($)</Label>
                    <Input id="cost" type="number" placeholder="e.g., 50.00" value={cost} onChange={e => setCost(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="revenue">Revenue ($)</Label>
                    <Input id="revenue" type="number" placeholder="e.g., 120.00" value={revenue} onChange={e => setRevenue(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Profit Margin</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Net Profit</Label>
                        <div className="text-2xl font-bold text-primary">${result.profit}</div>
                    </div>
                    <div>
                        <Label>Profit Margin</Label>
                        <div className="text-2xl font-bold text-green-500">{result.margin}%</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Profit Margin</h2>
            <p>Profit margin is one of the most important metrics for measuring a business's profitability. It represents what percentage of revenue has turned into profit. Our calculator makes it easy, but understanding the formula is key for any business owner or entrepreneur.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Profit Margin Formula</h3>
            <p>The calculation is a two-step process:</p>
             <ol>
              <li><strong>Calculate Net Profit:</strong> Subtract your cost of goods sold from your revenue. <code>Net Profit = Revenue - Cost</code>.</li>
              <li><strong>Calculate the Margin:</strong> Divide your net profit by your revenue, and then multiply by 100 to get the percentage. <code>Profit Margin = (Net Profit / Revenue) * 100</code>.</li>
            </ol>
            <p>For example, if your revenue is $120 and your cost is $50, your net profit is $70. Your profit margin would then be <code>($70 / $120) * 100 = 58.33%</code>. Our calculator provides a quick and error-free way to determine your profitability, helping you make informed decisions about pricing, cost management, and business strategy.</p>
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
