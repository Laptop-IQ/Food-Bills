import React, { useEffect, useMemo, useState } from "react";

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
  date: "2026-09-26",

  placeOfSupply: "Haryana",
  transactionType: "B2C/REG",
  transactionDetails: "RG",

  pan: "AADCM5146R",
  hsnSac: "998551",
  gstin: "06AADCM5146R1ZZ",
  cin: "U63040HR2000PTC090846",

  serviceDescription: ["Reservation Services For Air", "Transportation"],

  taxPayableRCM: "No",

  customerName: "Rahul Sharma",
  bookedBy: "Priya Sharma",

  flightRoute: "DEL-BLR",
  flightNumber: "IX 1163",

  passengerName: "Rahul Sharma",
  ticketNo: "T9XMPL",
  pnr: "T9XMPL",

  fareCharges: "4500.00",
  serviceFees: "0.00",
  cgst: "0.00",
  sgst: "0.00",

  fareDescription:
    "(including applicable flight taxes collected on behalf of airline & other ancillary charges)",

  taxNotice:
    "Input tax credit of GST charged by the original service provider is available only against the invoice issued by the respective service provider. FlyZone Travels acts only as a facilitator for these services.",

  invalidDocument: "This is not a valid travel document",

  qrVerificationUrl: "https://einvoice1.gst.gov.in/Others/QRCodeVerifyApp",
};

const STORAGE_KEY = "tax-invoice-saved-bills-v1";

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
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createSavedBill(invoice, grandTotal) {
  return {
    id: `${invoice.invoiceNo}-${Date.now()}`,
    invoice: JSON.parse(JSON.stringify(invoice)),
    grandTotal: Number(grandTotal) || 0,
    savedAt: new Date().toISOString(),
  };
}

function getSavedBillsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error("Unable to read saved bills:", error);
    return [];
  }
}

function saveBillsToStorage(bills) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

function SavedBillsModal({ bills, onClose, onLoad, onDelete }) {
  return (
    <div
      className="no-print fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="m-0 text-[18px] font-bold text-black">
              Saved Bills
            </h3>

            <p className="mt-1 text-[11px] text-gray-500">
              Your saved invoices are stored on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-[18px] leading-none text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}

        <div className="max-h-[65vh] overflow-y-auto p-4">
          {bills.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
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
                  className="rounded-lg border border-gray-200 bg-white p-3 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-[13px] font-bold text-black">
                          {bill.invoice.invoiceNo || "No Invoice No."}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2 py-[3px] text-[9px] font-bold text-gray-600">
                          {formatInvoiceDate(bill.invoice.date)}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
                        <div>
                          <div className="text-[9px] text-gray-500">
                            Customer
                          </div>

                          <div className="break-words text-[10px] font-bold text-black">
                            {bill.invoice.customerName || "-"}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] text-gray-500">
                            Booking ID
                          </div>

                          <div className="break-words text-[10px] font-bold text-black">
                            {bill.invoice.bookingId || "-"}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] text-gray-500">PNR</div>

                          <div className="break-words text-[10px] font-bold text-black">
                            {bill.invoice.pnr || "-"}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] text-gray-500">
                            Grand Total
                          </div>

                          <div className="text-[11px] font-bold text-black">
                            ₹{formatCurrency(bill.grandTotal)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[9px] text-gray-400">
                        Saved{" "}
                        {bill.savedAt
                          ? new Date(bill.savedAt).toLocaleString("en-IN")
                          : ""}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => onLoad(bill)}
                        className="h-8 rounded-md border border-black bg-black px-3 text-[10px] font-bold text-white hover:bg-gray-800"
                      >
                        Load
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(bill.id)}
                        className="h-8 rounded-md border border-red-200 bg-white px-3 text-[10px] font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3">
          <div className="text-[11px] text-gray-500">
            {bills.length} {bills.length === 1 ? "bill" : "bills"} saved
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-gray-300 bg-white px-4 text-[10px] font-bold text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function TaxInvoice() {
  const [invoice, setInvoice] = useState(INITIAL_INVOICE);
  const [errors, setErrors] = useState({});

  const [savedBills, setSavedBills] = useState([]);
  const [showSavedBills, setShowSavedBills] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  /* =======================================================
     LOAD SAVED BILLS ON START
  ======================================================= */

  useEffect(() => {
    const bills = getSavedBillsFromStorage();

    /*
     * Newest saved bill first.
     */
    bills.sort((a, b) => {
      return (
        new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()
      );
    });

    setSavedBills(bills);
  }, []);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  function updateField(field, value) {
    setInvoice((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = { ...current };

      delete next[field];

      return next;
    });

    setSaveMessage("");
  }

  /* =======================================================
     TOTAL
  ======================================================= */

  const taxableAmount = useMemo(() => {
    const fare = parseFloat(invoice.fareCharges) || 0;

    const service = parseFloat(invoice.serviceFees) || 0;

    return fare + service;
  }, [invoice.fareCharges, invoice.serviceFees]);

  const cgstAmount = useMemo(() => {
    return taxableAmount * 0.09;
  }, [taxableAmount]);

  const sgstAmount = useMemo(() => {
    return taxableAmount * 0.09;
  }, [taxableAmount]);

  const grandTotal = useMemo(() => {
    return taxableAmount + cgstAmount + sgstAmount;
  }, [taxableAmount, cgstAmount, sgstAmount]);

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateInvoice() {
    const newErrors = {};

    if (!invoice.customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
    }

    if (!invoice.bookedBy.trim()) {
      newErrors.bookedBy = "Booked by is required.";
    }

    if (!invoice.passengerName.trim()) {
      newErrors.passengerName = "Passenger name is required.";
    }

    if (!invoice.pnr.trim()) {
      newErrors.pnr = "PNR is required.";
    }

    if (!invoice.invoiceNo.trim()) {
      newErrors.invoiceNo = "Invoice number is required.";
    }

    if (!invoice.date) {
      newErrors.date = "Date is required.";
    }

    const fare = parseFloat(invoice.fareCharges);

    if (invoice.fareCharges === "" || Number.isNaN(fare) || fare < 0) {
      newErrors.fareCharges = "Enter a valid fare amount.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* =======================================================
     SAVE BILL
  ======================================================= */

  function handleSaveBill() {
    if (!validateInvoice()) {
      return;
    }

    const currentInvoice = JSON.parse(JSON.stringify(invoice));

    /*
     * Invoice number is used as the unique bill key.
     *
     * Same invoice number:
     * update existing saved bill.
     *
     * Different invoice number:
     * create a new saved bill.
     */

    const existingIndex = savedBills.findIndex(
      (bill) =>
        String(bill?.invoice?.invoiceNo || "").trim() ===
        String(currentInvoice.invoiceNo || "").trim(),
    );

    let updatedBills;

    if (existingIndex !== -1) {
      updatedBills = [...savedBills];

      updatedBills[existingIndex] = {
        ...updatedBills[existingIndex],
        invoice: currentInvoice,
        grandTotal: Number(grandTotal) || 0,
        savedAt: new Date().toISOString(),
      };
    } else {
      const newBill = createSavedBill(currentInvoice, grandTotal);

      updatedBills = [newBill, ...savedBills];
    }

    /*
     * Newest first.
     */

    updatedBills.sort((a, b) => {
      return (
        new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()
      );
    });

    const success = saveBillsToStorage(updatedBills);

    if (!success) {
      setSaveMessage("Unable to save bill. Browser storage may be full.");
      return;
    }

    setSavedBills(updatedBills);

    setSaveMessage(
      existingIndex !== -1
        ? "Bill updated successfully."
        : "Bill saved successfully.",
    );

    /*
     * Automatically open saved bills after save
     * so user can immediately see the saved bill.
     */

    setShowSavedBills(true);
  }

  /* =======================================================
     LOAD BILL
  ======================================================= */

  function handleLoadBill(bill) {
    if (!bill?.invoice) {
      return;
    }

    setInvoice({
      ...INITIAL_INVOICE,
      ...JSON.parse(JSON.stringify(bill.invoice)),
    });

    setErrors({});
    setSaveMessage("Saved bill loaded.");
    setShowSavedBills(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     DELETE BILL
  ======================================================= */

  function handleDeleteBill(id) {
    const bill = savedBills.find((item) => item.id === id);

    if (!bill) {
      return;
    }

    const confirmed = window.confirm(
      `Delete saved bill "${bill.invoice?.invoiceNo || ""}"?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedBills = savedBills.filter((item) => item.id !== id);

    const success = saveBillsToStorage(updatedBills);

    if (!success) {
      return;
    }

    setSavedBills(updatedBills);
  }

  /* =======================================================
     RESET
  ======================================================= */

  function handleReset() {
    setInvoice({
      ...INITIAL_INVOICE,
    });

    setErrors({});
    setSaveMessage("");
  }

  /* =======================================================
     PRINT
  ======================================================= */

  function handlePrint() {
    if (!validateInvoice()) {
      return;
    }

    const originalTitle = document.title;

    document.title = `Air Ticket - ${invoice.invoiceNo}`;

    // Browser ko print layout calculate karne ka time
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();

        // Print dialog close hone ke baad title restore
        setTimeout(() => {
          document.title = originalTitle;
        }, 1000);
      });
    });
  }

  return (
    <>
      {/* ===================================================
          PRINT CSS
      =================================================== */}

      <style>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
        }

        body {
          background: #e9e9e9;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        /*
         * IMPORTANT:
         * Print ke waqt browser sirf invoice ko render karega.
         * Isse blank print preview ka issue avoid hota hai.
         */

        @media print {
          html,
          body {
            width: 210mm !important;
            min-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body {
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /*
           * Screen ke saare elements hidden.
           */
          body * {
            visibility: hidden !important;
          }

          /*
           * Sirf invoice aur uske children visible.
           */
          .invoice-page,
          .invoice-page * {
            visibility: visible !important;
          }

          /*
           * Invoice ko page ke exact top-left par place karo.
           */
          .invoice-page {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;

            display: block !important;

            width: 210mm !important;
            height: 297mm !important;

            min-width: 210mm !important;
            min-height: 297mm !important;

            max-width: 210mm !important;
            max-height: 297mm !important;

            margin: 0 !important;
            padding: 10mm 11mm 18mm 11mm !important;

            background: #fff !important;

            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;

            overflow: hidden !important;

            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;

            break-before: avoid-page !important;
            break-after: avoid-page !important;
            break-inside: avoid-page !important;
          }

          .invoice-page img {
            visibility: visible !important;
            max-width: 100% !important;

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

          /*
           * Print ke waqt external/editor section nahi chahiye.
           */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#e9e9e9] p-6">
        {/* =================================================
            EDITOR
        ================================================= */}

        <section className="no-print mx-auto mb-4 w-full max-w-[210mm] rounded-lg border border-gray-200 bg-white p-[18px] shadow-sm">
          <div className="flex items-start justify-between gap-4 max-sm:flex-col">
            <div>
              <h2 className="m-0 text-[19px] font-bold text-black">
                Edit Tax Invoice
              </h2>

              <p className="mb-0 mt-[5px] text-[12px] text-gray-500">
                Update the fields below. Changes will immediately appear in the
                invoice preview.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSavedBills(true)}
              className="h-[38px] shrink-0 rounded-md border border-gray-300 bg-white px-[16px] text-[11px] font-bold text-gray-800 hover:bg-gray-50"
            >
              Saved Bills
              {savedBills.length > 0 && (
                <span className="ml-2 rounded-full bg-black px-[6px] py-[2px] text-[9px] text-white">
                  {savedBills.length}
                </span>
              )}
            </button>
          </div>

          <div className="mt-[18px] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EditField
              label="Customer Name"
              value={invoice.customerName}
              error={errors.customerName}
              onChange={(value) => {
                setInvoice((current) => ({
                  ...current,
                  customerName: value,
                  passengerName: value,
                }));

                setErrors((current) => {
                  const next = { ...current };

                  delete next.customerName;
                  delete next.passengerName;

                  return next;
                });

                setSaveMessage("");
              }}
            />

            <EditField
              label="Booked By"
              value={invoice.bookedBy}
              error={errors.bookedBy}
              onChange={(value) => updateField("bookedBy", value)}
            />

            <EditField
              label="PNR"
              value={invoice.pnr}
              error={errors.pnr}
              onChange={(value) => updateField("pnr", value.toUpperCase())}
            />

            <EditField
              label="Fare Charges"
              type="number"
              value={invoice.fareCharges}
              error={errors.fareCharges}
              onChange={(value) => updateField("fareCharges", value)}
            />

            <EditField
              label="Service Fees"
              type="number"
              value={invoice.serviceFees}
              onChange={(value) => updateField("serviceFees", value)}
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
              label="Flight Route"
              value={invoice.flightRoute}
              onChange={(value) => updateField("flightRoute", value)}
            />
          </div>

          <div className="mt-[18px] flex items-center justify-between gap-4 border-t border-gray-100 pt-[15px] max-sm:flex-col max-sm:items-stretch">
            <div>
              <div className="text-[13px] text-gray-600">
                Grand Total:{" "}
                <strong className="text-black">
                  ₹{formatCurrency(grandTotal)}
                </strong>
              </div>

              {saveMessage && (
                <div
                  className={[
                    "mt-1 text-[10px] font-bold",
                    saveMessage.includes("Unable")
                      ? "text-red-600"
                      : "text-green-600",
                  ].join(" ")}
                >
                  {saveMessage}
                </div>
              )}
            </div>

            <div className="flex gap-2 max-sm:w-full">
              <button
                type="button"
                onClick={handleReset}
                className="h-[38px] rounded-md border border-gray-300 bg-white px-[17px] text-[12px] font-bold text-gray-800 hover:bg-gray-50 max-sm:flex-1"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleSaveBill}
                className="h-[38px] rounded-md border border-gray-300 bg-white px-[17px] text-[12px] font-bold text-gray-800 hover:bg-gray-50 max-sm:flex-1"
              >
                Save Bill
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="h-[38px] rounded-md border border-black bg-black px-[17px] text-[12px] font-bold text-white hover:bg-gray-800 max-sm:flex-1"
              >
                Print Tax Invoice
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            A4 INVOICE
            PRINT VIEW UNCHANGED
        ================================================= */}

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
            <div className="flex flex-col gap-3.5">
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

            <div className="flex flex-col gap-3.5">
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
              <div className="mb-[3px] text-[10px] text-[#666]">Booked By</div>

              <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                {invoice.bookedBy}
              </div>
            </div>
          </section>

          {/* FLIGHT */}

          <section className="mt-3 overflow-hidden rounded-[9px] border-2 border-[#222]">
            <div className="flex min-h-[25px] items-center justify-between gap-4 border-b-2 border-[#222] px-3 py-1 text-[10.5px] font-bold">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                {invoice.flightRoute} ({formatInvoiceDate(invoice.date)})
              </span>

              <span className="mb-1 text-[10px] text-[#777]">
                {invoice.flightNumber}
              </span>
            </div>

            <div className="grid grid-cols-[1.3fr_1fr_1fr]">
              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-1 text-[10px] text-[#777]">
                  Passenger Name(s)
                </div>

                <div className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  {invoice.passengerName}
                </div>
              </div>

              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">
                  Ticket No.
                </div>

                <div className="break-words text-[10px] font-bold leading-[1.1] text-[#777]">
                  {invoice.ticketNo}
                </div>
              </div>

              <div className="min-w-0 px-[9px] py-[7px]">
                <div className="mb-[4px] text-[10px] text-[#777]">PNR</div>

                <div className="break-words text-[10px] font-bold leading-[1.1] text-[#777]">
                  {invoice.pnr}
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
            {/* Fare */}

            <div className="min-h-[43px] px-[10px] py-[5px]">
              <div className="flex items-center justify-between gap-4">
                <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                  *Fare Charges
                </span>

                <span className="break-words text-[12px] font-bold leading-[1.2] text-black">
                  ₹{formatCurrency(invoice.fareCharges)}
                </span>
              </div>

              <div className="mt-[2px] pr-3 text-[8.5px] leading-[1.1] text-[#333]">
                {invoice.fareDescription}
              </div>
            </div>

            {/* Service Fees */}

            <div className="flex min-h-[25px] items-center justify-between gap-4 px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                Service Fees
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(invoice.serviceFees)}
              </span>
            </div>

            {/* CGST */}

            <div className="flex min-h-[25px] items-center justify-between gap-4 px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                CGST @9%
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(cgstAmount)}
              </span>
            </div>

            {/* SGST */}

            <div className="flex min-h-[25px] items-center justify-between gap-4 border-b-2 border-[#222] px-[10px] py-[4px]">
              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                SGST @9%
              </span>

              <span className="break-words text-[11px] font-bold leading-[1.2] text-black">
                ₹{formatCurrency(sgstAmount)}
              </span>
            </div>

            {/* Grand Total */}

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

      {/* ===================================================
          SAVED BILLS POPUP
      =================================================== */}

      {showSavedBills && (
        <SavedBillsModal
          bills={savedBills}
          onClose={() => setShowSavedBills(false)}
          onLoad={handleLoadBill}
          onDelete={handleDeleteBill}
        />
      )}
    </>
  );
}
