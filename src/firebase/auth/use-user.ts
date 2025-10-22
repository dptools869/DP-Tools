'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const auth = useAuth();

  useEffect(() => {
    if (!auth) {
      setUser(undefined); // Auth not yet initialized
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return user;
}
