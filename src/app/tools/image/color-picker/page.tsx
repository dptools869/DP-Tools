
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
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

function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n:number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n:number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
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
        const factor = i / (count - 1);
        const r = Math.round(rgb.r * (1 - factor));
        const g = Math.round(rgb.g * (1 - factor));
        const b = Math.round(rgb.b * (1 - factor));
        shades.push(rgbToHex(r, g, b));
    }
    return shades;
}

function generateTints(hex: string, count = 10) {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];
    const tints = [];
    for (let i = 0; i < count; i++) {
        const factor = i / (count-1);
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        tints.push(rgbToHex(r, g, b));
    }
    return tints;
}


export default function ColorPickerPage() {
    const [hue, setHue] = useState(145);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(39);
    const isDraggingRef = useRef(false);
    
    const { toast } = useToast();

    const color = useMemo(() => {
        const {r,g,b} = hslToRgb(hue, saturation, lightness);
        return rgbToHex(r,g,b);
    }, [hue, saturation, lightness]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard!",
            description: text,
        });
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            const rgb = hexToRgb(value);
            if (rgb) {
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                setHue(hsl.h);
                setSaturation(hsl.s);
                setLightness(hsl.l);
            }
        }
    }
    
    const rgb = useMemo(() => hexToRgb(color), [color]);
    const hsl = useMemo(() => ({h: hue, s: saturation, l: lightness}), [hue, saturation, lightness]);
    const tints = useMemo(() => generateTints(color), [color]);
    const shades = useMemo(() => generateShades(color), [color]);
    
    const saturationCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = saturationCanvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const width = canvas.width;
                const height = canvas.height;

                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(0, 0, width, height);

                const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
                whiteGradient.addColorStop(0, 'rgba(255,255,255,1)');
                whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = whiteGradient;
                ctx.fillRect(0, 0, width, height);
                
                const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
                blackGradient.addColorStop(0, 'rgba(0,0,0,0)');
                blackGradient.addColorStop(1, 'rgba(0,0,0,1)');
                ctx.fillStyle = blackGradient;
                ctx.fillRect(0, 0, width, height);
            }
        }
    }, [hue]);

    const updateColorFromPosition = useCallback((e: PointerEvent | React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = saturationCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        // Calculate pointer position relative to the canvas
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        const ctx = canvas.getContext('2d');
        if(ctx) {
            const imageData = ctx.getImageData(x * (canvas.width / rect.width), y * (canvas.height / rect.height), 1, 1).data;
            const { h, s, l } = rgbToHsl(imageData[0], imageData[1], imageData[2]);
            // Only update saturation and lightness to avoid hue shifts near white/black
            setSaturation(s);
            setLightness(l);
        }
    }, [setSaturation, setLightness]);
    
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = true;
        // Capture the pointer to ensure events are received even if the pointer moves off the element
        e.currentTarget.setPointerCapture(e.pointerId);
        updateColorFromPosition(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if(isDraggingRef.current) {
            // Prevent default browser actions like scrolling on mobile
            e.preventDefault();
            updateColorFromPosition(e);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = false;
        // Release the pointer capture
        e.currentTarget.releasePointerCapture(e.pointerId);
    };
    
    const saturationValue = saturation / 100;
    const lightnessValue = 1 - (lightness / 100);

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
                     <div
                        className="w-full h-52 relative cursor-crosshair focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                        // This style is critical to prevent the browser from hijacking touch events for scrolling or zooming.
                        style={{ touchAction: 'none' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        role="slider"
                        aria-label="Color saturation and lightness picker"
                     >
                        <canvas ref={saturationCanvasRef} width={300} height={200} className="w-full h-full rounded-md border" />
                         <div
                            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${saturationValue * 100}%`,
                                top: `${lightnessValue * 100}%`,
                                backgroundColor: color,
                            }}
                        />
                     </div>
                     <div className="w-full space-y-2">
                        <Label htmlFor="hue-slider">Hue</Label>
                        <Input id="hue-slider" type="range" min="0" max="360" value={hue} onChange={(e) => setHue(parseInt(e.target.value))} className="w-full h-2 p-0 rounded-lg appearance-none cursor-pointer" style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'}} />
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
              <CardFooter className="flex-col items-start p-6 bg-muted/50 rounded-b-lg space-y-6">
                <div className="w-full">
                    <h3 className="text-xl font-bold mb-4">Basic Colors</h3>
                    <div className="flex flex-wrap gap-2">
                        {basicColors.map(c => (
                            <Button key={c} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: c}} onClick={() => handleHexChange({ target: { value: c } } as React.ChangeEvent<HTMLInputElement>)} aria-label={c}></Button>
                        ))}
                    </div>
                </div>
                 <div className="w-full">
                    <h3 className="text-xl font-bold mb-4">Tints</h3>
                    <div className="flex flex-wrap gap-2">
                        {tints.map((tint, index) => (
                             <Button key={`tint-${index}-${tint}`} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: tint}} onClick={() => handleHexChange({ target: { value: tint } } as React.ChangeEvent<HTMLInputElement>)} aria-label={tint}></Button>
                        ))}
                    </div>
                </div>
                <div className="w-full">
                    <h3 className="text-xl font-bold mb-4">Shades</h3>
                    <div className="flex flex-wrap gap-2">
                        {shades.map((shade, index) => (
                             <Button key={`shade-${index}-${shade}`} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: shade}} onClick={() => handleHexChange({ target: { value: shade } } as React.ChangeEvent<HTMLInputElement>)} aria-label={shade}></Button>
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
