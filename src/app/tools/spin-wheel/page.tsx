
'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Disc, Trash2, Upload, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import AdBanner from '@/components/ad-banner';

const colors = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722"];

interface Entry {
  id: number;
  text: string;
  image?: string;
}

export default function SpinWheelPage() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, text: 'Piyush' },
    { id: 2, text: 'Digital' },
    { id: 3, text: 'John' },
    { id: 4, text: 'Jane' },
    { id: 5, text: 'Alex' },
    { id: 6, text: 'Sarah' },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Entry | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    const newEntries = lines.map((line, index) => ({
      id: index + 1,
      text: line.trim(),
    }));
    setEntries(newEntries);
  };
  
  const spinWheel = () => {
    if (entries.length < 2) {
      toast({
        variant: 'destructive',
        title: 'Not enough entries',
        description: 'Please add at least two entries to spin the wheel.',
      });
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    const newRotation = rotation + 3600 + Math.random() * 360; // Spin multiple times + random amount
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wheel = wheelRef.current;
      if (wheel) {
        const currentRotation = newRotation % 360;
        const segmentAngle = 360 / entries.length;
        const pointerAngle = 270; // The pointer is at the top (270 degrees)
        const winningSegmentIndex = Math.floor(((360 - currentRotation + pointerAngle) % 360) / segmentAngle);
        setWinner(entries[winningSegmentIndex]);
      }
    }, 5000); // Corresponds to the transition duration in CSS
  };

  const segmentAngle = 360 / Math.max(1, entries.length);

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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-16 border-t-primary border-l-transparent border-r-transparent z-10"></div>
            <div 
              ref={wheelRef}
              className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border-8 border-primary/50 shadow-2xl transition-transform duration-5000 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {entries.map((entry, index) => {
                const angle = segmentAngle * index;
                const backgroundColor = colors[index % colors.length];
                return (
                  <div 
                    key={entry.id}
                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`
                    }}
                  >
                    <div 
                      className="absolute w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor,
                        transform: `rotate(${segmentAngle / 2}deg) translate(-25%, -25%)`,
                        clipPath: 'none'
                      }}
                    >
                      <span className="text-white font-bold text-xs sm:text-base break-words text-center px-2">{entry.text}</span>
                    </div>
                  </div>
                );
              })}
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
              <CardTitle>Entries</CardTitle>
              <CardDescription>Enter one name per line. You need at least two.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={entries.map(e => e.text).join('\n')}
                onChange={handleTextChange}
                rows={10}
                placeholder="Enter names here, one per line..."
              />
            </CardContent>
             <CardFooter className="flex-col items-start gap-4">
                <div className="text-sm text-muted-foreground">
                    Note: Image uploads are not yet supported in this version.
                </div>
                <Button variant="outline" onClick={() => setEntries([])} disabled={entries.length === 0}>
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
