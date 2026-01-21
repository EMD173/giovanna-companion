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
    updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { type ABCEntry } from './useABCLogs';
import { type Strategy } from './useStrategies';

export interface SharePacket {
    id: string;
    familyId: string;
    accessToken: string; // Cryptographically secure token (64+ chars)
    generatedAt: Timestamp;
    expiresAt: Timestamp;
    content: {
        logs: ABCEntry[];
        strategies: Strategy[];
        summaryMessage: string;
    };
    recipientName: string;
    views: number;
    revoked?: boolean;
    hasPasscode?: boolean;
    passcodeHash?: string;
}

/**
 * Generate a cryptographically secure token (64 characters)
 */
function generateSecureToken(): string {
    // Use crypto.randomUUID twice for 72 chars, or fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    }
    // Fallback for older browsers
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a passcode using SHA-256 (client-side)
 */
async function hashPasscode(passcode: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const generatePacket = async (
        recipientName: string,
        logs: ABCEntry[],
        strategies: Strategy[],
        summaryMessage: string,
        passcode?: string
    ) => {
        if (!user) throw new Error("Must be logged in");

        // Generate cryptographically secure token
        const accessToken = generateSecureToken();

        // Set 7 day expiration
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        // Hash passcode if provided
        let passcodeHash: string | undefined;
        if (passcode && passcode.trim()) {
            passcodeHash = await hashPasscode(passcode.trim());
        }

        const packetData = {
            familyId: user.uid,
            accessToken,
            recipientName,
            generatedAt: serverTimestamp(),
            expiresAt: Timestamp.fromDate(expiryDate),
            views: 0,
            revoked: false,
            hasPasscode: !!passcodeHash,
            passcodeHash,
            content: {
                logs,
                strategies,
                summaryMessage
            }
        };

        const docRef = await addDoc(collection(db, 'sharePackets'), packetData);
        return { id: docRef.id, accessToken };
    };

    /**
     * Revoke a packet (immediate, cannot be undone)
     * We set revoked=true rather than deleting to maintain audit history
     */
    const revokePacket = async (id: string) => {
        await updateDoc(doc(db, 'sharePackets', id), {
            revoked: true
        });
    };

    return { packets, loading, generatePacket, revokePacket };
}

