
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const units = {
  meters: { name: 'Meters', factor: 1 },
  kilometers: { name: 'Kilometers', factor: 1000 },
  centimeters: { name: 'Centimeters', factor: 0.01 },
  millimeters: { name: 'Millimeters', factor: 0.001 },
  miles: { name: 'Miles', factor: 1609.34 },
  yards: { name: 'Yards', factor: 0.9144 },
  feet: { name: 'Feet', factor: 0.3048 },
  inches: { name: 'Inches', factor: 0.0254 },
};

type Unit = keyof typeof units;

export default function LengthConverterPage() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('meters');
  const [toUnit, setToUnit] = useState<Unit>('feet');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    const valueInMeters = numValue * units[fromUnit].factor;
    const convertedValue = valueInMeters / units[toUnit].factor;

    setResult(convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  }, [value, fromUnit, toUnit]);

  useEffect(() => {
    convert();
  }, [convert]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Scale className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Length Converter</CardTitle>
              <CardDescription className="text-lg">
                Quickly convert between different units of length.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert Length</CardTitle>
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
            <h2>Understanding Units of Length</h2>
            <p>Converting between units of length is a common task in many fields, from engineering and construction to travel and everyday life. Our Length Converter simplifies this by providing quick and accurate conversions between a wide range of metric and imperial units.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Metric vs. Imperial Systems</h3>
            <p>The two most common systems of measurement for length are the metric system and the imperial system.</p>
             <ul>
              <li><strong>Metric System:</strong> Used by most of the world, this system is based on the meter. Units are related by powers of ten (e.g., 1 kilometer = 1000 meters, 1 meter = 100 centimeters).</li>
              <li><strong>Imperial System:</strong> Primarily used in the United States, this system includes units like inches, feet, yards, and miles. The relationships between these units are not as straightforward (e.g., 1 foot = 12 inches, 1 mile = 5280 feet).</li>
            </ul>
            <p>Our calculator handles the conversions between these systems seamlessly, so you don't have to remember the conversion factors. Whether you're converting kilometers to miles for a road trip or centimeters to inches for a home project, our tool provides an instant and accurate result.</p>
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
