'use client';

import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/protected-route';
import { useAuth } from '@/firebase';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function DashboardPage() {
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
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
        <header className="bg-background border-b p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
        <main className="flex-grow p-8">
            <h2 className="text-3xl font-bold">Welcome, Admin!</h2>
            <p className="text-muted-foreground mt-2">
                This is your dashboard. Management features coming soon!
            </p>
        </main>
    </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;
