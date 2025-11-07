
import type { Metadata } from 'next';
import { PasswordGeneratorClient } from './client';

export const metadata: Metadata = {
    title: 'Free Password Generator Online | Create Strong & Secure Passwords',
    description: 'Generate strong, random passwords instantly with our free online password generator. Secure, private, and customizable, protect your accounts today.',
    keywords: [
        'password generator',
        'random password generator',
        'password generator free',
        'strong password generator',
        'secure password generator',
        'strong password examples',
        'online password generator',
        'password generator words',
        'Examples of strong passwords',
        'password generator app'
    ]
};

export default function PasswordGeneratorPage() {
    return <PasswordGeneratorClient />;
}
