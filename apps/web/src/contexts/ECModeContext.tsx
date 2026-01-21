/**
 * Epigenetic Consciousness Mode Context
 * 
 * Provides global state for EC Mode toggle.
 * When enabled, EC lens components appear alongside ABA guidance.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface ECModeContextValue {
    enabled: boolean;
    loading: boolean;
    toggle: () => Promise<void>;
    setEnabled: (value: boolean) => Promise<void>;
}

const ECModeContext = createContext<ECModeContextValue>({
    enabled: false,
    loading: true,
    toggle: async () => { },
    setEnabled: async () => { }
});

export function ECModeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [enabled, setEnabledState] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load preference from Firestore
    useEffect(() => {
        async function loadPreference() {
            if (!user) {
                setEnabledState(false);
                setLoading(false);
                return;
            }

            try {
                const prefDoc = await getDoc(doc(db, 'userPreferences', user.uid));
                if (prefDoc.exists()) {
                    setEnabledState(prefDoc.data().ecModeEnabled ?? false);
                }
            } catch (error) {
                console.error('Error loading EC mode preference:', error);
            } finally {
                setLoading(false);
            }
        }

        loadPreference();
    }, [user]);

    // Save preference to Firestore
    const savePreference = async (value: boolean) => {
        if (!user) return;

        try {
            await setDoc(doc(db, 'userPreferences', user.uid), {
                ecModeEnabled: value,
                updatedAt: new Date()
            }, { merge: true });
        } catch (error) {
            console.error('Error saving EC mode preference:', error);
        }
    };

    const toggle = async () => {
        const newValue = !enabled;
        setEnabledState(newValue);
        await savePreference(newValue);
    };

    const setEnabled = async (value: boolean) => {
        setEnabledState(value);
        await savePreference(value);
    };

    return (
        <ECModeContext.Provider value={{ enabled, loading, toggle, setEnabled }}>
            {children}
        </ECModeContext.Provider>
    );
}

export function useECMode() {
    const context = useContext(ECModeContext);
    if (!context) {
        throw new Error('useECMode must be used within an ECModeProvider');
    }
    return context;
}
