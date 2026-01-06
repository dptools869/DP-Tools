
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GardenSoilCalculatorPage() {
  const [unit, setUnit] = useState('imperial');
  
  // Imperial state
  const [lengthFt, setLengthFt] = useState('');
  const [widthFt, setWidthFt] = useState('');
  const [depthIn, setDepthIn] = useState('');

  // Metric state
  const [lengthM, setLengthM] = useState('');
  const [widthM, setWidthM] = useState('');
  const [depthCm, setDepthCm] = useState('');

  const [result, setResult] = useState<{ volume: string, unit: string } | null>(null);

  const handleCalculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const wastePercent = parseFloat(wastage);

    if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0 && !isNaN(wastePercent) && wastePercent >= 0) {
      const baseArea = l * w;
      const totalNeeded = baseArea * (1 + (wastePercent / 100));
      
      setResult({
        baseArea: baseArea.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        totalNeeded: totalNeeded.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      });
    } else {
        setResult(null);
    }
  };

  const length = unit === 'imperial' ? lengthFt : lengthM;
  const width = unit === 'imperial' ? widthFt : widthM;
  const wastage = '10'; // Hardcoded for simplicity as it's not in the new UI but needed for calc

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Garden Soil Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate the volume of soil needed for your garden bed, planter, or raised bed.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardHeader>
               <Tabs defaultValue="imperial" onValueChange={(val) => setUnit(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="imperial">Imperial (feet, inches)</TabsTrigger>
                  <TabsTrigger value="metric">Metric (meters, cm)</TabsTrigger>
                </TabsList>
                <CardContent className="pt-6">
                  <TabsContent value="imperial" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length-ft">Length (feet)</Label>
                        <Input id="length-ft" type="number" placeholder="e.g., 8" value={lengthFt} onChange={e => setLengthFt(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width-ft">Width (feet)</Label>
                        <Input id="width-ft" type="number" placeholder="e.g., 4" value={widthFt} onChange={e => setWidthFt(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depth-in">Depth (inches)</Label>
                        <Input id="depth-in" type="number" placeholder="e.g., 12" value={depthIn} onChange={e => setDepthIn(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="metric" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="length-m">Length (meters)</Label>
                        <Input id="length-m" type="number" placeholder="e.g., 2.5" value={lengthM} onChange={e => setLengthM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width-m">Width (meters)</Label>
                        <Input id="width-m" type="number" placeholder="e.g., 1.2" value={widthM} onChange={e => setWidthM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="depth-cm">Depth (cm)</Label>
                        <Input id="depth-cm" type="number" placeholder="e.g., 30" value={depthCm} onChange={e => setDepthCm(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <Button onClick={handleCalculate} className="w-full sm:w-auto mt-6">Calculate Soil Needed</Button>
                </CardContent>
              </Tabs>
            </CardHeader>
            {result && (
              <CardContent>
                <div className="pt-4 text-center border-t">
                    <Label>Estimated Soil Needed</Label>
                    <div className="text-5xl font-bold text-primary">{result.volume}</div>
                    <p className="text-muted-foreground">{result.unit}</p>
                </div>
              </CardContent>
            )}
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Soil for Your Garden</h2>
            <p>Whether you're building a new raised garden bed, filling a planter, or topping up an existing area, figuring out how much soil you need is the first step. Our Garden Soil Calculator simplifies this process, but understanding the basic formula is helpful for any gardener.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Soil Volume Formula</h3>
            <p>The calculation for the volume of soil needed is a simple formula: <strong>Volume = Length × Width × Depth</strong>. The key is to ensure all your measurements are in the same unit before multiplying.</p>
             <h4>For Imperial Measurements (feet, inches):</h4>
            <ol>
              <li>Measure the length and width of your garden bed in feet.</li>
              <li>Measure the desired depth of your soil in inches.</li>
              <li>Convert the depth from inches to feet by dividing by 12 (e.g., 12 inches is 1 foot).</li>
              <li>Multiply the three dimensions together: <code>Length (ft) × Width (ft) × Depth (ft)</code>. The result is the volume in cubic feet.</li>
            </ol>
            <h4>For Metric Measurements (meters, cm):</h4>
            <ol>
                <li>Measure the length and width of your garden bed in meters.</li>
                <li>Measure the depth in centimeters.</li>
                <li>Convert the depth from centimeters to meters by dividing by 100 (e.g., 30cm is 0.3 meters).</li>
                <li>Multiply the three dimensions together: <code>Length (m) × Width (m) × Depth (m)</code>. The result is the volume in cubic meters.</li>
            </ol>
            <p>Remember that soil is often sold in bags measured in cubic feet or liters. One cubic meter is equal to 1000 liters. It's often a good idea to buy slightly more than you calculate to account for settling.</p>
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
