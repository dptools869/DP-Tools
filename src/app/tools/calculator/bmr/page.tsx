
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function BmrCalculatorPage() {
  const [unit, setUnit] = useState('metric');
  const [gender, setGender] = useState('male');
  
  const [age, setAge] = useState('');
  
  // Metric state
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  // Imperial state
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [bmrResult, setBmrResult] = useState<number | null>(null);

  const calculateBmr = () => {
    const ageNum = parseInt(age);
    let height = 0;
    let weight = 0;

    if (unit === 'metric') {
      height = parseFloat(heightCm);
      weight = parseFloat(weightKg);
    } else {
      const hFt = parseFloat(heightFt);
      const hIn = parseFloat(heightIn) || 0;
      weight = parseFloat(weightLbs) * 0.453592; // lbs to kg
      height = ((hFt * 12) + hIn) * 2.54; // ft+in to cm
    }

    if (ageNum > 0 && height > 0 && weight > 0) {
      let bmr = 0;
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * ageNum) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * ageNum) - 161;
      }
      setBmrResult(Math.round(bmr));
    } else {
      setBmrResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BrainCircuit className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Basal Metabolic Rate (BMR) Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate the number of calories your body needs at rest.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup defaultValue="male" onValueChange={setGender} className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" placeholder="e.g., 30" value={age} onChange={e => setAge(e.target.value)} />
                        </div>
                    </div>

                    <Tabs defaultValue="metric" onValueChange={setUnit} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="metric">Metric Units</TabsTrigger>
                        <TabsTrigger value="imperial">Imperial Units</TabsTrigger>
                        </TabsList>
                        <TabsContent value="metric" className="mt-4 space-y-4">
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
                        <TabsContent value="imperial" className="mt-4 space-y-4">
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
                    </Tabs>
                    <Button onClick={calculateBmr} className="w-full sm:w-auto">Calculate BMR</Button>
                </div>
              {bmrResult !== null && (
                <div className="pt-8 text-center border-t mt-8">
                    <Label className='text-lg'>Your Basal Metabolic Rate (BMR)</Label>
                    <div className="text-5xl font-bold text-primary">{bmrResult}</div>
                    <p className="text-muted-foreground">Calories/day</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Basal Metabolic Rate (BMR)</h2>
            <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs to accomplish its most basic (basal) life-sustaining functions. This includes things like breathing, circulation, nutrient processing, and cell production. BMR is the energy your body would burn if you were to do nothing but rest for 24 hours.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Mifflin-St Jeor Equation</h3>
            <p>Our calculator uses the Mifflin-St Jeor equation, which is considered one of the most accurate methods for calculating BMR. The formulas are:</p>
             <ul>
              <li><strong>For Men:</strong> BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5</li>
              <li><strong>For Women:</strong> BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161</li>
            </ul>
            <h3>How to Use Your BMR</h3>
            <p>While BMR is the baseline, you burn more calories throughout the day based on your activity level. To estimate your total daily calorie needs (Total Daily Energy Expenditure or TDEE), you can multiply your BMR by an activity factor:</p>
            <ul>
                <li><strong>Sedentary (little or no exercise):</strong> BMR x 1.2</li>
                <li><strong>Lightly active (light exercise/sports 1-3 days/week):</strong> BMR x 1.375</li>
                <li><strong>Moderately active (moderate exercise/sports 3-5 days/week):</strong> BMR x 1.55</li>
                <li><strong>Very active (hard exercise/sports 6-7 days a week):</strong> BMR x 1.725</li>
                <li><strong>Super active (very hard exercise/physical job):</strong> BMR x 1.9</li>
            </ul>
            <p>Understanding your BMR is the first step toward managing your weight, whether your goal is to lose, gain, or maintain it.</p>
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
