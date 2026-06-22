"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Flame,
  Info,
  Sparkles,
  Zap,
} from "lucide-react";

import "./toast.css";

export type ToastVariant = "success" | "progress" | "warning" | "error" | "info";

export type ToastAction = {
  href: string;
  label: string;
};

export type ToastInput = {
  action?: ToastAction;
  description?: string;
  duration?: number;
  id?: string;
  title: string;
  variant?: ToastVariant;
};

type ToastRecord = ToastInput & {
  id: string;
};

type ToastContextValue = {
  dismiss: (id: string) => void;
  toast: (input: ToastInput) => string;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3800;

const variantClasses: Record<ToastVariant, string> = {
  error: "toast-item-error",
  info: "toast-item-info",
  progress: "toast-item-progress",
  success: "toast-item-success",
  warning: "toast-item-warning",
};

const variantIcons: Record<ToastVariant, ReactNode> = {
  error: <AlertCircle size={16} />,
  info: <Info size={16} />,
  progress: <Flame size={16} />,
  success: <CheckCircle2 size={16} />,
  warning: <Zap size={16} />,
};

function ToastViewport({ toasts, onDismiss }: { onDismiss: (id: string) => void; toasts: ToastRecord[] }) {
  return (
    <div aria-live="polite" className="toast-viewport">
      {toasts.map((item) => {
        const variant = item.variant ?? "info";
        return (
          <div
            className={["toast-item motion-toast-enter", variantClasses[variant]].join(" ")}
            key={item.id}
            role="status"
          >
            <div className="toast-item-icon" aria-hidden="true">
              {variant === "progress" ? <Sparkles size={16} /> : variantIcons[variant]}
            </div>
            <div className="toast-item-body">
              <p className="toast-item-title">{item.title}</p>
              {item.description ? (
                <p className="toast-item-description">{item.description}</p>
              ) : null}
              {item.action ? (
                <Link className="toast-item-action" href={item.action.href}>
                  {item.action.label}
                </Link>
              ) : null}
            </div>
            <button
              aria-label="Закрыть уведомление"
              className="toast-item-close"
              onClick={() => onDismiss(item.id)}
              type="button"
            />
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const record: ToastRecord = {
        ...input,
        id,
        variant: input.variant ?? "info",
      };

      setToasts((current) => [...current.slice(-4), record]);

      window.setTimeout(() => {
        dismiss(id);
      }, input.duration ?? DEFAULT_DURATION);

      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ dismiss, toast }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport onDismiss={dismiss} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
