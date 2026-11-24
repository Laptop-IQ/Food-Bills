import React from "react";
import { FONT_FAMILIES } from "../layout/fonts";

export default function FontControls({
  fontFamily,
  activeFontCss,
  onFontFamilyChange,
  onReset,
}) {
  const panelBg = "bg-white border-gray-200";
  const sublabel = "text-gray-400";
  const resetBtn = "text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200";
  const selectStyle = "bg-white border-gray-200 text-gray-800 hover:border-gray-400 focus:border-blue-500";
  const stepBtn = "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30";

  return (
    <div
      className={`${panelBg} border rounded-lg mb-4 overflow-hidden shadow-sm`}
    >
      <div className="flex items-end gap-3 px-4 py-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="relative -mt-10">
            <select
              value={fontFamily}
              onChange={(e) => onFontFamilyChange(e.target.value)}
              style={{ fontFamily: activeFontCss }}
              className={`w-full appearance-none border rounded-xl pl-3 pr-7 py-2 text-[12px] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${selectStyle}`}
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.id} value={f.id} style={{ fontFamily: f.css }}>
                  {f.label}
                </option>
              ))}
            </select>
            <span
              className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] ${sublabel}`}
            >
              ▼
            </span>
          </div>
        </div>

        <div
          className="w-px self-stretch bg-gray-100"
        />

        <button
          onClick={onReset}
          className={`self-end mb-1 text-[18px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-150 shrink-0 ${resetBtn}`}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
