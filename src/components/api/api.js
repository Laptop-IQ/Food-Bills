// Persistence layer for ThermalBill.
// Every localStorage call in the app lives here. Components never touch
// localStorage directly — if this is ever swapped for a real backend,
// only this file needs to change.

const STORAGE_KEYS = {
  BILLS: "thermalBills",
  SERIAL: "lastBillSerial",
  FONT_FAMILY: "billFontFamily",
  FONT_SIZE: "billFontSize",
  DARK_MODE: "billDarkMode",
};

// Reads everything needed on startup in one go.
export function loadBillingState() {
  const state = {
    bills: [],
    serial: null,
    fontFamily: null,
    fontSize: null,
    darkMode: null,
  };
  try {
    const bills = localStorage.getItem(STORAGE_KEYS.BILLS);
    const serial = localStorage.getItem(STORAGE_KEYS.SERIAL);
    const fontFamily = localStorage.getItem(STORAGE_KEYS.FONT_FAMILY);
    const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    const darkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);

    if (bills) state.bills = JSON.parse(bills);
    if (serial) state.serial = parseInt(serial, 10);
    if (fontFamily) state.fontFamily = fontFamily;
    if (fontSize) state.fontSize = parseInt(fontSize, 10);
    if (darkMode) state.darkMode = darkMode === "true";
  } catch (err) {
    console.error(err);
  }
  return state;
}

// Writes the bills array + serial together. Returns { ok, error } so the
// caller can decide how to surface a failure in the UI.
export function saveBills(bills, serial) {
  try {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    localStorage.setItem(STORAGE_KEYS.SERIAL, String(serial));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function saveFontFamily(id) {
  try {
    localStorage.setItem(STORAGE_KEYS.FONT_FAMILY, id);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function saveFontSize(size) {
  try {
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, String(size));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function saveDarkMode(value) {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(value));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
