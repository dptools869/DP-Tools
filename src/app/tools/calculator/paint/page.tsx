
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paintbrush, Plus, Trash2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

type Dimension = {
  id: number;
  width: string;
  height: string;
};

export default function PaintCalculatorPage() {
  const [walls, setWalls] = useState<Dimension[]>([{ id: 1, width: '10', height: '8' }]);
  const [windows, setWindows] = useState<Dimension[]>([{ id: 1, width: '3', height: '4' }]);
  const [doors, setDoors] = useState<Dimension[]>([{ id: 1, width: '3', height: '6.75' }]);
  
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('350'); // sq ft per gallon

  const handleDimensionChange = (
    list: Dimension[],
    setList: React.Dispatch<React.SetStateAction<Dimension[]>>,
    id: number,
    field: 'width' | 'height',
    value: string
  ) => {
    setList(list.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addDimension = (setList: React.Dispatch<React.SetStateAction<Dimension[]>>) => {
    setList(prev => [...prev, { id: Date.now(), width: '', height: '' }]);
  };

  const removeDimension = (setList: React.Dispatch<React.SetStateAction<Dimension[]>>, id: number) => {
    setList(prev => prev.filter(item => item.id !== id));
  };
  
  const totalArea = useMemo(() => {
    const wallArea = walls.reduce((acc, wall) => acc + (parseFloat(wall.width) || 0) * (parseFloat(wall.height) || 0), 0);
    const windowArea = windows.reduce((acc, win) => acc + (parseFloat(win.width) || 0) * (parseFloat(win.height) || 0), 0);
    const doorArea = doors.reduce((acc, door) => acc + (parseFloat(door.width) || 0) * (parseFloat(door.height) || 0), 0);
    return Math.max(0, wallArea - windowArea - doorArea);
  }, [walls, windows, doors]);

  const paintNeeded = useMemo(() => {
    const numCoats = parseInt(coats);
    const cov = parseInt(coverage);
    if (totalArea > 0 && numCoats > 0 && cov > 0) {
      const totalPaintArea = totalArea * numCoats;
      return (totalPaintArea / cov).toFixed(2);
    }
    return '0.00';
  }, [totalArea, coats, coverage]);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Paintbrush className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Paint Calculator</CardTitle>
              <CardDescription className="text-lg">
                Estimate how much paint you need for your project.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Room & Paint Details</CardTitle>
                <CardDescription>Enter the dimensions of your walls and details about your paint job.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Wall Dimensions */}
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex justify-between items-center">
                        <Label className="font-bold">Wall Dimensions (feet)</Label>
                        <Button variant="outline" size="sm" onClick={() => addDimension(setWalls)}><Plus className="mr-2 h-4 w-4"/>Add Wall</Button>
                    </div>
                    {walls.map((wall) => (
                        <div key={wall.id} className="flex items-center gap-2">
                           <Input type="number" placeholder="Width" value={wall.width} onChange={(e) => handleDimensionChange(walls, setWalls, wall.id, 'width', e.target.value)} />
                           <span className="text-muted-foreground">x</span>
                           <Input type="number" placeholder="Height" value={wall.height} onChange={(e) => handleDimensionChange(walls, setWalls, wall.id, 'height', e.target.value)} />
                           {walls.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeDimension(setWalls, wall.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>}
                        </div>
                    ))}
                </div>

                {/* Windows and Doors */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                            <Label className="font-bold">Windows (feet)</Label>
                            <Button variant="outline" size="sm" onClick={() => addDimension(setWindows)}><Plus className="mr-2 h-4 w-4"/>Add Window</Button>
                        </div>
                        {windows.map((win) => (
                            <div key={win.id} className="flex items-center gap-2">
                               <Input type="number" placeholder="Width" value={win.width} onChange={(e) => handleDimensionChange(windows, setWindows, win.id, 'width', e.target.value)} />
                               <span className="text-muted-foreground">x</span>
                               <Input type="number" placeholder="Height" value={win.height} onChange={(e) => handleDimensionChange(windows, setWindows, win.id, 'height', e.target.value)} />
                               <Button variant="ghost" size="icon" onClick={() => removeDimension(setWindows, win.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-4 rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                            <Label className="font-bold">Doors (feet)</Label>
                            <Button variant="outline" size="sm" onClick={() => addDimension(setDoors)}><Plus className="mr-2 h-4 w-4"/>Add Door</Button>
                        </div>
                        {doors.map((door) => (
                            <div key={door.id} className="flex items-center gap-2">
                               <Input type="number" placeholder="Width" value={door.width} onChange={(e) => handleDimensionChange(doors, setDoors, door.id, 'width', e.target.value)} />
                               <span className="text-muted-foreground">x</span>
                               <Input type="number" placeholder="Height" value={door.height} onChange={(e) => handleDimensionChange(doors, setDoors, door.id, 'height', e.target.value)} />
                               <Button variant="ghost" size="icon" onClick={() => removeDimension(setDoors, door.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Coats and Coverage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className='space-y-2'>
                    <Label htmlFor="coats">Number of Coats</Label>
                    <Input id="coats" type="number" placeholder="e.g., 2" value={coats} onChange={e => setCoats(e.target.value)} />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor="coverage">Paint Coverage (sq ft / gallon)</Label>
                    <Input id="coverage" type="number" placeholder="e.g., 350" value={coverage} onChange={e => setCoverage(e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
                  <div>
                    <Label className="text-sm font-normal">Total Area to Paint</Label>
                    <div className="text-3xl font-bold text-primary">{totalArea.toFixed(2)} sq ft</div>
                  </div>
                  <div>
                    <Label className="text-sm font-normal">You will need</Label>
                    <div className="text-5xl font-bold text-primary">{paintNeeded}</div>
                    <p className="text-muted-foreground">gallons of paint</p>
                  </div>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate How Much Paint You Need</h2>
            <p>Estimating the right amount of paint for your project is crucial to avoid multiple trips to the store or wasting money on excess paint. Our calculator simplifies this process, but understanding the steps can help you plan better.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Paint Calculation Formula</h3>
             <ol>
              <li><strong>Calculate Total Wall Area:</strong> For each wall, multiply its width by its height to get the square footage. Add the square footage of all walls together.</li>
              <li><strong>Subtract Areas You Don't Paint:</strong> Measure the width and height of each window and door. Calculate their area and subtract it from your total wall area.</li>
              <li><strong>Account for Coats:</strong> Multiply the final painting area by the number of coats you plan to apply. Two coats is standard for good coverage.</li>
              <li><strong>Divide by Coverage:</strong> Check your paint can for its coverage rate (usually around 350-400 sq ft per gallon). Divide your total paint area by this number to find out how many gallons you need.</li>
            </ol>
            <p>Our calculator automates these steps, providing a quick and reliable estimate. Always consider buying a little extra paint to account for touch-ups and variations in surface texture, which can absorb more paint.</p>
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
