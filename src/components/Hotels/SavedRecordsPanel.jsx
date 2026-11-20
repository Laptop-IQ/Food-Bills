import { ROWS } from "./expenseRows";
import { ni } from "./numberUtils";
import { generatePrintHTML } from "./printTemplate";

/* ─────────────────────────────────────────────
   Print Saved Record
───────────────────────────────────────────── */

function printRecord(r, onNotify) {
  const total = ROWS.reduce((sum, row) => sum + ni(r[row.ak]), 0);

  const net = total - ni(r.lessAdvance);

  const suppVchr = ROWS.reduce(
    (sum, row) => (row.sk ? sum + ni(r[row.sk]) : sum),
    0,
  );

  /*
   * IMPORTANT:
   * window.open() must happen immediately
   * inside the user's click event.
   *
   * Don't use setTimeout before window.open().
   */
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    onNotify?.({
      type: "error",
      title: "Print window blocked",
      message:
        "Browser ne print window block kar di. Please pop-ups allow karke dobara try karein.",
      duration: 5000,
    });

    return;
  }

  try {
    const html = generatePrintHTML(r, total, net, suppVchr);

    /*
     * Write generated print document.
     */
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    /*
     * Wait for the print document to finish
     * loading before calling print().
     */
    const startPrint = () => {
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();

          onNotify?.({
            type: "success",
            title: "Print ready",
            message: "Print dialog is ready.",
            duration: 2200,
          });
        } catch (error) {
          console.error("Print failed:", error);

          onNotify?.({
            type: "error",
            title: "Print failed",
            message: "Print dialog open nahi ho saka.",
            duration: 4000,
          });
        }
      }, 350);
    };

    /*
     * If document is already loaded, print.
     * Otherwise wait for load.
     */
    if (printWindow.document.readyState === "complete") {
      startPrint();
    } else {
      printWindow.onload = startPrint;
    }
  } catch (error) {
    console.error("Print preparation failed:", error);

    try {
      printWindow.close();
    } catch {
      // Ignore close errors.
    }

    onNotify?.({
      type: "error",
      title: "Print failed",
      message: "Print view prepare nahi ho saka.",
      duration: 4000,
    });
  }
}

/* ─────────────────────────────────────────────
   Saved Records Panel
───────────────────────────────────────────── */

export default function SavedRecordsPanel({
  savedRecords,
  selectedId,
  onLoad,
  onDelete,
  onNotify,
}) {
  const hasRecords = savedRecords.length > 0;

  return (
    <section
      className="
        w-full max-w-[920px] mt-5 print:hidden
        overflow-hidden
        rounded-md
        border border-line
        bg-white
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
      "
    >
      {/* ───────────────────────────────────────
          Header
      ─────────────────────────────────────── */}

      <div
        className="
          flex flex-col gap-3
          border-b border-line
          px-4 py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
        "
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-md
              bg-forest-50
              text-forest-700
            "
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M17 21v-8H7v8" />
              <path d="M7 3v5h8" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-ink">Saved Records</h2>

              {hasRecords && (
                <span
                  className="
                    inline-flex
                    min-w-[22px]
                    h-5
                    items-center
                    justify-center
                    rounded-full
                    bg-forest-50
                    px-1.5
                    text-[10px]
                    font-bold
                    text-forest-700
                  "
                >
                  {savedRecords.length}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Your saved expense records
            </p>
          </div>
        </div>

        {hasRecords && (
          <div
            className="
              flex items-center gap-2
              self-start
              rounded-md
              bg-success/10
              px-2.5 py-1.5
              sm:self-auto
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-success
              "
            />

            <span
              className="
                text-[10px]
                font-semibold
                text-success
              "
            >
              Stored in browser
            </span>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────
          Empty State
      ─────────────────────────────────────── */}

      {!hasRecords ? (
        <div className="px-5 py-12 text-center">
          <div
            className="
              mx-auto mb-3
              flex h-12 w-12
              items-center justify-center
              rounded-md
              bg-neutral-bg/60
              text-slate-400
            "
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M7 3v5h8" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
          </div>

          <h3 className="text-sm font-semibold text-ink">No saved records</h3>

          <p className="mx-auto mt-1 max-w-[360px] text-xs leading-5 text-slate-400">
            Fill out the form and save it to keep your expense record available
            in this browser.
          </p>
        </div>
      ) : (
        /* ─────────────────────────────────────
           Records
        ───────────────────────────────────── */

        <div className="p-3 sm:p-4">
          <div className="space-y-2">
            {savedRecords.map((r) => {
              const isSelected = selectedId === r.id;

              return (
                <div
                  key={r.id}
                  className={`
                    group relative
                    flex flex-col gap-3
                    rounded-md
                    border
                    p-3
                    transition-all
                    duration-200
                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    ${
                      isSelected
                        ? `
                          border-forest-700/25
                          bg-forest-50/60
                          shadow-[0_4px_16px_rgba(79,70,229,0.08)]
                        `
                        : `
                          border-line
                          bg-white
                          hover:border-line
                          hover:bg-neutral-bg/60
                          hover:shadow-sm
                        `
                    }
                  `}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <span
                      className="
                        absolute
                        left-0
                        top-3
                        bottom-3
                        w-0.5
                        rounded-r-full
                        bg-forest-700
                      "
                    />
                  )}

                  {/* ───────────────────────────
                      Record Info
                  ─────────────────────────── */}

                  <div
                    className="
                      min-w-0
                      flex-1
                      pl-1
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          h-2 w-2
                          shrink-0
                          rounded-full
                          ${isSelected ? "bg-forest-700" : "bg-success"}
                        `}
                      />

                      <p
                        className={`
                          truncate
                          text-sm
                          font-bold
                          ${isSelected ? "text-forest-700" : "text-ink"}
                        `}
                      >
                        {r.name || "Unnamed Record"}
                      </p>
                    </div>

                    {/* Meta */}
                    <div
                      className="
                        mt-1.5
                        flex flex-wrap
                        items-center
                        gap-x-2
                        gap-y-1
                        text-[10px]
                        text-slate-400
                      "
                    >
                      <span>
                        Voucher{" "}
                        <strong
                          className="
                            font-semibold
                            text-slate-muted
                          "
                        >
                          {r.voucherNo || "—"}
                        </strong>
                      </span>

                      <span className="text-slate-300">•</span>

                      <span>
                        Date{" "}
                        <strong
                          className="
                            font-semibold
                            text-slate-muted
                          "
                        >
                          {r.date || "—"}
                        </strong>
                      </span>

                      <span className="text-slate-300">•</span>

                      <span>
                        Saved{" "}
                        <strong
                          className="
                            font-semibold
                            text-slate-muted
                          "
                        >
                          {r.savedAt || "—"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* ───────────────────────────
                      Right Section
                  ─────────────────────────── */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      sm:justify-end
                    "
                  >
                    {/* Amount */}
                    <div className="text-left sm:text-right">
                      <p
                        className="
                          text-[9px]
                          font-medium
                          uppercase
                          tracking-wider
                          text-slate-400
                        "
                      >
                        Net Amount
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-sm
                          font-bold
                          text-success
                        "
                      >
                        ₹{r.net || "0"}
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      className="
                        hidden
                        h-8
                        w-px
                        bg-neutral-bg
                        sm:block
                      "
                    />

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {/* ─────────────────────
                          Edit
                      ───────────────────── */}

                      <button
                        type="button"
                        onClick={() => onLoad(r)}
                        aria-label={`Edit ${r.name || "record"}`}
                        title="Edit record"
                        className="
                          inline-flex
                          h-8 w-8
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-line
                          bg-white
                          text-slate-muted
                          transition-all

                          hover:border-forest-700/25
                          hover:bg-forest-50
                          hover:text-forest-700

                          active:scale-95

                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-forest-700/30
                        "
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>

                      {/* ─────────────────────
                          Print
                      ───────────────────── */}

                      <button
                        type="button"
                        onClick={() => printRecord(r, onNotify)}
                        aria-label={`Print ${r.name || "record"}`}
                        title="Print / PDF"
                        className="
                          inline-flex
                          h-8 w-8
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-line
                          bg-white
                          text-slate-muted
                          transition-all

                          hover:border-forest-700/25
                          hover:bg-forest-50
                          hover:text-forest-700

                          active:scale-95

                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-forest-700/30
                        "
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M6 9V2h12v7" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <path d="M6 14h12v8H6z" />
                        </svg>
                      </button>

                      {/* ─────────────────────
                          Delete
                      ───────────────────── */}

                      <button
                        type="button"
                        onClick={() => onDelete(r.id)}
                        aria-label={`Delete ${r.name || "record"}`}
                        title="Delete record"
                        className="
                          inline-flex
                          h-8 w-8
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-line
                          bg-white
                          text-slate-400
                          transition-all

                          hover:border-danger/30
                          hover:bg-danger/10
                          hover:text-danger

                          active:scale-95

                          focus:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-danger/30
                        "
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 15H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
