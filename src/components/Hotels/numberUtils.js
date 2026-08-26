export const ni = (v) => parseInt(v) || 0;

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function toWords(n) {
  if (n === 0) return "zero";
  if (n < 20) return ONES[n];
  if (n < 100)
    return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000)
    return (
      ONES[Math.floor(n / 100)] +
      " hundred" +
      (n % 100 ? " " + toWords(n % 100) : "")
    );
  if (n < 100000)
    return (
      toWords(Math.floor(n / 1000)) +
      " thousand" +
      (n % 1000 ? " " + toWords(n % 1000) : "")
    );
  return (
    toWords(Math.floor(n / 100000)) +
    " lakh" +
    (n % 100000 ? " " + toWords(n % 100000) : "")
  );
}

export function inWords(v) {
  const n = parseInt(v) || 0;
  if (!n) return "";
  const w = toWords(n);
  return "Only " + w[0].toUpperCase() + w.slice(1);
}
