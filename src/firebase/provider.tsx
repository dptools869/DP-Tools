'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, Auth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  loading: boolean;
  signup: (email:string, pass:string) => Promise<any>;
  login: (email:string, pass:string) => Promise<any>;
  logout: () => Promise<any>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { app, auth, db: firestore } = initializeFirebase();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  
  const signup = (email: string, password: string):Promise<any> => {
      if(!auth) return Promise.reject(new Error("Auth not initialized"));
      return createUserWithEmailAndPassword(auth, email, password);
  }

  const login = (email: string, password: string):Promise<any> => {
      if(!auth) return Promise.reject(new Error("Auth not initialized"));
      return signInWithEmailAndPassword(auth, email, password);
  }
  
  const logout = ():Promise<any> => {
      if(!auth) return Promise.reject(new Error("Auth not initialized"));
      return signOut(auth);
  }


  return (
    <FirebaseContext.Provider value={{ app, auth, firestore, user, loading, signup, login, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
}

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
