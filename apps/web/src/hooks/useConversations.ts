/**
 * useConversations — Firestore-Persisted Chat History
 *
 * Saves Oracle conversations so they survive page navigation.
 * Each conversation is scoped to a familyId + childId.
 * Conversations auto-archive after 24 hours of inactivity.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    arrayUnion
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface ChatMessage {
    role: 'user' | 'assistant' | 'crisis';
    content: string;
    timestamp: Date;
}

export interface Conversation {
    id: string;
    familyId: string;
    childId: string | null;
    messages: ChatMessage[];
    status: 'active' | 'archived';
    createdAt: Timestamp;
    updatedAt: Timestamp;
    summary?: string;
}

// ============================================
// HOOK
// ============================================

export function useConversations(childId: string | null) {
    const { user } = useAuth();
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for the most recent active conversation for this child
    useEffect(() => {
        if (!user) {
            setActiveConversation(null);
            setLoading(false);
            return;
        }

        const constraints = [
            where('familyId', '==', user.uid),
            where('status', '==', 'active'),
            orderBy('updatedAt', 'desc'),
            limit(1)
        ];

        // If we have a childId, scope to that child
        if (childId) {
            constraints.splice(1, 0, where('childId', '==', childId));
        }

        const q = query(collection(db, 'conversations'), ...constraints);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const docData = snapshot.docs[0];
                const data = docData.data();

                // Auto-archive if older than 24 hours
                const updatedAt = data.updatedAt?.toDate?.() || new Date();
                const hoursSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);

                if (hoursSinceUpdate > 24) {
                    // Archive this conversation, don't load it
                    updateDoc(doc(db, 'conversations', docData.id), { status: 'archived' });
                    setActiveConversation(null);
                } else {
                    setActiveConversation({
                        id: docData.id,
                        ...data,
                        messages: (data.messages || []).map((m: any) => ({
                            ...m,
                            timestamp: m.timestamp?.toDate?.() || new Date()
                        }))
                    } as Conversation);
                }
            } else {
                setActiveConversation(null);
            }
            setLoading(false);
        }, (err) => {
            console.error('Error fetching conversations:', err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, childId]);

    /**
     * Start a new conversation (or return existing active one)
     */
    const startConversation = useCallback(async (initialMessage?: ChatMessage): Promise<string> => {
        if (!user) throw new Error('Must be logged in');

        // If we already have an active conversation, return it
        if (activeConversation) return activeConversation.id;

        const newConvo = {
            familyId: user.uid,
            childId: childId || null,
            messages: initialMessage ? [{ ...initialMessage, timestamp: Timestamp.fromDate(initialMessage.timestamp) }] : [],
            status: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'conversations'), newConvo);
        return docRef.id;
    }, [user, childId, activeConversation]);

    /**
     * Add a message to the active conversation
     */
    const addMessage = useCallback(async (message: ChatMessage) => {
        if (!user) throw new Error('Must be logged in');

        let convoId = activeConversation?.id;

        // Create conversation if none exists
        if (!convoId) {
            convoId = await startConversation();
        }

        const convoRef = doc(db, 'conversations', convoId);
        await updateDoc(convoRef, {
            messages: arrayUnion({
                role: message.role,
                content: message.content,
                timestamp: Timestamp.fromDate(message.timestamp)
            }),
            updatedAt: serverTimestamp()
        });
    }, [user, activeConversation, startConversation]);

    /**
     * Archive the current conversation and start fresh
     */
    const archiveAndStartNew = useCallback(async () => {
        if (!user) return;

        if (activeConversation) {
            const convoRef = doc(db, 'conversations', activeConversation.id);
            await updateDoc(convoRef, { status: 'archived' });
        }

        setActiveConversation(null);
    }, [user, activeConversation]);

    const messages = useMemo(
        () => activeConversation?.messages || [],
        [activeConversation]
    );

    return {
        conversation: activeConversation,
        messages,
        loading,
        addMessage,
        startConversation,
        archiveAndStartNew
    };
}
