import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LandingPage } from '../pages/LandingPage';
import { AuthProvider } from '../contexts/AuthContext';
import { I18nProvider } from '../lib/i18n';

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

// Provide basic mocks for contexts
const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <MemoryRouter>
            <I18nProvider>
                <AuthProvider>
                    {component}
                </AuthProvider>
            </I18nProvider>
        </MemoryRouter>
    );
};

describe('Critical Smoke Tests', () => {
    it('renders the Landing Page without crashing', () => {
        renderWithProviders(<LandingPage />);
        // Look for the main title or the "Giovanna" brand text
        expect(screen.getByText('Giovanna', { selector: 'a' })).toBeInTheDocument();
    });

    it('language switch functionality exists', () => {
        renderWithProviders(<LandingPage />);
        // The language toggle should be present
        const langToggle = screen.getByRole('button', { name: /es|en/i });
        expect(langToggle).toBeInTheDocument();
    });
    

});
