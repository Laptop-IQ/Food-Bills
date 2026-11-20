import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ROWS } from "./expenseRows";
import { buildInitialState } from "./formState";
import { ni } from "./numberUtils";
import { loadRecords, saveRecords } from "./recordsApi";
import { generatePrintHTML } from "./printTemplate";
import {
  loadTemplates,
  saveTemplates,
  buildTemplateData,
  createTemplateId,
} from "./expenseTemplatesStorage";

import SFDyesToolbar from "./SFDyesToolbar";
import FormHeaderTables from "./FormHeaderTables";
import ExpenseTable from "./ExpenseTable";
import SignatureBlock from "./SignatureBlock";
import SavedRecordsPanel from "./SavedRecordsPanel";
import ExpenseTemplatesModal from "./ExpenseTemplatesModal";

import { Toast, ConfirmModal } from "../FeedbackUI";

export default function SFDyesExpenseForm() {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
     State
  ───────────────────────────────────────────── */

  const [savedRecords, setSavedRecords] = useState(() => loadRecords());

  const [templates, setTemplates] = useState(() => loadTemplates());

  const [templatesOpen, setTemplatesOpen] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [d, setD] = useState(buildInitialState);

  const [editing, setEditing] = useState(false);

  const [toast, setToast] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const dataRef = useRef(d);
  const toastTimerRef = useRef(null);

  /* ─────────────────────────────────────────────
     Effects
  ───────────────────────────────────────────── */

  useEffect(() => {
    dataRef.current = d;
  }, [d]);

  useEffect(() => {
    saveRecords(savedRecords);
  }, [savedRecords]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /* ─────────────────────────────────────────────
     Toast
  ───────────────────────────────────────────── */

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 3000 }) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      setToast({
        type,
        title,
        message,
        duration,
      });

      if (duration > 0) {
        toastTimerRef.current = setTimeout(() => {
          setToast(null);
        }, duration);
      }
    },
    [],
  );

  const closeToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast(null);
  }, []);

  /* ─────────────────────────────────────────────
     Form
  ───────────────────────────────────────────── */

  const set = useCallback((key, value) => {
    setD((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const calculateTotals = useCallback((data) => {
    const total = ROWS.reduce((sum, row) => sum + ni(data[row.ak]), 0);

    const net = total - ni(data.lessAdvance);

    const suppVchr = ROWS.reduce(
      (sum, row) => (row.sk ? sum + ni(data[row.sk]) : sum),
      0,
    );

    return {
      total,
      net,
      suppVchr,
    };
  }, []);

  const { total, net, suppVchr } = calculateTotals(d);

  /* ─────────────────────────────────────────────
     Save Record
  ───────────────────────────────────────────── */

  const saveRecord = useCallback(
    (data = null, options = {}) => {
      const snapshot = data || dataRef.current;

      const { total, net, suppVchr } = calculateTotals(snapshot);

      const id = selectedId || Date.now();

      const record = {
        ...snapshot,
        id,
        total,
        net,
        suppVchr,
        savedAt: new Date().toLocaleString("en-IN"),
      };

      setSavedRecords((prev) => {
        const exists = prev.some((item) => item.id === id);

        if (exists) {
          return prev.map((item) => (item.id === id ? record : item));
        }

        return [record, ...prev];
      });

      setSelectedId(id);

      if (!options.silent) {
        showToast({
          type: "success",
          title: "Saved successfully",
          message: "Your expense record has been saved.",
          duration: 2200,
        });
      }

      return record;
    },
    [calculateTotals, selectedId, showToast],
  );

  /* ─────────────────────────────────────────────
     PRINT
  ───────────────────────────────────────────── */

  const handlePrint = useCallback(() => {
    /*
     * IMPORTANT:
     * window.open MUST happen immediately
     * inside the click handler.
     *
     * Don't put it inside:
     * setTimeout()
     * Promise.then()
     * async callback
     */

    const printWindow = window.open("", "_blank");

    /* Popup blocked */
    if (!printWindow) {
      showToast({
        type: "error",
        title: "Print window blocked",
        message:
          "Browser ne print window block kar di. Please site ke liye pop-ups allow karke dobara try karein.",
        duration: 5000,
      });

      return;
    }

    try {
      const latest = structuredClone(dataRef.current);

      const { total, net, suppVchr } = calculateTotals(latest);

      /*
       * Save current record silently.
       * Print ke time duplicate "Saved successfully"
       * toast nahi aayega.
       */
      saveRecord(latest, {
        silent: true,
      });

      const html = generatePrintHTML(latest, total, net, suppVchr);

      /*
       * Write print document.
       */
      printWindow.document.open();

      printWindow.document.write(html);

      printWindow.document.close();

      /*
       * Small helper to actually print.
       */
      const startPrint = () => {
        setTimeout(() => {
          try {
            printWindow.focus();

            printWindow.print();

            showToast({
              type: "success",
              title: "Print ready",
              message: "Print dialog is ready.",
              duration: 2200,
            });
          } catch (error) {
            console.error("Print failed:", error);

            showToast({
              type: "error",
              title: "Print failed",
              message: "Unable to open the print dialog.",
              duration: 4500,
            });
          }
        }, 250);
      };

      /*
       * Wait for print document load.
       */
      if (printWindow.document.readyState === "complete") {
        startPrint();
      } else {
        printWindow.onload = startPrint;
      }
    } catch (error) {
      console.error("Print preparation failed:", error);

      try {
        printWindow.close();
      } catch {
        // Ignore close error.
      }

      showToast({
        type: "error",
        title: "Print failed",
        message: "Print view prepare nahi ho saka.",
        duration: 4500,
      });
    }
  }, [calculateTotals, saveRecord, showToast]);

  /* ─────────────────────────────────────────────
     Load Saved Record
  ───────────────────────────────────────────── */

  const loadRecord = useCallback(
    (record) => {
      setD({
        ...record,
      });

      setSelectedId(record.id);

      setEditing(true);

      showToast({
        type: "info",
        title: "Record loaded",
        message: "You can now edit this saved record.",
        duration: 2500,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [showToast],
  );

  /* ─────────────────────────────────────────────
     Delete Request
  ───────────────────────────────────────────── */

  const requestDelete = useCallback(
    (id) => {
      const record = savedRecords.find((item) => item.id === id);

      if (!record) {
        return;
      }

      setDeleteTarget(record);
    },
    [savedRecords],
  );

  /* ─────────────────────────────────────────────
     Confirm Delete
  ───────────────────────────────────────────── */

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) {
      return;
    }

    const id = deleteTarget.id;

    setSavedRecords((prev) => prev.filter((item) => item.id !== id));

    if (selectedId === id) {
      setD(buildInitialState());

      setSelectedId(null);

      setEditing(false);
    }

    setDeleteTarget(null);

    showToast({
      type: "success",
      title: "Record deleted",
      message: "The saved record was removed successfully.",
      duration: 2500,
    });
  }, [deleteTarget, selectedId, showToast]);

  /* ─────────────────────────────────────────────
     New Record
  ───────────────────────────────────────────── */

  const handleNew = useCallback(() => {
    setD(buildInitialState());

    setSelectedId(null);

    setEditing(true);

    showToast({
      type: "info",
      title: "New record",
      message: "A fresh expense form is ready.",
      duration: 2200,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [showToast]);

  /* ─────────────────────────────────────────────
     Templates
  ───────────────────────────────────────────── */

  const saveTemplate = useCallback(
    (name, includeDateVoucher) => {
      const now = new Date().toISOString();
      const data = buildTemplateData(dataRef.current, includeDateVoucher);
      const existing = templates.find(
        (t) => t.name.toLowerCase() === name.toLowerCase(),
      );

      setTemplates((prev) =>
        existing
          ? prev.map((t) =>
              t.id === existing.id
                ? { ...t, name, data, includeDateVoucher, updatedAt: now }
                : t,
            )
          : [
              {
                id: createTemplateId(),
                name,
                data,
                includeDateVoucher,
                createdAt: now,
                updatedAt: now,
              },
              ...prev,
            ],
      );

      showToast({
        type: "success",
        title: existing ? "Template updated" : "Template saved",
        message: `"${name}" is ready to reuse.`,
        duration: 2200,
      });
    },
    [templates, showToast],
  );

  const overwriteTemplate = useCallback(
    (id) => {
      const target = templates.find((t) => t.id === id);
      if (!target) return;

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                data: buildTemplateData(
                  dataRef.current,
                  Boolean(t.includeDateVoucher),
                ),
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );

      showToast({
        type: "success",
        title: "Template updated",
        message: `"${target.name}" now matches the current form.`,
        duration: 2200,
      });
    },
    [templates, showToast],
  );

  const deleteTemplate = useCallback(
    (id) => {
      setTemplates((prev) => prev.filter((t) => t.id !== id));

      showToast({
        type: "success",
        title: "Template deleted",
        message: "The template was removed.",
        duration: 2000,
      });
    },
    [showToast],
  );

  const useTemplate = useCallback(
    (template) => {
      setD({
        ...buildInitialState(),
        ...template.data,
      });

      setSelectedId(null);

      setEditing(true);

      setTemplatesOpen(false);

      showToast({
        type: "info",
        title: "Template applied",
        message: `"${template.name}" loaded as a new record.`,
        duration: 2500,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [showToast],
  );

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */

  return (
    <main
      className="
        min-h-screen
        bg-ivory
        px-3 py-5
        font-sans
        text-ink
        sm:px-6 sm:py-8

        print:bg-white
        print:p-0
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1000px]
          flex-col
          items-center
        "
      >
        {/* ─────────────────────────────
            Toolbar
        ───────────────────────────── */}

        <SFDyesToolbar
          onBack={() => navigate("/")}
          editing={editing}
          onToggleEdit={() => setEditing((current) => !current)}
          saveFlash={
            toast?.type === "success" && toast?.title === "Saved successfully"
          }
          onSave={() => saveRecord()}
          onPrint={handlePrint}
          onNew={handleNew}
          onTemplates={() => setTemplatesOpen(true)}
        />

        {/* Page heading */}
        <div className="mb-4 flex w-full max-w-[920px] flex-col gap-1 print:hidden sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-500">
              Hotel expense
            </p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
              Expense claim
            </h1>
          </div>
          <p
            className="flex items-center gap-2 text-[13px] text-slate-muted"
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${selectedId ? "bg-forest-700" : "bg-gold-500"}`}
            />
            {selectedId ? "Saved record selected" : "New record"}
            <span className="text-slate-muted/50">·</span>
            {editing ? "Form is editable" : "Read-only preview"}
          </p>
        </div>

        {/* ─────────────────────────────
            Paper
        ───────────────────────────── */}

        <section
          className="
            relative
            w-full
            max-w-[920px]
            overflow-hidden
            border
            border-line
            bg-white
            shadow-[0_12px_32px_rgba(28,31,35,0.10)]

            print:max-w-full
            print:border-0
            print:shadow-none
          "
        >
          {editing && (
            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-0.5
                bg-forest-700
                print:hidden
              "
            />
          )}

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
        </section>

        {/* ─────────────────────────────
            Saved Records
        ───────────────────────────── */}

        <SavedRecordsPanel
          savedRecords={savedRecords}
          selectedId={selectedId}
          onLoad={loadRecord}
          onDelete={requestDelete}
          onNotify={showToast}
        />

        {/* ─────────────────────────────
            Edit Hint
        ───────────────────────────── */}

        {!editing && (
          <p className="mt-4 flex items-center gap-2 text-[13px] text-slate-muted print:hidden">
            <i
              aria-hidden="true"
              className="ri-information-line text-[16px] leading-none text-gold-500"
            />
            <span>
              Select <strong className="font-semibold text-ink">Edit</strong> to
              modify the form.
            </span>
          </p>
        )}
      </div>

      {/* ─────────────────────────────────
          Global Toast
      ───────────────────────────────── */}

      <ExpenseTemplatesModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        templates={templates}
        onSave={saveTemplate}
        onUse={useTemplate}
        onOverwrite={overwriteTemplate}
        onDelete={deleteTemplate}
      />

      <Toast toast={toast} onClose={closeToast} />

      {/* ─────────────────────────────────
          Delete Confirmation Modal
      ───────────────────────────────── */}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this record?"
        message={
          deleteTarget
            ? `"${deleteTarget.name || "Unnamed Record"}" will be permanently removed from your saved records. This action cannot be undone.`
            : ""
        }
        confirmText="Delete Record"
        cancelText="Keep Record"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
