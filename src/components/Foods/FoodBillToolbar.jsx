import {
  DEFAULT_FONT_SIZE,
  FONT_OPTIONS,
  FONT_STEP,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from "./foodBillConstants";

const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";

const Ri = ({ name, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name} leading-none ${className}`} />
);

function EditSwitch({ editMode, onToggle, compact = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={editMode}
      aria-label="Edit mode"
      onClick={onToggle}
      className={`inline-flex items-center gap-2.5 rounded-md border px-3 transition-colors duration-150 ${FOCUS} ${
        compact ? "h-11" : "h-10"
      } ${
        editMode
          ? "border-forest-700/30 bg-forest-50 text-forest-800"
          : "border-line bg-white text-slate-muted hover:bg-neutral-bg"
      }`}
    >
      <Ri
        name={editMode ? "edit-2-line" : "lock-line"}
        className="text-[18px]"
      />
      <span
        className={`text-[13px] font-medium ${compact ? "hidden min-[420px]:inline" : ""}`}
      >
        {editMode ? "Editing" : "View only"}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${editMode ? "bg-forest-700" : "bg-line"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            editMode ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default function FoodBillToolbar({
  onPrint,
  onAddItem,
  onReset,
  onSaveBill,
  font,
  fontSize = DEFAULT_FONT_SIZE,
  bold = false,
  fontOptions = FONT_OPTIONS,
  onFontChange,
  onFontSizeChange,
  onBoldChange,
  onSelectAllText,
  hasSelection = false,
  selectedField = null,
  editMode = true,
  onEditModeToggle,
}) {
  const controlDisabled = !editMode || !hasSelection;

  const decreaseFont = () => {
    if (controlDisabled) return;
    onFontSizeChange?.(
      Math.max(
        MIN_FONT_SIZE,
        Number(fontSize || DEFAULT_FONT_SIZE) - FONT_STEP,
      ),
    );
  };
  const increaseFont = () => {
    if (controlDisabled) return;
    onFontSizeChange?.(
      Math.min(
        MAX_FONT_SIZE,
        Number(fontSize || DEFAULT_FONT_SIZE) + FONT_STEP,
      ),
    );
  };

  const save = editMode ? onSaveBill : undefined;
  const add = editMode ? onAddItem : undefined;
  const reset = editMode ? onReset : undefined;

  const selectionLabel = selectedField
    ? selectedField
        .replace(/^itemDesc:/, "Item ")
        .replace(/^itemQty:/, "Item Qty ")
        .replace(/^itemPrice:/, "Item Price ")
    : null;

  const btn = `inline-flex h-10 items-center justify-center gap-2 rounded-md px-3.5 text-[13px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${FOCUS}`;
  const ghost = `${btn} border border-line bg-white text-ink enabled:hover:bg-neutral-bg`;
  const primary = `${btn} bg-forest-700 text-ivory enabled:hover:bg-forest-800`;
  const stepBtn = `flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 enabled:hover:bg-neutral-bg ${FOCUS}`;

  return (
    <>
      <div className="no-print food-bill-toolbar space-y-4">
        {/* Actions (desktop) */}
        <section className="hidden rounded-md border border-line bg-white lg:block">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 className="font-display text-[16px] font-semibold tracking-tight">
                Actions
              </h2>
              <p className="mt-0.5 text-xs text-slate-muted">
                Save, print or change the bill.
              </p>
            </div>
            <EditSwitch editMode={editMode} onToggle={onEditModeToggle} />
          </div>
          <div className="space-y-2.5 p-5">
            <button
              type="button"
              onClick={save}
              disabled={!save}
              className={`${primary} h-11 w-full`}
            >
              <Ri name="save-3-line" className="text-[18px]" /> Save bill
            </button>
            <div className="grid grid-cols-3 gap-2.5">
              <button type="button" onClick={onPrint} className={ghost}>
                <Ri name="printer-line" className="text-[18px]" /> Print
              </button>
              <button
                type="button"
                onClick={add}
                disabled={!add}
                className={ghost}
              >
                <Ri name="add-line" className="text-[18px]" /> Add
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={!reset}
                className={`${ghost} enabled:hover:!bg-danger/10 enabled:hover:!text-danger`}
              >
                <Ri name="restart-line" className="text-[18px]" /> Reset
              </button>
            </div>
          </div>
        </section>

        {/* Text formatting */}
        <section className="rounded-md border border-line bg-white">
          <div className="border-b border-line px-4 py-4 sm:px-5">
            <h2 className="font-display text-[16px] font-semibold tracking-tight">
              Text formatting
            </h2>
            <p className="mt-0.5 text-xs text-slate-muted">
              Click a field on the bill, then change its style.
            </p>
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            <button
              type="button"
              onClick={editMode ? onSelectAllText : undefined}
              disabled={!editMode}
              className={`${ghost} w-full`}
            >
              <Ri name="checkbox-multiple-line" className="text-[18px]" />{" "}
              Select full bill text
            </button>

            <div className="relative">
              <select
                value={font}
                disabled={controlDisabled}
                onChange={(event) => onFontChange?.(event.target.value)}
                aria-label="Selected text font"
                className="h-10 w-full appearance-none rounded-md border border-line bg-white pl-3 pr-9 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {fontOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Ri
                name="arrow-down-s-line"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-muted"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decreaseFont}
                disabled={controlDisabled}
                title="Decrease size"
                aria-label="Decrease text size"
                className={stepBtn}
              >
                <Ri name="subtract-line" className="text-[18px]" />
              </button>
              <span
                className={`flex h-10 min-w-[64px] flex-1 items-center justify-center rounded-md bg-neutral-bg text-sm font-semibold tabular-nums ${controlDisabled ? "opacity-45" : ""}`}
              >
                {fontSize}px
              </span>
              <button
                type="button"
                onClick={increaseFont}
                disabled={controlDisabled}
                title="Increase size"
                aria-label="Increase text size"
                className={stepBtn}
              >
                <Ri name="add-line" className="text-[18px]" />
              </button>
              <button
                type="button"
                disabled={controlDisabled}
                onClick={() => onBoldChange?.(!bold)}
                aria-pressed={hasSelection && bold}
                title="Bold"
                aria-label="Bold"
                className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45 ${FOCUS} ${
                  bold && hasSelection
                    ? "border-forest-700 bg-forest-700 text-ivory"
                    : "border-line bg-white text-ink enabled:hover:bg-neutral-bg"
                }`}
              >
                <Ri name="bold" className="text-[18px]" />
              </button>
            </div>

            <p
              className={`flex items-start gap-2 text-xs ${
                !editMode
                  ? "text-warning"
                  : hasSelection
                    ? "text-success"
                    : "text-slate-muted"
              }`}
              role="status"
            >
              <Ri
                name={
                  !editMode
                    ? "lock-line"
                    : hasSelection
                      ? "checkbox-circle-line"
                      : "cursor-line"
                }
                className="mt-px text-[14px]"
              />
              <span>
                {!editMode
                  ? "View mode. Turn editing on to change the bill."
                  : hasSelection
                    ? selectionLabel
                      ? `${selectionLabel} selected. Formatting applies only to this field.`
                      : "Field selected. Formatting controls are active."
                    : "Click any bill field to select it for formatting."}
              </span>
            </p>
          </div>
        </section>
      </div>

      {/* Mobile action bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <EditSwitch editMode={editMode} onToggle={onEditModeToggle} compact />
          <button
            type="button"
            onClick={add}
            disabled={!add}
            aria-label="Add item"
            title="Add item"
            className={`${ghost} h-11 w-11 shrink-0 !px-0`}
          >
            <Ri name="add-line" className="text-[20px]" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!reset}
            aria-label="Reset bill"
            title="Reset"
            className={`${ghost} h-11 w-11 shrink-0 !px-0`}
          >
            <Ri name="restart-line" className="text-[20px]" />
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!save}
            className={`${primary} h-11 min-w-0 flex-1`}
          >
            <Ri name="save-3-line" className="text-[18px]" /> Save
          </button>
          <button
            type="button"
            onClick={onPrint}
            aria-label="Print"
            title="Print"
            className={`${ghost} h-11 w-11 shrink-0 !px-0`}
          >
            <Ri name="printer-line" className="text-[20px]" />
          </button>
        </div>
      </div>
    </>
  );
}
