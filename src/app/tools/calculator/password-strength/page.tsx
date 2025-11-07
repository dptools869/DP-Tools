
import type { Metadata } from 'next';
import { PasswordStrengthClient } from './client';

export const metadata: Metadata = {
    title: 'Password Strength Checker | Test Password Security',
    description: 'Check your password strength instantly. Use our free Password Strength Checker to create secure passwords and keep your online accounts safe.',
    keywords: [
        'password security checker',
        'password strength checker',
        'password strength test',
        'strong password checker',
        'Check password strength',
        'Verify password strength',
        'password checker tool',
        'password safety checker',
        'password security test',
        'secure password checker'
    ]
};

export default function PasswordStrengthCheckerPage() {
    return <PasswordStrengthClient />;
}
