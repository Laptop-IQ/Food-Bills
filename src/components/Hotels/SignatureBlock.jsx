import { inWords } from "./numberUtils";
import { TD, LBL, HDR, BLUE_BOLD } from "./cellStyles";

export default function SignatureBlock({ net }) {
  return (
    <>
      {/* Rupees in Words */}
      <div className="border border-gray-400 border-t-0 px-[6px] py-[4px] flex gap-2 items-center">
        <span className="text-[11px] font-bold whitespace-nowrap">
          Rupees in Words :
        </span>
        <span className={`text-[11px] ${BLUE_BOLD}`}>{inWords(net)}</span>
      </div>

      {/* Signature Table */}
      <table className="w-full border-collapse">
        <colgroup>
          <col style={{ width: "22%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "29%" }} />
          <col style={{ width: "22%" }} />
        </colgroup>
        <tbody>
          <tr>
            <th className={`${HDR} text-left`}>Accounts</th>
            <th className={HDR}>Recd</th>
            <th className={HDR}>Disp</th>
            <th className={HDR}>Sign</th>
            <th className={`${HDR} text-left`}>
              Visit Reports Received
              <br />
              Authorised for Payment
            </th>
            <th className={HDR}></th>
          </tr>
          <tr>
            <td className={`${LBL} h-[32px]`}>Auth / Monitor</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td
              className={TD}
              colSpan={2}
              rowSpan={3}
              style={{
                position: "relative",
                verticalAlign: "bottom",
                padding: "4px 6px",
              }}
            >
              <span className="absolute bottom-1 right-2 text-[9px]">
                Received the above Amount
              </span>
            </td>
          </tr>
          <tr>
            <td className={`${LBL} h-[32px]`}>Approved for Pymt</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          <tr>
            <td className={`${LBL} h-[32px]`}>Paid</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="border border-gray-400 border-t-0 px-[6px] py-[3px]">
        <p className="text-[9px] text-gray-500 text-center">
          Rout : 1 - Approval for Payment by Authority &nbsp;&nbsp; 2 - A/cs
          Anith / Monitor &nbsp;&nbsp; 3 - A/cs Approval &nbsp;&nbsp; 4 - A/cs
          Payment
        </p>
      </div>
    </>
  );
}
