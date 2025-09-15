import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2 text-2xl font-bold font-headline text-foreground", className)}>
      <Wrench className="h-7 w-7 text-primary" />
      <span>Toolify</span>
    </Link>
  );
}
