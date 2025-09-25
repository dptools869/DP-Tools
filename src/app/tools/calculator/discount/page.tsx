
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<{ finalPrice: string, savedAmount: string } | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(originalPrice);
    const discountPercent = parseFloat(discount);

    if (!isNaN(price) && !isNaN(discountPercent) && price > 0 && discountPercent >= 0) {
      const savedAmount = price * (discountPercent / 100);
      const finalPrice = price - savedAmount;

      setResult({
        finalPrice: finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        savedAmount: savedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
              <CardTitle className="text-3xl font-headline">Discount Calculator</CardTitle>
              <CardDescription className="text-lg">
                Quickly calculate the final price after a discount.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Enter Price and Discount</CardTitle>
                <CardDescription>Find out how much you save and the final price.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="original-price">Original Price ($)</Label>
                    <Input id="original-price" type="number" placeholder="e.g., 80.00" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="discount-rate">Discount (%)</Label>
                    <Input id="discount-rate" type="number" placeholder="e.g., 20" value={discount} onChange={e => setDiscount(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Discount</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Amount Saved</Label>
                        <div className="text-2xl font-bold text-primary">${result.savedAmount}</div>
                    </div>
                    <div>
                        <Label>Final Price (after discount)</Label>
                        <div className="text-2xl font-bold text-green-500">${result.finalPrice}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate a Discount</h2>
            <p>Calculating discounts is a common part of shopping and budgeting. Our calculator makes it easy, but understanding the formula can help you make quick decisions while you're out. Here's how it works:</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Discount Formula</h3>
            <p>The calculation for a discount is straightforward:</p>
             <ol>
              <li><strong>Convert the Discount Percentage to a Decimal:</strong> Divide the discount percentage by 100. For example, a 25% discount becomes <code>0.25</code>.</li>
              <li><strong>Calculate the Amount Saved:</strong> Multiply the original price by the decimal discount. For an item that costs $120 with a 25% discount, the calculation is <code>$120 * 0.25 = $30</code>. You save $30.</li>
              <li><strong>Calculate the Final Price:</strong> Subtract the saved amount from the original price: <code>$120 - $30 = $90</code>.</li>
            </ol>
            <p>Our calculator automates these steps, providing a quick and error-free way to determine your savings and the final cost of an item. This is especially helpful for checking prices during sales events.</p>
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
