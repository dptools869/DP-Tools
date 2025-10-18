
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return { score: 0, label: 'Very Weak', color: 'bg-red-500' };

    // Score based on length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Score based on character types
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // symbols
    
    const percentage = (score / 7) * 100;

    if (score < 2) return { score: percentage, label: 'Very Weak', color: 'bg-red-500' };
    if (score < 4) return { score: percentage, label: 'Weak', color: 'bg-orange-500' };
    if (score < 6) return { score: percentage, label: 'Medium', color: 'bg-yellow-500' };
    if (score < 7) return { score: percentage, label: 'Strong', color: 'bg-blue-500' };
    return { score: 100, label: 'Very Strong', color: 'bg-green-500' };
};


export default function PasswordStrengthCheckerPage() {
  const [password, setPassword] = useState('');
  const { score, label, color } = useMemo(() => getPasswordStrength(password), [password]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Password Strength Checker</CardTitle>
              <CardDescription className="text-lg">
                Instantly analyze the strength of your password.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Check Your Password</CardTitle>
                <CardDescription>Enter a password to see how secure it is.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password-input">Password</Label>
                    <Input id="password-input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a password..." className="h-12 text-lg"/>
                </div>
                 <div className="space-y-3">
                    <Label>Strength</Label>
                    <Progress value={score} className="h-3" />
                    <p className={cn("text-lg font-bold text-center", color.replace('bg-', 'text-'))}>{label}</p>
                 </div>
              </CardContent>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>What Makes a Strong Password?</h2>
            <p>A strong password is your first line of defense against unauthorized access to your personal and financial information. Our Password Strength Checker analyzes your password based on several key criteria to give you an idea of its security.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Key Factors for Password Strength:</h3>
             <ul>
              <li><strong>Length:</strong> The longer the password, the better. Each additional character exponentially increases the time it would take to crack. Aim for at least 12-16 characters.</li>
              <li><strong>Complexity:</strong> A mix of character types is crucial. A strong password includes uppercase letters, lowercase letters, numbers, and symbols (e.g., !@#$%).</li>
              <li><strong>Unpredictability:</strong> Avoid using common words, dictionary terms, or personal information like your name, birthday, or address. The more random, the better.</li>
            </ul>
            <p>Our tool provides instant feedback as you type, helping you understand how to improve your password's strength. Remember to use a unique and strong password for every important online account.</p>
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
