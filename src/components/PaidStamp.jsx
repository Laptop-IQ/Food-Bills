import React from "react";

export default function PaidStamp({ show }) {
  if (!show) return null;

  return (
    <div className="flex justify-center my-3">
      <div
        className="paid-stamp inline-block rounded-md border-[3px] border-[#c8202c] px-5 py-1.5"
        style={{
          outline: "1.5px solid #c8202c",
          outlineOffset: "3px",
          transform: "rotate(-8deg)",
        }}
      >
        <span
          className="block font-black uppercase leading-none text-[#c8202c]"
          style={{
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontSize: "22px",
            letterSpacing: "0.3em",
          }}
        >
          Paid
        </span>
      </div>
    </div>
  );
}
