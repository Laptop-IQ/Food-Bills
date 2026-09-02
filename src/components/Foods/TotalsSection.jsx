import { Field, Hr, TotalRow } from "./ReceiptControls";

const hasValue = (value) => String(value ?? "").trim() !== "";

export default function TotalsSection({
  bill,
  onChange,
  subTotal,
  cgstAmt,
  sgstAmt,
  payable,
  balance,
}) {
  /*
   * GST is applicable ONLY when GSTIN exists.
   */
  const gstApplicable = hasValue(bill.gstin);

  const cgstRate = Number(bill.cgst) || 0;
  const sgstRate = Number(bill.sgst) || 0;

  const showCgst = gstApplicable && cgstRate > 0 && cgstAmt > 0;

  const showSgst = gstApplicable && sgstRate > 0 && sgstAmt > 0;

  const paid = Number(bill.paid) || 0;

  const showPaid = paid > 0;

  const showBalance = showPaid && Number(balance) > 0;

  return (
    <>
      <Hr dashed />

      {subTotal > 0 && (
        <TotalRow label="Sub Total" value={subTotal.toFixed(2)} />
      )}

      {showCgst && (
        <TotalRow
          label={
            <span>
              CGST{" "}
              <Field
                type="number"
                min="0"
                max="99"
                step="0.5"
                value={bill.cgst}
                onChange={(v) => onChange("cgst", parseFloat(v) || 0)}
                style={{
                  width: "34px",
                  fontSize: "13px",
                }}
              />
              %
            </span>
          }
          value={cgstAmt.toFixed(2)}
        />
      )}

      {showSgst && (
        <TotalRow
          label={
            <span>
              SGST{" "}
              <Field
                type="number"
                min="0"
                max="99"
                step="0.5"
                value={bill.sgst}
                onChange={(v) => onChange("sgst", parseFloat(v) || 0)}
                style={{
                  width: "34px",
                  fontSize: "13px",
                }}
              />
              %
            </span>
          }
          value={sgstAmt.toFixed(2)}
        />
      )}

      <Hr />

      {payable > 0 && (
        <TotalRow bold label="Payable in" value={`? ${payable.toFixed(2)}`} />
      )}

      {showPaid && (
        <TotalRow
          label="Paid Amount"
          value={
            <Field
              type="number"
              min="0"
              step="1"
              value={bill.paid}
              onChange={(v) => onChange("paid", parseFloat(v) || 0)}
              style={{
                width: "80px",
                textAlign: "right",
                fontSize: "13px",
              }}
            />
          }
        />
      )}

      {showBalance && (
        <TotalRow bold label="Balance Amount" value={balance.toFixed(2)} />
      )}

      {hasValue(bill.orderNo) && (
        <>
          <Hr dashed />

          <div
            style={{
              fontSize: "11.5px",
              wordBreak: "break-all",
              marginTop: "4px",
              color: "#000",
            }}
          >
            Order No:{" "}
            <Field
              value={bill.orderNo}
              onChange={(v) => onChange("orderNo", v)}
              style={{
                fontSize: "11px",
                width: "calc(100% - 78px)",
                color: "#000",
              }}
            />
          </div>
        </>
      )}

      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "12px",
          letterSpacing: "1px",
          fontSize: "13px",
          color: "#000",
        }}
      >
        ===THANKS &amp; VISIT AGAIN====
      </div>
    </>
  );
}
