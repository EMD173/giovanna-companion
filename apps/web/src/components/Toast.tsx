import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

// Simple global state for toasts (can be upgraded to Context if needed)
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function notifyListeners() {
    toastListeners.forEach((listener) => listener([...currentToasts]));
}

export function showToast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    currentToasts = [...currentToasts, { id, message, type }];
    notifyListeners();

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        dismissToast(id);
    }, 4000);
}

export function dismissToast(id: string) {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    notifyListeners();
}

// Hook to subscribe to toast state
export function useToasts() {
    const [toasts, setToasts] = useState<Toast[]>(currentToasts);

    useEffect(() => {
        toastListeners.push(setToasts);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== setToasts);
        };
    }, []);

    return { toasts, showToast, dismissToast };
}

// Toast Container Component (render once in Layout)
export function ToastContainer() {
    const { toasts, dismissToast } = useToasts();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg max-w-md w-full animate-in slide-in-from-bottom-4 fade-in duration-200 ${toast.type === 'success'
                        ? 'bg-green-600 text-white'
                        : toast.type === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                >
                    {toast.type === 'success' && <CheckCircle size={20} />}
                    {toast.type === 'error' && <AlertCircle size={20} />}
                    {toast.type === 'info' && <Info size={20} />}
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="opacity-70 hover:opacity-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
