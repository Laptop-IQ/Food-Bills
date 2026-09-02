import React from "react";
import { convertAmountToWords } from "../utils/utils";
import PaidStamp from "./PaidStamp";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export default function BillReceipt({
  bill = {},
  items = [],
  activeFontCss,
  fontSize = 12,
  totals = {},
  showActions = true,
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
  // New props for control toggles
  showPoweredBy = true,
  showGstLines = true,
  addressFontSize = 12,
}) {
  const {
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    grandTotal = 0,
    roundedAmount = "0.00",
    totalQty = 0,
  } = totals;

  const amountInWords = convertAmountToWords(grandTotal);

  const safeSubtotal = Number(subtotal) || 0;
  const safeCgst = Number(cgst) || 0;
  const safeSgst = Number(sgst) || 0;
  const safeGrandTotal = Number(grandTotal) || 0;

  return (
    <>
      {/* =====================================================
          PRINT STYLES
      ====================================================== */}
      <style>
        {`
    @media print {

      /* ================================
         THERMAL PAPER
         ================================ */
      @page {
        size: 90mm auto;
        margin: 0;
      }

      /* ================================
         PRINT ROOT
         ================================ */
      html,
      body {
        width: 90mm !important;
        min-width: 90mm !important;
        max-width: 90mm !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #fff !important;

        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* ================================
         HIDE EVERYTHING
         ================================ */
      body * {
        visibility: hidden !important;
      }

      /* ================================
         SHOW BILL ONLY
         ================================ */
      #thermalBill,
      #thermalBill * {
        visibility: visible !important;
      }

      /* ================================
         THERMAL BILL
         ================================ */
      #thermalBill {
        position: absolute !important;

        left: 0 !important;
        top: 0 !important;

        width: 80mm !important;
        min-width: 80mm !important;
        max-width: 80mm !important;

        margin: 0 !important;

        padding: 4mm !important;

        box-sizing: border-box !important;

        overflow: visible !important;

        background: #fff !important;

        /* Paper border */
        border: 1px solid #e2e2e2 !important;
        border-radius: 1px !important;

        /* Right side + bottom paper shadow */
        box-shadow:
          2px 0 4px rgba(0, 0, 0, 0.12),
          0 2px 5px rgba(0, 0, 0, 0.10),
          0 5px 10px rgba(0, 0, 0, 0.07) !important;

        /* Prevent unwanted transformation */
        transform: none !important;

        /* Print rendering */
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;

        /* Prevent page splitting */
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;

        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
      }

      /* ================================
         HIDE NO-PRINT ELEMENTS
         ================================ */
      #thermalBill .no-print {
        display: none !important;
        visibility: hidden !important;
      }

      /* ================================
         SHOW PRINT-ONLY ELEMENTS
         ================================ */
      #thermalBill .print-only {
        display: block !important;
        visibility: visible !important;
      }

      /* ================================
         PREVENT CONTENT SPLITTING
         ================================ */
      #thermalBill * {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* ================================
         IMAGES
         ================================ */
      #thermalBill img {
        max-width: 100% !important;

        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* ================================
         TABLES
         ================================ */
      #thermalBill table {
        width: 100% !important;
        border-collapse: collapse !important;

        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      #thermalBill tr,
      #thermalBill td,
      #thermalBill th {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* ================================
         TEXT
         ================================ */
      #thermalBill p,
      #thermalBill div,
      #thermalBill span {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* =====================================
       SCREEN
       ===================================== */
    @media screen {

      #thermalBill .print-only {
        display: none !important;
      }
    }
  `}
      </style>

      {/* =====================================================
          BILL / PRINT VIEW
      ====================================================== */}
      <div
        id="thermalBill"
        className="
          relative
          mx-auto
          w-[320px]
          max-w-full
          overflow-hidden
          bg-white
          p-4
          text-black
          shadow-xl
        "
        style={{
          fontFamily: activeFontCss,
          fontSize: `${fontSize}px`,
        }}
      >
        {/* =========================
            RESTAURANT HEADER
        ========================== */}
        <div className="text-center">
          {hasValue(bill.title) && (
            <h1
              className="font-black leading-tight"
              style={{
                fontSize: `${fontSize * 2}px`,
              }}
            >
              {bill.title}
            </h1>
          )}

          {hasValue(bill.branch) && <p className="font-bold">{bill.branch}</p>}

          {hasValue(bill.franchise) && (
            <p className="font-bold leading-5">{bill.franchise}</p>
          )}

          {hasValue(bill.address1) && (
            <p style={{ fontSize: `${addressFontSize}px` }}>
              {bill.address1}
            </p>
          )}

          {hasValue(bill.address2) && (
            <p style={{ fontSize: `${addressFontSize}px` }}>
              {bill.address2}
            </p>
          )}

          {hasValue(bill.city) && (
            <p style={{ fontSize: `${addressFontSize}px` }}>
              {bill.city}
            </p>
          )}

          {hasValue(bill.phone) && <p>Contact No: {bill.phone}</p>}

          {hasValue(bill.email) && (
            <p className="break-all">Email: {bill.email}</p>
          )}

          {hasValue(bill.gst) && <p>GST IN {bill.gst}</p>}

          {hasValue(bill.date) && <p>{bill.date}</p>}

          {hasValue(bill.dine) && (
            <p
              className="mt-1 font-black"
              style={{
                fontSize: `${fontSize * 1.5}px`,
              }}
            >
              {bill.dine}
            </p>
          )}
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* =========================
            BILL INFO
        ========================== */}
        <div className="text-center">
          {hasValue(bill.billNo) && (
            <p
              className="font-black"
              style={{
                fontSize: `${fontSize * 1.5}px`,
              }}
            >
              Bill No : {bill.billNo}
            </p>
          )}

          {hasValue(bill.orderId) && (
            <p
              className="font-bold"
              style={{
                fontSize: `${fontSize * 1.33}px`,
              }}
            >
              Order Id: {bill.orderId}
            </p>
          )}
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* =========================
            TABLE / USER
        ========================== */}
        {(hasValue(bill.table) || hasValue(bill.user)) && (
          <div
            className="flex justify-between gap-2 font-bold"
            style={{
              fontSize: `${fontSize * 1.25}px`,
            }}
          >
            <span className="min-w-0 break-words">
              {hasValue(bill.table) ? `Table: ${bill.table}` : ""}
            </span>

            <span className="min-w-0 break-words text-right">
              {hasValue(bill.user) ? `User: ${bill.user}` : ""}
            </span>
          </div>
        )}

        <div className="my-2 border-t border-dashed border-black" />

        {/* =========================
            ITEMS
        ========================== */}
        <div>
          <div
            className="mb-2 flex font-black"
            style={{
              fontSize: `${fontSize * 1.15}px`,
            }}
          >
            <div className="w-[50%]">Item</div>
            <div className="w-[15%] text-center">Qty</div>
            <div className="w-[15%] text-center">Rate</div>
            <div className="w-[20%] text-right">Total</div>
          </div>

          {items.map((item, index) => {
            const qty = Number(item?.qty) || 0;
            const rate = Number(item?.rate) || 0;
            const amount = qty * rate;

            return (
              <div key={item?.id ?? `item-${index}`} className="mb-1">
                <div className="flex">
                  <div className="w-[50%] break-words pr-1">
                    {index + 1}. {item?.name || "Item"}
                  </div>

                  <div className="w-[15%] text-center">{qty}</div>

                  <div className="w-[15%] text-center">{rate.toFixed(2)}</div>

                  <div className="w-[20%] text-right">{amount.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* =========================
            TOTALS
        ========================== */}
        {safeGrandTotal > 0 && (
          <div
            style={{
              fontSize: `${fontSize * 1.17}px`,
            }}
          >
            {showGstLines && (
              <div className="flex justify-between">
                <div className="flex gap-5">
                  <span className="font-bold">Total :</span>
                  <span>{totalQty}</span>
                </div>

                <div>Rs {safeSubtotal.toFixed(2)}</div>
              </div>
            )}

            <div className="mt-5 text-right">
              <h1
                className="font-black"
                style={{
                  fontSize: `${fontSize * 1.67}px`,
                }}
              >
                Grand Total : Rs {safeGrandTotal.toFixed(2)}
              </h1>

              <p className="mt-2">Rounded Amount : {roundedAmount}</p>

              {hasValue(amountInWords) && (
                <p className="mt-2 italic leading-6 capitalize">
                  {amountInWords}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="my-2 border-t border-dashed border-black" />

        {/* =========================
            PAID
        ========================== */}
        <PaidStamp show={Boolean(bill.paid)} />

        {/* =========================
            FOOTER
        ========================== */}
        <div className="text-center">
          <p>E&amp;OE. Thank you. Visit Again.</p>

          {showPoweredBy && <p className="mt-3">Powered by TMBill v7.4.80</p>}
        </div>
      </div>
    </>
  );
}
