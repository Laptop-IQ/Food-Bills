import { Field, Hr } from "./ReceiptControls";
import { FONT } from "./foodBillConstants";

const hasValue = (value) => String(value ?? "").trim() !== "";

export default function ReceiptHeader({
  bill,
  onChange,
  textStyles = {},
  onActivate,
}) {
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

  const styleFor = (key, fallback) => ({
    ...fallback,
    ...(textStyles[key] || {}),
    fontFamily: textStyles[key]?.fontFamily || FONT,
  });

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
            fieldKey="name"
            value={bill.name}
            onChange={(v) => onChange("name", v)}
            onActivate={onActivate}
            textStyle={textStyles.name}
            style={styleFor("name", {
              width: "100%",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              letterSpacing: "1.5px",
            })}
          />
        )}

        {hasAddr1 && (
          <Field
            fieldKey="addr1"
            value={bill.addr1}
            onChange={(v) => onChange("addr1", v)}
            onActivate={onActivate}
            textStyle={textStyles.addr1}
            style={styleFor("addr1", {
              width: "100%",
              textAlign: "center",
              fontSize: "12.5px",
            })}
          />
        )}

        {hasAddr2 && (
          <Field
            fieldKey="addr2"
            value={bill.addr2}
            onChange={(v) => onChange("addr2", v)}
            onActivate={onActivate}
            textStyle={textStyles.addr2}
            style={styleFor("addr2", {
              width: "100%",
              textAlign: "center",
              fontSize: "12.5px",
            })}
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
              fieldKey="gstin"
              value={bill.gstin}
              onChange={(v) => onChange("gstin", v)}
              onActivate={onActivate}
              textStyle={textStyles.gstin}
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
              fieldKey="phone"
              value={bill.phone}
              onChange={(v) => onChange("phone", v)}
              onActivate={onActivate}
              textStyle={textStyles.phone}
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
                fieldKey="billNo"
                value={bill.billNo}
                onChange={(v) => onChange("billNo", v)}
                onActivate={onActivate}
                textStyle={textStyles.billNo}
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
                fieldKey="time"
                value={bill.time}
                onChange={(v) => onChange("time", v)}
                onActivate={onActivate}
                textStyle={textStyles.time}
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
                    fieldKey="date"
                    value={bill.date}
                    onChange={(v) => onChange("date", v)}
                    onActivate={onActivate}
                    textStyle={textStyles.date}
                    style={{
                      width: "64px",
                    }}
                  />
                </td>
              )}

              {hasTable && (
                <td>
                  <Field
                    fieldKey="table"
                    value={bill.table}
                    onChange={(v) => onChange("table", v)}
                    onActivate={onActivate}
                    textStyle={textStyles.table}
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
                    fieldKey="pax"
                    value={bill.pax}
                    onChange={(v) => onChange("pax", v)}
                    onActivate={onActivate}
                    textStyle={textStyles.pax}
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
                    fieldKey="user"
                    value={bill.user}
                    onChange={(v) => onChange("user", v)}
                    onActivate={onActivate}
                    textStyle={textStyles.user}
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
