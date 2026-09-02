import { Field, Hr } from "./ReceiptControls";

const hasValue = (value) => String(value ?? "").trim() !== "";

export default function ReceiptHeader({ bill, onChange }) {
  const hasName = hasValue(bill.name);
  const hasAddr1 = hasValue(bill.addr1);
  const hasAddr2 = hasValue(bill.addr2);

  const hasGSTIN = hasValue(bill.gstin);
  const hasPhone = hasValue(bill.phone);

  const hasDate = hasValue(bill.date);
  const hasTable = hasValue(bill.table);
  const hasPax = hasValue(bill.pax);
  const hasUser = hasValue(bill.user);

  const hasBillNo = hasValue(bill.billNo);
  const hasTime = hasValue(bill.time);

  /*
   * Header data fields are rendered only when they
   * actually contain data.
   *
   * This means an empty field takes ZERO space.
   */
  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginBottom: "14px",
          color: "#000",
        }}
      >
        {hasName && (
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
        )}

        {hasAddr1 && (
          <Field
            value={bill.addr1}
            onChange={(v) => onChange("addr1", v)}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "12.5px",
            }}
          />
        )}

        {hasAddr2 && (
          <Field
            value={bill.addr2}
            onChange={(v) => onChange("addr2", v)}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "12.5px",
            }}
          />
        )}

        {hasGSTIN && (
          <div
            style={{
              fontSize: "12.5px",
              marginTop: "3px",
            }}
          >
            GSTIN:{" "}
            <Field
              value={bill.gstin}
              onChange={(v) => onChange("gstin", v)}
              style={{
                fontSize: "12.5px",
              }}
            />
          </div>
        )}

        {hasPhone && (
          <div
            style={{
              fontSize: "12.5px",
            }}
          >
            PH:{" "}
            <Field
              value={bill.phone}
              onChange={(v) => onChange("phone", v)}
              style={{
                fontSize: "12.5px",
              }}
            />
          </div>
        )}
      </div>

      {(hasBillNo || hasTime) && <Hr />}

      {(hasBillNo || hasTime) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12.5px",
            marginBottom: "3px",
            color: "#000",
          }}
        >
          {hasBillNo && (
            <span>
              Bill No :{" "}
              <Field
                value={bill.billNo}
                onChange={(v) => onChange("billNo", v)}
                style={{
                  fontSize: "12.5px",
                  width: "82px",
                }}
              />
            </span>
          )}

          {hasTime && (
            <span>
              Time :{" "}
              <Field
                value={bill.time}
                onChange={(v) => onChange("time", v)}
                style={{
                  fontSize: "12.5px",
                  width: "52px",
                }}
              />
            </span>
          )}
        </div>
      )}

      {(hasDate || hasTable || hasPax || hasUser) && (
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
              {hasDate && (
                <th
                  style={{
                    textAlign: "left",
                    fontWeight: "normal",
                    paddingRight: "16px",
                  }}
                >
                  Date
                </th>
              )}

              {hasTable && (
                <th
                  style={{
                    textAlign: "left",
                    fontWeight: "normal",
                    paddingRight: "16px",
                  }}
                >
                  Table
                </th>
              )}

              {hasPax && (
                <th
                  style={{
                    textAlign: "left",
                    fontWeight: "normal",
                    paddingRight: "16px",
                  }}
                >
                  Pax
                </th>
              )}

              {hasUser && (
                <th
                  style={{
                    textAlign: "left",
                    fontWeight: "normal",
                    paddingRight: "16px",
                  }}
                >
                  User
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              {hasDate && (
                <td>
                  <Field
                    value={bill.date}
                    onChange={(v) => onChange("date", v)}
                    style={{
                      width: "64px",
                    }}
                  />
                </td>
              )}

              {hasTable && (
                <td>
                  <Field
                    value={bill.table}
                    onChange={(v) => onChange("table", v)}
                    style={{
                      width: "30px",
                      textAlign: "center",
                    }}
                  />
                </td>
              )}

              {hasPax && (
                <td>
                  <Field
                    value={bill.pax}
                    onChange={(v) => onChange("pax", v)}
                    style={{
                      width: "22px",
                      textAlign: "center",
                    }}
                  />
                </td>
              )}

              {hasUser && (
                <td>
                  <Field
                    value={bill.user}
                    onChange={(v) => onChange("user", v)}
                    style={{
                      width: "80px",
                    }}
                  />
                </td>
              )}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}
