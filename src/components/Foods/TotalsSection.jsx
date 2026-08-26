import { Field, Hr, TotalRow } from "./ReceiptControls";

export default function TotalsSection({
  bill,
  onChange,
  subTotal,
  cgstAmt,
  sgstAmt,
  payable,
  balance,
}) {
  return (
    <>
      <Hr dashed />

      <TotalRow label="Sub Total" value={subTotal.toFixed(2)} />
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
              style={{ width: "34px", fontSize: "13px" }}
            />
            %
          </span>
        }
        value={cgstAmt.toFixed(2)}
      />
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
              style={{ width: "34px", fontSize: "13px" }}
            />
            %
          </span>
        }
        value={sgstAmt.toFixed(2)}
      />

      <Hr />

      <TotalRow bold label="Payable in" value={`? ${payable.toFixed(2)}`} />
      <TotalRow
        label="Paid Amount"
        value={
          <Field
            type="number"
            min="0"
            step="1"
            value={bill.paid}
            onChange={(v) => onChange("paid", parseFloat(v) || 0)}
            style={{ width: "80px", textAlign: "right", fontSize: "13px" }}
          />
        }
      />
      <TotalRow bold label="Balance Amount" value={balance.toFixed(2)} />

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
