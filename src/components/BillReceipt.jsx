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
  showPoweredBy = true,
  showGstLines = true,
  addressFontSize = 12,
  showDividerLines = true,
  includeGST = true,
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

  // Calculate total without GST if needed
  const totalWithoutGST = safeSubtotal;

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
         FLEX CONTAINERS
         ================================ */
      #thermalBill .flex {
        display: flex !important;
        flex-wrap: nowrap !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      #thermalBill .justify-between {
        justify-content: space-between !important;
      }

      #thermalBill .gap-2 {
        gap: 0.5rem !important;
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
          p-2
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
              className="font-black leading-none"
              style={{
                fontSize: `${fontSize * 1.8}px`,
              }}
            >
              {bill.title}
            </h1>
          )}

          {hasValue(bill.branch) && (
            <p className="font-bold text-sm">{bill.branch}</p>
          )}

          {hasValue(bill.franchise) && (
            <p className="font-bold leading-4 text-xs">{bill.franchise}</p>
          )}

          {hasValue(bill.address1) && (
            <p
              style={{ fontSize: `${addressFontSize * 0.85}px` }}
              className="leading-3"
            >
              {bill.address1}
            </p>
          )}

          {hasValue(bill.address2) && (
            <p
              style={{ fontSize: `${addressFontSize * 0.85}px` }}
              className="leading-3"
            >
              {bill.address2}
            </p>
          )}

          {hasValue(bill.city) && (
            <p
              style={{ fontSize: `${addressFontSize * 0.85}px` }}
              className="leading-3"
            >
              {bill.city}
            </p>
          )}

          {hasValue(bill.phone) && (
            <p className="text-xs leading-3">Contact No: {bill.phone}</p>
          )}

          {hasValue(bill.email) && (
            <p className="break-all text-xs leading-3">Email: {bill.email}</p>
          )}

          {hasValue(bill.gst) && (
            <p className="text-xs leading-3">GST IN {bill.gst}</p>
          )}

          {hasValue(bill.date) && (
            <p className="text-xs leading-3">{bill.date}</p>
          )}

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

        {showDividerLines && (
          <div className="my-1 border-t border-dashed border-black" />
        )}

        {/* =========================
            BILL INFO
        ========================== */}
        {(hasValue(bill.billNo) || hasValue(bill.orderId)) && (
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
        )}

        {showDividerLines &&
          (hasValue(bill.billNo) || hasValue(bill.orderId)) && (
            <div className="my-1 border-t border-dashed border-black" />
          )}

        {/* =========================
            TABLE / USER
        ========================== */}
        {(hasValue(bill.table) || hasValue(bill.user)) && (
          <>
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

            {showDividerLines && (
              <div className="my-1 border-t border-dashed border-black" />
            )}
          </>
        )}

        {/* =========================
            ITEMS
        ========================== */}
        <div>
          <div
            className="mb-1 flex font-bold text-xs leading-4"
            style={{
              fontSize: `${fontSize * 1.05}px`,
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
              <div key={item?.id ?? `item-${index}`} className="leading-4">
                <div className="flex text-xs">
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

        <div className="my-1 border-t border-dashed border-black" />

        {/* =========================
            TOTALS
        ========================== */}
        {(includeGST ? safeGrandTotal > 0 : totalWithoutGST > 0) && (
          <div
            style={{
              fontSize: `${fontSize}px`,
              width: "100%",
            }}
          >
            {includeGST ? (
              <>
                {showGstLines && (
                  <>
                    {/* Total Row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        alignItems: "center",
                        width: "100%",
                        lineHeight: "1.5",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Total :
                      </span>

                      <span
                        style={{
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {totalQty}
                      </span>

                      <span
                        style={{
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Rs {safeSubtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* CGST */}
                    {safeCgst > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          alignItems: "center",
                          width: "100%",
                          lineHeight: "1.5",
                        }}
                      >
                        <span></span>

                        <span></span>

                        <span
                          style={{
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                          }}
                        >
                          CGST (2.5%) : Rs {safeCgst.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* SGST */}
                    {safeSgst > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          alignItems: "center",
                          width: "100%",
                          lineHeight: "1.5",
                        }}
                      >
                        <span></span>

                        <span></span>

                        <span
                          style={{
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            fontWeight: 600,
                          }}
                        >
                          SGST (2.5%) : Rs {safeSgst.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Grand Total */}
                <div
                  style={{
                    marginTop: "10px",
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      fontWeight: 900,
                      lineHeight: "1.25",
                      fontSize: `${fontSize * 1.67}px`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Grand Total : Rs {safeGrandTotal.toFixed(2)}
                  </h1>

                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: `${fontSize}px`,
                      lineHeight: "1.4",
                    }}
                  >
                    Rounded Amount : {roundedAmount}
                  </p>

                  {hasValue(amountInWords) && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontStyle: "italic",
                        lineHeight: "1.4",
                        fontSize: `${fontSize - 1}px`,
                        textTransform: "capitalize",
                      }}
                    >
                      {amountInWords}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Total Row Without GST */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    alignItems: "center",
                    width: "100%",
                    lineHeight: "1.5",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total :
                  </span>

                  <span
                    style={{
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {totalQty}
                  </span>

                  <span
                    style={{
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Rs {totalWithoutGST.toFixed(2)}
                  </span>
                </div>

                {/* Total Amount */}
                <div
                  style={{
                    marginTop: "10px",
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      fontWeight: 900,
                      lineHeight: "1.25",
                      fontSize: `${fontSize * 1.67}px`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Amount : Rs {totalWithoutGST.toFixed(2)}
                  </h1>

                  {hasValue(roundedAmount) && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: `${fontSize}px`,
                      }}
                    >
                      Rounded Amount : {roundedAmount}
                    </p>
                  )}

                  {hasValue(amountInWords) && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontStyle: "italic",
                        lineHeight: "1.4",
                        fontSize: `${fontSize - 1}px`,
                        textTransform: "capitalize",
                      }}
                    >
                      {amountInWords}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        <div className="my-1 border-t border-dashed border-black" />

        {/* =========================
            PAID
        ========================== */}
        <PaidStamp show={Boolean(bill.paid)} />

        {/* =========================
            FOOTER
        ========================== */}
        <div className="text-center text-xs">
          <p className="leading-4">E&amp;OE. Thank you. Visit Again.</p>

          {showPoweredBy && (
            <p className="mt-1 text-xs">Powered by TMBill v7.4.80</p>
          )}
        </div>
      </div>
    </>
  );
}
