import { ROWS } from "./expenseRows";

export function buildInitialState() {
  const base = {
    name: "SUDHIR KUMAR",
    emplGrade: "DP0286",
    busLine: "NORTH - 1",
    voucherNo: "",
    date: "04/06/2026",
    places: "KOSI KALAN",
    departure: "BAHALGARH",
    arrival: "KOSI KALAN",
    noOfDays: "01",
    timeDep: "8:00 AM",
    timeArr: "1:30 PM",
    accompanied: "",
    customerVisited: "COLOUR TOUCH, SHREE RAM DYEING & PREETI WASHING",
    boardingHSup: "",
    boardingH: "",
    dailySup: "",
    dailyAmt: "",
    lessAdvance: "",
  };
  ROWS.forEach((r) => {
    if (r.psk && base[r.psk] === undefined) base[r.psk] = "";
    if (r.pak && base[r.pak] === undefined) base[r.pak] = "";
    if (r.sk && base[r.sk] === undefined) base[r.sk] = "";
    if (r.ak && base[r.ak] === undefined) base[r.ak] = "";
  });
  return base;
}
