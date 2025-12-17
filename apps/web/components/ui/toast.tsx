"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: string;
};

type ToastContextType = {
  show: (t: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Module-level handler so other modules can import `toast` and trigger toasts
let _toastHandler: ((t: Omit<ToastItem, 'id'>) => void) | null = null;

export function toast(options: Omit<ToastItem, 'id'>) {
  if (_toastHandler) {
    _toastHandler(options);
  } else {
    // If provider is not mounted yet, log a warning (could queue if desired)
    // eslint-disable-next-line no-console
    console.warn('Toast provider not mounted yet.');
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now());
    const item: ToastItem = { id, duration: 4000, ...toast };
    setToasts((s) => [...s, item]);

    if (item.duration && item.duration > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id));
      }, item.duration);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    _toastHandler = show;
    return () => {
      _toastHandler = null;
    };
  }, [show]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div aria-live="polite" className="fixed z-50 right-4 top-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="max-w-sm w-full bg-white/95 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-lg rounded-lg p-3 border border-slate-200 dark:border-slate-700"
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => remove(t.id)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Fechar
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastProvider;

