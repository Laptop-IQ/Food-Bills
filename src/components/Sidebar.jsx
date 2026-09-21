import { memo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ReceiptIcon,
  BriefcaseIcon,
  PlaneIcon,
  HotelIcon,
  CoffeeIcon,
  Menu,
  X,
  ChevronLeft,
  CreditCard,
  Smartphone,
} from "lucide-react";

/* -------------------------------------------------------
   Navigation
------------------------------------------------------- */

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
  },
  {
    to: "/hotels-invoice",
    label: "Hotel Bill",
    icon: HotelIcon,
  },
  {
    to: "/hotel-invoice",
    label: "Agoda Hotel Bill",
    icon: HotelIcon,
  },
  {
    to: "/foodbill",
    label: "Food Bill",
    icon: CoffeeIcon,
  },
  {
    to: "/expense",
    label: "Hotel Expense",
    icon: BriefcaseIcon,
  },
  {
    to: "/Gpay",
    label: "G-Pay UPI",
    icon: Smartphone,
  },
  {
    to: "/phonepe",
    label: "PhonePe UPI",
    icon: CreditCard,
  },
];

/* -------------------------------------------------------
   Brand Font
------------------------------------------------------- */

const FRAUNCES = {
  fontFamily: "'Fraunces', ui-serif, Georgia, serif",
};

/* -------------------------------------------------------
   Nav Item
------------------------------------------------------- */

const SidebarNavItem = memo(function SidebarNavItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        [
          "group relative flex items-center",
          "gap-3 rounded-xl",
          "px-3 py-2.5",
          "transition-[background,color,transform] duration-200",
          "outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#8B72FF]/60",
          isActive
            ? "bg-[#6D4AFF]/15 text-white"
            : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator */}
          <span
            aria-hidden="true"
            className={[
              "absolute left-0 top-1/2 -translate-y-1/2",
              "h-6 w-[3px] rounded-r-full",
              "transition-all duration-200",
              isActive
                ? "bg-gradient-to-b from-[#B6A6FF] to-[#6947FF] opacity-100"
                : "opacity-0",
            ].join(" ")}
          />

          {/* Icon */}
          <span
            className={[
              "relative flex h-9 w-9 shrink-0 items-center justify-center",
              "rounded-lg transition-all duration-200",
              isActive ? "bg-[#7C5CFF]/10" : "group-hover:bg-white/[0.04]",
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className={[
                "h-[18px] w-[18px]",
                "transition-transform duration-200",
                "group-hover:scale-[1.05]",
                isActive
                  ? "text-[#A997FF]"
                  : "text-slate-500 group-hover:text-slate-300",
              ].join(" ")}
              strokeWidth={1.8}
            />
          </span>

          {/* Label */}
          <span className="min-w-0 truncate text-[13.5px] font-medium">
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
});

/* -------------------------------------------------------
   Sidebar
------------------------------------------------------- */

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = () => {
    setMobileOpen(true);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =================================================
          MOBILE HEADER
          Desktop par completely hidden
      ================================================= */}

      <header
        className="
          fixed inset-x-0 top-0 z-[60]
          flex h-14 items-center justify-between
          border-b border-white/[0.06]
          bg-[#11101A]/95 px-4
          backdrop-blur-xl
          md:flex
        "
      >
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              bg-gradient-to-br
              from-[#9B85FF] to-[#4B32C3]
              text-[11px] font-bold text-white
              shadow-[0_4px_16px_rgba(91,63,224,.3)]
            "
          >
            SK
          </div>

          <span
            style={FRAUNCES}
            className="truncate text-sm font-semibold text-[#F3F1FA]"
          >
            Bill-Hub
          </span>
        </div>

        {/* Menu Button */}
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg
            text-slate-300
            transition-colors
            hover:bg-white/[0.06]
            hover:text-white
            active:scale-95
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#8B72FF]/60
          "
        >
          <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </header>

      {/* =================================================
          OVERLAY
      ================================================= */}

      <div
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* =================================================
          MOBILE MENU
          Desktop par hidden
      ================================================= */}

      <aside
        id="mobile-navigation"
        aria-label="Main navigation"
        className={[
          "fixed left-0 top-0 z-50",
          "flex h-dvh w-[260px] flex-col",
          "border-r border-white/[0.06]",
          "bg-[#11101A]",
          "shadow-[12px_0_40px_rgba(0,0,0,.12)]",
          "overflow-hidden",
          "transition-transform duration-300 ease-out",

          /* IMPORTANT:
             Desktop par sidebar completely hidden */
          "md:hidden",

          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -left-24 -top-24
            h-64 w-64
            rounded-full
            bg-[#6546E8]/[0.12]
            blur-3xl
          "
        />

        {/* =================================================
            Brand
        ================================================= */}

        <div
          className="
            relative flex h-[72px] shrink-0
            items-center justify-between
            border-b border-white/[0.06]
            px-4
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Logo */}
            <div
              className="
                relative flex h-10 w-10 shrink-0
                items-center justify-center
                overflow-hidden rounded-xl
                bg-gradient-to-br
                from-[#9B85FF]
                via-[#684BEA]
                to-[#3C299D]
                text-[12px] font-bold text-white
                shadow-[0_6px_20px_rgba(76,48,190,.3)]
              "
            >
              <span className="relative z-10">SK</span>

              <span
                aria-hidden="true"
                className="
                  absolute inset-0
                  bg-gradient-to-tr
                  from-transparent
                  via-white/10
                  to-transparent
                "
              />
            </div>

            {/* Brand */}
            <div className="min-w-0">
              <p
                style={FRAUNCES}
                className="
                  truncate
                  text-[17px]
                  font-semibold
                  leading-none
                  tracking-tight
                  text-[#F6F4FB]
                "
              >
                Bill-Hub
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  tracking-[0.14em]
                  text-slate-600
                "
              >
                BILLING SYSTEM
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-white/[0.05]
              hover:text-white
              active:scale-95
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#8B72FF]/60
            "
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* =================================================
            Navigation
        ================================================= */}

        <nav
          aria-label="Main navigation"
          className="
            relative flex-1
            overflow-y-auto
            px-3 py-5
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-white/10
          "
        >
          <div className="mb-2 px-3">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-slate-600
              "
            >
              Menu
            </p>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <SidebarNavItem key={item.to} item={item} />
            ))}
          </div>
        </nav>

        {/* =================================================
            Footer
        ================================================= */}

        <div
          className="
            relative shrink-0
            border-t border-white/[0.06]
            p-3
          "
        >
          <div
            className="
              flex items-center gap-2
              rounded-xl
              bg-white/[0.025]
              px-3 py-2.5
            "
          >
            <div
              aria-hidden="true"
              className="
                h-2 w-2 rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,.5)]
              "
            />

            <span
              className="
                text-[11px]
                font-medium
                text-slate-500
              "
            >
              System ready
            </span>
          </div>
        </div>
      </aside>

      {/* =================================================
          Header spacing
      ================================================= */}

      <div className="h-14" />
    </>
  );
}

export default memo(Sidebar);
