import React from "react";
import { FONT_FAMILIES } from "../layout/fonts";
import { FONT_SIZE_MIN, FONT_SIZE_MAX } from "../layout/constants";

export default function FontControls({
  darkMode,
  fontFamily,
  fontSize,
  activeFontCss,
  onFontFamilyChange,
  onFontSizeChange,
  onReset,
}) {
  const panelBg = darkMode
    ? "bg-[#18181b] border-[#2a2a2e]"
    : "bg-white border-gray-200";
  const sublabel = darkMode ? "text-neutral-500" : "text-gray-400";
  const resetBtn = darkMode
    ? "text-neutral-500 hover:text-neutral-200 hover:bg-[#27272a] border border-transparent hover:border-[#3a3a3f]"
    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200";
  const selectStyle = darkMode
    ? "bg-[#1f1f23] border-[#3a3a3f] text-neutral-100 hover:border-[#555] focus:border-blue-500"
    : "bg-white border-gray-200 text-gray-800 hover:border-gray-400 focus:border-blue-500";
  const stepBtn = darkMode
    ? "bg-[#27272a] border border-[#3a3a3f] text-neutral-300 hover:bg-[#333] hover:text-white disabled:opacity-30"
    : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30";

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
          className={`w-px self-stretch ${darkMode ? "bg-[#2a2a2e]" : "bg-gray-100"}`}
        />

        <div className="flex flex-col gap-1.5 w-36 shrink-0">
          <div className="flex items-center -mt-9 gap-1.5">
            <button
              onClick={() => onFontSizeChange(fontSize - 1)}
              disabled={fontSize <= FONT_SIZE_MIN}
              className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-sm transition-all shrink-0 ${stepBtn}`}
            >
              −
            </button>
            <input
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="flex-1 cursor-pointer h-1.5 min-w-0"
              style={{ accentColor: "#3b82f6" }}
            />
            <button
              onClick={() => onFontSizeChange(fontSize + 1)}
              disabled={fontSize >= FONT_SIZE_MAX}
              className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold text-sm transition-all shrink-0 ${stepBtn}`}
            >
              +
            </button>
          </div>
        </div>

        <div
          className={`w-px self-stretch ${darkMode ? "bg-[#2a2a2e]" : "bg-gray-100"}`}
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
