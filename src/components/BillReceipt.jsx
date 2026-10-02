import React from "react";
import { convertAmountToWords } from "../utils/utils";
import PaidStamp from "./PaidStamp";
import { DEFAULT_TEXT_STYLES, normalizeTextStyles } from "../layout/textStyles";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const px = (value) => `${Number(value) || 0}px`;

function makeStyle(style, fallback = {}) {
  return {
    ...fallback,
    ...(style?.fontSize != null ? { fontSize: px(style.fontSize) } : {}),
    ...(style?.fontWeight != null ? { fontWeight: style.fontWeight } : {}),
    ...(style?.lineHeight != null ? { lineHeight: style.lineHeight } : {}),
    ...(style?.textAlign && style.textAlign !== "inherit"
      ? { textAlign: style.textAlign }
      : {}),
    marginTop: px(style?.marginTop ?? fallback.marginTop ?? 0),
    marginBottom: px(style?.marginBottom ?? fallback.marginBottom ?? 0),
  };
}

export default function BillReceipt({
  bill = {},
  items = [],
  activeFontCss,
  fontSize = 12,
  totals = {},
  textStyles = DEFAULT_TEXT_STYLES,
  showPoweredBy = true,
  showGstLines = true,
  showDividerLines = true,
  includeGST = true,
  footerMessage = "Thank you. Visit Again.",
  receiptPlacement = null,
}) {
  const styles = normalizeTextStyles(textStyles);
  const base = Number(fontSize) || 12;

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
  const totalWithoutGST = safeSubtotal;

  const field = (key, fallback = {}) =>
    makeStyle(styles[key], {
      ...fallback,
      fontFamily: activeFontCss,
    });

  const headerStyle = (key, scale = 1, fallback = {}) =>
    field(key, {
      fontSize: `${base * scale}px`,
      ...fallback,
    });

  return (
    <>
      <style>
        {`\n          @media print {\n            @page { size: 90mm auto; margin: 0; }\n            html, body {\n              width: 90mm !important;\n              min-width: 90mm !important;\n              max-width: 90mm !important;\n              margin: 0 !important;\n              padding: 0 !important;\n              background: #fff !important;\n              -webkit-print-color-adjust: exact !important;\n              print-color-adjust: exact !important;\n            }\n            body * { visibility: hidden !important; }\n            #thermalBill, #thermalBill * { visibility: visible !important; }\n            #thermalBill {\n              position: absolute !important;\n              left: 0 !important;\n              top: 0 !important;\n              width: 80mm !important;\n              min-width: 80mm !important;\n              max-width: 80mm !important;\n              margin: 0 !important;\n              padding: 4mm !important;\n              box-sizing: border-box !important;\n              overflow: visible !important;\n              background: #fff !important;\n              border: 1.5px solid #9ca3af !important;\n              border-radius: 1px !important;\n              box-shadow: none !important;\n              transform: var(--receipt-transform) !important;\n              -webkit-print-color-adjust: exact !important;\n              print-color-adjust: exact !important;\n              page-break-before: avoid !important;\n              page-break-after: avoid !important;\n            }\n            #thermalBill .no-print { display: none !important; visibility: hidden !important; }\n            #thermalBill .print-only { display: block !important; visibility: visible !important; }\n            #thermalBill * { page-break-inside: avoid !important; break-inside: avoid !important; }\n            #thermalBill img { max-width: 100% !important; }\n          }\n          @media screen { #thermalBill .print-only { display: none !important; } }\n        `}
      </style>

      <div
        id="thermalBill"
        className="relative mx-auto w-[320px] max-w-full overflow-hidden border border-slate-300 bg-white p-2 text-black shadow-xl receipt-paper"
        style={{
          fontFamily: activeFontCss,
          fontSize: `${base}px`,
          "--receipt-transform": receiptPlacement
            ? `translate(${receiptPlacement.x}px, ${receiptPlacement.y}px) rotate(${receiptPlacement.rotate}deg)`
            : "none",
          border: "1.5px solid #9ca3af",
          boxSizing: "border-box",
          ...(receiptPlacement
            ? {
                "--receipt-transform": `translate(${receiptPlacement.x}px, ${receiptPlacement.y}px) rotate(${receiptPlacement.rotate}deg)`,
                transform: `translate(${receiptPlacement.x}px, ${receiptPlacement.y}px) rotate(${receiptPlacement.rotate}deg)`,
                boxShadow:
                  "0 18px 38px rgba(15, 23, 42, 0.20), 0 5px 12px rgba(15, 23, 42, 0.12)",
              }
            : {}),
        }}
      >
        {/* Restaurant header */}
        <div className="text-center">
          {hasValue(bill.title) && (
            <h1
              className="font-black"
              style={headerStyle("title", 1.8, { lineHeight: 1.05 })}
            >
              {bill.title}
            </h1>
          )}

          {hasValue(bill.branch) && (
            <p style={headerStyle("branch", 1.17, { fontWeight: 700 })}>
              {bill.branch}
            </p>
          )}

          {hasValue(bill.franchise) && (
            <p style={headerStyle("franchise", 1, { fontWeight: 700 })}>
              {bill.franchise}
            </p>
          )}

          {hasValue(bill.address1) && (
            <p
              style={field("address1", {
                fontSize: `${base * 0.85}px`,
                lineHeight: 1.1,
              })}
            >
              {bill.address1}
            </p>
          )}

          {hasValue(bill.address2) && (
            <p
              style={field("address2", {
                fontSize: `${base * 0.85}px`,
                lineHeight: 1.1,
              })}
            >
              {bill.address2}
            </p>
          )}

          {hasValue(bill.city) && (
            <p
              style={field("city", {
                fontSize: `${base * 0.85}px`,
                lineHeight: 1.1,
              })}
            >
              {bill.city}
            </p>
          )}

          {hasValue(bill.phone) && (
            <p style={headerStyle("phone", 1, { lineHeight: 1.1 })}>
              Contact No: {bill.phone}
            </p>
          )}

          {hasValue(bill.email) && (
            <p
              className="break-all"
              style={headerStyle("email", 1, { lineHeight: 1.1 })}
            >
              Email: {bill.email}
            </p>
          )}

          {hasValue(bill.gst) && (
            <p
              style={headerStyle("gst", 1, {
                fontWeight: 700,
                lineHeight: 1.1,
              })}
            >
              GST IN {bill.gst}
            </p>
          )}

          {hasValue(bill.date) && (
            <p style={headerStyle("date", 1, { lineHeight: 1.1 })}>
              {bill.date}
            </p>
          )}

          {hasValue(bill.dine) && (
            <p
              style={headerStyle("dine", 1.5, {
                fontWeight: 900,
                lineHeight: 1.1,
              })}
            >
              {bill.dine}
            </p>
          )}
        </div>

        {showDividerLines && (
          <div className="my-1 border-t border-dashed border-black" />
        )}

        {/* Bill information */}
        {(hasValue(bill.billNo) || hasValue(bill.orderId)) && (
          <div className="text-center">
            {hasValue(bill.billNo) && (
              <p style={headerStyle("billNo", 1.5, { fontWeight: 900 })}>
                Bill No : {bill.billNo}
              </p>
            )}

            {hasValue(bill.orderId) && (
              <p style={headerStyle("orderId", 1.33, { fontWeight: 700 })}>
                Order Id: {bill.orderId}
              </p>
            )}
          </div>
        )}

        {showDividerLines &&
          (hasValue(bill.billNo) || hasValue(bill.orderId)) && (
            <div className="my-1 border-t border-dashed border-black" />
          )}

        {/* Table / User */}
        {(hasValue(bill.table) || hasValue(bill.user)) && (
          <>
            <div
              className="flex justify-between gap-2"
              style={headerStyle("tableUser", 1.25, { fontWeight: 700 })}
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

        {/* Items */}
        <div>
          <div
            className="grid items-center"
            style={field("itemsHeader", {
              fontSize: `${base * 1.05}px`,
              fontWeight: 700,
              lineHeight: 1.25,
              gridTemplateColumns: "minmax(0, 1fr) 30px 50px 62px",
              columnGap: "5px",
              width: "100%",
            })}
          >
            <div className="min-w-0">Item</div>
            <div className="text-center whitespace-nowrap">Qty</div>
            <div className="text-right whitespace-nowrap">Rate</div>
            <div className="text-right whitespace-nowrap">Total</div>
          </div>

          {items.map((item, index) => {
            const qty = Number(item?.qty) || 0;
            const rate = Number(item?.rate) || 0;
            const amount = qty * rate;
            const itemStyle = field("itemRow", {
              fontSize: `${base}px`,
              lineHeight: 1.25,
            });

            return (
              <div key={item?.id ?? `item-${index}`}>
                <div
                  className="grid items-center"
                  style={{
                    ...itemStyle,
                    gridTemplateColumns: "minmax(0, 1fr) 30px 50px 62px",
                    columnGap: "5px",
                    width: "100%",
                  }}
                >
                  <div className="min-w-0 break-words pr-1">
                    {index + 1}. {item?.name || "Item"}
                  </div>
                  <div className="text-center whitespace-nowrap">{qty}</div>
                  <div className="text-right whitespace-nowrap">{rate.toFixed(2)}</div>
                  <div className="text-right whitespace-nowrap">{amount.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-1 border-t border-dashed border-black" />

        {/* Totals */}
        {(includeGST ? safeGrandTotal > 0 : totalWithoutGST > 0) && (
          <div style={{ width: "100%" }}>
            {includeGST ? (
              <>
                {showGstLines && (
                  <>
                    <div
                      style={field("subtotal", {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        alignItems: "center",
                        width: "100%",
                        lineHeight: 1.5,
                      })}
                    >
                      <span style={{ fontWeight: 700, textAlign: "left", whiteSpace: "nowrap" }}>
                        Total :
                      </span>
                      <span style={{ textAlign: "center", fontWeight: 600 }}>{totalQty}</span>
                      <span style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        Rs {safeSubtotal.toFixed(2)}
                      </span>
                    </div>

                    {safeCgst > 0 && (
                      <div
                        style={field("cgst", {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          alignItems: "center",
                          width: "100%",
                          lineHeight: 1.5,
                        })}
                      >
                        <span />
                        <span />
                        <span style={{ textAlign: "right", whiteSpace: "nowrap", fontWeight: 600 }}>
                          CGST (2.5%) : Rs {safeCgst.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {safeSgst > 0 && (
                      <div
                        style={field("sgst", {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          alignItems: "center",
                          width: "100%",
                          lineHeight: 1.5,
                        })}
                      >
                        <span />
                        <span />
                        <span style={{ textAlign: "right", whiteSpace: "nowrap", fontWeight: 600 }}>
                          SGST (2.5%) : Rs {safeSgst.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div style={{ width: "100%", textAlign: "right" }}>
                  <h1
                    style={field("grandTotal", {
                      fontSize: `${base * 1.67}px`,
                      fontWeight: 900,
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                    })}
                  >
                    Grand Total : Rs {safeGrandTotal.toFixed(2)}
                  </h1>

                  <p
                    style={field("roundedAmount", {
                      fontSize: `${base}px`,
                      lineHeight: 1.4,
                    })}
                  >
                    Rounded Amount : {roundedAmount}
                  </p>

                  {hasValue(amountInWords) && (
                    <p
                      style={field("amountWords", {
                        fontSize: `${Math.max(base - 1, 7)}px`,
                        fontStyle: "italic",
                        lineHeight: 1.4,
                        textTransform: "capitalize",
                      })}
                    >
                      {amountInWords}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  style={field("subtotal", {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    alignItems: "center",
                    width: "100%",
                    lineHeight: 1.5,
                  })}
                >
                  <span style={{ fontWeight: 700, textAlign: "left", whiteSpace: "nowrap" }}>
                    Total :
                  </span>
                  <span style={{ textAlign: "center", fontWeight: 600 }}>{totalQty}</span>
                  <span style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    Rs {totalWithoutGST.toFixed(2)}
                  </span>
                </div>

                <div style={{ width: "100%", textAlign: "right" }}>
                  <h1
                    style={field("grandTotal", {
                      fontSize: `${base * 1.67}px`,
                      fontWeight: 900,
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                    })}
                  >
                    Total Amount : Rs {totalWithoutGST.toFixed(2)}
                  </h1>

                  {hasValue(roundedAmount) && (
                    <p style={field("roundedAmount", { fontSize: `${base}px` })}>
                      Rounded Amount : {roundedAmount}
                    </p>
                  )}

                  {hasValue(amountInWords) && (
                    <p
                      style={field("amountWords", {
                        fontSize: `${Math.max(base - 1, 7)}px`,
                        fontStyle: "italic",
                        lineHeight: 1.4,
                        textTransform: "capitalize",
                      })}
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

        <PaidStamp show={Boolean(bill.paid)} />

        <div style={{ textAlign: "center" }}>
          <p
            style={field("footer", {
              fontSize: `${base}px`,
              lineHeight: 1.3,
            })}
          >
            {footerMessage.includes("\n") ? (
              footerMessage.split("\n").map((line, index) => (
                <React.Fragment key={`${line}-${index}`}>
                  {index > 0 && <br />}
                  {line}
                </React.Fragment>
              ))
            ) : (
              <> {footerMessage}</>
            )}
          </p>

          {showPoweredBy && (
            <p
              style={field("poweredBy", {
                fontSize: `${base}px`,
                lineHeight: 1.3,
              })}
            >
              Powered by TMBill v7.4.80
            </p>
          )}
        </div>
      </div>
    </>
  );
}
