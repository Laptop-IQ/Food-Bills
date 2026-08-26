import React from "react";
import { VIEW } from "../layout/constants";
import BillPreviewPanel from "./BillPreviewPanel";

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

  const isPaid = Boolean(bill?.paid);

  return (
    <div
      className={`
        min-h-screen
        ${pageBg}
        text-slate-900
      `}
    >
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header
        className="
    no-print
    sticky
    top-0
    z-20
    border-b
    border-slate-200/70
    bg-white/80
    backdrop-blur-2xl
    supports-[backdrop-filter]:bg-white/70
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
          {/* =====================================================
        LEFT — BACK
    ====================================================== */}
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
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:bg-white
        hover:text-slate-950
        hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)]
        active:translate-y-0
        active:scale-[0.97]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500/30
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
          text-sm
          text-slate-600
          transition-all
          duration-200
          group-hover:-translate-x-0.5
          group-hover:bg-blue-50
          group-hover:text-blue-600
        "
              aria-hidden="true"
            >
              ←
            </span>

            <span className="hidden sm:inline">Editor</span>
          </button>

          {/* =====================================================
        CENTER — TITLE
    ====================================================== */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-center">
              <div className="flex min-w-0 items-center gap-2.5">
                {/* Receipt icon */}
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
                  aria-hidden="true"
                >
                  🧾
                </div>

                <div className="min-w-0 text-center">
                  {/* Title row */}
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

                    {/* Status */}
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
                      ? `
                        bg-emerald-50
                        text-emerald-700
                        ring-emerald-200/80
                      `
                      : `
                        bg-amber-50
                        text-amber-700
                        ring-amber-200/80
                      `
                  }
                `}
                    >
                      <span
                        className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${
                      isPaid
                        ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
                        : "bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.10)]"
                    }
                  `}
                      />

                      {isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <div className="mt-0.5 flex items-center justify-center gap-1.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-blue-600">
                      Ready to Print
                    </span>

                    <span
                      className="
                  h-1
                  w-1
                  rounded-full
                  bg-slate-300
                "
                      aria-hidden="true"
                    />

                    <span className="hidden text-[9px] font-semibold text-slate-400 sm:inline">
                      Receipt
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
        RIGHT ACTIONS
    ====================================================== */}
          <div className="flex shrink-0 items-center gap-2">
            {/* =================================================
          PAID TOGGLE
      ================================================== */}
            <button
              type="button"
              onClick={onTogglePaid}
              aria-pressed={isPaid}
              aria-label={isPaid ? "Mark bill as unpaid" : "Mark bill as paid"}
              className={`
          group
          flex
          h-10
          items-center
          gap-1.5
          rounded-xl
          border
          px-2
          text-xs
          font-extrabold
          shadow-sm
          transition-all
          duration-200
          active:scale-[0.97]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-500/30
          sm:px-2.5

          ${
            isPaid
              ? `
                border-emerald-200/90
                bg-emerald-50
                text-emerald-700
                shadow-emerald-100/60
                hover:border-emerald-300
                hover:bg-emerald-100/70
              `
              : `
                border-slate-200/90
                bg-white/90
                text-slate-600
                hover:border-emerald-200
                hover:bg-emerald-50
                hover:text-emerald-700
              `
          }
        `}
            >
              <span
                className={`
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            text-[10px]
            font-black
            transition-all
            duration-200

            ${
              isPaid
                ? `
                  bg-emerald-500
                  text-white
                  shadow-[0_3px_10px_rgba(16,185,129,0.30)]
                `
                : `
                  bg-slate-100
                  text-slate-400
                  group-hover:bg-emerald-100
                  group-hover:text-emerald-600
                `
            }
          `}
                aria-hidden="true"
              >
                {isPaid ? "✓" : "○"}
              </span>

              <span className="hidden sm:inline">
                {isPaid ? "Paid" : "Mark Paid"}
              </span>
            </button>

            {/* =================================================
          BILLS
      ================================================== */}
            <button
              type="button"
              onClick={() => setView(VIEW.LIST)}
              aria-label="View all bills"
              className="
          group
          hidden
          h-10
          items-center
          gap-2
          rounded-xl
          border
          border-slate-200/90
          bg-white/90
          px-3
          text-xs
          font-bold
          text-slate-600
          shadow-[0_2px_8px_rgba(15,23,42,0.04)]
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:border-blue-200
          hover:bg-blue-50/70
          hover:text-blue-700
          hover:shadow-[0_6px_18px_rgba(59,130,246,0.10)]
          active:translate-y-0
          active:scale-[0.97]
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500/30
          sm:flex
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
            text-[12px]
            text-slate-500
            transition
            group-hover:bg-blue-100
            group-hover:text-blue-600
          "
                aria-hidden="true"
              >
                ☷
              </span>

              <span>Bills</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main
        className="
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-col
          items-center
          px-3
          pb-10
          pt-5
          sm:px-5
          sm:pt-7
        "
      >
        {/* BILL METADATA */}
        <div className="mb-4 text-center no-print">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-slate-400
            "
          >
            Thermal Receipt {bill?.billNo || "New Bill"}
          </p>
        </div>

        {/* =================================================
            PREVIEW CARD
        ================================================== */}
        <section
          className="
            flex
            w-full
            max-w-[900px]
            flex-col
            items-center
            rounded-3xl
            border
            border-slate-200
            bg-white/80
            p-3
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            backdrop-blur-xl
            sm:p-5
          "
        >
          {/* =================================================
              RECEIPT PREVIEW
          ================================================== */}
          <div
            className="
              flex
              w-full
              justify-center
              overflow-x-auto
              overflow-y-visible
              rounded-xl
              bg-slate-100
              p-3
              sm:p-5
            "
          >
            <BillPreviewPanel
              mutedText={mutedText}
              fontControlProps={fontControlProps}
              bill={bill}
              items={items}
              totals={totals}
              showActions={false}
            />
          </div>

          {/* =================================================
              PRINT / SAVE BUTTONS
          ================================================== */}
          <div className="no-print mt-5 w-full max-w-[320px]">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onPrintAndSave}
                aria-label="Print and save bill"
                className="
      group
      relative
      flex
      min-h-[64px]
      w-full
      items-center
      justify-center
      gap-3
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
      duration-200
      hover:-translate-y-0.5
      hover:shadow-[0_12px_30px_rgba(15,23,42,0.28)]
      active:translate-y-0
      active:scale-[0.98]
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-slate-500
      focus-visible:ring-offset-2
    "
              >
                {/* Shine effect */}
                <span
                  className="
        pointer-events-none
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
                  aria-hidden="true"
                />

                {/* Icon */}
                <span
                  className="
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-white/10
        text-xl
        ring-1
        ring-white/10
        transition
        group-hover:bg-white/15
      "
                  aria-hidden="true"
                >
                  🖨️
                </span>

                {/* Text */}
                <span className="relative flex flex-col text-left">
                  <span className="text-[13px] font-extrabold leading-4">
                    Print Save
                  </span>
                </span>
              </button>

              {/* =====================================================
      SAVE BILL
  ====================================================== */}
              <button
                type="button"
                onClick={onSaveOnly}
                aria-label="Save bill"
                className="
      group
      relative
      flex
      min-h-[64px]
      w-full
      items-center
      justify-center
      gap-3
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
      duration-200
      hover:-translate-y-0.5
      hover:shadow-[0_12px_30px_rgba(16,185,129,0.28)]
      active:translate-y-0
      active:scale-[0.98]
      focus:outline-none
      focus-visible:ring-2
      focus-visible:ring-emerald-400
      focus-visible:ring-offset-2
    "
              >
                {/* Shine effect */}
                <span
                  className="
        pointer-events-none
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
                  aria-hidden="true"
                />

                {/* Icon */}
                <span
                  className="
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-white/15
        text-xl
        ring-1
        ring-white/20
        transition
        group-hover:bg-white/20
      "
                  aria-hidden="true"
                >
                  💾
                </span>

                {/* Text */}
                <span className="relative flex flex-col text-left">
                  <span className="text-[13px] font-extrabold leading-4">
                    Save Bill
                  </span>
                </span>
              </button>
            </div>

            {/* STORAGE STATUS */}
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
        </section>
      </main>
    </div>
  );
}
