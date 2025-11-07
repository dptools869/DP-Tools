
'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Copy } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';

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
        const factor = i / (count - 1);
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        tints.push(rgbToHex(r, g, b));
    }
    return tints;
}


export function ColorPickerClient() {
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

                // This sets the main color for the gradient.
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(0, 0, width, height);

                // This creates the white-to-transparent overlay.
                const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
                whiteGradient.addColorStop(0, 'rgba(255,255,255,1)');
                whiteGradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = whiteGradient;
                ctx.fillRect(0, 0, width, height);
                
                // This creates the black-to-transparent overlay.
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
        // Calculate pointer position relative to the canvas, clamped between 0 and canvas dimensions
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        const ctx = canvas.getContext('2d');
        if(ctx) {
            // Get color data from the exact pixel on the canvas
            const imageData = ctx.getImageData(x * (canvas.width / rect.width), y * (canvas.height / rect.height), 1, 1).data;
            const { h, s, l } = rgbToHsl(imageData[0], imageData[1], imageData[2]);
            // Only update saturation and lightness from the picker to avoid hue shifts at the edges
            setSaturation(s);
            setLightness(l);
        }
    }, [setSaturation, setLightness]);
    
    // Using Pointer events for unified mouse/touch handling. This is the core fix for the cursor jump issue.
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = true;
        // Capture pointer events to ensure smooth dragging even if the cursor leaves the canvas.
        e.currentTarget.setPointerCapture(e.pointerId);
        updateColorFromPosition(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if(isDraggingRef.current) {
            // Prevent default browser actions like scrolling on mobile while dragging.
            e.preventDefault();
            updateColorFromPosition(e);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingRef.current = false;
        // Release pointer capture when dragging ends.
        e.currentTarget.releasePointerCapture(e.pointerId);
    };
    
    // Calculate cursor position for the UI
    const saturationPosition = saturation / 100;
    const lightnessPosition = 1 - (lightness / 100);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Palette className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Color Picker - Find and Copy the Perfect Colour Instantly</CardTitle>
              <CardDescription className="text-lg">
                Your complete color toolkit for designing, web, and creative projects.
              </CardDescription>
            </CardHeader>
          </Card>

          <p className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
            DP Tools' Color Picker tool helps creators, designers, and developers easily match and find precise colors. Whether you're building a website, designing a logo, or editing a photo, it delivers accurate results quickly and effortlessly in seconds.
          </p>

          <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center gap-4">
                     <div
                        className="w-full h-52 relative cursor-crosshair focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                        // `touch-action: none` prevents the browser from hijacking touch gestures (like for scrolling),
                        // which is critical for smooth dragging on mobile devices.
                        style={{ touchAction: 'none' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp} // Also end drag if event is cancelled
                        role="slider"
                        aria-label="Color saturation and lightness picker"
                     >
                        <canvas ref={saturationCanvasRef} width={300} height={200} className="w-full h-full rounded-md border" />
                         {/* The circular cursor that follows the user's pointer */}
                         <div
                            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${saturationPosition * 100}%`,
                                top: `${lightnessPosition * 100}%`,
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
                        {basicColors.map((c, index) => (
                            <Button key={`${c}-${index}`} className="w-10 h-10 rounded-full p-0 border-2 border-border" style={{backgroundColor: c}} onClick={() => handleHexChange({ target: { value: c } } as React.ChangeEvent<HTMLInputElement>)} aria-label={c}></Button>
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
            <p>All you have to do is select a shade by using the palette. After this, you will be able to see the relevant HEX, RGB, and HSL codes of any color.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h2>How Does Our Color Palette Generator Work?</h2>
            <p>Our tool is the universal translator for colors. You see a color your eyes can see, but we provide the exact color in every language that matters.</p>
            <p>The tool offers an easy interface for identifying and converting colors instantly. After choosing a color, the system will automatically apply the correct color codes in web design, graphic projects, and digital platforms.</p>
            <h3>Here’s what you get:</h3>
            <p>You can pick a color by clicking anywhere on the gradient or use the sliders to make small changes. If you already have a color code, you can type it in to find colors automatically.</p>
            <h3>Get Every Format Instantly</h3>
            <p>When you choose a color, you’ll see its HEX code for websites, RGB values for digital designs, HSL values for color adjustments, and CMYK for printing. Everything updates right away with accurate results.</p>
            <h3>One-Click Copy</h3>
            <p>Want to use the color somewhere else? Just press the copy button next to the format you need, and it will be ready to paste into your design tool, website, or any other place.</p>
            <h2>Why Use a Color Matching Tool?</h2>
            <p>A Color Picker should be a great tool to have when dealing with visuals. It helps you to be consistent and accurate throughout your projects.</p>
            <h3>Here’s how it helps:</h3>
            <ul>
                <li><strong>Design Consistency:</strong> You can easily and exactly match the colors of your brand or UI designs.</li>
                <li><strong>Quick Web Development:</strong> Get the correct color code, CSS, or HTML.</li>
                <li><strong>Creative Inspiration:</strong> Find new colors and save them for your future project.</li>
                <li><strong>Quick Adjustments:</strong> Modify and change colors in real time to make your project even more precise.</li>
            </ul>
            <p>If you are a designer, marketer, hobbyist, or any other user, it is easy to find and use the best color code finder at any time, as our online color picker is free and user-friendly.</p>
            <h3>Safe, Simple, and Fast</h3>
            <p>No download or registration required. All you have to do is simply open our online color picker tool and start choosing colors. All your work is safe and confidential here.</p>
            <h3>Try Out Different Shades</h3>
            <p>With this tool, you can test colors side by side and see what fits best. It helps you understand how colors look on different screens or backgrounds.</p>
            <p>If you’re unsure which color to use, just try a few. Mix light and dark, warm and cool.</p>
            <p>You’ll quickly see what feels right for your design. The live preview shows you what each color will look like before you use it.</p>
            <h2>Free Color Picker Online - Start Picking Colors Now</h2>
            <p>Colors tell stories. They shape how people feel when they see your work. Using the right shades can make a design friendly, attractive, or calm.</p>
            <p>Our free tool helps you explore endless tones and discover fresh combinations. You don’t have to be a pro to use it, just experiment and see what fits your needs.</p>
            <p>It’s simple and made for anyone who loves creating. Try blending different colors to find what feels right for your project. Sometimes, the slightest shade change can make the most significant difference.</p>
            <p>So you are just one click away from finding your own perfect shade. Choose color codes with the free Color Picker, and make your projects even more precise.</p>
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
