
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HandCoins } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Slider } from '@/components/ui/slider';

export default function TipCalculatorPage() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState('1');

  const billAmount = parseFloat(bill);
  const numberOfPeople = parseInt(people);

  const tipAmount = isNaN(billAmount) ? 0 : billAmount * (tipPercent / 100);
  const totalBill = isNaN(billAmount) ? 0 : billAmount + tipAmount;
  const perPersonAmount = isNaN(billAmount) || numberOfPeople < 1 ? 0 : totalBill / numberOfPeople;

  const handleReset = () => {
    setBill('');
    setTipPercent(15);
    setPeople('1');
  };
  
  const formatCurrency = (value: number) => {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <HandCoins className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Tip Calculator</CardTitle>
              <CardDescription className="text-lg">
                Quickly calculate the tip and split the bill between friends.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="bill-amount" className="font-bold text-base">Bill Amount</Label>
                        <Input id="bill-amount" type="number" placeholder="0.00" value={bill} onChange={e => setBill(e.target.value)} className="h-12 text-2xl text-right mt-2" />
                    </div>

                    <div>
                        <Label className="font-bold text-base">Select Tip %</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {[5, 10, 15, 25, 50].map(p => (
                                <Button key={p} variant={tipPercent === p ? 'default' : 'secondary'} onClick={() => setTipPercent(p)}>{p}%</Button>
                            ))}
                             <Input type="number" placeholder="Custom" onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)} className="h-10 text-center" />
                        </div>
                    </div>
                    
                    <div>
                        <Label htmlFor="people" className="font-bold text-base">Number of People</Label>
                        <Input id="people" type="number" placeholder="1" value={people} onChange={e => setPeople(e.target.value)} className="h-12 text-2xl text-right mt-2" />
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-primary/90 text-primary-foreground rounded-lg p-6 flex flex-col justify-between">
                    <div className='space-y-6'>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">Tip Amount</p>
                                <p className="text-sm opacity-80">/ person</p>
                            </div>
                            <p className="text-4xl font-bold">{formatCurrency(isNaN(billAmount) ? 0 : tipAmount / (numberOfPeople || 1))}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">Total</p>
                                <p className="text-sm opacity-80">/ person</p>
                            </div>
                            <p className="text-4xl font-bold">{formatCurrency(perPersonAmount)}</p>
                        </div>
                    </div>
                    <Button onClick={handleReset} variant="secondary" className="w-full mt-6 h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/80">RESET</Button>
                </div>
              </CardContent>
            </Card>
          

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate a Tip</h2>
            <p>Calculating a tip is a common part of dining out. While the exact percentage can vary based on service quality and local customs, a standard tip is typically 15-20% of the pre-tax bill. Our calculator makes this easy, but here's how you can do it manually:</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>1. Determine the Tip Percentage</h3>
            <p>Decide on the percentage you'd like to tip. For example, let's use 20% for excellent service.</p>
             
            <h3>2. Convert Percentage to a Decimal</h3>
            <p>Divide the percentage by 100. So, 20% becomes 0.20.</p>

            <h3>3. Calculate the Tip Amount</h3>
            <p>Multiply the total bill amount by the decimal. If your bill is $50, the calculation is <code>$50 * 0.20 = $10</code>. The tip is $10.</p>

            <h3>4. Calculate the Total Bill</h3>
            <p>Add the tip amount to the original bill: <code>$50 + $10 = $60</code>.</p>

             <h3>5. Splitting the Bill</h3>
            <p>If you're dining with friends, simply divide the total bill by the number of people. For a $60 bill split between 4 people, it's <code>$60 / 4 = $15</code> per person.</p>
            <p>Our calculator automates all these steps for you, making it quick and easy to figure out the right amount to leave, especially when you need to split the bill.</p>
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
