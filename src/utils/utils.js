import { toWords } from "number-to-words";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Date -> "24 Sep 2026 02:11 PM"
export const formatDateTime = (d) => {
  const day = String(d.getDate()).padStart(2, "0");
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

// "24 Sep 2026 02:11 PM" -> Date (null if the text doesn't match)
export const parseDateTime = (text) => {
  const m = String(text || "")
    .trim()
    .match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  const month = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
  if (month < 0) return null;
  let hour = Number(m[4]) % 12;
  if (m[6].toUpperCase() === "PM") hour += 12;
  const d = new Date(Number(m[3]), month, Number(m[1]), hour, Number(m[5]));
  return Number.isNaN(d.getTime()) ? null : d;
};

export const getCurrentDateTime = () => formatDateTime(new Date());

export const getNextBillNo = (lastSerial) => {
  const next = lastSerial + 35;
  return { billNo: `FR65/2627/${String(next).padStart(6, "0")}`, serial: next };
};

export const generateOrderId = () => {
  const prefix = "czh83eZ55qY0FK";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++)
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  return prefix + suffix;
};

export const convertAmountToWords = (amount) => {
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);
  return `${toWords(rupees)} Indian rupee and ${toWords(paisa)} Paisa only`;
};

/* ------------------------------------------------------------------
   Flexible date / time helpers used by <DateTimePicker />
   Format tokens: YYYY YY | MMMM MMM MMMS(Sept) MM M | DD D |
                  HH H (24h) | hh h (12h) | mm | A (AM/PM) a (am/pm)
------------------------------------------------------------------- */
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const formatWith = (d, fmt) => {
  const h24 = d.getHours();
  const h12 = h24 % 12 || 12;
  const pad = (n) => String(n).padStart(2, "0");
  const map = {
    YYYY: d.getFullYear(),
    YY: pad(d.getFullYear() % 100),
    MMMM: MONTHS_FULL[d.getMonth()],
    MMMS: d.getMonth() === 8 ? "Sept" : MONTHS[d.getMonth()],
    MMM: MONTHS[d.getMonth()],
    MM: pad(d.getMonth() + 1),
    M: d.getMonth() + 1,
    DD: pad(d.getDate()),
    D: d.getDate(),
    HH: pad(h24),
    H: h24,
    hh: pad(h12),
    h: h12,
    mm: pad(d.getMinutes()),
    A: h24 >= 12 ? "PM" : "AM",
    a: h24 >= 12 ? "pm" : "am",
  };
  return String(fmt).replace(
    /YYYY|YY|MMMM|MMMS|MMM|MM|M|DD|D|HH|H|hh|h|mm|A|a/g,
    (t) => map[t]
  );
};

const monthIndex = (name) =>
  MONTHS.findIndex((m) => m.toLowerCase() === String(name).slice(0, 3).toLowerCase());

const fullYear = (y) => (String(y).length === 2 ? 2000 + Number(y) : Number(y));

const validDate = (y, m, d) => {
  const dt = new Date(y, m, d);
  return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    ? dt
    : null;
};

// "11 Sept 2026", "June 14, 2025", "05/06/26" (day first), "2026-09-24" -> Date | null
export const parseDate = (text) => {
  const t = String(text || "").trim();
  let m;
  if ((m = t.match(/^(\d{1,2})[\s/.-]+([A-Za-z]{3,9})\.?,?[\s/.-]+(\d{2}|\d{4})$/))) {
    const mi = monthIndex(m[2]);
    return mi < 0 ? null : validDate(fullYear(m[3]), mi, Number(m[1]));
  }
  if ((m = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/))) {
    const mi = monthIndex(m[1]);
    return mi < 0 ? null : validDate(Number(m[3]), mi, Number(m[2]));
  }
  if ((m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) {
    return validDate(fullYear(m[3]), Number(m[2]) - 1, Number(m[1]));
  }
  if ((m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/))) {
    return validDate(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  return null;
};

// "6:35 pm", "09:46 PM", "15:04" -> { h, m } in 24h | null
export const parseTime = (text) => {
  const m = String(text || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*([AaPp])?\.?[Mm]?\.?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  if (min > 59) return null;
  if (m[3]) {
    if (h > 12) return null;
    h = (h % 12) + (m[3].toLowerCase() === "p" ? 12 : 0);
  } else if (h > 23) return null;
  return { h, m: min };
};
