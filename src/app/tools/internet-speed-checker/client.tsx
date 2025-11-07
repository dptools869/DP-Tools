
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

export function InternetSpeedCheckerClient() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <main className="lg:col-span-3">
                    <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-12">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Wifi className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="text-3xl font-headline">Free Internet Speed Checker | Test Speed Online Instantly</CardTitle>
                            <CardDescription className="text-lg">
                                Check your internet speed instantly. Test download, upload, and ping in seconds with our free Internet Speed Checker—fast, accurate, and secure results.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-center mb-12">
                        <h2>Test Your Internet Connection Within a Few Seconds</h2>
                        <p>Streaming, video calls, gaming, and remote work require a strong internet connection. Our free Internet Speed Checker helps you accurately measure your current internet performance — download, upload, and ping — to understand how well your internet connection is performing.</p>
                        <p>This tool offers fast, credible, and real-time answers, whether troubleshooting Wi-Fi connectivity on a slow network, checking the strength of your mobile data, or comparing Wi-Fi providers.</p>
                    </div>

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
                        <h2>How It Works</h2>
                        <p>Our speed checker tests the speed of data transfer between your device and our international servers. It measures in a couple of seconds:</p>
                        <ul>
                            <li><strong>Download Speed:</strong> How fast you can receive data (necessary for streaming and downloads).</li>
                            <li><strong>Upload Speed:</strong> How quickly you can send data (essential for uploads, cloud storage, and video calls).</li>
                            <li><strong>Ping (Latency):</strong> How responsive your connection is (crucial for gaming and live streaming).</li>
                        </ul>
                        <p>All you need to do is click the Start Test button, and our system will begin measuring your network's actual performance. You will get results you can trust in a clear, simple format.</p>
                        
                        <AdBanner type="top-banner" className="my-8"/>

                        <h2>Why Use Our Internet Speed Checker?</h2>
                        <ul>
                            <li><strong>Instant Results:</strong> Get your speed test results in seconds, no setup or login required.</li>
                            <li><strong>Accurate & Reliable:</strong> Our servers are optimized to deliver precise data transfer measurements.</li>
                            <li><strong>Simple & Free:</strong> Easy for anyone to use, completely free, and works on all devices.</li>
                            <li><strong>Understand Your Connection:</strong> Know if your speed meets your plan or if it's time to upgrade.</li>
                            <li><strong>Check Multiple Networks:</strong> Test Wi-Fi, Ethernet, or mobile data connections anytime.</li>
                        </ul>

                        <h2>Understanding Your Speed Test Results</h2>
                        <p>After you run the speed test, you will have three key numbers:</p>
                        <p><strong>Download Speed (Mbps):</strong> This shows how quickly you can access information on the internet. Higher numbers mean faster video playback, quicker downloads, and smoother browsing.</p>
                        <p><strong>Upload Speed (Mbps):</strong> This measures how quickly you can send information. If you do video calls, live streams, or upload large files, this number matters as much as download speed.</p>
                        <p><strong>Ping (ms):</strong> Ping is the time it takes the device to respond to the server. Ping of less than 50 ms is best suited to real-time games or virtual meetings.</p>
                        
                        <h2>What is the use of DPToolsPro Internet speed checker?</h2>
                        <p>Our Internet Speed Checker is easy, precise, and convenient. It provides you with everything you require — unlike other complicated testing instruments — quickly and easily.</p>
                        <h3>Key Benefits:</h3>
                        <ul>
                            <li><strong>Free and Fast:</strong> No sign-up, no ads, just instant speed testing.</li>
                            <li><strong>Accurate Measurements:</strong> Reliable data from high-performance global servers.</li>
                            <li><strong>Works Everywhere:</strong> Test from desktop, tablet, or mobile with equal ease.</li>
                            <li><strong>Private and Secure:</strong> We don't store or share your test data.</li>
                            <li><strong>Easy to Understand:</strong> Clean, simple results for both beginners and professionals.</li>
                        </ul>
                        <h2>Start Testing Your Speed Now</h2>
                        <p>Don't rely on guesswork; find out how fast your internet really is. With the DP Tools Internet Speed Checker, you can measure, monitor, and improve your connection performance in just a few clicks.</p>
                        <p>Test your speed now and take control of your online experience today.</p>
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
