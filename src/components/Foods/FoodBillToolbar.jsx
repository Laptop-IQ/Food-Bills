import {
  FONT,
  FONT_OPTIONS,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  FONT_STEP,
} from "./foodBillConstants";

export default function FoodBillToolbar({
  onPrint,
  onAddItem,
  onReset,
  onSaveBill, // ✅ ADDED

  font = FONT,
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

    const next = Math.max(
      MIN_FONT_SIZE,
      Number(fontSize || DEFAULT_FONT_SIZE) - FONT_STEP,
    );

    onFontSizeChange?.(next);
  };

  const increaseFont = () => {
    if (controlDisabled) return;

    const next = Math.min(
      MAX_FONT_SIZE,
      Number(fontSize || DEFAULT_FONT_SIZE) + FONT_STEP,
    );

    onFontSizeChange?.(next);
  };

  const buttons = [
    {
      key: "edit",
      label: editMode ? "🔓 EDIT ON" : "🔒 EDIT OFF",
      onClick: onEditModeToggle,
      edit: true,
    },

    {
      key: "save",
      label: "💾 SAVE BILL",

      // ✅ THIS WAS THE MAIN PROBLEM
      onClick: editMode ? onSaveBill : undefined,

      primary: true,
    },

    {
      key: "print",
      label: "🖨 PRINT",
      onClick: onPrint,
    },

    {
      key: "add",
      label: "＋ ADD ITEM",
      onClick: editMode ? onAddItem : undefined,
    },

    {
      key: "reset",
      label: "↺ RESET",
      onClick: editMode ? onReset : undefined,
      danger: true,
    },
  ];

  const selectionLabel = selectedField
    ? selectedField
        .replace(/^itemDesc:/, "Item ")
        .replace(/^itemQty:/, "Item Qty ")
        .replace(/^itemPrice:/, "Item Price ")
    : null;

  return (
    <div
      className="no-print food-bill-toolbar"
      style={{
        width: "100%",
        maxWidth: "520px",
        marginBottom: "18px",
        boxSizing: "border-box",
        fontFamily: font || FONT,
      }}
    >
      {/* =================================================
          TOP TOOLBAR
          ================================================= */}

      <div
        style={{
          display: "flex",
          gap: "6px",
          width: "100%",
          padding: "6px",
          background: "linear-gradient(135deg, #29251f, #1f1c18)",
          border: "1px solid #3e3931",
          borderRadius: "8px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
          boxSizing: "border-box",
        }}
      >
        {buttons.map((button) => {
          const disabled = !button.onClick;

          return (
            <button
              key={button.key}
              type="button"
              onClick={button.onClick}
              disabled={disabled}
              style={{
                flex: button.key === "edit" ? "0 0 82px" : 1,

                minWidth: 0,
                height: "38px",
                padding: "0 5px",

                fontFamily: font || FONT,

                fontSize: button.key === "edit" ? "10px" : "10.5px",

                fontWeight: 700,
                letterSpacing: "0.25px",

                color: button.edit
                  ? "#211b13"
                  : button.primary
                    ? "#211b13"
                    : "#f5f0e6",

                background: button.edit
                  ? editMode
                    ? "#8fd3a8"
                    : "#d9a86c"
                  : button.primary
                    ? "#d7b96f"
                    : "#302c26",

                border: button.edit
                  ? editMode
                    ? "1px solid #a9e3bd"
                    : "1px solid #e6bd8a"
                  : button.primary
                    ? "1px solid #e2ca91"
                    : "1px solid #4b453b",

                borderRadius: "4px",

                cursor: disabled ? "not-allowed" : "pointer",

                opacity: disabled ? 0.42 : 1,

                transition: "all 0.15s ease",
              }}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      {/* =================================================
          TEXT FORMAT TOOLBAR
          ================================================= */}

      <div
        style={{
          marginTop: "8px",
          padding: "8px",
          background: "linear-gradient(135deg, #fffdf8, #f4eee2)",
          border: "1px solid #d8cfbf",
          borderRadius: "8px",
          boxShadow: "0 3px 10px rgba(60,50,35,0.07)",
        }}
      >
        {/* SELECT FULL BILL */}

        <button
          type="button"
          onClick={editMode ? onSelectAllText : undefined}
          disabled={!editMode}
          style={{
            width: "100%",
            height: "30px",
            marginBottom: "7px",

            fontFamily: font || FONT,
            fontSize: "10.5px",
            fontWeight: 700,

            color: editMode ? "#433d34" : "#999",

            background: editMode ? "#ebe3d4" : "#eeeae2",

            border: "1px solid #cfc5b4",
            borderRadius: "4px",

            cursor: editMode ? "pointer" : "not-allowed",

            opacity: editMode ? 1 : 0.55,
          }}
        >
          ☑ Select Full Bill Text
        </button>

        {/* FORMAT CONTROLS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          {/* FONT */}

          <select
            value={font}
            disabled={controlDisabled}
            onChange={(event) => onFontChange?.(event.target.value)}
            aria-label="Selected text font"
            style={{
              flex: "1 1 145px",
              minWidth: "130px",
              height: "32px",
              padding: "0 8px",

              fontFamily: font || FONT,
              fontSize: "11px",

              color: "#29251f",
              background: "#fffdf8",

              border: "1px solid #cfc5b4",
              borderRadius: "4px",

              outline: "none",

              cursor: controlDisabled ? "not-allowed" : "pointer",

              opacity: controlDisabled ? 0.5 : 1,
            }}
          >
            {fontOptions.map((option) => (
              <option
                key={option.label}
                value={option.value}
                style={{
                  fontFamily: option.value || FONT,
                }}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* DECREASE */}

          <button
            type="button"
            onClick={decreaseFont}
            disabled={controlDisabled}
            title="Decrease selected field size"
            style={{
              width: "32px",
              height: "32px",

              border: "1px solid #cfc5b4",
              borderRadius: "4px",
              background: "#fffdf8",
              color: "#39342c",

              fontFamily: font || FONT,
              fontSize: "14px",
              fontWeight: 700,

              cursor: controlDisabled ? "not-allowed" : "pointer",

              opacity: controlDisabled ? 0.5 : 1,
            }}
          >
            A−
          </button>

          {/* SIZE */}

          <span
            style={{
              minWidth: "42px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#ebe3d4",
              border: "1px solid #cfc5b4",
              borderRadius: "4px",

              fontFamily: font || FONT,
              fontSize: "11px",
              fontWeight: 700,
              color: "#39342c",

              opacity: editMode ? 1 : 0.5,
            }}
          >
            {fontSize}px
          </span>

          {/* INCREASE */}

          <button
            type="button"
            onClick={increaseFont}
            disabled={controlDisabled}
            title="Increase selected field size"
            style={{
              width: "32px",
              height: "32px",

              border: "1px solid #cfc5b4",
              borderRadius: "4px",
              background: "#fffdf8",
              color: "#39342c",

              fontFamily: font || FONT,
              fontSize: "14px",
              fontWeight: 700,

              cursor: controlDisabled ? "not-allowed" : "pointer",

              opacity: controlDisabled ? 0.5 : 1,
            }}
          >
            A+
          </button>

          {/* BOLD */}

          <button
            type="button"
            disabled={controlDisabled}
            onClick={() => onBoldChange?.(!bold)}
            aria-pressed={hasSelection && bold}
            title="Bold selected field"
            style={{
              width: "38px",
              height: "32px",

              fontFamily: font || FONT,
              fontSize: "15px",
              fontWeight: 900,

              color: bold && hasSelection ? "#211b13" : "#4b453b",

              background: bold && hasSelection ? "#d7b96f" : "#fffdf8",

              border:
                bold && hasSelection
                  ? "1px solid #c09c54"
                  : "1px solid #cfc5b4",

              borderRadius: "4px",

              cursor: controlDisabled ? "not-allowed" : "pointer",

              opacity: controlDisabled ? 0.5 : 1,
            }}
          >
            B
          </button>
        </div>

        {/* STATUS */}

        <div
          style={{
            marginTop: "6px",
            fontFamily: font || FONT,
            fontSize: "10px",

            color: !editMode ? "#a05a24" : hasSelection ? "#187a3d" : "#918879",
          }}
        >
          {!editMode
            ? "🔒 View Mode — turn Edit Mode ON to edit."
            : hasSelection
              ? selectionLabel
                ? `✓ ${selectionLabel} selected — formatting applies only to this field.`
                : "✓ Field selected — formatting controls are active."
              : "Click any bill field to select it for formatting."}
        </div>
      </div>
    </div>
  );
}
