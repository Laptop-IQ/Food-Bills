import React, { useRef, useState } from "react";
import { Download, ChevronUp, ReceiptText, List, ShieldCheck } from "lucide-react";
import { toPng } from "html-to-image";
import "./PhonePe.css";

const initial = {
  amount: "4000",
  recipient: "Kapil",
  phone: "+91xxxxxxxx02",
  bankingName: "Prashant Mangal Bhoir",
  transactionId: "DEMO2603202146011934707593",
  account: "6502",
  utr: "751746107630",
  date: "20 Mar 2026",
  time: "09:46 PM",
};

function PhonePe() {
  const [data, setData] = useState(initial);
  const receiptRef = useRef(null);

  const update = (key) => (e) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const downloadPng = async () => {
    if (!receiptRef.current) return;
    const dataUrl = await toPng(receiptRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#0b0b0b",
    });
    const a = document.createElement("a");
    a.download = "payment-receipt-demo.png";
    a.href = dataUrl;
    a.click();
  };

  const money = Number(data.amount || 0).toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[360px_1fr]">
        {/* Controls */}
        <section className="h-fit rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-2 text-purple-700">
              <ReceiptText size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-black">PhonePe Payment</h1>

              <p className="text-xs text-black">Edit the receipt details</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              ["amount", "Amount (₹)", "4000"],
              ["recipient", "Paid to", "Kapil"],
              ["phone", "Phone number", "+917769848702"],
              ["bankingName", "Banking Name", "Prashant Mangal Bhoir"],
              ["transactionId", "Transaction ID", "DEMO260320..."],
              ["account", "Account last 4 digits", "6502"],
              ["utr", "UTR", "751746107630"],
              ["date", "Date", "20 Mar 2026"],
              ["time", "Time", "09:46 PM"],
            ].map(([key, label, placeholder]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-semibold text-black">
                  {label}
                </span>

                <input
                  value={data[key]}
                  onChange={update(key)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-black outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </label>
            ))}
          </div>

          <button
            onClick={downloadPng}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-[.99]"
          >
            <Download size={18} />
            Download PNG
          </button>
        </section>

        {/* Preview */}
        <section className="flex items-start justify-center rounded-2xl bg-slate-200 p-4 md:p-8">
          <div
            ref={receiptRef}
            className="receipt relative w-full max-w-[620px] overflow-hidden rounded-[24px] bg-[#0b0b0b] px-5 pb-7 pt-6 text-white shadow-2xl"
          >
            <div className="relative z-10">
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    src="/PhonePe.png"
                    alt="PhonePe"
                    className="h-14 w-14 object-contain"
                  />
                </div>

                <div>
                  <div className="text-[29px] font-medium">
                    Transaction Successful
                  </div>
                  <div className="text-[19px] text-white/85">
                    {data.time} on {data.date}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] bg-[#1b1b1b] px-5 py-3">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <div className="mb-6 text-[26px] font-bold">Paid to</div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-300 text-2xl font-bold text-slate-700">
                        {data.recipient.trim().charAt(0).toUpperCase() || "P"}
                      </div>
                      <div>
                        <div className="text-[25px]">{data.recipient}</div>
                        <div className="text-[19px] text-white/80">
                          {data.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-start pt-10 text-[28px] font-bold">
                    ₹{money}
                  </div>
                </div>

                <div className="border-t-2 border-white/20 py-6">
                  <div className="grid grid-cols-[170px_20px_1fr] text-[19px]">
                    <span className="text-white/70">Banking Name</span>
                    <span>:</span>
                    <span className="font-medium">
                      {data.bankingName}
                      <ShieldCheck className="ml-2 inline-block h-[21px] w-[21px] align-middle fill-green-500 stroke-black" />
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-white/20 pt-6">
                  <div className="mb-7 flex items-center gap-12 text-[24px] font-medium">
                    <div className="rounded-md border-2 border-white p-1">
                      <List size={27} />
                    </div>

                    <span>Transfer Details</span>

                    <ChevronUp size={27} className="ml-auto" />
                  </div>

                  <div className="space-y-6 text-[18px]">
                    <div>
                      <div className="mb-2 text-white/65">
                        PhonePe Transaction ID
                      </div>
                      <div className="break-all">{data.transactionId}</div>
                    </div>

                    <div>
                      <div className="mb-2 text-white/65">Debited from</div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden bg-white">
                            <img
                              src="/HDFC.png"
                              alt="Logo"
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <span>XXXXXXX{data.account}</span>
                        </div>

                        <span className="text-[25px]">₹{money}</span>
                      </div>

                      {/* Same alignment as account number */}
                      <div className="ml-[72px] mt-2 text-[19px] text-white/90">
                        UTR: {data.utr}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 text-center text-[18px] text-white/70">
                Powered by
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PhonePe;