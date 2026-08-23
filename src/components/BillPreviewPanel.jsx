import React from "react";
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
  return (
    <div>
      <FontControls {...fontControlProps} />

      <p
        className={`text-center mb-3 font-semibold text-sm tracking-wide ${mutedText}`}
      >
        ── Live Preview ──
      </p>

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
        />
      </div>
    </div>
  );
}
