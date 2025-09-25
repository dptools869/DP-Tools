
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fuel } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FuelCostCalculatorPage() {
  const [unit, setUnit] = useState('metric');
  
  // Metric state
  const [distanceKm, setDistanceKm] = useState('');
  const [consumptionL100km, setConsumptionL100km] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');

  // Imperial state
  const [distanceMiles, setDistanceMiles] = useState('');
  const [efficiencyMpg, setEfficiencyMpg] = useState('');
  const [pricePerGallon, setPricePerGallon] = useState('');

  const [result, setResult] = useState<{ totalCost: string; currency: string; } | null>(null);

  const calculateCost = () => {
    let cost = 0;
    let currency = '$'; // Assuming dollar, can be made dynamic

    if (unit === 'metric') {
      const dist = parseFloat(distanceKm);
      const cons = parseFloat(consumptionL100km);
      const price = parseFloat(pricePerLiter);

      if (dist > 0 && cons > 0 && price > 0) {
        cost = (dist / 100) * cons * price;
      }
    } else { // Imperial
      const dist = parseFloat(distanceMiles);
      const eff = parseFloat(efficiencyMpg);
      const price = parseFloat(pricePerGallon);

      if (dist > 0 && eff > 0 && price > 0) {
        cost = (dist / eff) * price;
      }
    }

    if (cost > 0) {
      setResult({ totalCost: cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), currency });
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
                <Fuel className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Fuel Cost Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate the fuel cost for your trip based on distance, vehicle efficiency, and fuel price.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Tabs defaultValue="metric" onValueChange={(val) => setUnit(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric (km, L/100km)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial (miles, MPG)</TabsTrigger>
                </TabsList>
                <CardContent className="pt-6">
                  <TabsContent value="metric" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="distance-km">Distance (km)</Label>
                        <Input id="distance-km" type="number" placeholder="e.g., 450" value={distanceKm} onChange={e => setDistanceKm(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="consumption-l100km">Consumption (L/100km)</Label>
                        <Input id="consumption-l100km" type="number" placeholder="e.g., 8.5" value={consumptionL100km} onChange={e => setConsumptionL100km(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price-liter">Price per Liter ($)</Label>
                        <Input id="price-liter" type="number" placeholder="e.g., 1.50" value={pricePerLiter} onChange={e => setPricePerLiter(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="imperial" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="distance-miles">Distance (miles)</Label>
                        <Input id="distance-miles" type="number" placeholder="e.g., 280" value={distanceMiles} onChange={e => setDistanceMiles(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="efficiency-mpg">Efficiency (MPG)</Label>
                        <Input id="efficiency-mpg" type="number" placeholder="e.g., 25" value={efficiencyMpg} onChange={e => setEfficiencyMpg(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price-gallon">Price per Gallon ($)</Label>
                        <Input id="price-gallon" type="number" placeholder="e.g., 3.75" value={pricePerGallon} onChange={e => setPricePerGallon(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <Button onClick={calculateCost} className="w-full sm:w-auto mt-6">Calculate Fuel Cost</Button>
                </CardContent>
              </Tabs>
            </CardHeader>
            {result && (
              <CardContent>
                <div className="pt-4 text-center border-t">
                    <Label>Estimated Fuel Cost</Label>
                    <div className="text-5xl font-bold text-primary">{result.currency}{result.totalCost}</div>
                </div>
              </CardContent>
            )}
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Planning Your Trip: How to Calculate Fuel Cost</h2>
            <p>Whether you're planning a road trip or just your daily commute, understanding your potential fuel cost is essential for budgeting. Our Fuel Cost Calculator makes it easy to estimate how much you'll spend on gas. By inputting your trip distance, your vehicle's fuel efficiency, and the current price of fuel, you can get an accurate estimate in seconds.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Formulas for Fuel Cost Calculation</h3>
            <p>The calculation is simple and depends on whether you use metric or imperial units:</p>
             <ul>
              <li><strong>Metric:</strong> <code>Total Cost = (Distance in km / 100) * Fuel Consumption in L/100km * Price per Liter</code></li>
              <li><strong>Imperial:</strong> <code>Total Cost = (Distance in miles / Miles Per Gallon) * Price per Gallon</code></li>
            </ul>
            <h3>Tips for Improving Fuel Efficiency</h3>
            <p>Want to lower your fuel costs? Here are a few tips:</p>
            <ul>
                <li><strong>Maintain Your Vehicle:</strong> Regular oil changes and properly inflated tires can improve your MPG.</li>
                <li><strong>Drive Smoothly:</strong> Avoid aggressive acceleration and braking.</li>
                <li><strong>Reduce Weight:</strong> Don't carry unnecessary heavy items in your car.</li>
                <li><strong>Limit Idling:</strong> Turn off your engine if you'll be stopped for more than a minute.</li>
            </ul>
            <p>By understanding your fuel consumption and adopting smarter driving habits, you can save a significant amount of money over time. Use our calculator to see how different factors can impact your travel budget.</p>
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
