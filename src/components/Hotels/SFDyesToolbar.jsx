const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";

const Ri = ({ name, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name} leading-none ${className}`} />
);

export default function SFDyesToolbar({
  onBack,
  editing,
  onToggleEdit,
  saveFlash,
  onSave,
  onPrint,
  onNew,
  onTemplates,
}) {
  const btn = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors duration-150 active:translate-y-px max-[380px]:px-2.5 ${FOCUS}`;
  const ghost = `${btn} border border-line bg-white text-ink hover:bg-neutral-bg`;
  const label = "hidden sm:inline";

  return (
    <div
      role="toolbar"
      aria-label="Expense form actions"
      className="sticky top-14 z-30 mb-4 w-full max-w-[920px] rounded-md border border-line bg-white/95 px-3 py-2.5 shadow-[0_1px_2px_rgba(28,31,35,0.04)] backdrop-blur md:top-3 print:hidden"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          title="Back"
          className={ghost}
        >
          <Ri name="arrow-left-line" className="text-[18px]" />
          <span className={label}>Back</span>
        </button>

        <div className="mx-1 hidden h-6 w-px bg-line md:block" />

        <div
          className="hidden min-w-0 items-center gap-2 md:flex"
          role="status"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${editing ? "bg-success" : "bg-slate-muted/50"}`}
          />
          <span className="truncate text-[13px] font-medium text-slate-muted">
            {editing ? "Editing mode" : "View mode"}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 max-[380px]:gap-1">
          <button
            type="button"
            onClick={onToggleEdit}
            aria-pressed={editing}
            title={editing ? "Done editing" : "Edit form"}
            className={`${btn} border ${
              editing
                ? "border-forest-700/30 bg-forest-50 text-forest-800 hover:bg-forest-50/70"
                : "border-line bg-white text-ink hover:bg-neutral-bg"
            }`}
          >
            <Ri
              name={editing ? "check-line" : "edit-2-line"}
              className="text-[18px]"
            />
            <span className={label}>{editing ? "Done" : "Edit"}</span>
          </button>

          <button
            type="button"
            onClick={onTemplates}
            title="Templates"
            aria-label="Templates"
            className={ghost}
          >
            <Ri name="bookmark-3-line" className="text-[18px]" />
            <span className={label}>Templates</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            title="Print / PDF"
            aria-label="Print or PDF"
            className={ghost}
          >
            <Ri name="printer-line" className="text-[18px]" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>

          <button
            type="button"
            onClick={onNew}
            title="Create new form"
            aria-label="New form"
            className={ghost}
          >
            <Ri name="add-line" className="text-[18px]" />
            <span className={label}>New</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            title={saveFlash ? "Saved successfully" : "Save form"}
            aria-label="Save form"
            className={`${btn} text-ivory ${saveFlash ? "bg-success" : "bg-forest-700 hover:bg-forest-800"}`}
          >
            <Ri
              name={saveFlash ? "check-line" : "save-3-line"}
              className="text-[18px]"
            />
            <span className={label}>{saveFlash ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
