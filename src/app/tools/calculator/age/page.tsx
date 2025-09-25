
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, addYears, addMonths } from 'date-fns';

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  } | null>(null);

  const handleCalculate = () => {
    if (dob) {
      const today = new Date();
      if (dob > today) {
        setResult(null);
        return;
      }
      
      const years = differenceInYears(today, dob);
      const pastDateForMonths = addYears(dob, years);
      const months = differenceInMonths(today, pastDateForMonths);
      const pastDateForDays = addMonths(pastDateForMonths, months);
      const days = differenceInDays(today, pastDateForDays);
      
      const totalMonths = differenceInMonths(today, dob);
      const totalDays = differenceInDays(today, dob);
      const totalHours = differenceInHours(today, dob);
      const totalMinutes = differenceInMinutes(today, dob);

      setResult({
        years,
        months,
        days,
        totalMonths,
        totalDays,
        totalHours,
        totalMinutes
      });
    }
  };

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
                Find out your exact age in years, months, days, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Calculate Your Age</CardTitle>
                <CardDescription>Select your date of birth to see your age details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="space-y-2 w-full sm:w-auto">
                        <Label htmlFor="dob-date">Date of Birth</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            id="dob-date"
                            variant={"outline"}
                            className={cn(
                                "w-full sm:w-[280px] justify-start text-left font-normal",
                                !dob && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                            mode="single"
                            selected={dob}
                            onSelect={setDob}
                            initialFocus
                            captionLayout="dropdown-nav"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                  <Button onClick={handleCalculate} className="w-full sm:w-auto mt-auto">Calculate Age</Button>
                </div>
                {result && (
                  <div className="pt-6 text-center border-t mt-6 space-y-6">
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
                            <Label>Total Days</Label>
                            <div className="text-xl font-bold">{result.totalDays.toLocaleString()}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <Label>Total Hours</Label>
                            <div className="text-xl font-bold">{result.totalHours.toLocaleString()}</div>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <Label>Total Minutes</Label>
                            <div className="text-xl font-bold">{result.totalMinutes.toLocaleString()}</div>
                        </div>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How Is Age Calculated?</h2>
            <p>Our age calculator determines your age with high precision by comparing your date of birth to the current date. It calculates the time difference and breaks it down into years, months, and days. Additionally, it provides fun facts by calculating your age in total months, days, hours, and even minutes, giving you a different perspective on your time alive.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>More Than Just Years</h3>
            <p>While we commonly refer to our age in years, seeing it broken down into smaller units can be fascinating. Here's what our calculator shows you:</p>
             <ul>
              <li><strong>Precise Age:</strong> The exact number of years, months, and days you have been alive.</li>
              <li><strong>Total Months:</strong> The total number of full months you have lived.</li>
              <li><strong>Total Days:</strong> The total number of days you have lived since birth.</li>
              <li><strong>And More:</strong> We even break it down into total hours and minutes for a fun perspective.</li>
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
