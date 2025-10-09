import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2 text-xl sm:text-2xl font-bold font-headline text-foreground", className)}>
      <Wrench className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
      <span>DP Tools</span>
    </Link>
  );
}
