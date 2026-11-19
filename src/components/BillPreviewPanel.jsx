import React from "react";
import BillReceipt from "./BillReceipt";

export default function BillPreviewPanel({
  mutedText,
  fontControlProps,
  textStyles = {},
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
  footerMessage = "Thank you. Visit Again.",
  receiptPlacement = null,
}) {
  return (
    <div className="flex min-h-0 w-full flex-col">
      {/* Receipt stage: scrolls on its own when the receipt is taller than the screen */}
      <div className="min-h-0 overflow-auto overscroll-contain rounded-md border border-line bg-neutral-bg sm:p-5">
        <div className="mx-auto w-fit max-w-full">
          <BillReceipt
            bill={bill}
            items={items}
            activeFontCss={fontControlProps?.activeFontCss}
            fontSize={fontControlProps?.fontSize}
            textStyles={textStyles}
            totals={totals}
            showActions={showActions}
            onPrintAndSave={onPrintAndSave}
            onSaveOnly={onSaveOnly}
            storageStatus={storageStatus}
            showPoweredBy={showPoweredBy}
            showGstLines={showGstLines}
            showDividerLines={showDividerLines}
            addressFontSize={addressFontSize}
            footerMessage={footerMessage}
            receiptPlacement={receiptPlacement}
          />
        </div>
      </div>
    </div>
  );
}
