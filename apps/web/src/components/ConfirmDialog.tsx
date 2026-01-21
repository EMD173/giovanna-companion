import { useState } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmVariant = 'primary',
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 fade-in duration-150">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-lg font-bold ${confirmVariant === 'danger'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook for easy usage
export function useConfirmDialog() {
    const [state, setState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmLabel: string;
        confirmVariant: 'danger' | 'primary';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        confirmLabel: 'Confirm',
        confirmVariant: 'primary',
        onConfirm: () => { }
    });

    const confirm = (options: {
        title: string;
        message: string;
        confirmLabel?: string;
        confirmVariant?: 'danger' | 'primary';
    }): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                title: options.title,
                message: options.message,
                confirmLabel: options.confirmLabel || 'Confirm',
                confirmVariant: options.confirmVariant || 'primary',
                onConfirm: () => {
                    setState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                }
            });
        });
    };

    const cancel = () => {
        setState(prev => ({ ...prev, isOpen: false }));
    };

    const dialogProps: ConfirmDialogProps = {
        ...state,
        onCancel: cancel
    };

    return { confirm, dialogProps, ConfirmDialog };
}
