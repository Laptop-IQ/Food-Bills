import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VIEW } from "../layout/constants";

const Ri = ({ name, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name} leading-none ${className}`} />
);

const formatCurrency = (n) => Number(n || 0).toLocaleString("en-IN");
const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";

const sortKey = (s) => new Date(s.updatedAt || s.createdAt || 0).getTime() || Number(s.id) || 0;

export default function SavedBillsListView({
  darkMode,
  toggleDarkMode,
  startNewBill,
  loading,
  savedBills,
  startEditBill,
  setView,
  deleteSavedBill,
  onOpenTemplates,
  onOpenDashboard,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const bills = useMemo(() => [...savedBills].sort((a, b) => sortKey(b) - sortKey(a)), [savedBills]);
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  const average = totalBills ? totalAmount / totalBills : 0;
  const unpaid = bills.filter((s) => !s.bill?.paid).length;

  const term = searchTerm.trim().toLowerCase();
  const filtered = term
    ? bills.filter((s) =>
        [s.bill?.billNo, s.bill?.table, s.bill?.dine].some((v) => String(v ?? "").toLowerCase().includes(term)),
      )
    : bills;

  // Theme-aware class sets (light = ivory/forest, dark = neutral)
  const t = darkMode
    ? {
        page: "bg-neutral-900 text-neutral-100",
        card: "bg-neutral-800 border-neutral-700",
        line: "divide-neutral-700 border-neutral-700",
        muted: "text-neutral-400",
        ghost: "border-neutral-700 text-neutral-100 hover:bg-neutral-700/60",
        input: "bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500",
        head: "bg-neutral-800/60",
        hover: "hover:bg-neutral-800",
      }
    : {
        page: "bg-ivory text-ink",
        card: "bg-white border-line",
        line: "divide-line border-line",
        muted: "text-slate-muted",
        ghost: "border-line bg-white text-ink hover:bg-neutral-bg",
        input: "bg-white border-line text-ink placeholder:text-slate-400",
        head: "bg-neutral-bg/60",
        hover: "hover:bg-ivory",
      };

  const btn = `inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3.5 text-[13px] font-medium transition-colors duration-150 ${FOCUS}`;
  const iconBtn = `flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150 ${FOCUS} ${t.muted} ${
    darkMode ? "hover:bg-neutral-700 hover:text-white" : "hover:bg-neutral-bg hover:text-ink"
  }`;
  const openDashboard = () => (onOpenDashboard ? onOpenDashboard() : navigate("/bill-dashboard"));
  const viewBill = (saved) => {
    startEditBill(saved);
    setTimeout(() => setView(VIEW.PREVIEW), 50);
  };

  return (
    <div className={`min-h-screen ${t.page}`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Page header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-500">Thermal bills</p>
            <h1 className="mt-1.5 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
              Saved bills
            </h1>
            <p className={`mt-1 text-sm ${t.muted}`}>
              {loading
                ? "Loading your bills…"
                : totalBills === 0
                  ? "Create a bill and it will be saved here."
                  : `${totalBills} ${totalBills === 1 ? "bill" : "bills"} · ₹${formatCurrency(totalAmount.toFixed(0))} billed`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={startNewBill} className={`${btn} order-first h-11 flex-1 bg-forest-700 text-ivory hover:bg-forest-800 sm:order-last sm:h-10 sm:flex-none`}>
              <Ri name="add-line" className="text-[18px]" /> New bill
            </button>
            <button type="button" onClick={onOpenTemplates} aria-label="Templates" title="Templates" className={`${btn} border ${t.ghost} !px-3 sm:!px-3.5`}>
              <Ri name="bookmark-3-line" className="text-[18px]" /> <span className="hidden sm:inline">Templates</span>
            </button>
            <button type="button" onClick={openDashboard} aria-label="Dashboard" title="Dashboard" className={`${btn} border ${t.ghost} !px-3 sm:!px-3.5`}>
              <Ri name="bar-chart-2-line" className="text-[18px]" /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              title={darkMode ? "Light theme" : "Dark theme"}
              className={`${btn} w-10 !px-0 border ${t.ghost}`}
            >
              <Ri name={darkMode ? "sun-line" : "moon-line"} className="text-[18px]" />
            </button>
          </div>
        </header>

        {/* Summary */}
        {!loading && totalBills > 0 && (
          <dl className={`mt-7 grid grid-cols-3 overflow-hidden rounded-md border ${t.card} divide-x ${t.line}`}>
            {[
              ["Billed", `₹${formatCurrency(totalAmount.toFixed(0))}`],
              ["Average", `₹${formatCurrency(average.toFixed(0))}`],
              ["Unpaid", unpaid],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
                <dt className={`truncate text-[11px] font-medium uppercase tracking-[0.1em] ${t.muted}`}>{k}</dt>
                <dd className="mt-1 truncate font-display text-xl font-semibold tabular-nums tracking-tight sm:text-[26px]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Search */}
        {!loading && totalBills > 0 && (
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Ri name="search-line" className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] ${t.muted}`} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bill no, table or type"
                aria-label="Search saved bills"
                className={`h-10 w-full rounded-md border pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15 ${t.input}`}
              />
            </div>
            <p className={`hidden shrink-0 text-xs sm:block ${t.muted}`}>
              {term ? `${filtered.length} of ${totalBills}` : `${totalBills} total`}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className={`mt-8 divide-y overflow-hidden rounded-md border ${t.card} ${t.line}`} aria-busy="true" aria-label="Loading saved bills">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="space-y-2">
                  <div className={`h-4 w-44 animate-pulse rounded ${darkMode ? "bg-neutral-700" : "bg-neutral-bg"}`} />
                  <div className={`h-3 w-28 animate-pulse rounded ${darkMode ? "bg-neutral-700" : "bg-neutral-bg"}`} />
                </div>
                <div className={`h-5 w-20 animate-pulse rounded ${darkMode ? "bg-neutral-700" : "bg-neutral-bg"}`} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && totalBills === 0 && (
          <div className={`mt-8 rounded-md border border-dashed ${t.card} px-6 py-16 text-center`}>
            <span className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md ${darkMode ? "bg-neutral-700" : "bg-forest-50 text-forest-700"}`}>
              <Ri name="file-list-3-line" className="text-[22px]" />
            </span>
            <h2 className="font-display text-lg font-semibold tracking-tight">No saved bills yet</h2>
            <p className={`mx-auto mt-1.5 max-w-sm text-sm ${t.muted}`}>
              Create your first bill or start from a template. Everything you save appears here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={startNewBill} className={`${btn} bg-forest-700 text-ivory hover:bg-forest-800`}>
                <Ri name="add-line" className="text-[18px]" /> New bill
              </button>
              <button type="button" onClick={onOpenTemplates} className={`${btn} border ${t.ghost}`}>
                <Ri name="bookmark-3-line" className="text-[18px]" /> Use a template
              </button>
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && totalBills > 0 && filtered.length === 0 && (
          <div className={`mt-4 rounded-md border ${t.card} px-6 py-12 text-center`}>
            <p className="text-sm font-medium">No bills match “{searchTerm}”</p>
            <button type="button" onClick={() => setSearchTerm("")} className={`mt-2 text-[13px] font-medium text-forest-700 underline underline-offset-4 ${FOCUS}`}>
              Clear search
            </button>
          </div>
        )}

        {/* List */}
        {!loading && filtered.length > 0 && (
          <div className={`mt-4 overflow-hidden rounded-md border ${t.card}`}>
            <div
              className={`hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_110px_120px_112px] items-center gap-4 border-b px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] md:grid ${t.line} ${t.head} ${t.muted}`}
              aria-hidden="true"
            >
              <span>Bill</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
              <span />
            </div>

            <ul className={`divide-y ${t.line}`}>
              {filtered.map((saved) => {
                const b = saved.bill || {};
                const meta = [b.dine, b.table].filter(Boolean).join(" · ");
                return (
                  <li
                    key={saved.id}
                    className={`grid grid-cols-[minmax(0,1fr)_96px] items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors duration-150 sm:px-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_110px_120px_112px] ${t.hover}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[14px] font-semibold">{b.billNo || "—"}</p>
                      {meta && <p className={`mt-0.5 truncate text-xs ${t.muted}`}>{meta}</p>}
                    </div>

                    <p className={`order-3 truncate text-[13px] md:order-none ${t.muted}`}>{b.date || "—"}</p>

                    <p className={`order-4 inline-flex items-center justify-end gap-1.5 text-[12px] font-medium md:order-none md:justify-start ${b.paid ? "text-success" : "text-warning"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${b.paid ? "bg-success" : "bg-warning"}`} />
                      {b.paid ? "Paid" : "Pending"}
                    </p>

                    <p className="text-right font-display text-[17px] font-semibold tabular-nums">
                      ₹{formatCurrency(saved.grandTotal)}
                    </p>

                    <div className="order-5 col-span-2 mt-2 flex items-center justify-end gap-0.5 md:order-none md:col-span-1 md:mt-0">
                      <button type="button" onClick={() => startEditBill(saved)} aria-label={`Edit bill ${b.billNo}`} title="Edit" className={iconBtn}>
                        <Ri name="edit-2-line" className="text-[18px]" />
                      </button>
                      <button type="button" onClick={() => viewBill(saved)} aria-label={`Preview bill ${b.billNo}`} title="Preview" className={iconBtn}>
                        <Ri name="eye-line" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedBill(saved.id)}
                        aria-label={`Delete bill ${b.billNo}`}
                        title="Delete"
                        className={`${iconBtn} hover:!bg-danger/10 hover:!text-danger`}
                      >
                        <Ri name="delete-bin-6-line" className="text-[18px]" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
