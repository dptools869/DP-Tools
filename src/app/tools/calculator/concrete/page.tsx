
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ConcreteCalculatorPage() {
  const [unit, setUnit] = useState('imperial');
  
  // Imperial state
  const [lengthFt, setLengthFt] = useState('');
  const [widthFt, setWidthFt] = useState('');
  const [thicknessIn, setThicknessIn] = useState('');

  // Metric state
  const [lengthM, setLengthM] = useState('');
  const [widthM, setWidthM] = useState('');
  const [thicknessCm, setThicknessCm] = useState('');

  const [result, setResult] = useState<{ volume: string, unit: string } | null>(null);

  const calculateConcrete = () => {
    let volume = 0;
    let resultUnit = '';

    if (unit === 'imperial') {
      const l = parseFloat(lengthFt);
      const w = parseFloat(widthFt);
      const t = parseFloat(thicknessIn);
      if (l > 0 && w > 0 && t > 0) {
        const volumeCubicFeet = l * w * (t / 12);
        volume = volumeCubicFeet / 27; // Convert cubic feet to cubic yards
        resultUnit = 'cubic yards';
      }
    } else { // Metric
      const l = parseFloat(lengthM);
      const w = parseFloat(widthM);
      const t = parseFloat(thicknessCm);
      if (l > 0 && w > 0 && t > 0) {
        volume = l * w * (t / 100); // Convert cm thickness to meters
        resultUnit = 'cubic meters';
      }
    }

    if (volume > 0) {
      setResult({ volume: volume.toFixed(2), unit: resultUnit });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Calculator className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Concrete Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate the volume of concrete needed for your project slab.
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
                        <Input id="length-ft" type="number" placeholder="e.g., 20" value={lengthFt} onChange={e => setLengthFt(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width-ft">Width (feet)</Label>
                        <Input id="width-ft" type="number" placeholder="e.g., 10" value={widthFt} onChange={e => setWidthFt(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thickness-in">Thickness (inches)</Label>
                        <Input id="thickness-in" type="number" placeholder="e.g., 4" value={thicknessIn} onChange={e => setThicknessIn(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="metric" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="length-m">Length (meters)</Label>
                        <Input id="length-m" type="number" placeholder="e.g., 6" value={lengthM} onChange={e => setLengthM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width-m">Width (meters)</Label>
                        <Input id="width-m" type="number" placeholder="e.g., 3" value={widthM} onChange={e => setWidthM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thickness-cm">Thickness (cm)</Label>
                        <Input id="thickness-cm" type="number" placeholder="e.g., 10" value={thicknessCm} onChange={e => setThicknessCm(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <Button onClick={calculateConcrete} className="w-full sm:w-auto mt-6">Calculate Concrete Volume</Button>
                </CardContent>
              </Tabs>
            </CardHeader>
            {result && (
              <CardContent>
                <div className="pt-4 text-center border-t">
                    <Label>Estimated Concrete Needed</Label>
                    <div className="text-5xl font-bold text-primary">{result.volume}</div>
                    <p className="text-muted-foreground">{result.unit}</p>
                </div>
              </CardContent>
            )}
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Concrete for a Slab</h2>
            <p>Accurately calculating the amount of concrete needed for a project is crucial to avoid costly shortages or wasteful overages. Our concrete calculator simplifies this for you, but understanding the formula is key for any DIY or professional construction project.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Concrete Volume Formula</h3>
            <p>The basic formula for the volume of a rectangular slab is simple: <strong>Volume = Length × Width × Thickness</strong>. However, the complexity comes from ensuring all your measurements are in the same unit before calculating the final volume, which is typically ordered in cubic yards or cubic meters.</p>
             <h4>For Imperial Measurements (feet, inches):</h4>
            <ol>
              <li>First, convert the thickness from inches to feet by dividing by 12. For a 4-inch slab, this is <code>4 / 12 = 0.333</code> feet.</li>
              <li>Next, calculate the volume in cubic feet: <code>Length (ft) × Width (ft) × Thickness (ft)</code>.</li>
              <li>Finally, since concrete is ordered in cubic yards, convert cubic feet to cubic yards by dividing by 27 (since there are 27 cubic feet in one cubic yard).</li>
            </ol>
            <h4>For Metric Measurements (meters, cm):</h4>
            <ol>
                <li>Convert the thickness from centimeters to meters by dividing by 100. For a 10cm slab, this is <code>10 / 100 = 0.1</code> meters.</li>
                <li>Calculate the volume in cubic meters: <code>Length (m) × Width (m) × Thickness (m)</code>. The result is already in cubic meters, which is how concrete is ordered in the metric system.</li>
            </ol>
            <p>Always consider ordering slightly more (about 5-10%) than your calculated amount to account for uneven subgrade, spillage, and variations in form-work.</p>
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
