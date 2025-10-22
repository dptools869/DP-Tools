import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useUser } from './auth/use-user';
import { FirebaseProvider, useAuth, useFirestore, useFirebaseApp } from './provider';

function initializeFirebase(): { app: FirebaseApp; auth: Auth; firestore: Firestore } {
  const apps = getApps();
  const app = apps.length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  useUser,
  useAuth,
  useFirestore,
  useFirebaseApp,
};
