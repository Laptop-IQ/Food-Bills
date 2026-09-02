import { useState } from "react";
import { FONT } from "./foodBillConstants";

export function Field({
  value,
  onChange,
  type = "text",
  style = {},
  fieldKey,
  textStyle,
  onActivate,
  disabled = false,
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  const resolvedTextStyle = {
    fontFamily: textStyle?.fontFamily || FONT,
    fontSize: textStyle?.fontSize ? `${textStyle.fontSize}px` : "inherit",
    fontWeight: textStyle?.fontWeight || "inherit",
  };

  return (
    <input
      type={type}
      value={value ?? ""}
      disabled={disabled}
      data-field-key={fieldKey || undefined}
      onChange={(e) => {
        if (type === "number") {
          onChange(parseFloat(e.target.value) || 0);
        } else {
          onChange(e.target.value);
        }
      }}
      onFocus={() => {
        setFocused(true);
        onActivate?.(fieldKey);
      }}
      onClick={() => {
        onActivate?.(fieldKey);
      }}
      onBlur={() => setFocused(false)}
      style={{
        fontFamily: FONT,
        fontSize: "inherit",
        color: "#000",
        fontWeight: "inherit",
        letterSpacing: "inherit",

        border: "none",
        outline: "none",

        padding: "1px 3px",
        borderRadius: "2px",

        boxSizing: "border-box",

        background: focused ? "rgba(59,130,246,0.11)" : "transparent",

        transition: "background 0.12s",

        ...resolvedTextStyle,
        ...style,
      }}
      {...rest}
    />
  );
}

export function Hr({ dashed }) {
  return (
    <div
      aria-hidden="true"
      style={{
        borderTop: dashed ? "1px dashed #999" : "1.5px solid #1a1a1a",
        margin: "8px 0",
      }}
    />
  );
}

export function TotalRow({
  label,
  value,
  bold = false,
  textStyle,
  fieldKey,
  onActivate,
}) {
  return (
    <div
      data-field-key={fieldKey || undefined}
      onMouseDown={() => onActivate?.(fieldKey)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2px 0",

        fontFamily: textStyle?.fontFamily || FONT,

        fontSize: textStyle?.fontSize
          ? `${textStyle.fontSize}px`
          : bold
            ? "14px"
            : "13px",

        fontWeight: textStyle?.fontWeight || (bold ? "bold" : "normal"),

        color: "#000",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
