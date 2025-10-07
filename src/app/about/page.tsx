
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Zap, Target } from "lucide-react";
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border border-border">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-4xl font-headline text-foreground">
                About Me
            </CardTitle>
             <p className="text-xl text-muted-foreground pt-2">
                Hello, and welcome to <strong>DP TOOLS PRO</strong>!
            </p>
        </CardHeader>
        <CardContent className="space-y-6 text-lg text-muted-foreground leading-relaxed px-6 md:px-8 pb-8">
          <p>
            My name is <strong>Piyush</strong>, and I am the creator of DP TOOLS PRO. I am passionate about building digital tools and online utilities that simplify everyday life, solve real problems, and help people save time and effort.
          </p>
          
          <div className="border-l-4 border-primary pl-4 space-y-4 my-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> Our Vision</h3>
              <p>
                The vision behind DP TOOLS PRO is to create a reliable hub of free and professional tools that anyone can access—whether for students, professionals, creators, or businesses. From calculators and PDF utilities to image tools and social media utilities, my goal is to provide simple, effective, and user-friendly solutions in one place.
              </p>
          </div>

          <p>
            I believe technology should empower people, and that’s why I am continuously working on expanding DP TOOLS PRO with new and innovative tools. While most of the tools are free to use, in the future we may introduce premium features and advanced plans to further enhance user experience.
          </p>

          <p>
            DP TOOLS PRO is monetized through advertisements to support its maintenance and growth, but all ads are displayed in compliance with industry standards and Google AdSense policies. My top priority is user trust, transparency, and delivering genuine value through every tool and service available on this platform.
          </p>
          
          <p>
            Thank you for visiting DP TOOLS PRO. I hope you find the tools useful and keep coming back as we continue to grow and introduce more digital solutions.
          </p>

          <div className="text-center border-t border-border pt-6 mt-8">
            <h4 className="text-xl font-semibold text-foreground mb-2">Get in Touch</h4>
            <p className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <Link href="mailto:hello@digitalpiyush.in" className="font-mono text-primary hover:underline">
                    hello@digitalpiyush.in
                </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
