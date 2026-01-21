import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export interface Strategy {
    id: string;
    familyId: string;
    title: string;
    procedure: string; // The "How To"
    category: 'Sensory' | 'Communication' | 'Routine' | 'Behavior';
    status: 'active' | 'archived' | 'successful';
    createdAt: Timestamp;
}

export function useStrategies() {
    const { user } = useAuth();
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setStrategies([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'strategies'),
            where('familyId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Strategy[];
            setStrategies(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching strategies", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addStrategy = async (data: Omit<Strategy, 'id' | 'familyId' | 'createdAt' | 'status'>) => {
        if (!user) throw new Error("Must be logged in");
        await addDoc(collection(db, 'strategies'), {
            ...data,
            familyId: user.uid,
            status: 'active',
            createdAt: serverTimestamp()
        });
    };

    const updateStatus = async (id: string, status: Strategy['status']) => {
        await updateDoc(doc(db, 'strategies', id), { status });
    };

    const deleteStrategy = async (id: string) => {
        await deleteDoc(doc(db, 'strategies', id));
    };

    return { strategies, loading, addStrategy, updateStatus, deleteStrategy };
}
