'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

type ToastType = 'error' | 'success' | 'info';

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (message: string) => {
        if (typeof window !== 'undefined') window.alert(message);
      },
    };
  }
  return ctx;
}

const AUTO_HIDE_MS = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string, t: ToastType = 'info') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    setType(t);
    setVisible(true);
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setMessage(null);
      timeoutRef.current = null;
    }, AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {visible && message && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-lg shadow-lg max-w-[90vw] sm:max-w-md text-sm font-medium text-white"
          style={{
            backgroundColor:
              type === 'error'
                ? '#b91c1c'
                : type === 'success'
                  ? '#bcf715'
                  : '#1329d4',
            color: type === 'success' ? '#141414' : 'white',
          }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
