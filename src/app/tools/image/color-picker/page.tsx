
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Copy } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Color conversion utilities
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const basicColors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#000000", "#FFFFFF", "#808080", "#FF6347", "#4682B4", "#32CD32"
];

function generateShades(hex: string, count = 10) {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];
    const shades = [];
    for (let i = 0; i < count; i++) {
        const factor = i / (count - 1); // 0 to 1
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        shades.push(rgbToHex(r, g, b));
    }
    return shades.reverse();
}

export default function ColorPickerPage() {
    const [color, setColor] = useState("#00C853");
    const { toast } = useToast();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard!",
            description: text,
        });
    };
    
    const rgb = useMemo(() => hexToRgb(color), [color]);
    const hsl = useMemo(() => rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null, [rgb]);
    const shades = useMemo(() => generateShades(color), [color]);
    
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            setColor(value);
        }
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Palette className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Advanced Color Picker</CardTitle>
              <CardDescription className="text-lg">
                Pick colors, get codes in any format, and explore palettes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="color-picker-input" className="sr-only">Color Picker</Label>
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`}}></div>
                        <Input
                            id="color-picker-input"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-48 h-48 p-0 border-none rounded-full cursor-pointer bg-transparent"
                            style={{'WebkitAppearance': 'none'}}
                        />
                    </div>
                     <div className="h-24 w-full rounded-lg border-2 border-border" style={{ backgroundColor: color }}></div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Color Codes</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                           <Label htmlFor="hex" className="w-16">HEX</Label>
                           <Input id="hex" value={color} onChange={handleHexChange} />
                           <Button variant="outline" size="icon" onClick={() => handleCopy(color)}><Copy className="w-4 h-4" /></Button>
                        </div>
                         <div className="flex items-center gap-2">
                           <Label htmlFor="rgb" className="w-16">RGB</Label>
                           <Input id="rgb" value={rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''} readOnly />
                           <Button variant="outline" size="icon" onClick={() => handleCopy(rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '')}><Copy className="w-4 h-4" /></Button>
                        </div>
                         <div className="flex items-center gap-2">
                           <Label htmlFor="hsl" className="w-16">HSL</Label>
                           <Input id="hsl" value={hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ''} readOnly />
                           <Button variant="outline" size="icon" onClick={() => handleCopy(hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '')}><Copy className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start p-6 bg-muted/50 rounded-b-lg">
                <div className="w-full mb-6">
                    <h3 className="text-xl font-bold mb-4">Basic Colors</h3>
                    <div className="flex flex-wrap gap-2">
                        {basicColors.map(c => (
                            <Button key={c} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: c}} onClick={() => setColor(c)} aria-label={c}></Button>
                        ))}
                    </div>
                </div>
                 <div className="w-full">
                    <h3 className="text-xl font-bold mb-4">Shades</h3>
                    <div className="flex flex-wrap gap-2">
                        {shades.map(shade => (
                             <Button key={shade} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: shade}} onClick={() => setColor(shade)} aria-label={shade}></Button>
                        ))}
                    </div>
                </div>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Mastering Color Selection</h2>
            <p>A color picker is an indispensable tool for designers, developers, and artists. It simplifies the process of selecting the perfect color for any project. Our Advanced Color Picker provides a comprehensive interface to explore colors, get their codes in multiple formats, and discover harmonious shades and palettes.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Understanding Color Formats</h3>
            <p>Our tool provides color codes in the most common web formats:</p>
             <ul>
              <li><strong>HEX:</strong> A hexadecimal representation of color, commonly used in CSS, HTML, and design software (e.g., #00C853).</li>
              <li><strong>RGB:</strong> Represents colors using the Red, Green, and Blue light model. Each value ranges from 0 to 255 (e.g., rgb(0, 200, 83)).</li>
              <li><strong>HSL:</strong> Represents colors using Hue, Saturation, and Lightness, which can be more intuitive for making adjustments (e.g., hsl(145, 100%, 39%)).</li>
            </ul>
            <p>With one-click copy functionality, you can quickly grab the exact code you need and paste it into your project. Whether you're designing a website, creating a graphic, or choosing a color scheme, our Advanced Color Picker gives you the control and information you need to make the right choice.</p>
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
