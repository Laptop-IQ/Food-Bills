import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ReceiptIcon,
  BriefcaseIcon,
  PlaneIcon,
  HotelIcon,
  CoffeeIcon,
} from "lucide-react";

/* ---------------- Icons (hand-drawn, zero extra deps) ---------------- */


function MenuIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function XIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ChevronIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

const navItems = [
  {
    to: "/",
    label: "Thermal Bill",
    icon: ReceiptIcon,
    end: true,
  },
  {
    to: "/tax-invoice",
    label: "Air Bills",
    icon: PlaneIcon,
    end: false,
  },
  {
    to: "/hotels-invoice",
    label: "Hotel Bill",
    icon: HotelIcon,
    end: false,
  },
  {
    to: "/foodbill",
    label: "Food Bill",
    icon: CoffeeIcon,
    end: false,
  },
  {
    to: "/expense",
    label: "Hotel Expense",
    icon: BriefcaseIcon,
    end: false,
  },
];

const FRAUNCES = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };

export default function Sidebar({ collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#13111C]/95 backdrop-blur-xl border-b border-white/[0.06] z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#bcb9c6] to-[#4530A8] flex items-center justify-center text-white font-bold text-xs">
            SK
          </div>
          <span
            style={FRAUNCES}
            className="text-[#F3F1FA] font-semibold text-sm"
          >
            Bill Gen
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/5 active:scale-95 transition"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-[#13111C] border-r border-white/[0.06] flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          ${collapsed ? "md:w-[84px]" : "md:w-[264px]"}
          w-[264px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="absolute -top-20 -left-16 w-64 h-64 bg-[#5B3FE0]/[0.14] rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div
          className={`relative flex items-center h-[72px] px-5 border-b border-white/[0.06] shrink-0 ${collapsed ? "md:justify-center md:px-0" : "justify-between"}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#8B72FF] via-[#5B3FE0] to-[#3B2A99] flex items-center justify-center text-white font-bold text-[13px] shadow-lg shadow-[#3B2A99]/40">
              SK
            </div>
            <div className={`min-w-0 ${collapsed ? "md:hidden" : ""}`}>
              <p
                style={FRAUNCES}
                className="text-[#F3F1FA] font-semibold text-[16px] leading-tight tracking-tight truncate"
              >
                Bill Gen
              </p>
             
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/5"
            aria-label="Close menu"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-slate-600 uppercase hidden md:block">
              Menu
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${collapsed ? "md:justify-center md:px-0" : ""}
                ${isActive ? "bg-gradient-to-r from-[#5B3FE0]/25 to-[#3B2A99]/10 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-[#9B85FF] to-[#5B3FE0]" />
                  )}
                  <item.icon
                    className={`w-[19px] h-[19px] shrink-0 transition-colors ${
                      isActive
                        ? "text-[#9B85FF]"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span
                    className={`text-[14px] font-medium whitespace-nowrap ${collapsed ? "md:hidden" : ""}`}
                  >
                    {item.label}
                  </span>
                  {collapsed && (
                    <span className="hidden md:group-hover:flex absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1C1830] text-white text-xs font-medium whitespace-nowrap shadow-xl border border-white/10 z-50">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden md:flex px-3 pb-2 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] transition-all ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <ChevronIcon
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
            {!collapsed && (
              <span className="text-[13px] font-medium">Collapse</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
