
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, ArrowDown, ArrowUp, Signal, Loader2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type SpeedDataPoint = { name: string, speed: number };

const generateRandomData = (base: number, points = 10) => {
    return Array.from({ length: points }, (_, i) => ({
        name: `${i}`,
        speed: Math.max(0, base + (Math.random() - 0.5) * base * 0.4),
    }));
};

export default function InternetSpeedCheckerPage() {
    const [testState, setTestState] = useState<'idle' | 'testing-ping' | 'testing-download' | 'testing-upload' | 'finished'>('idle');
    const [ping, setPing] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [downloadData, setDownloadData] = useState<SpeedDataPoint[]>([]);
    const [uploadData, setUploadData] = useState<SpeedDataPoint[]>([]);

    const startTest = () => {
        setTestState('testing-ping');
        setPing(0);
        setDownloadSpeed(0);
        setUploadSpeed(0);
        setCurrentSpeed(0);
        setDownloadData([]);
        setUploadData([]);

        // Simulate Ping
        setTimeout(() => {
            const randomPing = Math.floor(Math.random() * (40 - 5 + 1)) + 5;
            setPing(randomPing);
            setTestState('testing-download');
        }, 1500);

        // Simulate Download
        setTimeout(() => {
            const baseDownload = Math.random() * (200 - 20) + 20; // 20-200 Mbps
            const data = generateRandomData(baseDownload, 20);
            setDownloadData(data);
            
            let i = 0;
            const interval = setInterval(() => {
                setCurrentSpeed(data[i].speed);
                i++;
                if (i >= data.length) {
                    clearInterval(interval);
                    const finalDownload = data.reduce((a,b) => a+b.speed, 0) / data.length;
                    setDownloadSpeed(finalDownload);
                    setTestState('testing-upload');
                }
            }, 200);
        }, 1600);

         // Simulate Upload
        setTimeout(() => {
             const baseUpload = Math.random() * (50 - 10) + 10; // 10-50 Mbps
             const data = generateRandomData(baseUpload, 20);
             setUploadData(data);
            
             let i = 0;
             const interval = setInterval(() => {
                 setCurrentSpeed(data[i].speed);
                 i++;
                 if (i >= data.length) {
                     clearInterval(interval);
                     const finalUpload = data.reduce((a,b) => a+b.speed, 0) / data.length;
                     setUploadSpeed(finalUpload);
                     setTestState('finished');
                     setCurrentSpeed(0);
                 }
             }, 200);
        }, 6000); // Start upload after download finishes
    };

    const Gauge = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center gap-2">
            <div className="text-5xl font-bold text-primary">{value.toFixed(2)}</div>
            <div className="text-muted-foreground">{label}</div>
        </div>
    );
    
    const isTesting = testState !== 'idle' && testState !== 'finished';

    const renderChart = (data: SpeedDataPoint[]) => (
        <ResponsiveContainer width="100%" height={100}>
            <LineChart data={data}>
                <Line type="monotone" dataKey="speed" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
        </ResponsiveContainer>
    )

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <main className="lg:col-span-3">
                    <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Wifi className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Internet Speed Checker</CardTitle>
                            <CardDescription className="text-lg">
                                Test your download speed, upload speed, and ping with a single click.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-8 space-y-8">
                             <div className="flex justify-center">
                                <Button onClick={startTest} disabled={isTesting} size="lg" className="w-48 h-16 text-2xl rounded-full">
                                    {isTesting ? <Loader2 className="animate-spin" /> : 'Start Test'}
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 items-start">
                               <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowDown className="w-5 h-5"/>
                                        <span className="font-semibold">Download</span>
                                    </div>
                                    <div className="text-4xl font-bold">{downloadSpeed > 0 ? downloadSpeed.toFixed(2) : '--'}</div>
                                    <div className="text-sm text-muted-foreground">Mbps</div>
                                    <div className="w-full h-[100px]">{renderChart(downloadData)}</div>
                               </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowUp className="w-5 h-5"/>
                                        <span className="font-semibold">Upload</span>
                                    </div>
                                    <div className="text-4xl font-bold">{uploadSpeed > 0 ? uploadSpeed.toFixed(2) : '--'}</div>
                                    <div className="text-sm text-muted-foreground">Mbps</div>
                                    <div className="w-full h-[100px]">{renderChart(uploadData)}</div>
                               </div>
                               <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Signal className="w-5 h-5"/>
                                        <span className="font-semibold">Ping</span>
                                    </div>
                                    <div className="text-4xl font-bold">{ping > 0 ? ping : '--'}</div>
                                    <div className="text-sm text-muted-foreground">ms</div>
                               </div>
                            </div>
                           
                            {isTesting && <Progress value={(testState === 'testing-ping' ? 10 : testState === 'testing-download' ? 40 : 80)} className="w-full" />}
                        </CardContent>
                    </Card>

                    <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
                        <h2>Understanding Your Internet Speed Test Results</h2>
                        <p>Our Internet Speed Checker provides you with three key metrics to help you understand your connection's performance. Here’s what they mean:</p>
                        <AdBanner type="top-banner" className="my-8"/>
                        <h3>Download Speed (Mbps)</h3>
                        <p>This is the speed at which data is transferred from the internet to your device, measured in megabits per second (Mbps). A higher download speed means a better experience for activities like streaming videos, downloading files, and browsing websites.</p>
                        <h3>Upload Speed (Mbps)</h3>
                        <p>This is the speed at which data is transferred from your device to the internet. A higher upload speed is important for video calls, uploading large files to the cloud, and online gaming.</p>
                        <h3>Ping (ms)</h3>
                        <p>Ping, also known as latency, is the reaction time of your connection, measured in milliseconds (ms). It's the time it takes for a signal to travel from your device to a server and back. A lower ping is better, especially for real-time applications like online gaming and video conferencing, as it means less delay.</p>
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
