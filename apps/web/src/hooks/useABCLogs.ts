import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface ABCEntry {
    id: string;
    familyId: string;
    timestamp: Timestamp;
    antecedent: string;
    behavior: string;
    consequence: string;
    intensity: number; // 1-10
    context: string[]; // e.g., 'Home', 'School', 'Noise'
    notes?: string;
    createdAt: Timestamp;
}

export function useABCLogs() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<ABCEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // In a real app, we'd fetch the user's familyId first. 
    // For V1, we'll assume the user ID *is* the family ID key or linked directly.
    // This simplifies V1.

    useEffect(() => {
        if (!user) {
            setLogs([]);
            setLoading(false);
            return;
        }

        // Query: Get logs where familyId == user.uid (Assuming 1 user = 1 family for now)
        const q = query(
            collection(db, 'abcEntries'),
            where('familyId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ABCEntry[];
            setLogs(entries);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching logs", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addLog = async (entry: Omit<ABCEntry, 'id' | 'familyId' | 'createdAt' | 'timestamp'> & { timestamp: Date }) => {
        if (!user) throw new Error("Must be logged in");

        await addDoc(collection(db, 'abcEntries'), {
            ...entry,
            familyId: user.uid,
            timestamp: Timestamp.fromDate(entry.timestamp),
            createdAt: serverTimestamp()
        });
    };

    return { logs, loading, addLog };
}
