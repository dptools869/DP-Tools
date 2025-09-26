
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Textarea } from '@/components/ui/textarea';

const sampleText = `Reading is one of the most beneficial activities for the human mind. It enhances cognitive function, improves concentration, and expands vocabulary. Through reading, we can explore new worlds, understand different perspectives, and gain knowledge on virtually any subject. The act of processing written information strengthens neural pathways, which can help to keep the brain healthy and active, potentially delaying the onset of age-related cognitive decline. Furthermore, reading can be a profound source of relaxation and stress relief, offering an escape from the demands of daily life. Whether it's a classic novel, a scientific journal, or a daily newspaper, engaging with text stimulates imagination and critical thinking. The stories and information we consume shape our understanding of the world and our place within it. It’s a timeless habit that continues to offer immense rewards in an increasingly digital world, fostering empathy and connecting us to the vast tapestry of human experience across centuries.`;
const wordCount = sampleText.split(/\s+/).length;

export default function ReadingSpeedCalculatorPage() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimer(0);
    setWpm(null);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    if (timer > 0) {
      const minutes = timer / 60;
      const calculatedWpm = Math.round(wordCount / minutes);
      setWpm(calculatedWpm);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Timer className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Reading Speed Calculator (WPM)</CardTitle>
              <CardDescription className="text-lg">
                Measure your reading speed in Words Per Minute (WPM).
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Your Speed</CardTitle>
              <CardDescription>
                Click "Start" and read the passage below at your normal pace. Click "Stop" when you're finished.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2">Passage ({wordCount} words)</h4>
                    <p className="text-muted-foreground">{sampleText}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {!isRunning ? (
                        <Button onClick={startTimer} size="lg" className="w-full sm:w-auto">Start Timer</Button>
                    ) : (
                        <Button onClick={stopTimer} size="lg" variant="destructive" className="w-full sm:w-auto">Stop Timer</Button>
                    )}
                    <div className="text-3xl font-mono p-2 rounded-md bg-muted w-full sm:w-auto text-center">
                        {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                </div>

              {wpm !== null && (
                <div className="pt-6 text-center border-t mt-6 space-y-2">
                    <Label className="text-lg">Your Reading Speed</Label>
                    <div className="text-5xl font-bold text-primary">{wpm}</div>
                    <p className="text-muted-foreground">Words Per Minute (WPM)</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>What is Words Per Minute (WPM)?</h2>
            <p>Words Per Minute (WPM) is a measure of reading speed, commonly used to assess how quickly a person can read a text with a reasonable level of comprehension. It's calculated by dividing the number of words read by the time it took to read them in minutes.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How is WPM Calculated?</h3>
            <p>The formula is simple: <strong>WPM = (Total Words Read) / (Time in Minutes)</strong>. Our calculator automates this by providing a fixed passage of text and timing how long it takes you to read it.</p>
             <h3>Average Reading Speeds</h3>
            <ul>
              <li><strong>Average Adult:</strong> 200-250 WPM</li>
              <li><strong>College Student:</strong> Around 300 WPM</li>
              <li><strong>High-level Executives/Professors:</strong> 400-500 WPM</li>
              <li><strong>Speed Readers:</strong> Can exceed 1000 WPM, though comprehension may vary.</li>
            </ul>
            <p>Your reading speed can vary depending on the complexity of the material and your purpose for reading. Technical documents are often read more slowly than fiction. Use this tool to get a baseline for your reading speed and track your improvement over time!</p>
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
