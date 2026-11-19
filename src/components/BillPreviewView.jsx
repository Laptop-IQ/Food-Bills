import React, { useEffect, useState } from "react";
import { VIEW } from "../layout/constants";
import TextStyleControls from "./TextStyleControls";
import { FONT_FAMILIES } from "../layout/fonts";
import BillReceipt from "./BillReceipt";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export default function BillPreviewView({
  setView,
  fontControlProps,
  textStyles = {},
  selectedTextField = "gst",
  setSelectedTextField,
  onTextStyleChange,
  onTextStyleReset,
  onTextStylesResetAll,
  bill = {},
  items = [],
  totals = {},
  showGstLines = true,
  onShowGstLinesChange,
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
  onTogglePaid,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Receipt settings
  const [showPoweredBy, setShowPoweredBy] = useState(() => {
    try {
      const saved = localStorage.getItem("foodBills.showPoweredBy");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });
  const [showDividerLines, setShowDividerLines] = useState(() => {
    try {
      const saved = localStorage.getItem("foodBills.showDividerLines");
      return saved === null ? true : saved === "true";
    } catch {
      return true;
    }
  });
  const [footerMessage, setFooterMessage] = useState(() => {
    try {
      return (
        localStorage.getItem("foodBills.footerMessage") ||
        "Thank you. Visit Again."
      );
    } catch {
      return "Thank you. Visit Again.";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("foodBills.showPoweredBy", String(showPoweredBy));
    } catch {
      // storage unavailable: setting will not persist
    }
  }, [showPoweredBy]);

  useEffect(() => {
    try {
      localStorage.setItem("foodBills.footerMessage", footerMessage);
    } catch {
      // storage unavailable: setting will not persist
    }
  }, [footerMessage]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "foodBills.showDividerLines",
        String(showDividerLines),
      );
    } catch {
      // storage unavailable: setting will not persist
    }
  }, [showDividerLines]);
  const [receiptPlacement] = useState(() => ({
    // Keep the print offset subtle so the bill never moves outside the paper.
    x: Math.round(Math.random() * 16 - 8),
    y: Math.round(Math.random() * 10 - 5),
    rotate: Number((Math.random() * 1.2 - 0.6).toFixed(2)),
  }));

  const isPaid = Boolean(bill?.paid);
  const grandTotal = Number(totals?.grandTotal || 0);

  const ri = (name, cls = "") => (
    <i aria-hidden="true" className={`ri-${name} leading-none ${cls}`} />
  );
  const focus =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";
  const field = `h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15`;
  const ghost = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-line bg-white px-3.5 text-[13px] font-medium text-ink transition-colors duration-150 hover:bg-neutral-bg ${focus}`;
  const primary = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-forest-700 px-4 text-[13px] font-semibold text-ivory transition-colors duration-150 hover:bg-forest-800 ${focus}`;

  const mobileActions = (
    <div className="flex gap-2.5">
      <button
        type="button"
        onClick={onPrintAndSave}
        className={`${primary} h-11 flex-1`}
      >
        {ri("printer-line", "text-[18px]")} Print &amp; save
      </button>
      <button
        type="button"
        onClick={onSaveOnly}
        className={`${ghost} h-11 flex-1`}
      >
        {ri("save-3-line", "text-[18px]")} Save
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory text-ink">
      {/* Top bar */}
      <header className="no-print sticky top-14 z-40 border-b border-line bg-ivory/95 backdrop-blur md:top-0">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-5 px-3 sm:px-6">
          <button
            type="button"
            onClick={() => setView(VIEW.LIST)}
            aria-label="Back to saved bills"
            className={ghost}
          >
            {ri("arrow-left-line", "text-[18px]")}
            Bills
          </button>

          <div className="min-w-0 flex-1" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView(VIEW.EDITOR)}
              aria-label="Edit bill"
              className={ghost}
            >
              {ri("edit-2-line", "text-[18px]")}
              <span className="hidden sm:inline">Edit bill</span>
            </button>
            <div className="hidden items-center gap-2 lg:flex">
              <button type="button" onClick={onSaveOnly} className={ghost}>
                {ri("save-3-line", "text-[18px]")} Save
              </button>
              <button
                type="button"
                onClick={onPrintAndSave}
                className={primary}
              >
                {ri("printer-line", "text-[18px]")} Print &amp; save
              </button>
            </div>
          </div>
        </div>
        {hasValue(storageStatus) && (
          <p
            role="status"
            className="mx-auto max-w-7xl px-4 pb-2 text-[11px] font-medium text-success sm:px-6"
          >
            {storageStatus}
          </p>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-3 pb-28 pt-1 sm:px-6 sm:pt-8 lg:pb-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,520px)_380px] lg:justify-center lg:gap-8">
          {/* Settings */}
          <aside className="no-print order-2 mx-auto w-full min-w-0 max-w-[520px] lg:order-1 lg:mx-0">
            <section className="rounded-md border border-line bg-white">
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                aria-expanded={isSettingsOpen}
                className={`flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6 ${focus}`}
              >
                <span>
                  <span className="block font-display text-[17px] font-semibold tracking-tight">
                    Receipt settings
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-muted">
                    Payment, typography and what prints.
                  </span>
                </span>
                {ri(
                  "arrow-down-s-line",
                  `text-[22px] text-slate-muted transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`,
                )}
              </button>

              {isSettingsOpen && (
                <div className="divide-y divide-line border-t border-line">
                  <Group title="Font">
                    <select
                      value={fontControlProps?.fontFamily || "mono"}
                      onChange={(event) =>
                        fontControlProps?.onFontFamilyChange?.(
                          event.target.value,
                        )
                      }
                      className={field}
                      aria-label="Receipt font family"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option
                          key={font.id}
                          value={font.id}
                          style={{ fontFamily: font.css }}
                        >
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </Group>

                  <Group
                    title="Text & spacing"
                    hint="Size, weight, gaps and alignment for each line."
                    collapsible
                    defaultOpen={false}
                  >
                    <TextStyleControls
                      textStyles={textStyles}
                      selectedField={selectedTextField}
                      onFieldChange={setSelectedTextField}
                      onStyleChange={onTextStyleChange}
                      onResetField={onTextStyleReset}
                      onResetAll={onTextStylesResetAll}
                      baseFontSize={fontControlProps?.fontSize || 12}
                    />
                  </Group>

                  <Group
                    title="Receipt options"
                    hint="Control what appears on the receipt."
                  >
                    <div className="-my-1 divide-y divide-line">
                      <SettingRow
                        title="Powered by TMBill"
                        description="Show branding on receipt"
                      >
                        <Toggle
                          label="Powered by TMBill"
                          checked={showPoweredBy}
                          onChange={setShowPoweredBy}
                        />
                      </SettingRow>
                      <SettingRow
                        title="Subtotal & tax breakdown"
                        description="Display detailed tax information"
                      >
                        <Toggle
                          label="Subtotal and tax breakdown"
                          checked={showGstLines}
                          onChange={onShowGstLinesChange}
                        />
                      </SettingRow>
                      <SettingRow
                        title="Dashed divider lines"
                        description="Show dashed separators"
                      >
                        <Toggle
                          label="Dashed divider lines"
                          checked={showDividerLines}
                          onChange={setShowDividerLines}
                        />
                      </SettingRow>
                    </div>
                    <label className="mt-4 block">
                      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-muted">
                        Thank-you message
                      </span>
                      <select
                        value={footerMessage}
                        onChange={(event) =>
                          setFooterMessage(event.target.value)
                        }
                        className={field}
                      >
                        <option value="Thank you. Visit Again.">
                          Thank you. Visit Again.
                        </option>
                        <option
                          value={"Thank You For Your Visit.\nHave A Nice Day!"}
                        >
                          Thank You For Your Visit. / Have A Nice Day!
                        </option>
                        <option value="E&OE. Thank you. Visit Again.">
                          E&amp;OE. Thank you. Visit Again.
                        </option>
                      </select>
                    </label>
                  </Group>
                </div>
              )}
            </section>
          </aside>

          {/* Preview stage */}
          <section className="order-1 mx-auto flex w-full min-w-0 max-w-[400px] flex-col lg:sticky lg:top-[88px] lg:order-2 lg:mx-0 lg:max-w-none lg:max-h-[calc(100dvh-104px)] lg:self-start">
            <div className="min-h-0 w-full overflow-auto overscroll-contain rounded-md border border-line bg-neutral-bg p-1 sm:p-5">
              <div className="mx-auto w-fit max-w-full">
                <BillReceipt
                  bill={bill}
                  items={items}
                  activeFontCss={fontControlProps.activeFontCss}
                  fontSize={fontControlProps.fontSize}
                  textStyles={textStyles}
                  totals={totals}
                  showActions={false}
                  onPrintAndSave={onPrintAndSave}
                  onSaveOnly={onSaveOnly}
                  storageStatus={storageStatus}
                  showPoweredBy={showPoweredBy}
                  showGstLines={showGstLines}
                  showDividerLines={showDividerLines}
                  footerMessage={footerMessage}
                  receiptPlacement={receiptPlacement}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile action bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        {mobileActions}
      </div>
    </div>
  );
}

function Group({
  title,
  hint,
  collapsible = false,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `group-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const heading = (
    <div className="min-w-0 text-left">
      <h3 className="font-display text-[14px] font-semibold tracking-tight">
        {title}
      </h3>
      {hint && <p className="mt-0.5 text-xs text-slate-muted">{hint}</p>}
    </div>
  );
  if (!collapsible) {
    return (
      <div className="px-4 py-5 sm:px-6">
        {heading}
        <div className="mt-3">{children}</div>
      </div>
    );
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-3 px-4 py-5 transition-colors duration-150 hover:bg-neutral-bg/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-700/50 sm:px-6"
      >
        {heading}
        <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-slate-muted">
          {open ? "Hide" : "Show"}
          <i
            aria-hidden="true"
            className={`ri-arrow-down-s-line text-[20px] leading-none transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div id={id} className="px-4 pb-5 sm:px-6">
          {children}
        </div>
      )}
    </div>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-slate-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50 ${
        checked ? "bg-forest-700" : "bg-line"
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
