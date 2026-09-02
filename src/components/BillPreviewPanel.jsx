import React, { useState } from "react";
import FontControls from "./FontControls";
import BillReceipt from "./BillReceipt";

export default function BillPreviewPanel({
  mutedText,
  fontControlProps,
  bill,
  items,
  totals,
  showActions,
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
}) {
  // New state for toggle controls
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showGstLines, setShowGstLines] = useState(true);
  const [addressFontSize, setAddressFontSize] = useState(12);
  const [showDividerLines, setShowDividerLines] = useState(true);

  return (
    <div>
      <FontControls {...fontControlProps} />

      {/* ===================================
          NEW CONTROLS SECTION
      ==================================== */}
      <div className={`mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 ${mutedText}`}>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Receipt Options</h3>

        {/* Powered By Toggle */}
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPoweredBy}
              onChange={(e) => setShowPoweredBy(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Show "Powered by TMBill"
            </span>
          </label>
        </div>

        {/* Subtotal/Tax Breakdown Toggle */}
        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGstLines}
              onChange={(e) => setShowGstLines(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Show Subtotal & Tax Breakdown
            </span>
          </label>
        </div>

        {/* Address Font Size Control */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-700">
            Address Font Size
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddressFontSize(Math.max(10, addressFontSize - 1))}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-100"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">
              {addressFontSize}px
            </span>
            <button
              onClick={() => setAddressFontSize(Math.min(16, addressFontSize + 1))}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Divider Lines Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDividerLines}
              onChange={(e) => setShowDividerLines(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Show Dashed Lines (-----)
            </span>
          </label>
        </div>
      </div>

      {/* ===================================
          LIVE PREVIEW LABEL
      ==================================== */}
      <p
        className={`text-center mb-3 font-semibold text-sm tracking-wide ${mutedText}`}
      >
        ── Live Preview ──
      </p>

      {/* ===================================
          BILL RECEIPT PREVIEW
      ==================================== */}
      <div className="flex justify-center">
        <BillReceipt
          bill={bill}
          items={items}
          activeFontCss={fontControlProps.activeFontCss}
          fontSize={fontControlProps.fontSize}
          totals={totals}
          showActions={showActions}
          onPrintAndSave={onPrintAndSave}
          onSaveOnly={onSaveOnly}
          storageStatus={storageStatus}
          // Pass new props
          showPoweredBy={showPoweredBy}
          showGstLines={showGstLines}
          addressFontSize={addressFontSize}
          showDividerLines={showDividerLines}
        />
      </div>
    </div>
  );
}
