import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Printer,
  Pencil,
  Save,
  FolderOpen,
  Trash2,
  X,
  Receipt,
  Check,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY = "agoda_saved_bills_v2";

const INITIAL_FORM_DATA = {
  address:
    "Agoda Company Pte, Ltd.\n36 Robinson Road\nCity House #20-01\nSingapore 068877",
  bookingNo: "1908719337",
  paymentDate: "June 14, 2025",
  name: "Karandeep Singh",
  billingAddress: "-",
  email: "karanbhinder991@gmail.com",
  hotelName: "HOTEL DELHI 55 @ NEW DELHI RAILWAY STATION",
  period: "June 15, 2025 - June 16, 2025 ((1 night(s)))",
  totalRoomCharges: "1,325.76",
};

/* =========================================================
   HELPERS
========================================================= */

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function normalizeFormData(data = {}) {
  return {
    ...INITIAL_FORM_DATA,
    ...(data && typeof data === "object" ? data : {}),
  };
}

function getAmount(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const cleaned = String(value).replace(/,/g, "").trim();
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function formatAmount(value) {
  return getAmount(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function loadSavedBillsFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((bill) => bill && typeof bill === "object")
      .map((bill) => ({
        id: safeText(bill.id, createId()),
        createdAt: safeText(bill.createdAt, new Date().toISOString()),
        updatedAt: safeText(
          bill.updatedAt,
          bill.createdAt || new Date().toISOString(),
        ),
        formData: normalizeFormData(bill.formData || bill.data || bill),
      }));
  } catch (error) {
    console.error("Failed to load saved Agoda bills:", error);
    return [];
  }
}

function saveBillsToStorage(bills) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));

    return true;
  } catch (error) {
    console.error("Failed to save Agoda bills:", error);
    return false;
  }
}

function formatSavedDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   EDITABLE FIELD
========================================================= */

function EditableField({ isEditing, value, onChange, className = "" }) {
  const safeValue = safeText(value);

  if (!isEditing) {
    return <span className={className}>{safeValue}</span>;
  }

  return (
    <input
      type="text"
      value={safeValue}
      onChange={(e) => onChange(e.target.value)}
      className={`
        min-w-0 flex-1
        border border-blue-300
        rounded
        px-2 py-1
        outline-none
        focus:ring-2 focus:ring-blue-200
        bg-blue-50
        ${className}
      `}
      autoComplete="off"
    />
  );
}

/* =========================================================
   AMOUNT FIELD
========================================================= */

function EditableAmount({ isEditing, value, onChange }) {
  const safeValue = safeText(value);

  if (!isEditing) {
    return <span>{safeValue}</span>;
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={safeValue}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-32
        text-right
        border border-blue-300
        rounded
        px-2 py-1
        outline-none
        focus:ring-2 focus:ring-blue-200
        bg-blue-50
      "
      autoComplete="off"
    />
  );
}

/* =========================================================
   SAVED BILLS MODAL
========================================================= */

function SavedBillsModal({ open, bills, onClose, onLoad, onDelete }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        no-print
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        py-6
        backdrop-blur-[3px]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-2xl
          border
          border-white/60
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.28)]
        "
        role="dialog"
        aria-modal="true"
        aria-label="Saved bills"
      >
        {/* MODAL HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            bg-gradient-to-r
            from-slate-900
            via-slate-800
            to-blue-900
            px-5
            py-4
            text-white
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white/10
                ring-1
                ring-white/15
              "
            >
              <FolderOpen className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold">Saved Bills</h2>

              <p className="mt-0.5 text-[10px] text-white/65">
                {bills.length} {bills.length === 1 ? "bill" : "bills"} saved
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-white/70
              transition
              hover:bg-white/10
              hover:text-white
            "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* MODAL CONTENT */}

        <div className="max-h-[60vh] overflow-y-auto bg-[#f8fafc] p-3">
          {bills.length === 0 ? (
            <div
              className="
                flex
                min-h-[190px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-6
                text-center
              "
            >
              <div
                className="
                  mb-3
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                "
              >
                <Receipt className="h-5 w-5" />
              </div>

              <div className="text-[13px] font-bold text-gray-800">
                No saved bills
              </div>

              <p className="mt-1 max-w-[300px] text-[11px] leading-5 text-gray-500">
                Edit your receipt and click “Save Changes” to create a saved
                bill.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bills.map((bill, index) => {
                /*
                 * IMPORTANT FIX:
                 * Old data may not contain formData.
                 * normalizeFormData prevents:
                 * bill.formData.hotelName
                 * from crashing.
                 */
                const data = normalizeFormData(bill?.formData);

                const total = getAmount(data.totalRoomCharges);

                return (
                  <div
                    key={bill.id || `saved-bill-${index}`}
                    className="
                      group
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-3
                      shadow-sm
                      transition
                      hover:border-blue-200
                      hover:shadow-md
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                        "
                      >
                        <Receipt className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[12px] font-bold text-gray-900">
                              {safeText(data.hotelName, "Untitled Hotel")}
                            </div>

                            <div className="mt-0.5 truncate text-[10px] text-gray-500">
                              Booking No. {safeText(data.bookingNo, "-")}
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-[11px] font-bold text-gray-900">
                              INR {formatAmount(total)}
                            </div>

                            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-emerald-600">
                              Grand Total
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                          <div className="min-w-0 rounded-lg bg-gray-50 px-2 py-1.5">
                            <div className="text-[9px] text-gray-400">
                              Guest
                            </div>

                            <div className="truncate font-semibold text-gray-700">
                              {safeText(data.name, "-")}
                            </div>
                          </div>

                          <div className="min-w-0 rounded-lg bg-gray-50 px-2 py-1.5">
                            <div className="text-[9px] text-gray-400">
                              Saved
                            </div>

                            <div className="truncate font-semibold text-gray-700">
                              {formatSavedDate(
                                bill.updatedAt || bill.createdAt,
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onDelete(bill.id)}
                            className="
                              flex
                              h-7
                              items-center
                              gap-1
                              rounded-lg
                              border
                              border-red-100
                              bg-red-50
                              px-2.5
                              text-[10px]
                              font-bold
                              text-red-600
                              transition
                              hover:bg-red-100
                            "
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={() => onLoad(bill)}
                            className="
                              flex
                              h-7
                              items-center
                              gap-1
                              rounded-lg
                              bg-slate-900
                              px-3
                              text-[10px]
                              font-bold
                              text-white
                              transition
                              hover:bg-blue-700
                            "
                          >
                            <FolderOpen className="h-3 w-3" />
                            Open Bill
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-gray-100
            bg-white
            px-4
            py-3
          "
        >
          <span className="text-[10px] text-gray-400">
            Bills are stored on this device.
          </span>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AgodaReceiptOriginal() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [savedBills, setSavedBills] = useState(() =>
    loadSavedBillsFromStorage(),
  );

  const [showSavedBills, setShowSavedBills] = useState(false);

  const [activeBillId, setActiveBillId] = useState(null);

  const [saveMessage, setSaveMessage] = useState("");

  /* =======================================================
     KEEP STORAGE SYNCED
  ======================================================= */

  useEffect(() => {
    saveBillsToStorage(savedBills);
  }, [savedBills]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal = useMemo(() => {
    return getAmount(formData.totalRoomCharges);
  }, [formData.totalRoomCharges]);

  /* =======================================================
     SAVE BILL
  ======================================================= */

  const handleSave = useCallback(() => {
    const now = new Date().toISOString();

    const snapshot = normalizeFormData(formData);

    setSavedBills((previousBills) => {
      /*
       * Existing bill:
       * update only that bill.
       */
      if (activeBillId) {
        const exists = previousBills.some((bill) => bill.id === activeBillId);

        if (exists) {
          return previousBills.map((bill) =>
            bill.id === activeBillId
              ? {
                  ...bill,
                  formData: snapshot,
                  updatedAt: now,
                }
              : bill,
          );
        }
      }

      /*
       * New bill:
       * append instead of replacing previous bill.
       */
      return [
        {
          id: createId(),
          createdAt: now,
          updatedAt: now,
          formData: snapshot,
        },
        ...previousBills,
      ];
    });

    /*
     * If this was a new bill, we need to know its id.
     * We don't rely on state immediately, because React
     * state updates are asynchronous.
     */
    if (!activeBillId) {
      const newId = createId();

      /*
       * Replace the temporary append above with a deterministic
       * new record so activeBillId can point to the exact bill.
       */
      setSavedBills((previousBills) => {
        /*
         * The first item is the bill just created by the
         * previous functional update. We preserve it and
         * assign a stable ID only if needed.
         *
         * To avoid duplicate insertion, detect whether the
         * latest matching snapshot already exists.
         */
        const matchingIndex = previousBills.findIndex(
          (bill) =>
            safeText(bill.formData?.bookingNo) ===
              safeText(snapshot.bookingNo) &&
            safeText(bill.formData?.hotelName) ===
              safeText(snapshot.hotelName) &&
            safeText(bill.updatedAt) === now,
        );

        if (matchingIndex === -1) {
          return [
            {
              id: newId,
              createdAt: now,
              updatedAt: now,
              formData: snapshot,
            },
            ...previousBills,
          ];
        }

        const copy = [...previousBills];

        copy[matchingIndex] = {
          ...copy[matchingIndex],
          id: copy[matchingIndex].id || newId,
        };

        return copy;
      });

      /*
       * Find the actual newest saved bill after state update
       * is not synchronous, so we don't make UI depend on
       * activeBillId for the success state.
       */
    }

    setIsEditing(false);

    setSaveMessage(
      activeBillId ? "Bill updated successfully" : "Bill saved successfully",
    );

    window.setTimeout(() => {
      setSaveMessage("");
    }, 2200);
  }, [activeBillId, formData]);

  /* =======================================================
     IMPROVED SAVE WITH EXACT ID
     ======================================================= */

  /*
   * The function above is intentionally kept compatible with
   * existing state, but this handler is the actual button
   * handler used below.
   */
  const handleSaveBill = useCallback(() => {
    const now = new Date().toISOString();
    const snapshot = normalizeFormData(formData);

    let generatedId = activeBillId;

    if (!generatedId) {
      generatedId = createId();
    }

    setSavedBills((previousBills) => {
      const existingIndex = previousBills.findIndex(
        (bill) => bill.id === generatedId,
      );

      if (existingIndex >= 0) {
        const next = [...previousBills];

        next[existingIndex] = {
          ...next[existingIndex],
          id: generatedId,
          formData: snapshot,
          updatedAt: now,
        };

        return next;
      }

      return [
        {
          id: generatedId,
          createdAt: now,
          updatedAt: now,
          formData: snapshot,
        },
        ...previousBills,
      ];
    });

    setActiveBillId(generatedId);
    setIsEditing(false);
    setSaveMessage(
      activeBillId ? "Bill updated successfully" : "Bill saved successfully",
    );

    window.setTimeout(() => {
      setSaveMessage("");
    }, 2200);
  }, [activeBillId, formData]);

  /* =======================================================
     TOGGLE EDIT
  ======================================================= */

  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  /* =======================================================
     OPEN SAVED BILL
  ======================================================= */

  const handleLoadBill = useCallback((bill) => {
    /*
     * Critical safety:
     * old/localStorage data can have different shape.
     */
    const safeData = normalizeFormData(bill?.formData || bill?.data || bill);

    setFormData(safeData);
    setActiveBillId(bill?.id || null);
    setIsEditing(false);
    setShowSavedBills(false);

    setSaveMessage("Bill loaded");

    window.setTimeout(() => {
      setSaveMessage("");
    }, 1800);
  }, []);

  /* =======================================================
     DELETE SAVED BILL
  ======================================================= */

  const handleDeleteBill = useCallback(
    (billId) => {
      if (!billId) {
        return;
      }

      const confirmed = window.confirm("Delete this saved bill?");

      if (!confirmed) {
        return;
      }

      setSavedBills((previousBills) =>
        previousBills.filter((bill) => bill.id !== billId),
      );

      if (activeBillId === billId) {
        setActiveBillId(null);
      }

      setSaveMessage("Bill deleted");

      window.setTimeout(() => {
        setSaveMessage("");
      }, 1800);
    },
    [activeBillId],
  );

  /* =======================================================
     NEW BILL / RESET
  ======================================================= */

  const handleReset = useCallback(() => {
    setFormData(normalizeFormData(INITIAL_FORM_DATA));
    setActiveBillId(null);
    setIsEditing(false);
  }, []);

  /* =======================================================
     PRINT
  ======================================================= */

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-4 flex flex-col items-center">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        @media print {
          html,
          body {
            width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          .receipt-page,
          .receipt-page * {
            visibility: visible !important;
          }

          .receipt-page {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;

            width: 100% !important;
            max-width: none !important;

            margin: 0 !important;
            padding: 7mm !important;

            background: #fff !important;
            box-shadow: none !important;

            box-sizing: border-box !important;

            color: #1f2937 !important;
            font-size: 11px !important;
            line-height: 1.25 !important;

            overflow: visible !important;
          }

          .no-print {
            display: none !important;
          }

          .receipt-page table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 4mm !important;
          }

          .receipt-page th,
          .receipt-page td {
            padding: 4px 6px !important;
            font-size: 11px !important;
            line-height: 1.2 !important;
          }

          .receipt-page table,
          .receipt-page tr,
          .receipt-page td,
          .receipt-page th {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .receipt-page img[alt="Agoda"] {
            width: 105px !important;
            max-width: 105px !important;
            height: auto !important;
          }

          .receipt-page img[alt="Authorized Stamp & Signature"] {
            width: 110px !important;
            max-width: 110px !important;
            height: auto !important;
          }

          .receipt-page h1 {
            font-size: 18px !important;
            margin-top: 4mm !important;
            margin-bottom: 4mm !important;
          }

          .receipt-page .mt-10 {
            margin-top: 5mm !important;
          }

          .receipt-page .mt-8 {
            margin-top: 5mm !important;
          }

          .receipt-page .mt-6 {
            margin-top: 4mm !important;
          }

          .receipt-page .mt-4 {
            margin-top: 3mm !important;
          }

          .receipt-page .mb-6 {
            margin-bottom: 4mm !important;
          }

          .receipt-page input,
          .receipt-page textarea {
            border: none !important;
            outline: none !important;
            background: transparent !important;
            box-shadow: none !important;

            padding: 0 !important;
            margin: 0 !important;

            color: #1f2937 !important;
            font-family: inherit !important;
            font-size: 11px !important;

            width: auto !important;
            max-width: 100% !important;
          }

          .receipt-page textarea {
            resize: none !important;
          }

          .receipt-page > p:last-child {
            margin-top: 9mm !important;
            font-size: 9px !important;
          }
        }
      `}</style>

      {/* =====================================================
          RECEIPT
      ====================================================== */}

      <div
        className="
          receipt-page
          w-full
          max-w-3xl
          bg-white
          shadow-md
          px-10
          py-10
          text-gray-800
          text-sm
          box-border
        "
      >
        {/* LOGO */}

        <div className="flex justify-end">
          <img
            src="/agoda-logo.png"
            alt="Agoda"
            className="w-42 h-auto object-contain"
          />
        </div>

        {/* ADDRESS */}

        <div className="leading-snug mt-4">
          <p>Address:</p>

          {isEditing ? (
            <textarea
              value={safeText(formData.address)}
              onChange={(e) => updateField("address", e.target.value)}
              rows={4}
              className="
                w-full
                max-w-sm
                border
                border-blue-300
                rounded
                px-2
                py-1
                outline-none
                focus:ring-2
                focus:ring-blue-200
                bg-blue-50
                resize-none
              "
            />
          ) : (
            <p className="whitespace-pre-line">{safeText(formData.address)}</p>
          )}
        </div>

        {/* BOOKING INFO */}

        <div className="mt-6 space-y-2">
          <div className="flex gap-2 items-center min-w-0">
            <span className="w-28 shrink-0">Booking No.</span>

            <EditableField
              isEditing={isEditing}
              value={formData.bookingNo}
              onChange={(value) => updateField("bookingNo", value)}
            />
          </div>

          <div className="flex gap-2 items-center min-w-0">
            <span className="w-28 shrink-0">Payment Date</span>

            <EditableField
              isEditing={isEditing}
              value={formData.paymentDate}
              onChange={(value) => updateField("paymentDate", value)}
            />
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-center text-xl font-medium mt-8 mb-6">Receipt</h1>

        {/* CUSTOMER TABLE */}

        <table className="w-full border border-gray-400 border-collapse mb-6">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="
                  border
                  border-gray-400
                  bg-gray-200
                  py-2
                  text-center
                  font-medium
                "
              >
                Customer Name &amp; Address
              </th>
            </tr>
          </thead>

          <tbody>
            {/* NAME */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  w-1/3
                  align-top
                "
              >
                Name
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                <EditableField
                  isEditing={isEditing}
                  value={formData.name}
                  onChange={(value) => updateField("name", value)}
                />
              </td>
            </tr>

            {/* BILLING ADDRESS */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                Billing Address
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                <EditableField
                  isEditing={isEditing}
                  value={formData.billingAddress}
                  onChange={(value) => updateField("billingAddress", value)}
                />
              </td>
            </tr>

            {/* EMAIL */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                Email Address
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                <EditableField
                  isEditing={isEditing}
                  value={formData.email}
                  onChange={(value) => updateField("email", value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* DESCRIPTION TABLE */}

        <table className="w-full border border-gray-400 border-collapse">
          <thead>
            <tr>
              <th
                className="
                  border
                  border-gray-400
                  bg-gray-200
                  px-4
                  py-2
                  text-center
                  font-medium
                "
              >
                Description
              </th>

              <th
                className="
                  border
                  border-gray-400
                  bg-gray-200
                  px-4
                  py-2
                  text-right
                  font-medium
                  w-40
                "
              >
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {/* HOTEL NAME */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                <div className="flex gap-2 items-center min-w-0">
                  <span className="w-32 shrink-0">Hotel Name</span>

                  <EditableField
                    isEditing={isEditing}
                    value={formData.hotelName}
                    onChange={(value) => updateField("hotelName", value)}
                  />
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2" />
            </tr>

            {/* PERIOD */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  align-top
                "
              >
                <div className="flex gap-2 items-center min-w-0">
                  <span className="w-32 shrink-0">Period</span>

                  <EditableField
                    isEditing={isEditing}
                    value={formData.period}
                    onChange={(value) => updateField("period", value)}
                  />
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2" />
            </tr>

            {/* ROOM TYPE */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                "
              >
                <div className="flex gap-2">
                  <span className="w-32 shrink-0">Room Type</span>

                  <span>Deluxe</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2" />
            </tr>

            {/* ROOMS */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                "
              >
                <div className="flex gap-2">
                  <span className="w-32 shrink-0"># of Rms.</span>

                  <span>1</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2" />
            </tr>

            {/* EXTRA BEDS */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                "
              >
                <div className="flex gap-2">
                  <span className="w-32 shrink-0"># of Extra Beds</span>

                  <span>0</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2" />
            </tr>

            {/* TOTAL ROOM CHARGES */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                "
              >
                Total Room Charges
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  text-right
                  whitespace-nowrap
                "
              >
                INR{" "}
                <EditableAmount
                  isEditing={isEditing}
                  value={formData.totalRoomCharges}
                  onChange={(value) => updateField("totalRoomCharges", value)}
                />
              </td>
            </tr>

            {/* EXTRA BED CHARGES */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                "
              >
                Total Extra Bed Charges
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  text-right
                "
              >
                INR 0.00
              </td>
            </tr>

            {/* GRAND TOTAL */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  border-t-2
                  border-t-gray-600
                  px-4
                  py-2
                  text-right
                  font-semibold
                "
              >
                GRAND TOTAL
              </td>

              <td
                className="
                  border
                  border-gray-400
                  border-t-2
                  border-t-gray-600
                  px-4
                  py-2
                  text-right
                  font-semibold
                "
              >
                INR {formatAmount(grandTotal)}
              </td>
            </tr>

            {/* TOTAL CHARGE */}

            <tr>
              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  text-right
                  font-semibold
                "
              >
                Total Charge
              </td>

              <td
                className="
                  border
                  border-gray-400
                  px-4
                  py-2
                  text-right
                  font-semibold
                "
              >
                INR {formatAmount(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* SIGNATURE */}

        <div className="flex justify-end mt-10">
          <div className="text-center">
            <img
              src="/signature.png"
              alt="Authorized Stamp & Signature"
              className="w-42 h-auto object-contain mx-auto"
            />
          </div>
        </div>

        {/* FOOTER */}

        <p className="text-xs text-gray-500 mt-24">
          This receipt is automatically generated.
        </p>
      </div>

      {/* =====================================================
          ACTION BAR
      ====================================================== */}

      <div className="no-print mt-5 flex flex-wrap items-center justify-center gap-3">
        {/* EDIT / SAVE */}

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSaveBill();
            } else {
              toggleEdit();
            }
          }}
          className={`
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded
            text-white
            text-sm
            transition-colors
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
            ${
              isEditing
                ? "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500"
                : "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500"
            }
          `}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit Receipt
            </>
          )}
        </button>

        {/* SAVED BILLS */}

        <button
          type="button"
          onClick={() => setShowSavedBills(true)}
          className="
            flex
            items-center
            gap-2
            rounded
            border
            border-slate-300
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:border-slate-400
            hover:bg-slate-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-400
            focus-visible:ring-offset-2
          "
        >
          <FolderOpen className="h-4 w-4" />
          Saved Bills
          {savedBills.length > 0 && (
            <span
              className="
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-slate-900
                px-1.5
                text-[10px]
                font-bold
                text-white
              "
            >
              {savedBills.length}
            </span>
          )}
        </button>

        {/* NEW BILL */}

        <button
          type="button"
          onClick={handleReset}
          className="
            flex
            items-center
            gap-2
            rounded
            border
            border-gray-300
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-gray-400
            focus-visible:ring-offset-2
          "
        >
          <Receipt className="h-4 w-4" />
          New Bill
        </button>

        {/* PRINT */}

        <button
          type="button"
          onClick={handlePrint}
          className="
            flex
            items-center
            gap-2
            px-4
            py-2
            rounded
            bg-gray-800
            text-white
            text-sm
            hover:bg-gray-700
            transition-colors
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-offset-2
            focus-visible:ring-gray-500
          "
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
      </div>

      {/* =====================================================
          SAVE STATUS
      ====================================================== */}

      {saveMessage && (
        <div
          className="
            no-print
            fixed
            bottom-5
            left-1/2
            z-[10000]
            flex
            -translate-x-1/2
            items-center
            gap-2
            rounded-full
            border
            border-emerald-200
            bg-white
            px-4
            py-2
            text-[11px]
            font-semibold
            text-emerald-700
            shadow-[0_8px_30px_rgba(0,0,0,0.14)]
          "
        >
          <span
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-emerald-100
            "
          >
            <Check className="h-3 w-3" />
          </span>

          {saveMessage}
        </div>
      )}

      {/* =====================================================
          SAVED BILLS MODAL
      ====================================================== */}

      <SavedBillsModal
        open={showSavedBills}
        bills={savedBills}
        onClose={() => setShowSavedBills(false)}
        onLoad={handleLoadBill}
        onDelete={handleDeleteBill}
      />
    </div>
  );
}
