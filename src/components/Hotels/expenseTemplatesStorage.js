const STORAGE_KEY = "sf-expense-templates";

// Fields that belong to one saved record, never to a template
const RECORD_ONLY_KEYS = ["id", "savedAt", "total", "net", "suppVchr"];

export function loadTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTemplates(templates) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch {
    return false;
  }
}

/**
 * Snapshot of the form for a template.
 * Date and voucher no. are per-bill, so they are left blank unless asked for.
 */
export function buildTemplateData(form, includeDateVoucher = false) {
  const data = { ...form };
  RECORD_ONLY_KEYS.forEach((key) => delete data[key]);
  if (!includeDateVoucher) {
    data.date = "";
    data.voucherNo = "";
  }
  return data;
}

export function createTemplateId() {
  return `tpl-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
