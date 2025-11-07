'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase/provider';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome, {user?.displayName || user?.email}!</h1>
         <Card>
            <CardHeader>
                <CardTitle>Admin Dashboard Overview</CardTitle>
                <CardDescription>Manage your website content and tools from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Select a category from the sidebar to begin managing your tools.</p>
            </CardContent>
        </Card>
    </div>
  );
}

export default DashboardPage;
