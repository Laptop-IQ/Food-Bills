import React, { useEffect, useMemo, useState } from "react";
import { deleteBillTemplate, getBillTemplates, saveBillTemplate } from "./Hotels/templatesStorage";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function BillTemplateManager({
  open,
  darkMode = false,
  currentBill,
  currentItems,
  currentTextStyles,
  currentFontFamily,
  currentFontSize,
  editingTemplateId = null,
  initialName = "",
  onClose,
  onLoad,
  onSaved,
}) {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTemplates(getBillTemplates());
    setName(initialName || (currentBill?.title ? `${currentBill.title} Template` : "My Bill Template"));
  }, [open, currentBill?.title, initialName]);

  useEffect(() => {
    if (!open) return;
    const refresh = () => setTemplates(getBillTemplates());
    window.addEventListener("bill-templates-updated", refresh);
    return () => window.removeEventListener("bill-templates-updated", refresh);
  }, [open]);

  const currentAmount = useMemo(
    () => (currentItems || []).reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.rate || 0), 0),
    [currentItems],
  );

  if (!open) return null;

  const saveCurrent = (forceNew = false) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      const saved = saveBillTemplate({
        id: forceNew ? null : editingTemplateId,
        name: trimmed,
        bill: currentBill,
        items: currentItems,
        textStyles: currentTextStyles,
        fontFamily: currentFontFamily,
        fontSize: currentFontSize,
      });
      setTemplates(getBillTemplates());
      onSaved?.(saved, forceNew ? null : editingTemplateId);
    } finally {
      setSaving(false);
    }
  };

  const removeTemplate = (id) => {
    if (!window.confirm("Delete this template?")) return;
    setTemplates(deleteBillTemplate(id));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
      <div className={`max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl border shadow-[0_30px_100px_rgba(0,0,0,.35)] ${darkMode ? "border-white/10 bg-[#15151a] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
        <div className={`flex items-center justify-between border-b px-5 py-4 ${darkMode ? "border-white/10" : "border-slate-200"}`}>
          <div>
            <h2 className="text-lg font-black">Bill Templates</h2>
            <p className={`mt-0.5 text-xs ${darkMode ? "text-white/55" : "text-slate-500"}`}>
              Save your edited bill design and reuse it for future bills.
            </p>
          </div>
          <button onClick={onClose} className={`rounded-xl px-3 py-2 text-lg ${darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"}`} aria-label="Close">×</button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <div className={`rounded-2xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-50"}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Save current bill as template</h3>
                <p className={`mt-1 text-xs ${darkMode ? "text-white/50" : "text-slate-500"}`}>
                  Current items total: {money(currentAmount)}
                </p>
              </div>
              {editingTemplateId && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">EDITING TEMPLATE</span>}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                className={`min-w-0 flex-1 rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 ${darkMode ? "border-white/10 bg-black/20 text-white placeholder:text-white/30" : "border-slate-200 bg-white"}`}
              />
              <button
                disabled={saving || !name.trim()}
                onClick={() => saveCurrent(false)}
                className="whitespace-nowrap rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {editingTemplateId ? "Update Template" : "Save Template"}
              </button>
              {editingTemplateId && (
                <button
                  disabled={saving || !name.trim()}
                  onClick={() => saveCurrent(true)}
                  className={`whitespace-nowrap rounded-xl border px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50 ${darkMode ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]" : "border-slate-200 bg-white hover:bg-slate-100"}`}
                >
                  Save as New
                </button>
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Saved templates</h3>
              <span className={`text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>{templates.length} total</span>
            </div>

            {templates.length === 0 ? (
              <div className={`rounded-2xl border border-dashed p-8 text-center text-sm ${darkMode ? "border-white/10 text-white/45" : "border-slate-300 text-slate-500"}`}>
                No templates saved yet.
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <div key={template.id} className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${darkMode ? "border-white/10 bg-white/[0.02]" : "border-slate-200 bg-white"}`}>
                    <div className="min-w-0">
                      <p className="truncate font-bold">{template.name}</p>
                      <p className={`mt-1 text-xs ${darkMode ? "text-white/45" : "text-slate-500"}`}>
                        {template.bill?.title || "Bill"} · {template.items?.length || 0} items · Updated {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString("en-IN") : "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-row gap-2">
                      <button onClick={() => onLoad?.(template)} className="whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-500">Use Template</button>
                      <button onClick={() => removeTemplate(template.id)} className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 ${darkMode ? "border-red-400/20 bg-red-400/[0.04] text-red-300 hover:bg-red-400/10" : "border-red-200 text-red-600 hover:bg-red-50"}`}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
