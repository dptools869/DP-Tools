'use client';

import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect if loading is complete and there's no user.
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // While loading, show a spinner to prevent premature rendering or redirection.
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is complete and we have a user, render the children (the dashboard).
  return <>{children}</>;
}
