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

  // Preview-only paper variation. Print CSS resets this to a clean centered receipt.
  const [receiptPlacement] = useState(() => ({
    // Subtle random print placement; kept within the paper bounds.
    x: Math.round(Math.random() * 16 - 8),
    y: Math.round(Math.random() * 10 - 5),
    rotate: Number((Math.random() * 1.2 - 0.6).toFixed(2)),
  }));

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
    window.scrollTo({ top: 0, behavior: "smooth" });

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

  const saveOk =
    saveMessage.includes("successfully") ||
    saveMessage === "Saved bill opened.";

  return (
    <div className="food-bill-page min-h-screen bg-ivory font-sans text-ink">
      <div className="mx-auto w-full max-w-[936px] px-4 pb-28 pt-6 sm:px-8 sm:pt-10 lg:pb-12">
        {/* Page header */}
        <header className="no-print mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-500">
            Food bill
          </p>
          <h1 className="mt-1.5 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
            Bill editor
          </h1>
          <p className="mt-1 text-sm text-slate-muted">
            Edit the receipt directly, then save or print it. Totals calculate
            automatically.
          </p>
        </header>

        {/* Save status */}
        {saveMessage && (
          <div
            className={`no-print mb-4 flex items-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-medium ${
              saveOk
                ? "border-success/25 bg-success/10 text-success"
                : "border-warning/30 bg-warning/10 text-warning"
            }`}
            role="status"
            aria-live="polite"
          >
            <i
              aria-hidden="true"
              className={`${saveOk ? "ri-checkbox-circle-line" : "ri-information-line"} text-[18px] leading-none`}
            />
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,380px)] lg:gap-8">
          {/* RECEIPT */}
          <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="rounded-md border border-line bg-neutral-bg p-3 sm:p-6">
              <div
                className="receipt-paper mx-auto"
                style={{
                  fontFamily: FONT,
                  background: "#fffef8",
                  color: "#000",
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  minHeight: 0,
                  maxHeight: "none",
                  padding: "26px 30px 34px",
                  boxShadow:
                    "0 18px 38px rgba(15,23,42,0.20), 0 5px 12px rgba(15,23,42,0.12)",
                  "--receipt-transform": `translate(${receiptPlacement.x}px, ${receiptPlacement.y}px) rotate(${receiptPlacement.rotate}deg)`,
                  transform: `translate(${receiptPlacement.x}px, ${receiptPlacement.y}px) rotate(${receiptPlacement.rotate}deg)`,
                  boxSizing: "border-box",
                  /* Applied to the complete bill when "Select full bill text" is active. */
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
            </div>
          </div>

          {/* TOOLS */}
          <div className="order-2 min-w-0 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start">
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
          </div>
        </div>

        {/* SAVED BILLS */}
        <SavedBillsList onOpenBill={handleOpenBill} onNewBill={handleNewBill} />
      </div>
    </div>
  );
}
