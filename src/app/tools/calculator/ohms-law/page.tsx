
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type CalcMode = 'voltage' | 'current' | 'resistance';

export default function OhmsLawCalculatorPage() {
  const [calcMode, setCalcMode] = useState<CalcMode>('voltage');
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');
  const [result, setResult] = useState<{ value: string; unit: string; } | null>(null);

  const calculate = () => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);
    
    let calculatedValue: number | null = null;
    let unit = '';

    if (calcMode === 'voltage') {
      if (!isNaN(i) && !isNaN(r)) {
        calculatedValue = i * r;
        unit = 'Volts (V)';
      }
    } else if (calcMode === 'current') {
      if (!isNaN(v) && !isNaN(r) && r !== 0) {
        calculatedValue = v / r;
        unit = 'Amps (A)';
      }
    } else if (calcMode === 'resistance') {
      if (!isNaN(v) && !isNaN(i) && i !== 0) {
        calculatedValue = v / i;
        unit = 'Ohms (Ω)';
      }
    }

    if (calculatedValue !== null) {
      setResult({ value: calculatedValue.toLocaleString(undefined, { maximumFractionDigits: 4 }), unit });
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    setResult(null);
    setVoltage('');
    setCurrent('');
    setResistance('');
  }, [calcMode]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Ohm's Law Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate Voltage, Current, or Resistance using Ohm's Law.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enter Your Values</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="space-y-2 w-full sm:w-1/3">
                    <Label htmlFor="calc-mode">Calculate</Label>
                    <Select value={calcMode} onValueChange={(val) => setCalcMode(val as CalcMode)}>
                      <SelectTrigger id="calc-mode">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="voltage">Voltage (V)</SelectItem>
                          <SelectItem value="current">Current (A)</SelectItem>
                          <SelectItem value="resistance">Resistance (Ω)</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                  <Label htmlFor="voltage">Voltage (V)</Label>
                  <Input id="voltage" type="number" placeholder="e.g., 12" value={voltage} onChange={e => setVoltage(e.target.value)} disabled={calcMode === 'voltage'} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="current">Current (A)</Label>
                  <Input id="current" type="number" placeholder="e.g., 0.5" value={current} onChange={e => setCurrent(e.target.value)} disabled={calcMode === 'current'} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="resistance">Resistance (Ω)</Label>
                  <Input id="resistance" type="number" placeholder="e.g., 24" value={resistance} onChange={e => setResistance(e.target.value)} disabled={calcMode === 'resistance'} />
                </div>
              </div>
              <Button onClick={calculate}>Calculate</Button>
               {result && (
                  <div className="pt-6 text-center border-t mt-6">
                      <Label className="text-lg">Calculated Result</Label>
                      <div className="text-5xl font-bold text-primary">{result.value}</div>
                      <p className="text-muted-foreground">{result.unit}</p>
                  </div>
                )}
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Ohm's Law</h2>
            <p>Ohm's Law is one of the most fundamental principles in electronics and physics. It describes the relationship between voltage (V), current (I), and resistance (R) in an electrical circuit. The law states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Ohm's Law Formulas</h3>
            <p>The relationship can be expressed in three key formulas, which our calculator can solve for:</p>
             <ul>
              <li>To find <strong>Voltage (V)</strong>: <code>V = I × R</code> (Current multiplied by Resistance)</li>
              <li>To find <strong>Current (I)</strong>: <code>I = V / R</code> (Voltage divided by Resistance)</li>
              <li>To find <strong>Resistance (R)</strong>: <code>R = V / I</code> (Voltage divided by Current)</li>
            </ul>
            <p>Our calculator allows you to input any two of these values to find the third, making it an essential tool for circuit design, analysis, and troubleshooting. Whether you're a student learning the basics, a hobbyist building a project, or an engineer at work, this calculator simplifies the process and provides instant, accurate results.</p>
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
