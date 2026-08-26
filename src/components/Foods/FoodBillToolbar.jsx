import { FONT } from "./foodBillConstants"

export default function FoodBillToolbar({ onPrint, onAddItem, onReset }) {
  const buttons = [
    ["🖨 Print", onPrint],
    ["＋ Add Item", onAddItem],
    ["↺ Reset", onReset],
  ];

  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "18px",
        width: "100%",
        maxWidth: "520px",
      }}
    >
      {buttons.map(([label, fn]) => (
        <button
          key={label}
          onClick={fn}
          style={{
            fontFamily: FONT,
            fontSize: "13px",
            padding: "8px 0",
            cursor: "pointer",
            border: "1.5px solid #444",
            background: "#fdfaf4",
            color: "#000",
            flex: 1,
            borderRadius: "2px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f0e8d4")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fdfaf4")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
