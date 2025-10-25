
'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Disc, Trash2, Upload, Star, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import AdBanner from '@/components/ad-banner';
import { ScrollArea } from '@/components/ui/scroll-area';

const colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"];

interface Entry {
  id: number;
  text: string;
}

const MAX_ENTRIES = 50;
const MIN_ENTRIES = 2;

// SVG Path for a wedge
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = {
        x: x + radius * Math.cos(startAngle * Math.PI / 180),
        y: y + radius * Math.sin(startAngle * Math.PI / 180)
    };
    const end = {
        x: x + radius * Math.cos(endAngle * Math.PI / 180),
        y: y + radius * Math.sin(endAngle * Math.PI / 180)
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    // Round the values to prevent hydration errors from floating point discrepancies
    const round = (val: number) => Math.round(val * 1000) / 1000;

    return `M ${round(x)},${round(y)} L ${round(start.x)},${round(start.y)} A ${round(radius)},${round(radius)} 0 ${largeArcFlag} 1 ${round(end.x)},${round(end.y)} Z`;
};


export default function SpinWheelPage() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, text: 'Piyush' },
    { id: 2, text: 'Digital' },
    { id: 3, text: 'John' },
    { id: 4, text: 'Jane' },
    { id: 5, text: 'Alex' },
    { id: 6, text: 'Sarah' },
  ]);
  const [newEntryText, setNewEntryText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winner, setWinner] = useState<Entry | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  const handleAddEntry = () => {
    const text = newEntryText.trim();
    if (!text) return;
    if (entries.length >= MAX_ENTRIES) {
        toast({variant: 'destructive', title: 'Maximum entries reached'});
        return;
    }
    if(entries.some(e => e.text.toLowerCase() === text.toLowerCase())) {
        toast({variant: 'destructive', title: 'Duplicate entry'});
        return;
    }
    setEntries([...entries, { id: Date.now(), text }]);
    setNewEntryText('');
  };
  
  // Enter key handler to add entry
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddEntry();
      }
  }
  
  const removeEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  }

  const sectorAngle = 360 / Math.max(1, entries.length);

  const detectWinner = useCallback((finalRotation: number) => {
    const pointerAngle = 270;
    const normalizedRotation = (finalRotation % 360 + 360) % 360;
    const effectiveAngle = (360 + pointerAngle - normalizedRotation) % 360;
    const winnerIndex = Math.floor(effectiveAngle / sectorAngle);
    
    const selectedWinner = entries[winnerIndex];
    if (selectedWinner) {
      setWinner(selectedWinner);
    }
  }, [entries, sectorAngle]);

  const spinWheel = () => {
    if (isSpinning) return;
    if (entries.length < MIN_ENTRIES) {
      toast({
        variant: 'destructive',
        title: 'Not enough entries',
        description: `Please add at least ${MIN_ENTRIES} entries to spin the wheel.`,
      });
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    
    // Generates a large random rotation to ensure multiple spins
    const extraRotation = Math.floor(3600 + Math.random() * 3600);
    const duration = 5000; // 5 seconds spin
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      // Cubic ease-out for a smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3); 
      const rotation = currentRotation + extraRotation * easeOut;
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${rotation}deg)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalRotation = currentRotation + extraRotation;
        setCurrentRotation(finalRotation); // Keep track of the final position for subsequent spins
        setIsSpinning(false);
        detectWinner(finalRotation);
      }
    };

    requestAnimationFrame(animate);
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Disc className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Spin the Wheel</CardTitle>
              <CardDescription className="text-lg">
                Enter names, spin the wheel, and find a random winner!
              </CardDescription>
            </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col items-center justify-center relative">
            {/* Static Pointer */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'}}>
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-t-primary border-l-transparent border-r-transparent"></div>
            </div>
            
            <div 
              className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border-8 border-primary/50 shadow-2xl"
            >
              <div ref={wheelRef} className="w-full h-full">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {entries.map((entry, index) => {
                      const startAngle = sectorAngle * index - 90;
                      const endAngle = startAngle + sectorAngle;
                      const midAngle = startAngle + sectorAngle / 2;
                      const textRadius = 65;
                      const textX = 100 + textRadius * Math.cos(midAngle * Math.PI / 180);
                      const textY = 100 + textRadius * Math.sin(midAngle * Math.PI / 180);
                      
                      const isWinner = winner?.id === entry.id && !isSpinning;

                      return (
                        <g key={entry.id}>
                          <path
                            d={describeArc(100, 100, 100, startAngle, endAngle)}
                            fill={colors[index % colors.length]}
                            className={cn(isWinner && "animate-pulse")}
                          />
                           <text
                            x={Math.round(textX)}
                            y={Math.round(textY)}
                            transform={`rotate(${Math.round(midAngle + 90)}, ${Math.round(textX)}, ${Math.round(textY)})`}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="white"
                            fontSize="8"
                            fontWeight="bold"
                            className="pointer-events-none"
                           >
                            {entry.text.length > 12 ? entry.text.substring(0, 10) + '...' : entry.text}
                           </text>
                        </g>
                      );
                    })}
                  </svg>
              </div>
            </div>

            <Button onClick={spinWheel} disabled={isSpinning} size="lg" className="mt-8 text-2xl h-16 px-12 rounded-full font-bold">
              {isSpinning ? 'Spinning...' : 'SPIN'}
            </Button>
            {winner && !isSpinning && (
                <div className="mt-6 text-center animate-in fade-in zoom-in">
                    <p className="text-lg text-muted-foreground">The winner is:</p>
                    <p className="text-4xl font-bold text-primary">{winner.text}</p>
                </div>
            )}
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Entries ({entries.length}/{MAX_ENTRIES})</CardTitle>
              <CardDescription>Enter a name and press Enter or click Add.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newEntryText}
                  onChange={e => setNewEntryText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a new entry..."
                  disabled={isSpinning}
                />
                <Button onClick={handleAddEntry} disabled={isSpinning}><Plus/></Button>
              </div>
              <ScrollArea className="h-64 border rounded-md p-2">
                {entries.length > 0 ? (
                  <ul className="space-y-2">
                    {entries.map((entry) => (
                      <li key={entry.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                        <span className="truncate">{entry.text}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeEntry(entry.id)} disabled={isSpinning}>
                          <Trash2 className="w-4 h-4 text-destructive"/>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Add entries to begin.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" onClick={() => setEntries([])} disabled={entries.length === 0 || isSpinning}>
                    <Trash2 className="mr-2 h-4 w-4"/> Clear All Entries
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

       <AdBanner type="bottom-banner" className="mt-12" />
    </div>
  );
}

/**
 * README for Spin Wheel
 * 
 * - To change the number of sectors, add or remove entries in the input text area. The wheel supports a minimum of 2 and a maximum of 50 entries.
 * - To test the Enter-to-Add feature: Type a name in the input box and press the 'Enter' key. The name should appear on the wheel.
 * - To test the Spin-to-Win feature: Click the 'SPIN' button. The wheel will spin smoothly and a winner will be announced below. The winning wedge will also be highlighted.
 */

    

    