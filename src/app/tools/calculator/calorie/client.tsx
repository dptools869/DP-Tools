
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityLevels = [
    { value: '1.2', label: 'Sedentary (little or no exercise)' },
    { value: '1.375', label: 'Lightly active (light exercise/sports 1-3 days/week)' },
    { value: '1.55', label: 'Moderately active (moderate exercise/sports 3-5 days/week)' },
    { value: '1.725', label: 'Very active (hard exercise/sports 6-7 days a week)' },
    { value: '1.9', label: 'Super active (very hard exercise/physical job)' },
];

export default function CalorieCalculatorClient() {
  const [unit, setUnit] = useState('metric');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState(activityLevels[0].value);
  
  // Metric state
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');

  // Imperial state
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');

  const [tdeeResult, setTdeeResult] = useState<{ maintenance: number, lose: number, gain: number } | null>(null);

  const calculateTdee = () => {
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
      
      const tdee = bmr * parseFloat(activityLevel);

      setTdeeResult({
        maintenance: Math.round(tdee),
        lose: Math.round(tdee - 500),
        gain: Math.round(tdee + 500),
      });
    } else {
      setTdeeResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Daily Calorie Calculator (TDEE)</CardTitle>
              <CardDescription className="text-lg">
                Estimate your daily calorie needs based on your activity level.
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
                    
                    <div className="space-y-2">
                        <Label htmlFor="activity-level">Activity Level</Label>
                        <Select value={activityLevel} onValueChange={setActivityLevel}>
                            <SelectTrigger id="activity-level">
                                <SelectValue placeholder="Select your activity level" />
                            </SelectTrigger>
                            <SelectContent>
                                {activityLevels.map(level => (
                                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={calculateTdee} className="w-full sm:w-auto">Calculate Calories</Button>
                </div>
              {tdeeResult && (
                <div className="pt-8 text-center border-t mt-8 space-y-6">
                    <div>
                        <Label className='text-lg'>Maintenance Calories</Label>
                        <div className="text-4xl font-bold text-primary">{tdeeResult.maintenance.toLocaleString()}</div>
                        <p className="text-muted-foreground">Calories/day to maintain your weight</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                           <Label className='text-lg'>Weight Loss</Label>
                           <div className="text-3xl font-bold text-green-500">{tdeeResult.lose.toLocaleString()}</div>
                           <p className="text-muted-foreground">Calories/day (~0.5kg/week loss)</p>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                           <Label className='text-lg'>Weight Gain</Label>
                           <div className="text-3xl font-bold text-red-500">{tdeeResult.gain.toLocaleString()}</div>
                           <p className="text-muted-foreground">Calories/day (~0.5kg/week gain)</p>
                        </div>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Understanding Your Daily Calorie Needs</h2>
            <p>Your Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day when exercise is taken into account. It is calculated by first figuring out your Basal Metabolic Rate (BMR), then multiplying that value by an activity multiplier.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>BMR and TDEE Explained</h3>
            <p>Your <strong>Basal Metabolic Rate (BMR)</strong> is the number of calories your body needs to perform its most basic, life-sustaining functions. Our calculator uses the accurate Mifflin-St Jeor equation to estimate this.</p>
            <p>Your <strong>Total Daily Energy Expenditure (TDEE)</strong> is the total number of calories you burn in a day. It is determined by multiplying your BMR by an activity factor that corresponds to your weekly exercise level. This gives you a baseline for your daily "maintenance" calories.</p>
            <h3>Using TDEE for Your Fitness Goals</h3>
             <ul>
              <li><strong>To Lose Weight:</strong> You need to consume fewer calories than your TDEE. A deficit of 500 calories per day is a common goal, which typically results in about 0.5 kg (1 lb) of weight loss per week.</li>
              <li><strong>To Maintain Weight:</strong> Consume a number of calories equal to your TDEE.</li>
              <li><strong>To Gain Weight:</strong> You need to consume more calories than your TDEE. A surplus of 500 calories per day is a common goal for steady muscle gain, when combined with resistance training.</li>
            </ul>
            <p>Remember, this calculator provides an estimate. Your actual calorie needs may vary. It's always best to consult with a healthcare professional or registered dietitian for personalized advice.</p>
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
