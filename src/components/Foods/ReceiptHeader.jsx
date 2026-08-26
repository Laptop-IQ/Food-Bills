import { Field, Hr } from "./ReceiptControls";

export default function ReceiptHeader({ bill, onChange }) {
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "14px", color: "#000" }}>
        <Field
          value={bill.name}
          onChange={(v) => onChange("name", v)}
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1.5px",
          }}
        />
        <Field
          value={bill.addr1}
          onChange={(v) => onChange("addr1", v)}
          style={{ width: "100%", textAlign: "center", fontSize: "12.5px" }}
        />
        <Field
          value={bill.addr2}
          onChange={(v) => onChange("addr2", v)}
          style={{ width: "100%", textAlign: "center", fontSize: "12.5px" }}
        />
        <div style={{ fontSize: "12.5px", marginTop: "3px" }}>
          GSTIN:{" "}
          <Field
            value={bill.gstin}
            onChange={(v) => onChange("gstin", v)}
            style={{ fontSize: "12.5px" }}
          />
        </div>
        <div style={{ fontSize: "12.5px" }}>
          PH:{" "}
          <Field
            value={bill.phone}
            onChange={(v) => onChange("phone", v)}
            style={{ fontSize: "12.5px" }}
          />
        </div>
      </div>

      <Hr />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12.5px",
          marginBottom: "3px",
          color: "#000",
        }}
      >
        <span>
          Bill No :{" "}
          <Field
            value={bill.billNo}
            onChange={(v) => onChange("billNo", v)}
            style={{ fontSize: "12.5px", width: "82px" }}
          />
        </span>
        <span>
          Time :
          <Field
            value={bill.time}
            onChange={(v) => onChange("time", v)}
            style={{ fontSize: "12.5px", width: "52px" }}
          />
        </span>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12.5px",
          marginBottom: "8px",
        }}
      >
        <thead>
          <tr style={{ color: "#000" }}>
            {["Date", "Table", "Pax", "User"].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  fontWeight: "normal",
                  paddingRight: "16px",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Field
                value={bill.date}
                onChange={(v) => onChange("date", v)}
                style={{ width: "64px" }}
              />
            </td>
            <td>
              <Field
                value={bill.table}
                onChange={(v) => onChange("table", v)}
                style={{ width: "30px", textAlign: "center" }}
              />
            </td>
            <td>
              <Field
                value={bill.pax}
                onChange={(v) => onChange("pax", v)}
                style={{ width: "22px", textAlign: "center" }}
              />
            </td>
            <td>
              <Field
                value={bill.user}
                onChange={(v) => onChange("user", v)}
                style={{ width: "80px" }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
