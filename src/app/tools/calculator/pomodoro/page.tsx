
import type { Metadata } from 'next';
import { PomodoroClockClient } from './client';

export const metadata: Metadata = {
    title: 'Pomodoro Clock Guide: Boost Focus & Productivity Easily',
    description: 'Learn how to use the Pomodoro Clock to improve focus, avoid burnout, and manage your time better. Simple guide, expert tips, features, and recommended tools.',
    keywords: [
        'pomodoro clock',
        'pomodoro technique',
        'pomodoro timer',
        'productivity timer',
        'focus timer',
        'how to use pomodoro',
        'benefits of pomodoro technique',
        'timer for studying',
        'focus management methods',
        'work timer tool',
        'how to stay focused using pomodoro',
        'best pomodoro apps for students',
        'how long should a pomodoro be',
        'productivity methods for deep work',
        'time management tools for professionals',
    ]
};

export default function PomodoroClockPage() {
    return <PomodoroClockClient />;
}
