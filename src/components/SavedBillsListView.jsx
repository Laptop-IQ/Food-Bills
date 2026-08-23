import React, { useState } from "react";
import { VIEW } from "../layout/constants";

/* ---------------- Icons (inline, no extra deps) ---------------- */

const IconArrowLeft = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const IconSun = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconMoon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const IconPlus = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconEdit = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconEye = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTrash = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const IconReceipt = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 3 L19 3 L19 20 L17 18.5 L15 20 L13 18.5 L11 20 L9 18.5 L7 20 L5 18.5 Z" />
    <path d="M8 7.5h8M8 11h8M8 14.5h5" />
  </svg>
);

const IconSearch = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

/* ---------------- Helpers ---------------- */

const formatCurrency = (n) => Number(n || 0).toLocaleString("en-IN");

function LedgerStat({ label, value }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-white/55 text-[11px] font-semibold uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span className="flex-1 border-b border-dotted border-white/25 mb-1" />
      <span className="text-white font-mono font-bold text-base shrink-0">
        {value}
      </span>
    </div>
  );
}

/* ---------------- Main view ---------------- */

export default function SavedBillsListView({
  theme,
  darkMode,
  toggleDarkMode,
  startNewBill,
  loading,
  savedBills,
  startEditBill,
  setView,
  deleteSavedBill,
}) {
  const { pageBg, cardBg, cardBorder, mutedText } = theme;
  const [searchTerm, setSearchTerm] = useState("");

  const totalBills = savedBills.length;
  const totalRevenue = savedBills.reduce(
    (sum, s) => sum + (Number(s.grandTotal) || 0),
    0,
  );

  const filteredBills = searchTerm.trim()
    ? savedBills.filter((saved) => {
        const term = searchTerm.toLowerCase();
        return (
          String(saved.bill.billNo ?? "")
            .toLowerCase()
            .includes(term) ||
          String(saved.bill.table ?? "")
            .toLowerCase()
            .includes(term) ||
          String(saved.bill.dine ?? "")
            .toLowerCase()
            .includes(term)
        );
      })
    : savedBills;

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <style>{`
        @keyframes billFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bill-card-anim { animation: billFadeIn 0.35s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .bill-card-anim { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* ---------- Hero: torn-receipt header ---------- */}
        <div
          className="relative bg-[#1B1A17] mb-8 sm:mb-10 overflow-hidden"
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 88%, 95% 100%, 90% 88%, 85% 100%, 80% 88%, 75% 100%, 70% 88%, 65% 100%, 60% 88%, 55% 100%, 50% 88%, 45% 100%, 40% 88%, 35% 100%, 30% 88%, 25% 100%, 20% 88%, 15% 100%, 10% 88%, 5% 100%, 0% 88%)",
          }}
        >
          <div className="p-6 sm:p-8 pb-10 sm:pb-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark theme"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white/90 hover:text-white bg-white/10 hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {darkMode ? (
                  <IconMoon className="w-[18px] h-[18px]" />
                ) : (
                  <IconSun className="w-[18px] h-[18px]" />
                )}
              </button>
            </div>

           
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Saved Bills
            </h1>
           
          </div>
        </div>

        {/* ---------- Section header: title, count, search, new bill ---------- */}
        {!loading && savedBills.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Bill History
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  darkMode
                    ? "bg-neutral-800 text-neutral-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filteredBills.length}
              </span>
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-0 sm:w-56">
                <IconSearch
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${mutedText}`}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bills..."
                  aria-label="Search saved bills"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors focus:ring-2 ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:ring-emerald-500/40 focus:border-emerald-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-emerald-500/30 focus:border-emerald-400"
                  }`}
                />
              </div>
              <button
                onClick={startNewBill}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <IconPlus className="w-4 h-4" />
                New Bill
              </button>
            </div>
          </div>
        )}

        {/* ---------- Loading skeleton ---------- */}
        {loading && (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${cardBg} border ${cardBorder} rounded-xl p-4 sm:p-5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div
                      className={`h-4 w-28 rounded animate-pulse ${darkMode ? "bg-neutral-700" : "bg-gray-200"}`}
                    />
                    <div
                      className={`h-3 w-36 rounded animate-pulse ${darkMode ? "bg-neutral-700" : "bg-gray-200"}`}
                    />
                  </div>
                  <div
                    className={`h-5 w-16 rounded animate-pulse ${darkMode ? "bg-neutral-700" : "bg-gray-200"}`}
                  />
                </div>
                <div className={`mt-4 pt-3 border-t ${cardBorder}`}>
                  <div
                    className={`h-6 w-40 rounded animate-pulse ${darkMode ? "bg-neutral-700" : "bg-gray-200"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------- Empty state ---------- */}
        {!loading && savedBills.length === 0 && (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-10 sm:p-12 text-center`}
          >
            <div
              className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                darkMode
                  ? "bg-neutral-800 text-neutral-500"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <IconReceipt className="w-6 h-6" />
            </div>
            <p className="text-lg font-bold">Koi saved bill nahi mila</p>
            <p className={`text-sm mt-1.5 ${mutedText}`}>
              Pehla bill banayein aur yahan apni saari history dekhein.
            </p>
            <button
              onClick={startNewBill}
              className="inline-flex items-center gap-2 mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <IconPlus className="w-4 h-4" />
             Add New Bill
            </button>
          </div>
        )}

        {/* ---------- No search results ---------- */}
        {!loading && savedBills.length > 0 && filteredBills.length === 0 && (
          <div
            className={`${cardBg} border ${cardBorder} rounded-xl p-10 text-center`}
          >
            <IconSearch className={`w-6 h-6 mx-auto mb-3 ${mutedText}`} />
            <p className={mutedText}>
              "{searchTerm}" ke liye koi bill nahi mila.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className={`text-sm font-semibold mt-3 underline ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
            >
              Search saaf karein
            </button>
          </div>
        )}

        {/* ---------- Bill cards ---------- */}
        <div className="space-y-4">
          {!loading &&
            filteredBills.map((saved, idx) => (
              <div
                key={saved.id}
                className={`bill-card-anim ${cardBg} border ${cardBorder} rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5`}
                style={{ animationDelay: `${Math.min(idx, 10) * 45}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono font-bold text-base sm:text-lg tracking-tight truncate">
                        {saved.bill.billNo}
                      </p>
                      {saved.bill.dine && (
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border shrink-0 ${
                            darkMode
                              ? "border-neutral-600 text-neutral-400"
                              : "border-gray-300 text-gray-500"
                          }`}
                        >
                          {saved.bill.dine}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${mutedText}`}>
                      {saved.bill.date}
                      {saved.bill.table ? ` · ${saved.bill.table}` : ""}
                    </p>
                  </div>
                  <p
                    className={`font-mono font-extrabold text-lg sm:text-xl shrink-0 ${
                      darkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    ₹{formatCurrency(saved.grandTotal)}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-1 mt-4 pt-3 border-t ${cardBorder}`}
                >
                  <button
                    onClick={() => startEditBill(saved)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      darkMode
                        ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      startEditBill(saved);
                      setTimeout(() => setView(VIEW.PREVIEW), 50);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      darkMode
                        ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <IconEye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => deleteSavedBill(saved.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                      darkMode
                        ? "text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
                        : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
