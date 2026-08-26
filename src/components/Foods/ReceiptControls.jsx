import { useState } from "react";
import { FONT } from "./foodBillConstants";

export function Field({ value, onChange, type = "text", style = {}, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>
        onChange(
          type === "number" ? parseFloat(e.target.value) || 0 : e.target.value,
        )
      }
      onFocus={() => setFocused(true)}
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
        ...style,
      }}
      {...rest}
    />
  );
}

export function Hr({ dashed }) {
  return (
    <div
      style={{
        borderTop: dashed ? "1px dashed #999" : "1.5px solid #1a1a1a",
        margin: "8px 0",
      }}
    />
  );
}

export function TotalRow({ label, value, bold }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2px 0",
        fontSize: bold ? "14px" : "13px",
        fontWeight: bold ? "bold" : "normal",
        color: "#000",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
