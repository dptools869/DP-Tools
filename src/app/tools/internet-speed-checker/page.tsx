
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export default function InternetSpeedCheckerPage() {
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

                    <Card>
                        <CardContent className="p-4">
                            <div>
                                <div style={{minHeight: '360px'}}>
                                    <div style={{width: '100%', height: 0, paddingBottom: '50%', position: 'relative'}}>
                                        <iframe 
                                            style={{border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', minHeight: '360px', overflow: 'hidden'}}
                                            src="//openspeedtest.com/speedtest"
                                            title="Internet Speed Test"
                                        ></iframe>
                                    </div>
                                </div>
                                <div style={{textAlign: 'right', display: 'none'}}>
                                    Provided by <a href="https://openspeedtest.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenSpeedtest.com</a>
                                </div>
                            </div>
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
