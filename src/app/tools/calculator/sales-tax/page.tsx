
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function SalesTaxCalculatorPage() {
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState<{ salesTax: string, finalPrice: string } | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(price);
    const r = parseFloat(taxRate);

    if (!isNaN(p) && !isNaN(r)) {
      const salesTax = p * (r / 100);
      const finalPrice = p + salesTax;

      setResult({
        salesTax: salesTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        finalPrice: finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
              <CardTitle className="text-3xl font-headline">Sales Tax Calculator</CardTitle>
              <CardDescription className="text-lg">
                Quickly calculate the sales tax and total price of an item.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Enter Price and Tax Rate</CardTitle>
                <CardDescription>Find out the sales tax and the final price.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="pre-tax-price">Pre-tax Price ($)</Label>
                    <Input id="pre-tax-price" type="number" placeholder="e.g., 100.00" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="tax-rate">Sales Tax Rate (%)</Label>
                    <Input id="tax-rate" type="number" placeholder="e.g., 8.25" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Sales Tax</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Sales Tax Amount</Label>
                        <div className="text-2xl font-bold text-primary">${result.salesTax}</div>
                    </div>
                    <div>
                        <Label>Final Price (including tax)</Label>
                        <div className="text-2xl font-bold text-green-500">${result.finalPrice}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Sales Tax</h2>
            <p>Sales tax is a consumption tax imposed by the government on the sale of goods and services. Calculating it is a common task whether you're a shopper trying to figure out the final price or a business owner needing to charge the correct amount. Our calculator makes it simple, but here's the formula so you can understand how it works.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Sales Tax Formula</h3>
            <p>The calculation for sales tax is straightforward:</p>
             <ol>
              <li><strong>Convert the Tax Rate to a Decimal:</strong> Divide the sales tax rate by 100. For example, a rate of 8.25% becomes <code>0.0825</code>.</li>
              <li><strong>Calculate the Tax Amount:</strong> Multiply the pre-tax price of the item by the decimal tax rate. For an item that costs $50 with an 8.25% tax rate, the calculation is <code>$50 * 0.0825 = $4.13</code>.</li>
              <li><strong>Calculate the Final Price:</strong> Add the tax amount to the original price: <code>$50 + $4.13 = $54.13</code>.</li>
            </ol>
            <p>Our calculator automates these steps, providing a quick and error-free way to determine both the tax amount and the total cost of your purchase. This is especially helpful when dealing with multiple items or complex tax rates.</p>
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
