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
    <div className="w-full max-w-[920px] flex justify-between items-center mb-3 print:hidden gap-2 flex-wrap">
      {/* Left: Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow transition-all"
        >
          ← Back
        </button>
      </div>

      {/* Right: action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onToggleEdit}
          className={`px-4 py-1.5 text-[11px] font-bold rounded border transition-all duration-150 ${
            editing
              ? "bg-emerald-600 text-white border-emerald-700 shadow-inner"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow"
          }`}
        >
          {editing ? "✓ Done Editing" : "✏️ Edit Form"}
        </button>

        <button
          onClick={onSave}
          className={`px-4 py-1.5 text-[11px] font-bold rounded border transition-all duration-150 ${
            saveFlash
              ? "bg-green-500 text-white border-green-600"
              : "bg-amber-500 text-white border-amber-600 hover:bg-amber-400 shadow"
          }`}
        >
          {saveFlash ? "✓ Saved!" : "💾 Save"}
        </button>

        <button
          onClick={onPrint}
          className="px-4 py-1.5 text-[11px] font-bold rounded bg-blue-700 text-white border border-blue-900 hover:bg-blue-800 shadow transition-all"
        >
          🖨️ Print / PDF
        </button>

        <button
          onClick={onNew}
          className="px-4 py-1.5 text-[11px] font-bold rounded bg-purple-700 text-white border border-purple-900 hover:bg-purple-800 shadow"
        >
          ➕ New
        </button>
      </div>
    </div>
  );
}
