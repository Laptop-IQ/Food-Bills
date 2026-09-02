import { useEffect, useMemo, useState } from "react";
import { deleteSavedBill, getSavedBills } from "./savedBillsStorage";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SavedBillsList({ onOpenBill }) {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadBills = () => {
    setBills(getSavedBills());
  };

  useEffect(() => {
    loadBills();

    const handleUpdate = () => {
      loadBills();
    };

    window.addEventListener("food-bills-updated", handleUpdate);

    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("food-bills-updated", handleUpdate);

      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredBills = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return bills;
    }

    return bills.filter((saved) => {
      const bill = saved.bill || {};

      const values = [
        bill.billNo,
        bill.name,
        bill.phone,
        bill.table,
        bill.user,
        bill.orderNo,
        bill.gstin,
        bill.date,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      );
    });
  }, [bills, search]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bill?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      deleteSavedBill(id);
      loadBills();

      window.dispatchEvent(new Event("food-bills-updated"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section
      className="saved-bills no-print"
      aria-label="Saved bills"
      style={{
        width: "100%",
        maxWidth: "520px",
        marginTop: "26px",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          HEADER
          ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#25221d",
                color: "#f4d58d",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.16)",
              }}
            >
              ▣
            </span>

            <h3
              style={{
                margin: 0,
                color: "#25221d",
                fontSize: "17px",
                fontWeight: 700,
                letterSpacing: "0.2px",
              }}
            >
              Saved Bills
            </h3>

            {bills.length > 0 && (
              <span
                style={{
                  minWidth: "22px",
                  height: "22px",
                  padding: "0 6px",
                  boxSizing: "border-box",
                  borderRadius: "11px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e8d4a4",
                  color: "#4b3b1d",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {bills.length}
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: "3px",
              marginLeft: "36px",
              color: "#8b8375",
              fontSize: "11px",
            }}
          >
            Your saved billing history
          </div>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
          ================================================= */}

      {bills.length === 0 && (
        <div
          style={{
            background: "linear-gradient(145deg, #fffdf7, #f5efe2)",
            border: "1px solid #ded5c3",
            borderRadius: "10px",
            padding: "30px 20px",
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(65, 55, 40, 0.08)",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 12px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eee5d2",
              color: "#796744",
              fontSize: "23px",
            }}
          >
            ▤
          </div>

          <div
            style={{
              color: "#39352e",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "5px",
            }}
          >
            No saved bills yet
          </div>

          <div
            style={{
              color: "#918879",
              fontSize: "11.5px",
              lineHeight: 1.5,
              maxWidth: "280px",
              margin: "0 auto",
            }}
          >
            Create a bill and tap <strong>Save Bill</strong>. Your billing
            history will appear here.
          </div>
        </div>
      )}

      {/* =================================================
          SEARCH
          ================================================= */}

      {bills.length > 0 && (
        <>
          <div
            style={{
              position: "relative",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8d8578",
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill no, customer, table..."
              aria-label="Search saved bills"
              style={{
                width: "100%",
                height: "38px",
                boxSizing: "border-box",
                padding: "0 12px 0 34px",
                border: "1px solid #d7cebe",
                borderRadius: "8px",
                background: "#fffdf8",
                color: "#27231e",
                outline: "none",
                fontSize: "12px",
                boxShadow: "0 2px 7px rgba(70,60,45,0.05)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#a58a54";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(165,138,84,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d7cebe";
                e.currentTarget.style.boxShadow =
                  "0 2px 7px rgba(70,60,45,0.05)";
              }}
            />
          </div>

          {/* =================================================
              NO SEARCH RESULTS
              ================================================= */}

          {filteredBills.length === 0 && (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#8b8375",
                fontSize: "12px",
                background: "#faf7f0",
                border: "1px dashed #d5cbb9",
                borderRadius: "9px",
              }}
            >
              No bills found for <strong>"{search}"</strong>
            </div>
          )}

          {/* =================================================
              BILL LIST
              ================================================= */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {filteredBills.map((saved) => {
              const bill = saved.bill || {};

              const billItems = Array.isArray(saved.items) ? saved.items : [];

              const totalItems = billItems.filter(
                (item) => String(item?.desc ?? "").trim() !== "",
              ).length;

              const updatedAt = saved.updatedAt || saved.createdAt;

              return (
                <article
                  key={saved.id}
                  style={{
                    background: "#fffdf8",
                    border: "1px solid #ded5c4",
                    borderRadius: "10px",
                    padding: "12px",
                    boxSizing: "border-box",
                    boxShadow: "0 3px 10px rgba(60,50,35,0.07)",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.borderColor = "#c7b58f";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(60,50,35,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#ded5c4";
                    e.currentTarget.style.boxShadow =
                      "0 3px 10px rgba(60,50,35,0.07)";
                  }}
                >
                  {/* Top */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 700,
                            color: "#29251f",
                          }}
                        >
                          Bill #{bill.billNo || "—"}
                        </span>

                        {bill.table && (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "3px 7px",
                              borderRadius: "10px",
                              background: "#f0e6d1",
                              color: "#665333",
                            }}
                          >
                            Table {bill.table}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          marginTop: "3px",
                          color: "#665f53",
                          fontSize: "11.5px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {bill.name || "Unnamed customer"}
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          color: "#746a5b",
                          fontSize: "10px",
                        }}
                      >
                        {formatDate(updatedAt)}
                      </div>

                      <div
                        style={{
                          color: "#a09788",
                          fontSize: "9.5px",
                          marginTop: "2px",
                        }}
                      >
                        {formatTime(updatedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                      paddingTop: "9px",
                      borderTop: "1px solid #eee7da",
                      color: "#7b7264",
                      fontSize: "10.5px",
                    }}
                  >
                    <span>
                      Items{" "}
                      <strong
                        style={{
                          color: "#39342c",
                        }}
                      >
                        {totalItems}
                      </strong>
                    </span>

                    {bill.pax && (
                      <span>
                        Pax{" "}
                        <strong
                          style={{
                            color: "#39342c",
                          }}
                        >
                          {bill.pax}
                        </strong>
                      </span>
                    )}

                    {bill.user && (
                      <span>
                        User{" "}
                        <strong
                          style={{
                            color: "#39342c",
                          }}
                        >
                          {bill.user}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      gap: "7px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenBill(saved)}
                      style={{
                        flex: 1,
                        height: "34px",
                        border: "1px solid #3b352c",
                        borderRadius: "6px",
                        background: "#2b2722",
                        color: "#f9f3e6",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ↗ Open Bill
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(saved.id)}
                      disabled={deletingId === saved.id}
                      aria-label={`Delete bill ${bill.billNo || ""}`}
                      style={{
                        width: "38px",
                        height: "34px",
                        border: "1px solid #dfd3c0",
                        borderRadius: "6px",
                        background: "#fffaf1",
                        color: "#a3483d",
                        fontSize: "14px",
                        cursor: deletingId === saved.id ? "wait" : "pointer",
                      }}
                    >
                      {deletingId === saved.id ? "…" : "×"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
