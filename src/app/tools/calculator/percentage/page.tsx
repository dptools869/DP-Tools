
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function PercentageCalculatorPage() {
  // State for "X% of Y"
  const [percentOf, setPercentOf] = useState({ percent: '', number: '' });
  const [percentOfResult, setPercentOfResult] = useState<string | null>(null);

  // State for "X is what % of Y"
  const [isWhatPercent, setIsWhatPercent] = useState({ part: '', whole: '' });
  const [isWhatPercentResult, setIsWhatPercentResult] = useState<string | null>(null);

  // State for "Percentage Change"
  const [percentChange, setPercentChange] = useState({ from: '', to: '' });
  const [percentChangeResult, setPercentChangeResult] = useState<{ change: string, type: 'increase' | 'decrease' } | null>(null);

  const handlePercentOf = () => {
    const { percent, number } = percentOf;
    const p = parseFloat(percent);
    const n = parseFloat(number);
    if (!isNaN(p) && !isNaN(n)) {
      setPercentOfResult(((p / 100) * n).toLocaleString());
    }
  };

  const handleIsWhatPercent = () => {
    const { part, whole } = isWhatPercent;
    const p = parseFloat(part);
    const w = parseFloat(whole);
    if (!isNaN(p) && !isNaN(w) && w !== 0) {
      setIsWhatPercentResult(((p / w) * 100).toLocaleString());
    }
  };

  const handlePercentChange = () => {
    const { from, to } = percentChange;
    const f = parseFloat(from);
    const t = parseFloat(to);
    if (!isNaN(f) && !isNaN(t) && f !== 0) {
      const change = ((t - f) / f) * 100;
      setPercentChangeResult({
        change: change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        type: change >= 0 ? 'increase' : 'decrease'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Percent className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Percentage Calculator</CardTitle>
              <CardDescription className="text-lg">
                A versatile tool for all your percentage calculation needs.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Calculator 1: What is X% of Y? */}
            <Card>
              <CardHeader>
                <CardTitle>What is X% of Y?</CardTitle>
                <CardDescription>e.g., What is 5% of 200?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Input type="number" placeholder="X %" value={percentOf.percent} onChange={e => setPercentOf({ ...percentOf, percent: e.target.value })} />
                  <span className="text-muted-foreground">of</span>
                  <Input type="number" placeholder="Y" value={percentOf.number} onChange={e => setPercentOf({ ...percentOf, number: e.target.value })} />
                  <Button onClick={handlePercentOf}>Calculate</Button>
                </div>
                {percentOfResult !== null && (
                  <div className="pt-4">
                    <Label>Result</Label>
                    <div className="text-2xl font-bold text-primary">{percentOfResult}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calculator 2: X is what % of Y? */}
            <Card>
              <CardHeader>
                <CardTitle>X is what percent of Y?</CardTitle>
                <CardDescription>e.g., 10 is what percent of 200?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Input type="number" placeholder="X" value={isWhatPercent.part} onChange={e => setIsWhatPercent({ ...isWhatPercent, part: e.target.value })} />
                  <span className="text-muted-foreground">is what percent of</span>
                  <Input type="number" placeholder="Y" value={isWhatPercent.whole} onChange={e => setIsWhatPercent({ ...isWhatPercent, whole: e.target.value })} />
                  <Button onClick={handleIsWhatPercent}>Calculate</Button>
                </div>
                {isWhatPercentResult !== null && (
                  <div className="pt-4">
                    <Label>Result</Label>
                    <div className="text-2xl font-bold text-primary">{isWhatPercentResult}%</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calculator 3: Percentage Change */}
            <Card>
              <CardHeader>
                <CardTitle>Percentage Increase / Decrease</CardTitle>
                <CardDescription>e.g., What is the percentage change from 100 to 150?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="text-muted-foreground">From</span>
                  <Input type="number" placeholder="Initial Value" value={percentChange.from} onChange={e => setPercentChange({ ...percentChange, from: e.target.value })} />
                  <span className="text-muted-foreground">to</span>
                  <Input type="number" placeholder="Final Value" value={percentChange.to} onChange={e => setPercentChange({ ...percentChange, to: e.target.value })} />
                  <Button onClick={handlePercentChange}>Calculate</Button>
                </div>
                {percentChangeResult !== null && (
                  <div className="pt-4">
                    <Label>Result</Label>
                    <div className={`text-2xl font-bold ${percentChangeResult.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                      {percentChangeResult.change}% {percentChangeResult.type}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Percentages</h2>
            <p>Percentages are a fundamental part of everyday life, from calculating a tip at a restaurant to understanding financial reports. A percentage is a number or ratio expressed as a fraction of 100. It is often denoted using the percent sign, "%". Our calculator provides three common percentage calculations to simplify these tasks for you.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>1. How to Calculate a Percentage of a Number</h3>
            <p>To find a percentage of a number, you convert the percentage to a decimal and multiply it by the number. For example, to find 20% of 200, you would calculate <code>0.20 * 200 = 40</code>. Our first calculator does this for you automatically.</p>
            
            <h3>2. How to Calculate What Percentage One Number is of Another</h3>
            <p>To determine what percentage one number (the 'part') is of another number (the 'whole'), you divide the part by the whole and multiply the result by 100. For example, to find what percentage 50 is of 200, you would calculate <code>(50 / 200) * 100 = 25%</code>. Our second calculator handles this common scenario.</p>

            <h3>3. How to Calculate Percentage Change</h3>
            <p>To calculate the percentage increase or decrease between two numbers, you subtract the initial value from the final value, divide that result by the initial value, and then multiply by 100. The formula is <code>((Final Value - Initial Value) / Initial Value) * 100</code>. A positive result indicates a percentage increase, while a negative result indicates a decrease. Our third calculator simplifies this for you.</p>
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
