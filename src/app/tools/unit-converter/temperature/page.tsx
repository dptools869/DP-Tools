
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Thermometer } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const units = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin',
};

type Unit = keyof typeof units;

export default function TemperatureConverterPage() {
  const [value, setValue] = useState('0');
  const [fromUnit, setFromUnit] = useState<Unit>('celsius');
  const [toUnit, setToUnit] = useState<Unit>('fahrenheit');
  const [result, setResult] = useState('');

  const convert = useCallback(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    let tempInCelsius: number;

    // Convert input to Celsius first
    switch (fromUnit) {
      case 'celsius':
        tempInCelsius = numValue;
        break;
      case 'fahrenheit':
        tempInCelsius = (numValue - 32) * 5 / 9;
        break;
      case 'kelvin':
        tempInCelsius = numValue - 273.15;
        break;
      default:
        tempInCelsius = 0;
    }
    
    let convertedValue: number;

    // Convert from Celsius to the target unit
    switch (toUnit) {
      case 'celsius':
        convertedValue = tempInCelsius;
        break;
      case 'fahrenheit':
        convertedValue = (tempInCelsius * 9 / 5) + 32;
        break;
      case 'kelvin':
        convertedValue = tempInCelsius + 273.15;
        break;
      default:
        convertedValue = 0;
    }

    setResult(convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 }));
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
                <Thermometer className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Temperature Converter</CardTitle>
              <CardDescription className="text-lg">
                Quickly convert between Celsius, Fahrenheit, and Kelvin.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Convert Temperature</CardTitle>
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
                        {Object.entries(units).map(([key, name]) => (
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
                        {Object.entries(units).map(([key, name]) => (
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
            <h2>Understanding Temperature Scales</h2>
            <p>Temperature conversion is a frequent necessity in science, travel, and daily life. Our Temperature Converter simplifies this by providing instant and accurate conversions between the three major temperature scales: Celsius, Fahrenheit, and Kelvin.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Main Temperature Scales</h3>
             <ul>
              <li><strong>Celsius (°C):</strong> Part of the metric system and used by most of the world for daily temperature measurement. The scale is based on the freezing (0°C) and boiling (100°C) points of water.</li>
              <li><strong>Fahrenheit (°F):</strong> Primarily used in the United States. On this scale, water freezes at 32°F and boils at 212°F.</li>
              <li><strong>Kelvin (K):</strong> The base unit of thermodynamic temperature in the International System of Units (SI). It is often used in scientific contexts. Absolute zero—the coldest possible temperature—is 0 K.</li>
            </ul>
            <p>Our calculator handles the formulas for you, making it easy to convert from Celsius to Fahrenheit for a weather report, or from Celsius to Kelvin for a science experiment. Get precise results instantly with our easy-to-use tool.</p>
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
