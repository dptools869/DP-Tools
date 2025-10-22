'use client';

import { ReactNode, useState, useEffect } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

// This provider ensures Firebase is initialized once on the client
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState(() => initializeFirebase());

  // This effect can be used for any client-side initialization logic
  // that depends on Firebase, though for now, just initializing is enough.
  useEffect(() => {
    // Optional: Any additional client-side setup
  }, []);

  return (
    <FirebaseProvider 
      firebaseApp={firebase.firebaseApp}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
