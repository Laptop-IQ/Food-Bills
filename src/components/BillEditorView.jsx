import React from "react";
import { VIEW } from "../layout/constants";
import BillPreviewPanel from "./BillPreviewPanel";

const EDITOR_FIELDS = [
  ["title", "Restaurant Name", false],
  ["branch", "Branch", false],
  ["franchise", "Franchise", true],
  ["address1", "Address Line 1", true],
  ["address2", "Address Line 2", true],
  ["city", "City", false],
  ["phone", "Phone", false],
  ["email", "Email", true],
  ["gst", "GST Number", false],
  ["date", "Date & Time", false],
  ["dine", "Dine Type", false],
  ["billNo", "Bill No", false],
  ["orderId", "Order ID", true],
  ["table", "Table", false],
  ["user", "User", false],
];

export default function BillEditorView({
  theme,
  darkMode,
  editingId,
  bill,
  setBill,
  items,
  updateItem,
  addItem,
  deleteItem,
  onSave,
  setView,
  storageStatus,
  fontControlProps,
  totals,
  onTogglePaid,
}) {
  const { pageBg, cardBg, cardBorder, inputBg, mutedText } = theme;
  const { grandTotal } = totals;

  const navBg = darkMode
    ? "bg-[#18181b] border-[#2a2a2e]"
    : "bg-white border-gray-200";
  const navBackBtn = darkMode
    ? "bg-[#27272a] hover:bg-[#333] text-neutral-300 border border-[#3a3a3f]"
    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200";
  const grandTotalBadge = darkMode
    ? "bg-[#1a2a1a] text-green-400 border border-green-900"
    : "bg-green-50 text-green-700 border border-green-200";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      {/* ── Sticky top navbar ── */}
      <div
        className={`sticky top-0 z-30 border-b ${navBg} px-6 py-3 no-print`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => setView(VIEW.LIST)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${navBackBtn}`}
          >
            ← Back
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold flex items-center gap-2 mr-auto">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
              {editingId ? "EDIT" : "NEW"}
            </span>
            {editingId ? "Bill Edit Karein" : "Naya Bill"}
          </h1>

          {/* Grand Total badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold ${grandTotalBadge}`}
          >
            ₹{grandTotal.toFixed(0)}
          </div>

          {/* Save */}
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            💾 Save
          </button>

          {/* Preview & Print */}
          <button
            onClick={() => setView(VIEW.PREVIEW)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            🖨️ Preview & Print
          </button>
        </div>

        {/* Status message below nav */}
        {storageStatus && (
          <div className="max-w-7xl mx-auto mt-1">
            <p className="text-xs font-semibold text-green-500 pl-1">
              {storageStatus}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div
            className={`${cardBg} border ${cardBorder} rounded-lg shadow p-5`}
          >
            <h2 className="text-2xl font-bold mb-5">Bill Details</h2>
            <div className="grid grid-cols-2 gap-3">
              {EDITOR_FIELDS.map(([field, placeholder, fullWidth]) => (
                <input
                  key={field}
                  className={`border ${inputBg} p-2 rounded ${fullWidth ? "col-span-2" : ""}`}
                  value={bill[field]}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setBill({ ...bill, [field]: e.target.value })
                  }
                />
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-4 items-center">
                <h2 className="text-2xl font-bold">Items</h2>
                <button
                  onClick={addItem}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  + Add Item
                </button>
              </div>
              <div
                className={`grid grid-cols-12 gap-2 mb-2 text-xs font-bold px-1 ${mutedText}`}
              >
                <div className="col-span-5">Item Name</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1" />
              </div>
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    className={`border ${inputBg} p-2 rounded col-span-5`}
                    value={item.name}
                    placeholder="Item naam"
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    className={`border ${inputBg} p-2 rounded col-span-2`}
                    value={item.qty}
                    onChange={(e) => updateItem(index, "qty", e.target.value)}
                  />
                  <input
                    type="number"
                    className={`border ${inputBg} p-2 rounded col-span-2`}
                    value={item.rate}
                    onChange={(e) => updateItem(index, "rate", e.target.value)}
                  />
                  <div
                    className={`border ${cardBorder} rounded p-2 col-span-2 text-right ${darkMode ? "bg-neutral-700" : "bg-gray-100"}`}
                  >
                    ₹{(item.qty * item.rate).toFixed(2)}
                  </div>
                  <button
                    onClick={() => deleteItem(index)}
                    className="bg-red-500 text-white rounded col-span-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div
              className={`mt-6 pt-4 border-t ${cardBorder} flex items-center gap-3 flex-wrap`}
            >
              <label
                className={`flex items-center gap-2 text-sm font-semibold cursor-pointer select-none ${
                  bill.paid ? "text-[#c8202c]" : mutedText
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!bill.paid}
                  onChange={onTogglePaid}
                  className="h-4 w-4 accent-[#c8202c]"
                />
                Mark as Paid
              </label>
              <span className={`text-xs ${mutedText}`}>
                Buttons upar navbar mein hain ↑
              </span>
            </div>
          </div>

          {/* Right: Display Settings → Live Preview label → Receipt */}
          <BillPreviewPanel
            mutedText={mutedText}
            fontControlProps={fontControlProps}
            bill={bill}
            items={items}
            totals={totals}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
}
