'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_CONFIG = {
  pomodoro: { seconds: 25 * 60, className: 'pomodoro-mode' },
  shortBreak: { seconds: 5 * 60, className: 'shortBreak-mode' },
  longBreak: { seconds: 15 * 60, className: 'longBreak-mode' },
};

export default function PomodoroClockPage() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [defaultSeconds, setDefaultSeconds] = useState(MODE_CONFIG.pomodoro.seconds);
  const [remainingSeconds, setRemainingSeconds] = useState(MODE_CONFIG.pomodoro.seconds);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimestampRef = useRef<number | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  
  const { toast } = useToast();

  const clearIntervalSafely = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleModeChange = (newMode: string) => {
    const modeKey = newMode as Mode;
    setMode(modeKey);
    const newSeconds = MODE_CONFIG[modeKey].seconds;
    setDefaultSeconds(newSeconds);
    clearIntervalSafely();
    setRemainingSeconds(newSeconds);
    setIsRunning(false);
    
    // Update body class
    document.body.classList.remove('pomodoro-mode', 'shortBreak-mode', 'longBreak-mode');
    document.body.classList.add(MODE_CONFIG[modeKey].className);
  };
  
  // Set initial body class
  useEffect(() => {
      document.body.classList.add(MODE_CONFIG.pomodoro.className);
      return () => { // Cleanup on unmount
           document.body.classList.remove('pomodoro-mode', 'shortBreak-mode', 'longBreak-mode');
      }
  }, []);


  useEffect(() => {
    return () => clearIntervalSafely();
  }, [clearIntervalSafely]);

  const startOrResume = () => {
    if (isRunning) return;
    if (intervalRef.current) clearIntervalSafely();

    endTimestampRef.current = Date.now() + remainingSeconds * 1000;
    intervalRef.current = setInterval(() => {
      const msLeft = Math.max(0, (endTimestampRef.current ?? 0) - Date.now());
      const secLeft = Math.round(msLeft / 1000);
      setRemainingSeconds(secLeft);

      if (secLeft <= 0) {
        clearIntervalSafely();
        setIsRunning(false);
        playAlarm();
        toast({
          title: `Time's up!`,
          description: `Your ${mode === 'pomodoro' ? 'Pomodoro' : 'break'} session has ended.`,
        });
        const nextMode = mode === 'pomodoro' ? 'shortBreak' : 'pomodoro';
        handleModeChange(nextMode);
      }
    }, 300);
    setIsRunning(true);
  };

  const pause = () => {
    if (!isRunning) return;
    const msLeft = Math.max(0, (endTimestampRef.current ?? 0) - Date.now());
    setRemainingSeconds(Math.round(msLeft / 1000));
    clearIntervalSafely();
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    clearIntervalSafely();
    setIsRunning(false);
    setRemainingSeconds(defaultSeconds);
  };
  
  const playAlarm = () => {
    if (alarmAudioRef.current) {
        alarmAudioRef.current.currentTime = 0;
        alarmAudioRef.current.play().catch(e => console.warn("Audio play failed:", e));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("transition-colors duration-500 ease-in-out min-h-screen py-12")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20 text-card-foreground">
            <CardHeader className="text-center">
              <div className="mx-auto bg-background/20 p-4 rounded-full w-fit mb-4">
                <Clock className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-headline">Pomodoro Clock</CardTitle>
              <CardDescription className="text-lg">
                Stay focused and manage your time effectively with the Pomodoro Technique.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-3 bg-background/20 tabs-list">
                  <TabsTrigger value="pomodoro" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground tabs-trigger">Pomodoro</TabsTrigger>
                  <TabsTrigger value="shortBreak" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground tabs-trigger">Short Break</TabsTrigger>
                  <TabsTrigger value="longBreak" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground tabs-trigger">Long Break</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="my-10">
                <p className="text-8xl font-bold font-mono tabular-nums">
                  {formatTime(remainingSeconds)}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={isRunning ? pause : startOrResume} size="lg" className="button-primary px-10 py-6 text-xl w-48 bg-card text-card-foreground hover:bg-card/90">
                  {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} size="lg" variant="outline" className="px-10 py-6 text-xl bg-card/50">
                  <RefreshCw className="mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <audio ref={alarmAudioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto"></audio>
    </div>
  );
}
