import { useEffect, useMemo, useState } from "react";

const formatWhen = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const filledCount = (data) =>
  Object.values(data || {}).filter((v) => String(v ?? "").trim() !== "").length;

export default function ExpenseTemplatesModal({
  open,
  onClose,
  templates,
  onSave,
  onUse,
  onOverwrite,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [include, setInclude] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingOverwrite, setPendingOverwrite] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sorted = useMemo(
    () =>
      [...templates].sort((a, b) =>
        String(b.updatedAt).localeCompare(String(a.updatedAt)),
      ),
    [templates],
  );

  if (!open) return null;

  const trimmed = name.trim();
  const sameName = templates.some(
    (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
  );

  const submit = (e) => {
    e.preventDefault();
    if (!trimmed) return;
    onSave(trimmed, include);
    setName("");
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm print:hidden sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Expense templates"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-md"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-ink">Templates</h2>
            <p className="text-xs text-slate-muted">
              Save this form once, reuse it for the next trip.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-muted hover:bg-neutral-bg hover:text-ink"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Save current form */}
        <form
          onSubmit={submit}
          className="space-y-2 border-b border-line bg-neutral-bg/60 px-5 py-4"
        >
          <label
            className="block text-xs font-semibold text-slate-muted"
            htmlFor="tpl-name"
          >
            Save current form as template
          </label>
          <div className="flex gap-2">
            <input
              id="tpl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pune client visit"
              maxLength={60}
              className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-50"
            />
            <button
              type="submit"
              disabled={!trimmed}
              className="shrink-0 rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sameName ? "Update" : "Save"}
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-muted">
            <input
              type="checkbox"
              checked={include}
              onChange={(e) => setInclude(e.target.checked)}
              className="h-4 w-4 rounded border-line text-forest-700"
            />
            Also keep date &amp; voucher no.
          </label>
          {sameName && (
            <p className="text-[11px] text-warning">
              A template with this name exists — saving will replace it.
            </p>
          )}
        </form>

        {/* List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {sorted.length === 0 ? (
            <div className="rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-slate-muted">
              No templates yet. Fill the form, then save it above.
            </div>
          ) : (
            <ul className="space-y-2.5">
              {sorted.map((t) => (
                <li
                  key={t.id}
                  className="rounded-md border border-line bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-ink">
                        {t.name}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-slate-muted">
                        {[t.data?.name, t.data?.places]
                          .filter(Boolean)
                          .join(" · ") ||
                          `${filledCount(t.data)} fields filled`}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        Updated {formatWhen(t.updatedAt)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUse(t)}
                      className="shrink-0 rounded-md bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-95"
                    >
                      Use
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center justify-end gap-1 border-t border-line pt-2 text-[11px] font-semibold">
                    {pendingOverwrite === t.id ? (
                      <>
                        <span className="mr-auto text-slate-muted">
                          Replace with current form?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onOverwrite(t.id);
                            setPendingOverwrite(null);
                          }}
                          className="rounded-md bg-forest-700 px-2.5 py-1 text-white"
                        >
                          Yes, replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingOverwrite(null)}
                          className="rounded-md px-2.5 py-1 text-slate-muted hover:bg-neutral-bg"
                        >
                          Cancel
                        </button>
                      </>
                    ) : pendingDelete === t.id ? (
                      <>
                        <span className="mr-auto text-slate-muted">
                          Delete this template?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(t.id);
                            setPendingDelete(null);
                          }}
                          className="rounded-md bg-danger px-2.5 py-1 text-white"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(null)}
                          className="rounded-md px-2.5 py-1 text-slate-muted hover:bg-neutral-bg"
                        >
                          Keep
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setPendingOverwrite(t.id)}
                          className="rounded-md px-2.5 py-1 text-forest-700 hover:bg-forest-50"
                        >
                          Update from form
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(t.id)}
                          className="rounded-md px-2.5 py-1 text-danger hover:bg-danger/10"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line bg-neutral-bg/60 px-5 py-2.5 text-[11px] text-slate-muted">
          Using a template replaces what is currently in the form.
        </div>
      </div>
    </div>
  );
}
