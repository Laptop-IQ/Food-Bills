import { memo, useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

/* Same routes as before, grouped. Remix Icon only: line = idle, fill = active. */
const SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/bill-dashboard", label: "Bills Dashboard", icon: "bar-chart-2" },
    ],
  },
  {
    label: "Bills",
    items: [
      { to: "/", label: "Thermal Bill", icon: "file-list-3", end: true },
      { to: "/foodbill", label: "Food Bill", icon: "restaurant-2" },
      { to: "/tax-invoice", label: "Air Bills", icon: "plane" },
    ],
  },
  {
    label: "Stays & expenses",
    items: [
      { to: "/hotels-invoice", label: "Hotel Bill", icon: "hotel" },
      { to: "/hotel-invoice", label: "Agoda Hotel Bill", icon: "building-4" },
      { to: "/expense", label: "Hotel Expense", icon: "briefcase-4" },
    ],
  },
  {
    label: "Payments",
    items: [
      { to: "/Gpay", label: "G-Pay UPI", icon: "smartphone" },
      { to: "/phonepe", label: "PhonePe UPI", icon: "bank-card" },
    ],
  },
];

const OPEN_DELAY = 140;
const CLOSE_DELAY = 220;
const FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/50";

const Icon = ({ name, fill, className = "" }) => (
  <i aria-hidden="true" className={`ri-${name}-${fill ? "fill" : "line"} text-[20px] leading-none ${className}`} />
);

function Brand({ showText = true }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-700 font-display text-[12px] font-semibold tracking-wide text-ivory">
        SK
      </div>
      {showText && (
        <div className="min-w-0 leading-none">
          <p className="truncate font-display text-[15px] font-semibold tracking-tight text-ink">Bill-Hub</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold-500">Billing system</p>
        </div>
      )}
    </div>
  );
}

const NavItem = memo(function NavItem({ item, expanded, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={expanded ? undefined : item.label}
      className={({ isActive }) =>
        [
          "relative flex h-10 items-center gap-3 rounded-md px-[10px] text-[13.5px] font-medium",
          "transition-colors duration-150",
          FOCUS,
          isActive ? "bg-forest-50 text-forest-800" : "text-slate-muted hover:bg-neutral-bg hover:text-ink",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={`absolute -left-3 top-2 h-6 w-[3px] rounded-r-full bg-forest-700 transition-opacity duration-150 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon name={item.icon} fill={isActive} className={`shrink-0 ${isActive ? "text-forest-700" : ""}`} />
          <span className={`min-w-0 truncate transition-opacity duration-150 ${expanded ? "opacity-100" : "opacity-0"}`}>
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
});

function Sidebar({ pinned = false, onTogglePinned }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef(null);
  const asideRef = useRef(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const schedule = useCallback((next, delay) => {
    clear();
    timer.current = setTimeout(() => setHovered(next), delay);
  }, []);
  useEffect(() => clear, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  // Desktop: wide when pinned or hovered; the mobile drawer is always wide.
  const wide = pinned || hovered;
  const showLabels = wide || mobileOpen;

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ivory/95 px-4 backdrop-blur md:hidden print:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          className={`flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-neutral-bg ${FOCUS}`}
        >
          <i aria-hidden="true" className="ri-menu-line text-[22px] leading-none" />
        </button>
      </header>

      <div
        aria-hidden="true"
        onClick={closeMobile}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-200 md:hidden print:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        ref={asideRef}
        id="main-navigation"
        aria-label="Main navigation"
        onMouseEnter={() => schedule(true, OPEN_DELAY)}
        onMouseLeave={() => schedule(false, CLOSE_DELAY)}
        onFocusCapture={() => schedule(true, 0)}
        onBlurCapture={(e) => {
          if (!asideRef.current?.contains(e.relatedTarget)) schedule(false, CLOSE_DELAY);
        }}
        className={[
          "fixed left-0 top-0 z-50 flex h-dvh flex-col overflow-hidden border-r border-line bg-shell print:hidden",
          "w-[264px] transition-[width,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          wide ? "md:w-[264px]" : "md:w-16",
          wide && !pinned ? "md:shadow-[8px_0_32px_rgba(28,31,35,.10)]" : "",
        ].join(" ")}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-[14px]">
          <Brand showText={showLabels} />
          <div className={`flex items-center ${showLabels ? "" : "hidden"}`}>
            <button
              type="button"
              onClick={onTogglePinned}
              aria-pressed={pinned}
              aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
              title={pinned ? "Unpin sidebar" : "Pin sidebar"}
              className={`hidden h-9 w-9 items-center justify-center rounded-md transition-colors md:flex ${FOCUS} ${
                pinned ? "bg-forest-50 text-forest-700" : "text-slate-muted hover:bg-neutral-bg hover:text-ink"
              }`}
            >
              <i aria-hidden="true" className={`ri-pushpin-2-${pinned ? "fill" : "line"} text-[18px] leading-none`} />
            </button>
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-md text-slate-muted hover:bg-neutral-bg hover:text-ink md:hidden ${FOCUS}`}
            >
              <i aria-hidden="true" className="ri-close-line text-[22px] leading-none" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4" aria-label="Sections">
          {SECTIONS.map((section, i) => (
            <div key={section.label} className={i ? "mt-5" : ""}>
              {showLabels ? (
                <p className="mb-1.5 h-4 px-[10px] text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-muted/80">
                  {section.label}
                </p>
              ) : (
                <div className="mx-2 mb-2 h-px bg-line" aria-hidden="true" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.to} item={item} expanded={showLabels} onNavigate={closeMobile} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={`shrink-0 border-t border-line px-[22px] py-3 text-[11px] text-slate-muted ${showLabels ? "" : "invisible"}`}>
          Bill-Hub
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);
