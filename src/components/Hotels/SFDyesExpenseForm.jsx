import { useState, useRef, useEffect, useCallback } from "react";
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

import { Toast, ConfirmModal } from "../FeedbackUI";

export default function SFDyesExpenseForm() {
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
     State
  ───────────────────────────────────────────── */

  const [savedRecords, setSavedRecords] = useState(() => loadRecords());

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
     Render
  ───────────────────────────────────────────── */

  return (
    <main
      className="
        min-h-screen
        bg-slate-100
        px-2 py-5
        text-slate-900
        sm:px-4 sm:py-7

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
        />

        {/* ─────────────────────────────
            Status
        ───────────────────────────── */}

        <div
          className="
            mb-3
            flex
            w-full
            max-w-[920px]
            items-center
            justify-between
            print:hidden
          "
        >
          <div className="flex items-center gap-2">
            <span
              className={`
                h-2
                w-2
                rounded-full
                ${editing ? "animate-pulse bg-emerald-500" : "bg-slate-400"}
              `}
            />

            <span
              className="
                text-[10px]
                font-medium
                text-slate-500
              "
            >
              {editing ? "Form is editable" : "Read-only preview"}
            </span>
          </div>

          <span
            className="
              text-[10px]
              text-slate-400
            "
          >
            {selectedId ? "Saved record selected" : "New record"}
          </span>
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
            border-slate-300
            bg-white
            shadow-[0_15px_45px_rgba(15,23,42,0.12)]

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
                bg-gradient-to-r
                from-indigo-500
                via-violet-500
                to-indigo-500
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
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white/70
              px-3
              py-2
              text-[10px]
              text-slate-500
              shadow-sm
              print:hidden
            "
          >
            <svg
              className="
                h-3.5
                w-3.5
                text-indigo-500
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />

              <path d="M12 8v4" />

              <path d="M12 16h.01" />
            </svg>

            <span>
              Click{" "}
              <strong
                className="
                  font-semibold
                  text-slate-700
                "
              >
                Edit
              </strong>{" "}
              to modify the form.
            </span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────
          Global Toast
      ───────────────────────────────── */}

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
