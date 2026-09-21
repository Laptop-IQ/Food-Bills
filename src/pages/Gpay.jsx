import React, { useRef, useState } from "react";
import { Download, ChevronDown, Bell, BellRing } from "lucide-react";
import { toPng } from "html-to-image";
import "./Gpay.css";

const initial = {
  name: "Mosin Kausar Sayyed",
  amount: "20",
  date: "11 Sept 2026",
  time: "6:35 pm",
  bank: "HDFC Bank",
  last4: "6502",
  upiId: "129430846009",
  receiverUpi: "••••36rj@ptys",
  sender: "Sandeep Sanjay Harad",
  senderBank: "HDFC Bank",
  senderUpi: "••••94-1@okhdfcbank",
  googleId: "CICAgPiyV8fEMQ",
};

function Gpay() {
  const [data, setData] = useState(initial);
  const receiptRef = useRef(null);

  const updateField = (key) => (e) => {
    setData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const downloadPNG = async () => {
    try {
      if (!receiptRef.current) return;

      const dataUrl = await toPng(receiptRef.current, {
        pixelRatio: 2,
        backgroundColor: "#121212",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = "upi-payment-demo.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("PNG download failed:", error);
    }
  };

  const formattedAmount = Number(data.amount || 0).toLocaleString("en-IN");

  const fields = {
    name: "Recipient name",
    amount: "Amount (₹)",
    date: "Date",
    time: "Time",
    bank: "Bank",
    last4: "Account last 4",
    upiId: "UPI transaction ID",
    receiverUpi: "Receiver UPI",
    sender: "Sender name",
    senderBank: "Sender bank",
    senderUpi: "Sender UPI",
    googleId: "Google transaction ID",
  };

  return (
    <div className="min-h-screen bg-slate-200 p-5 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[350px_390px] lg:justify-center">
        {/* ================= FORM ================= */}
        <div className="h-fit rounded-2xl bg-white p-5 shadow-xl">
          <h1 className="text-xl font-bold text-black">UPI Payment Demo</h1>

          <p className="mb-5 text-sm text-black">
            Edit fields and download the mock receipt.
          </p>

          <div>
            {Object.entries(fields).map(([key, label]) => (
              <label className="mb-3 block" key={key}>
                <span className="mb-1 block text-xs font-semibold text-black">
                  {label}
                </span>

                <input
                  type="text"
                  value={data[key]}
                  onChange={updateField(key)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-black outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </label>
            ))}
          </div>

          <button
            onClick={downloadPNG}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            <Download size={18} />
            Download PNG
          </button>
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="flex justify-center">
          <div
            ref={receiptRef}
            className="phone relative w-[390px] overflow-hidden bg-[#121212] text-white shadow-2xl"
          >
            <div className="relative z-10 px-5 pb-10 pt-20">
              {/* ================= TOP ================= */}
              <div className="text-center">
                {/* Avatar */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-fuchsia-500 text-4xl">
                  {data.name.charAt(0).toUpperCase()}
                </div>

                {/* Recipient */}
                <div className="mt-4 text-[19px]">To {data.name}</div>

                {/* Amount */}
                <div className="mt-7 text-[62px] font-light leading-none">
                  ₹{formattedAmount}
                </div>

                {/* Pay Again */}
                <div className="mt-8 inline-flex rounded-full bg-blue-300 px-9 py-4 text-[18px] text-blue-950">
                  Pay again
                </div>

                {/* Completed */}
                <div className="mt-9 flex items-center justify-center gap-3 text-[19px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
                    ✓
                  </span>
                  Completed
                </div>

                {/* Divider */}
                <div className="mx-auto mt-4 h-px w-[66%] bg-white/20" />

                {/* Date */}
                <div className="mt-5 text-[17px]">
                  {data.date}, {data.time}
                </div>
              </div>

              {/* ================= PAYMENT CARD ================= */}
              <div className="mt-7 overflow-hidden rounded-[22px] border border-white/25">
                {/* Bank Header */}
                <div className="flex items-center gap-4 border-b border-white/20 px-5 py-3">
                  <div className="flex h-12 w-16 items-center justify-center rounded-md bg-white text-xl font-bold text-red-600">
                    <img
                      src="/HDFC.png"
                      alt="Logo"
                      className="h-12 w-full object-contain"
                    />
                  </div>

                  <div className="text-[20px]">
                    {data.bank} {data.last4}
                  </div>

                  <ChevronDown className="ml-auto" size={24} />
                </div>

                {/* Completed Message */}
                <div className="flex gap-4 bg-[#1b1b1b] px-5 py-6">
                  <BellRing className="shrink-0 text-blue-300" size={28} />

                  <div>
                    <div className="text-[18px]">
                      Payment of ₹{formattedAmount} completed
                    </div>

                    <div className="mt-3 text-[14px] leading-6 text-white/65">
                      Receiver's bank has confirmed deposit of money to{" "}
                      {data.name}'s bank account
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-7 px-5 py-7 text-[16px] leading-6">
                  {/* UPI ID */}
                  <div>
                    <div className="text-white/75">UPI transaction ID</div>

                    <div className="mt-2 break-all">{data.upiId}</div>
                  </div>

                  {/* Receiver */}
                  <div>
                    <div>
                      <b>To: {data.name}</b>
                    </div>

                    <div className="break-all">{data.receiverUpi}</div>
                  </div>

                  {/* Sender */}
                  <div>
                    <div>
                      <b>
                        From: {data.sender} ({data.senderBank})
                      </b>
                    </div>

                    <div className="break-all">{data.senderUpi}</div>
                  </div>

                  {/* Google Transaction ID */}
                  <div>
                    <div className="text-white/75">Google transaction ID</div>

                    <div className="break-all">{data.googleId}</div>
                  </div>
                </div>
              </div>

              {/* ================= FOOTER ================= */}

              <div className="mt-10 text-center text-[7px] tracking-wider text-white/60">
                POWERED BY
              </div>

              <div className="flex justify-center">
                <img
                  src="/upi.png"
                  alt="UPI"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>

              <div className="mt-24 flex items-center justify-center text-2xl font-medium tracking-tight">
                <img
                  src="/Gpay.png"
                  alt="Google"
                  className="-mr-1 h-7 w-auto object-contain"
                />
                <span className="text-[#fafcfd]">Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gpay;
