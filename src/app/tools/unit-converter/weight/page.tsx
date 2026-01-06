
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const units = {
  kilograms: { name: 'Kilograms', factor: 1 },
  grams: { name: 'Grams', factor: 0.001 },
  milligrams: { name: 'Milligrams', factor: 0.000001 },
  pounds: { name: 'Pounds', factor: 0.453592 },
  ounces: { name: 'Ounces', factor: 0.0283495 },
  tonnes: { name: 'Tonnes', factor: 1000 },
};

type Unit = keyof typeof units;

export default function WeightConverterPage() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('kilograms');
  const [toUnit, setToUnit] = useState<Unit>('pounds');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    const valueInKilograms = numValue * units[fromUnit].factor;
    const convertedValue = valueInKilograms / units[toUnit].factor;

    setResult(convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  }, [value, fromUnit, toUnit]);

  useEffect(() => {
    convert();
  }, [convert]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Scale className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Weight Converter</CardTitle>
              <CardDescription className="text-lg">
                Quickly convert between different units of weight/mass.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert Weight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className='space-y-2'>
                  <Label htmlFor="from-value">From</Label>
                  <div className="flex gap-2">
                    <Input id="from-value" type="number" value={value} onChange={e => setValue(e.target.value)} />
                    <Select value={fromUnit} onValueChange={(val) => setFromUnit(val as Unit)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(units).map(([key, { name }]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                 <div className='space-y-2'>
                  <Label htmlFor="to-value">To</Label>
                  <div className="flex gap-2">
                    <Input id="to-value" type="text" value={result} readOnly className="font-bold bg-muted" />
                     <Select value={toUnit} onValueChange={(val) => setToUnit(val as Unit)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(units).map(([key, { name }]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Units of Weight and Mass</h2>
            <p>Converting between different units of weight or mass is essential in science, cooking, shipping, and everyday life. Our Weight Converter provides a quick and accurate way to switch between various metric and imperial units.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Metric vs. Imperial Systems</h3>
            <p>The two main systems for measuring mass are the metric and imperial systems.</p>
             <ul>
              <li><strong>Metric System:</strong> This system is the global standard and is based on the gram. Units are related by powers of ten (e.g., 1 kilogram = 1000 grams).</li>
              <li><strong>Imperial System:</strong> Primarily used in the United States, this system includes units like ounces, pounds, and tons.</li>
            </ul>
            <p>Our calculator simplifies conversions between these systems, so you don't have to worry about complex formulas. Whether you are converting kilograms to pounds for a fitness goal or ounces to grams for a recipe, our tool delivers an instant and precise result.</p>
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
