import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

type AdBannerProps = {
  type: 'sidebar' | 'top-banner' | 'bottom-banner';
  className?: string;
};

export default function AdBanner({ type, className }: AdBannerProps) {
  const dimensions = {
    'sidebar': 'min-h-[250px]',
    'top-banner': 'min-h-[90px]',
    'bottom-banner': 'min-h-[90px]',
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4',
        dimensions[type],
        className
      )}
    >
      <Megaphone className="h-8 w-8 mb-2" />
      <span className="text-sm font-medium">Advertisement</span>
    </div>
  );
}
