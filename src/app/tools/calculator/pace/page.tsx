
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaceCalculatorPage() {
  const [calcMode, setCalcMode] = useState('pace');
  const [unit, setUnit] = useState('miles');

  // Shared state
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [paceMinutes, setPaceMinutes] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [resultDescription, setResultDescription] = useState('');

  const handleCalculate = () => {
    const dist = parseFloat(distance);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const pm = parseInt(paceMinutes) || 0;
    const ps = parseInt(paceSeconds) || 0;

    const totalTimeInSeconds = (h * 3600) + (m * 60) + s;
    const paceInSecondsPerUnit = (pm * 60) + ps;

    if (calcMode === 'pace') {
      if (dist > 0 && totalTimeInSeconds > 0) {
        const paceSeconds = totalTimeInSeconds / dist;
        const paceM = Math.floor(paceSeconds / 60);
        const paceS = Math.round(paceSeconds % 60);
        setResult(`${paceM}:${paceS < 10 ? '0' : ''}${paceS}`);
        setResultDescription(`Pace per ${unit.slice(0, -1)}`);
      }
    } else if (calcMode === 'time') {
      if (dist > 0 && paceInSecondsPerUnit > 0) {
        const totalSeconds = dist * paceInSecondsPerUnit;
        const resH = Math.floor(totalSeconds / 3600);
        const resM = Math.floor((totalSeconds % 3600) / 60);
        const resS = Math.round(totalSeconds % 60);
        setResult(`${resH}:${resM < 10 ? '0' : ''}${resM}:${resS < 10 ? '0' : ''}${resS}`);
        setResultDescription('Total Time');
      }
    } else if (calcMode === 'distance') {
      if (totalTimeInSeconds > 0 && paceInSecondsPerUnit > 0) {
        const totalDist = totalTimeInSeconds / paceInSecondsPerUnit;
        setResult(totalDist.toFixed(2));
        setResultDescription(`Total Distance (${unit})`);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Timer className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Pace Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate your running pace, time, or distance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <Tabs value={calcMode} onValueChange={setCalcMode} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pace">Calculate Pace</TabsTrigger>
                <TabsTrigger value="time">Calculate Time</TabsTrigger>
                <TabsTrigger value="distance">Calculate Distance</TabsTrigger>
              </TabsList>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Distance</Label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="e.g., 10" value={distance} onChange={e => setDistance(e.target.value)} disabled={calcMode === 'distance'} />
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="miles">Miles</SelectItem>
                          <SelectItem value="kilometers">Kilometers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <Label>Time</Label>
                     <div className="grid grid-cols-3 gap-2">
                         <Input type="number" placeholder="Hours" value={hours} onChange={e => setHours(e.target.value)} disabled={calcMode === 'time'} />
                         <Input type="number" placeholder="Minutes" value={minutes} onChange={e => setMinutes(e.target.value)} disabled={calcMode === 'time'} />
                         <Input type="number" placeholder="Seconds" value={seconds} onChange={e => setSeconds(e.target.value)} disabled={calcMode === 'time'} />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label>Pace (per {unit.slice(0, -1)})</Label>
                     <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1"></div>
                         <Input type="number" placeholder="Minutes" value={paceMinutes} onChange={e => setPaceMinutes(e.target.value)} disabled={calcMode === 'pace'} />
                         <Input type="number" placeholder="Seconds" value={paceSeconds} onChange={e => setPaceSeconds(e.target.value)} disabled={calcMode === 'pace'} />
                     </div>
                  </div>

                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto mt-6">Calculate</Button>

                {result && (
                  <div className="pt-6 text-center border-t mt-6">
                      <Label className="text-lg">{resultDescription}</Label>
                      <div className="text-5xl font-bold text-primary">{result}</div>
                  </div>
                )}
              </CardContent>
            </Tabs>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Your Running Pace</h2>
            <p>Pace is a measure of how fast you are running, typically expressed in minutes per mile or minutes per kilometer. It's a crucial metric for runners of all levels, helping you to gauge your effort, set goals for races, and structure your training plans. Our Pace Calculator is a versatile tool that can help you understand your performance by calculating any one of the three key variables—pace, time, or distance—when you know the other two.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How to Use the Pace Calculator</h3>
            <p>Our calculator has three modes:</p>
             <ul>
              <li><strong>Calculate Pace:</strong> Enter your total distance and time to find out your average pace per mile or kilometer.</li>
              <li><strong>Calculate Time:</strong> Enter your target pace and a distance to see how long it will take you to finish. This is perfect for race day planning.</li>
              <li><strong>Calculate Distance:</strong> Enter your pace and how long you ran (or plan to run) to determine the total distance covered.</li>
            </ul>
            <h3>The Formulas Behind the Calculation</h3>
            <ul>
                <li><strong>Pace = Time / Distance</strong></li>
                <li><strong>Time = Pace * Distance</strong></li>
                <li><strong>Distance = Time / Pace</strong></li>
            </ul>
            <p>While the formulas are simple, managing the different units (minutes, seconds, hours, miles, kilometers) can be tricky. Our calculator handles all the conversions for you, providing quick and accurate results to help you plan your training and achieve your running goals.</p>
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
