import React, { useState, useEffect } from "react";
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
import { getCurrentDateTime, getNextBillNo, generateOrderId } from "../utils/utils";
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

export default function ThermalBill() {
  const [view, setView] = useState(VIEW.LIST);
  const [bill, setBill] = useState({
    ...restaurantDefaults,
    date: getCurrentDateTime(),
    billNo: "FR65/2627/001689",
    orderId: generateOrderId(),
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

  useEffect(() => {
    const state = loadBillingState();
    if (state.serial !== null) setLastSerial(state.serial);
    if (state.bills.length) setSavedBills(state.bills);
    if (state.fontFamily) setFontFamily(state.fontFamily);
    if (state.fontSize !== null) setFontSize(state.fontSize);
    if (state.darkMode !== null) setDarkMode(state.darkMode);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (document.getElementById("thermal-bill-google-fonts")) return;
    const link = document.createElement("link");
    link.id = "thermal-bill-google-fonts";
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  const persistBills = async (bills, serial) => {
    const result = saveBills(bills, serial);
    if (!result.ok) setStorageStatus("⚠️ Storage error: " + result.error);
    return result.ok;
  };

  const updateFontFamily = (id) => {
    setFontFamily(id);
    saveFontFamily(id);
  };

  const updateFontSize = (size) => {
    const clamped = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size));
    setFontSize(clamped);
    saveFontSize(clamped);
  };

  const resetFontPrefs = () => {
    updateFontFamily("mono");
    updateFontSize(FONT_SIZE_DEFAULT);
  };

  const activeFontCss =
    FONT_FAMILIES.find((f) => f.id === fontFamily)?.css || FONT_FAMILIES[0].css;

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    saveDarkMode(next);
  };

  const theme = getThemeClasses(darkMode);

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const actualTotal = subtotal + cgst + sgst;
  const grandTotal = Math.round(actualTotal);
  const roundedAmount = (grandTotal - actualTotal).toFixed(2);
  const totalQty = items.reduce((acc, item) => acc + Number(item.qty), 0);
  const totals = { subtotal, cgst, sgst, grandTotal, roundedAmount, totalQty };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "name" ? value : Number(value);
    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { id: Date.now(), name: "", qty: 1, rate: 0 }]);
  const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));

  const startNewBill = () => {
    const { billNo, serial } = getNextBillNo(lastSerial);
    setLastSerial(serial);
    setBill({
      ...restaurantDefaults,
      date: getCurrentDateTime(),
      billNo,
      orderId: generateOrderId(),
    });
    setItems(defaultItems);
    setEditingId(null);
    setStorageStatus("");
    setView(VIEW.EDITOR);
  };

  const startEditBill = (saved) => {
    setEditingId(saved.id);
    setBill(saved.bill);
    setItems(saved.items);
    setStorageStatus("");
    setView(VIEW.EDITOR);
  };

  const saveBill = async () => {
    let updatedBills;
    if (editingId !== null) {
      updatedBills = savedBills.map((b) =>
        b.id === editingId ? { ...b, bill, items, grandTotal } : b,
      );
    } else {
      const newEntry = { id: Date.now(), bill, items, grandTotal };
      updatedBills = [...savedBills, newEntry];
      setEditingId(newEntry.id);
    }
    const ok = await persistBills(updatedBills, lastSerial);
    if (ok) {
      setSavedBills(updatedBills);
      setStorageStatus("✅ Bill saved successfully!");
      setTimeout(() => setStorageStatus(""), 3000);
    }
  };

  const printAndSave = async () => {
    await saveBill();
    window.print();
  };

  const deleteSavedBill = async (id) => {
    if (!window.confirm("Kya aap yeh bill delete karna chahte hain?")) return;
    const updated = savedBills.filter((b) => b.id !== id);
    const ok = await persistBills(updated, lastSerial);
    if (ok) setSavedBills(updated);
  };

  const fontControlProps = {
    darkMode,
    fontFamily,
    fontSize,
    activeFontCss,
    onFontFamilyChange: updateFontFamily,
    onFontSizeChange: updateFontSize,
    onReset: resetFontPrefs,
  };

  if (view === VIEW.LIST) {
    return (
      <SavedBillsListView
        theme={theme}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        startNewBill={startNewBill}
        loading={loading}
        savedBills={savedBills}
        startEditBill={startEditBill}
        setView={setView}
        deleteSavedBill={deleteSavedBill}
      />
    );
  }

  if (view === VIEW.EDITOR) {
    return (
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
      />
    );
  }

  if (view === VIEW.PREVIEW) {
    return (
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
      />
    );
  }

  return null;
}
