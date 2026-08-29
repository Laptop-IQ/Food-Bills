import React, { useState } from 'react';
import { Printer, Pencil, Save } from 'lucide-react';

export default function AgodaReceiptOriginal() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    address: `Agoda Company Pte, Ltd.\n36 Robinson Road\nCity House #20-01\nSingapore 068877`,
    bookingNo: '1908719337',
    paymentDate: 'June 14, 2025',
    name: 'Karandeep Singh',
    billingAddress: '-',
    email: 'karanbhinder991@gmail.com',
    hotelName: 'HOTEL DELHI 55 @ NEW DELHI RAILWAY STATION',
    period: 'June 15, 2025 - June 16, 2025 ((1 night(s)))',
    totalRoomCharges: '1,325.76',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const Field = ({ field, value, className = '' }) => {
    if (!isEditing) {
      return <span className={className}>{value}</span>;
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`w-full border border-blue-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50 ${className}`}
      />
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-4 flex flex-col items-center">
      <style>{`
  @page {
    size: A4 portrait;
    margin: 8mm;
  }

  @media print {
    html,
    body {
      width: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
    }

    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Hide everything except receipt */
    body * {
      visibility: hidden !important;
    }

    .receipt-page,
    .receipt-page * {
      visibility: visible !important;
    }

    /* Position receipt at the printable area */
    .receipt-page {
      display: block !important;
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;

      width: 100% !important;
      max-width: none !important;
      min-height: 0 !important;
      height: auto !important;

      margin: 0 !important;
      padding: 7mm !important;

      background: #fff !important;
      box-shadow: none !important;

      box-sizing: border-box !important;

      color: #1f2937 !important;
      font-size: 11px !important;
      line-height: 1.25 !important;

      overflow: visible !important;
    }

    /* Hide buttons */
    .no-print {
      display: none !important;
    }

    /* Tables */
    .receipt-page table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-bottom: 4mm !important;
    }

    .receipt-page th,
    .receipt-page td {
      padding: 4px 6px !important;
      font-size: 11px !important;
      line-height: 1.2 !important;
    }

    .receipt-page table,
    .receipt-page tr,
    .receipt-page td,
    .receipt-page th {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Logo */
    .receipt-page img[alt="Agoda"] {
      width: 105px !important;
      max-width: 105px !important;
      height: auto !important;
    }

    /* Signature */
    .receipt-page img[alt="Authorized Stamp & Signature"] {
      width: 110px !important;
      max-width: 110px !important;
      height: auto !important;
    }

    /* Heading */
    .receipt-page h1 {
      font-size: 18px !important;
      margin-top: 4mm !important;
      margin-bottom: 4mm !important;
    }

    /* Spacing */
    .receipt-page .mt-10 {
      margin-top: 5mm !important;
    }

    .receipt-page .mt-8 {
      margin-top: 5mm !important;
    }

    .receipt-page .mt-6 {
      margin-top: 4mm !important;
    }

    .receipt-page .mt-4 {
      margin-top: 3mm !important;
    }

    .receipt-page .mb-6 {
      margin-bottom: 4mm !important;
    }

    /* Inputs / textarea should print as normal text */
    .receipt-page input,
    .receipt-page textarea {
      border: none !important;
      outline: none !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      margin: 0 !important;

      color: #1f2937 !important;
      font-family: inherit !important;
      font-size: 11px !important;

      width: auto !important;
      max-width: 100% !important;
    }

    .receipt-page textarea {
      resize: none !important;
    }

    /* Address */
    .receipt-page .leading-snug {
      line-height: 1.2 !important;
    }

    /* Footer */
    .receipt-page > p:last-child {
      margin-top: 9mm !important;
      font-size: 9px !important;
    }
  }
`}</style>
      {/* Receipt */}
      <div className="receipt-page w-full max-w-3xl bg-white shadow-md px-10 py-10 text-gray-800 text-sm">
        {/* Logo */}
        <div className="flex justify-end">
          <img
            src="/agoda-logo.png"
            alt="Agoda"
            className="w-42 h-auto object-contain"
          />
        </div>

        {/* Address */}
        <div className="leading-snug mt-4">
          <p>Address:</p>

          {isEditing ? (
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={4}
              className="w-full max-w-sm border border-blue-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50 resize-none"
            />
          ) : (
            <p className="whitespace-pre-line">{formData.address}</p>
          )}
        </div>

        {/* Booking info */}
        <div className="mt-6 space-y-2">
          <div className="flex gap-2 items-center">
            <span className="w-28 shrink-0">Booking No.</span>

            <Field field="bookingNo" value={formData.bookingNo} />
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-28 shrink-0">Payment Date</span>

            <Field field="paymentDate" value={formData.paymentDate} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-medium mt-8 mb-6">Receipt</h1>

        {/* Customer table */}
        <table className="w-full border border-gray-400 border-collapse mb-6">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border border-gray-400 bg-gray-200 py-2 text-center font-medium"
              >
                Customer Name & Address
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Name */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 w-1/3 align-top">
                Name
              </td>

              <td className="border border-gray-400 px-4 py-2 align-top">
                <Field field="name" value={formData.name} />
              </td>
            </tr>

            {/* Billing Address */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                Billing Address
              </td>

              <td className="border border-gray-400 px-4 py-2 align-top">
                <Field field="billingAddress" value={formData.billingAddress} />
              </td>
            </tr>

            {/* Email */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                Email Address
              </td>

              <td className="border border-gray-400 px-4 py-2 align-top">
                <Field field="email" value={formData.email} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Description table */}
        <table className="w-full border border-gray-400 border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-gray-200 px-4 py-2 text-center font-medium">
                Description
              </th>

              <th className="border border-gray-400 bg-gray-200 px-4 py-2 text-right font-medium w-40">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Hotel Name */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                <div className="flex gap-2">
                  <span className="w-32 shrink-0">Hotel Name</span>

                  <Field field="hotelName" value={formData.hotelName} />
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Period */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                <div className="flex gap-2">
                  <span className="w-32 shrink-0">Period</span>

                  <Field field="period" value={formData.period} />
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Room Type */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                <div className="flex gap-2">
                  <span className="w-32 shrink-0">Room Type</span>
                  <span>Deluxe</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Rooms */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                <div className="flex gap-2">
                  <span className="w-32 shrink-0"># of Rms.</span>
                  <span>1</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Extra Beds */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 align-top">
                <div className="flex gap-2">
                  <span className="w-32 shrink-0"># of Extra Beds</span>
                  <span>0</span>
                </div>
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Total Room Charges */}
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                Total Room Charges
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                INR{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.totalRoomCharges}
                    onChange={(e) =>
                      handleChange("totalRoomCharges", e.target.value)
                    }
                    className="w-28 text-right border border-blue-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50"
                  />
                ) : (
                  formData.totalRoomCharges
                )}
              </td>
            </tr>

            {/* Extra Bed Charges */}
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                Total Extra Bed Charges
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                INR 0.00
              </td>
            </tr>

            {/* Grand Total */}
            <tr>
              <td className="border border-gray-400 border-t-2 border-t-gray-600 px-4 py-2 text-right font-semibold">
                GRAND TOTAL
              </td>

              <td className="border border-gray-400 border-t-2 border-t-gray-600 px-4 py-2 text-right font-semibold">
                INR {formData.totalRoomCharges}
              </td>
            </tr>

            {/* Total Charge */}
            <tr>
              <td className="border border-gray-400 px-4 py-2 text-right font-semibold">
                Total Charge
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right font-semibold">
                INR {formData.totalRoomCharges}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature */}
        <div className="flex justify-end mt-10">
          <div className="text-center relative">
            <img
              src="/signature.png"
              alt="Authorized Stamp & Signature"
              className="w-42 h-auto object-contain mx-auto"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-24">
          This receipt is automatically generated.
        </p>
      </div>

      {/* Buttons */}
      <div className="no-print mt-5 flex gap-3">
        {/* Edit / Save */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm transition-colors ${
            isEditing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit Receipt
            </>
          )}
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
      </div>
    </div>
  );
}
