
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, differenceInDays, differenceInMonths, differenceInYears, add, sub } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function DateCalculatorPage() {
  const [calcMode, setCalcMode] = useState('duration');
  
  // Duration state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(add(new Date(), { months: 1 }));
  const [durationResult, setDurationResult] = useState<string | null>(null);

  // Add/Subtract state
  const [calcDate, setCalcDate] = useState<Date | undefined>(new Date());
  const [operation, setOperation] = useState('add');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [weeks, setWeeks] = useState('');
  const [days, setDays] = useState('');
  const [addSubtractResult, setAddSubtractResult] = useState<string | null>(null);


  const calculateDuration = () => {
    if (startDate && endDate) {
      let start = startDate;
      let end = endDate;
      if (start > end) {
        [start, end] = [end, start]; // Swap if start is after end
      }
      
      const years = differenceInYears(end, start);
      const monthsDate = add(start, { years: years });
      const months = differenceInMonths(end, monthsDate);
      const daysDate = add(monthsDate, { months: months });
      const days = differenceInDays(end, daysDate);
      const totalDays = differenceInDays(end, start);

      setDurationResult(`${years} years, ${months} months, ${days} days (Total: ${totalDays.toLocaleString()} days)`);
    }
  };

  const calculateNewDate = () => {
      if(calcDate) {
          const duration = {
              years: parseInt(years) || 0,
              months: parseInt(months) || 0,
              weeks: parseInt(weeks) || 0,
              days: parseInt(days) || 0,
          };
          const newDate = operation === 'add' ? add(calcDate, duration) : sub(calcDate, duration);
          setAddSubtractResult(format(newDate, 'PPP'));
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
              <CardTitle className="text-3xl font-headline">Date Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate the duration between two dates or add/subtract time from a date.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <Tabs value={calcMode} onValueChange={setCalcMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="duration">Date Duration</TabsTrigger>
                    <TabsTrigger value="add_subtract">Add/Subtract Dates</TabsTrigger>
                </TabsList>
                <TabsContent value="duration" className="p-4">
                    <CardHeader>
                        <CardTitle>Calculate Duration Between Two Dates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="space-y-2 w-full">
                                <Label htmlFor="start-date">Start Date</Label>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="start-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2 w-full">
                                <Label htmlFor="end-date">End Date</Label>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="end-date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus /></PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Button onClick={calculateDuration} className="w-full sm:w-auto">Calculate Duration</Button>
                        {durationResult && (
                        <div className="pt-6 text-center border-t mt-6">
                            <Label className="text-lg">Duration</Label>
                            <div className="text-3xl font-bold text-primary">{durationResult}</div>
                        </div>
                        )}
                    </CardContent>
                </TabsContent>
                <TabsContent value="add_subtract" className="p-4">
                     <CardHeader>
                        <CardTitle>Add or Subtract from a Date</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="calc-date">Start Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="calc-date" variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !calcDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {calcDate ? format(calcDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={calcDate} onSelect={setCalcDate} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                             <RadioGroup defaultValue="add" onValueChange={setOperation} className="flex gap-4">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="add" id="add" /><Label htmlFor="add">Add</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="subtract" id="subtract" /><Label htmlFor="subtract">Subtract</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2"><Label htmlFor="years">Years</Label><Input id="years" type="number" placeholder="0" value={years} onChange={e=>setYears(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="months">Months</Label><Input id="months" type="number" placeholder="0" value={months} onChange={e=>setMonths(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="weeks">Weeks</Label><Input id="weeks" type="number" placeholder="0" value={weeks} onChange={e=>setWeeks(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="days">Days</Label><Input id="days" type="number" placeholder="0" value={days} onChange={e=>setDays(e.target.value)} /></div>
                        </div>
                        <Button onClick={calculateNewDate} className="w-full sm:w-auto">Calculate New Date</Button>
                        {addSubtractResult && (
                        <div className="pt-6 text-center border-t mt-6">
                            <Label className="text-lg">Resulting Date</Label>
                            <div className="text-3xl font-bold text-primary">{addSubtractResult}</div>
                        </div>
                        )}
                    </CardContent>
                </TabsContent>
            </Tabs>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Mastering Time with the Date Calculator</h2>
            <p>Our Date Calculator is a versatile tool designed to help you with all your date-related calculations. Whether you're planning an event, tracking a project timeline, or just curious about the number of days between two dates, this calculator provides a simple and accurate solution.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Calculating the Duration Between Two Dates</h3>
            <p>Ever wondered exactly how many years, months, and days there are between two specific dates? Our "Date Duration" feature does just that. Simply select a start date and an end date, and the calculator will instantly tell you the precise duration, as well as the total number of days between them. It's perfect for calculating your age, the length of a relationship, or the time until a future event.</p>
             <h3>Adding or Subtracting Time from a Date</h3>
            <p>Need to know what the date will be 6 months and 2 weeks from now? Or what the date was 90 days ago? Our "Add/Subtract Dates" feature makes this easy. Enter a start date, specify the amount of time you want to add or subtract (in years, months, weeks, and/or days), and the calculator will give you the exact resulting date. This is ideal for project planning, setting deadlines, or scheduling future appointments.</p>
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
