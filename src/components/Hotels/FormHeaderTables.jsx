import { Cell, NormalCell } from "./FormCells";
import { TD, LBL, HDR } from "./cellStyles";

export default function FormHeaderTables({ d, set, editing }) {
  return (
    <>
      {/* Company Heading */}
      <div className="text-center font-black text-[14px] tracking-[3px] py-[6px] border-b-2 border-gray-600 bg-gray-100">
        SF DYES PVT LTD
      </div>

      {/* ── Top Info Table ── */}
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "36%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "36%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className={LBL}>Name</td>
            <td className={TD}>
              <Cell
                value={d.name}
                onChange={(v) => set("name", v)}
                editing={editing}
              />
            </td>
            <td className={HDR} colSpan={2}>
              TRAVEL EXPENSES CLAIM STATEMENT
            </td>
          </tr>
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

      {/* ── Tour Particulars ── */}
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "37%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "21%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td
              className={LBL}
              rowSpan={5}
              style={{ verticalAlign: "top", paddingTop: 5 }}
            >
              Tour
              <br />
              Particulars
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
    </>
  );
}
