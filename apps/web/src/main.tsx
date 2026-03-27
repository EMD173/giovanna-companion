import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Global uncaught error handler — show something instead of blank white page
window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
    const root = document.getElementById('root');
    if (root && root.children.length === 0) {
        root.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#FAF6F0;font-family:Inter,sans-serif;text-align:center;padding:48px 24px">
                <div style="font-size:2.5rem;margin-bottom:16px">🌿</div>
                <h1 style="font-size:1.4rem;color:#2D2A26;margin-bottom:8px">Something went wrong</h1>
                <p style="color:#8A8580;max-width:400px;line-height:1.6;margin-bottom:24px">
                    Your data is safe. Try clearing your browser cache.
                </p>
                <button onclick="localStorage.clear();sessionStorage.clear();location.reload()"
                    style="padding:12px 28px;border-radius:12px;background:linear-gradient(135deg,#D4AF37,#E8C97A);color:#1A1A1A;border:none;font-weight:700;font-size:0.9rem;cursor:pointer">
                    Clear Cache & Reload
                </button>
            </div>
        `;
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise]', event.reason);
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
