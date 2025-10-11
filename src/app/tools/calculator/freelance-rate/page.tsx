
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

export default function FreelanceRateCalculatorPage() {
  const [incomeGoal, setIncomeGoal] = useState('60000');
  const [annualExpenses, setAnnualExpenses] = useState('5000');
  const [billableHours, setBillableHours] = useState('1200');
  const [result, setResult] = useState<{ hourlyRate: string } | null>(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
    setCurrency(selected);
  };

  const handleCalculate = () => {
    const income = parseFloat(incomeGoal);
    const expenses = parseFloat(annualExpenses);
    const hours = parseFloat(billableHours);

    if (!isNaN(income) && !isNaN(expenses) && !isNaN(hours) && hours > 0) {
      const totalRevenueNeeded = income + expenses;
      const hourlyRate = totalRevenueNeeded / hours;
      
      setResult({
        hourlyRate: hourlyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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
                <Landmark className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Freelance Rate Calculator</CardTitle>
              <CardDescription className="text-lg">
                Determine your minimum hourly rate to meet your financial goals.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Calculate Your Hourly Rate</CardTitle>
                        <CardDescription>Enter your desired income, expenses, and billable hours.</CardDescription>
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
                    <Label htmlFor="income-goal">Desired Annual Income ({currency.symbol})</Label>
                    <Input id="income-goal" type="number" placeholder="e.g., 60000" value={incomeGoal} onChange={e => setIncomeGoal(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="annual-expenses">Annual Business Expenses ({currency.symbol})</Label>
                    <Input id="annual-expenses" type="number" placeholder="e.g., 5000" value={annualExpenses} onChange={e => setAnnualExpenses(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="billable-hours">Annual Billable Hours</Label>
                    <Input id="billable-hours" type="number" placeholder="e.g., 1200" value={billableHours} onChange={e => setBillableHours(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Rate</Button>
              </CardContent>
              {result && (
                <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex flex-col items-center text-center gap-2">
                    <Label className="text-sm font-normal">Your Minimum Hourly Rate</Label>
                    <div className="text-5xl font-bold text-primary">{currency.symbol}{result.hourlyRate}</div>
                    <p className="text-xs text-muted-foreground">This rate covers your income goal and expenses, before taxes.</p>
                </CardFooter>
              )}
            </Card>
          

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Your Freelance Rate</h2>
            <p>Setting the right hourly rate is one of the most critical decisions a freelancer can make. It needs to be high enough to cover your salary, business expenses, and taxes, yet competitive enough to attract clients. Our calculator simplifies the first step of this process by determining your baseline rate.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Freelance Rate Formula</h3>
            <p>The basic formula our calculator uses is: <strong>Hourly Rate = (Desired Annual Income + Annual Business Expenses) / Annual Billable Hours</strong></p>
             <ol>
              <li><strong>Desired Annual Income:</strong> This is the salary you want to pay yourself before taxes.</li>
              <li><strong>Annual Business Expenses:</strong> This includes all the costs of running your business, such as software subscriptions, hardware, marketing, insurance, and office supplies.</li>
              <li><strong>Annual Billable Hours:</strong> This is the most crucial part. It's not just 40 hours a week for 52 weeks. You must account for non-billable time like marketing, client communication, admin work, vacation, and sick days. A common estimate is around 1000-1200 billable hours per year for a full-time freelancer.</li>
            </ol>
            <p>The rate calculated is your minimum required rate before taxes. Remember to set aside a significant portion (often 25-30%) for self-employment and income taxes. You should also consider adding a profit margin and adjusting your rate based on your experience, industry, and demand.</p>
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
