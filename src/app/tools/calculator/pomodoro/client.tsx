
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_CONFIG = {
  pomodoro: { seconds: 25 * 60, className: 'pomodoro-mode' },
  shortBreak: { seconds: 5 * 60, className: 'shortBreak-mode' },
  longBreak: { seconds: 15 * 60, className: 'longBreak-mode' },
};

export function PomodoroClockClient() {
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
    
    document.body.classList.remove('pomodoro-mode', 'shortBreak-mode', 'longBreak-mode');
    document.body.classList.add(MODE_CONFIG[modeKey].className);
  };
  
  useEffect(() => {
      document.body.classList.add(MODE_CONFIG.pomodoro.className);
      return () => {
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
          <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20 text-card-foreground hidden md:block">
            <CardHeader className="text-center">
              <div className="mx-auto bg-background/20 p-4 rounded-full w-fit mb-4">
                <Clock className="w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-headline">Pomodoro Clock</CardTitle>
              <CardDescription className="text-lg">
                Stay focused and manage your time effectively with the Pomodoro Technique.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20 text-card-foreground mt-8">
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

           <div className="prose prose-lg dark:prose-invert max-w-none text-center my-12 hidden md:block">
            <p>Unlocking Productivity: The Power of the Pomodoro Clock</p>
            <p>Staying productive in today’s fast-paced world is tougher than ever. Whether you’re a student preparing for exams, a professional managing tight deadlines, or someone balancing multiple responsibilities, maintaining focus is a real challenge.</p>
            <p>One simple yet highly effective tool that can completely transform your productivity is the Pomodoro Clock. In this guide, you’ll learn what a Pomodoro Clock is, how the Pomodoro Technique works, and how you can use it to improve your daily workflow.</p>
          </div>

          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none text-left">
            <h3>What Is a Pomodoro Clock?</h3>
            <p>A Pomodoro Clock (also known as a Pomodoro Timer or Tomato Timer) is a time-management tool built around the Pomodoro Technique, created by Francesco Cirillo in the late 1980s.</p>
            <p>The method breaks work into 25-minute focused sessions, followed by a 5-minute break. Each session is called a “Pomodoro”—named after the tomato-shaped timer Cirillo used as a university student.</p>
            <p>This simple structure helps you stay focused, reduces mental fatigue, and builds a consistent work rhythm.</p>

            <h3>How the Pomodoro Technique Works (Simple Guide)</h3>
            <ol>
                <li>Choose a task you want to focus on.</li>
                <li>Set the Pomodoro Clock to 25 minutes.</li>
                <li>Work with full concentration until the timer rings.</li>
                <li>Take a 5-minute break to relax and recharge.</li>
                <li>Repeat the cycle four times and then take a longer break of 15–30 minutes.</li>
            </ol>
            <p>This system prevents burnout, keeps your brain fresh, and encourages deep work.</p>

            <h3>Why Use a Pomodoro Clock? (Real Benefits)</h3>
            <p>Here are some research-backed advantages of using a Pomodoro Clock:</p>
            <ol>
                <li><strong>Better Focus & Concentration:</strong> Short, timed sessions train your mind to eliminate distractions and work deeply on a single task.</li>
                <li><strong>Improved Time Management:</strong> Breaking your day into clear segments gives you more control over your schedule.</li>
                <li><strong>Higher Productivity:</strong> Regular breaks prevent mental fatigue, helping you stay energized throughout the day.</li>
                <li><strong>Less Procrastination:</strong> Starting a 25-minute session feels easy, which is perfect for people who struggle to get started.</li>
                <li><strong>Great for Students & Professionals:</strong> Students can use it to study in focused bursts, while professionals can use it for emails, planning, writing, meetings, and creative work.</li>
            </ol>

            <h3>Key Features to Look for in a Pomodoro Clock</h3>
            <p>Whether you’re using a physical timer or a digital Pomodoro Clock, choose one that offers:</p>
            <ul>
                <li>Customizable Intervals</li>
                <li>Progress Tracking</li>
                <li>Alerts & Notifications</li>
                <li>Tool Integrations</li>
                <li>Clean, User-Friendly Design</li>
            </ul>

            <h3>How to Add the Pomodoro Clock to Your Daily Routine</h3>
            <h4>For Students</h4>
            <ul>
                <li>Break chapters into smaller study sessions</li>
                <li>Use the Pomodoro Clock to stay consistent</li>
                <li>Review your progress after every 4–6 Pomodoros</li>
            </ul>
            <h4>For Professionals</h4>
            <ul>
                <li>Use Pomodoros for emails, planning, writing, coding, and admin work</li>
                <li>Assign specific tasks to each session</li>
                <li>Avoid multitasking — focus on one task per Pomodoro</li>
            </ul>

            <h3>The Science Behind Why the Pomodoro Clock Works</h3>
            <p>Research shows that the human brain can maintain peak focus for around 20–45 minutes at a time. The Pomodoro Technique aligns perfectly with this natural attention cycle: short bursts help your brain stay alert, regular breaks prevent cognitive overload, focused intervals improve memory retention, and timeboxing reduces decision fatigue. This makes Pomodoro one of the most scientifically supported productivity methods.</p>

            <h3>Frequently Asked Questions (FAQ)</h3>
            <h4>1. What is a Pomodoro Clock?</h4>
            <p>A Pomodoro Clock is a timer used to follow the Pomodoro Technique, which involves 25 minutes of focused work followed by short breaks.</p>
            <h4>2. Does the Pomodoro Technique really work?</h4>
            <p>Yes. It reduces distractions, improves focus, and prevents burnout by balancing work and rest.</p>
            <h4>3. Why is it called a “Pomodoro”?</h4>
            <p>Pomodoro is Italian for “tomato.” The method’s creator used a tomato-shaped kitchen timer.</p>
            <h4>4. Can I change the Pomodoro intervals?</h4>
            <p>Absolutely. Many modern apps let you choose intervals like 40/10 or 52/17 based on your preference.</p>
            <h4>5. What tasks are best for Pomodoro?</h4>
            <p>Studying, writing, programming, reading, project work, exam preparation, and any task requiring deep focus.</p>

            <h3>Conclusion</h3>
            <p>The Pomodoro Clock is a simple yet powerful tool that can dramatically improve your focus, time management, and efficiency. Whether you’re studying, working, or managing a busy schedule, the technique helps you stay consistent, avoid burnout, and get more done in less time.</p>
            
            <h3>About the Author — Piyush (Digital Piyush)</h3>
            <p>Piyush is a full-stack developer and digital tools creator with 5+ years of hands-on experience building and user-testing productivity apps, timers, and workflow tools. He has tested dozens of Pomodoro timers, focus tools, and productivity systems to understand what truly helps users stay consistent and avoid burnout. Through DPToolsPro.com, he creates simple, fast, and reliable online tools designed to help people work smarter every day.</p>
          </article>
        </div>
      </div>
      <audio ref={alarmAudioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto"></audio>
    </div>
  );
}
