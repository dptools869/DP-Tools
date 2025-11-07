
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


export function PasswordStrengthClient() {
  const [password, setPassword] = useState('');
  const { score, label, color } = useMemo(() => getPasswordStrength(password), [password]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Password Strength Checker | Test Password Security</CardTitle>
              <CardDescription className="text-lg">
                Check your password strength instantly. Use our free Password Strength Checker to create secure passwords and keep your online accounts safe.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
              <h2>Check Your Password Security Instantly</h2>
              <p>Our free Password Strength Checker lets you evaluate your passwords for security vulnerabilities in just seconds. You can enter your password, and the tool will analyze its length and the types of characters used (lowercase letters, uppercase letters, numbers, special characters, etc.), then provide an instant, detailed security assessment to ensure hackers or unauthorized users do not steal your information.</p>
          </div>

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
            <h2>What Is a Password Strength Checker?</h2>
            <p>A password strength checker is a tool that evaluates your passwords for security vulnerabilities. It helps protect your personal data from hackers by identifying weak or repeated passwords. Our free password strength checker is designed for both individuals and professionals who need to instantly verify their access credentials.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>Why Use a Password Strength Checker?</h3>
            <p>The average citizen maintains dozens of online accounts: email and bank accounts, social media accounts, and shopping accounts. Using easy or repetitive passwords may compromise all your information. With weak passwords, hackers can crack them in a few seconds using automated tools.</p>
            <p>Our Password Strength Checker is the solution to that issue, as it evaluates your entire password set and identifies weaknesses that threaten modern security standards. Regardless of checking an existing account, updating credentials, or handling sensitive data, this tool can help you verify that your passwords are strong and hard to guess.</p>
            <h3>Here is the reason why users use our tool:</h3>
            <ul>
              <li><strong>Instant Analysis:</strong> The passwords are analyzed instantly to identify weaknesses and vulnerabilities.</li>
              <li><strong>Complete Security Assessment:</strong> Checks the length and evaluates certain types of characters according to modern security standards.</li>
              <li><strong>Instant Feedback:</strong> No waiting or signing up, type and check.</li>
              <li><strong>Complete Anonymity:</strong> All the operations are performed locally; no data is saved or shared.</li>
              <li><strong>Cross-Platform Compatibility:</strong> Works perfectly with desktops, tablets, and smartphones.</li>
            </ul>

            <h2>Password Strength Checker: How it Works.</h2>
            <p>Our free password strength checker uses a secure algorithm to analyze letters, numbers, and symbols.</p>
            <p>You can:</p>
            <ul>
                <li>Check 8-, 10-, or even longer-character passwords.</li>
                <li>Evaluate password strength by analyzing uppercase, lowercase, digits, and symbols.</li>
                <li>Get instant feedback on password security.</li>
            </ul>
            <p>Every password is analyzed locally in your browser, so no one—not even us—can access it.</p>
            
            <h3>Key Features;</h3>
            <ul>
                <li><strong>Real-Time Password Analysis:</strong> Evaluates your passwords instantly.</li>
                <li><strong>8 Character Password Checker:</strong> Perfect for analyzing passwords with short length limits.</li>
                <li><strong>Password Checker 10 Characters:</strong> Ideal for verifying stronger security.</li>
                <li><strong>Password Strength Evaluation:</strong> Comprehensive analysis of dictionary words and character combinations.</li>
                <li><strong>Free and Secure:</strong> No sign-up or download required.</li>
                <li><strong>Works Anywhere:</strong> Available on all devices and browsers.</li>
            </ul>

            <h3>Benefits of Using a Strong Password Strength Checker</h3>
            <ol>
                <li><strong>Prevents hacking:</strong> Strong password verification reduces the chance of brute-force attacks.</li>
                <li><strong>Saves time:</strong> Check passwords instantly without guessing.</li>
                <li><strong>Enhances privacy:</strong> Keeps all your accounts safe and separate.</li>
                <li><strong>Free forever:</strong> Use it unlimited times, no hidden fees.</li>
            </ol>
            
            <h2>Stay Safe with Strong Passwords</h2>
            <p>In the digital world you live in today, passwords should be protected as your first line of defense. Hackers can access a system the easiest with weak or reused passwords. Our Free Online Password Strength Checker is an application that evaluates the security, uniqueness, and customization of your passwords to help protect your information.</p>
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
