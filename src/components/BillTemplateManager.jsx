import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteBillTemplate,
  getBillTemplates,
  saveBillTemplate,
} from "./Hotels/templatesStorage";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";
const NAME_MAX = 60;

const Ri = ({ name, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name} leading-none ${className}`} />
);

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const templateTotal = (items) =>
  (items || []).reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0),
    0,
  );

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function BillTemplateManager({
  open,
  darkMode = false,
  currentBill,
  currentItems,
  currentTextStyles,
  currentFontFamily,
  currentFontSize,
  editingTemplateId = null,
  initialName = "",
  onClose,
  onLoad,
  onSaved,
}) {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  // Light = ivory/forest, dark = neutral. Same map as the saved-bills list.
  const t = darkMode
    ? {
        panel: "bg-neutral-900 text-neutral-100 border-neutral-700",
        line: "border-neutral-700",
        divide: "divide-neutral-700",
        well: "bg-neutral-800/60",
        row: "hover:bg-neutral-800",
        muted: "text-neutral-400",
        input:
          "bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500",
        ghost: "border-neutral-700 text-neutral-100 hover:bg-neutral-700/60",
        chip: "bg-neutral-800 text-neutral-300",
        accent: "text-emerald-400",
        danger: "text-red-300 hover:bg-red-400/10",
        dangerSolid: "bg-red-600 text-white hover:bg-red-500",
      }
    : {
        panel: "bg-white text-ink border-line",
        line: "border-line",
        divide: "divide-line",
        well: "bg-ivory",
        row: "hover:bg-ivory",
        muted: "text-slate-muted",
        input: "bg-white border-line text-ink placeholder:text-slate-400",
        ghost: "border-line bg-white text-ink hover:bg-neutral-bg",
        chip: "bg-neutral-bg text-slate-muted",
        accent: "text-forest-700",
        danger: "text-danger hover:bg-danger/10",
        dangerSolid: "bg-danger text-white hover:brightness-95",
      };

  const refresh = useCallback(() => setTemplates(getBillTemplates()), []);

  useEffect(() => {
    if (!open) return;
    refresh();
    setPendingDelete(null);
    setName(
      initialName ||
        (currentBill?.title
          ? `${currentBill.title} template`
          : "My bill template"),
    );
  }, [open, currentBill?.title, initialName, refresh]);

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener("bill-templates-updated", refresh);
    return () => window.removeEventListener("bill-templates-updated", refresh);
  }, [open, refresh]);

  // Escape closes (or cancels an open delete prompt first); Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    inputRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (pendingDelete) setPendingDelete(null);
        else onClose?.();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, pendingDelete, onClose]);

  const currentAmount = useMemo(
    () => templateTotal(currentItems),
    [currentItems],
  );
  const sorted = useMemo(
    () =>
      [...templates].sort((a, b) =>
        String(b.updatedAt).localeCompare(String(a.updatedAt)),
      ),
    [templates],
  );

  if (!open) return null;

  const trimmed = name.trim();

  const saveCurrent = (forceNew = false) => {
    if (!trimmed) return;
    setSaving(true);
    try {
      const saved = saveBillTemplate({
        id: forceNew ? null : editingTemplateId,
        name: trimmed,
        bill: currentBill,
        items: currentItems,
        textStyles: currentTextStyles,
        fontFamily: currentFontFamily,
        fontSize: currentFontSize,
      });
      setTemplates(getBillTemplates());
      onSaved?.(saved, forceNew ? null : editingTemplateId);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    setTemplates(deleteBillTemplate(id));
    setPendingDelete(null);
  };

  const btn = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3.5 text-[13px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${FOCUS}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/45 sm:items-center sm:p-6 print:hidden"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bill-templates-title"
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-xl border shadow-[0_24px_64px_rgba(28,31,35,.22)] sm:max-w-2xl sm:rounded-xl ${t.panel}`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6 ${t.line}`}
        >
          <div className="min-w-0">
            <h2
              id="bill-templates-title"
              className="font-display text-[18px] font-semibold tracking-tight"
            >
              Bill templates
            </h2>
            <p className={`mt-1 text-[13px] leading-5 ${t.muted}`}>
              Keep a bill’s details and text styling, then start the next one
              from it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors duration-150 sm:h-10 sm:w-10 ${t.ghost
              .split(" ")
              .filter((c) => c.startsWith("hover:"))
              .join(" ")} ${t.muted} ${FOCUS}`}
          >
            <Ri name="close-line" className="text-[20px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Save current */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCurrent(false);
            }}
            className={`border-b px-5 py-5 sm:px-6 ${t.line} ${t.well}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="bill-template-name"
                className="text-[13px] font-semibold"
              >
                Save current bill as a template
              </label>
              {editingTemplateId && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-medium text-warning">
                  <Ri name="edit-2-line" className="text-[13px]" /> Editing a
                  saved template
                </span>
              )}
            </div>
            <p className={`mt-1 text-[12.5px] ${t.muted}`}>
              {plural((currentItems || []).length, "item")} ·{" "}
              {money(currentAmount)}
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="bill-template-name"
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="e.g. Highway dhaba lunch"
                autoComplete="off"
                className={`h-11 w-full min-w-0 rounded-md border px-3 sm:flex-1 text-[14px] transition-colors duration-150 focus:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-700/20 sm:h-10 ${t.input}`}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || !trimmed}
                  className={`${btn} h-11 flex-1 bg-forest-700 text-ivory hover:bg-forest-800 sm:h-10 sm:flex-none`}
                >
                  <Ri name="save-3-line" className="text-[18px]" />
                  {editingTemplateId ? "Update template" : "Save template"}
                </button>
                {editingTemplateId && (
                  <button
                    type="button"
                    disabled={saving || !trimmed}
                    onClick={() => saveCurrent(true)}
                    className={`${btn} h-11 border sm:h-10 ${t.ghost}`}
                  >
                    <Ri name="file-copy-line" className="text-[18px]" />
                    Save as new
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Saved list */}
          <section
            className="px-5 py-5 sm:px-6"
            aria-labelledby="saved-templates-heading"
          >
            <div className="mb-3 flex items-baseline justify-between">
              <h3
                id="saved-templates-heading"
                className="text-[13px] font-semibold"
              >
                Saved templates
              </h3>
              <span className={`text-[12.5px] ${t.muted}`}>
                {sorted.length}
              </span>
            </div>

            {sorted.length === 0 ? (
              <div
                className={`flex flex-col items-center rounded-lg border border-dashed px-6 py-10 text-center ${t.line}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${t.chip}`}
                >
                  <Ri name="bookmark-3-line" className="text-[22px]" />
                </span>
                <p className="mt-3 text-[14px] font-medium">No templates yet</p>
                <p className={`mt-1 max-w-xs text-[13px] leading-5 ${t.muted}`}>
                  Name the bill above and save it. It will show up here, ready
                  to reuse.
                </p>
              </div>
            ) : (
              <ul
                className={`divide-y overflow-hidden rounded-lg border ${t.line} ${t.divide}`}
              >
                {sorted.map((template) => {
                  const itemCount = template.items?.length || 0;
                  const isCurrent = template.id === editingTemplateId;
                  const confirming = pendingDelete === template.id;
                  const updated = formatDate(template.updatedAt);

                  return (
                    <li
                      key={template.id}
                      className={`transition-colors duration-150 ${confirming ? "" : t.row}`}
                    >
                      {confirming ? (
                        <div
                          className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                          role="alert"
                        >
                          <p className="min-w-0 text-[13.5px]">
                            Delete{" "}
                            <span className="font-semibold">
                              “{template.name}”
                            </span>
                            ? This can’t be undone.
                          </p>
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => setPendingDelete(null)}
                              className={`${btn} flex-1 border sm:flex-none ${t.ghost}`}
                            >
                              Keep template
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDelete(template.id)}
                              className={`${btn} flex-1 sm:flex-none ${t.dangerSolid}`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[14px] font-semibold">
                                {template.name}
                              </p>
                              {isCurrent && (
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${darkMode ? "bg-emerald-400/10 text-emerald-300" : "bg-forest-50 text-forest-700"}`}
                                >
                                  In use
                                </span>
                              )}
                            </div>
                            <p
                              className={`mt-1 truncate text-[12.5px] ${t.muted}`}
                            >
                              {template.bill?.title || "Bill"} ·{" "}
                              {plural(itemCount, "item")} ·{" "}
                              {money(templateTotal(template.items))}
                              {updated && ` · ${updated}`}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onLoad?.(template)}
                              className={`${btn} h-11 flex-1 border sm:h-10 sm:flex-none ${t.ghost}`}
                            >
                              <Ri
                                name="arrow-right-up-line"
                                className="text-[18px]"
                              />
                              Use template
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(template.id)}
                              aria-label={`Delete template ${template.name}`}
                              title="Delete template"
                              className={`${btn} h-11 w-11 !px-0 sm:h-10 sm:w-10 ${t.danger}`}
                            >
                              <Ri
                                name="delete-bin-6-line"
                                className="text-[18px]"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
