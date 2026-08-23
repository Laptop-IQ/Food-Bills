import React from "react";
import { VIEW } from "../layout/constants";
import BillPreviewPanel from "./BillPreviewPanel";

export default function BillPreviewView({
  theme,
  setView,
  fontControlProps,
  bill,
  items,
  totals,
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
}) {
  const { pageBg, mutedText } = theme;

  return (
    <div className={`min-h-screen ${pageBg} p-6`}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6 no-print">
          <button
            onClick={() => setView(VIEW.EDITOR)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            ← Editor par Wapas
          </button>
          <button
            onClick={() => setView(VIEW.LIST)}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold"
          >
            📋 Saved Bills
          </button>
        </div>

        <BillPreviewPanel
          mutedText={mutedText}
          fontControlProps={fontControlProps}
          bill={bill}
          items={items}
          totals={totals}
          showActions={true}
          onPrintAndSave={onPrintAndSave}
          onSaveOnly={onSaveOnly}
          storageStatus={storageStatus}
        />
      </div>
    </div>
  );
}
