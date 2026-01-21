import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration for giovanna-companion project
// Created: 2026-01-20
const firebaseConfig = {
    apiKey: "AIzaSyC2GbsFfeDnW6Y1mY_qMiOCBOmITetTq9A",
    authDomain: "giovanna-companion.firebaseapp.com",
    projectId: "giovanna-companion",
    storageBucket: "giovanna-companion.firebasestorage.app",
    messagingSenderId: "146771413520",
    appId: "1:146771413520:web:7288771d7aec9e99ead895"
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
