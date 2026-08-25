import React, { useEffect, useMemo } from "react";

const STAMP_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Stardos+Stencil:wght@400;700&display=swap";

// Overlay "PAID" stamp — lives inside BillReceipt.jsx's #thermalBill card.
// That card needs `position: relative` for this absolute overlay to anchor
// correctly (already added there).
export default function PaidStamp({ show = true }) {
  useEffect(() => {
    if (document.getElementById("paid-stamp-google-font")) return;
    const link = document.createElement("link");
    link.id = "paid-stamp-google-font";
    link.rel = "stylesheet";
    link.href = STAMP_FONT_URL;
    document.head.appendChild(link);
  }, []);

  // Computed once per mount, not on every render — otherwise the stamp
  // would jump to a new spot on every keystroke while editing. Constrained
  // to a bottom band only, like a receipt stamped near the footer.
  const { top, left, rotate } = useMemo(
    () => ({
      top: 86 + Math.random() * 9, // 86%–95%: right near the footer
      left: 32 + Math.random() * 36, // 32%–68%: clear of both edges
      rotate: -20 + Math.random() * 18, // -20deg to -2deg tilt
    }),
    [],
  );

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute z-20 pointer-events-none select-none mix-blend-multiply"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        fontFamily: "'Stardos Stencil', fantasy",
        fontWeight: 700,
        fontSize: "2.5rem",
        letterSpacing: "0.1em",
        color: "#0000cc",
        textShadow:
          "0.6px 0.5px 0 rgba(30,58,112,0.45), -0.5px -0.4px 0 rgba(30,58,112,0.3), 0.3px -0.6px 0 rgba(30,58,112,0.25)",
        whiteSpace: "nowrap",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        colorAdjust: "exact",
      }}
    >
      PAID
    </div>
  );
}
