
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, RefreshCw, ListChecks, Check, Trash2, Plus, NotepadText } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODE_CONFIG = {
  pomodoro: { seconds: 25 * 60, className: 'bg-red-500/90' },
  shortBreak: { seconds: 5 * 60, className: 'bg-blue-500/90' },
  longBreak: { seconds: 15 * 60, className: 'bg-indigo-900/90' },
};

interface Task {
  id: number;
  title: string;
  notes: string;
  estimate: number;
  completed: boolean;
}

export default function PomodoroClockPage() {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [defaultSeconds, setDefaultSeconds] = useState(MODE_CONFIG.pomodoro.seconds);
  const [remainingSeconds, setRemainingSeconds] = useState(MODE_CONFIG.pomodoro.seconds);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimestampRef = useRef<number | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  
  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskEstimate, setTaskEstimate] = useState('1');


  const { toast } = useToast();

  const clearIntervalSafely = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    const newSeconds = MODE_CONFIG[mode].seconds;
    setDefaultSeconds(newSeconds);
    clearIntervalSafely();
    setRemainingSeconds(newSeconds);
    setIsRunning(false);
  }, [mode, clearIntervalSafely]);

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
        handleModeChange(mode === 'pomodoro' ? 'shortBreak' : 'pomodoro');
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
  
  const handleModeChange = (newMode: string) => {
    setMode(newMode as Mode);
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

  // --- Task Logic ---
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('pomodoroTasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error("Failed to load tasks from local storage", e);
    }
  }, []);

  const saveTasksToLocalStorage = (newTasks: Task[]) => {
    try {
      localStorage.setItem('pomodoroTasks', JSON.stringify(newTasks));
    } catch (e) {
      console.error("Failed to save tasks to local storage", e);
    }
  };

  const addTask = () => {
    if (!taskTitle.trim()) {
      toast({ variant: 'destructive', title: 'Task title is required.' });
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      title: taskTitle.trim(),
      notes: taskNotes.trim(),
      estimate: parseInt(taskEstimate, 10),
      completed: false,
    };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
    setTaskTitle('');
    setTaskNotes('');
    setTaskEstimate('1');
  };
  
  const deleteTask = (id: number) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };
  
  const toggleTaskCompletion = (id: number) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasksToLocalStorage(newTasks);
  };

  return (
    <div className={cn(
      "transition-colors duration-500 ease-in-out min-h-screen py-12",
      MODE_CONFIG[mode].className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
                <TabsList className="grid w-full grid-cols-3 bg-background/20">
                  <TabsTrigger value="pomodoro" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground">Pomodoro</TabsTrigger>
                  <TabsTrigger value="shortBreak" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground">Short Break</TabsTrigger>
                  <TabsTrigger value="longBreak" className="data-[state=active]:bg-card data-[state=active]:text-card-foreground">Long Break</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="my-10">
                <p className="text-8xl font-bold font-mono tabular-nums">
                  {formatTime(remainingSeconds)}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={isRunning ? pause : startOrResume} size="lg" className="px-10 py-6 text-xl w-48 bg-card text-card-foreground hover:bg-card/90">
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
          
          <Card className="mt-8 shadow-2xl bg-card/80 backdrop-blur-sm border-border/20 text-card-foreground">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ListChecks /> Task Manager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="task-title">New Task</Label>
                          <Input id="task-title" placeholder="What are you working on?" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="task-estimate">Est. Pomodoros</Label>
                          <Select value={taskEstimate} onValueChange={setTaskEstimate}>
                              <SelectTrigger id="task-estimate"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
                  <div className="space-y-2">
                       <Label htmlFor="task-notes">Notes (optional)</Label>
                       <Textarea id="task-notes" placeholder="Add some details..." value={taskNotes} onChange={e => setTaskNotes(e.target.value)} rows={2} />
                  </div>
                  <Button onClick={addTask} className="w-full sm:w-auto"><Plus className="mr-2"/> Save Task</Button>
              </CardContent>
              <CardFooter className="flex-col items-start">
                  <h3 className="font-semibold mb-2">To-Do List</h3>
                  <ScrollArea className="h-64 w-full pr-4">
                     <div className="space-y-2">
                      {tasks.length > 0 ? tasks.map(task => (
                          <div key={task.id} className={cn("flex items-start gap-4 p-3 rounded-lg", task.completed ? "bg-green-500/10" : "bg-background/20")}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 mt-1" onClick={() => toggleTaskCompletion(task.id)}>
                              <Check className={cn("h-5 w-5", task.completed ? "text-green-500" : "text-muted-foreground")} />
                            </Button>
                            <div className="flex-grow">
                                <p className={cn("font-semibold", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                                {task.notes && <p className={cn("text-sm text-muted-foreground", task.completed && "line-through")}>{task.notes}</p>}
                                <p className="text-xs text-muted-foreground">Est: {task.estimate} Pomodoro(s)</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                      )) : (
                          <p className="text-sm text-muted-foreground text-center py-8">No tasks added yet.</p>
                      )}
                    </div>
                  </ScrollArea>
              </CardFooter>
          </Card>
        </div>
      </div>
      <audio ref={alarmAudioRef} src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" preload="auto"></audio>
    </div>
  );
}
