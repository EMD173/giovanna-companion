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

export type FunctionHypothesis = 'escape' | 'attention' | 'tangible' | 'sensory';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

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
    childId?: string;                       // Links to ChildProfile.id
    childName?: string;                     // Denormalized for display
    functionHypothesis?: FunctionHypothesis | null; // BCBA function category
    timeOfDay?: TimeOfDay;                  // Auto-captured from timestamp
    createdAt: Timestamp;
}

function getTimeOfDay(date: Date): TimeOfDay {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

export function useABCLogs() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<ABCEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // In a real app, we'd fetch the user's familyId first. 
    // For V1, we'll assume the user ID *is* the family ID key or linked directly.
    // This simplifies V1.

    useEffect(() => {
        // DEV BYPASS: seed mock ABC log data
        // DEV BYPASS or DEMO MODE: seed mock ABC logs
        const isDemoOrBypass = localStorage.getItem('DEMO_MODE') === 'true'
            || (!import.meta.env.PROD && localStorage.getItem('DEV_BYPASS') === 'true');
        if (isDemoOrBypass) {
            const now = new Date();
            const mockLogs: ABCEntry[] = [
                {
                    id: 'mock_log_1',
                    familyId: 'dev_mock_user',
                    childId: 'child_mock_amara',
                    childName: 'Amara',
                    timestamp: Timestamp.fromDate(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
                    antecedent: 'Teacher announced unexpected schedule change during art time',
                    behavior: 'Covered ears, began crying, pushed art supplies off desk',
                    consequence: 'Teacher offered noise-canceling headphones and 5-minute break in quiet corner. Amara calmed within 3 minutes.',
                    intensity: 7,
                    context: ['School', 'Classroom'],
                    functionHypothesis: 'escape',
                    timeOfDay: 'morning',
                    notes: 'Art was her favorite — the change felt bigger because of that',
                    createdAt: Timestamp.fromDate(new Date(now.getTime() - 2 * 60 * 60 * 1000))
                },
                {
                    id: 'mock_log_2',
                    familyId: 'dev_mock_user',
                    childId: 'child_mock_amara',
                    childName: 'Amara',
                    timestamp: Timestamp.fromDate(new Date(now.getTime() - 26 * 60 * 60 * 1000)),
                    antecedent: 'Grocery store was crowded with overhead music playing loudly',
                    behavior: 'Clung to mama, hummed repetitively, asked to leave multiple times',
                    consequence: 'Put on noise-canceling headphones. Completed shopping in 15 minutes with deep breathing at checkout.',
                    intensity: 5,
                    context: ['Community', 'Store'],
                    functionHypothesis: 'sensory',
                    timeOfDay: 'afternoon',
                    createdAt: Timestamp.fromDate(new Date(now.getTime() - 26 * 60 * 60 * 1000))
                },
                {
                    id: 'mock_log_3',
                    familyId: 'dev_mock_user',
                    childId: 'child_mock_amara',
                    childName: 'Amara',
                    timestamp: Timestamp.fromDate(new Date(now.getTime() - 50 * 60 * 60 * 1000)),
                    antecedent: 'Older cousin took her favorite toy giraffe without asking',
                    behavior: 'Screamed "Give it back!", hit cousin on arm, ran to room crying',
                    consequence: 'Mama mediated: validated feelings, cousin apologized, practiced "Can I have a turn?" script. Resolved in 10 minutes.',
                    intensity: 8,
                    context: ['Home', 'Family visit'],
                    functionHypothesis: 'tangible',
                    timeOfDay: 'evening',
                    createdAt: Timestamp.fromDate(new Date(now.getTime() - 50 * 60 * 60 * 1000))
                },
                {
                    id: 'mock_log_4',
                    familyId: 'dev_mock_user',
                    childId: 'child_mock_amara',
                    childName: 'Amara',
                    timestamp: Timestamp.fromDate(new Date(now.getTime() - 74 * 60 * 60 * 1000)),
                    antecedent: 'Peer rejected her attempt to join a group game at recess',
                    behavior: 'Sat alone on bench, pulled at hair, refused to respond to teacher check-ins',
                    consequence: 'School counselor sat with her, used social story about joining games. Amara rejoined play after 20 minutes.',
                    intensity: 6,
                    context: ['School', 'Recess'],
                    functionHypothesis: 'attention',
                    timeOfDay: 'morning',
                    createdAt: Timestamp.fromDate(new Date(now.getTime() - 74 * 60 * 60 * 1000))
                },
                {
                    id: 'mock_log_5',
                    familyId: 'dev_mock_user',
                    childId: 'child_mock_amara',
                    childName: 'Amara',
                    timestamp: Timestamp.fromDate(new Date(now.getTime() - 98 * 60 * 60 * 1000)),
                    antecedent: 'Homework transition after preferred screen time ended',
                    behavior: 'Refused to start, lay on floor, said "I can\'t do it, I\'m stupid"',
                    consequence: 'Used visual timer (10 min work / 5 min break), started with favorite subject (math). Completed homework with minimal support.',
                    intensity: 4,
                    context: ['Home', 'After school'],
                    functionHypothesis: 'escape',
                    timeOfDay: 'afternoon',
                    createdAt: Timestamp.fromDate(new Date(now.getTime() - 98 * 60 * 60 * 1000))
                }
            ];
            setLogs(mockLogs);
            setLoading(false);
            return;
        }

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

    const addLog = async (entry: Omit<ABCEntry, 'id' | 'familyId' | 'createdAt' | 'timestamp' | 'timeOfDay'> & { timestamp: Date }) => {
        if (!user) throw new Error("Must be logged in");

        await addDoc(collection(db, 'abcEntries'), {
            ...entry,
            familyId: user.uid,
            timestamp: Timestamp.fromDate(entry.timestamp),
            timeOfDay: getTimeOfDay(entry.timestamp),
            createdAt: serverTimestamp()
        });
    };

    return { logs, loading, addLog };
}
