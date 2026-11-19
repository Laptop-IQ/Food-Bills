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
    <section className="saved-bills no-print mt-10" aria-label="Saved bills">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Saved bills
            {bills.length > 0 && (
              <span className="ml-2 rounded-sm bg-neutral-bg px-1.5 py-0.5 font-sans text-xs font-medium text-slate-muted">
                {bills.length}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-sm text-slate-muted">
            Your saved billing history.
          </p>
        </div>

        {bills.length > 0 && (
          <div className="relative w-full sm:w-80">
            <i
              aria-hidden="true"
              className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] leading-none text-slate-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bill no, customer, table"
              aria-label="Search saved bills"
              className="h-10 w-full rounded-md border border-line bg-white pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
            />
          </div>
        )}
      </div>

      {bills.length === 0 && (
        <div className="rounded-md border border-dashed border-line bg-white px-6 py-12 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-forest-50 text-forest-700">
            <i
              aria-hidden="true"
              className="ri-file-list-3-line text-[22px] leading-none"
            />
          </span>
          <h3 className="font-display text-base font-semibold tracking-tight">
            No saved bills yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-muted">
            Create a bill and choose Save bill. Your billing history will appear
            here.
          </p>
        </div>
      )}

      {bills.length > 0 && filteredBills.length === 0 && (
        <div className="rounded-md border border-line bg-white px-6 py-10 text-center text-sm">
          No bills match <strong>“{search}”</strong>.
        </div>
      )}

      {filteredBills.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-white">
          {filteredBills.map((saved) => {
            const bill = saved.bill || {};
            const billItems = Array.isArray(saved.items) ? saved.items : [];
            const totalItems = billItems.filter(
              (item) => String(item?.desc ?? "").trim() !== "",
            ).length;
            const updatedAt = saved.updatedAt || saved.createdAt;
            const meta = [
              `${totalItems} ${totalItems === 1 ? "item" : "items"}`,
              bill.pax ? `Pax ${bill.pax}` : null,
              bill.user ? `User ${bill.user}` : null,
            ].filter(Boolean);

            return (
              <li
                key={saved.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors duration-150 hover:bg-ivory sm:px-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-mono text-[14px] font-semibold">
                      #{bill.billNo || "—"}
                    </span>
                    {bill.table && (
                      <span className="rounded-sm bg-neutral-bg px-1.5 py-0.5 text-[11px] font-medium text-slate-muted">
                        Table {bill.table}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-slate-muted">
                    {bill.name || "Unnamed customer"}
                  </p>
                </div>

                <div className="order-3 col-span-2 min-w-0 text-[13px] text-slate-muted md:order-none md:col-span-1">
                  <p>
                    {formatDate(updatedAt)}
                    {formatTime(updatedAt) && (
                      <span className="ml-2 text-xs">
                        {formatTime(updatedAt)}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs">{meta.join(" · ")}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenBill(saved)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-[13px] font-medium transition-colors duration-150 hover:bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50"
                  >
                    <i
                      aria-hidden="true"
                      className="ri-arrow-right-up-line text-[16px] leading-none"
                    />{" "}
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(saved.id)}
                    disabled={deletingId === saved.id}
                    aria-label={`Delete bill ${bill.billNo || ""}`}
                    title="Delete"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-slate-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50 disabled:opacity-45"
                  >
                    <i
                      aria-hidden="true"
                      className="ri-delete-bin-6-line text-[18px] leading-none"
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
