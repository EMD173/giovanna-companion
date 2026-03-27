/**
 * Vitest Test Setup
 * 
 * Configures the test environment with DOM matchers and
 * mocks for browser APIs not available in jsdom.
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia (used by useMediaQuery)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        get length() { return Object.keys(store).length; },
        key: (index: number) => Object.keys(store)[index] || null,
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock speechSynthesis (used by useReadAloud)
Object.defineProperty(window, 'speechSynthesis', {
    value: {
        speak: () => {},
        cancel: () => {},
        getVoices: () => [],
        speaking: false,
    },
});

// Mock Firebase (needed for auth context)
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    getRedirectResult: vi.fn(() => Promise.resolve(null)),
    onAuthStateChanged: vi.fn((_auth: any, cb: any) => {
        cb(null);
        return () => {};
    }),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    initializeFirestore: vi.fn(() => ({})),
    persistentLocalCache: vi.fn(),
    persistentMultipleTabManager: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
    collection: vi.fn(),
}));
