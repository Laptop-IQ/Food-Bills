import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ROWS } from "./expenseRows";
import { buildInitialState } from "./formState";
import { ni } from "./numberUtils";
import { loadRecords, saveRecords } from "./recordsApi";
import { generatePrintHTML } from "./printTemplate";

import SFDyesToolbar from "./SFDyesToolbar";
import FormHeaderTables from "./FormHeaderTables";
import ExpenseTable from "./ExpenseTable";
import SignatureBlock from "./SignatureBlock";
import SavedRecordsPanel from "./SavedRecordsPanel";

export default function SFDyesExpenseForm() {
  const navigate = useNavigate();

  // ── Saved Records — loaded from localStorage on mount ──
  const [savedRecords, setSavedRecords] = useState(() => loadRecords());

  const [selectedId, setSelectedId] = useState(null);
  const [d, setD] = useState(buildInitialState);
  const [editing, setEditing] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false); // visual feedback on save

  const dataRef = useRef(d);
  useEffect(() => {
    dataRef.current = d;
  }, [d]);

  // Persist to localStorage whenever savedRecords changes
  useEffect(() => {
    saveRecords(savedRecords);
  }, [savedRecords]);

  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));

  const total = ROWS.reduce((s, r) => s + ni(d[r.ak]), 0);
  const net = total - ni(d.lessAdvance);
  const suppVchr = ROWS.reduce((s, r) => (r.sk ? s + ni(d[r.sk]) : s), 0);

  // ── Save record (upsert) ──
  const saveRecord = (data = null) => {
    const snapshot = data || dataRef.current;
    const t = ROWS.reduce((s, r) => s + ni(snapshot[r.ak]), 0);
    const n = t - ni(snapshot.lessAdvance);
    const sv = ROWS.reduce((s, r) => (r.sk ? s + ni(snapshot[r.sk]) : s), 0);

    const record = {
      ...snapshot,
      id: selectedId || Date.now(),
      total: t,
      net: n,
      suppVchr: sv,
      savedAt: new Date().toLocaleString("en-IN"),
    };

    setSavedRecords((prev) => {
      const exists = prev.find((x) => x.id === record.id);
      return exists
        ? prev.map((x) => (x.id === record.id ? record : x))
        : [record, ...prev];
    });
    setSelectedId(record.id);

    // Flash feedback
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);

    return record;
  };

  // ── Print / PDF ──
  const handlePrint = () => {
    saveRecord();
    const latest = structuredClone(dataRef.current);
    const t = ROWS.reduce((s, r) => s + ni(latest[r.ak]), 0);
    const n = t - ni(latest.lessAdvance);
    const sv = ROWS.reduce((s, r) => (r.sk ? s + ni(latest[r.sk]) : s), 0);

    const html = generatePrintHTML(latest, t, n, sv);
    const w = window.open("", "_blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 300);
  };

  // ── Load a saved record into the form ──
  const loadRecord = (r) => {
    setD(r);
    setSelectedId(r.id);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete a saved record ──
  const deleteRecord = (id) => {
    if (!window.confirm("Is record ko delete karna chahte hain?")) return;
    setSavedRecords((prev) => prev.filter((x) => x.id !== id));
    if (selectedId === id) {
      setD(buildInitialState());
      setSelectedId(null);
      setEditing(false);
    }
  };

  const handleNew = () => {
    setD(buildInitialState());
    setSelectedId(null);
    setEditing(true);
  };

  return (
    <div className="min-h-screen bg-slate-500 text-black flex flex-col items-center py-6 px-2 print:bg-white print:py-0">
      <SFDyesToolbar
        onBack={() => navigate("/")}
        editing={editing}
        onToggleEdit={() => setEditing((e) => !e)}
        saveFlash={saveFlash}
        onSave={() => saveRecord()}
        onPrint={handlePrint}
        onNew={handleNew}
      />

      {/* ── Paper ── */}
      <div className="w-full max-w-[920px] bg-white border-2 border-gray-600 shadow-2xl print:shadow-none print:border-0 print:max-w-full">
        <FormHeaderTables d={d} set={set} editing={editing} />
        <ExpenseTable
          d={d}
          set={set}
          editing={editing}
          total={total}
          net={net}
          suppVchr={suppVchr}
        />
        <SignatureBlock net={net} />
      </div>

      <SavedRecordsPanel
        savedRecords={savedRecords}
        selectedId={selectedId}
        onLoad={loadRecord}
        onDelete={deleteRecord}
      />

      {/* Edit hint */}
      {!editing && (
        <p className="mt-3 text-[11px] text-white/70 print:hidden">
          Click <strong>✏️ Edit Form</strong> to modify any field
        </p>
      )}
    </div>
  );
}
