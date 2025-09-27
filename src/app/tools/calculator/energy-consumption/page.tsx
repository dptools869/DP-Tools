
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as TableFoot } from '@/components/ui/table';
import { Bolt, Plus, Trash2, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Separator } from '@/components/ui/separator';

type Appliance = {
  id: number;
  name: string;
  power: string; // in Watts
  quantity: string;
  hours: string; // hours per day
};

const defaultAppliances: Omit<Appliance, 'id'>[] = [
    { name: 'AC', power: '1500', quantity: '1', hours: '8' },
    { name: 'Fan', power: '75', quantity: '4', hours: '10' },
    { name: 'Refrigerator', power: '200', quantity: '1', hours: '24' },
    { name: 'Lights', power: '15', quantity: '5', hours: '6' },
];

export default function EnergyCalculatorPage() {
  const [appliances, setAppliances] = useState<Appliance[]>(defaultAppliances.map((a, i) => ({ ...a, id: i + 1 })));
  const [rate, setRate] = useState('3.35'); // Default rate in Rupees

  const handleApplianceChange = (id: number, field: keyof Omit<Appliance, 'id'>, value: string) => {
    setAppliances(appliances.map(app => app.id === id ? { ...app, [field]: value } : app));
  };

  const addAppliance = () => {
    setAppliances([...appliances, { id: Date.now(), name: '', power: '', quantity: '1', hours: '' }]);
  };

  const removeAppliance = (id: number) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const resetAll = () => {
      setAppliances(defaultAppliances.map((a, i) => ({ ...a, id: i + 1 })));
      setRate('3.35');
  }

  const { detailedConsumption, totals } = useMemo(() => {
    const dailyKWhPerAppliance = appliances.map(app => {
      const power = parseFloat(app.power) || 0;
      const quantity = parseInt(app.quantity) || 0;
      const hours = parseFloat(app.hours) || 0;
      if (power > 0 && quantity > 0 && hours > 0) {
        return (power * quantity * hours) / 1000;
      }
      return 0;
    });

    const monthlyKWhPerAppliance = dailyKWhPerAppliance.map(dailyKWh => dailyKWh * 30);
    const monthlyCostPerAppliance = monthlyKWhPerAppliance.map(monthlyKWh => monthlyKWh * (parseFloat(rate) || 0));

    const detailedConsumption = appliances.map((app, index) => ({
      ...app,
      dailyKWh: dailyKWhPerAppliance[index],
      monthlyKWh: monthlyKWhPerAppliance[index],
      monthlyCost: monthlyCostPerAppliance[index],
    }));

    const totals = {
      dailyKWh: dailyKWhPerAppliance.reduce((sum, val) => sum + val, 0),
      monthlyKWh: monthlyKWhPerAppliance.reduce((sum, val) => sum + val, 0),
      monthlyCost: monthlyCostPerAppliance.reduce((sum, val) => sum + val, 0),
    };
    
    return { detailedConsumption, totals };
  }, [appliances, rate]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Bolt className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Energy Consumption Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate your household electricity usage and monthly cost.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appliance List</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center justify-between">
                <CardDescription>Enter your appliances, their power, and usage to calculate costs.</CardDescription>
                <div className='space-y-2'>
                    <Label htmlFor="rate-input">Electricity Rate (per unit/kWh)</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">₹</span>
                      <Input id="rate-input" type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-32" />
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Appliance</TableHead>
                      <TableHead>Power (Watts)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Hours Used/Day</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appliances.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <Input placeholder="e.g., AC" value={app.name} onChange={(e) => handleApplianceChange(app.id, 'name', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="e.g., 1500" value={app.power} onChange={(e) => handleApplianceChange(app.id, 'power', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="e.g., 1" value={app.quantity} onChange={(e) => handleApplianceChange(app.id, 'quantity', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="e.g., 8" value={app.hours} onChange={(e) => handleApplianceChange(app.id, 'hours', e.target.value)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeAppliance(app.id)} aria-label="Remove appliance">
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between">
                <Button onClick={addAppliance} variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Appliance</Button>
                <Button onClick={resetAll} variant="ghost"><RefreshCw className="mr-2 h-4 w-4" /> Reset All</Button>
              </div>
              <Separator className="my-6" />
              <div>
                  <h3 className="text-2xl font-bold mb-4">Consumption Breakdown</h3>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Appliance</TableHead>
                                <TableHead className="text-right">Daily Units (kWh)</TableHead>
                                <TableHead className="text-right">Monthly Units (kWh)</TableHead>
                                <TableHead className="text-right">Monthly Cost (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailedConsumption.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.name}</TableCell>
                                    <TableCell className="text-right">{app.dailyKWh.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{app.monthlyKWh.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{app.monthlyCost.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFoot>
                            <TableRow className="font-bold text-lg">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right">{totals.dailyKWh.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{totals.monthlyKWh.toFixed(2)}</TableCell>
                                <TableCell className="text-right text-primary">₹{totals.monthlyCost.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFoot>
                    </Table>
              </div>
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding and Calculating Your Energy Consumption</h2>
            <p>Our Energy Consumption Calculator is designed to help you understand how much electricity your household appliances use and how that translates into your monthly bill. By breaking down consumption by appliance, you can identify which devices contribute most to your costs and find opportunities to save money.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Formula for Energy Calculation</h3>
            <p>The calculation for electricity consumption is based on the power of an appliance, how long it's used, and the number of days. The basic unit of energy is the kilowatt-hour (kWh), which is what your electricity provider uses to bill you.</p>
             <ol>
              <li><strong>Calculate Daily Consumption (kWh):</strong> First, we find the total watt-hours per day: <code>(Power in Watts × Hours Used Per Day × Number of Appliances)</code>. Then, we divide by 1000 to convert watt-hours to kilowatt-hours (kWh).</li>
              <li><strong>Calculate Monthly Consumption:</strong> We multiply the daily consumption by 30 to estimate the total kWh used in a month.</li>
              <li><strong>Calculate Monthly Cost:</strong> Finally, we multiply the total monthly kWh by the per-unit rate you provide to get the estimated monthly cost.</li>
            </ol>
            <p>This tool empowers you to make informed decisions about your energy use, helping you to become more energy-efficient and reduce your carbon footprint.</p>
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
