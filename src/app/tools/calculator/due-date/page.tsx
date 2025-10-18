
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Baby } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, isFuture, getDaysInMonth } from 'date-fns';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i.toString(),
  label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
}));

export default function DueDateCalculatorPage() {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<{ dueDate: string; week: number; day: number } | null>(null);

  const daysInSelectedMonth = useMemo(() => {
    if (year && month) {
      const days = getDaysInMonth(new Date(parseInt(year), parseInt(month)));
      return Array.from({ length: days }, (_, i) => (i + 1).toString());
    }
    return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  }, [month, year]);

  useEffect(() => {
    if(day && month && year) {
        const numDays = getDaysInMonth(new Date(parseInt(year), parseInt(month)));
        if (parseInt(day) > numDays) {
            setDay(numDays.toString());
        }
    }
  }, [month, year, day]);

  const handleCalculate = useCallback(() => {
    if (!day || !month || !year) {
      setError('Please select a complete date.');
      setResult(null);
      return;
    }
    
    const lmpDate = new Date(parseInt(year), parseInt(month), parseInt(day));

    if (isNaN(lmpDate.getTime()) || lmpDate.getDate() !== parseInt(day)) {
        setError('The selected date is invalid. Please check your selections.');
        setResult(null);
        return;
    }

    if (isFuture(lmpDate)) {
      setError('Date cannot be in the future.');
      setResult(null);
      return;
    }

    setError(null);

    const dueDate = addDays(lmpDate, 280);
    const today = new Date();
    const differenceInTime = today.getTime() - lmpDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const currentWeek = Math.floor(differenceInDays / 7);
    const currentDay = Math.floor(differenceInDays % 7);

    setResult({
      dueDate: format(dueDate, 'PPP'),
      week: currentWeek,
      day: currentDay,
    });
  }, [day, month, year]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Baby className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Pregnancy Due Date Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate your due date based on the first day of your last menstrual period.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Calculate Your Due Date</CardTitle>
                <CardDescription>Select the first day of your last menstrual period (LMP).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lmp-day">Day</Label>
                    <Select value={day} onValueChange={setDay}>
                        <SelectTrigger id="lmp-day"><SelectValue placeholder="Day" /></SelectTrigger>
                        <SelectContent>{daysInSelectedMonth.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lmp-month">Month</Label>
                     <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger id="lmp-month"><SelectValue placeholder="Month" /></SelectTrigger>
                        <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lmp-year">Year</Label>
                     <Select value={year} onValueChange={setYear}>
                        <SelectTrigger id="lmp-year"><SelectValue placeholder="Year" /></SelectTrigger>
                        <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Due Date</Button>
                {result && (
                  <div className="pt-6 text-center border-t mt-6 space-y-4">
                      <div>
                        <Label className="text-lg">Your Estimated Due Date</Label>
                        <div className="text-4xl font-bold text-primary">{result.dueDate}</div>
                      </div>
                      <div>
                         <Label className="text-lg">Current Pregnancy Week</Label>
                         <div className="text-3xl font-bold text-green-500">
                           {result.week} weeks and {result.day} {result.day === 1 ? 'day' : 'days'}
                         </div>
                         <p className="text-sm text-muted-foreground">This is an estimation. Please consult your doctor.</p>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How Is My Due Date Calculated?</h2>
            <p>Your estimated due date (EDD) is typically calculated using Naegele's rule. This method is based on the first day of your last menstrual period (LMP) and assumes a regular 28-day cycle. While it's a widely used and simple method, it's important to remember that it's only an estimation.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Naegele's Rule Explained</h3>
            <p>The calculation is as follows:</p>
             <ol>
              <li><strong>Start with the first day of your LMP.</strong></li>
              <li><strong>Add one year.</strong></li>
              <li><strong>Subtract three months.</strong></li>
              <li><strong>Add seven days.</strong></li>
            </ol>
            <p>A simpler way to think about it is just adding 280 days (or 40 weeks) to the first day of your LMP. Our calculator automates this for you. It also gives you an estimate of how far along you are in your pregnancy based on today's date.</p>
            <h3>Why Is It Just an Estimate?</h3>
            <p>The due date is an estimate because it's based on the assumption of a 28-day cycle with ovulation occurring on day 14. However, many women have cycles that are longer or shorter, and ovulation can vary. Only a small percentage of babies are born on their exact due date. Your doctor or midwife may provide a more accurate due date based on an ultrasound scan. This calculator is a helpful guide, but it is not a substitute for professional medical advice.</p>
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
