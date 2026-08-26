import { ROWS } from "./expenseRows";
import { ni } from "./numberUtils";
import { generatePrintHTML } from "./printTemplate";

function printRecord(r) {
  const t = ROWS.reduce((s, row) => s + ni(r[row.ak]), 0);
  const n = t - ni(r.lessAdvance);
  const sv = ROWS.reduce((s, row) => (row.sk ? s + ni(r[row.sk]) : s), 0);
  const html = generatePrintHTML(r, t, n, sv);
  const w = window.open("", "_blank");
  w.document.open();
  w.document.write(html);
  w.document.close();
  setTimeout(() => {
    w.focus();
    w.print();
  }, 300);
}

export default function SavedRecordsPanel({
  savedRecords,
  selectedId,
  onLoad,
  onDelete,
}) {
  return (
    <div className="w-full max-w-[920px] mt-5 bg-white rounded-lg shadow-lg p-4 print:hidden">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-sm text-gray-800">
          💾 Saved Records
          {savedRecords.length > 0 && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
              {savedRecords.length}
            </span>
          )}
        </h2>
        {savedRecords.length > 0 && (
          <p className="text-[10px] text-gray-400">
            Browser mein permanently saved hai
          </p>
        )}
      </div>

      {savedRecords.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          Koi saved record nahi hai. Form fill karke 💾 Save ya 🖨️ Print
          karein.
        </p>
      ) : (
        <div className="space-y-2">
          {savedRecords.map((r) => (
            <div
              key={r.id}
              className={`border rounded-lg p-3 flex justify-between items-center transition-all ${
                selectedId === r.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-blue-700 truncate">
                  {r.name}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Voucher:{" "}
                  <span className="font-semibold">{r.voucherNo || "—"}</span>
                  &nbsp;|&nbsp; Date:{" "}
                  <span className="font-semibold">{r.date || "—"}</span>
                  &nbsp;|&nbsp; Net:{" "}
                  <span className="font-semibold text-green-700">
                    ₹{r.net}
                  </span>
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Saved: {r.savedAt}
                </p>
              </div>

              <div className="flex gap-2 ml-3 shrink-0">
                <button
                  onClick={() => onLoad(r)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => printRecord(r)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                >
                  🖨️
                </button>

                <button
                  onClick={() => onDelete(r.id)}
                  className="px-3 py-1.5 text-[11px] font-bold bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
