export const TEXT_STYLE_FIELDS = [
  { id: "title", label: "Restaurant Name", group: "Header" },
  { id: "branch", label: "Branch", group: "Header" },
  { id: "franchise", label: "Franchise", group: "Header" },
  { id: "address1", label: "Address Line 1", group: "Header" },
  { id: "address2", label: "Address Line 2", group: "Header" },
  { id: "city", label: "City", group: "Header" },
  { id: "phone", label: "Phone", group: "Header" },
  { id: "email", label: "Email", group: "Header" },
  { id: "gst", label: "GST Number", group: "Header" },
  { id: "date", label: "Date & Time", group: "Header" },
  { id: "dine", label: "Dine Type", group: "Header" },
  { id: "billNo", label: "Bill Number", group: "Bill Info" },
  { id: "orderId", label: "Order ID", group: "Bill Info" },
  { id: "tableUser", label: "Table / User", group: "Bill Info" },
  { id: "itemsHeader", label: "Items Header", group: "Items" },
  { id: "itemRow", label: "Item Rows", group: "Items" },
  { id: "subtotal", label: "Subtotal", group: "Totals" },
  { id: "cgst", label: "CGST", group: "Totals" },
  { id: "sgst", label: "SGST", group: "Totals" },
  { id: "grandTotal", label: "Grand Total", group: "Totals" },
  { id: "roundedAmount", label: "Rounded Amount", group: "Totals" },
  { id: "amountWords", label: "Amount in Words", group: "Totals" },
  { id: "footer", label: "Footer", group: "Footer" },
  { id: "poweredBy", label: "Powered By", group: "Footer" },
];

const DEFAULT_STYLE = {
  fontSize: null,
  fontWeight: 400,
  marginTop: 0,
  marginBottom: 0,
  lineHeight: 1.25,
  textAlign: "inherit",
};

export const DEFAULT_TEXT_STYLES = Object.fromEntries(
  TEXT_STYLE_FIELDS.map(({ id }) => [id, { ...DEFAULT_STYLE }]),
);

// Sensible receipt-specific defaults. `fontSize: null` means the receipt's
// global font size and its built-in scale are used until the user overrides it.
Object.assign(DEFAULT_TEXT_STYLES, {
  title: { ...DEFAULT_STYLE, fontWeight: 900, lineHeight: 1.05, marginBottom: 2 },
  branch: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.15 },
  franchise: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.15 },
  address1: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  address2: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  city: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  phone: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  email: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  gst: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.1, marginTop: 1 },
  date: { ...DEFAULT_STYLE, lineHeight: 1.1 },
  dine: { ...DEFAULT_STYLE, fontWeight: 900, lineHeight: 1.1, marginTop: 4, marginBottom: 2 },
  billNo: { ...DEFAULT_STYLE, fontWeight: 900, lineHeight: 1.15, marginBottom: 1 },
  orderId: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.15 },
  tableUser: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.2 },
  itemsHeader: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.25, marginBottom: 2 },
  itemRow: { ...DEFAULT_STYLE, lineHeight: 1.25 },
  subtotal: { ...DEFAULT_STYLE, fontWeight: 700, lineHeight: 1.5 },
  cgst: { ...DEFAULT_STYLE, fontWeight: 600, lineHeight: 1.5 },
  sgst: { ...DEFAULT_STYLE, fontWeight: 600, lineHeight: 1.5 },
  grandTotal: { ...DEFAULT_STYLE, fontWeight: 900, lineHeight: 1.25, marginTop: 10 },
  roundedAmount: { ...DEFAULT_STYLE, lineHeight: 1.4, marginTop: 4 },
  amountWords: { ...DEFAULT_STYLE, fontWeight: 400, lineHeight: 1.4, marginTop: 4 },
  footer: { ...DEFAULT_STYLE, lineHeight: 1.3, marginTop: 0 },
  poweredBy: { ...DEFAULT_STYLE, lineHeight: 1.3, marginTop: 4 },
});

export function cloneDefaultTextStyles() {
  return Object.fromEntries(
    Object.entries(DEFAULT_TEXT_STYLES).map(([key, value]) => [key, { ...value }]),
  );
}

export function normalizeTextStyles(input) {
  const source = input && typeof input === "object" ? input : {};
  const defaults = cloneDefaultTextStyles();

  for (const key of Object.keys(defaults)) {
    if (!source[key] || typeof source[key] !== "object") continue;

    const value = source[key];
    defaults[key] = {
      ...defaults[key],
      ...(Number.isFinite(Number(value.fontSize)) && Number(value.fontSize) > 0
        ? { fontSize: Number(value.fontSize) }
        : value.fontSize === null
          ? { fontSize: null }
          : {}),
      fontWeight: [400, 500, 600, 700, 800, 900].includes(Number(value.fontWeight))
        ? Number(value.fontWeight)
        : defaults[key].fontWeight,
      marginTop: Number.isFinite(Number(value.marginTop))
        ? Math.max(-20, Math.min(40, Number(value.marginTop)))
        : defaults[key].marginTop,
      marginBottom: Number.isFinite(Number(value.marginBottom))
        ? Math.max(-20, Math.min(40, Number(value.marginBottom)))
        : defaults[key].marginBottom,
      lineHeight: Number.isFinite(Number(value.lineHeight))
        ? Math.max(0.7, Math.min(3, Number(value.lineHeight)))
        : defaults[key].lineHeight,
      textAlign: ["left", "center", "right", "inherit"].includes(value.textAlign)
        ? value.textAlign
        : defaults[key].textAlign,
    };
  }

  return defaults;
}
