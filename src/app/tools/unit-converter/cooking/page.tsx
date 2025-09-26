
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Approximate conversion factors to a base unit (milliliters for volume, grams for weight)
const units = {
  // Volume
  milliliters: { name: 'Milliliters (ml)', type: 'volume', factor: 1 },
  liters: { name: 'Liters (l)', type: 'volume', factor: 1000 },
  teaspoons: { name: 'Teaspoons (US)', type: 'volume', factor: 4.92892 },
  tablespoons: { name: 'Tablespoons (US)', type: 'volume', factor: 14.7868 },
  fluid_ounces: { name: 'Fluid Ounces (US)', type: 'volume', factor: 29.5735 },
  cups: { name: 'Cups (US)', type: 'volume', factor: 236.588 },
  pints: { name: 'Pints (US)', type: 'volume', factor: 473.176 },
  quarts: { name: 'Quarts (US)', type: 'volume', factor: 946.353 },
  gallons: { name: 'Gallons (US)', type: 'volume', factor: 3785.41 },
  // Weight
  grams: { name: 'Grams (g)', type: 'weight', factor: 1 },
  kilograms: { name: 'Kilograms (kg)', type: 'weight', factor: 1000 },
  ounces: { name: 'Ounces (oz)', type: 'weight', factor: 28.3495 },
  pounds: { name: 'Pounds (lb)', type: 'weight', factor: 453.592 },
};

type Unit = keyof typeof units;

export default function CookingConverterPage() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('cups');
  const [toUnit, setToUnit] = useState<Unit>('grams');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }
    
    const from = units[fromUnit];
    const to = units[toUnit];

    if (from.type !== to.type) {
      setResult('N/A - Incompatible units');
      return;
    }
    
    const baseValue = numValue * from.factor;
    const convertedValue = baseValue / to.factor;

    setResult(convertedValue.toLocaleString(undefined, { maximumFractionDigits: 4 }));
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
              <CardTitle className="text-3xl font-headline">Cooking Measurement Converter</CardTitle>
              <CardDescription className="text-lg">
                Convert between common cooking units like cups, tablespoons, grams, and ounces.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert Cooking Units</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className='space-y-2'>
                  <Label htmlFor="from-value">From</Label>
                  <div className="flex gap-2">
                    <Input id="from-value" type="number" value={value} onChange={e => setValue(e.target.value)} />
                    <Select value={fromUnit} onValueChange={(val) => setFromUnit(val as Unit)}>
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
              {units[fromUnit].type !== units[toUnit].type && (
                  <p className="text-sm text-destructive text-center">Cannot convert between volume and weight. Please select units of the same type.</p>
              )}
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Mastering Kitchen Conversions</h2>
            <p>Accurate measurements are the key to successful cooking and baking. Our Cooking Measurement Converter is an essential tool for any home cook or professional chef, designed to provide quick and reliable conversions for a wide range of common kitchen units.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Volume vs. Weight</h3>
            <p>One of the most important concepts in cooking measurements is the difference between volume and weight.</p>
             <ul>
              <li><strong>Volume:</strong> Measures the amount of space an ingredient occupies (e.g., cups, milliliters, tablespoons).</li>
              <li><strong>Weight:</strong> Measures the mass of an ingredient (e.g., grams, ounces, pounds).</li>
            </ul>
            <p>It's important to note that you cannot directly convert a unit of volume to a unit of weight without knowing the density of the ingredient. For example, a cup of lead will weigh much more than a cup of feathers. Our tool keeps these separate to prevent inaccurate conversions.</p>
            <p>Use this converter to easily switch between metric and imperial units, scale recipes from different regions, or simply find the right measurement when you're missing a specific measuring cup or spoon. Happy cooking!</p>
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
