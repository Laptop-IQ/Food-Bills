import React, { useCallback, useEffect, useState } from "react";
import "../layout/print.css";

import {
  restaurantDefaults,
  defaultItems,
  FONT_SIZE_DEFAULT,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  VIEW,
} from "../layout/constants";

import { FONT_FAMILIES, GOOGLE_FONTS_URL } from "../layout/fonts";

import {
  getCurrentDateTime,
  getNextBillNo,
  generateOrderId,
} from "../utils/utils";

import { getThemeClasses } from "../layout/theme";

import {
  loadBillingState,
  saveBills,
  saveFontFamily,
  saveFontSize,
  saveDarkMode,
} from "../components/api/api";

import SavedBillsListView from "../components/SavedBillsListView";
import BillEditorView from "../components/BillEditorView";
import BillPreviewView from "../components/BillPreviewView";

import { Toast, ConfirmModal } from "../components/FeedbackUI";

export default function ThermalBill() {
  const [view, setView] = useState(VIEW.LIST);

  const [bill, setBill] = useState({
    ...restaurantDefaults,
    date: getCurrentDateTime(),
    billNo: "FR65/2627/001689",
    orderId: generateOrderId(),
    paid: false,
  });

  const [items, setItems] = useState(defaultItems);
  const [savedBills, setSavedBills] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [storageStatus, setStorageStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastSerial, setLastSerial] = useState(1689);

  const [fontFamily, setFontFamily] = useState("mono");
  const [fontSize, setFontSize] = useState(FONT_SIZE_DEFAULT);
  const [darkMode, setDarkMode] = useState(false);

  // Feedback UI
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ─────────────────────────────────────────────
     Feedback
  ───────────────────────────────────────────── */

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 3000 }) => {
      setToast({
        type,
        title,
        message,
        duration,
      });
    },
    [],
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  /* ─────────────────────────────────────────────
     Load saved state
  ───────────────────────────────────────────── */

  useEffect(() => {
    try {
      const state = loadBillingState();

      if (state.serial !== null) {
        setLastSerial(state.serial);
      }

      if (state.bills?.length) {
        setSavedBills(state.bills);
      }

      if (state.fontFamily) {
        setFontFamily(state.fontFamily);
      }

      if (state.fontSize !== null) {
        setFontSize(state.fontSize);
      }

      if (state.darkMode !== null) {
        setDarkMode(state.darkMode);
      }
    } catch (error) {
      console.error("Billing state load failed:", error);

      showToast({
        type: "error",
        title: "Loading failed",
        message: "Saved billing data could not be loaded.",
        duration: 4500,
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  /* ─────────────────────────────────────────────
     Google Fonts
  ───────────────────────────────────────────── */

  useEffect(() => {
    if (document.getElementById("thermal-bill-google-fonts")) return;

    const link = document.createElement("link");

    link.id = "thermal-bill-google-fonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;

    document.head.appendChild(link);
  }, []);

  /* ─────────────────────────────────────────────
     Storage
  ───────────────────────────────────────────── */

  const persistBills = useCallback(
    async (bills, serial) => {
      try {
        const result = await saveBills(bills, serial);

        if (!result.ok) {
          setStorageStatus(`⚠️ ${result.error || "Storage error"}`);

          showToast({
            type: "error",
            title: "Storage error",
            message: result.error || "Bill could not be saved.",
            duration: 4500,
          });

          return false;
        }

        setStorageStatus("");

        return true;
      } catch (error) {
        console.error("Storage failed:", error);

        setStorageStatus("⚠️ Unable to save data.");

        showToast({
          type: "error",
          title: "Storage error",
          message: "Unable to save billing data.",
          duration: 4500,
        });

        return false;
      }
    },
    [showToast],
  );

  /* ─────────────────────────────────────────────
     Font preferences
  ───────────────────────────────────────────── */

  const updateFontFamily = useCallback((id) => {
    setFontFamily(id);
    saveFontFamily(id);
  }, []);

  const updateFontSize = useCallback((size) => {
    const clamped = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size));

    setFontSize(clamped);
    saveFontSize(clamped);
  }, []);

  const resetFontPrefs = useCallback(() => {
    updateFontFamily("mono");
    updateFontSize(FONT_SIZE_DEFAULT);

    showToast({
      type: "info",
      title: "Font reset",
      message: "Receipt font settings restored to default.",
      duration: 2200,
    });
  }, [showToast, updateFontFamily, updateFontSize]);

  const activeFontCss =
    FONT_FAMILIES.find((f) => f.id === fontFamily)?.css || FONT_FAMILIES[0].css;

  /* ─────────────────────────────────────────────
     Theme
  ───────────────────────────────────────────── */

  const toggleDarkMode = useCallback(() => {
    const next = !darkMode;

    setDarkMode(next);
    saveDarkMode(next);

    showToast({
      type: "info",
      title: next ? "Dark mode enabled" : "Light mode enabled",
      message: "Appearance preference updated.",
      duration: 1800,
    });
  }, [darkMode, showToast]);

  const theme = getThemeClasses(darkMode);

  /* ─────────────────────────────────────────────
     Totals
  ───────────────────────────────────────────── */

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.qty || 0) * Number(item.rate || 0),
    0,
  );

  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;

  const actualTotal = subtotal + cgst + sgst;

  const grandTotal = Math.round(actualTotal);

  const roundedAmount = (grandTotal - actualTotal).toFixed(2);

  const totalQty = items.reduce((acc, item) => acc + Number(item.qty || 0), 0);

  const totals = {
    subtotal,
    cgst,
    sgst,
    grandTotal,
    roundedAmount,
    totalQty,
  };

  /* ─────────────────────────────────────────────
     Items
  ───────────────────────────────────────────── */

  const updateItem = useCallback((index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "name" ? value : Number(value),
            }
          : item,
      ),
    );
  }, []);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        qty: 1,
        rate: 0,
      },
    ]);

    showToast({
      type: "info",
      title: "Item added",
      message: "New item row added to the bill.",
      duration: 1500,
    });
  }, [showToast]);

  const deleteItem = useCallback(
    (index) => {
      setItems((prev) => prev.filter((_, i) => i !== index));

      showToast({
        type: "info",
        title: "Item removed",
        message: "The item was removed from this bill.",
        duration: 1600,
      });
    },
    [showToast],
  );

  /* ─────────────────────────────────────────────
     Paid
  ───────────────────────────────────────────── */

  const togglePaid = useCallback(() => {
    setBill((prev) => {
      const nextPaid = !prev.paid;

      showToast({
        type: nextPaid ? "success" : "info",
        title: nextPaid ? "Bill marked as paid" : "Payment status reset",
        message: nextPaid
          ? "This bill is now marked as paid."
          : "This bill is no longer marked as paid.",
        duration: 1800,
      });

      return {
        ...prev,
        paid: nextPaid,
      };
    });
  }, [showToast]);

  /* ─────────────────────────────────────────────
     New Bill
  ───────────────────────────────────────────── */

  const startNewBill = useCallback(() => {
    const { billNo, serial } = getNextBillNo(lastSerial);

    setLastSerial(serial);

    setBill({
      ...restaurantDefaults,
      date: getCurrentDateTime(),
      billNo,
      orderId: generateOrderId(),
      paid: false,
    });

    setItems(defaultItems);
    setEditingId(null);
    setStorageStatus("");
    setView(VIEW.EDITOR);

    showToast({
      type: "info",
      title: "New bill",
      message: "A fresh bill is ready to fill.",
      duration: 2000,
    });
  }, [lastSerial, showToast]);

  /* ─────────────────────────────────────────────
     Edit
  ───────────────────────────────────────────── */

  const startEditBill = useCallback(
    (saved) => {
      setEditingId(saved.id);

      setBill({
        paid: false,
        ...saved.bill,
      });

      setItems(saved.items || []);
      setStorageStatus("");
      setView(VIEW.EDITOR);

      showToast({
        type: "info",
        title: "Bill loaded",
        message: "You can now edit this saved bill.",
        duration: 2200,
      });
    },
    [showToast],
  );

  /* ─────────────────────────────────────────────
     Save
  ───────────────────────────────────────────── */

  const saveBill = useCallback(async () => {
    let updatedBills;

    if (editingId !== null) {
      updatedBills = savedBills.map((b) =>
        b.id === editingId
          ? {
              ...b,
              bill,
              items,
              grandTotal,
            }
          : b,
      );
    } else {
      const newEntry = {
        id: Date.now(),
        bill,
        items,
        grandTotal,
      };

      updatedBills = [...savedBills, newEntry];

      setEditingId(newEntry.id);
    }

    const ok = await persistBills(updatedBills, lastSerial);

    if (!ok) return false;

    setSavedBills(updatedBills);
    setStorageStatus("");

    showToast({
      type: "success",
      title: "Bill saved",
      message: `Bill ${bill.billNo || ""} has been saved successfully.`,
      duration: 2500,
    });

    return true;
  }, [
    editingId,
    savedBills,
    bill,
    items,
    grandTotal,
    persistBills,
    lastSerial,
    showToast,
  ]);

  /* ─────────────────────────────────────────────
     Print
  ───────────────────────────────────────────── */

  const printAndSave = useCallback(async () => {
    const saved = await saveBill();

    if (!saved) {
      showToast({
        type: "error",
        title: "Print cancelled",
        message: "Please save the bill successfully before printing.",
        duration: 3500,
      });

      return;
    }

    showToast({
      type: "info",
      title: "Opening print dialog",
      message: "Your browser print window is being prepared.",
      duration: 1800,
    });

    // Give React a moment to finish the save/UI update.
    setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error("Print failed:", error);

        showToast({
          type: "error",
          title: "Print failed",
          message: "Unable to open the browser print dialog.",
          duration: 4500,
        });
      }
    }, 150);
  }, [saveBill, showToast]);

  /* ─────────────────────────────────────────────
     Delete Request
  ───────────────────────────────────────────── */

  const requestDeleteBill = useCallback(
    (id) => {
      const target = savedBills.find((b) => b.id === id);

      if (!target) return;

      setDeleteTarget(target);
    },
    [savedBills],
  );

  /* ─────────────────────────────────────────────
     Confirm Delete
  ───────────────────────────────────────────── */

  const confirmDeleteBill = useCallback(async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;

    const updated = savedBills.filter((b) => b.id !== id);

    const ok = await persistBills(updated, lastSerial);

    if (!ok) return;

    setSavedBills(updated);

    if (editingId === id) {
      setEditingId(null);
    }

    setDeleteTarget(null);

    showToast({
      type: "success",
      title: "Bill deleted",
      message: "The saved bill was permanently removed.",
      duration: 2500,
    });
  }, [
    deleteTarget,
    savedBills,
    lastSerial,
    editingId,
    persistBills,
    showToast,
  ]);

  /* ─────────────────────────────────────────────
     Font controls
  ───────────────────────────────────────────── */

  const fontControlProps = {
    darkMode,
    fontFamily,
    fontSize,
    activeFontCss,
    onFontFamilyChange: updateFontFamily,
    onFontSizeChange: updateFontSize,
    onReset: resetFontPrefs,
  };

  /* ─────────────────────────────────────────────
     LIST
  ───────────────────────────────────────────── */

  if (view === VIEW.LIST) {
    return (
      <>
        <SavedBillsListView
          theme={theme}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          startNewBill={startNewBill}
          loading={loading}
          savedBills={savedBills}
          startEditBill={startEditBill}
          setView={setView}
          deleteSavedBill={requestDeleteBill}
        />

        <Toast toast={toast} onClose={closeToast} />

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete this bill?"
          message={
            deleteTarget
              ? `"${deleteTarget.bill?.billNo || "Untitled bill"}" will be permanently removed from your saved bills. This action cannot be undone.`
              : ""
          }
          confirmText="Delete Bill"
          cancelText="Keep Bill"
          onConfirm={confirmDeleteBill}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  /* ─────────────────────────────────────────────
     EDITOR
  ───────────────────────────────────────────── */

  if (view === VIEW.EDITOR) {
    return (
      <>
        <BillEditorView
          theme={theme}
          darkMode={darkMode}
          editingId={editingId}
          bill={bill}
          setBill={setBill}
          items={items}
          updateItem={updateItem}
          addItem={addItem}
          deleteItem={deleteItem}
          onSave={saveBill}
          setView={setView}
          storageStatus={storageStatus}
          fontControlProps={fontControlProps}
          totals={totals}
          onTogglePaid={togglePaid}
        />

        <Toast toast={toast} onClose={closeToast} />

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete this bill?"
          message={
            deleteTarget
              ? `"${deleteTarget.bill?.billNo || "Untitled bill"}" will be permanently removed from your saved bills.`
              : ""
          }
          confirmText="Delete Bill"
          cancelText="Keep Bill"
          onConfirm={confirmDeleteBill}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  /* ─────────────────────────────────────────────
     PREVIEW
  ───────────────────────────────────────────── */

  if (view === VIEW.PREVIEW) {
    return (
      <>
        <BillPreviewView
          theme={theme}
          setView={setView}
          fontControlProps={fontControlProps}
          bill={bill}
          items={items}
          totals={totals}
          onPrintAndSave={printAndSave}
          onSaveOnly={saveBill}
          storageStatus={storageStatus}
          onTogglePaid={togglePaid}
        />

        <Toast toast={toast} onClose={closeToast} />

        <ConfirmModal
          open={Boolean(deleteTarget)}
          title="Delete this bill?"
          message={
            deleteTarget
              ? `"${deleteTarget.bill?.billNo || "Untitled bill"}" will be permanently removed from your saved bills.`
              : ""
          }
          confirmText="Delete Bill"
          cancelText="Keep Bill"
          onConfirm={confirmDeleteBill}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  return null;
}
