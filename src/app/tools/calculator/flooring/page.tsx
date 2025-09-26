
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ruler } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function FlooringCalculatorPage() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [wastage, setWastage] = useState('10'); // Default 10%
  const [result, setResult] = useState<{ baseArea: string, totalNeeded: string } | null>(null);

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Ruler className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Flooring Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate the amount of flooring material needed for your project.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room and Material Details</CardTitle>
                <CardDescription>Enter your room dimensions and waste factor to estimate your flooring needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="room-length">Room Length (feet)</Label>
                    <Input id="room-length" type="number" placeholder="e.g., 12" value={length} onChange={e => setLength(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="room-width">Room Width (feet)</Label>
                    <Input id="room-width" type="number" placeholder="e.g., 10" value={width} onChange={e => setWidth(e.target.value)} />
                  </div>
                   <div className='space-y-2'>
                    <Label htmlFor="wastage">Waste Factor (%)</Label>
                    <Input id="wastage" type="number" placeholder="e.g., 10" value={wastage} onChange={e => setWastage(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full sm:w-auto">Calculate Flooring</Button>
                {result && (
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                    <div>
                        <Label>Room Area</Label>
                        <div className="text-2xl font-bold text-primary">{result.baseArea} sq ft</div>
                    </div>
                    <div>
                        <Label>Total Flooring Needed (with waste)</Label>
                        <div className="text-2xl font-bold text-green-500">{result.totalNeeded} sq ft</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Flooring for Your Project</h2>
            <p>Accurately estimating the amount of flooring you need is the first step to a successful project. It helps you budget correctly and ensures you don't run out of material mid-installation. Our calculator simplifies this, but here's how to do it yourself.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>1. Calculate the Room's Area</h3>
            <p>Measure the length and width of your room in feet. Multiply these two numbers to get the square footage of the area you need to cover. For example, a room that is 12 feet long and 10 feet wide has an area of <code>12 * 10 = 120</code> square feet.</p>

            <h3>2. Account for Waste</h3>
            <p>It's crucial to add a "waste factor" to your total area. This extra material accounts for cuts, mistakes, and oddly shaped areas. A standard waste factor is 10%, but for complex layouts with many cuts, you might increase this to 15-20%.</p>

            <h3>3. Calculate the Total Amount Needed</h3>
            <p>To find the total amount of flooring to purchase, multiply your room's area by your waste factor percentage (as a decimal). For a 120 sq ft room with a 10% waste factor, the calculation would be <code>120 * 1.10 = 132</code> square feet. This is the total amount of flooring you should buy.</p>
            <p>Our calculator does all these steps for you, giving you a quick and reliable estimate to take to the hardware store. Always round up to the next full box or case when purchasing your materials.</p>
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

