
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

export default function LoanCalculatorPage() {
  const [loanDetails, setLoanDetails] = useState({ amount: '', rate: '', term: '' });
  const [result, setResult] = useState<{ monthlyPayment: string, totalInterest: string, totalCost: string } | null>(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    setCurrency(selected);
  };

  const handleCalculate = () => {
    const P = parseFloat(loanDetails.amount);
    const annualRate = parseFloat(loanDetails.rate);
    const termYears = parseFloat(loanDetails.term);

    if (!isNaN(P) && !isNaN(annualRate) && !isNaN(termYears) && P > 0 && annualRate > 0 && termYears > 0) {
      const r = (annualRate / 100) / 12; // Monthly interest rate
      const n = termYears * 12; // Total number of payments
      
      const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalCost = monthlyPayment * n;
      const totalInterest = totalCost - P;

      setResult({
        monthlyPayment: monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalInterest: totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalCost: totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      });
    } else {
        setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Landmark className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Loan Payment Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate your monthly loan payments, total interest, and total cost.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Loan Details</CardTitle>
                        <CardDescription>Enter your loan information to see your payment details.</CardDescription>
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
                    <Label htmlFor="loan-amount">Loan Amount ({currency.symbol})</Label>
                    <Input id="loan-amount" type="number" placeholder="e.g., 250000" value={loanDetails.amount} onChange={e => setLoanDetails({ ...loanDetails, amount: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
                    <Input id="interest-rate" type="number" placeholder="e.g., 5.5" value={loanDetails.rate} onChange={e => setLoanDetails({ ...loanDetails, rate: e.target.value })} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="loan-term">Loan Term (Years)</Label>
                    <Input id="loan-term" type="number" placeholder="e.g., 30" value={loanDetails.term} onChange={e => setLoanDetails({ ...loanDetails, term: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Loan Payment</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Monthly Payment</Label>
                        <div className="text-2xl font-bold text-primary">{currency.symbol}{result.monthlyPayment}</div>
                    </div>
                    <div>
                        <Label>Total Interest Paid</Label>
                        <div className="text-2xl font-bold text-red-500">{currency.symbol}{result.totalInterest}</div>
                    </div>
                    <div>
                        <Label>Total Cost of Loan</Label>
                        <div className="text-2xl font-bold text-green-500">{currency.symbol}{result.totalCost}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Your Loan Payments</h2>
            <p>Whether you're taking out a mortgage, an auto loan, or a personal loan, understanding how your monthly payment is calculated is key to managing your finances. Our loan calculator uses the standard amortization formula to give you a clear picture of your financial commitment.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Loan Amortization Formula</h3>
            <p>The calculation for a monthly loan payment (M) is based on the principal amount (P), the monthly interest rate (r), and the number of payments (n). The formula is: <code>M = P * [r(1+r)^n] / [(1+r)^n - 1]</code>.</p>
             <ul>
              <li><strong>Principal (P):</strong> The total amount of money you are borrowing.</li>
              <li><strong>Monthly Interest Rate (r):</strong> Your annual interest rate divided by 12.</li>
              <li><strong>Number of Payments (n):</strong> The total number of months in your loan term (e.g., a 30-year loan has 360 payments).</li>
            </ul>
            
            <h3>What is Amortization?</h3>
            <p>Amortization is the process of paying off a loan over time with regular payments. At the beginning of the loan, a larger portion of your payment goes toward interest. As time goes on, more of your payment starts going toward paying down the principal balance. Our calculator helps you see the total interest you'll pay over the life of the loan, highlighting the long-term cost of borrowing.</p>
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
