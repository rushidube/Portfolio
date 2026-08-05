import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { SPRING } from "../../lib/animations";
import { useToast } from "../../lib/toast";

const ICONS = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

/**
 * Fixed-position toast stack, mounted once in App.
 *
 * Each toast announces itself via `role` + the shared `aria-live` region below
 * rather than stealing focus - a message that pushes focus around while
 * someone is still typing in the contact form would be worse than no
 * notification at all.
 */
export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant] ?? Info;

          return (
            <motion.div
              key={toast.id}
              className={`toast toast-${toast.variant}`}
              role={toast.variant === "error" ? "alert" : "status"}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
              transition={SPRING}
            >
              <span className="toast-icon">
                <Icon size={16} aria-hidden="true" />
              </span>

              <div className="toast-body">
                <p className="toast-message">{toast.message}</p>
                {toast.action ? (
                  <button
                    type="button"
                    className="toast-action"
                    onClick={() => {
                      toast.action.onClick();
                      dismissToast(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                className="toast-close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
