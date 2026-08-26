export default function SFDyesToolbar({
  onBack,
  editing,
  onToggleEdit,
  saveFlash,
  onSave,
  onPrint,
  onNew,
}) {
  return (
    <div className="w-full max-w-[920px] mb-4 print:hidden">
      <div
        className="
          relative flex items-center justify-between
          gap-3 rounded-2xl
          border border-slate-200/80
          bg-white px-3 py-2.5
          shadow-[0_4px_20px_rgba(15,23,42,0.06)]
          sm:px-4
        "
      >
        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Back */}
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="
              group flex h-9 items-center gap-2
              rounded-xl border border-slate-200
              bg-white px-3
              text-xs font-semibold text-slate-600
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500/30
            "
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* Editing Status */}
          <div className="hidden items-center gap-2 md:flex">
            <span
              className={`
                h-2 w-2 rounded-full
                ${editing ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}
              `}
            />

            <span className="text-xs font-medium text-slate-500">
              {editing ? "Editing mode" : "View mode"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={onToggleEdit}
            aria-pressed={editing}
            title={editing ? "Done editing" : "Edit form"}
            className={`
              group flex h-9 items-center gap-2
              rounded-xl px-3
              text-xs font-semibold
              transition-all duration-200
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-indigo-500/30
              ${
                editing
                  ? `
                    bg-slate-900
                    text-white
                    shadow-sm
                    hover:bg-slate-800
                  `
                  : `
                    border border-slate-200
                    bg-white
                    text-slate-700
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:text-indigo-700
                  `
              }
            `}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {editing ? (
                <>
                  <path d="m5 12 4 4L19 6" />
                </>
              ) : (
                <>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </>
              )}
            </svg>

            <span className="hidden sm:inline">
              {editing ? "Done" : "Edit"}
            </span>
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={onSave}
            title={saveFlash ? "Saved successfully" : "Save form"}
            className={`
              group flex h-9 items-center gap-2
              rounded-xl px-3
              text-xs font-semibold text-white
              transition-all duration-200
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500/30
              ${
                saveFlash
                  ? `
                    bg-emerald-600
                    shadow-[0_4px_14px_rgba(16,185,129,0.22)]
                  `
                  : `
                    bg-indigo-600
                    shadow-[0_4px_14px_rgba(79,70,229,0.20)]
                    hover:bg-indigo-700
                  `
              }
            `}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {saveFlash ? (
                <path d="m5 12 4 4L19 6" />
              ) : (
                <>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                  <path d="M17 21v-8H7v8" />
                  <path d="M7 3v5h8" />
                </>
              )}
            </svg>

            <span className="hidden sm:inline">
              {saveFlash ? "Saved" : "Save"}
            </span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={onPrint}
            title="Print / PDF"
            className="
              group flex h-9 items-center gap-2
              rounded-xl
              border border-slate-200
              bg-slate-50
              px-3
              text-xs font-semibold text-slate-700
              transition-all duration-200
              hover:border-slate-300
              hover:bg-slate-100
              hover:text-slate-900
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-400/30
            "
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>

            <span className="hidden md:inline">Print / PDF</span>
          </button>

          {/* New */}
          <button
            type="button"
            onClick={onNew}
            title="Create new form"
            className="
              group flex h-9 items-center gap-2
              rounded-xl
              bg-slate-900
              px-3
              text-xs font-semibold text-white
              shadow-sm
              transition-all duration-200
              hover:bg-slate-800
              hover:shadow-md
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-900/30
            "
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>

            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>
    </div>
  );
}
