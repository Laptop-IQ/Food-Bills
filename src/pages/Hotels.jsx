import React, { useMemo, useState } from "react";

const STORAGE_KEY = "savedHotelBills";

const INITIAL_INVOICE = {
  companyName: "MAKEMYTRIP (INDIA) PRIVATE LIMITED",

  registeredOffice:
    "19th Floor, Epitome Building No.5, DLF Cybercity, DLF Phase III, Gurgaon, Haryana, 122001",

  addressLines: [
    "19th Floor, Epitome Building No.5,",
    "DLF Cybercity, DLF Phase III,",
    "Gurgaon, Haryana, 122001",
  ],

  bookingId: "NF2AGZRS94485560284",
  invoiceNo: "M06AI26111704220",
  date: "2026-08-28",

  placeOfSupply: "Haryana",
  transactionType: "B2C/REG",
  transactionDetails: "RG",

  pan: "AADCM5146R",
  hsnSac: "998552",
  gstin: "06AADCM5146R1ZZ",
  cin: "U63040HR2000PTC090846",

  serviceDescription: ["Reservation Services For", "Accommodation"],

  taxPayableRCM: "No",

  customerName: "Rahul Sharma",

  hotelName: "Best Western Morrion Hotel",
  hotelCity: "AMRITSAR",
  checkIn: "2026-09-26",
  checkOut: "2026-09-28",
  roomType: "Deluxe Room",

  guestName: "Rahul Sharma",
  confirmationNo: "T9XMPL",

  roomCharges: "4500.00",
  serviceFees: "0.00",
  effectiveDiscount: "0.00",

  fareDescription:
    "(Inclusive of applicable taxes collected on behalf of hotel)",

  taxNotice:
    "Input tax credit of GST charged by the original service provider is available only against the invoice issued by the respective service provider. FlyZone Travels acts only as a facilitator for these services.",

  invalidDocument: "This is not a valid hotel booking document",

  qrVerificationUrl: "https://einvoice1.gst.gov.in/Others/QRCodeVerifyApp",
};

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toFixed(2);
}

function formatInvoiceDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateGrandTotal(invoice) {
  const room = parseFloat(invoice.roomCharges) || 0;

  const service = parseFloat(invoice.serviceFees) || 0;

  const discount = parseFloat(invoice.effectiveDiscount) || 0;

  const cgst = room * 0.025;
  const sgst = room * 0.025;

  return room + service + cgst + sgst - discount;
}

function cloneInitialInvoice() {
  return {
    ...INITIAL_INVOICE,
    addressLines: [...INITIAL_INVOICE.addressLines],
    serviceDescription: [...INITIAL_INVOICE.serviceDescription],
  };
}

function createBillId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/* =========================================================
   LOCAL STORAGE
========================================================= */

function safeReadSavedBills() {
  try {
    if (typeof window === "undefined") {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        ...item,

        /*
         * Old saved bills may not have an ID.
         */
        id:
          item.id ||
          `legacy-${index}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,

        /*
         * Old saved bills may not have Grand Total.
         * Calculate it automatically.
         */
        grandTotal: Number.isFinite(Number(item.grandTotal))
          ? Number(item.grandTotal)
          : calculateGrandTotal(item),
      }));
  } catch (error) {
    console.error("Unable to read saved bills:", error);

    return [];
  }
}

function safeWriteSavedBills(bills) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));

    return true;
  } catch (error) {
    console.error("Unable to save bills:", error);

    return false;
  }
}

/* =========================================================
   EDIT FIELD
========================================================= */

function EditField({ label, value, onChange, type = "text", error }) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[11px] font-bold text-gray-600">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "h-9 w-full rounded-md border",
          "bg-white px-2.5 text-[13px] text-gray-900",
          "outline-none transition",
          "focus:border-black focus:ring-2 focus:ring-black/5",
          error ? "border-red-500" : "border-gray-300",
        ].join(" ")}
      />

      {error && <p className="mt-1 text-[10px] text-red-600">{error}</p>}
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ label, value, children }) {
  return (
    <div className="min-w-0">
      <div className="mb-[3px] text-[10px] leading-[1.1] text-[#666]">
        {label}
      </div>

      <div className="break-words text-[11px] font-bold leading-[1.18] text-black">
        {children !== undefined ? children : value}
      </div>
    </div>
  );
}

/* =========================================================
   SAVED BILLS MODAL
========================================================= */

function SavedBillsModal({ bills, onClose, onLoad, onDelete, onClearAll }) {
  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="
          flex
          max-h-[85vh]
          w-full
          max-w-[700px]
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="m-0 text-[18px] font-bold text-black">
              Saved Bills
            </h3>

            <p className="mt-1 text-[11px] text-gray-500">
              {bills.length} saved bill
              {bills.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved bills"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-lg
              text-gray-700
              transition
              hover:bg-gray-200
            "
          >
            ×
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-1 overflow-y-auto p-4">
          {bills.length === 0 ? (
            <div className="py-14 text-center">
              <div className="text-[14px] font-bold text-gray-700">
                No saved bills
              </div>

              <div className="mt-1 text-[11px] text-gray-500">
                Save an invoice to see it here.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-lg
                    border
                    border-gray-200
                    p-3
                    transition
                    hover:bg-gray-50
                  "
                >
                  <div className="min-w-0">
                    {/* INVOICE NUMBER */}

                    <div className="truncate text-[13px] font-bold text-black">
                      {bill.invoiceNo || "No invoice number"}
                    </div>

                    {/* CUSTOMER */}

                    <div className="mt-1 truncate text-[11px] text-gray-600">
                      {bill.customerName || "No customer name"}
                    </div>

                    {/* HOTEL */}

                    <div className="truncate text-[11px] text-gray-500">
                      {bill.hotelName || "No hotel name"}
                    </div>

                    {/* GRAND TOTAL */}

                    <div className="mt-1 text-[12px] font-bold text-black">
                      Grand Total: ₹{formatCurrency(bill.grandTotal)}
                    </div>

                    {/* SAVED TIME */}

                    {bill.savedAt && (
                      <div className="mt-1 text-[10px] text-gray-400">
                        Saved: {new Date(bill.savedAt).toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => onLoad(bill)}
                      className="
                        rounded-md
                        bg-black
                        px-3
                        py-2
                        text-[11px]
                        font-bold
                        text-white
                        transition
                        hover:bg-gray-800
                      "
                    >
                      Load
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(bill.id)}
                      className="
                        rounded-md
                        border
                        border-red-300
                        px-3
                        py-2
                        text-[11px]
                        font-bold
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
          <button
            type="button"
            onClick={onClearAll}
            disabled={bills.length === 0}
            className="
              rounded-md
              border
              border-red-300
              px-3
              py-2
              text-[11px]
              font-bold
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Clear All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              border
              border-gray-300
              bg-white
              px-4
              py-2
              text-[11px]
              font-bold
              text-gray-800
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

export default function HotelsInvoice() {
  const [invoice, setInvoice] = useState(cloneInitialInvoice);

  const [errors, setErrors] = useState({});

  const [savedBills, setSavedBills] = useState(safeReadSavedBills);

  const [showSavedBills, setShowSavedBills] = useState(false);

  const [message, setMessage] = useState("");

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const { grandTotal, cgstAmount, sgstAmount } = useMemo(() => {
    const room = parseFloat(invoice.roomCharges) || 0;

    const service = parseFloat(invoice.serviceFees) || 0;

    const discount = parseFloat(invoice.effectiveDiscount) || 0;

    const cgst = room * 0.025;
    const sgst = room * 0.025;

    return {
      cgstAmount: cgst,
      sgstAmount: sgst,

      grandTotal: room + service + cgst + sgst - discount,
    };
  }, [invoice.roomCharges, invoice.serviceFees, invoice.effectiveDiscount]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  function updateField(field, value) {
    setInvoice((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next[field];

      return next;
    });

    setMessage("");
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateInvoice() {
    const newErrors = {};

    if (!invoice.customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
    }

    if (!invoice.guestName.trim()) {
      newErrors.guestName = "Guest name is required.";
    }

    if (!invoice.confirmationNo.trim()) {
      newErrors.confirmationNo = "Confirmation number is required.";
    }

    if (!invoice.invoiceNo.trim()) {
      newErrors.invoiceNo = "Invoice number is required.";
    }

    if (!invoice.date) {
      newErrors.date = "Invoice date is required.";
    }

    const room = parseFloat(invoice.roomCharges);

    if (invoice.roomCharges === "" || Number.isNaN(room) || room < 0) {
      newErrors.roomCharges = "Enter a valid room amount.";
    }

    const service = parseFloat(invoice.serviceFees);

    if (invoice.serviceFees === "" || Number.isNaN(service) || service < 0) {
      newErrors.serviceFees = "Enter a valid service fee.";
    }

    const discount = parseFloat(invoice.effectiveDiscount);

    if (
      invoice.effectiveDiscount === "" ||
      Number.isNaN(discount) ||
      discount < 0
    ) {
      newErrors.effectiveDiscount = "Enter a valid discount.";
    }

    if (!Number.isNaN(discount) && discount > room + service) {
      newErrors.effectiveDiscount = "Discount cannot exceed subtotal.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* =======================================================
     SAVE BILL
  ======================================================= */

  function handleSaveBill() {
    if (!validateInvoice()) {
      setMessage("Please fix the highlighted fields.");

      return;
    }

    /*
     * Every click creates a NEW saved bill.
     *
     * Even if Invoice No. is same,
     * it will still be stored separately.
     */

    const billToSave = {
      ...invoice,

      id: createBillId(),

      grandTotal: Number(grandTotal.toFixed(2)),

      savedAt: new Date().toISOString(),

      addressLines: [...invoice.addressLines],

      serviceDescription: [...invoice.serviceDescription],
    };

    const updatedBills = [billToSave, ...savedBills];

    const success = safeWriteSavedBills(updatedBills);

    if (!success) {
      setMessage("Unable to save bill. Browser storage may be full.");

      return;
    }

    setSavedBills(updatedBills);

    setMessage("Bill saved successfully.");
  }

  /* =======================================================
     LOAD BILL
  ======================================================= */

  function handleLoadBill(bill) {
    const loadedInvoice = {
      ...cloneInitialInvoice(),

      ...bill,

      addressLines: Array.isArray(bill.addressLines)
        ? [...bill.addressLines]
        : [...INITIAL_INVOICE.addressLines],

      serviceDescription: Array.isArray(bill.serviceDescription)
        ? [...bill.serviceDescription]
        : [...INITIAL_INVOICE.serviceDescription],
    };

    /*
     * grandTotal and savedAt are storage
     * metadata and don't need to become
     * invoice fields.
     */

    delete loadedInvoice.id;
    delete loadedInvoice.savedAt;
    delete loadedInvoice.grandTotal;

    setInvoice(loadedInvoice);

    setErrors({});

    setMessage("Bill loaded successfully.");

    setShowSavedBills(false);
  }

  /* =======================================================
     DELETE BILL
  ======================================================= */

  function handleDeleteBill(id) {
    const confirmed = window.confirm("Delete this saved bill?");

    if (!confirmed) {
      return;
    }

    const updatedBills = savedBills.filter((bill) => bill.id !== id);

    const success = safeWriteSavedBills(updatedBills);

    if (!success) {
      setMessage("Unable to update saved bills.");

      return;
    }

    setSavedBills(updatedBills);

    setMessage("Bill deleted.");
  }

  /* =======================================================
     CLEAR ALL
  ======================================================= */

  function handleClearAll() {
    if (savedBills.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Delete ALL saved bills? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    const success = safeWriteSavedBills([]);

    if (!success) {
      setMessage("Unable to clear saved bills.");

      return;
    }

    setSavedBills([]);

    setMessage("All saved bills deleted.");
  }

  /* =======================================================
     RESET
  ======================================================= */

  function handleReset() {
    const confirmed = window.confirm(
      "Reset the current invoice to default values?",
    );

    if (!confirmed) {
      return;
    }

    setInvoice(cloneInitialInvoice());

    setErrors({});

    setMessage("Invoice reset.");
  }

  /* =======================================================
     PRINT
  ======================================================= */

  function handlePrint() {
    if (!validateInvoice()) {
      setMessage("Please fix the highlighted fields before printing.");

      return;
    }

    const originalTitle = document.title;

    document.title = `Hotel Invoice - ${invoice.invoiceNo}`;

    let restored = false;

    const restoreTitle = () => {
      if (restored) {
        return;
      }

      restored = true;

      document.title = originalTitle;

      window.removeEventListener("afterprint", restoreTitle);
    };

    window.addEventListener("afterprint", restoreTitle);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });

    window.setTimeout(() => {
      restoreTitle();
    }, 5000);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          background: #e9e9e9;
        }

        button,
        input {
          font-family: inherit;
        }

        /*
         * SCREEN INVOICE
         */

        .invoice-page {
          position: relative;

          width: 210mm;
          height: 297mm;

          min-width: 210mm;
          min-height: 297mm;

          max-width: 210mm;
          max-height: 297mm;

          margin-left: auto;
          margin-right: auto;

          background: #fff;

          overflow: hidden;
        }

        /*
         * PRINT
         */

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {

          html,
          body {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 0 !important;
            padding: 0 !important;

            background: #fff !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden !important;
          }

          .invoice-page,
          .invoice-page * {
            visibility: visible !important;
          }

          .invoice-page {
            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 210mm !important;
            height: 297mm !important;

            min-width: 210mm !important;
            min-height: 297mm !important;

            max-width: 210mm !important;
            max-height: 297mm !important;

            margin: 0 !important;

            padding: 10mm 11mm 18mm 11mm !important;

            background: #fff !important;

            overflow: hidden !important;

            border: 0 !important;
            border-radius: 0 !important;

            box-shadow: none !important;

            page-break-before: always !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;

            break-before: page !important;
            break-after: avoid-page !important;
            break-inside: avoid-page !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-page > section,
          .invoice-page > div,
          .invoice-page > footer {
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }

          .invoice-page img {
            display: block !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .invoice-page a {
            color: #000 !important;
            text-decoration: underline !important;
          }

          .invoice-page a::after {
            content: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#e9e9e9] p-6 print:bg-white print:p-0">
        {/* =================================================
            EDITOR
        ================================================== */}

        <section className="no-print mx-auto mb-4 w-full max-w-[210mm] rounded-lg border border-gray-200 bg-white p-[18px] shadow-sm">
          <div className="flex items-start justify-between gap-4 max-sm:flex-col">
            <div>
              <h2 className="m-0 text-[19px] font-bold text-black">
                Edit Hotel Invoice
              </h2>

              <p className="mb-0 mt-[5px] text-[12px] text-gray-500">
                Update the fields below. Changes will immediately appear in the
                hotel invoice preview.
              </p>
            </div>

            <div className="rounded-md bg-gray-100 px-3 py-2 text-right">
              <div className="text-[10px] text-gray-500">Saved Bills</div>

              <div className="text-[16px] font-bold text-black">
                {savedBills.length}
              </div>
            </div>
          </div>

          {/* FORM */}

          <div className="mt-[18px] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EditField
              label="Customer Name"
              value={invoice.customerName}
              error={errors.customerName}
              onChange={(value) => {
                setInvoice((current) => ({
                  ...current,
                  customerName: value,
                  guestName: value,
                }));

                setErrors((current) => {
                  const next = {
                    ...current,
                  };

                  delete next.customerName;
                  delete next.guestName;

                  return next;
                });

                setMessage("");
              }}
            />

            <EditField
              label="Guest Name"
              value={invoice.guestName}
              error={errors.guestName}
              onChange={(value) => updateField("guestName", value)}
            />

            <EditField
              label="Confirmation No."
              value={invoice.confirmationNo}
              error={errors.confirmationNo}
              onChange={(value) =>
                updateField("confirmationNo", value.toUpperCase())
              }
            />

            <EditField
              label="Room Charges"
              type="number"
              value={invoice.roomCharges}
              error={errors.roomCharges}
              onChange={(value) => updateField("roomCharges", value)}
            />

            <EditField
              label="Service Fees"
              type="number"
              value={invoice.serviceFees}
              error={errors.serviceFees}
              onChange={(value) => updateField("serviceFees", value)}
            />

            <EditField
              label="Effective Discount"
              type="number"
              value={invoice.effectiveDiscount}
              error={errors.effectiveDiscount}
              onChange={(value) => updateField("effectiveDiscount", value)}
            />

            <EditField
              label="Date"
              type="date"
              value={invoice.date}
              error={errors.date}
              onChange={(value) => updateField("date", value)}
            />

            <EditField
              label="Invoice No."
              value={invoice.invoiceNo}
              error={errors.invoiceNo}
              onChange={(value) =>
                updateField("invoiceNo", value.toUpperCase())
              }
            />

            <EditField
              label="Booking ID"
              value={invoice.bookingId}
              onChange={(value) =>
                updateField("bookingId", value.toUpperCase())
              }
            />

            <EditField
              label="Hotel Name"
              value={invoice.hotelName}
              onChange={(value) => updateField("hotelName", value)}
            />

            <EditField
              label="Hotel City"
              value={invoice.hotelCity}
              onChange={(value) =>
                updateField("hotelCity", value.toUpperCase())
              }
            />

            <EditField
              label="Check In"
              type="date"
              value={invoice.checkIn}
              onChange={(value) => updateField("checkIn", value)}
            />

            <EditField
              label="Check Out"
              type="date"
              value={invoice.checkOut}
              onChange={(value) => updateField("checkOut", value)}
            />

            <EditField
              label="Room Type"
              value={invoice.roomType}
              onChange={(value) => updateField("roomType", value)}
            />

            <EditField
              label="Hotel City"
              value={invoice.hotelCity}
              onChange={(value) =>
                updateField("hotelCity", value.toUpperCase())
              }
            />
          </div>

          {/* ACTION BAR */}

          <div className="mt-[18px] flex items-center justify-between gap-4 border-t border-gray-100 pt-[15px] max-sm:flex-col max-sm:items-stretch">
            <div>
              <div className="text-[13px] text-gray-600">
                Grand Total:{" "}
                <strong className="text-black">
                  ₹{formatCurrency(grandTotal)}
                </strong>
              </div>

              {message && (
                <div
                  className={[
                    "mt-1 text-[11px] font-medium",
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600",
                  ].join(" ")}
                >
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 max-sm:w-full">
              <button
                type="button"
                onClick={handleSaveBill}
                className="
                  h-[38px]
                  rounded-md
                  border
                  border-green-600
                  bg-green-600
                  px-[17px]
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  hover:bg-green-700
                  max-sm:flex-1
                "
              >
                Save Bill
              </button>

              <button
                type="button"
                onClick={() => setShowSavedBills(true)}
                className="
                  h-[38px]
                  rounded-md
                  border
                  border-blue-600
                  bg-white
                  px-[17px]
                  text-[12px]
                  font-bold
                  text-blue-700
                  transition
                  hover:bg-blue-50
                  max-sm:flex-1
                "
              >
                Saved Bills ({savedBills.length})
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="
                  h-[38px]
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-[17px]
                  text-[12px]
                  font-bold
                  text-gray-800
                  transition
                  hover:bg-gray-50
                  max-sm:flex-1
                "
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="
                  h-[38px]
                  rounded-md
                  border
                  border-black
                  bg-black
                  px-[17px]
                  text-[12px]
                  font-bold
                  text-white
                  transition
                  hover:bg-gray-800
                  max-sm:flex-1
                "
              >
                Print Hotel Invoice
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            SAVED BILLS MODAL
        ================================================== */}

        {showSavedBills && (
          <SavedBillsModal
            bills={savedBills}
            onClose={() => setShowSavedBills(false)}
            onLoad={handleLoadBill}
            onDelete={handleDeleteBill}
            onClearAll={handleClearAll}
          />
        )}

        {/* =================================================
            A4 INVOICE
            PRINT VIEW UNCHANGED
        ================================================== */}

        <main
          className="
            invoice-page
            relative
            mx-auto
            h-[297mm]
            min-h-[297mm]
            w-[210mm]
            overflow-hidden
            bg-white
            px-[11mm]
            pb-[18mm]
            pt-[10mm]
            shadow-[0_2px_12px_rgba(0,0,0,0.12)]
          "
        >
          {/* HEADER */}

          <section className="grid grid-cols-[1fr_1fr_1.15fr] items-start gap-x-[86px]">
            <div>
              <h1 className="m-0 mt-3 text-[25px] font-bold leading-none tracking-[-0.6px] text-black">
                TAX INVOICE
              </h1>
            </div>

            <div className="flex h-[55px] items-center justify-center">
              <img
                src="/makemytrip-logo.png"
                alt="MakeMyTrip"
                className="block h-[65px] w-auto object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] leading-[1.15] text-[#444]">
                {invoice.companyName}
              </div>

              <div className="text-[11.5px] font-bold leading-[1.2] text-black">
                {invoice.addressLines.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}

                    {index < invoice.addressLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* INFORMATION */}

          <section className="mt-[18px] grid grid-cols-[1fr_1fr_1fr] gap-x-[98px]">
            <div className="flex flex-col gap-[14px]">
              <InfoItem label="Booking ID" value={invoice.bookingId} />

              <InfoItem label="Invoice No." value={invoice.invoiceNo} />

              <InfoItem label="Date" value={formatInvoiceDate(invoice.date)} />

              <InfoItem label="Place of Supply" value={invoice.placeOfSupply} />

              <InfoItem
                label="Transactional Type/Category"
                value={invoice.transactionType}
              />

              <InfoItem
                label="Transactional Details"
                value={invoice.transactionDetails}
              />
            </div>

            <div className="flex flex-col gap-[14px]">
              <InfoItem label="PAN" value={invoice.pan} />

              <InfoItem label="HSN/SAC" value={invoice.hsnSac} />

              <InfoItem label="GSTIN" value={invoice.gstin} />

              <InfoItem label="CIN" value={invoice.cin} />

              <InfoItem label="Service Description">
                <div>
                  {invoice.serviceDescription.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}

                      {index < invoice.serviceDescription.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </InfoItem>

              <InfoItem
                label="Tax Payable under RCM"
                value={invoice.taxPayableRCM}
              />
            </div>

            <div className="flex items-start justify-center pt-[31px]">
              <div className="flex h-[180px] w-[180px] items-center justify-center">
                <img
                  src="/qrcode.png"
                  alt="Invoice QR Code"
                  className="block h-[180px] w-[180px] object-contain"
                />
              </div>
            </div>
          </section>

          {/* CUSTOMER */}

          <section className="mt-[18px] grid grid-cols-2 border-y-2 border-dotted border-[#100101] py-[9px]">
            <div className="pr-5">
              <div className="mb-[3px] text-[10px] text-[#777]">
                Customer Name
              </div>

              <div className="mb-2 break-words text-[11px] font-bold leading-[1.2] text-black">
                {invoice.customerName}
              </div>
            </div>

            <div className="pl-5">
              <div className="mb-[3px] text-[10px] text-[#777]">Guest Name</div>

              <div className="mb-2 break-words text-[11px] font-bold leading-[1.2] text-black">
                {invoice.guestName}
              </div>
            </div>
          </section>

          {/* HOTEL DETAILS */}

          <section className="mt-[12px] overflow-hidden">
            <div className="grid grid-cols-4">
              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">
                  Hotel Name
                </div>

                <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  {invoice.hotelName}
                </div>
              </div>

              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">
                  Hotel City
                </div>

                <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  {invoice.hotelCity}
                </div>
              </div>

              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">Check In</div>

                <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  {formatInvoiceDate(invoice.checkIn)}
                </div>
              </div>

              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">
                  Check Out
                </div>

                <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  {formatInvoiceDate(invoice.checkOut)}
                </div>
              </div>
            </div>
          </section>

          {/* PAYMENT HEADING */}

          <div className="my-[14px] flex w-full items-center gap-[14px]">
            <div className="flex-1 border-t-2 border-dotted border-[#444]" />

            <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
              PAYMENT BREAKUP
            </span>

            <div className="flex-1 border-t-2 border-dotted border-[#444]" />
          </div>

          {/* PAYMENT */}

          <section className="overflow-hidden rounded-[9px] border-2 border-[#222]">
            <div className="min-h-[43px] px-[10px] py-[5px]">
              <div className="flex items-center justify-between gap-4">
                <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  *Accommodation Charges
                </span>

                <span className="break-words text-[12px] font-bold leading-[1.2] text-black">
                  ₹{formatCurrency(invoice.roomCharges)}
                </span>
              </div>

              <div className="mt-[2px] pr-3 text-[8.5px] leading-[1.1] text-[#333]">
                {invoice.fareDescription}
              </div>
            </div>

            <div className="flex min-h-[25px] items-center justify-between gap-4 px-[10px] py-[4px]">
              <span className="text-[11px] font-bold text-black">
                Service Fees
              </span>

              <span className="text-[11px] font-bold text-black">
                ₹{formatCurrency(invoice.serviceFees)}
              </span>
            </div>

            {Number(invoice.effectiveDiscount) > 0 && (
              <div className="flex min-h-[25px] items-center justify-between gap-4 px-[10px] py-[4px]">
                <span className="text-[11px] font-bold text-black">
                  Effective Discount
                </span>

                <span className="text-[11px] font-bold text-black">
                  -₹
                  {formatCurrency(invoice.effectiveDiscount)}
                </span>
              </div>
            )}

            <div className="flex min-h-[25px] items-center justify-between gap-4 px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                CGST @2.5%
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(cgstAmount)}
              </span>
            </div>

            <div className="flex min-h-[25px] items-center justify-between gap-4 border-b-2 border-[#222] px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                SGST @2.5%
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(sgstAmount)}
              </span>
            </div>

            <div className="mb-3 flex min-h-[28px] items-center justify-between gap-4 border-b-2 border-[#222] px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                Grand Total
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(grandTotal)}
              </span>
            </div>
          </section>

          {/* NOTICE */}

          <div className="mt-3 break-words text-[11px] font-bold leading-[1.2] text-black">
            {invoice.taxNotice}
          </div>

          <div className="mt-1.5 break-words text-[11px] font-bold leading-[1.2] text-black">
            {invoice.invalidDocument}
          </div>

          {/* TERMS */}

          <section className="mt-[13px]">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t-2 border-dotted border-[#444]" />

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                TERMS &amp; CONDITIONS
              </span>

              <div className="flex-1 border-t-2 border-dotted border-[#444]" />
            </div>

            <ol className="mt-[10px] list-decimal pl-2">
              <li className="pl-[3px] text-[10px] leading-[1.45] text-[#222]">
                Any dispute with respect to the invoice is to be reported back
                to FlyZone Travels within 48 hours of receipt of invoice.
              </li>

              <li className="pl-[3px] text-[10px] leading-[1.45] text-[#222]">
                QR code for B2B and SEZ category invoices can only be scanned
                using app downloaded from the link.
                <br />
                <a
                  href={invoice.qrVerificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-black underline"
                >
                  {invoice.qrVerificationUrl}
                </a>
              </li>

              <li className="pl-[3px] text-[10px] leading-[1.45] text-[#222]">
                This is system generated invoice and does not require
                signatures.
              </li>
            </ol>
          </section>

          {/* FOOTER */}

          <footer className="absolute bottom-[7mm] left-[11mm] right-[11mm] flex items-end justify-between gap-5">
            <div className="max-w-[80%]">
              <div className="mb-[2px] text-[9px] text-[#666]">
                Registered Office
              </div>

              <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                {invoice.registeredOffice}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end text-right text-[9px] leading-[1.25] text-[#666]">
              <div>{invoice.invoiceNo}</div>

              <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                Page 1 of 1
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
