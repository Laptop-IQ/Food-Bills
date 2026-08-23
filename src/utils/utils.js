import { toWords } from "number-to-words";

export const getCurrentDateTime = () => {
  const now = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(now.getDate()).padStart(2, "0");
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

export const getNextBillNo = (lastSerial) => {
  const next = lastSerial + 35;
  return { billNo: `FR65/2627/${String(next).padStart(6, "0")}`, serial: next };
};

export const generateOrderId = () => {
  const prefix = "czh83eZ55qY0FK";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++)
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  return prefix + suffix;
};

export const convertAmountToWords = (amount) => {
  const rupees = Math.floor(amount);
  const paisa = Math.round((amount - rupees) * 100);
  return `${toWords(rupees)} Indian rupee and ${toWords(paisa)} Paisa only`;
};
