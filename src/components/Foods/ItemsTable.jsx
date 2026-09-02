import { Field } from "./ReceiptControls";
import { FONT } from "./foodBillConstants";

export default function ItemsTable({
  items,
  onItemChange,
  onRemoveItem,
  onAddItem,
  textStyles = {},
  onActivate,
}) {
  return (
    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
          color: "#000",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #333",
            }}
          >
            <th
              style={{
                textAlign: "left",
                fontWeight: "bold",
                paddingBottom: "5px",
                width: "36px",
              }}
            >
              Qty
            </th>

            <th
              style={{
                textAlign: "left",
                fontWeight: "bold",
                paddingBottom: "5px",
              }}
            >
              Description
            </th>

            <th
              style={{
                textAlign: "right",
                fontWeight: "bold",
                paddingBottom: "5px",
                width: "72px",
              }}
            >
              Price
            </th>

            <th
              className="no-print"
              style={{
                width: "22px",
              }}
            />
          </tr>
        </thead>

        <tbody>
          {items.map((it) => {
            const descKey = `item:${it.id}:desc`;
            const qtyKey = `item:${it.id}:qty`;
            const priceKey = `item:${it.id}:price`;

            return (
              <tr key={it.id}>
                <td style={{ paddingTop: "3px" }}>
                  <Field
                    type="number"
                    min="0"
                    step="1"
                    fieldKey={qtyKey}
                    value={it.qty}
                    onActivate={onActivate}
                    textStyle={textStyles[qtyKey]}
                    onChange={(v) =>
                      onItemChange(it.id, "qty", Math.max(0, Math.round(v)))
                    }
                    style={{
                      width: "32px",
                      textAlign: "center",
                    }}
                  />
                </td>

                <td style={{ paddingTop: "3px" }}>
                  <Field
                    fieldKey={descKey}
                    value={it.desc}
                    onActivate={onActivate}
                    textStyle={textStyles[descKey]}
                    onChange={(v) =>
                      onItemChange(it.id, "desc", v.toUpperCase())
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </td>

                <td
                  style={{
                    paddingTop: "3px",
                    textAlign: "right",
                  }}
                >
                  <Field
                    type="number"
                    min="0"
                    step="1"
                    fieldKey={priceKey}
                    value={it.price}
                    onActivate={onActivate}
                    textStyle={textStyles[priceKey]}
                    onChange={(v) =>
                      onItemChange(it.id, "price", parseFloat(v) || 0)
                    }
                    style={{
                      width: "68px",
                      textAlign: "right",
                    }}
                  />
                </td>

                <td
                  className="no-print"
                  style={{
                    paddingTop: "3px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onRemoveItem(it.id)}
                    title="Remove"
                    style={{
                      border: "none",
                      background: "none",
                      color: "#cc2200",
                      cursor: "pointer",
                      fontSize: "17px",
                      lineHeight: 1,
                      padding: "0 0 0 4px",
                      opacity: 0.6,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = 0.6)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        type="button"
        className="no-print"
        onClick={onAddItem}
        style={{
          width: "100%",
          marginTop: "7px",
          border: "1px dashed #bbb",
          background: "transparent",
          color: "#bbb",
          fontFamily: FONT,
          fontSize: "12px",
          padding: "4px",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "#666";
          e.currentTarget.style.borderColor = "#888";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "#bbb";
          e.currentTarget.style.borderColor = "#bbb";
        }}
      >
        + Add Item
      </button>
    </>
  );
}
