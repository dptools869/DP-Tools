
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy, RefreshCw, Shield } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const generatePassword = (options: any) => {
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        easyToSay: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
        easyToRead: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()',
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
    if (!password || password.length === 0) return 0;
    if (password.length > 8) score++;
    if (password.length > 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return (score / 6) * 100;
}


export function PasswordGeneratorClient() {
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
    
    useEffect(() => {
        handleGenerate();
    }, [options]);

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast({
                title: 'Password Copied!',
            });
        }
    };
    
    const isCustomSet = options.characterSet === 'all';

    const sections = [
        { name: "Facebook", title: "Facebook Password Generator" },
        { name: "Instagram", title: "Instagram Password Generator" },
        { name: "YouTube", title: "YouTube Password Generator" },
        { name: "Random", title: "Random Password Generator" }
    ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-8 hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Free Password Generator Online | Create Strong & Secure Passwords</CardTitle>
              <CardDescription className="text-lg">
                Generate strong, random passwords instantly with our free online password generator. Secure, private, and customizable, protect your accounts today.
              </CardDescription>
            </CardHeader>
          </Card>
          
           <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12 hidden md:block">
                <h2>Create Strong, Secure Passwords Instantly</h2>
                <p>Our Password Generator allows you to generate strong, unique passwords within seconds. You can select the password length of your choice, the type of characters to be used (lowercase letters, uppercase letters, numbers, special characters, etc.), and press the button "Generate." You will immediately be given a powerful password that will prevent hackers and unauthorized users from stealing your information.</p>
           </div>


          <Tabs defaultValue="Facebook" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              {sections.map(section => (
                <TabsTrigger key={section.name} value={section.name} className="py-2">{section.name}</TabsTrigger>
              ))}
            </TabsList>
            {sections.map(section => (
              <TabsContent key={section.name} value={section.name}>
                <Card>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
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
              </TabsContent>
            ))}
          </Tabs>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>What Is a Password Generator?</h2>
            <p>A password generator is a tool that creates strong, random passwords for your online accounts. It helps protect your personal data from hackers by avoiding weak or repeated passwords. Our free password generator is designed for both individuals and professionals who need secure access credentials in seconds.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Why Use a Password Generator?</h3>
            <p>The average citizen maintains dozens of online accounts: email and bank accounts, social media, and shops. Using easy or repetitive passwords may compromise all your information. With weak passwords, hackers can crack them in a few seconds using automated tools.</p>
            <p>Our Password Generator solves that issue by generating entirely random, complex passwords that violate modern security standards. Regardless of creating a new account, updating credentials, or handling sensitive data, this tool can help you generate strong, hard-to-guess passwords.</p>
            <h3>Here is the reason why users use our tool:</h3>
            <ul>
                <li><strong>Unbreakable Strength:</strong> The passwords created by this tool are almost impossible to crack, even by brute-force attacks.</li>
                <li><strong>Full Customization:</strong> Select the length and add or remove specific character types based on the site's requirements.</li>
                <li><strong>Instant Generation:</strong> No waiting or signing up, click and copy.</li>
                <li><strong>Complete Anonymity:</strong> All the operations are performed locally, and no data is saved or shared.</li>
                <li><strong>Cross-Platform Compatibility:</strong> Works perfectly with desktops, tablets, and smartphones.</li>
            </ul>
            <h3>Password Generator: How it Works.</h3>
            <p>Our strong password generator free tool uses a secure algorithm to combine letters, numbers, and symbols. You can:</p>
            <ul>
                <li>Generate 8-, 10-, or even longer-character passwords.</li>
                <li>Customize password strength by selecting uppercase, lowercase, digits, and symbols.</li>
                <li>Copy passwords instantly for easy use.</li>
            </ul>
            <p>Every password is generated locally in your browser, so no one—not even us—can access it.</p>
            <h3>Key Features;</h3>
            <ul>
                <li><strong>Random Password Generator:</strong> Creates truly random passwords.</li>
                <li><strong>8 Character Password Generator:</strong> Perfect for websites with short password limits.</li>
                <li><strong>Password Generator 10 Characters:</strong> Ideal for stronger security.</li>
                <li><strong>Password Generator Words:</strong> Option to include dictionary words for easy-to-remember combinations.</li>
                <li><strong>Free and Secure:</strong> No sign-up or download required.</li>
                <li><strong>Works Anywhere:</strong> Available on all devices and browsers.</li>
            </ul>
            <h3>Examples of Strong Passwords</h3>
            <p>Here are some strong 8-character password examples:</p>
            <ul>
                <li>Tg#7pL@9</li>
                <li>fW!9vQe2</li>
                <li>Yt6#rLp8</li>
            </ul>
            <p>And some 10-character password examples:</p>
            <ul>
                <li>Kp$92Xl#Tg</li>
                <li>nV4@zHt!Qm</li>
            </ul>
            <p>These follow best security practices, combining uppercase, lowercase letters, numbers, and special symbols.</p>
            <h3>Benefits of Using a Strong Password Generator</h3>
            <ul>
                <li><strong>Prevents hacking:</strong> Strong passwords reduce the chance of brute-force attacks.</li>
                <li><strong>Saves time:</strong> Generate passwords instantly without having to think.</li>
                <li><strong>Enhances privacy:</strong> Keeps all your accounts safe and separate.</li>
                <li><strong>Free forever:</strong> Use it unlimited times, no hidden fees.</li>
            </ul>
            <h3>Stay Safe with Strong Passwords</h3>
            <p>In the digital world you live in today, passwords should be protected as your first line of defense. Hackers can access a system easily with weak or reused passwords. Our Free Online Password Generator is an application that generates secure, unique, and customisable passwords to protect your information.</p>
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
