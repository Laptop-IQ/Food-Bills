const STORAGE_KEY = "thermal_bill_templates_v1";

export function getBillTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read bill templates:", error);
    return [];
  }
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function saveBillTemplate({ id, name, bill, items, textStyles, fontFamily, fontSize }) {
  const templates = getBillTemplates();
  const now = new Date().toISOString();
  const template = {
    id: id || createId(),
    name: String(name || "Untitled Template").trim() || "Untitled Template",
    bill: { ...(bill || {}) },
    items: Array.isArray(items) ? items.map((item) => ({ ...item })) : [],
    textStyles: textStyles ? JSON.parse(JSON.stringify(textStyles)) : null,
    fontFamily: fontFamily || "mono",
    fontSize: Number(fontSize) || 12,
    createdAt: templates.find((item) => item.id === id)?.createdAt || now,
    updatedAt: now,
  };

  const next = id
    ? templates.map((item) => (item.id === id ? template : item))
    : [template, ...templates];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("bill-templates-updated"));
  return template;
}

export function deleteBillTemplate(id) {
  const next = getBillTemplates().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("bill-templates-updated"));
  return next;
}

export function clearBillTemplates() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("bill-templates-updated"));
}
