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
          sticky
          top-0
          z-50
          border-b
          border-slate-200/80
          bg-white/95
          shadow-[0_4px_20px_rgba(15,23,42,0.06)]
          backdrop-blur-xl
          no-print
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[64px]
            w-full
            max-w-6xl
            items-center
            gap-2
            px-3
            sm:px-5
          "
        >
          {/* BACK */}
          <button
            type="button"
            onClick={() => setView(VIEW.EDITOR)}
            aria-label="Back to editor"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-lg
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              active:scale-95
              sm:w-auto
              sm:px-3
            "
          >
            ←
            <span className="ml-1.5 hidden text-xs font-bold sm:inline">
              Editor
            </span>
          </button>

          {/* CENTER TITLE */}
          <div className="min-w-0 flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="hidden text-base sm:inline" aria-hidden="true">
                🧾
              </span>

              <h1
                className="
                  truncate
                  text-sm
                  font-black
                  text-slate-900
                  sm:text-base
                "
              >
                Bill Preview
              </h1>

              <span
                className={`
                  hidden
                  rounded-full
                  px-2
                  py-0.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-wider
                  sm:inline-flex
                  ${
                    isPaid
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }
                `}
              >
                {isPaid ? "Paid" : "Pending"}
              </span>
            </div>

            <p className="mt-0.5 text-[10px] font-bold text-blue-600 sm:text-[11px]">
              Ready to Print
            </p>
          </div>

          {/* PAID */}
          <button
            type="button"
            onClick={onTogglePaid}
            aria-pressed={isPaid}
            aria-label={isPaid ? "Mark bill as unpaid" : "Mark bill as paid"}
            className={`
              flex
              h-10
              shrink-0
              items-center
              gap-1.5
              rounded-xl
              border
              px-3
              text-xs
              font-extrabold
              transition
              active:scale-95
              ${
                isPaid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <span
              className={`
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                text-[10px]
                ${
                  isPaid
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500"
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

          {/* BILLS */}
          <button
            type="button"
            onClick={() => setView(VIEW.LIST)}
            className="
              hidden
              h-10
              items-center
              gap-1.5
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
              hover:bg-slate-50
              active:scale-95
              sm:flex
            "
          >
            ☷ Bills
          </button>
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
              {/* =====================================================
      PRINT + SAVE
  ====================================================== */}
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
