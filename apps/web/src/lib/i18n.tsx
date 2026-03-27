/**
 * i18n — Lightweight Internationalization Context
 *
 * Zero external dependencies. Stores locale in localStorage.
 * Provides t(key) for translations and setLocale() for switching.
 *
 * Usage:
 *   import { useI18n } from '../lib/i18n';
 *   const { t, locale, setLocale } = useI18n();
 *   <p>{t('auth.welcomeHome')}</p>
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en';
import type { TranslationKey } from '../i18n/en';
import es from '../i18n/es';

// ============================================
// SUPPORTED LOCALES
// ============================================

export type Locale = 'en' | 'es';

export const LOCALE_LABELS: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
};

export const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];

const translations: Record<Locale, Record<string, string>> = {
    en: en as Record<string, string>,
    es,
};

// ============================================
// CONTEXT
// ============================================

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

function getStoredLocale(): Locale {
    if (typeof window === 'undefined') return 'en';
    const stored = localStorage.getItem('giovanna_locale');
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
        return stored as Locale;
    }
    // Auto-detect from browser
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang && SUPPORTED_LOCALES.includes(browserLang as Locale)) {
        return browserLang as Locale;
    }
    return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('giovanna_locale', newLocale);
        // Update document lang for screen readers
        document.documentElement.lang = newLocale;
    }, []);

    const t = useCallback((key: TranslationKey | string): string => {
        return translations[locale]?.[key] || translations.en[key] || key;
    }, [locale]);

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
