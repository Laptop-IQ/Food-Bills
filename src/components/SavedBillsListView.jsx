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
  const t = {
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
  const iconBtn = `flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150 ${FOCUS} ${t.muted} hover:bg-neutral-bg hover:text-ink`;
  const openDashboard = () => (onOpenDashboard ? onOpenDashboard() : navigate("/bill-dashboard"));
  const viewBill = (saved) => {
    startEditBill(saved);
    setTimeout(() => setView(VIEW.PREVIEW), 50);
  };

  return (
    <div className={`min-h-screen ${t.page}`}>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Utility bar */}
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-500">
            <Ri name="receipt-line" className="text-[16px]" /> Thermal bills
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onOpenTemplates} aria-label="Templates" title="Templates" className={`${btn} border ${t.ghost} !px-3 sm:!px-3.5`}>
              <Ri name="bookmark-3-line" className="text-[18px]" /> <span className="hidden sm:inline">Templates</span>
            </button>
            <button type="button" onClick={openDashboard} aria-label="Dashboard" title="Dashboard" className={`${btn} border ${t.ghost} !px-3 sm:!px-3.5`}>
              <Ri name="bar-chart-2-line" className="text-[18px]" /> <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>

        {/* Hero */}
        <section aria-labelledby="home-hero-title" className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-stretch lg:gap-12">
          <div className="flex min-w-0 flex-col justify-center">
            <h1 id="home-hero-title" className="font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
              Thermal bills,<span className="block text-forest-700">ready to print.</span>
            </h1>
            <p className={`mt-4 max-w-md text-[15px] leading-6 ${t.muted}`}>
              Create a receipt, save it, and reuse it as a template whenever the next one comes along.
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={startNewBill} className={`${btn} h-11 bg-forest-700 text-ivory hover:bg-forest-800`}>
                <Ri name="add-line" className="text-[18px]" /> New bill
              </button>
              <button type="button" onClick={onOpenTemplates} className={`${btn} h-11 border ${t.ghost}`}>
                <Ri name="bookmark-3-line" className="text-[18px]" /> Start from a template
              </button>
            </div>
            <p className={`mt-5 text-[12.5px] ${t.muted}`}>
              {loading
                ? "Loading your bills…"
                : totalBills === 0
                  ? "Nothing saved yet. Your first bill will appear below."
                  : `${totalBills} ${totalBills === 1 ? "bill" : "bills"} saved on this device`}
            </p>
          </div>

          {/* Ledger panel: real totals only */}
          <aside
            aria-label="Billing summary"
            className="flex flex-col justify-between rounded-xl border p-6 sm:p-7 border-forest-800 bg-forest-800 text-ivory"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ivory/60">Total billed</p>
              {loading ? (
                <div className="mt-3 h-10 w-44 animate-pulse rounded bg-white/10" aria-busy="true" />
              ) : (
                <p className="mt-2 truncate font-display text-[38px] font-semibold tabular-nums leading-none tracking-tight sm:text-[46px]">
                  ₹{formatCurrency(totalAmount.toFixed(0))}
                </p>
              )}
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t pt-5 border-ivory/15">
              {[
                ["Bills", totalBills],
                ["Average", `₹${formatCurrency(average.toFixed(0))}`],
                ["Unpaid", unpaid],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="truncate text-[11px] font-medium uppercase tracking-[0.1em] text-ivory/60">{k}</dt>
                  <dd className="mt-1 truncate font-display text-lg font-semibold tabular-nums sm:text-xl">{loading ? "–" : v}</dd>
                </div>
              ))}
            </dl>

            {!loading && bills[0] && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-md px-3.5 py-3 text-[13px] bg-white/[0.07]">
                <span className="min-w-0 truncate">
                  <span className="text-ivory/60">Latest </span>
                  <span className="font-mono font-semibold">{bills[0].bill?.billNo || "—"}</span>
                </span>
                <span className="shrink-0 font-display font-semibold tabular-nums">₹{formatCurrency(bills[0].grandTotal)}</span>
              </div>
            )}
          </aside>
        </section>

        <h2 className="mt-14 font-display text-[18px] font-semibold tracking-tight sm:mt-16">Saved bills</h2>

        {/* Search */}
        {!loading && totalBills > 0 && (
          <div className="mt-4 flex items-center justify-between gap-4">
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
                  <div className="h-4 w-44 animate-pulse rounded bg-neutral-bg" />
                  <div className="h-3 w-28 animate-pulse rounded bg-neutral-bg" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded bg-neutral-bg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && totalBills === 0 && (
          <div className={`mt-8 rounded-md border border-dashed ${t.card} px-6 py-16 text-center`}>
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-forest-50 text-forest-700">
              <Ri name="file-list-3-line" className="text-[22px]" />
            </span>
            <h2 className="font-display text-lg font-semibold tracking-tight">No saved bills yet</h2>
            <p className={`mx-auto mt-1.5 max-w-sm text-sm ${t.muted}`}>
              Use New bill above to create your first one. Everything you save appears here.
            </p>
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
