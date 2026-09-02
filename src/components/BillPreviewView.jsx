import React, { useState } from "react";
import { VIEW } from "../layout/constants";
import FontControls from "./FontControls";
import BillReceipt from "./BillReceipt";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export default function BillPreviewView({
  theme,
  setView,
  fontControlProps,
  bill = {},
  items = [],
  totals = {},
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
  onTogglePaid,
}) {
  const { pageBg = "bg-slate-50", mutedText = "text-slate-500" } = theme || {};

  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Receipt settings
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showGstLines, setShowGstLines] = useState(true);
  const [addressFontSize, setAddressFontSize] = useState(12);
  const [showDividerLines, setShowDividerLines] = useState(true);

  const isPaid = Boolean(bill?.paid);
  const grandTotal = Number(totals?.grandTotal || 0);

  return (
    <div className={`min-h-screen ${pageBg} text-slate-900`}>
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header
        className="
          no-print
          sticky
          top-0
          z-40
          border-b
          border-slate-200/70
          bg-white/85
          backdrop-blur-2xl
          shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[68px]
            w-full
            max-w-7xl
            items-center
            gap-2
            px-3
            sm:gap-3
            sm:px-5
            lg:px-7
          "
        >
          {/* BACK */}
          <button
            type="button"
            onClick={() => setView(VIEW.EDITOR)}
            aria-label="Back to editor"
            className="
              group
              flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200/80
              bg-white/90
              px-2.5
              text-sm
              font-bold
              text-slate-700
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:border-blue-200
              hover:bg-blue-50/70
              hover:text-blue-700
              active:scale-[0.97]
              sm:px-3
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-lg
                bg-slate-100
                text-slate-600
                transition
                group-hover:bg-blue-100
                group-hover:text-blue-600
              "
            >
              ←
            </span>

            <span className="hidden sm:inline">Editor</span>
          </button>

          {/* CENTER TITLE */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-center">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="
                    hidden
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-blue-50
                    via-indigo-50
                    to-violet-50
                    text-base
                    shadow-[inset_0_0_0_1px_rgba(99,102,241,0.10)]
                    sm:flex
                  "
                >
                  🧾
                </div>

                <div className="min-w-0 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <h1
                      className="
                        truncate
                        text-[13px]
                        font-black
                        tracking-[-0.02em]
                        text-slate-950
                        sm:text-[15px]
                      "
                    >
                      Bill Preview
                    </h1>

                    <span
                      className={`
                        hidden
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        ring-1
                        sm:inline-flex
                        ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
                            : "bg-amber-50 text-amber-700 ring-amber-200/80"
                        }
                      `}
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${isPaid ? "bg-emerald-500" : "bg-amber-500"}
                        `}
                      />

                      {isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-0.5 flex items-center justify-center gap-1.5">
                    <span
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-blue-600
                      "
                    >
                      Ready to Print
                    </span>

                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                    <span className="hidden text-[9px] font-semibold text-slate-400 sm:inline">
                      Receipt
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 items-center gap-2">
            <div
              className="
                hidden
                rounded-xl
                border
                border-emerald-200
                bg-emerald-50
                px-3
                py-2
                text-sm
                font-black
                text-emerald-700
                sm:block
              "
            >
              ₹{grandTotal.toFixed(0)}
            </div>

            <button
              type="button"
              onClick={() => setView(VIEW.LIST)}
              className="
                hidden
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                text-xs
                font-bold
                text-slate-600
                shadow-sm
                transition
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-700
                sm:flex
              "
            >
              <span>☷</span>
              Bills
            </button>
          </div>
        </div>

        {hasValue(storageStatus) && (
          <div className="mx-auto max-w-7xl px-4 pb-2">
            <p className="text-[10px] font-semibold text-emerald-600">
              {storageStatus}
            </p>
          </div>
        )}
      </header>

      {/* =====================================================
          MAIN
          LEFT SETTINGS / RIGHT LIVE PREVIEW
      ====================================================== */}
      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-3
          pb-10
          pt-5
          sm:px-5
          sm:pt-7
          lg:px-7
        "
      >
        <div
          className="
            grid
            items-start
            gap-5
            lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]
            xl:gap-7
          "
        >
          {/* =================================================
              LEFT — RECEIPT & FONT SETTINGS
          ================================================== */}
          <aside className="no-print lg:sticky lg:top-24">
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white/90
                shadow-[0_18px_55px_rgba(15,23,42,0.08)]
                backdrop-blur-xl
              "
            >
              {/* HEADER */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                aria-expanded={isSettingsOpen}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-3
                  px-4
                  py-4
                  text-left
                  transition
                  hover:bg-slate-50
                  sm:px-5
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      via-violet-500
                      to-purple-600
                      text-white
                      shadow-lg
                      shadow-indigo-200/60
                    "
                  >
                    ⚙
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-black text-slate-900">
                        Receipt & Font Settings
                      </h2>

                      <span
                        className="
                          rounded-full
                          bg-gradient-to-r
                          from-indigo-50
                          to-violet-50
                          px-2
                          py-0.5
                          text-[8px]
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-indigo-600
                          ring-1
                          ring-indigo-100
                        "
                      >
                        Premium
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      Manage payment, typography & receipt display
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    text-slate-500
                    transition-all
                    duration-300
                    ${
                      isSettingsOpen
                        ? "rotate-180 border-indigo-200 bg-indigo-50 text-indigo-600"
                        : ""
                    }
                  `}
                >
                  ↓
                </span>
              </button>

              {/* CONTENT */}
              <div
                className={`
                  grid
                  transition-[grid-template-rows]
                  duration-300
                  ease-in-out
                  ${isSettingsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                `}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/80 via-white to-white">
                    {/* =========================================
                        PAYMENT
                    ========================================== */}
                    <div className="border-b border-slate-100 p-4 sm:p-5">
                      <SectionTitle
                        icon="₹"
                        iconClass="bg-emerald-50 text-emerald-600"
                        title="Payment Status"
                        description="Update bill payment status"
                      />

                      <button
                        type="button"
                        onClick={onTogglePaid}
                        aria-pressed={isPaid}
                        className={`
                          mt-3
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-2xl
                          border
                          px-3.5
                          py-3
                          transition-all
                          ${
                            isPaid
                              ? `
                                border-emerald-200
                                bg-gradient-to-r
                                from-emerald-50
                                to-green-50
                                text-emerald-700
                                shadow-sm
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-600
                                hover:border-emerald-200
                                hover:bg-emerald-50/50
                              `
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              text-sm
                              font-black
                              ${
                                isPaid
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                                  : "bg-slate-100 text-slate-400"
                              }
                            `}
                          >
                            {isPaid ? "✓" : "○"}
                          </span>

                          <div className="text-left">
                            <p className="text-sm font-bold">
                              {isPaid ? "Payment Received" : "Mark as Paid"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {isPaid
                                ? "This bill is marked as paid"
                                : "Mark this bill as payment received"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-[9px]
                            font-black
                            uppercase
                            tracking-wider
                            ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-50 text-amber-600"
                            }
                          `}
                        >
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </button>
                    </div>

                    {/* =========================================
                        FONT SETTINGS
                    ========================================== */}
                    <div className="border-b border-slate-100 p-4 sm:p-5">
                      <SectionTitle
                        icon="A"
                        iconClass="bg-indigo-50 text-indigo-600"
                        title="Font Settings"
                        description="Receipt typography & sizing"
                      />

                      <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
                        <FontControls {...fontControlProps} />
                      </div>
                    </div>

                    {/* =========================================
                        RECEIPT OPTIONS
                    ========================================== */}
                    <div className="p-4 sm:p-5">
                      <SectionTitle
                        icon="▤"
                        iconClass="bg-violet-50 text-violet-600"
                        title="Receipt Options"
                        description="Control what appears on the receipt"
                      />

                      <div className="mt-3 space-y-2">
                        <SettingRow
                          icon="✦"
                          iconClass="bg-emerald-50 text-emerald-600"
                          title="Powered by TMBill"
                          description="Show branding on receipt"
                        >
                          <PremiumToggle
                            checked={showPoweredBy}
                            onChange={setShowPoweredBy}
                          />
                        </SettingRow>

                        <SettingRow
                          icon="%"
                          iconClass="bg-blue-50 text-blue-600"
                          title="Subtotal & Tax Breakdown"
                          description="Display detailed tax information"
                        >
                          <PremiumToggle
                            checked={showGstLines}
                            onChange={setShowGstLines}
                          />
                        </SettingRow>

                        <SettingRow
                          icon="A"
                          iconClass="bg-violet-50 text-violet-600"
                          title="Address Font Size"
                          description="Adjust address text size"
                        >
                          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                setAddressFontSize((size) =>
                                  Math.max(10, size - 1),
                                )
                              }
                              disabled={addressFontSize <= 10}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                text-sm
                                font-bold
                                text-slate-500
                                transition
                                hover:bg-white
                                hover:text-indigo-600
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                            >
                              −
                            </button>

                            <span className="min-w-[42px] text-center text-xs font-bold text-slate-700">
                              {addressFontSize}px
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                setAddressFontSize((size) =>
                                  Math.min(16, size + 1),
                                )
                              }
                              disabled={addressFontSize >= 16}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                text-sm
                                font-bold
                                text-slate-500
                                transition
                                hover:bg-white
                                hover:text-indigo-600
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                            >
                              +
                            </button>
                          </div>
                        </SettingRow>

                        <SettingRow
                          icon="—"
                          iconClass="bg-amber-50 text-amber-600"
                          title="Dashed Divider Lines"
                          description="Show separator lines on receipt"
                        >
                          <PremiumToggle
                            checked={showDividerLines}
                            onChange={setShowDividerLines}
                          />
                        </SettingRow>
                      </div>

                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          border
                          border-indigo-100
                          bg-gradient-to-r
                          from-indigo-50
                          to-violet-50/70
                          px-3
                          py-2.5
                        "
                      >
                        <span
                          className="
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-indigo-100
                            text-[10px]
                            font-black
                            text-indigo-600
                          "
                        >
                          i
                        </span>

                        <span className="text-[10px] font-semibold text-indigo-600">
                          Changes update the live preview instantly.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              RIGHT — FIXED LIVE PREVIEW
          ================================================== */}
          <section className="min-w-0">
            <div
              className="
                rounded-3xl
                border
                border-slate-200/80
                bg-white/80
                p-3
                shadow-[0_20px_60px_rgba(15,23,42,0.08)]
                backdrop-blur-xl
                sm:p-5
              "
            >
              {/* LIVE PREVIEW HEADER */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.16em]
                      text-blue-600
                    "
                  >
                    Thermal Receipt
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-semibold
                      text-slate-400
                    "
                  >
                    {bill?.billNo || "New Bill"}
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-100
                    bg-emerald-50
                    px-3
                    py-1.5
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]" />

                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">
                    Live
                  </span>
                </div>
              </div>

              {/* LIVE PREVIEW LABEL */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-center
                "
              >
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-300" />

                <span
                  className={`
                    shrink-0
                    text-sm
                    font-bold
                    tracking-wide
                    ${mutedText}
                  `}
                >
                  ── Live Preview ──
                </span>

                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-300" />
              </div>

              {/* RECEIPT */}
              <div
                className="
                  flex
                  w-full
                  justify-center
                  overflow-x-auto
                  overflow-y-visible
                  rounded-2xl
                  bg-gradient-to-br
                  from-slate-100
                  via-slate-50
                  to-slate-100
                  p-3
                  sm:p-5
                "
              >
                <BillReceipt
                  bill={bill}
                  items={items}
                  activeFontCss={fontControlProps.activeFontCss}
                  fontSize={fontControlProps.fontSize}
                  totals={totals}
                  showActions={false}
                  onPrintAndSave={onPrintAndSave}
                  onSaveOnly={onSaveOnly}
                  storageStatus={storageStatus}
                  showPoweredBy={showPoweredBy}
                  showGstLines={showGstLines}
                  addressFontSize={addressFontSize}
                  showDividerLines={showDividerLines}
                />
              </div>

              {/* PRINT / SAVE */}
              <div className="no-print mt-5 w-full max-w-[420px] mx-auto">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onPrintAndSave}
                    className="
                      group
                      relative
                      flex
                      min-h-[62px]
                      items-center
                      justify-center
                      gap-2.5
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-800
                      bg-gradient-to-br
                      from-slate-950
                      via-slate-900
                      to-slate-800
                      px-3
                      py-3
                      text-white
                      shadow-[0_8px_24px_rgba(15,23,42,0.20)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-[0_12px_30px_rgba(15,23,42,0.28)]
                      active:scale-[0.98]
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/10
                        to-transparent
                        transition-transform
                        duration-700
                        group-hover:translate-x-full
                      "
                    />

                    <span
                      className="
                        relative
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/10
                        text-lg
                        ring-1
                        ring-white/10
                      "
                    >
                      🖨️
                    </span>

                    <span className="relative text-left">
                      <span className="block text-[12px] font-extrabold">
                        Print Save
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onSaveOnly}
                    className="
                      group
                      relative
                      flex
                      min-h-[62px]
                      items-center
                      justify-center
                      gap-2.5
                      overflow-hidden
                      rounded-2xl
                      border
                      border-emerald-200
                      bg-gradient-to-br
                      from-emerald-500
                      via-emerald-600
                      to-emerald-700
                      px-3
                      py-3
                      text-white
                      shadow-[0_8px_24px_rgba(16,185,129,0.20)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-[0_12px_30px_rgba(16,185,129,0.28)]
                      active:scale-[0.98]
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/15
                        to-transparent
                        transition-transform
                        duration-700
                        group-hover:translate-x-full
                      "
                    />

                    <span
                      className="
                        relative
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-white/15
                        text-lg
                        ring-1
                        ring-white/20
                      "
                    >
                      💾
                    </span>

                    <span className="relative text-left">
                      <span className="block text-[12px] font-extrabold">
                        Save Bill
                      </span>
                    </span>
                  </button>
                </div>

                {hasValue(storageStatus) && (
                  <div
                    className="
                      mt-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2.5
                      text-center
                      text-[11px]
                      font-semibold
                      text-slate-600
                      shadow-sm
                    "
                  >
                    {storageStatus}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */
function SectionTitle({ icon, iconClass, title, description }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-xs
          font-black
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wider text-slate-700">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SETTING ROW
========================================================= */
function SettingRow({ icon, iconClass, title, description, children }) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        rounded-2xl
        border
        border-slate-200/70
        bg-white
        px-3
        py-3
        transition-all
        hover:border-indigo-200
        hover:shadow-sm
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-xs
            font-black
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-700">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* =========================================================
   PREMIUM TOGGLE
========================================================= */
function PremiumToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative
        h-6
        w-11
        shrink-0
        rounded-full
        p-0.5
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/30
        ${
          checked
            ? "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-sm shadow-indigo-200"
            : "bg-slate-200"
        }
      `}
    >
      <span
        className={`
          block
          h-5
          w-5
          rounded-full
          bg-white
          shadow-sm
          transition-transform
          duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}
