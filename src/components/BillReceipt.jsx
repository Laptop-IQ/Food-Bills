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
            @page {
              size: 80mm auto;
              margin: 0;
            }

            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm !important;
              background: #fff !important;
            }

            body * {
              visibility: hidden !important;
            }

            #thermalBill,
            #thermalBill * {
              visibility: visible !important;
            }

            #thermalBill {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 80mm !important;
              max-width: 80mm !important;
              min-width: 80mm !important;
              margin: 0 !important;
              padding: 4mm !important;
              box-sizing: border-box !important;
              overflow: visible !important;
              box-shadow: none !important;
              border: none !important;
              background: #fff !important;
            }

            #thermalBill .no-print {
              display: none !important;
            }

            #thermalBill .print-only {
              display: block !important;
            }

            #thermalBill {
              page-break-after: avoid !important;
              page-break-before: avoid !important;
            }

            #thermalBill * {
              page-break-inside: avoid !important;
            }
          }

          @media screen {
            #thermalBill .print-only {
              display: none;
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

          {hasValue(bill.address1) && <p>{bill.address1}</p>}

          {hasValue(bill.address2) && <p>{bill.address2}</p>}

          {hasValue(bill.city) && <p>{bill.city}</p>}

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
        <div
          style={{
            fontSize: `${fontSize * 1.17}px`,
          }}
        >
          <div className="flex justify-between">
            <div className="flex gap-5">
              <span className="font-bold">Total :</span>
              <span>{totalQty}</span>
            </div>

            <div>Rs {safeSubtotal.toFixed(2)}</div>
          </div>

          <div className="mt-1 text-right">
            CGST (2.5%) : Rs {safeCgst.toFixed(2)}
          </div>

          <div className="mt-1 text-right">
            SGST (2.5%) : Rs {safeSgst.toFixed(2)}
          </div>

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

          <p className="mt-3">Powered by TMBill v7.4.80</p>
        </div>
      </div>
    </>
  );
}
