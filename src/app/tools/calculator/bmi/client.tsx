
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BmiCalculatorClient() {
  const [unit, setUnit] = useState('metric');
  
  // Metric state
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  // Imperial state
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [bmiResult, setBmiResult] = useState<{ bmi: number, category: string, color: string } | null>(null);

  const calculateBmi = () => {
    let heightMeters = 0;
    let weight = 0;

    if (unit === 'metric') {
      const hCm = parseFloat(heightCm);
      const wKg = parseFloat(weightKg);
      if (hCm > 0 && wKg > 0) {
        heightMeters = hCm / 100;
        weight = wKg;
      }
    } else {
      const hFt = parseFloat(heightFt);
      const hIn = parseFloat(heightIn) || 0;
      const wLbs = parseFloat(weightLbs);
      if ((hFt > 0 || hIn > 0) && wLbs > 0) {
        const totalInches = (hFt * 12) + hIn;
        heightMeters = totalInches * 0.0254;
        weight = wLbs * 0.453592;
      }
    }

    if (heightMeters > 0 && weight > 0) {
      const bmi = weight / (heightMeters * heightMeters);
      let category = '';
      let color = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-500';
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = 'text-green-500';
      } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = 'text-yellow-500';
      } else {
        category = 'Obesity';
        color = 'text-red-500';
      }
      
      setBmiResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
    } else {
      setBmiResult(null);
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
              <CardTitle className="text-3xl font-headline">Body Mass Index (BMI) Calculator</CardTitle>
              <CardDescription className="text-lg">
                Check your Body Mass Index to assess your weight status.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Tabs defaultValue="metric" onValueChange={(val) => setUnit(val)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric Units (kg, cm)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial Units (lbs, ft, in)</TabsTrigger>
                </TabsList>
                <CardContent className="pt-6">
                  <TabsContent value="metric" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height-cm">Height (cm)</Label>
                        <Input id="height-cm" type="number" placeholder="e.g., 175" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-kg">Weight (kg)</Label>
                        <Input id="weight-kg" type="number" placeholder="e.g., 70" value={weightKg} onChange={e => setWeightKg(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="imperial" className="space-y-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex gap-2">
                        <div className="space-y-2 w-1/2">
                            <Label htmlFor="height-ft">Height (ft)</Label>
                            <Input id="height-ft" type="number" placeholder="e.g., 5" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
                        </div>
                         <div className="space-y-2 w-1/2">
                            <Label htmlFor="height-in">Height (in)</Label>
                            <Input id="height-in" type="number" placeholder="e.g., 9" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                        <Input id="weight-lbs" type="number" placeholder="e.g., 154" value={weightLbs} onChange={e => setWeightLbs(e.target.value)} />
                      </div>
                    </div>
                  </TabsContent>
                  <Button onClick={calculateBmi} className="w-full sm:w-auto mt-6">Calculate BMI</Button>
                </CardContent>
              </Tabs>
            </CardHeader>
            {bmiResult && (
              <CardContent>
                <div className="pt-4 text-center border-t">
                    <Label>Your BMI Result</Label>
                    <div className={`text-5xl font-bold ${bmiResult.color}`}>{bmiResult.bmi}</div>
                    <div className={`text-xl font-semibold ${bmiResult.color}`}>{bmiResult.category}</div>
                </div>
              </CardContent>
            )}
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Body Mass Index (BMI)</h2>
            <p>Body Mass Index (BMI) is a simple calculation using a person's height and weight. The formula is BMI = kg/m<sup>2</sup> where kg is a person's weight in kilograms and m<sup>2</sup> is their height in metres squared. It is used to broadly categorize a person's weight as underweight, normal weight, overweight, or obese. While it can be a useful screening tool, it does not diagnose body fatness or the health of an individual.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>BMI Categories</h3>
            <p>The standard weight status categories associated with BMI ranges for adults are:</p>
             <ul>
              <li><strong>Below 18.5:</strong> Underweight</li>
              <li><strong>18.5 – 24.9:</strong> Normal weight</li>
              <li><strong>25.0 – 29.9:</strong> Overweight</li>
              <li><strong>30.0 and above:</strong> Obesity</li>
            </ul>
            <h3>Limitations of BMI</h3>
            <p>It’s important to remember that BMI is a general guideline and has its limitations. It does not account for factors like body composition (muscle vs. fat), age, sex, or ethnicity. For example, athletes with a high muscle mass may have a high BMI but not have high body fat. Therefore, it's best to use BMI as part of a larger health assessment in consultation with a healthcare provider.</p>
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
