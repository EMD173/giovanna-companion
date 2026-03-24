import React from 'react';
import { sanctuary, typography } from '../shared/theme';

/**
 * ErrorBoundary — Sanctuary-Themed Crash Recovery
 *
 * Wraps major routes so one page crash doesn't take down the app.
 * Shows a warm, non-alarming fallback — parents are already stressed enough.
 *
 * Must be a class component (React requirement for error boundaries).
 */

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallbackTitle?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);

        // Persist for analytics (picked up by useAnalytics on next render)
        try {
            const events = JSON.parse(localStorage.getItem('giovanna_error_log') || '[]');
            events.push({
                message: error.message,
                stack: error.stack?.slice(0, 500),
                component: errorInfo.componentStack?.slice(0, 300),
                timestamp: new Date().toISOString(),
            });
            // Keep only last 20 errors
            localStorage.setItem('giovanna_error_log', JSON.stringify(events.slice(-20)));
        } catch {
            // localStorage may be full or unavailable
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: sanctuary.bg,
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: sanctuary.goldBg,
                        border: `2px solid ${sanctuary.goldBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        marginBottom: '20px',
                    }}>
                        🌿
                    </div>

                    <h2 style={{
                        fontFamily: typography.heading,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        marginBottom: '8px',
                    }}>
                        {this.props.fallbackTitle || 'Something went wrong'}
                    </h2>

                    <p style={{
                        fontFamily: typography.body,
                        fontSize: '0.95rem',
                        color: sanctuary.textMuted,
                        maxWidth: '400px',
                        lineHeight: 1.6,
                        marginBottom: '28px',
                    }}>
                        Your data is safe. This page hit an unexpected issue.
                        Take a breath — you can try again or head home.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                color: '#1A1A1A',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontFamily: typography.body,
                                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                            }}
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => { window.location.href = '/dashboard'; }}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                background: 'none',
                                color: sanctuary.textSecondary,
                                border: `1.5px solid ${sanctuary.border}`,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                fontFamily: typography.body,
                            }}
                        >
                            Go Home
                        </button>
                    </div>

                    {/* Dev-only error details */}
                    {import.meta.env.DEV && this.state.error && (
                        <details style={{
                            marginTop: '32px',
                            maxWidth: '600px',
                            textAlign: 'left',
                            width: '100%',
                        }}>
                            <summary style={{
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                color: sanctuary.textMuted,
                                fontFamily: typography.body,
                                fontWeight: 600,
                            }}>
                                Dev Details
                            </summary>
                            <pre style={{
                                marginTop: '8px',
                                padding: '16px',
                                borderRadius: '12px',
                                background: sanctuary.bgAlt,
                                border: `1px solid ${sanctuary.border}`,
                                fontSize: '0.72rem',
                                color: sanctuary.rose,
                                fontFamily: "'SF Mono', monospace",
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}>
                                {this.state.error.message}
                                {'\n\n'}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * PageLoadingFallback — Suspense fallback for lazy-loaded routes
 */
export function PageLoadingFallback() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `3px solid ${sanctuary.border}`,
                borderTopColor: sanctuary.gold,
                animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{
                fontFamily: typography.body,
                fontSize: '0.85rem',
                color: sanctuary.textMuted,
                fontWeight: 500,
            }}>
                Loading...
            </span>
        </div>
    );
}
