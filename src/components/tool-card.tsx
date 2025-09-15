import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export function ToolCard({ icon, title, description, href }: ToolCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="bg-primary/10 p-3 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <CardDescription className="mb-4 h-10">{description}</CardDescription>
        <Button asChild variant="secondary" size="sm" className="mt-auto">
          <Link href={href}>
            Open Tool <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
