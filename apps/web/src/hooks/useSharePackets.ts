import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { type ABCEntry } from './useABCLogs';
import { type Strategy } from './useStrategies';

export interface SharePacket {
    id: string;
    familyId: string;
    accessCode: string; // The secret key for the URL
    generatedAt: Timestamp;
    expiresAt: Timestamp;
    content: {
        logs: ABCEntry[];
        strategies: Strategy[];
        summaryMessage: string;
    };
    recipientName: string; // e.g. "Ms. Johnson"
    views: number;
}

export function useSharePackets() {
    const { user } = useAuth();
    const [packets, setPackets] = useState<SharePacket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setPackets([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'sharePackets'),
            where('familyId', '==', user.uid),
            orderBy('generatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SharePacket[];
            setPackets(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching packets", err);
            // Fallback if index missing or permission error
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const generatePacket = async (
        recipientName: string,
        logs: ABCEntry[],
        strategies: Strategy[],
        summaryMessage: string
    ) => {
        if (!user) throw new Error("Must be logged in");

        // In production, generating a high-entropy string should be done via Cloud Function
        // For MVP, we'll use a simple random string here.
        const accessCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Set 7 day expiration
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        // Sanitize data (Remove unnecessary internal IDs if needed, but keeping simple for V1)

        const packetData = {
            familyId: user.uid,
            accessCode,
            recipientName,
            generatedAt: serverTimestamp(),
            expiresAt: Timestamp.fromDate(expiryDate),
            views: 0,
            content: {
                logs,
                strategies,
                summaryMessage
            }
        };

        const docRef = await addDoc(collection(db, 'sharePackets'), packetData);
        return { id: docRef.id, accessCode };
    };

    const revokePacket = async (id: string) => {
        await deleteDoc(doc(db, 'sharePackets', id));
    };

    return { packets, loading, generatePacket, revokePacket };
}
