
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ratio, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AspectRatioClient() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('');
  const [h2, setH2] = useState('');
  const [lastChanged, setLastChanged] = useState<'w2' | 'h2' | null>(null);

  useMemo(() => {
    const originalWidth = parseFloat(w1);
    const originalHeight = parseFloat(h1);
    const newWidth = parseFloat(w2);
    const newHeight = parseFloat(h2);

    if (isNaN(originalWidth) || isNaN(originalHeight) || originalWidth <= 0 || originalHeight <= 0) {
      return;
    }

    if (lastChanged === 'w2' && !isNaN(newWidth)) {
      const calculatedHeight = (newWidth * originalHeight) / originalWidth;
      setH2(Math.round(calculatedHeight).toString());
    } else if (lastChanged === 'h2' && !isNaN(newHeight)) {
      const calculatedWidth = (newHeight * originalWidth) / originalHeight;
      setW2(Math.round(calculatedWidth).toString());
    }
  }, [w1, h1, w2, h2, lastChanged]);
  
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const simplifiedRatio = useMemo(() => {
      const width = parseFloat(w1);
      const height = parseFloat(h1);
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) return 'N/A';
      const divisor = gcd(width, height);
      return `${width / divisor}:${height / divisor}`;
  }, [w1, h1]);

  return (
    <Card>
        <CardHeader>
        <CardTitle>Calculate Dimensions</CardTitle>
        <CardDescription>Enter your original dimensions and one new dimension to find the other.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Original Dimensions */}
            <div className="space-y-4 p-4 border rounded-lg">
                <Label className="font-bold">Original Size</Label>
                <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Width 1" value={w1} onChange={e => setW1(e.target.value)} />
                    <X className="w-4 h-4 text-muted-foreground" />
                    <Input type="number" placeholder="Height 1" value={h1} onChange={e => setH1(e.target.value)} />
                </div>
            </div>

            <ArrowRight className="w-6 h-6 text-muted-foreground justify-self-center hidden sm:block"/>

            {/* New Dimensions */}
            <div className="space-y-4 p-4 border rounded-lg">
                <Label className="font-bold">New Size</Label>
                <div className="flex items-center gap-2">
                     <Input type="number" placeholder="Width 2" value={w2} onChange={e => {setW2(e.target.value); setLastChanged('w2')}} />
                    <X className="w-4 h-4 text-muted-foreground" />
                    <Input type="number" placeholder="Height 2" value={h2} onChange={e => {setH2(e.target.value); setLastChanged('h2')}} />
                </div>
            </div>
        </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex justify-center items-center text-center">
            <div>
            <Label className="text-sm font-normal">Simplified Aspect Ratio</Label>
            <div className="text-4xl font-bold text-primary">{simplifiedRatio}</div>
            </div>
        </CardFooter>
    </Card>
  );
}
