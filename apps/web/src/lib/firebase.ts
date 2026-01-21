import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
// Uses env vars if available, falls back to project defaults
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC2GbsFfeDnW6Y1mY_qMiOCBOmITetTq9A",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "giovanna-companion.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "giovanna-companion",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "giovanna-companion.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "146771413520",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:146771413520:web:7288771d7aec9e99ead895"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators if in development
if (import.meta.env.DEV) {
    // Note: These ports must match firebase.json
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    console.log('🔥 Connected to Firebase Emulators');
}
