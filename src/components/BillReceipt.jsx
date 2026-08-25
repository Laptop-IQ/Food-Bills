import React from "react";
import { convertAmountToWords } from "../utils/utils";
import PaidStamp from "./PaidStamp";

const hasValue = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";

export default function BillReceipt({
  bill,
  items,
  activeFontCss,
  fontSize,
  totals,
  showActions = true,
  onPrintAndSave,
  onSaveOnly,
  storageStatus,
}) {
  const { subtotal, cgst, sgst, grandTotal, roundedAmount, totalQty } = totals;
  const amountInWords = convertAmountToWords(grandTotal);

  return (
    <div
      id="thermalBill"
      className="relative overflow-hidden bg-white w-[320px] h-auto p-4 shadow-lg text-black inline-block"
      style={{ fontFamily: activeFontCss, fontSize: `${fontSize}px` }}
    >
      <div className="text-center">
        <h1 className="font-bold" style={{ fontSize: `${fontSize * 2}px` }}>
          {bill.title}
        </h1>
        {hasValue(bill.branch) && <p className="font-bold">{bill.branch}</p>}
        {hasValue(bill.franchise) && (
          <p className="font-bold leading-5">{bill.franchise}</p>
        )}
        {hasValue(bill.address1) && <p>{bill.address1}</p>}
        {hasValue(bill.address2) && <p>{bill.address2}</p>}
        {hasValue(bill.city) && <p>{bill.city}</p>}
        {hasValue(bill.phone) && <p>Contact No: {bill.phone}</p>}
        {hasValue(bill.email) && <p>Email: {bill.email}</p>}
        {hasValue(bill.gst) && <p>GST IN {bill.gst}</p>}
        <p>{bill.date}</p>
        {hasValue(bill.dine) && (
          <p
            className="font-bold mt-1"
            style={{ fontSize: `${fontSize * 1.5}px` }}
          >
            {bill.dine}
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div className="text-center">
        <p className="font-bold" style={{ fontSize: `${fontSize * 1.5}px` }}>
          Bill No : {bill.billNo}
        </p>
        {hasValue(bill.orderId) && (
          <p className="font-bold" style={{ fontSize: `${fontSize * 1.33}px` }}>
            Order Id: {bill.orderId}
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div
        className="flex justify-between font-bold"
        style={{ fontSize: `${fontSize * 1.25}px` }}
      >
        {hasValue(bill.table) && <span>Table: {bill.table}</span>}
        {hasValue(bill.user) && <span>User : {bill.user}</span>}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div>
        <div
          className="flex font-bold mb-2"
          style={{ fontSize: `${fontSize * 1.25}px` }}
        >
          <div className="w-[50%]">Item</div>
          <div className="w-[15%] text-center">Qty</div>
          <div className="w-[15%] text-center">Rate</div>
          <div className="w-[20%] text-right">Total</div>
        </div>
        {items.map((item, index) => (
          <div key={item.id} className="mb-1">
            <div className="flex">
              <div className="w-[50%]">
                {index + 1}. {item.name}
              </div>
              <div className="w-[15%] text-center">{item.qty}</div>
              <div className="w-[15%] text-center">{item.rate}</div>
              <div className="w-[20%] text-right">
                {(item.qty * item.rate).toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <div style={{ fontSize: `${fontSize * 1.17}px` }}>
        <div className="flex justify-between">
          <div className="flex">
            <span className="font-bold">Total :</span>
            <span className="ml-26">{totalQty}</span>
          </div>
          <div>Rs {subtotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-end mt-1">
          CGST (2.5%) : Rs {cgst.toFixed(2)}
        </div>
        <div className="flex justify-end mt-1">
          SGST (2.5%) : Rs {sgst.toFixed(2)}
        </div>
        <div className="text-right mt-5">
          <h1
            className="font-bold"
            style={{ fontSize: `${fontSize * 1.67}px` }}
          >
            Grand Total : Rs {grandTotal.toFixed(2)}
          </h1>
          <p className="mt-2">Rounded Amount : {roundedAmount}</p>
          <p className="italic mt-2 leading-6 capitalize">{amountInWords}</p>
        </div>
      </div>

      <div className="border-t border-dashed border-black my-2" />

      <PaidStamp show={bill.paid} />

      <div className="text-center">
        <p>E&amp;OE. Thank you. Visit Again.</p>
        <p className="mt-3">Powered by TMBill v7.4.80</p>
      </div>

      {showActions && (
        <div className="mt-4 flex flex-col gap-2 no-print">
          <button
            onClick={onPrintAndSave}
            className="w-full bg-black text-white py-2 rounded text-lg font-bold"
          >
            🖨️ Print &amp; Save Bill
          </button>
          <button
            onClick={onSaveOnly}
            className="w-full bg-green-600 text-white py-2 rounded text-lg font-bold"
          >
            💾 Save Only
          </button>
          {storageStatus && (
            <p className="text-center text-sm font-semibold mt-1">
              {storageStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
