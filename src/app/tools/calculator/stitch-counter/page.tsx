
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

const YarnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M15.5 15.5c-2-2-5-2.5-7.5-1.5"/>
        <path d="M20 10c-.5-5-4.5-9-9.5-9"/>
        <path d="M4 14c.5 5 4.5 9 9.5 9"/>
        <path d="M16 4.5c-3 3-6 4-8.5 3.5"/>
        <path d="M8 19.5c3-3 6-4 8.5-3.5"/>
    </svg>
)


export default function StitchCounterPage() {
  const [stitchCount, setStitchCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <div className="w-10 h-10 text-primary">
                    <YarnIcon />
                </div>
              </div>
              <CardTitle className="text-3xl font-headline">Stitch & Row Counter</CardTitle>
              <CardDescription className="text-lg">
                A simple tool for knitters and crocheters to keep track of their work.
              </CardDescription>
            </CardHeader>
          </Card>

            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stitch Counter */}
                <div className="space-y-4 text-center p-6 rounded-lg bg-muted/50">
                    <Label className="text-xl font-bold">Stitch Counter</Label>
                    <div className="text-7xl font-bold text-primary tabular-nums">{stitchCount}</div>
                    <div className="flex justify-center gap-2">
                        <Button onClick={() => setStitchCount(c => c + 1)} size="lg" aria-label="Increase stitch count"><Plus /></Button>
                        <Button onClick={() => setStitchCount(c => Math.max(0, c - 1))} size="lg" variant="secondary" aria-label="Decrease stitch count"><Minus /></Button>
                        <Button onClick={() => setStitchCount(0)} size="lg" variant="destructive" aria-label="Reset stitch count"><RefreshCw /></Button>
                    </div>
                </div>

                {/* Row Counter */}
                <div className="space-y-4 text-center p-6 rounded-lg bg-muted/50">
                    <Label className="text-xl font-bold">Row Counter</Label>
                    <div className="text-7xl font-bold text-primary tabular-nums">{rowCount}</div>
                    <div className="flex justify-center gap-2">
                        <Button onClick={() => setRowCount(c => c + 1)} size="lg" aria-label="Increase row count"><Plus /></Button>
                        <Button onClick={() => setRowCount(c => Math.max(0, c - 1))} size="lg" variant="secondary" aria-label="Decrease row count"><Minus /></Button>
                        <Button onClick={() => setRowCount(0)} size="lg" variant="destructive" aria-label="Reset row count"><RefreshCw /></Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Never Lose Your Place Again</h2>
            <p>For any knitting or crochet enthusiast, keeping an accurate count of stitches and rows is fundamental to a successful project. Forgetting your place can lead to mistakes that are frustrating to fix. Our Stitch and Row Counter is a simple digital tool designed to help you keep track of your progress with ease, so you can focus on the creative part of your craft.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>How to Use the Counter</h3>
            <p>Our tool provides two separate counters, one for stitches and one for rows, allowing you to track both simultaneously.</p>
             <ul>
              <li><strong>Increment (+):</strong> Click the plus button every time you complete a stitch or a row to increase the count.</li>
              <li><strong>Decrement (-):</strong> Made a mistake or mis-clicked? The minus button lets you decrease the count.</li>
              <li><strong>Reset (&#x21bb;):</strong> Once you've finished a section or want to start over, the reset button will set the counter back to zero.</li>
            </ul>
            <p>This digital counter is a convenient alternative to physical click-counters, especially when you're working on a complex pattern. It's always here when you need it, right in your browser. Happy crafting!</p>
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
