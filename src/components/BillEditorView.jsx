import React, { useState } from "react";
import { VIEW } from "../layout/constants";
import BillPreviewPanel from "./BillPreviewPanel";
import TextStyleControls from "./TextStyleControls";
import DateTimePicker from "./DateTimePicker";

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

function Section({ t, title, hint, action, collapsible = false, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const showBody = !collapsible || open;
  const headingId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const headBody = (
    <div className="min-w-0 text-left">
      <h2 id={headingId} className="font-display text-[17px] font-semibold tracking-tight">{title}</h2>
      {hint && <p className={`mt-0.5 text-xs ${t.muted}`}>{hint}</p>}
    </div>
  );
  return (
    <section className={`rounded-md border ${t.card}`}>
      <div className={`flex items-start justify-between gap-3 ${showBody ? `border-b ${t.line.split(" ")[0]}` : ""}`}>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`${headingId}-body`}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-md px-4 py-4 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50 sm:px-6"
          >
            {headBody}
            <span className={`flex shrink-0 items-center gap-1.5 text-[12px] font-medium ${t.muted}`}>
              {open ? "Hide" : "Show"}
              <i aria-hidden="true" className={`ri-arrow-down-s-line text-[20px] leading-none transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </span>
          </button>
        ) : (
          <div className="min-w-0 px-4 py-4 sm:px-6">{headBody}</div>
        )}
        {action && <div className="px-4 py-3 sm:px-6 sm:py-3.5">{action}</div>}
      </div>
      {showBody && (
        <div id={`${headingId}-body`} className="px-4 py-5 sm:px-6">
          {children}
        </div>
      )}
    </section>
  );
}

export default function BillEditorView({
  editingId,
  bill,
  setBill,
  items,
  updateItem,
  addItem,
  deleteItem,
  onSave,
  onSaveTemplate,
  setView,
  storageStatus,
  fontControlProps,
  textStyles,
  selectedTextField,
  setSelectedTextField,
  onTextStyleChange,
  onTextStyleReset,
  onTextStylesResetAll,
  totals,
  onTogglePaid,
}) {
  const { grandTotal } = totals;
  const ri = (name, cls = "") => <i aria-hidden="true" className={`ri-${name} leading-none ${cls}`} />;

  const t = {
    page: "bg-ivory text-ink",
    nav: "bg-ivory/95 border-line",
    card: "bg-white border-line",
    line: "border-line divide-line",
    muted: "text-slate-muted",
    ghost: "border-line bg-white text-ink hover:bg-neutral-bg",
    input: "bg-white border-line text-ink placeholder:text-slate-400",
    soft: "bg-neutral-bg/60",
  };

  const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";
  const btn = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3.5 text-[13px] font-medium transition-colors duration-150 ${FOCUS}`;
  const label = `mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] ${t.muted}`;
  const inputClass = `h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15 ${t.input}`;

  return (
    <div className={`min-h-screen ${t.page}`}>
      {/* Top bar */}
      <header className={`sticky top-14 z-40 border-b backdrop-blur md:top-0 no-print ${t.nav}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:px-6">
          <button type="button" onClick={() => setView(VIEW.LIST)} aria-label="Back to saved bills" className={`${btn} border ${t.ghost} !px-3`}>
            {ri("arrow-left-line", "text-[18px]")}
            <span className="hidden sm:inline">Saved bills</span>
          </button>

          <div className="hidden h-6 w-px sm:block bg-line" />

          <div className="hidden flex-1 max-[379px]:block" />

          <div className="min-w-0 flex-1 max-[379px]:hidden">
            <div className="flex items-center gap-2">
              
            </div>
          </div>

          <div className="hidden h-6 w-px sm:block bg-line" />

          <div className="flex items-center gap-8">
            <button type="button" onClick={onSaveTemplate} aria-label="Save as template" title="Save as template" className={`${btn} border ${t.ghost} !px-5`}>
              {ri("bookmark-3-line", "text-[18px]")}
              <span className="hidden xl:inline">Template</span>
            </button>
            <button type="button" onClick={onSave} aria-label="Save bill" title="Save bill" className={`${btn} border ${t.ghost} !px-5`}>
              {ri("save-3-line", "text-[18px]")}
              <span className="hidden md:inline">Save</span>
            </button>
            <button type="button" onClick={() => setView(VIEW.PREVIEW)} aria-label="Preview and print" className={`${btn} bg-forest-700 text-ivory hover:bg-forest-800`}>
              {ri("eye-line", "text-[18px]")}
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
        {storageStatus && (
          <p role="status" className="mx-auto max-w-7xl px-4 pb-2 text-[11px] font-medium text-success sm:px-6">
            {storageStatus}
          </p>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-6 sm:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          {/* Form column */}
          <div className="min-w-0 space-y-5">
            <Section t={t} title="Bill details" hint="Restaurant and billing information.">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {EDITOR_FIELDS.map(([field, placeholder, fullWidth]) => {
                  const Wrapper = field === "date" ? "div" : "label";
                  return (
                    <Wrapper key={field} className={fullWidth ? "sm:col-span-2" : ""}>
                      <span className={label}>{placeholder}</span>
                      {field === "date" ? (
                        <DateTimePicker
                          value={bill.date ?? ""}
                          inputClass={inputClass}
                          onChange={(date) => setBill({ ...bill, date })}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={bill[field] ?? ""}
                          placeholder={placeholder}
                          onChange={(e) => setBill({ ...bill, [field]: e.target.value })}
                        />
                      )}
                    </Wrapper>
                  );
                })}
              </div>
            </Section>

            <Section t={t} title="Text formatting" hint="Size, weight and spacing apply instantly to the preview and print/PDF." collapsible defaultOpen={false}>
              <TextStyleControls
                textStyles={textStyles}
                selectedField={selectedTextField}
                onFieldChange={setSelectedTextField}
                onStyleChange={onTextStyleChange}
                onResetField={onTextStyleReset}
                onResetAll={onTextStylesResetAll}
                baseFontSize={fontControlProps?.fontSize || 12}
              />
            </Section>

            <Section
              t={t}
              title="Items"
              hint="Products and services on this bill."
              action={
                <button type="button" onClick={addItem} className={`${btn} bg-ink text-ivory hover:bg-ink/85`}>
                  {ri("add-line", "text-[18px]")} Add item
                </button>
              }
            >
              {items.length === 0 ? (
                <div className={`rounded-md border border-dashed px-4 py-10 text-center ${t.line.split(" ")[0]}`}>
                  <p className="text-sm font-medium">No items yet</p>
                  <p className={`mt-1 text-xs ${t.muted}`}>Use “Add item” to start the bill.</p>
                </div>
              ) : (
                <div>
                  <div className={`hidden grid-cols-[minmax(0,1fr)_88px_112px_112px_40px] gap-3 px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] md:grid ${t.muted}`} aria-hidden="true">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span className="text-right">Amount</span>
                    <span />
                  </div>

                  <ul className={`divide-y ${t.line.split(" ")[1]}`}>
                    {items.map((item, index) => (
                      <li key={item.id} className="grid grid-cols-2 items-center gap-2.5 py-3.5 first:pt-1 md:grid-cols-[minmax(0,1fr)_88px_112px_112px_40px] md:gap-3 md:py-3">
                        <input
                          className={`${inputClass} col-span-2 md:col-span-1`}
                          value={item.name ?? ""}
                          placeholder={`Item ${index + 1} name`}
                          aria-label={`Item ${index + 1} name`}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          inputMode="decimal"
                          className={`${inputClass} tabular-nums`}
                          value={item.qty}
                          placeholder="Qty"
                          aria-label={`Item ${index + 1} quantity`}
                          onChange={(e) => updateItem(index, "qty", e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          className={`${inputClass} tabular-nums`}
                          value={item.rate}
                          placeholder="Rate"
                          aria-label={`Item ${index + 1} rate`}
                          onChange={(e) => updateItem(index, "rate", e.target.value)}
                        />
                        <div className={`flex h-10 items-center justify-between rounded-md px-3 text-sm md:justify-end md:bg-transparent md:px-0 ${t.soft}`}>
                          <span className={`text-xs md:hidden ${t.muted}`}>Amount</span>
                          <strong className="font-semibold tabular-nums">₹{(Number(item.qty || 0) * Number(item.rate || 0)).toFixed(2)}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteItem(index)}
                          title="Remove item"
                          aria-label={`Remove item ${index + 1}`}
                          className={`flex h-10 w-full items-center justify-center rounded-md transition-colors duration-150 ${FOCUS} ${t.muted} hover:bg-danger/10 hover:text-danger md:h-9 md:w-9`}
                        >
                          {ri("delete-bin-6-line", "text-[18px]")}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            {/* Payment + total */}
            <section className={`flex flex-col gap-4 rounded-md border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${t.card}`}>
              <button
                type="button"
                onClick={onTogglePaid}
                aria-pressed={Boolean(bill.paid)}
                className={`${btn} h-11 justify-start border ${
                  bill.paid ? "border-success/30 bg-success/10 text-success" : `border-line ${t.muted} hover:bg-neutral-bg/60`
                }`}
              >
                {ri(bill.paid ? "checkbox-circle-fill" : "checkbox-blank-circle-line", "text-[19px]")}
                {bill.paid ? "Payment received" : "Mark as paid"}
              </button>
              <div className="flex items-baseline justify-between gap-4 sm:block sm:text-right">
                <p className={`text-[11px] font-medium uppercase tracking-[0.12em] ${t.muted}`}>Grand total</p>
                <p className="font-display text-[28px] font-semibold leading-none tabular-nums">₹{grandTotal.toFixed(2)}</p>
              </div>
            </section>
          </div>

          {/* Live preview: stays in view while the form scrolls */}
          <div className="mx-auto w-full max-w-[400px] lg:mx-0 lg:max-w-none lg:sticky lg:top-[88px] lg:flex lg:max-h-[calc(100dvh-104px)] lg:flex-col lg:self-start">
            <BillPreviewPanel
              mutedText={t.muted}
              fontControlProps={fontControlProps}
              textStyles={textStyles}
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
