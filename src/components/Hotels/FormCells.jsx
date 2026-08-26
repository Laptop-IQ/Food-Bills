import { BLUE_BOLD } from "./cellStyles";

export function Cell({
  value,
  onChange,
  editing,
  align = "left",
  className = "",
  numeric = false,
}) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";
  if (!editing) {
    return (
      <span
        className={`block text-[11px] ${BLUE_BOLD} ${alignClass} ${className}`}
      >
        {value}
      </span>
    );
  }
  return (
    <input
      inputMode={numeric ? "numeric" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full text-[11px] ${BLUE_BOLD} bg-yellow-50 border-b border-blue-500 outline-none px-0 ${alignClass} ${className}`}
    />
  );
}

export function NormalCell({ value, onChange, editing, align = "left" }) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";
  if (!editing) {
    return (
      <span
        className={`block text-[11px] ${value ? BLUE_BOLD : ""} ${alignClass}`}
      >
        {value}
      </span>
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full text-[11px] ${BLUE_BOLD} bg-yellow-50 border-b border-blue-500 outline-none px-0 ${alignClass}`}
    />
  );
}
