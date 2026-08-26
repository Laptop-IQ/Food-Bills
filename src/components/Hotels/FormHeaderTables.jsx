import { Cell, NormalCell } from "./FormCells";
import { TD, LBL, HDR } from "./cellStyles";

export default function FormHeaderTables({ d, set, editing }) {
  return (
    <div className="w-full bg-white">
      {/* ─────────────────────────────────────────
          Company Header
      ───────────────────────────────────────── */}

      <div
        className="
          relative
          flex items-center justify-center
          border-b-2 border-slate-700
          bg-gradient-to-b
          from-slate-50
          to-slate-100
          px-3 py-2
          text-center
        "
      >
        {/* Decorative accent */}
        <span
          className="
            absolute left-0 top-0
            h-0.5 w-full
            bg-gradient-to-r
            from-indigo-600
            via-violet-500
            to-indigo-600
            print:hidden
          "
        />

        <div>
          <div
            className="
              text-[14px]
              font-black
              tracking-[3px]
              text-slate-900
            "
          >
            SF DYES PVT LTD
          </div>

          <div
            className="
              mt-0.5
              hidden
              text-[8px]
              font-medium
              uppercase
              tracking-[2px]
              text-slate-400
              print:hidden
              sm:block
            "
          >
            Travel & Expense Management
          </div>
        </div>

        {/* Editing status */}
        {editing && (
          <div
            className="
              absolute right-2
              hidden items-center gap-1.5
              rounded-full
              border border-emerald-200
              bg-emerald-50
              px-2 py-1
              text-[8px] font-bold
              uppercase tracking-wide
              text-emerald-700
              print:hidden
              sm:flex
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Editing
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────
          Employee / Voucher Information
      ───────────────────────────────────────── */}

      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "36%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "36%" }} />
        </colgroup>

        <tbody>
          {/* Name + Title */}
          <tr>
            <td className={LBL}>Name</td>

            <td className={TD}>
              <Cell
                value={d.name}
                onChange={(v) => set("name", v)}
                editing={editing}
              />
            </td>

            <td
              className={`
                ${HDR}
                relative
                overflow-hidden
              `}
              colSpan={2}
            >
              <span
                className="
                  relative z-10
                  font-black
                  tracking-wide
                "
              >
                TRAVEL EXPENSES CLAIM STATEMENT
              </span>

              {/* Modern screen-only accent */}
              <span
                className="
                  absolute bottom-0 left-1/2
                  h-0.5 w-12
                  -translate-x-1/2
                  bg-indigo-500
                  print:hidden
                "
              />
            </td>
          </tr>

          {/* Employee Grade + Voucher */}
          <tr>
            <td className={LBL}>Empl No. / Grade</td>

            <td className={TD}>
              <NormalCell
                value={d.emplGrade}
                onChange={(v) => set("emplGrade", v)}
                editing={editing}
              />
            </td>

            <td className={LBL}>Voucher No. :</td>

            <td className={TD}>
              <NormalCell
                value={d.voucherNo}
                onChange={(v) => set("voucherNo", v)}
                editing={editing}
              />
            </td>
          </tr>

          {/* Business Line + Date */}
          <tr>
            <td className={LBL}>Bus Line / Region</td>

            <td className={TD}>
              <Cell
                value={d.busLine}
                onChange={(v) => set("busLine", v)}
                editing={editing}
              />
            </td>

            <td className={LBL}>Date :</td>

            <td className={TD}>
              <Cell
                value={d.date}
                onChange={(v) => set("date", v)}
                editing={editing}
                align="center"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ─────────────────────────────────────────
          Tour Particulars
      ───────────────────────────────────────── */}

      <div
        className="
          relative
          border-t border-slate-300
        "
      >
        {/* Screen-only section indicator */}
        <div
          className="
            pointer-events-none
            absolute left-0 top-0
            hidden h-0.5 w-full
            bg-gradient-to-r
            from-slate-300
            via-indigo-400
            to-slate-300
            print:hidden
          "
        />

        <table className="w-full border-collapse">
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "37%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "21%" }} />
          </colgroup>

          <tbody>
            {/* Places */}
            <tr>
              <td
                className={LBL}
                rowSpan={5}
                style={{
                  verticalAlign: "top",
                  paddingTop: 5,
                }}
              >
                <span className="font-black">Tour</span>

                <br />

                <span>Particulars</span>
              </td>

              <td className={LBL}>Places</td>

              <td className={TD}>
                <Cell
                  value={d.places}
                  onChange={(v) => set("places", v)}
                  editing={editing}
                />
              </td>

              <td className={LBL}>No. of days</td>

              <td className={TD}>
                <Cell
                  value={d.noOfDays}
                  onChange={(v) => set("noOfDays", v)}
                  editing={editing}
                  align="center"
                />
              </td>
            </tr>

            {/* Departure */}
            <tr>
              <td className={LBL}>Departure</td>

              <td className={TD}>
                <Cell
                  value={d.departure}
                  onChange={(v) => set("departure", v)}
                  editing={editing}
                />
              </td>

              <td className={LBL}>Time</td>

              <td className={TD}>
                <Cell
                  value={d.timeDep}
                  onChange={(v) => set("timeDep", v)}
                  editing={editing}
                  align="center"
                />
              </td>
            </tr>

            {/* Arrival */}
            <tr>
              <td className={LBL}>Arrival</td>

              <td className={TD}>
                <Cell
                  value={d.arrival}
                  onChange={(v) => set("arrival", v)}
                  editing={editing}
                />
              </td>

              <td className={LBL}>Time</td>

              <td className={TD}>
                <Cell
                  value={d.timeArr}
                  onChange={(v) => set("timeArr", v)}
                  editing={editing}
                  align="center"
                />
              </td>
            </tr>

            {/* Accompanied By */}
            <tr>
              <td className={LBL}>Accompanied by</td>

              <td className={TD} colSpan={3}>
                <NormalCell
                  value={d.accompanied}
                  onChange={(v) => set("accompanied", v)}
                  editing={editing}
                />
              </td>
            </tr>

            {/* Customer Visited */}
            <tr>
              <td className={LBL}>Customer visited</td>

              <td className={TD} colSpan={3}>
                <Cell
                  value={d.customerVisited}
                  onChange={(v) => set("customerVisited", v)}
                  editing={editing}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
