
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Baby, CalendarIcon } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInWeeks } from 'date-fns';

export default function DueDateCalculatorPage() {
  const [lmp, setLmp] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<{ dueDate: string; week: number; day: number } | null>(null);

  const handleCalculate = () => {
    if (lmp) {
      const dueDate = addDays(lmp, 280);
      const today = new Date();
      const differenceInTime = today.getTime() - lmp.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      const currentWeek = Math.floor(differenceInDays / 7);
      const currentDay = Math.floor(differenceInDays % 7);

      setResult({
        dueDate: format(dueDate, 'PPP'),
        week: currentWeek,
        day: currentDay,
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
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="space-y-2 w-full sm:w-auto">
                        <Label htmlFor="lmp-date">Last Menstrual Period</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full sm:w-[280px] justify-start text-left font-normal",
                                !lmp && "text-muted-foreground"
                            )}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {lmp ? format(lmp, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={lmp}
                                onSelect={setLmp}
                                captionLayout="dropdown-nav"
                                fromYear={new Date().getFullYear() - 2}
                                toYear={new Date().getFullYear()}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                  <Button onClick={handleCalculate} className="w-full sm:w-auto mt-auto">Calculate Due Date</Button>
                </div>
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
