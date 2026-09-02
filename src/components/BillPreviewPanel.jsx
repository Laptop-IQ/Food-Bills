import React from "react";
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

  // Receipt settings come from BillPreviewView
  showPoweredBy = true,
  showGstLines = true,
  addressFontSize = 12,
  showDividerLines = true,
}) {
  return (
    <div className="w-full">
      {/* =====================================================
          LIVE PREVIEW
          NO SETTINGS / FONT CONTROLS HERE
      ====================================================== */}
      <p
        className={`mb-3 text-center text-sm font-semibold tracking-wide ${mutedText}`}
      >
        ── Live Preview ──
      </p>

      {/* =====================================================
          BILL RECEIPT
          PRINT VIEW — UNCHANGED
      ====================================================== */}
      <div className="flex justify-center">
        <BillReceipt
          bill={bill}
          items={items}
          activeFontCss={fontControlProps?.activeFontCss}
          fontSize={fontControlProps?.fontSize}
          totals={totals}
          showActions={showActions}
          onPrintAndSave={onPrintAndSave}
          onSaveOnly={onSaveOnly}
          storageStatus={storageStatus}

          showPoweredBy={showPoweredBy}
          showGstLines={showGstLines}
          addressFontSize={addressFontSize}
          showDividerLines={showDividerLines}
        />
      </div>
    </div>
  );
}
