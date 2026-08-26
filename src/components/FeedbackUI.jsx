import { useEffect } from "react";

/* ─────────────────────────────────────────────
   Toast
───────────────────────────────────────────── */

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = {
    success: {
      wrapper:
        "border-emerald-200 bg-white text-emerald-900 shadow-[0_12px_35px_rgba(16,185,129,0.15)]",
      icon: "bg-emerald-100 text-emerald-600",
      progress: "bg-emerald-500",
    },
    error: {
      wrapper:
        "border-red-200 bg-white text-red-900 shadow-[0_12px_35px_rgba(239,68,68,0.15)]",
      icon: "bg-red-100 text-red-600",
      progress: "bg-red-500",
    },
    info: {
      wrapper:
        "border-indigo-200 bg-white text-indigo-900 shadow-[0_12px_35px_rgba(79,70,229,0.15)]",
      icon: "bg-indigo-100 text-indigo-600",
      progress: "bg-indigo-500",
    },
    warning: {
      wrapper:
        "border-amber-200 bg-white text-amber-900 shadow-[0_12px_35px_rgba(245,158,11,0.15)]",
      icon: "bg-amber-100 text-amber-600",
      progress: "bg-amber-500",
    },
  };

  const theme = styles[toast.type] || styles.info;

  const icons = {
    success: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
    error: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    info: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="m10.3 3.8-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-14a2 2 0 0 0-3.4 0Z" />
      </svg>
    ),
  };

  return (
    <div
      className="
        fixed
        right-4 top-4 z-[100]
        w-[calc(100%-2rem)]
        max-w-sm
        print:hidden
        animate-[toast-in_0.25s_ease-out]
      "
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          relative overflow-hidden
          rounded-2xl border
          px-4 py-3
          backdrop-blur-xl
          ${theme.wrapper}
        `}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-xl
              ${theme.icon}
            `}
          >
            {icons[toast.type] || icons.info}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            {toast.title && <p className="text-xs font-bold">{toast.title}</p>}

            <p className="mt-0.5 text-[11px] leading-4 opacity-75">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="
              flex h-6 w-6 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          className={`
            absolute bottom-0 left-0
            h-0.5
            ${theme.progress}
            animate-[toast-progress_3s_linear_forwards]
          `}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Confirm Modal
───────────────────────────────────────────── */

export function ConfirmModal({
  open,
  title = "Delete record?",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[90]
        flex items-center justify-center
        bg-slate-950/45
        px-4
        backdrop-blur-[3px]
        print:hidden
        animate-[modal-fade_0.18s_ease-out]
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="
          w-full max-w-[390px]
          overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-[0_25px_70px_rgba(15,23,42,0.22)]
          animate-[modal-scale_0.2s_ease-out]
        "
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-red-50
              text-red-600
            "
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 15H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="confirm-modal-title"
              className="text-sm font-bold text-slate-900"
            >
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="
            mt-5 flex
            justify-end gap-2
            border-t border-slate-100
            bg-slate-50/60
            px-5 py-3
          "
        >
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-2
              text-xs font-semibold
              text-slate-600
              shadow-sm
              transition-all
              hover:bg-slate-50
              hover:text-slate-900
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-400/30
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              rounded-xl
              bg-red-600
              px-4 py-2
              text-xs font-semibold
              text-white
              shadow-sm
              shadow-red-600/20
              transition-all
              hover:bg-red-700
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-500/40
              focus-visible:ring-offset-2
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
