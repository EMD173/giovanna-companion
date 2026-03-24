import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
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
