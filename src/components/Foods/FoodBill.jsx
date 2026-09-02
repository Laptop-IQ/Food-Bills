import { useCallback, useMemo, useState } from "react";
import {
  FONT,
  DEFAULT_BILL,
  DEFAULT_ITEMS,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  FONT_STEP,
  FONT_OPTIONS,
} from "./foodBillConstants";

import { Hr } from "./ReceiptControls";
import FoodBillToolbar from "./FoodBillToolbar";
import ReceiptHeader from "./ReceiptHeader";
import ItemsTable from "./ItemsTable";
import TotalsSection from "./TotalsSection";
import SavedBillsList from "./SavedBillsList";

import { saveBill, updateSavedBill } from "./savedBillsStorage";

import "../Foods/foodBillPrint.css";

let uid = 1000;

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
};

const hasValue = (value) => String(value ?? "").trim() !== "";

const createDefaultItems = () =>
  DEFAULT_ITEMS.map((item) => ({
    ...item,
  }));

const createNewItem = () => ({
  id: uid++,
  qty: 1,
  desc: "",
  price: 0,
});

export default function FoodBill() {
  /* =====================================================
     BILL STATE
     ===================================================== */

  const [bill, setBill] = useState(() => ({
    ...DEFAULT_BILL,
  }));

  const [items, setItems] = useState(() => createDefaultItems());

  const [savedBillId, setSavedBillId] = useState(null);

  const [saveMessage, setSaveMessage] = useState("");

  const [editMode, setEditMode] = useState(true);

  /* =====================================================
     TEXT FORMATTING STATE
     ===================================================== */

  const [font, setFont] = useState(FONT);

  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const [bold, setBold] = useState(false);

  const [hasSelection, setHasSelection] = useState(false);

  const [selectedField, setSelectedField] = useState(null);

  /* =====================================================
     BILL UPDATE
     ===================================================== */

  const set = useCallback(
    (key, value) => {
      if (!editMode) return;

      setBill((previous) => ({
        ...previous,
        [key]: value,
      }));

      setSaveMessage("");
    },
    [editMode],
  );

  /* =====================================================
     ITEM UPDATE
     ===================================================== */

  const setItem = useCallback(
    (id, key, value) => {
      if (!editMode) return;

      setItems((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                [key]: value,
              }
            : item,
        ),
      );

      setSaveMessage("");
    },
    [editMode],
  );

  /* =====================================================
     REMOVE ITEM
     ===================================================== */

  const removeItem = useCallback(
    (id) => {
      if (!editMode) return;

      setItems((previous) => previous.filter((item) => item.id !== id));

      setSaveMessage("");
    },
    [editMode],
  );

  /* =====================================================
     ADD ITEM
     ===================================================== */

  const addItem = useCallback(() => {
    if (!editMode) return;

    setItems((previous) => [...previous, createNewItem()]);

    setSaveMessage("");
  }, [editMode]);

  /* =====================================================
     RESET
     ===================================================== */

  const reset = useCallback(() => {
    if (!editMode) return;

    setBill({
      ...DEFAULT_BILL,
    });

    setItems(createDefaultItems());

    setSavedBillId(null);
    setSaveMessage("");

    setFont(FONT);
    setFontSize(DEFAULT_FONT_SIZE);
    setBold(false);

    setHasSelection(false);
    setSelectedField(null);
  }, [editMode]);

  /* =====================================================
     SELECT FULL BILL TEXT
     ===================================================== */

  const handleSelectAllText = useCallback(() => {
    if (!editMode) return;

    const receipt = document.querySelector(".receipt-paper");

    if (!receipt) {
      console.warn("Receipt paper not found.");

      return;
    }

    const selection = window.getSelection();

    if (!selection) return;

    const range = document.createRange();

    range.selectNodeContents(receipt);

    selection.removeAllRanges();
    selection.addRange(range);

    /*
     * Tell toolbar that a selection exists.
     *
     * "fullBill" is a special selection
     * which represents the complete receipt.
     */
    setHasSelection(true);
    setSelectedField("fullBill");
  }, [editMode]);

  /* =====================================================
     FONT CHANGE
     ===================================================== */

  const handleFontChange = useCallback(
    (value) => {
      if (!editMode || !hasSelection) {
        return;
      }

      setFont(value);
    },
    [editMode, hasSelection],
  );

  /* =====================================================
     FONT SIZE CHANGE
     ===================================================== */

  const handleFontSizeChange = useCallback(
    (value) => {
      if (!editMode || !hasSelection) {
        return;
      }

      const next = Math.min(
        MAX_FONT_SIZE,
        Math.max(MIN_FONT_SIZE, Number(value) || DEFAULT_FONT_SIZE),
      );

      setFontSize(next);
    },
    [editMode, hasSelection],
  );

  /* =====================================================
     BOLD CHANGE
     ===================================================== */

  const handleBoldChange = useCallback(
    (value) => {
      if (!editMode || !hasSelection) {
        return;
      }

      setBold(Boolean(value));
    },
    [editMode, hasSelection],
  );

  /* =====================================================
     BILL ITEMS
     ===================================================== */

  const billItems = useMemo(() => {
    return items.filter((item) => {
      const descriptionExists = hasValue(item.desc);

      const quantity = toNumber(item.qty);

      const price = toNumber(item.price);

      return descriptionExists || quantity > 0 || price !== 0;
    });
  }, [items]);

  /* =====================================================
     SUB TOTAL
     ===================================================== */

  const subTotal = useMemo(() => {
    return billItems.reduce((total, item) => {
      const qty = Math.max(toNumber(item.qty, 1), 0);

      const price = Math.max(toNumber(item.price), 0);

      return total + qty * price;
    }, 0);
  }, [billItems]);

  /* =====================================================
     GST
     ===================================================== */

  const gstApplicable = hasValue(bill.gstin);

  const cgstRate = gstApplicable ? Math.max(toNumber(bill.cgst), 0) : 0;

  const sgstRate = gstApplicable ? Math.max(toNumber(bill.sgst), 0) : 0;

  const cgstAmt = gstApplicable
    ? Number(((subTotal * cgstRate) / 100).toFixed(2))
    : 0;

  const sgstAmt = gstApplicable
    ? Number(((subTotal * sgstRate) / 100).toFixed(2))
    : 0;

  /* =====================================================
     TOTAL
     ===================================================== */

  const payable = Math.round(subTotal + cgstAmt + sgstAmt);

  const paid = Math.max(toNumber(bill.paid), 0);

  const balance = Math.max(payable - paid, 0);

  /* =====================================================
     VISIBILITY
     ===================================================== */

  const hasItems = billItems.length > 0;

  const hasSubtotal = subTotal > 0;

  const hasCgst = gstApplicable && cgstRate > 0 && cgstAmt > 0;

  const hasSgst = gstApplicable && sgstRate > 0 && sgstAmt > 0;

  const hasTax = hasCgst || hasSgst;

  const hasPayable = payable > 0;

  const hasPayment = paid > 0;

  const hasBalance = hasPayment && balance > 0;

  /* =====================================================
     SAVE BILL
     ===================================================== */

  const handleSaveBill = useCallback(() => {
    if (!editMode) {
      setSaveMessage("Turn Edit Mode ON to save changes.");

      return;
    }

    try {
      const hasBillData =
        hasValue(bill.name) ||
        hasValue(bill.billNo) ||
        hasValue(bill.date) ||
        hasValue(bill.phone) ||
        hasValue(bill.table) ||
        hasValue(bill.orderNo) ||
        hasValue(bill.gstin) ||
        hasItems;

      if (!hasBillData) {
        setSaveMessage("Please enter bill data before saving.");

        return;
      }

      /* UPDATE EXISTING BILL */

      if (savedBillId) {
        const updated = updateSavedBill(savedBillId, bill, items);

        if (!updated) {
          throw new Error("Saved bill was not found.");
        }

        setSaveMessage("Bill updated successfully.");

        window.dispatchEvent(new Event("food-bills-updated"));

        return;
      }

      /* CREATE NEW BILL */

      const saved = saveBill(bill, items);

      if (!saved?.id) {
        throw new Error("Bill could not be saved.");
      }

      setSavedBillId(saved.id);

      setSaveMessage("Bill saved successfully.");

      window.dispatchEvent(new Event("food-bills-updated"));
    } catch (error) {
      console.error("Food bill save error:", error);

      setSaveMessage("Unable to save bill. Please try again.");
    }
  }, [bill, items, savedBillId, hasItems, editMode]);

  /* =====================================================
     OPEN SAVED BILL
     ===================================================== */

  const handleOpenBill = useCallback((saved) => {
    if (!saved) return;

    setBill({
      ...DEFAULT_BILL,
      ...(saved.bill || {}),
    });

    setItems(
      Array.isArray(saved.items)
        ? saved.items.map((item) => ({
            ...item,
          }))
        : createDefaultItems(),
    );

    setSavedBillId(saved.id ?? null);

    setEditMode(true);

    setSaveMessage("Saved bill opened.");

    setHasSelection(false);
    setSelectedField(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /* =====================================================
     NEW BILL
     ===================================================== */

  const handleNewBill = useCallback(() => {
    if (!editMode) return;

    setBill({
      ...DEFAULT_BILL,
    });

    setItems(createDefaultItems());

    setSavedBillId(null);

    setSaveMessage("");

    setHasSelection(false);
    setSelectedField(null);

    setFont(FONT);
    setFontSize(DEFAULT_FONT_SIZE);
    setBold(false);
  }, [editMode]);

  /* =====================================================
     PRINT
     ===================================================== */

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* =====================================================
     RENDER
     ===================================================== */

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
        boxSizing: "border-box",
      }}
    >
      {/* TOOLBAR */}

      <FoodBillToolbar
        onPrint={handlePrint}
        onAddItem={addItem}
        onReset={reset}
        onSaveBill={handleSaveBill}
        font={font}
        fontSize={fontSize}
        bold={bold}
        fontOptions={FONT_OPTIONS}
        onFontChange={handleFontChange}
        onFontSizeChange={handleFontSizeChange}
        onBoldChange={handleBoldChange}
        onSelectAllText={handleSelectAllText}
        hasSelection={hasSelection}
        selectedField={selectedField}
        editMode={editMode}
        onEditModeToggle={() => setEditMode((previous) => !previous)}
      />

      {/* SAVE STATUS */}

      {saveMessage && (
        <div
          className="no-print"
          role="status"
          aria-live="polite"
          style={{
            width: "100%",
            maxWidth: "520px",
            marginBottom: "8px",
            padding: "8px 12px",
            boxSizing: "border-box",
            borderRadius: "7px",
            background: saveMessage.includes("successfully")
              ? "#edf8f1"
              : "#fff5e9",
            border:
              "1px solid " +
              (saveMessage.includes("successfully") ? "#b8dec5" : "#ead0a9"),
            color: saveMessage.includes("successfully") ? "#187a3d" : "#9a5b1d",
            fontSize: "11px",
            textAlign: "center",
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* RECEIPT */}

      <div
        className="receipt-paper"
        style={{
          background: "#fffef8",
          color: "#000",
          width: "100%",
          maxWidth: "400px",
          height: "auto",
          minHeight: 0,
          maxHeight: "none",
          padding: "26px 30px 34px",
          boxShadow:
            "0 2px 0 #b8ae96, " +
            "0 4px 0 #a89e86, " +
            "0 6px 20px rgba(0,0,0,0.28)",
          boxSizing: "border-box",

          /*
           * These styles are applied to the
           * complete bill when "Select Full
           * Bill Text" is active.
           */
          ...(selectedField === "fullBill"
            ? {
                fontFamily: font,
                fontSize: `${fontSize}px`,
                fontWeight: bold ? 700 : 400,
              }
            : {}),
        }}
      >
        <ReceiptHeader bill={bill} onChange={set} />

        {/* ITEMS */}

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

        {/* TOTALS */}

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

      {/* SAVED BILLS */}

      <SavedBillsList onOpenBill={handleOpenBill} onNewBill={handleNewBill} />

      {/* FOOTER */}

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
        {editMode ? "Edit Mode ON" : "View Mode"}
        &nbsp; · &nbsp; Totals auto-calculate &nbsp; · &nbsp; 🖨 Print hides
        edit controls
      </p>
    </div>
  );
}
