import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { loadBillingState } from "../components/api/api";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
    () =>
      bills.filter((saved) => parseDate(saved)?.getFullYear() === Number(year)),
    [bills, year],
  );

  const monthBills = useMemo(
    () =>
      yearBills.filter(
        (saved) =>
          month === "all" || parseDate(saved)?.getMonth() === Number(month),
      ),
    [yearBills, month],
  );

  const filteredBills = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return monthBills;
    return monthBills.filter((saved) => {
      const billNo = String(saved?.bill?.billNo || "").toLowerCase();
      const title = String(saved?.bill?.title || "").toLowerCase();
      const phone = String(saved?.bill?.phone || "").toLowerCase();
      return (
        billNo.includes(needle) ||
        title.includes(needle) ||
        phone.includes(needle)
      );
    });
  }, [monthBills, query]);

  const monthly = useMemo(
    () =>
      MONTHS.map((name, index) => {
        const list = yearBills.filter(
          (saved) => parseDate(saved)?.getMonth() === index,
        );
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
  const selectedTotal = monthBills.reduce(
    (sum, saved) => sum + amountOf(saved),
    0,
  );
  const average = monthBills.length ? selectedTotal / monthBills.length : 0;
  const maxMonthly = Math.max(...monthly.map((item) => item.total), 1);

  const selectedLabel =
    month === "all"
      ? `All months · ${year}`
      : `${MONTHS[Number(month)]} ${year}`;

  const setCurrentPeriod = () => {
    setYear(currentYear);
    setMonth(String(currentMonth));
  };

  const sortedBills = useMemo(
    () =>
      [...filteredBills].sort(
        (a, b) =>
          (parseDate(b)?.getTime() || 0) - (parseDate(a)?.getTime() || 0),
      ),
    [filteredBills],
  );
  const picked = month === "all" ? null : monthly[Number(month)];

  return (
    <div className="min-h-screen bg-ivory font-sans text-ink">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className={`mb-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-[13px] font-medium transition-colors duration-150 hover:bg-neutral-bg ${FOCUS}`}
            >
              <Ri name="arrow-left-line" className="text-[16px]" /> Bills
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-500">
              Billing analytics
            </p>
            <h1 className="mt-1.5 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">
              Bills dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-muted">
              Month-wise bill count and billing amount.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={setCurrentPeriod}
              className={`col-span-2 inline-flex h-10 items-center justify-center gap-2 sm:col-span-1 rounded-md bg-forest-700 px-3.5 text-[13px] font-medium text-ivory transition-colors duration-150 hover:bg-forest-800 ${FOCUS}`}
            >
              <Ri name="calendar-line" className="text-[18px]" /> This month
            </button>
            <FilterSelect
              label="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="all">All months</option>
              {MONTHS.map((item, index) => (
                <option key={item} value={index}>
                  {item}
                </option>
              ))}
            </FilterSelect>
          </div>
        </header>

        {/* KPIs */}
        <section
          aria-label="Summary"
          className="mt-7 grid grid-cols-2 overflow-hidden rounded-md border border-line bg-white lg:grid-cols-4"
        >
          {[
            [
              "Total bills",
              monthBills.length.toLocaleString("en-IN"),
              selectedLabel,
            ],
            ["Total amount", money(selectedTotal), selectedLabel],
            ["Average bill", money(average), "Per bill in this period"],
            [
              `${year} billing`,
              money(yearTotal),
              `${yearBills.length.toLocaleString("en-IN")} bills in ${year}`,
            ],
          ].map(([label, value, hint], i) => (
            <div
              key={label}
              className={`min-w-0 px-4 py-4 sm:px-6 sm:py-5 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
            >
              <p className="truncate text-[11px] font-medium uppercase tracking-[0.1em] text-slate-muted">
                {label}
              </p>
              <p className="mt-1.5 truncate font-display text-[22px] font-semibold tabular-nums tracking-tight sm:text-[28px]">
                {value}
              </p>
              <p className="mt-1 truncate text-xs text-slate-muted">{hint}</p>
            </div>
          ))}
        </section>

        {/* Monthly chart */}
        <section className="mt-5 rounded-md border border-line bg-white">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight">
                Monthly billing · {year}
              </h2>
              <p className="mt-0.5 text-xs text-slate-muted">
                {picked
                  ? `Showing ${picked.month}. Select it again to see all months.`
                  : "Select a month to filter the bills below."}
              </p>
            </div>
            {picked && (
              <button
                type="button"
                onClick={() => setMonth("all")}
                className={`inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-[13px] font-medium transition-colors duration-150 hover:bg-neutral-bg ${FOCUS}`}
              >
                <Ri name="close-line" className="text-[16px]" /> All months
              </button>
            )}
          </div>

          <div className="px-4 pb-4 pt-6 sm:px-6">
            <div
              className="flex h-52 items-end gap-1.5 border-b border-line sm:gap-3"
              role="group"
              aria-label="Billing by month"
            >
              {monthly.map((row) => {
                const height =
                  row.total > 0
                    ? Math.max(4, (row.total / maxMonthly) * 100)
                    : 0;
                const active = month !== "all" && Number(month) === row.index;
                const dim = month !== "all" && !active;
                return (
                  <button
                    key={row.month}
                    type="button"
                    onClick={() => setMonth(active ? "all" : String(row.index))}
                    aria-pressed={active}
                    aria-label={`${row.month}: ${row.count} bills, ${money(row.total)}`}
                    title={`${row.month}: ${money(row.total)} · ${row.count} bills`}
                    className={`group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5 rounded-t-md ${FOCUS}`}
                  >
                    <span className="max-w-full truncate text-[10px] font-medium tabular-nums text-slate-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {row.total > 0 ? money(row.total) : ""}
                    </span>
                    <span
                      className={`w-full max-w-[44px] rounded-t-md transition-all duration-200 ${active ? "bg-gold-500" : "bg-forest-700 group-hover:bg-forest-800"} ${dim ? "opacity-30" : ""} ${height === 0 ? "bg-line" : ""}`}
                      style={{ height: height === 0 ? "2px" : `${height}%` }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-3">
              {monthly.map((row) => (
                <span
                  key={row.month}
                  className={`min-w-0 flex-1 text-center text-[11px] font-medium ${month !== "all" && Number(month) === row.index ? "text-ink" : "text-slate-muted"}`}
                >
                  {row.short}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bills */}
        <section className="mt-5 overflow-hidden rounded-md border border-line bg-white">
          <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold tracking-tight">
                Saved bills{" "}
                <span className="ml-1 rounded-sm bg-neutral-bg px-1.5 py-0.5 font-sans text-xs font-medium text-slate-muted">
                  {sortedBills.length}
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-muted">
                Bill history for {selectedLabel}.
              </p>
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Ri
                name="search-line"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bill no., restaurant or phone"
                aria-label="Search bills"
                className="h-10 w-full rounded-md border border-line bg-white pl-10 pr-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
              />
            </div>
          </div>

          {sortedBills.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                <Ri name="file-list-3-line" className="text-[22px]" />
              </span>
              <h3 className="text-sm font-semibold">No bills found</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-muted">
                Try another month or year, or clear the search.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-neutral-bg/60 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Bill no.
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Restaurant
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Payment
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {sortedBills.map((saved) => (
                      <tr
                        key={saved.id}
                        className="transition-colors duration-150 hover:bg-ivory"
                      >
                        <td className="whitespace-nowrap px-6 py-3.5 text-[13px] text-slate-muted">
                          {dateLabel(saved)}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[13px] font-medium">
                          {saved.bill?.billNo || "—"}
                        </td>
                        <td className="max-w-[260px] truncate px-6 py-3.5 text-[13px]">
                          {saved.bill?.title || "—"}
                        </td>
                        <td className="px-6 py-3.5">
                          <PayStatus paid={saved.bill?.paid} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-3.5 text-right font-display text-[15px] font-semibold tabular-nums">
                          {money(amountOf(saved))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-line md:hidden">
                {sortedBills.map((saved) => (
                  <li
                    key={saved.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-4 py-3.5"
                  >
                    <p className="truncate font-mono text-[13px] font-medium">
                      {saved.bill?.billNo || "—"}
                    </p>
                    <p className="text-right font-display text-[15px] font-semibold tabular-nums">
                      {money(amountOf(saved))}
                    </p>
                    <p className="truncate text-xs text-slate-muted">
                      {saved.bill?.title || "—"} · {dateLabel(saved)}
                    </p>
                    <div className="justify-self-end">
                      <PayStatus paid={saved.bill?.paid} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";

const Ri = ({ name, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name} leading-none ${className}`} />
);

function PayStatus({ paid }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${paid ? "text-success" : "text-warning"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-success" : "bg-warning"}`}
      />
      {paid ? "Paid" : "Pending"}
    </span>
  );
}

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="relative block w-full sm:w-36">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full appearance-none rounded-md border border-line bg-white pl-3 pr-9 text-[13px] font-medium outline-none transition-[border-color,box-shadow] duration-150 hover:bg-neutral-bg focus:border-forest-700 focus:ring-2 focus:ring-forest-700/15"
      >
        {children}
      </select>
      <Ri
        name="arrow-down-s-line"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-muted"
      />
    </label>
  );
}
