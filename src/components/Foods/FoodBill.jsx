import { useCallback, useMemo, useState } from "react";
import { FONT, DEFAULT_BILL, DEFAULT_ITEMS } from "./foodBillConstants";
import { Hr } from "./ReceiptControls";
import FoodBillToolbar from "./FoodBillToolbar";
import ReceiptHeader from "./ReceiptHeader";
import ItemsTable from "./ItemsTable";
import TotalsSection from "./TotalsSection";
import "../Foods/foodBillPrint.css";

let uid = 1000;

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const hasValue = (value) => String(value ?? "").trim() !== "";

const createItems = () => DEFAULT_ITEMS.map((item) => ({ ...item }));

export default function FoodBill() {
  const [bill, setBill] = useState(() => ({
    ...DEFAULT_BILL,
  }));

  const [items, setItems] = useState(() => createItems());

  const set = useCallback((key, value) => {
    setBill((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setItem = useCallback((id, key, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        id: uid++,
        qty: 1,
        desc: "",
        price: 0,
      },
    ]);
  }, []);

  const reset = useCallback(() => {
    setBill({ ...DEFAULT_BILL });
    setItems(createItems());
  }, []);

  /*
   * ---------------------------------------------------------
   * HEADER DATA VISIBILITY
   * ---------------------------------------------------------
   *
   * These flags are passed to ReceiptHeader.
   * ReceiptHeader should render the corresponding field
   * only when its flag is true.
   */

  const hasGSTIN = hasValue(bill.gstin);

  const hasPhone = hasValue(bill.phone);

  const hasTable = hasValue(bill.table);

  const hasPax = hasValue(bill.pax) && toNumber(bill.pax) > 0;

  const hasOrderNo = hasValue(bill.orderNo);

  /*
   * ---------------------------------------------------------
   * GST
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   * GST is calculated ONLY when GSTIN exists.
   *
   * Therefore:
   *
   * GSTIN empty
   *     ↓
   * CGST = 0
   * SGST = 0
   * CGST/SGST rows hidden
   *
   * GSTIN present
   *     ↓
   * normal GST calculation
   */

  const gstApplicable = hasGSTIN;

  /*
   * Keep all items available to the editor.
   * Empty rows simply contribute zero.
   */
  const billItems = useMemo(
    () =>
      items.filter(
        (item) =>
          hasValue(item.desc) ||
          toNumber(item.qty) > 0 ||
          toNumber(item.price) !== 0,
      ),
    [items],
  );

  const subTotal = useMemo(
    () =>
      billItems.reduce((sum, item) => {
        const qty = Math.max(toNumber(item.qty, 1), 0);

        const price = Math.max(toNumber(item.price), 0);

        return sum + qty * price;
      }, 0),
    [billItems],
  );

  /*
   * GST rate is ignored completely when GSTIN is absent.
   */
  const cgstRate = gstApplicable ? Math.max(toNumber(bill.cgst), 0) : 0;

  const sgstRate = gstApplicable ? Math.max(toNumber(bill.sgst), 0) : 0;

  const cgstAmt = gstApplicable
    ? Number(((subTotal * cgstRate) / 100).toFixed(2))
    : 0;

  const sgstAmt = gstApplicable
    ? Number(((subTotal * sgstRate) / 100).toFixed(2))
    : 0;

  const payable = Math.round(subTotal + cgstAmt + sgstAmt);

  const paid = Math.max(toNumber(bill.paid), 0);

  const balance = Math.max(payable - paid, 0);

  /*
   * ---------------------------------------------------------
   * TOTAL VISIBILITY
   * ---------------------------------------------------------
   */

  const hasItems = billItems.length > 0;

  const hasSubtotal = subTotal > 0;

  const hasCgst = gstApplicable && cgstRate > 0 && cgstAmt > 0;

  const hasSgst = gstApplicable && sgstRate > 0 && sgstAmt > 0;

  const hasTax = hasCgst || hasSgst;

  const hasPayable = payable > 0;

  const hasPayment = paid > 0;

  const hasBalance = hasPayment && balance > 0;

  return (
    <div
      className="food-bill-page"
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

      <div
        className="receipt-paper"
        style={{
          background: "#fffef8",
          color: "#000",
          width: "100%",
          maxWidth: "400px",

          /*
           * Do NOT change the existing visual layout.
           * Only allow natural content height.
           */
          height: "auto",
          minHeight: 0,

          padding: "26px 30px 34px",

          boxShadow:
            "0 2px 0 #b8ae96, 0 4px 0 #a89e86, 0 6px 20px rgba(0,0,0,0.28)",

          boxSizing: "border-box",
        }}
      >
        <ReceiptHeader
          bill={bill}
          onChange={set}
          hasGSTIN={hasGSTIN}
          hasPhone={hasPhone}
          hasTable={hasTable}
          hasPax={hasPax}
          hasOrderNo={hasOrderNo}
        />

        {hasItems && (
          <>
            <Hr />

            <ItemsTable
              items={items}
              onItemChange={setItem}
              onRemoveItem={removeItem}
              onAddItem={addItem}
            />
          </>
        )}

        <TotalsSection
          bill={bill}
          onChange={set}
          subTotal={subTotal}
          cgstAmt={cgstAmt}
          sgstAmt={sgstAmt}
          payable={payable}
          paid={paid}
          balance={balance}
          hasSubtotal={hasSubtotal}
          hasTax={hasTax}
          hasCgst={hasCgst}
          hasSgst={hasSgst}
          hasPayable={hasPayable}
          hasPayment={hasPayment}
          hasBalance={hasBalance}
          gstApplicable={gstApplicable}
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
        Click any field to edit&nbsp; · &nbsp; Totals auto-calculate&nbsp; ·
        &nbsp; 🖨 Print hides edit controls
      </p>
    </div>
  );
}
