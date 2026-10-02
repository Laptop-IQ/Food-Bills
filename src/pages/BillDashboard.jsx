import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronDown,
  IndianRupee,
  ReceiptText,
  Search,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { loadBillingState } from "../components/api/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const parseDate = (saved) => {
  const raw = saved?.bill?.date;
  if (raw) {
    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;

    const match = String(raw).match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
    if (match) {
      const parsed = new Date(`${match[1]} ${match[2]} ${match[3]}`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }

  if (saved?.createdAt) {
    const created = new Date(saved.createdAt);
    if (!Number.isNaN(created.getTime())) return created;
  }

  return null;
};

const amountOf = (saved) =>
  Number(saved?.grandTotal ?? saved?.bill?.grandTotal ?? 0) || 0;

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const dateLabel = (saved) => {
  const date = parseDate(saved);
  return date
    ? date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : saved?.bill?.date || "—";
};

export default function BillDashboard() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [bills, setBills] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("all");
  const [query, setQuery] = useState("");

  const refresh = () => setBills(loadBillingState().bills || []);

  useEffect(() => {
    refresh();
    window.addEventListener("thermal-bills-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("thermal-bills-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const years = useMemo(() => {
    const values = bills
      .map(parseDate)
      .filter(Boolean)
      .map((date) => date.getFullYear());
    return [...new Set([currentYear, ...values])].sort((a, b) => b - a);
  }, [bills, currentYear]);

  const yearBills = useMemo(
    () => bills.filter((saved) => parseDate(saved)?.getFullYear() === Number(year)),
    [bills, year],
  );

  const monthBills = useMemo(
    () => yearBills.filter((saved) => month === "all" || parseDate(saved)?.getMonth() === Number(month)),
    [yearBills, month],
  );

  const filteredBills = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return monthBills;
    return monthBills.filter((saved) => {
      const billNo = String(saved?.bill?.billNo || "").toLowerCase();
      const title = String(saved?.bill?.title || "").toLowerCase();
      const phone = String(saved?.bill?.phone || "").toLowerCase();
      return billNo.includes(needle) || title.includes(needle) || phone.includes(needle);
    });
  }, [monthBills, query]);

  const monthly = useMemo(
    () => MONTHS.map((name, index) => {
      const list = yearBills.filter((saved) => parseDate(saved)?.getMonth() === index);
      return {
        month: name,
        short: name.slice(0, 3),
        index,
        count: list.length,
        total: list.reduce((sum, saved) => sum + amountOf(saved), 0),
      };
    }),
    [yearBills],
  );

  const yearTotal = yearBills.reduce((sum, saved) => sum + amountOf(saved), 0);
  const selectedTotal = monthBills.reduce((sum, saved) => sum + amountOf(saved), 0);
  const average = monthBills.length ? selectedTotal / monthBills.length : 0;
  const maxMonthly = Math.max(...monthly.map((item) => item.total), 1);

  const selectedLabel = month === "all" ? `All months · ${year}` : `${MONTHS[Number(month)]} ${year}`;

  const setCurrentPeriod = () => {
    setYear(currentYear);
    setMonth(String(currentMonth));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070811] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-240px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-violet-600/[0.10] blur-[120px]" />
        <div className="absolute bottom-[-220px] left-[12%] h-[420px] w-[520px] rounded-full bg-cyan-500/[0.055] blur-[120px]" />
        <div className="absolute right-[8%] top-[34%] h-[340px] w-[340px] rounded-full bg-emerald-500/[0.035] blur-[110px]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1320px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Premium centered hero */}
        <header className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.035] shadow-[0_30px_100px_rgba(0,0,0,.34)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
          <Link
            to="/"
            aria-label="Back to Bills"
            className="absolute left-4 top-4 z-20 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.10] bg-black/[0.22] px-3.5 text-xs font-extrabold text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,.20)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-violet-400/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 sm:left-6 sm:top-6 sm:h-11 sm:px-4 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Bills</span>
          </Link>
          <div className="absolute left-1/2 top-0 h-32 w-80 -translate-x-1/2 rounded-full bg-violet-500/[0.09] blur-3xl" />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-9 text-center sm:px-8 sm:py-11 lg:py-12">
           
            <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-[54px]">
              Total Bills Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Month-wise bill count and total billing amount — designed for fast, clear business reporting.
            </p>

            {/* One-line premium control dock */}
            <div className="mt-7 w-full rounded-2xl border border-white/[0.08] bg-black/[0.16] p-2 shadow-[0_18px_50px_rgba(0,0,0,.22)] backdrop-blur-xl">
              <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={setCurrentPeriod}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 text-sm font-extrabold text-white shadow-[0_10px_34px_rgba(99,74,220,.30)] transition hover:-translate-y-0.5 hover:from-violet-400 hover:to-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70"
                >
                  <CalendarDays className="h-4 w-4" />
                  This month
                </button>

                <FilterSelect label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((item) => <option key={item} value={item}>{item}</option>)}
                </FilterSelect>

                <FilterSelect label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="all">All months</option>
                  {MONTHS.map((item, index) => <option key={item} value={index}>{item}</option>)}
                </FilterSelect>

                <div className="inline-flex h-11 min-w-[210px] shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-300/[0.10] bg-violet-300/[0.035] px-4 text-xs text-slate-500 shadow-inner">
                  <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                  <span>Viewing</span>
                  <strong className="text-slate-200">{selectedLabel}</strong>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* KPI cards */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={ReceiptText} label="Total Bills" value={monthBills.length.toLocaleString("en-IN")} hint={selectedLabel} tone="violet" />
          <StatCard icon={IndianRupee} label="Total Amount" value={money(selectedTotal)} hint={selectedLabel} tone="emerald" />
          <StatCard icon={WalletCards} label="Average Bill" value={money(average)} hint="Average value per bill" tone="amber" />
          <StatCard icon={TrendingUp} label={`${year} Billing`} value={money(yearTotal)} hint={`${yearBills.length.toLocaleString("en-IN")} bills in ${year}`} tone="blue" />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.65fr)]">
          <section className="rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_20px_70px_rgba(0,0,0,.20)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-[-0.025em] text-white">Monthly performance</h2>
                  <span className="rounded-full border border-violet-300/10 bg-violet-300/[0.06] px-2 py-0.5 text-[9px] font-black text-violet-300">{month === "all" ? "12 MONTHS" : "SELECTED MONTH"}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{month === "all" ? "All months are visible. Select a month to filter your saved bills." : `Showing only ${MONTHS[Number(month)]} ${year}.`}</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{year}</span>
            </div>

            <div className="mt-6">
              {month === "all" ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {monthly.map((row) => (
                    <MonthCard key={row.month} row={row} active={false} onClick={() => setMonth(String(row.index))} maxMonthly={maxMonthly} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
                  <MonthCard row={monthly[Number(month)]} active onClick={() => setMonth(String(month))} maxMonthly={maxMonthly} large />
                  <div className="rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-400/[0.08] to-cyan-300/[0.03] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">Selected month</p>
                        <h3 className="mt-1 text-lg font-black text-white">{MONTHS[Number(month)]} {year}</h3>
                      </div>
                      <span className="rounded-xl border border-white/[0.07] bg-black/[0.15] px-3 py-2 text-xs font-black text-slate-300">{monthly[Number(month)]?.count || 0} bills</span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/[0.06] bg-black/[0.15] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">Bills</p>
                        <p className="mt-2 text-2xl font-black text-white">{monthly[Number(month)]?.count || 0}</p>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-black/[0.15] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">Billing</p>
                        <p className="mt-2 truncate text-2xl font-black text-emerald-300">{money(monthly[Number(month)]?.total || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <BillingChart monthly={month === "all" ? monthly : [monthly[Number(month)]].filter(Boolean)} maxMonthly={maxMonthly} selectedMonth={month} />
          </section>

          <section className="rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_20px_70px_rgba(0,0,0,.20)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.06] text-emerald-300">
                <TrendingUp className="h-[19px] w-[19px]" />
              </span>
              <div>
                <h2 className="text-xl font-black tracking-[-0.025em] text-white">Quick overview</h2>
                <p className="text-xs text-slate-500">At-a-glance billing summary</p>
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              <OverviewRow label="Bills in selected period" value={monthBills.length.toLocaleString("en-IN")} />
              <OverviewRow label="Selected billing" value={money(selectedTotal)} strong />
              <OverviewRow label="Average bill value" value={money(average)} />
              <OverviewRow label={`${year} total bills`} value={yearBills.length.toLocaleString("en-IN")} />
              <OverviewRow label={`${year} billing`} value={money(yearTotal)} strong />
            </div>
          </section>
        </div>

        {/* Bills table */}
        <section className="mt-5 overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,.20)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-[-0.025em] text-white">Saved bills</h2>
                <span className="rounded-full border border-violet-300/10 bg-violet-300/[0.06] px-2.5 py-1 text-[10px] font-black text-violet-300">{filteredBills.length}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">Bill history for {selectedLabel}.</p>
            </div>
            <label className="relative block w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bill no., restaurant or phone"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/15 pl-10 pr-3.5 text-sm font-medium text-slate-100 outline-none placeholder:text-slate-600 transition focus:border-violet-400/45 focus:ring-2 focus:ring-violet-500/15"
              />
            </label>
          </div>

          {filteredBills.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-slate-500">
                <ReceiptText className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-sm font-black text-slate-300">No bills found</h3>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-600">Try another month/year or clear the search to see saved bills.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-black/15 text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Bill No.</th>
                    <th className="px-5 py-4">Restaurant</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {[...filteredBills].sort((a, b) => (parseDate(b)?.getTime() || 0) - (parseDate(a)?.getTime() || 0)).map((saved) => (
                    <tr key={saved.id} className="transition hover:bg-white/[0.025]">
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-slate-400">{dateLabel(saved)}</td>
                      <td className="px-5 py-4 font-mono text-xs font-black text-slate-200">{saved.bill?.billNo || "—"}</td>
                      <td className="max-w-[300px] truncate px-5 py-4 text-xs font-semibold text-slate-300">{saved.bill?.title || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[9px] font-black tracking-[0.08em] ring-1 ring-inset",
                          saved.bill?.paid ? "bg-emerald-400/[0.08] text-emerald-300 ring-emerald-300/15" : "bg-amber-400/[0.08] text-amber-300 ring-amber-300/15",
                        ].join(" ")}>{saved.bill?.paid ? "PAID" : "UNPAID"}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-mono text-sm font-black text-emerald-300">{money(amountOf(saved))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="py-7 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
          Bill-Hub · Billing analytics
        </footer>
      </main>
    </div>
  );
}

function MonthCard({ row, active, onClick, maxMonthly, large = false }) {
  const barHeight = row.total > 0 ? Math.max(12, (row.total / maxMonthly) * 100) : 4;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group rounded-2xl border text-left transition duration-200 hover:-translate-y-0.5",
        large ? "p-5" : "p-3",
        active
          ? "border-violet-300/30 bg-violet-400/[0.09] shadow-[0_12px_34px_rgba(124,92,255,.13)]"
          : "border-white/[0.06] bg-black/[0.12] hover:border-white/[0.13] hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={active ? "text-xs font-black text-violet-200" : "text-xs font-black text-slate-300"}>{large ? row.month : row.short}</span>
        <span className="rounded-md bg-white/[0.045] px-1.5 py-0.5 text-[9px] font-black text-slate-500">{row.count}</span>
      </div>
      <div className={`mt-3 flex ${large ? "h-32" : "h-20"} items-end overflow-hidden rounded-xl border border-white/[0.04] bg-black/15 px-1.5 pt-2`}>
        <div
          className={active ? "w-full rounded-lg bg-gradient-to-t from-violet-600 to-fuchsia-300 shadow-[0_0_18px_rgba(167,139,250,.25)]" : "w-full rounded-lg bg-gradient-to-t from-violet-700/70 to-cyan-300/70 group-hover:from-violet-500 group-hover:to-cyan-300"}
          style={{ height: `${barHeight}%` }}
        />
      </div>
      <p className={`${large ? "mt-4 text-xl" : "mt-3 text-[11px]"} truncate font-extrabold text-slate-200`}>{money(row.total)}</p>
      <p className="mt-0.5 text-[10px] font-medium text-slate-600">{row.count} bills</p>
    </button>
  );
}

function BillingChart({ monthly, maxMonthly, selectedMonth }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/[0.13] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-300" />
            <h3 className="text-sm font-black text-white">Billing trend</h3>
          </div>
          <p className="mt-1 text-[10px] text-slate-600">{selectedMonth === "all" ? "Monthly billing amount across the selected year." : "Billing amount for the selected month."}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">₹ Amount</span>
      </div>
      <div className="mt-5 flex h-44 items-end gap-2 sm:gap-3">
        {monthly.map((row) => {
          const height = row.total > 0 ? Math.max(8, (row.total / maxMonthly) * 100) : 4;
          return (
            <div key={`${row.month}-${row.index}`} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <span className="max-w-full truncate text-[9px] font-bold text-slate-600 opacity-0 transition group-hover:opacity-100">{money(row.total)}</span>
              <div className="flex h-32 w-full items-end rounded-xl bg-white/[0.025] px-1.5">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-violet-700 via-violet-500 to-cyan-300 shadow-[0_0_22px_rgba(124,92,255,.16)] transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-300"
                  style={{ height: `${height}%` }}
                  title={`${row.month}: ${money(row.total)}`}
                />
              </div>
              <span className="text-[9px] font-black text-slate-600">{row.short}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="w-[180px] shrink-0">
      <span className="sr-only">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={onChange}
          className="h-12 w-full appearance-none rounded-xl border border-white/[0.09] bg-black/20 px-4 pr-10 text-sm font-bold text-slate-100 outline-none transition hover:border-white/[0.14] focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/15"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </span>
    </label>
  );
}

const TONES = {
  violet: { icon: "bg-violet-400/[0.08] text-violet-300 ring-violet-300/10", value: "text-white" },
  emerald: { icon: "bg-emerald-400/[0.08] text-emerald-300 ring-emerald-300/10", value: "text-emerald-300" },
  amber: { icon: "bg-amber-400/[0.08] text-amber-300 ring-amber-300/10", value: "text-white" },
  blue: { icon: "bg-sky-400/[0.08] text-sky-300 ring-sky-300/10", value: "text-sky-300" },
};

function StatCard({ icon: Icon, label, value, hint, tone = "violet" }) {
  const colors = TONES[tone];
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/[0.13] sm:p-5">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-2xl transition group-hover:bg-violet-400/[0.06]" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">{label}</p>
          <p className={`mt-2 truncate text-[27px] font-black tracking-[-0.04em] ${colors.value}`}>{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${colors.icon}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
      <p className="relative mt-3 truncate text-[11px] font-medium text-slate-600">{hint}</p>
    </article>
  );
}

function OverviewRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-black/[0.13] px-3.5 py-3.5 transition hover:border-white/[0.09] hover:bg-white/[0.025]">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <strong className={`whitespace-nowrap text-sm font-black ${strong ? "text-emerald-300" : "text-slate-200"}`}>{value}</strong>
    </div>
  );
}
