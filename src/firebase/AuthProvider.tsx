'use client';

import { ReactNode, createContext } from 'react';
import { Auth, getAuth } from 'firebase/auth';
import { app } from './config';
import { useAuthState } from '@/hooks/use-auth-state';

export const AuthContext = createContext<{
  auth: Auth;
  loading: boolean;
  user: any | null;
}>({
  auth: getAuth(app),
  loading: true,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getAuth(app);
  const { user, loading } = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ auth, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
