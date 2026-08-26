import { ROWS } from "./expenseRows";

export function buildInitialState() {
  const base = {
    name: "",
    emplGrade: "",
    busLine: "",
    voucherNo: "",
    date: "",
    places: "",
    departure: "",
    arrival: "",
    noOfDays: "01",
    timeDep: "0:00 AM",
    timeArr: "1:30 PM",
    accompanied: "",
    customerVisited: "",
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
