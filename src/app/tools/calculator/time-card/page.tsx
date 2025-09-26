
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Trash2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

type TimeEntry = {
  id: number;
  start: string;
  end: string;
};

// Helper function to parse time strings (HH:mm) and return minutes from midnight
const parseTime = (timeStr: string): number => {
  if (!timeStr) return NaN;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return NaN;
  return hours * 60 + minutes;
};

export default function TimeCardCalculatorPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { id: 1, start: '09:00', end: '17:00' },
  ]);

  const handleTimeChange = (id: number, field: 'start' | 'end', value: string) => {
    setTimeEntries(timeEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const addTimeEntry = () => {
    setTimeEntries([...timeEntries, { id: Date.now(), start: '', end: '' }]);
  };

  const removeTimeEntry = (id: number) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };
  
  const totalMinutes = useMemo(() => {
    return timeEntries.reduce((total, entry) => {
      const startMinutes = parseTime(entry.start);
      const endMinutes = parseTime(entry.end);

      if (!isNaN(startMinutes) && !isNaN(endMinutes) && endMinutes > startMinutes) {
        return total + (endMinutes - startMinutes);
      }
      return total;
    }, 0);
  }, [timeEntries]);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Time Card Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate total work hours by entering start and end times.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Work Hours</CardTitle>
                <CardDescription>Enter start and end times for each work period (24-hour format).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-x-4 font-medium px-2 text-muted-foreground">
                    <Label>Start Time</Label>
                    <Label>End Time</Label>
                    <span className="w-8"></span>
                </div>
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-[1fr_1fr_auto] gap-x-4 items-center">
                    <Input type="time" value={entry.start} onChange={e => handleTimeChange(entry.id, 'start', e.target.value)} />
                    <Input type="time" value={entry.end} onChange={e => handleTimeChange(entry.id, 'end', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeTimeEntry(entry.id)} aria-label="Remove time entry">
                        <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  </div>
                ))}
                 <Button onClick={addTimeEntry} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Time Entry
                </Button>
              </CardContent>
              <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex flex-col sm:flex-row justify-center items-center text-center gap-4">
                  <div>
                    <Label className="text-sm font-normal">Total Work Time</Label>
                    <div className="text-5xl font-bold text-primary">
                        {totalHours}<span className="text-3xl text-muted-foreground">h</span> {remainingMinutes}<span className="text-3xl text-muted-foreground">m</span>
                    </div>
                  </div>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Work Hours</h2>
            <p>A time card calculator is a crucial tool for both employees and employers to accurately track work hours and ensure fair compensation. Our calculator simplifies this process by allowing you to enter multiple start and end times to get a total duration.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Calculating Total Hours</h3>
             <ol>
              <li><strong>Record Start and End Times:</strong> For each work period, note the time you start and the time you finish. Our calculator uses a 24-hour format for clarity.</li>
              <li><strong>Calculate Duration for Each Period:</strong> For each entry, the calculator finds the difference between the end and start time.</li>
              <li><strong>Sum the Durations:</strong> The total duration from all entries is summed up to give you the total hours and minutes worked.</li>
            </ol>
            <h3>Handling Breaks</h3>
            <p>To account for unpaid breaks, you have two options:</p>
            <ul>
                <li><strong>Option 1:</strong> Don't include the break in your entries. For example, if you work from 9:00 to 17:00 with a one-hour lunch, you would enter one period from 9:00 to 12:00 and a second from 13:00 to 17:00.</li>
                <li><strong>Option 2:</strong> Enter the full work period (e.g., 9:00 to 17:00) and then manually subtract the break time from the total.</li>
            </ul>
            <p>Our calculator is perfect for freelancers, hourly employees, and project managers who need a quick and reliable way to track time without complex software.</p>
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
