
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Copy, Download, Star, Trash2, Settings, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Generator logic
const vowels = "aeiou";
const consonants = "bcdfghjklmnpqrstvwxyz";

const creativeSuffixes = ["ster", "meister", "zilla", "nator", "inator", "tron", "o-rama", "omatic", "ify", "ish"];
const cuteSuffixes = ["ie", "y", "sy", "-boo", "-bear", "-pie", "let", "kins"];
const coolPrefixes = ["Shadow", "Cyber", "Night", "Venom", "General", "Captain", "Major"];
const coolSuffixes = ["Blade", "Strike", "Fury", "Fang", "Storm", "Pulse", "Byte"];

const generateNicknames = (name: string, options: any) => {
    if (!name) return [];

    let results = new Set<string>();
    const lowerName = name.toLowerCase();

    // Basic variations
    results.add(name);
    results.add(lowerName);
    results.add(name.toUpperCase());

    // Short names
    if(options.modes.includes('short')){
        if(name.length > 2) results.add(name.substring(0, 2));
        if(name.length > 3) results.add(name.substring(0, 3));
    }
    
    // Cute names
    if(options.modes.includes('cute')){
        results.add(name + cuteSuffixes[Math.floor(Math.random() * cuteSuffixes.length)]);
        results.add(name + cuteSuffixes[Math.floor(Math.random() * cuteSuffixes.length)]);
    }

    // Cool/Gamer names
    if(options.modes.includes('cool')){
        results.add(coolPrefixes[Math.floor(Math.random() * coolPrefixes.length)] + name);
        results.add(name + coolSuffixes[Math.floor(Math.random() * coolSuffixes.length)]);
        results.add(name.replace(/[aA]/g, '4').replace(/[eE]/g, '3').replace(/[oO]/g, '0'));
    }

    // Creative/Random
    if(options.modes.includes('creative')){
        results.add(name + creativeSuffixes[Math.floor(Math.random() * creativeSuffixes.length)]);
        let reversed = name.split('').reverse().join('');
        results.add(reversed.charAt(0).toUpperCase() + reversed.slice(1));
    }
    
    // Filter and format
    let finalResults = Array.from(results);

    if (options.includeNumbers) {
        const withNumbers = finalResults.map(n => n + Math.floor(Math.random() * 100));
        finalResults = [...finalResults, ...withNumbers];
    }
    
    finalResults = finalResults.map(n => {
        if (options.useHyphen) return n.replace(/\s+/g, '-');
        return n;
    });

    finalResults = finalResults.filter(n => n.length >= options.minLength && n.length <= options.maxLength);

    if (options.startsWith) {
        finalResults = finalResults.filter(n => n.toLowerCase().startsWith(options.startsWith.toLowerCase()));
    }
    if (options.endsWith) {
        finalResults = finalResults.filter(n => n.toLowerCase().endsWith(options.endsWith.toLowerCase()));
    }

    return Array.from(new Set(finalResults)).slice(0, 200); // Return unique names, max 200
}


export function NicknameGeneratorClient() {
    const [baseName, setBaseName] = useState('');
    const [nicknames, setNicknames] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [options, setOptions] = useState({
        minLength: 3,
        maxLength: 15,
        includeNumbers: true,
        useHyphen: false,
        startsWith: '',
        endsWith: '',
        modes: ['creative', 'cool', 'cute', 'short']
    });
    
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('nicknameFavorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Could not parse favorites from localStorage", error);
        }
    }, []);
    
    const handleGenerate = () => {
        if(!baseName.trim()){
            toast({
                variant: 'destructive',
                title: 'Input Required',
                description: 'Please enter a name to generate nicknames.'
            })
            return;
        }
        const generated = generateNicknames(baseName, options);
        setNicknames(generated);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `Copied "${text}" to clipboard!` });
    };

    const handleCopyAll = () => {
        const textToCopy = nicknames.join('\n');
        navigator.clipboard.writeText(textToCopy);
        toast({ title: 'Copied all nicknames to clipboard!' });
    };

    const downloadTxt = () => {
        const textToCopy = nicknames.join('\n');
        const blob = new Blob([textToCopy], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}-nicknames.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    const toggleFavorite = (nickname: string) => {
        let updatedFavorites: string[];
        if(favorites.includes(nickname)){
            updatedFavorites = favorites.filter(fav => fav !== nickname);
        } else {
            updatedFavorites = [...favorites, nickname];
        }
        setFavorites(updatedFavorites);
        try {
            localStorage.setItem('nicknameFavorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error("Could not save favorites to localStorage", error);
            toast({variant: 'destructive', title: 'Could not save favorites.'});
        }
    }

    const modeOptions = [
        { id: 'creative', label: 'Creative' },
        { id: 'cool', label: 'Cool/Gamer' },
        { id: 'cute', label: 'Cute' },
        { id: 'short', label: 'Short' },
    ];
    
    const handleModeChange = (modeId: string) => {
        setOptions(prev => {
            const newModes = prev.modes.includes(modeId) 
                ? prev.modes.filter(m => m !== modeId)
                : [...prev.modes, modeId];
            return { ...prev, modes: newModes };
        });
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <main className="lg:col-span-3">
                    <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <UserPlus className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Free Nickname Generator Online | Create Unique & Cool Nicknames</CardTitle>
                            <CardDescription className="text-lg">
                                Generate unique, cool, and creative nicknames instantly with our free nickname generator. Perfect for games, social media, and online profiles. Try it now!
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Controls */}
                        <div className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/> Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                     <div className="space-y-2">
                                        <Label htmlFor="baseName">Enter Name</Label>
                                        <Input id="baseName" placeholder="e.g., Alexander" value={baseName} onChange={e => setBaseName(e.target.value)} />
                                    </div>
                                    <div className="space-y-4">
                                        <Label>Nickname Styles</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {modeOptions.map(mode => (
                                                <Button key={mode.id} variant={options.modes.includes(mode.id) ? 'default' : 'outline'} onClick={() => handleModeChange(mode.id)} size="sm">
                                                    {mode.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Length: {options.minLength} - {options.maxLength} chars</Label>
                                        <Slider value={[options.minLength, options.maxLength]} onValueChange={([min, max]) => setOptions(o => ({...o, minLength: min, maxLength: max}))} min={2} max={20} step={1}/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startsWith">Starts With</Label>
                                            <Input id="startsWith" value={options.startsWith} onChange={e => setOptions({...options, startsWith: e.target.value})} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="endsWith">Ends With</Label>
                                            <Input id="endsWith" value={options.endsWith} onChange={e => setOptions({...options, endsWith: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="includeNumbers" checked={options.includeNumbers} onCheckedChange={checked => setOptions({...options, includeNumbers: checked})} />
                                        <Label htmlFor="includeNumbers">Include Numbers</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="useHyphen" checked={options.useHyphen} onCheckedChange={checked => setOptions({...options, useHyphen: checked})} />
                                        <Label htmlFor="useHyphen">Use Hyphens</Label>
                                    </div>
                                     <Button onClick={handleGenerate} className="w-full" size="lg">Generate</Button>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Results */}
                        <div className="md:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Generated Nicknames</CardTitle>
                                        <div className="flex gap-2">
                                             <Button variant="outline" size="sm" onClick={handleCopyAll} disabled={nicknames.length === 0}>
                                                <Copy className="mr-2 h-4 w-4"/> Copy All
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={downloadTxt} disabled={nicknames.length === 0}>
                                                <Download className="mr-2 h-4 w-4"/> Download .txt
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] border rounded-md p-4">
                                        {nicknames.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                {nicknames.map(nick => (
                                                    <div key={nick} className="group relative">
                                                        <Card className="p-2 text-center truncate cursor-pointer hover:bg-muted">
                                                            {nick}
                                                        </Card>
                                                         <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(nick)}><Copy className="w-3 h-3"/></Button>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleFavorite(nick)}>
                                                                <Star className={cn("w-3 h-3", favorites.includes(nick) ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")}/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center h-full text-muted-foreground">
                                                <p>Your generated nicknames will appear here.</p>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {favorites.length > 0 && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400"/> Your Favorites</CardTitle>
                            </CardHeader>
                             <CardContent className="flex flex-wrap gap-2">
                                {favorites.map(fav => (
                                     <div key={fav} className="group relative">
                                        <Card className="p-2 text-center truncate cursor-pointer bg-primary/10">
                                            {fav}
                                        </Card>
                                         <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(fav)}><Copy className="w-3 h-3"/></Button>
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleFavorite(fav)}>
                                                <Trash2 className="w-3 h-3 text-destructive"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                             </CardContent>
                        </Card>
                    )}

                    <AdBanner type="bottom-banner" className="mt-12" />
                </main>
                
                <aside className="space-y-8 lg:sticky top-24 self-start">
                    <AdBanner type="sidebar" />
                    <article className="prose prose-sm dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-xl prose-h2:text-primary prose-a:text-primary">
                        <h2>How to Generate Nicknames</h2>
                        <p>Our tool helps you brainstorm creative and unique nicknames. Just enter a name, choose your preferred styles and options, and hit "Generate" to see a list of ideas.</p>
                        <h3>Tips for a Good Nickname</h3>
                        <ul>
                            <li><strong>Keep it simple:</strong> The best nicknames are often short and easy to remember.</li>
                            <li><strong>Be creative:</strong> Combine parts of the name with fun prefixes or suffixes.</li>
                            <li><strong>Consider the context:</strong> A nickname for a gaming profile might be different from a professional one.</li>
                        </ul>
                    </article>
                </aside>
            </div>
        </div>
    );
}
