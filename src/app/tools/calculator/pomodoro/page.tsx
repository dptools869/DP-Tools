
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Play, Pause, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const timeSettings: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function PomodoroClockPage() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(timeSettings[mode]);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset timer when mode changes, but only if it's not currently running.
    if (!isActive) {
      setTimeLeft(timeSettings[mode]);
    }
  }, [mode, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      toast({
        title: `Time's up!`,
        description: `Your ${mode === 'pomodoro' ? 'Pomodoro' : 'break'} session has ended.`,
      });
      // Automatically switch to the next appropriate mode
      if (mode === 'pomodoro') {
        setMode('shortBreak');
      } else {
        setMode('pomodoro');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timeSettings[mode]);
  };

  const handleModeChange = (newMode: string) => {
    setIsActive(false);
    setMode(newMode as Mode);
    setTimeLeft(timeSettings[newMode as Mode]);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Clock className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Pomodoro Clock</CardTitle>
              <CardDescription className="text-lg">
                Stay focused and manage your time effectively with the Pomodoro Technique.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                  <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                  <TabsTrigger value="longBreak">Long Break</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="my-10">
                <p className="text-8xl font-bold font-mono text-primary tabular-nums">
                  {formatTime(timeLeft)}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={toggleTimer} size="lg" className="px-10 py-6 text-xl w-36">
                  {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} size="lg" variant="outline" className="px-10 py-6 text-xl">
                  <RefreshCw className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Use the Pomodoro Clock</h2>
            <p>The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Our Pomodoro Clock helps you implement this technique to improve focus and reduce burnout.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The Basic Steps:</h3>
             <ol>
              <li><strong>Choose a Task:</strong> Decide on the task you want to work on.</li>
              <li><strong>Set the Timer:</strong> Select the "Pomodoro" tab (25 minutes) and click "Start".</li>
              <li><strong>Work on the Task:</strong> Focus solely on your task until the timer rings.</li>
              <li><strong>Take a Short Break:</strong> When the timer goes off, switch to the "Short Break" tab (5 minutes) and relax.</li>
              <li><strong>Repeat:</strong> After four Pomodoro sessions, take a longer break by switching to the "Long Break" tab (15-30 minutes).</li>
            </ol>
            <p>This simple cycle helps train your brain to focus for short periods and helps you stay on top of your tasks without feeling overwhelmed. Our tool includes an audible alert to notify you when each session ends, so you can stay in the zone without constantly checking the clock.</p>
          </article>

          <AdBanner type="bottom-banner" className="mt-12" />
        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto"></audio>
    </div>
  );
}
