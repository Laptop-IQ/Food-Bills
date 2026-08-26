import { ROWS } from "./expenseRows";
import { Cell } from "./FormCells";
import { TD, HDR } from "./cellStyles";
import { ni } from "./numberUtils";

export default function ExpenseTable({ d, set, editing, total, net, suppVchr }) {
  return (
    <table className="w-full border-collapse">
      <colgroup>
        <col style={{ width: "17%" }} />
        <col style={{ width: "17%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "9%" }} />
        <col style={{ width: "10%" }} />
      </colgroup>
      <thead>
        <tr>
          <th
            className={HDR}
            rowSpan={3}
            style={{ textAlign: "left", verticalAlign: "middle" }}
          >
            Expense
            <br />
            Particulars
          </th>
          <th
            className={HDR}
            rowSpan={3}
            style={{ textAlign: "left", verticalAlign: "middle" }}
          >
            Standard
            <br />
            Supporting
            <br />
            Required
          </th>
          <th className={HDR} colSpan={2}>
            Expenses Paid Separately
          </th>
          <th className={HDR} colSpan={2}>
            Expenses - This Voucher
          </th>
          <th className={HDR} rowSpan={3} style={{ verticalAlign: "middle" }}>
            TOTAL
          </th>
        </tr>
        <tr>
          <th className={`${HDR} text-[9px] text-gray-500`} colSpan={2}>
            —
          </th>
          <th className={`${HDR} text-[9px] text-gray-500`} colSpan={2}>
            —
          </th>
        </tr>
        <tr>
          <th className={`${HDR} text-[10px]`}>No. of Supp</th>
          <th className={HDR}>Rs</th>
          <th className={`${HDR} text-[10px]`}>No.of Supp</th>
          <th className={HDR}>Rs.</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.ak}>
            <td className={`${TD} h-[26px]`}>{r.label}</td>
            <td
              className={`${TD} italic text-gray-500 text-[10px] whitespace-pre-line`}
            >
              {r.std}
            </td>
            {r.dash ? (
              <>
                <td className={`${TD} text-center text-gray-400`}>-</td>
                <td className={`${TD} text-center text-gray-400`}>-</td>
              </>
            ) : (
              <>
                <td className={TD}>
                  {r.psk && (
                    <Cell
                      value={d[r.psk]}
                      onChange={(v) => set(r.psk, v)}
                      editing={editing}
                      align="center"
                      numeric
                    />
                  )}
                </td>
                <td className={TD}>
                  {r.pak && (
                    <Cell
                      value={d[r.pak]}
                      onChange={(v) => set(r.pak, v)}
                      editing={editing}
                      align="right"
                      numeric
                    />
                  )}
                </td>
              </>
            )}
            <td className={TD}>
              {r.sk && (
                <Cell
                  value={d[r.sk]}
                  onChange={(v) => set(r.sk, v)}
                  editing={editing}
                  align="center"
                  numeric
                />
              )}
            </td>
            <td className={TD}>
              <Cell
                value={d[r.ak]}
                onChange={(v) => set(r.ak, v)}
                editing={editing}
                align="right"
                numeric
              />
            </td>
            <td className={`${TD} text-right text-[#1a56db] font-bold`}>
              {ni(d[r.ak]) || ""}
            </td>
          </tr>
        ))}

        {/* Spacer rows */}
        {[0, 1].map((i) => (
          <tr key={`sp${i}`}>
            {[...Array(7)].map((_, j) => (
              <td key={j} className={`${TD} h-[13px]`}></td>
            ))}
          </tr>
        ))}

        {/* TOTAL ROW */}
        <tr className="bg-[#d4d4d4]">
          <td className={`${TD} font-bold text-center`} colSpan={2}>
            TOTAL
          </td>
          <td className={TD}></td>
          <td className={TD}></td>
          <td className={TD}></td>
          <td className={TD}></td>
          <td className={`${TD} text-right text-[#1a56db] font-bold`}>
            {total || ""}
          </td>
        </tr>

        {/* Less Advance */}
        <tr>
          <td className={`${TD} text-center`} colSpan={6}>
            Less : Advance
          </td>
          <td className={TD}>
            <Cell
              value={d.lessAdvance}
              onChange={(v) => set("lessAdvance", v)}
              editing={editing}
              align="right"
              numeric
            />
          </td>
        </tr>

        {/* Net Amount */}
        <tr className="bg-[#dde7ff]">
          <td className={`${TD} font-bold text-center`} colSpan={2}>
            NET AMOUNT PAYABLE
          </td>
          <td className={`${TD} text-center text-[#1a56db] font-bold`}>0</td>
          <td className={TD}></td>
          <td className={`${TD} text-center text-[#1a56db] font-bold`}>
            {suppVchr || ""}
          </td>
          <td className={`${TD} text-center text-gray-400`}>-</td>
          <td className={`${TD} text-right text-[#1a56db] font-bold`}>
            {net || ""}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
