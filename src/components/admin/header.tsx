'use client';

import { LogOut, Menu, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import AdminSidebar from './sidebar';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged Out Successfully' });
      router.push('/admin/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
          <AdminSidebar isMobile={true} />
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Can add search here if needed */}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{user?.email}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
