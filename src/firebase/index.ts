import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This check ensures firebase is only initialized on the client side.
if (typeof window !== 'undefined') {
    const apps = getApps();
    app = apps.length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
}

// Re-exporting hooks and providers
export * from './provider';
// @ts-ignore
export { app, auth, firestore };
