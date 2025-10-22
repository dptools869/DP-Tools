'use client';

import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    router.push('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
       <header className="bg-card border-b p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <Button onClick={handleLogout}>Logout</Button>
        </header>
        <main className="flex-grow p-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <LayoutDashboard className="w-8 h-8 text-primary"/>
                        <div>
                            <CardTitle>Welcome, {user.email}</CardTitle>
                            <CardDescription>This is your admin dashboard. More features coming soon!</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>You have successfully logged into the admin panel.</p>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
