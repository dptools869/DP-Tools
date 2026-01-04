
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const CURRENCIES = [
    {"code": "INR", "symbol": "₹", "name": "Indian Rupee"},
    {"code": "USD", "symbol": "$", "name": "US Dollar"},
    {"code": "EUR", "symbol": "€", "name": "Euro"},
    {"code": "GBP", "symbol": "£", "name": "British Pound"},
    {"code": "PKR", "symbol": "₨", "name": "Pakistani Rupee"},
    {"code": "CAD", "symbol": "C$", "name": "Canadian Dollar"},
    {"code": "AUD", "symbol": "A$", "name": "Australian Dollar"},
    {"code": "JPY", "symbol": "¥", "name": "Japanese Yen"},
    {"code": "CNY", "symbol": "¥", "name": "Chinese Yuan"},
    {"code": "SAR", "symbol": "﷼", "name": "Saudi Riyal"},
    {"code": "AED", "symbol": "د.إ", "name": "UAE Dirham"},
    {"code": "CHF", "symbol": "Fr", "name": "Swiss Franc"},
    {"code": "SGD", "symbol": "S$", "name": "Singapore Dollar"},
    {"code": "KRW", "symbol": "₩", "name": "South Korean Won"},
    {"code": "ZAR", "symbol": "R", "name": "South African Rand"},
    {"code": "NZD", "symbol": "NZ$", "name": "New Zealand Dollar"},
    {"code": "TRY", "symbol": "₺", "name": "Turkish Lira"},
    {"code": "RUB", "symbol": "₽", "name": "Russian Ruble"},
    {"code": "HKD", "symbol": "HK$", "name": "Hong Kong Dollar"},
    {"code": "SEK", "symbol": "kr", "name": "Swedish Krona"},
    {"code": "NOK", "symbol": "kr", "name": "Norwegian Krone"},
    {"code": "DKK", "symbol": "kr", "name": "Danish Krone"},
    {"code": "THB", "symbol": "฿", "name": "Thai Baht"},
    {"code": "MYR", "symbol": "RM", "name": "Malaysian Ringgit"},
    {"code": "IDR", "symbol": "Rp", "name": "Indonesian Rupiah"},
    {"code": "EGP", "symbol": "E£", "name": "Egyptian Pound"},
    {"code": "NGN", "symbol": "₦", "name": "Nigerian Naira"},
    {"code": "BDT", "symbol": "৳", "name": "Bangladeshi Taka"},
    {"code": "PHP", "symbol": "₱", "name": "Philippine Peso"},
    {"code": "ARS", "symbol": "$", "name": "Argentine Peso"},
];

export function EnergyCalculatorClient() {
  const [appliances, setAppliances] = useState<Appliance[]>(defaultAppliances.map((a, i) => ({ ...a, id: i + 1 })));
  const [rate, setRate] = useState('3.35'); // Default rate
  const [currency, setCurrency] = useState(CURRENCIES[0]);

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
      setCurrency(CURRENCIES[0]);
  }

  const handleCurrencyChange = (code: string) => {
      const selectedCurrency = CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
      setCurrency(selectedCurrency);
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
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Bolt className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Free Energy Consumption Calculator | Estimate Your Home Usage</CardTitle>
              <CardDescription className="text-lg">
                Quickly calculate appliance energy use and costs. Enter watts, hours, and electricity rate to get instant daily, monthly, and yearly energy and cost estimates.
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
                      <Select value={currency.code} onValueChange={handleCurrencyChange}>
                          <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Select Currency" />
                          </SelectTrigger>
                          <SelectContent>
                              {CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}
                          </SelectContent>
                      </Select>
                      <Input id="rate-input" type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-32" />
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Responsive Appliance Input Section */}
              <div className="hidden md:block">
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
                        <TableCell><Input placeholder="e.g., AC" value={app.name} onChange={(e) => handleApplianceChange(app.id, 'name', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" placeholder="e.g., 1500" value={app.power} onChange={(e) => handleApplianceChange(app.id, 'power', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" placeholder="e.g., 1" value={app.quantity} onChange={(e) => handleApplianceChange(app.id, 'quantity', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" placeholder="e.g., 8" value={app.hours} onChange={(e) => handleApplianceChange(app.id, 'hours', e.target.value)} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeAppliance(app.id)} aria-label="Remove appliance"><Trash2 className="w-5 h-5 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {appliances.map(app => (
                  <div key={app.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <Input className="text-lg font-bold" placeholder="Appliance Name" value={app.name} onChange={(e) => handleApplianceChange(app.id, 'name', e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => removeAppliance(app.id)} aria-label="Remove appliance"><Trash2 className="w-5 h-5 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1"><Label>Power (Watts)</Label><Input type="number" placeholder="e.g., 1500" value={app.power} onChange={(e) => handleApplianceChange(app.id, 'power', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Quantity</Label><Input type="number" placeholder="e.g., 1" value={app.quantity} onChange={(e) => handleApplianceChange(app.id, 'quantity', e.target.value)} /></div>
                      <div className="space-y-1"><Label>Hours/Day</Label><Input type="number" placeholder="e.g., 8" value={app.hours} onChange={(e) => handleApplianceChange(app.id, 'hours', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>


              <div className="flex justify-between">
                <Button onClick={addAppliance} variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Appliance</Button>
                <Button onClick={resetAll} variant="ghost"><RefreshCw className="mr-2 h-4 w-4" /> Reset All</Button>
              </div>
              <Separator className="my-6" />
              <div>
                  <h3 className="text-2xl font-bold mb-4">Consumption Breakdown</h3>
                   <div className="overflow-x-auto">
                     <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Appliance</TableHead>
                                  <TableHead className="text-right">Daily kWh</TableHead>
                                  <TableHead className="text-right">Monthly kWh</TableHead>
                                  <TableHead className="text-right">Monthly Cost ({currency.symbol})</TableHead>
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
                                  <TableCell className="text-right text-primary">{currency.symbol}{totals.monthlyCost.toFixed(2)}</TableCell>
                              </TableRow>
                          </TableFoot>
                      </Table>
                   </div>
              </div>
            </CardContent>
          </Card>
          
           <div className="prose prose-lg dark:prose-invert max-w-none text-center my-12 hidden md:block">
            <h2>Energy Consumption Calculator</h2>
            <p>Calculate, analyze, and reduce your energy consumption easily, all in a single place. Our Energy Consumption Calculator is free and allows you to easily calculate, monitor, estimate, track, and optimize your energy usage without installing software.</p>
          </div>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding and Calculating Your Energy Consumption</h2>
            <p>Our Energy Consumption Calculator is designed to help you understand how much electricity your household appliances use and how that translates into your monthly bill. By breaking down consumption by appliance, you can identify which devices contribute most to your costs and find opportunities to save money.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>What Is So Special about our Online Energy Consumption Calculator?</h2>
            <p>Our energy consumption calculator is fast, precise, and easy to use, enabling you to perform energy calculations quickly. Here's why users choose us:</p>
            <ul>
                <li><strong>100 percent Free and Online:</strong> There is no downloading or registration; everything is in your web browser.</li>
                <li><strong>Lightning-fast:</strong> Calculate energy costs in seconds, regardless of appliance count.</li>
                <li><strong>Quality Results:</strong> Intelligent calculation and analysis ensure that your estimates are accurate and professional.</li>
                <li><strong>Safe and Secure:</strong> Your data is stored securely and automatically removed from our servers after use.</li>
                <li><strong>Easy Access:</strong> Works optimally on desktops, tablets, and mobile devices.</li>
                <li><strong>All-in-One Solution:</strong> Appliance calculations and bill estimation to cost comparison and carbon footprint—everything is in one place.</li>
            </ul>
            <h2>Perfect for Every Use Case</h2>
            <p>Our tool is designed to include all types of users:</p>
            <ul>
                <li><strong>Homeowners:</strong> Calculate energy consumption to better control household bills.</li>
                <li><strong>Business Owners:</strong> Develop cost-saving strategies without outsourcing.</li>
                <li><strong>Facility Managers:</strong> Easily optimize energy use in commercial buildings by calculating, tracking, or estimating.</li>
                <li><strong>Students and Teachers:</strong> Prepare energy calculations on projects, assignments, and presentations.</li>
                <li><strong>Energy Consultants:</strong> Control appliance data and consumption reports consistently in terms of quality and accuracy.</li>
            </ul>
            <h2>Safe, Secure, and Private</h2>
            <p>We value your privacy. All data entered on it is transmitted securely via encrypted links. As soon as your energy consumption is calculated, estimated, or analyzed, it will be automatically removed from our servers. You always have complete control over your content.</p>
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
