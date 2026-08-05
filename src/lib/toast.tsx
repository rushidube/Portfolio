import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastActionInput {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  variant?: ToastVariant;
  message: string;
  /** ms before auto-dismiss. Errors linger longer since they often carry an action. */
  duration?: number;
  action?: ToastActionInput;
}

export interface ToastItem extends Required<Pick<ToastInput, "message">> {
  id: number;
  variant: ToastVariant;
  action?: ToastActionInput;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (input: ToastInput) => number;
  dismissToast: (id: number) => void;
}

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  info: 4500,
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Global toast queue, one instance for the whole app.
 *
 * Kept deliberately small: no queue-limit logic, no positioning options - this
 * site needs exactly one place notifications can appear, not a general-purpose
 * notification framework.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef<Map<number, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    ({ variant = "info", message, duration, action }: ToastInput) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, variant, message, action }]);

      const ms = duration ?? DEFAULT_DURATION[variant];
      const timer = window.setTimeout(() => dismissToast(id), ms);
      timers.current.set(id, timer);

      return id;
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a <ToastProvider>.");
  }

  return context;
}
