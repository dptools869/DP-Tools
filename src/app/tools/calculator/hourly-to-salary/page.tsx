
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function HourlyToSalaryConverterPage() {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [result, setResult] = useState<{ weekly: string, monthly: string, annually: string } | null>(null);

  const handleCalculate = () => {
    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);

    if (!isNaN(rate) && !isNaN(hours) && !isNaN(weeks) && rate > 0 && hours > 0 && weeks > 0) {
      const weekly = rate * hours;
      const annually = weekly * weeks;
      const monthly = annually / 12;

      const formatCurrency = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      setResult({
        weekly: formatCurrency(weekly),
        monthly: formatCurrency(monthly),
        annually: formatCurrency(annually),
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
              <CardTitle className="text-3xl font-headline">Hourly to Salary Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert your hourly wage to weekly, monthly, and annual salary.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enter Your Pay Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                    <Input id="hourly-rate" type="number" placeholder="e.g., 25.00" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="hours-week">Hours per Week</Label>
                    <Input id="hours-week" type="number" placeholder="e.g., 40" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="weeks-year">Weeks per Year</Label>
                    <Input id="weeks-year" type="number" placeholder="e.g., 52" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Convert</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <Label>Weekly Salary</Label>
                        <div className="text-2xl font-bold text-primary">${result.weekly}</div>
                    </div>
                     <div>
                        <Label>Monthly Salary</Label>
                        <div className="text-2xl font-bold text-primary">${result.monthly}</div>
                    </div>
                    <div>
                        <Label>Annual Salary</Label>
                        <div className="text-2xl font-bold text-green-500">${result.annually}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Your Earnings: Hourly to Salary Conversion</h2>
            <p>Whether you're comparing job offers, budgeting, or planning for the future, it's essential to understand your total compensation. Our Hourly to Salary Converter helps you see the bigger picture by easily converting your hourly wage into its weekly, monthly, and annual equivalents.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How is Salary Calculated from an Hourly Rate?</h3>
            <p>The calculation is straightforward:</p>
             <ol>
              <li><strong>Calculate Weekly Income:</strong> Multiply your hourly rate by the number of hours you work per week. <code>Weekly Income = Hourly Rate × Hours per Week</code></li>
              <li><strong>Calculate Annual Salary:</strong> Multiply your weekly income by the number of weeks you work per year. A standard year has 52 weeks. <code>Annual Salary = Weekly Income × Weeks per Year</code></li>
              <li><strong>Calculate Monthly Income:</strong> Divide your annual salary by 12. <code>Monthly Income = Annual Salary / 12</code></li>
            </ol>
            <p>It's important to remember that these calculations represent your gross income, which is your salary before any taxes or deductions are taken out. Our calculator provides this pre-tax figure, giving you a clear baseline for your earnings.</p>
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
