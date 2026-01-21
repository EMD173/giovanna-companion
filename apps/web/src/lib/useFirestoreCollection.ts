import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    type QueryConstraint,
    type DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../contexts/AuthContext';

export interface FirestoreHookState<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
}

export interface FirestoreHookOptions {
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
}

/**
 * Generic Firestore Collection Hook Factory
 * 
 * Creates a real-time subscription to a Firestore collection
 * filtered by the current user's UID as 'familyId'.
 * 
 * @example
 * const { data, loading, error, add, remove } = useFirestoreCollection<ABCEntry>('abcEntries', { orderByField: 'timestamp' });
 */
export function useFirestoreCollection<T extends DocumentData & { id?: string }>(
    collectionName: string,
    options: FirestoreHookOptions = {}
) {
    const { user } = useAuth();
    const [state, setState] = useState<FirestoreHookState<T>>({
        data: [],
        loading: true,
        error: null
    });

    const { orderByField = 'createdAt', orderDirection = 'desc' } = options;

    useEffect(() => {
        if (!user) {
            setState({ data: [], loading: false, error: null });
            return;
        }

        const constraints: QueryConstraint[] = [
            where('familyId', '==', user.uid),
            orderBy(orderByField, orderDirection)
        ];

        const q = query(collection(db, collectionName), ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const documents = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })) as T[];
                setState({ data: documents, loading: false, error: null });
            },
            (err) => {
                console.error(`Error fetching ${collectionName}:`, err);
                setState((prev) => ({ ...prev, loading: false, error: err }));
            }
        );

        return () => unsubscribe();
    }, [user, collectionName, orderByField, orderDirection]);

    // Generic Add
    const add = async (data: Omit<T, 'id' | 'familyId' | 'createdAt'>) => {
        if (!user) throw new Error('Must be logged in');
        return addDoc(collection(db, collectionName), {
            ...data,
            familyId: user.uid,
            createdAt: serverTimestamp()
        });
    };

    // Generic Update
    const update = async (id: string, data: Partial<T>) => {
        return updateDoc(doc(db, collectionName, id), data as DocumentData);
    };

    // Generic Delete
    const remove = async (id: string) => {
        return deleteDoc(doc(db, collectionName, id));
    };

    return {
        ...state,
        add,
        update,
        remove
    };
}
