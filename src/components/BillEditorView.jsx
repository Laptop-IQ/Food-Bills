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
    ? "bg-[#111113]/95 border-white/10"
    : "bg-white/95 border-slate-200";

  const navButton = darkMode
    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700";

  const inputClass = `
    w-full
    rounded-xl
    border
    px-3 py-2.5
    text-sm
    outline-none
    transition-all
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/10
    ${inputBg}
  `;

  return (
    <div className={`min-h-screen ${pageBg}`}>
      {/* Top Navigation */}
      <header
        className={`
          sticky top-0 z-40
          border-b backdrop-blur-xl
          ${navBg}
          no-print
        `}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setView(VIEW.LIST)}
            className={`
              rounded-xl border px-3 py-2
              text-sm font-semibold
              transition-all active:scale-95
              ${navButton}
            `}
          >
            <span className="hidden sm:inline">← Back</span>
            <span className="sm:hidden">←</span>
          </button>

          <div className="min-w-0 flex-1 px-1">
            <div className="flex items-center gap-2">
              <span
                className={`
                  rounded-md px-1.5 py-0.5
                  text-[9px] font-black tracking-wider
                  ${
                    editingId
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {editingId ? "EDIT" : "NEW"}
              </span>

              <h1 className="truncate text-sm font-bold sm:text-base">
                {editingId ? "Edit Bill" : "Create New Bill"}
              </h1>
            </div>

            <p className={`mt-0.5 text-[10px] ${mutedText}`}>
              {bill.billNo || "New bill"}
            </p>
          </div>

          <div
            className="
              hidden rounded-xl
              border border-emerald-200
              bg-emerald-50
              px-3 py-2
              text-sm font-black
              text-emerald-700
              sm:block
            "
          >
            ₹{grandTotal.toFixed(0)}
          </div>

          <button
            type="button"
            onClick={onSave}
            className="
              rounded-xl
              bg-emerald-600
              px-3.5 py-2
              text-sm font-bold
              text-white
              shadow-sm
              transition-all
              hover:bg-emerald-700
              active:scale-95
              sm:px-4
            "
          >
            💾 <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setView(VIEW.PREVIEW)}
            className="
              rounded-xl
              bg-blue-600
              px-3.5 py-2
              text-sm font-bold
              text-white
              shadow-sm
              transition-all
              hover:bg-blue-700
              active:scale-95
              sm:px-4
            "
          >
            🖨️
            <span className="hidden sm:inline ml-1">Preview</span>
          </button>
        </div>

        {storageStatus && (
          <div className="mx-auto max-w-7xl px-4 pb-2">
            <p className="text-[10px] font-semibold text-emerald-600">
              {storageStatus}
            </p>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          {/* Editor Card */}
          <section
            className={`
              rounded-2xl
              border
              ${cardBorder}
              ${cardBg}
              p-4
              shadow-sm
              sm:p-5
            `}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">Bill Details</h2>

                <p className={`mt-1 text-xs ${mutedText}`}>
                  Enter restaurant and billing information.
                </p>
              </div>

              <div
                className={`
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  ${
                    darkMode
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  }
                `}
              >
                🧾
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EDITOR_FIELDS.map(([field, placeholder, fullWidth]) => (
                <label key={field} className={fullWidth ? "sm:col-span-2" : ""}>
                  <span
                    className={`
                        mb-1.5 block
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${mutedText}
                      `}
                  >
                    {placeholder}
                  </span>

                  <input
                    className={inputClass}
                    value={bill[field] ?? ""}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        [field]: e.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>

            {/* Items */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Items</h2>

                  <p className={`text-xs ${mutedText}`}>
                    Add products/services to this bill.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="
                    rounded-xl
                    bg-slate-900
                    px-3 py-2
                    text-xs font-bold
                    text-white
                    transition-all
                    hover:bg-slate-700
                    active:scale-95
                  "
                >
                  + Add Item
                </button>
              </div>

              {/* Desktop header */}
              <div
                className={`
                  mb-2 hidden
                  grid-cols-12 gap-2
                  px-1
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  ${mutedText}
                  sm:grid
                `}
              >
                <div className="col-span-5">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
                <div />
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`
                      rounded-2xl
                      border
                      ${cardBorder}
                      p-3
                      transition-all
                    `}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`
                          rounded-md px-2 py-1
                          text-[9px] font-bold
                          ${
                            darkMode
                              ? "bg-white/5 text-neutral-400"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        ITEM #{index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => deleteItem(index)}
                        className="
                          flex h-7 w-7
                          items-center justify-center
                          rounded-lg
                          bg-red-50
                          text-red-500
                          transition-all
                          hover:bg-red-100
                          active:scale-95
                        "
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className={`col-span-2 ${inputClass}`}
                        value={item.name ?? ""}
                        placeholder="Item name"
                        onChange={(e) =>
                          updateItem(index, "name", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        className={inputClass}
                        value={item.qty}
                        placeholder="Qty"
                        onChange={(e) =>
                          updateItem(index, "qty", e.target.value)
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        value={item.rate}
                        placeholder="Rate"
                        onChange={(e) =>
                          updateItem(index, "rate", e.target.value)
                        }
                      />
                    </div>

                    <div
                      className={`
                        mt-2
                        flex items-center justify-between
                        rounded-xl
                        px-3 py-2
                        text-xs
                        ${darkMode ? "bg-white/5" : "bg-slate-50"}
                      `}
                    >
                      <span className={mutedText}>Amount</span>

                      <strong className="text-emerald-600">
                        ₹
                        {(
                          Number(item.qty || 0) * Number(item.rate || 0)
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div
              className={`
                mt-6
                flex flex-col gap-3
                border-t
                ${cardBorder}
                pt-5
                sm:flex-row sm:items-center sm:justify-between
              `}
            >
              <button
                type="button"
                onClick={onTogglePaid}
                className={`
                  flex items-center gap-3
                  rounded-xl
                  border
                  px-3 py-2.5
                  text-sm font-bold
                  transition-all
                  ${
                    bill.paid
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : `${cardBorder} ${mutedText}`
                  }
                `}
              >
                <span
                  className={`
                    flex h-5 w-5 items-center justify-center
                    rounded-md border text-xs
                    ${
                      bill.paid
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300"
                    }
                  `}
                >
                  {bill.paid ? "✓" : ""}
                </span>

                {bill.paid ? "Payment Received" : "Mark as Paid"}
              </button>

              <div className="text-right">
                <p className={`text-[10px] ${mutedText}`}>Grand Total</p>

                <p className="text-xl font-black text-emerald-600">
                  ₹{grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
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
      </main>
    </div>
  );
}
