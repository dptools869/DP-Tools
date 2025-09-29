
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy, RefreshCw, Check, Shield } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const generatePassword = (options: any) => {
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        easyToSay: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
        easyToRead: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*()',
    };

    let characterPool = '';
    if (options.characterSet === 'all') {
        if (options.includeUppercase) characterPool += charSets.uppercase;
        if (options.includeLowercase) characterPool += charSets.lowercase;
        if (options.includeNumbers) characterPool += charSets.numbers;
        if (options.includeSymbols) characterPool += charSets.symbols;
    } else if(options.characterSet === 'easyToSay') {
        characterPool = charSets.easyToSay;
    } else { // easyToRead
        characterPool = charSets.easyToRead;
    }

    if (characterPool === '') return 'Select at least one character type.';

    let password = '';
    for (let i = 0; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    return password;
};

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return (score / 6) * 100;
}


export default function FacebookPasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [options, setOptions] = useState({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        characterSet: 'all'
    });
    const { toast } = useToast();

    const strength = useMemo(() => getPasswordStrength(password), [password]);

    const handleGenerate = () => {
        setPassword(generatePassword(options));
    };
    
    // Generate a password on initial load
    useState(() => {
        handleGenerate();
    });

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast({
                title: 'Password Copied!',
            });
        }
    };
    
    const isCustomSet = options.characterSet === 'all';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Facebook Password Generator</CardTitle>
              <CardDescription className="text-lg">
                Create strong, secure, and random passwords to protect your social media accounts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Your Secure Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Input value={password} readOnly className="text-2xl font-mono h-16 pr-24" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleGenerate}><RefreshCw className="w-5 h-5"/></Button>
                    <Button size="icon" onClick={handleCopy}><Copy className="w-5 h-5"/></Button>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Progress value={strength} />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{Math.round(strength)}% Strong</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="length">Password Length</Label>
                                <span className="text-lg font-bold">{options.length}</span>
                            </div>
                            <Slider id="length" value={[options.length]} onValueChange={([val]) => setOptions(o => ({...o, length: val}))} min={8} max={64} step={1} />
                        </div>
                        <div className="space-y-3">
                            <Label>Character Set</Label>
                            <RadioGroup value={options.characterSet} onValueChange={(val) => setOptions(o => ({...o, characterSet: val}))} className="flex gap-4">
                                <Label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex-1 justify-center">
                                    <RadioGroupItem value="all" id="set-all" />
                                    Custom
                                </Label>
                                <Label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex-1 justify-center">
                                    <RadioGroupItem value="easyToSay" id="set-easy" />
                                    Easy to Say
                                </Label>
                                <Label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex-1 justify-center">
                                    <RadioGroupItem value="easyToRead" id="set-readable" />
                                    Easy to Read
                                </Label>
                            </RadioGroup>
                            <p className="text-xs text-muted-foreground">"Easy to Say" avoids ambiguous characters like 'l' and '1'. "Easy to Read" avoids symbols that are hard to distinguish.</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <Label>Character Types (for Custom set)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="uppercase" checked={options.includeUppercase} onCheckedChange={(checked) => setOptions(o => ({...o, includeUppercase: !!checked}))} disabled={!isCustomSet} />
                                <Label htmlFor="uppercase" className={cn(!isCustomSet && 'text-muted-foreground')}>Uppercase (A-Z)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="lowercase" checked={options.includeLowercase} onCheckedChange={(checked) => setOptions(o => ({...o, includeLowercase: !!checked}))} disabled={!isCustomSet} />
                                <Label htmlFor="lowercase" className={cn(!isCustomSet && 'text-muted-foreground')}>Lowercase (a-z)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="numbers" checked={options.includeNumbers} onCheckedChange={(checked) => setOptions(o => ({...o, includeNumbers: !!checked}))} disabled={!isCustomSet}/>
                                <Label htmlFor="numbers" className={cn(!isCustomSet && 'text-muted-foreground')}>Numbers (0-9)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="symbols" checked={options.includeSymbols} onCheckedChange={(checked) => setOptions(o => ({...o, includeSymbols: !!checked}))} disabled={!isCustomSet}/>
                                <Label htmlFor="symbols" className={cn(!isCustomSet && 'text-muted-foreground')}>Symbols (!@#$...)</Label>
                            </div>
                        </div>
                     </div>
                 </div>
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>Why a Strong Password for Facebook Matters</h2>
            <p>Your Facebook account is a gateway to your personal life, photos, private messages, and connections. A weak password makes it an easy target for hackers, putting your identity and data at risk. Our Facebook Password Generator creates strong, random, and complex passwords that are incredibly difficult to guess or crack, providing a powerful defense for your digital life.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>What Makes a Password Strong?</h3>
             <ul>
              <li><strong>Length:</strong> Longer passwords are exponentially harder to crack. Aim for at least 16 characters. Our tool goes up to 64 for maximum security.</li>
              <li><strong>Complexity:</strong> A mix of uppercase letters, lowercase letters, numbers, and symbols creates a vast number of possibilities for a hacker to guess.</li>
              <li><strong>Randomness:</strong> Avoid using predictable patterns, personal information (like birthdays), or common words. A truly random password is the most secure.</li>
            </ul>
            <p>This tool empowers you to create passwords that meet all these criteria with a single click. While it's named for Facebook, the passwords it generates are perfect for any online account, from your email to your online banking. Protect yourself online by using a unique, strong password for every service.</p>
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
