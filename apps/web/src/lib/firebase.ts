import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration — all values from environment variables.
// Create a .env file at apps/web/.env with these keys:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config in development
if (import.meta.env.DEV && !firebaseConfig.apiKey) {
    console.error(
        '🔥 Firebase config missing! Create apps/web/.env with your Firebase project keys.\n' +
        'See apps/web/.env.example for the required variables.'
    );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// One-time cleanup: delete stale IndexedDB databases left by the
// deprecated enableMultiTabIndexedDbPersistence() API. Without this,
// the old corrupted cache can still trigger assertion failures on
// the first load after upgrading to initializeFirestore().
// Uses a localStorage flag so it only runs once per browser.
if (typeof window !== 'undefined' && !localStorage.getItem('__giovanna_idb_migrated')) {
    try {
        if (typeof indexedDB?.databases === 'function') {
            indexedDB.databases().then(dbs => {
                for (const dbInfo of dbs) {
                    if (dbInfo.name && (dbInfo.name.includes('firestore') || dbInfo.name.includes('firebase'))) {
                        indexedDB.deleteDatabase(dbInfo.name);
                    }
                }
                localStorage.setItem('__giovanna_idb_migrated', '1');
            }).catch(() => { /* ignore — not all browsers support databases() */ });
        } else {
            localStorage.setItem('__giovanna_idb_migrated', '1');
        }
    } catch { /* SSR or restricted environment */ }
}

// Modern offline persistence (Firebase v12+)
// Replaces the deprecated enableMultiTabIndexedDbPersistence() which
// caused cascading INTERNAL ASSERTION FAILED errors in the Firestore
// SDK that broke React's synthetic event system.
//
// initializeFirestore + persistentLocalCache configures persistence
// as part of initialization rather than as a separate async call,
// eliminating the race condition that triggered assertion failures.
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

// Catch any remaining Firestore SDK internal assertion errors that
// bubble up as uncaught exceptions / unhandled rejections.
if (typeof window !== 'undefined') {
    const isFirestoreInternalError = (msg: string) =>
        msg.includes('INTERNAL ASSERTION FAILED') ||
        msg.includes('FIRESTORE') ||
        msg.includes('FirebaseError');

    window.addEventListener('error', (event) => {
        if (event.message && isFirestoreInternalError(event.message)) {
            console.warn('[Giovanna] Suppressed Firestore internal error:', event.message);
            event.preventDefault();
        }
    });

    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        const msg = reason?.message || reason?.toString?.() || '';
        if (isFirestoreInternalError(msg)) {
            console.warn('[Giovanna] Suppressed Firestore unhandled rejection:', msg);
            event.preventDefault();
        }
    });
}

export const functions = getFunctions(app);

// Connect to emulators if in development
// if (import.meta.env.DEV) {
//     // Note: These ports must match firebase.json
//     // connectAuthEmulator(auth, 'http://127.0.0.1:9099');
//     // connectFirestoreEmulator(db, '127.0.0.1', 8080);
//     // connectFunctionsEmulator(functions, '127.0.0.1', 5001);
//     // console.log('🔥 Connected to Firebase Emulators');
// }

