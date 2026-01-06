
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, GitCommit } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

type CalcMode = 'water' | 'coffee';

export default function CoffeeRatioPage() {
  const [calcMode, setCalcMode] = useState<CalcMode>('water');
  const [coffee, setCoffee] = useState('20');
  const [water, setWater] = useState('300');
  const [ratio, setRatio] = useState(15);

  useMemo(() => {
    const coffeeNum = parseFloat(coffee);
    const waterNum = parseFloat(water);

    if (calcMode === 'water') {
      if (!isNaN(coffeeNum) && coffeeNum > 0) {
        setWater((coffeeNum * ratio).toFixed(0));
      }
    } else { // calcMode === 'coffee'
      if (!isNaN(waterNum) && waterNum > 0) {
        setCoffee((waterNum / ratio).toFixed(1));
      }
    }
  }, [coffee, water, ratio, calcMode]);
  
  const handleCoffeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCalcMode('water');
      setCoffee(e.target.value);
  }

  const handleWaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCalcMode('coffee');
      setWater(e.target.value);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Coffee className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Coffee to Water Ratio Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate the perfect coffee-to-water ratio for your ideal brew.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Brewing Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className='space-y-2'>
                    <Label htmlFor="coffee-amount" className="text-lg">Coffee</Label>
                    <div className="flex items-center gap-2">
                        <Input id="coffee-amount" type="number" value={coffee} onChange={handleCoffeeChange} className="text-xl h-12" />
                        <span className="font-semibold text-muted-foreground">grams</span>
                    </div>
                  </div>
                   <div className='space-y-2'>
                    <Label htmlFor="water-amount" className="text-lg">Water</Label>
                     <div className="flex items-center gap-2">
                        <Input id="water-amount" type="number" value={water} onChange={handleWaterChange} className="text-xl h-12" />
                        <span className="font-semibold text-muted-foreground">grams (ml)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                         <Label className="text-lg">Ratio</Label>
                         <div className="text-2xl font-bold text-primary">1 : {ratio}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Lighter</span>
                        <Slider
                            value={[ratio]}
                            onValueChange={(value) => setRatio(value[0])}
                            min={10}
                            max={20}
                            step={1}
                        />
                        <span className="text-sm text-muted-foreground">Stronger</span>
                    </div>
                </div>

                <div className="text-center text-muted-foreground italic">
                    {calcMode === 'water' 
                        ? 'Adjust the Coffee amount or Ratio to calculate Water.'
                        : 'Adjust the Water amount or Ratio to calculate Coffee.'
                    }
                </div>
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>The Secret to Great Coffee: Understanding Brew Ratios</h2>
            <p>One of the most critical factors for brewing delicious coffee is the coffee-to-water ratio. This ratio determines the strength and extraction of your brew. Our calculator helps you nail this every time, whether you're making a pour-over, French press, or AeroPress.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>What is a Brew Ratio?</h3>
            <p>A brew ratio is simply the proportion of coffee grounds to water, measured by weight. A common starting point is a 1:16 ratio, which means for every 1 gram of coffee, you use 16 grams of water. Since 1 gram of water is equal to 1 milliliter, you can use grams and milliliters interchangeably for water.</p>
             <ul>
              <li>A <strong>smaller ratio</strong> (like 1:14) will produce a stronger, more concentrated coffee.</li>
              <li>A <strong>larger ratio</strong> (like 1:18) will result in a lighter, more delicate cup.</li>
            </ul>
            <h3>Common Ratios for Different Brew Methods</h3>
             <ul>
              <li><strong>Pour-Over (V60, Chemex):</strong> 1:15 to 1:17</li>
              <li><strong>French Press:</strong> 1:12 to 1:15</li>
              <li><strong>AeroPress:</strong> Highly variable, but a 1:14 ratio is a good starting point for a standard brew.</li>
              <li><strong>Cold Brew:</strong> Often made as a concentrate at a 1:5 to 1:8 ratio, then diluted to drink.</li>
            </ul>
            <p>Use our calculator to experiment with different ratios and find what tastes best to you. Adjust the coffee or water amount and let the calculator do the math, or slide the ratio to see how it impacts your measurements. Happy brewing!</p>
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
