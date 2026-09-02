export const FONT = "'Courier New', Courier, monospace";

export const DEFAULT_FONT_SIZE = 12;

export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 28;
export const FONT_STEP = 1;

export const FONT_OPTIONS = [
  {
    label: "Default",
    value: FONT,
  },
  {
    label: "Courier New",
    value: "'Courier New', Courier, monospace",
  },
  {
    label: "Arial",
    value: "Arial, Helvetica, sans-serif",
  },
  {
    label: "Georgia",
    value: "Georgia, 'Times New Roman', serif",
  },
  {
    label: "Times New Roman",
    value: "'Times New Roman', Times, serif",
  },
  {
    label: "Verdana",
    value: "Verdana, Geneva, sans-serif",
  },
  {
    label: "Trebuchet MS",
    value: "'Trebuchet MS', Arial, sans-serif",
  },
];

/*
 * Default Golden Hut receipt.
 *
 * These values are intentionally kept populated so the
 * first preview looks like the Golden Hut sample instead
 * of showing an empty receipt.
 */
export const DEFAULT_BILL = {
  name: "GOLDEN HUT",
  addr1: "G.T ROAD RAI SONEPAT",
  addr2: "(DELHI TO AMBALA)",
  gstin: "06ABFFR7045A1ZH",
  phone: "9992430999",
  billNo: "B000147",
  time: "15:04",
  date: "05/06/26",
  table: "52",
  pax: "1",
  user: "happy",
  orderNo: "G000294\\G000306\\G000324\\G00032",
  cgst: 2.5,
  sgst: 2.5,
  paid: 0,
};

export const DEFAULT_ITEMS = [
  {
    id: 1,
    qty: 1,
    desc: "LACHHA PARANTHA",
    price: 99,
  },
  {
    id: 2,
    qty: 2,
    desc: "PLAIN ROTI",
    price: 78,
  },
  {
    id: 3,
    qty: 1,
    desc: "KADHAI PANEER",
    price: 379,
  },
  {
    id: 4,
    qty: 1,
    desc: "HARA BHARA KEBAB",
    price: 359,
  },
  {
    id: 5,
    qty: 1,
    desc: "GARLIC NAAN",
    price: 119,
  },
  {
    id: 6,
    qty: 1,
    desc: "ADRAK CHAI",
    price: 40,
  },
  {
    id: 7,
    qty: 2,
    desc: "LEMON SODA",
    price: 198,
  },
  {
    id: 8,
    qty: 1,
    desc: "MINERAL WATER",
    price: 30,
  },
];

/*
 * Formatting is stored per field.
 *
 * Important:
 * Do NOT put these styles directly into DEFAULT_BILL.
 * Bill data and visual formatting remain separate.
 */
export const DEFAULT_TEXT_STYLES = {
  name: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: "bold",
  },

  addr1: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  addr2: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  gstin: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  phone: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  billNo: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  time: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  date: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  table: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  pax: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  user: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: "normal",
  },

  orderNo: {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: "normal",
  },

  subtotal: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "normal",
  },

  payable: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "bold",
  },

  paid: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "normal",
  },

  balance: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: "bold",
  },

  footer: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: "bold",
  },
};

export const createDefaultTextStyles = () =>
  Object.fromEntries(
    Object.entries(DEFAULT_TEXT_STYLES).map(([key, style]) => [
      key,
      { ...style },
    ]),
  );
