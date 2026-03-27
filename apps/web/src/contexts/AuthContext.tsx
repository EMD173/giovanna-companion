import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Detect mobile / in-app browsers where signInWithPopup is unreliable.
 * Covers iOS Safari, Android Chrome, Instagram/Facebook in-app browsers, etc.
 */
function isMobileOrInAppBrowser(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPhone|iPad|iPod|Android|Mobile|FBAN|FBAV|Instagram|CriOS|FxiOS/i.test(ua);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // DEMO MODE: Immediately provide mock user without waiting for Firebase
        const isDemoMode = localStorage.getItem('DEMO_MODE') === 'true';
        if (isDemoMode) {
            setUser({
                uid: 'demo_user',
                email: 'demo@giovanna.app',
                displayName: 'Demo Parent',
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: '',
                tenantId: null,
                delete: async () => { },
                getIdToken: async () => 'demo-token',
                getIdTokenResult: async () => ({ token: 'demo', columns: {}, expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: '', signInSecondFactor: '', claims: {} }),
                reload: async () => { },
                toJSON: () => ({}),
                phoneNumber: null,
                photoURL: null
            } as unknown as User);
            setLoading(false);
            return; // Skip Firebase listener in demo mode
        }

        // Handle redirect result (for mobile sign-in flow)
        getRedirectResult(auth).catch((err) => {
            console.warn('[Giovanna] Redirect result check:', err);
        });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Fallback for development verification if Firebase hangs
        if (import.meta.env.DEV) {
            setTimeout(() => {
                setLoading((currentLoading) => {
                    if (currentLoading) {
                        console.warn("Auth listener timed out; falling back to mock user.");
                        setUser({
                            uid: 'dev_mock_user',
                            email: 'dev@giovanna.app',
                            displayName: 'Mama Giovanna',
                            emailVerified: true,
                            isAnonymous: false,
                            metadata: {},
                            providerData: [],
                            refreshToken: '',
                            tenantId: null,
                            delete: async () => { },
                            getIdToken: async () => 'mock-token',
                            getIdTokenResult: async () => ({ token: 'mock', columns: {}, expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: '', signInSecondFactor: '', claims: {} }),
                            reload: async () => { },
                            toJSON: () => ({}),
                            phoneNumber: null,
                            photoURL: null
                        } as unknown as User);
                        return false;
                    }
                    return currentLoading;
                });
            }, 1000);
        }

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        // On mobile / in-app browsers, use redirect (popups are blocked)
        if (isMobileOrInAppBrowser()) {
            await signInWithRedirect(auth, provider);
            return; // Page will redirect — no further action
        }

        // Desktop: try popup first, fall back to redirect if blocked
        try {
            await signInWithPopup(auth, provider);
        } catch (error: unknown) {
            const code = (error as { code?: string })?.code;
            if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user') {
                console.warn('[Giovanna] Popup blocked, falling back to redirect');
                await signInWithRedirect(auth, provider);
                return;
            }
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const value = {
        user,
        loading,
        signInWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
