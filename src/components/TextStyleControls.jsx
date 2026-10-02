import React from "react";
import { TEXT_STYLE_FIELDS } from "../layout/textStyles";

const MIN_SIZE = 7;
const MAX_SIZE = 32;
const STEP = 1;

function NumberControl({ label, value, onChange, min, max, step = 1, suffix = "px" }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, Number(value) - step))}
          disabled={Number(value) <= min}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-slate-600 hover:bg-white hover:text-indigo-600 disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 bg-transparent px-1 text-center text-xs font-bold text-slate-800 outline-none"
        />
        <span className="pr-1 text-[10px] font-semibold text-slate-400">{suffix}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, Number(value) + step))}
          disabled={Number(value) >= max}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-slate-600 hover:bg-white hover:text-indigo-600 disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TextStyleControls({
  textStyles,
  selectedField,
  onFieldChange,
  onStyleChange,
  onResetField,
  onResetAll,
  baseFontSize = 12,
}) {
  const selected = textStyles?.[selectedField] || {};
  const effectiveSize = selected.fontSize ?? baseFontSize;

  const update = (key, value) => onStyleChange(selectedField, key, value);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Text / Section
        </label>
        <select
          value={selectedField}
          onChange={(e) => onFieldChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        >
          {Array.from(new Set(TEXT_STYLE_FIELDS.map((field) => field.group))).map((group) => (
            <optgroup key={group} label={group}>
              {TEXT_STYLE_FIELDS.filter((field) => field.group === group).map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberControl
          label="Font Size"
          value={effectiveSize}
          min={MIN_SIZE}
          max={MAX_SIZE}
          onChange={(value) => update("fontSize", Math.max(MIN_SIZE, Math.min(MAX_SIZE, value || baseFontSize)))}
        />

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Font Weight
          </label>
          <select
            value={selected.fontWeight ?? 400}
            onChange={(e) => update("fontWeight", Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="400">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberControl
          label="Top Gap"
          value={selected.marginTop ?? 0}
          min={-20}
          max={40}
          onChange={(value) => update("marginTop", value)}
        />
        <NumberControl
          label="Bottom Gap"
          value={selected.marginBottom ?? 0}
          min={-20}
          max={40}
          onChange={(value) => update("marginBottom", value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberControl
          label="Line Height"
          value={selected.lineHeight ?? 1.25}
          min={0.7}
          max={3}
          step={0.05}
          suffix=""
          onChange={(value) => update("lineHeight", Math.max(0.7, Math.min(3, value || 1.25)))}
        />

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Alignment
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            {[
              ["left", "L"],
              ["center", "C"],
              ["right", "R"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => update("textAlign", value)}
                className={`rounded-lg py-2 text-xs font-black transition ${
                  selected.textAlign === value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-white"
                }`}
                aria-label={`Align ${value}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onResetField(selectedField)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
        >
          Reset selected
        </button>
        <button
          type="button"
          onClick={onResetAll}
          className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600 hover:bg-red-100"
        >
          Reset all text styles
        </button>
      </div>
    </div>
  );
}
