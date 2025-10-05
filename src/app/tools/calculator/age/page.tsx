
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, PartyPopper } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInWeeks,
  addYears,
  addMonths,
  isFuture,
} from 'date-fns';

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const months = Array.from({ length: 12 }, (_, i) => ({ value: (i).toString(), label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString());

export default function AgeCalculatorPage() {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [dob, setDob] = useState<Date | null>(null);

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(() => {
    if (!day || !month || !year) {
      setError('Please select a valid day, month, and year.');
      setResult(null);
      return;
    }

    const dateOfBirth = new Date(parseInt(year), parseInt(month), parseInt(day));

    if (isNaN(dateOfBirth.getTime()) || dateOfBirth.getDate() !== parseInt(day)) {
        setError('The selected date is invalid. Please check the day and month.');
        setResult(null);
        return;
    }

    if (isFuture(dateOfBirth)) {
      setError('Date of birth cannot be in the future.');
      setResult(null);
      return;
    }

    setError(null);
    setDob(dateOfBirth);

    const today = new Date();
    
    // Age breakdown
    const years = differenceInYears(today, dateOfBirth);
    const pastDateForMonths = addYears(dateOfBirth, years);
    const months = differenceInMonths(today, pastDateForMonths);
    const pastDateForDays = addMonths(pastDateForMonths, months);
    const days = differenceInDays(today, pastDateForDays);

    // Totals
    const totalDays = differenceInDays(today, dateOfBirth);
    const totalWeeks = differenceInWeeks(today, dateOfBirth);
    const totalMonths = differenceInMonths(today, dateOfBirth);
    
    // Next Birthday
    let nextBirthdayDate = new Date(today.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate());
    if (today > nextBirthdayDate) {
        nextBirthdayDate = new Date(today.getFullYear() + 1, dateOfBirth.getMonth(), dateOfBirth.getDate());
    }
    const nextBirthday = differenceInDays(nextBirthdayDate, today);

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      nextBirthday
    });
  }, [day, month, year]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <CalendarIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Age Calculator</CardTitle>
              <CardDescription className="text-lg">
                Find out your exact age in years, months, and days.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Calculate Your Age</CardTitle>
                <CardDescription>Select your date of birth to see your age details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="dob-day">Day</Label>
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger id="dob-day"><SelectValue placeholder="Day" /></SelectTrigger>
                            <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob-month">Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger id="dob-month"><SelectValue placeholder="Month" /></SelectTrigger>
                            <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dob-year">Year</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger id="dob-year"><SelectValue placeholder="Year" /></SelectTrigger>
                            <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Age</Button>
                {result && dob && (
                  <div className="pt-6 text-center border-t mt-6 space-y-8">
                      <div>
                        <Label className="text-lg">Your Age Is</Label>
                        <div className="text-4xl font-bold text-primary">
                            {result.years} <span className="text-2xl font-medium text-muted-foreground">years,</span> {result.months} <span className="text-2xl font-medium text-muted-foreground">months &</span> {result.days} <span className="text-2xl font-medium text-muted-foreground">days</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <Label>Total Months</Label>
                            <div className="text-xl font-bold">{result.totalMonths.toLocaleString()}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <Label>Total Weeks</Label>
                            <div className="text-xl font-bold">{result.totalWeeks.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <Label>Total Days</Label>
                            <div className="text-xl font-bold">{result.totalDays.toLocaleString()}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <Label className="flex items-center gap-1"><PartyPopper className="w-4 h-4"/> Next Birthday</Label>
                            <div className="text-xl font-bold">{result.nextBirthday} days</div>
                        </div>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How Is Age Calculated?</h2>
            <p>Our age calculator determines your age with high precision by comparing your date of birth to the current date. It calculates the time difference and breaks it down into years, months, and days. Additionally, it provides fun facts by calculating your age in total months, weeks, and days, and even counts down to your next birthday.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>More Than Just Years</h3>
            <p>While we commonly refer to our age in years, seeing it broken down into smaller units can be fascinating. Here's what our calculator shows you:</p>
             <ul>
              <li><strong>Precise Age:</strong> The exact number of years, months, and days you have been alive.</li>
              <li><strong>Total Months, Weeks, and Days:</strong> The total number of full months, weeks, or days you have lived since birth.</li>
              <li><strong>Next Birthday Countdown:</strong> Find out exactly how many days are left until your next birthday celebration.</li>
            </ul>
            <p>This tool is perfect for birthday countdowns, calculating age for official documents, or just for fun. It's a simple, fast, and accurate way to answer the question, "How old am I?" down to the day.</p>
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
