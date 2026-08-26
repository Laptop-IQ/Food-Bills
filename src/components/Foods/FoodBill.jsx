import { useState } from "react";
import { FONT, DEFAULT_BILL, DEFAULT_ITEMS } from "./foodBillConstants";
import { Hr } from "./ReceiptControls";
import FoodBillToolbar from "./FoodBillToolbar";
import ReceiptHeader from "./ReceiptHeader";
import ItemsTable from "./ItemsTable";
import TotalsSection from "./TotalsSection";
import "../Foods/foodBillPrint.css";

let uid = 1000;

export default function FoodBill() {
  const [bill, setBill] = useState({ ...DEFAULT_BILL });
  const [items, setItems] = useState(DEFAULT_ITEMS.map((i) => ({ ...i })));

  const set = (k, v) => setBill((prev) => ({ ...prev, [k]: v }));
  const setItem = (id, k, v) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [k]: v } : it)),
    );
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: uid++, qty: 1, desc: "NEW ITEM", price: 0 },
    ]);
  const reset = () => {
    setBill({ ...DEFAULT_BILL });
    setItems(DEFAULT_ITEMS.map((i) => ({ ...i })));
  };

  const subTotal = items.reduce((s, it) => s + (it.price || 0), 0);
  const cgstAmt = parseFloat(((subTotal * bill.cgst) / 100).toFixed(2));
  const sgstAmt = parseFloat(((subTotal * bill.sgst) / 100).toFixed(2));
  const payable = Math.round(subTotal + cgstAmt + sgstAmt);
  const balance = payable - (bill.paid || 0);

  return (
    <div
      style={{
        fontFamily: FONT,
        minHeight: "100vh",
        background: "#ccc5b5",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FoodBillToolbar
        onPrint={() => window.print()}
        onAddItem={addItem}
        onReset={reset}
      />

      {/* ── Receipt Paper ── */}
      <div
        className="receipt-paper"
        style={{
          background: "#fffef8",
          color: "#000",
          width: "100%",
          maxWidth: "400px",
          padding: "26px 30px 34px",
          boxShadow:
            "0 2px 0 #b8ae96, 0 4px 0 #a89e86, 0 6px 20px rgba(0,0,0,0.28)",
        }}
      >
        <ReceiptHeader bill={bill} onChange={set} />

        <Hr />

        <ItemsTable
          items={items}
          onItemChange={setItem}
          onRemoveItem={removeItem}
          onAddItem={addItem}
        />

        <TotalsSection
          bill={bill}
          onChange={set}
          subTotal={subTotal}
          cgstAmt={cgstAmt}
          sgstAmt={sgstAmt}
          payable={payable}
          balance={balance}
        />
      </div>

      <p
        className="no-print"
        style={{
          color: "#999",
          fontSize: "11px",
          marginTop: "12px",
          textAlign: "center",
          letterSpacing: "0.2px",
        }}
      >
        Click any field to edit &nbsp;·&nbsp; Totals auto-calculate
        &nbsp;·&nbsp; 🖨 Print hides edit controls
      </p>
    </div>
  );
}
