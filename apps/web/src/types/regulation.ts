export interface ParentCheckIn {
    id: string;
    timestamp: any; // Firestore Timestamp
    mood: 'calm' | 'frustrated' | 'overwhelmed' | 'anxious' | 'neutral';
    physicalSensation: string; // e.g., "tight chest", "relaxed shoulders"
    actionTaken: string; // e.g., "deep breathing", "stepped away", "prayer"
}

export interface SensoryLog {
    id: string;
    childId: string;
    timestamp: any;
    trigger: string; // Context: "Transition to school", "Loud noise"
    sensoryInput: string; // e.g., "Deep Pressure", "Quiet Time", "Swinging", "Music"
    outcome: 'regulated' | 'no_change' | 'escalated';
    notes: string;
    isWin: boolean; // Flags this as a "Sensory Win" to celebrate
}

export const MOOD_OPTIONS = [
    { value: 'calm', label: 'Calm / Steady', color: 'bg-teal-100 text-teal-700' },
    { value: 'frustrated', label: 'Frustrated', color: 'bg-orange-100 text-orange-700' },
    { value: 'overwhelmed', label: 'Overwhelmed', color: 'bg-rose-100 text-rose-700' },
    { value: 'anxious', label: 'Anxious / Worried', color: 'bg-amber-100 text-amber-700' },
    { value: 'neutral', label: 'Neutral', color: 'bg-slate-100 text-slate-700' }
];

export const SENSORY_INPUTS = [
    "Deep Pressure / Hug",
    "Weighted Blanket",
    "Quiet Time / Dim Lights",
    "Movement / Swinging",
    "Music / Rhythm",
    "Chewing / Crunchy Snack",
    "Visual Stimming",
    "Fidget Tools"
];
