
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Banknote } from 'lucide-react';
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


export default function InterestCalculatorPage() {
  // --- Simple Interest State ---
  const [simpleInterest, setSimpleInterest] = useState({ principal: '', rate: '', time: '' });
  const [simpleInterestResult, setSimpleInterestResult] = useState<{ interest: string, total: string } | null>(null);

  // --- Compound Interest State ---
  const [compoundInterest, setCompoundInterest] = useState({ principal: '', rate: '', time: '', frequency: '1' });
  const [compoundInterestResult, setCompoundInterestResult] = useState<{ interest: string, total: string } | null>(null);
  
  const [currency, setCurrency] = useState(CURRENCIES.find(c => c.code === 'INR') || CURRENCIES[0]);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    setCurrency(selected);
  };

  const handleSimpleInterest = () => {
    const p = parseFloat(simpleInterest.principal);
    const r = parseFloat(simpleInterest.rate) / 100;
    const t = parseFloat(simpleInterest.time);

    if (!isNaN(p) && !isNaN(r) && !isNaN(t)) {
      const interest = p * r * t;
      const total = p + interest;
      setSimpleInterestResult({
        interest: interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        total: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      });
    }
  };
  
  const handleCompoundInterest = () => {
    const p = parseFloat(compoundInterest.principal);
    const r = parseFloat(compoundInterest.rate) / 100;
    const t = parseFloat(compoundInterest.time);
    const n = parseInt(compoundInterest.frequency);

    if (!isNaN(p) && !isNaN(r) && !isNaN(t) && !isNaN(n)) {
        const total = p * Math.pow((1 + r / n), n * t);
        const interest = total - p;
        setCompoundInterestResult({
            interest: interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            total: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Landmark className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Interest Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate simple and compound interest for your investments or loans.
              </CardDescription>
            </CardHeader>
             <CardFooter>
                 <div className="space-y-2 w-full flex justify-center">
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
             </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Simple Interest Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Simple Interest Calculator</CardTitle>
                <CardDescription>Calculate interest on the principal amount only.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="si-principal">Principal Amount ({currency.symbol})</Label>
                    <Input id="si-principal" type="number" placeholder="e.g., 1000" value={simpleInterest.principal} onChange={e => setSimpleInterest({ ...simpleInterest, principal: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="si-rate">Annual Interest Rate (%)</Label>
                    <Input id="si-rate" type="number" placeholder="e.g., 5" value={simpleInterest.rate} onChange={e => setSimpleInterest({ ...simpleInterest, rate: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="si-time">Time Period (Years)</Label>
                    <Input id="si-time" type="number" placeholder="e.g., 10" value={simpleInterest.time} onChange={e => setSimpleInterest({ ...simpleInterest, time: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleSimpleInterest} className="w-full sm:w-auto">Calculate Simple Interest</Button>
                {simpleInterestResult && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Total Interest</Label>
                        <div className="text-2xl font-bold text-primary">{currency.symbol}{simpleInterestResult.interest}</div>
                    </div>
                    <div>
                        <Label>Total Principal + Interest</Label>
                        <div className="text-2xl font-bold text-green-500">{currency.symbol}{simpleInterestResult.total}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compound Interest Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Compound Interest Calculator</CardTitle>
                <CardDescription>Calculate interest on the principal plus accumulated interest.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className='space-y-2'>
                    <Label htmlFor="ci-principal">Principal Amount ({currency.symbol})</Label>
                    <Input id="ci-principal" type="number" placeholder="e.g., 1000" value={compoundInterest.principal} onChange={e => setCompoundInterest({ ...compoundInterest, principal: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="ci-rate">Annual Interest Rate (%)</Label>
                    <Input id="ci-rate" type="number" placeholder="e.g., 5" value={compoundInterest.rate} onChange={e => setCompoundInterest({ ...compoundInterest, rate: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="ci-time">Time Period (Years)</Label>
                    <Input id="ci-time" type="number" placeholder="e.g., 10" value={compoundInterest.time} onChange={e => setCompoundInterest({ ...compoundInterest, time: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="ci-frequency">Compound Frequency</Label>
                    <Select value={compoundInterest.frequency} onValueChange={(value: string) => setCompoundInterest({ ...compoundInterest, frequency: value })}>
                        <SelectTrigger id="ci-frequency">
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Annually</SelectItem>
                            <SelectItem value="2">Semi-Annually</SelectItem>
                            <SelectItem value="4">Quarterly</SelectItem>
                            <SelectItem value="12">Monthly</SelectItem>
                            <SelectItem value="365">Daily</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCompoundInterest} className="w-full sm:w-auto">Calculate Compound Interest</Button>
                {compoundInterestResult && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <Label>Total Interest</Label>
                        <div className="text-2xl font-bold text-primary">{currency.symbol}{compoundInterestResult.interest}</div>
                    </div>
                    <div>
                        <Label>Total Principal + Interest</Label>
                        <div className="text-2xl font-bold text-green-500">{currency.symbol}{compoundInterestResult.total}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Interest: Simple vs. Compound</h2>
            <p>Interest is the cost of borrowing money or the return on an investment. It is a fundamental concept in finance, and understanding the difference between simple and compound interest is crucial for making informed financial decisions. Our calculator helps you visualize this difference.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Simple Interest</h3>
            <p>Simple interest is calculated only on the original principal amount of a loan or investment. It does not take into account any interest that has been accumulated in previous periods. The formula is straightforward: <code>Interest = Principal × Rate × Time</code>. It's a linear calculation, meaning the amount of interest earned is the same for each period.</p>
            
            <h3>Compound Interest</h3>
            <p>Compound interest is "interest on interest." It is calculated on the initial principal and also on the accumulated interest from previous periods. This can have a powerful effect over time, leading to exponential growth. The formula is <code>Total Amount = Principal * (1 + Rate/Frequency)^(Frequency*Time)</code>. The more frequently interest is compounded (e.g., monthly vs. annually), the greater the total amount will be over time.</p>

            <h3>Key Differences</h3>
            <p>The main takeaway is that compound interest grows much faster than simple interest. For savers and investors, this is a powerful tool for wealth creation. For borrowers, it means that the cost of a loan can grow significantly if not paid down quickly. Use our calculators to see the difference for yourself!</p>
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
