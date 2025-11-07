'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileText,
  Home,
  ImageIcon,
  Settings,
  Calculator,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../logo';

const navItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/dashboard/pdf-tools', icon: FileText, label: 'PDF Tools' },
  { href: '/admin/dashboard/image-tools', icon: ImageIcon, label: 'Image Tools' },
  { href: '/admin/dashboard/calculator-tools', icon: Calculator, label: 'Calculator Tools' },
];

const bottomNavItems = [
  { href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
];

const NavLink = ({ href, icon: Icon, label, isMobile = false }: { href: string; icon: React.ElementType; label: string; isMobile?: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
      <Link
        href={href}
        className={cn(
            "flex items-center gap-4 px-2.5 rounded-lg",
            isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
               isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


export default function AdminSidebar({ isMobile = false }) {

  if (isMobile) {
    return (
      <nav className="grid gap-6 text-lg font-medium p-4">
        <Link href="/admin/dashboard" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
            <Wrench className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">DP Tools Admin</span>
        </Link>
        {navItems.map(item => <NavLink key={item.href} {...item} isMobile />)}
        <hr className="my-2"/>
        {bottomNavItems.map(item => <NavLink key={item.href} {...item} isMobile />)}
      </nav>
    );
  }


  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link href="/admin/dashboard" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <Wrench className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">DP Tools Admin</span>
        </Link>
        {navItems.map(item => <NavLink key={item.href} {...item} />)}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        {bottomNavItems.map(item => <NavLink key={item.href} {...item} />)}
      </nav>
    </aside>
  );
}
