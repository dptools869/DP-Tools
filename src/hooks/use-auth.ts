'use client';

import { useContext } from 'react';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { AuthContext } from '@/firebase/AuthProvider';

export const useAuth = () => {
  const { auth, user, loading } = useContext(AuthContext);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
