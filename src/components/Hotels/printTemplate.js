import { ROWS } from "./expenseRows";
import { inWords } from "./numberUtils";

export function generatePrintHTML(d, total, net, suppVchr) {
  const rows = ROWS.map((r) => {
    const c3 = r.dash ? "-" : d[r.psk] || "";
    const c4 = r.dash ? "-" : d[r.pak] || "";
    const c5 = d[r.sk] || "";
    const c6 = d[r.ak] || "";
    const dashStyle = r.dash ? "color:#999;text-align:center;" : "";
    return `<tr>
      <td style="padding:3px 5px;">${r.label}</td>
      <td style="padding:3px 5px;font-style:italic;font-size:10px;white-space:pre-line;text-align:center;">${r.std}</td>
      <td style="text-align:center;padding:3px 5px;${dashStyle}">${c3}</td>
      <td style="text-align:center;padding:3px 5px;${r.dash ? dashStyle : "color:#1a56db;font-weight:700;"}">${c4}</td>
      <td style="text-align:center;padding:3px 5px;color:#1a56db;font-weight:700;">${c5}</td>
      <td style="text-align:center;padding:3px 5px;color:#1a56db;font-weight:700;">${c6}</td>
      <td style="text-align:center;padding:3px 5px;font-weight:700;color:#1a56db;">${c6}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SF DYES - Travel Expenses Claim</title>
<style>
@page { size: A4; margin: 10mm; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Arial, Helvetica, sans-serif; background:#fff; color:#000; }
@media print { body { display:flex; justify-content:center; } }
.wrapper { width: 190mm; margin: 10px auto; border:1px solid #444; }
.company-title { text-align:center; font-size:18px; font-weight:700; padding:6px 0; border-bottom:1px solid #444; }
table { width:100%; border-collapse:collapse; }
td,th { border:1px solid #444; padding:4px 5px; font-size:11px; vertical-align:middle; }
.label { background:#efefef; font-weight:700; white-space:nowrap; }
.heading { background:#dcdcdc; font-weight:700; text-align:center; }
.blue { color:#004fc4; font-weight:700; }
.center { text-align:center; }
.bold { font-weight:700; }
.small { font-size:10px; }
.expense-table td { height:28px; }
.total-row { background:#dcdcdc; font-weight:700; }
.net-row { background:#e8e8ff; font-weight:700; }
.words-box { border:1px solid #444; border-top:0; padding:6px; font-size:11px; }
.signature-table td { height:40px; }
.footer-note { border:1px solid #444; border-top:0; padding:4px; text-align:center; font-size:9px; color:#444; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="company-title">SF DYES PVT LTD</div>
  <table>
    <colgroup><col width="16%"><col width="34%"><col width="16%"><col width="34%"></colgroup>
    <tr>
      <td class="label">Name</td>
      <td class="blue">${d.name || ""}</td>
      <td class="heading" colspan="2">TRAVEL EXPENSES CLAIM STATEMENT</td>
    </tr>
    <tr>
      <td class="label">Empl No. / Grade</td><td class="blue">${d.emplGrade || ""}</td>
      <td class="label">Voucher No. :</td><td class="center blue">${d.voucherNo || ""}</td>
    </tr>
    <tr>
      <td class="label">Bus Line / Region</td><td class="blue">NORTH - 1</td>
      <td class="label">Date :</td><td class="center blue">${d.date || ""}</td>
    </tr>
  </table>
  <table>
    <colgroup><col width="16%"><col width="16%"><col width="38%"><col width="12%"><col width="18%"></colgroup>
    <tr>
      <td class="label" rowspan="5" style="vertical-align:top">Tour Particulars</td>
      <td class="label">Places</td><td class="blue">${d.places || ""}</td>
      <td class="label">No. of days</td><td class="center blue">${d.noOfDays || ""}</td>
    </tr>
    <tr>
      <td class="label">Departure</td><td class="blue">${d.departure || ""}</td>
      <td class="label">Time</td><td class="center blue">${d.timeDep || ""}</td>
    </tr>
    <tr>
      <td class="label">Arrival</td><td class="blue">${d.arrival || ""}</td>
      <td class="label">Time</td><td class="center blue">${d.timeArr || ""}</td>
    </tr>
    <tr>
      <td class="label">Accompanied by</td><td colspan="3">${d.accompanied || ""}</td>
    </tr>
    <tr>
      <td class="label">Customer visited</td><td colspan="3" class="blue">${d.customerVisited || ""}</td>
    </tr>
  </table>
  <table class="expense-table">
    <colgroup>
      <col width="18%"><col width="18%"><col width="10%"><col width="10%">
      <col width="10%"><col width="10%"><col width="14%">
    </colgroup>
    <thead>
      <tr>
        <th class="heading" rowspan="2">Expense Particulars</th>
        <th class="heading" rowspan="2">Standard Supporting Required</th>
        <th class="heading" colspan="2">Expenses Paid Separately</th>
        <th class="heading" colspan="2">Expenses - This Voucher</th>
        <th class="heading" rowspan="2">TOTAL</th>
      </tr>
      <tr>
        <th class="heading small">No. of Supp</th>
        <th class="heading">Rs</th>
        <th class="heading small">No.of Supp</th>
        <th class="heading">Rs.</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr><td style="height:25px"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td style="height:25px"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr class="total-row">
        <td colspan="2" class="center">TOTAL</td>
        <td></td><td></td><td></td><td></td>
        <td class="center blue">${total || ""}</td>
      </tr>
      <tr>
        <td colspan="2" class="center">Less : Advance</td>
        <td></td><td></td><td></td><td></td>
        <td class="center blue">${d.lessAdvance || ""}</td>
      </tr>
      <tr class="net-row">
        <td colspan="2" class="center">NET AMOUNT PAYABLE</td>
        <td class="center"></td><td></td>
        <td class="center blue">${suppVchr || ""}</td>
        <td class="center">-</td>
        <td class="center blue">${net}</td>
      </tr>
    </tbody>
  </table>
  <div class="words-box">
    <b>Rupees in Words :</b>
    <span class="blue">${inWords(net)}</span>
  </div>
  <table class="signature-table">
    <colgroup>
      <col width="22%"><col width="10%"><col width="10%"><col width="10%">
      <col width="28%"><col width="20%">
    </colgroup>
    <tr>
      <th style="text-align:left">Accounts</th>
      <th>Recd</th><th>Disp</th><th>Sign</th>
      <th rowspan="4" style="vertical-align:top;padding-top:6px;">Visit Reports Received<br>Authorised for Payment</th>
      <th rowspan="4" style="vertical-align:bottom;padding:6px;">Received the above Amount</th>
    </tr>
    <tr><td class="bold">Auth / Monitor</td><td></td><td></td><td></td></tr>
    <tr><td class="bold">Approved for Pymt</td><td></td><td></td><td></td></tr>
    <tr><td class="bold">Paid</td><td></td><td></td><td></td></tr>
  </table>
  <div class="footer-note">
    Rout : 1 - Approval for Payment by Authority &nbsp;&nbsp;
    2 - A/cs Anith / Monitor &nbsp;&nbsp;
    3 - A/cs Approval &nbsp;&nbsp;
    4 - A/cs Payment
  </div>
</div>
</body>
</html>`;
}
