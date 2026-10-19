// src/pages/legal/RefundCancellationPage.jsx
import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { VITE_BASE_URL } from "../../lib/constants";

const SECTIONS = [
  {
    id: "scope",
    title: "1. Scope",
    body: (
      <p>
        This policy applies to all ferry and private boat bookings made through
        Spay Ferry. By using our booking services, you agree to the terms
        mentioned below.
      </p>
    ),
  },
  {
    id: "cancellation",
    title: "2. Cancellation Policy",
    body: (
      <>
        <p className="mb-4">
          Any refund amount will be credited back to the same account used for
          the booking. Our cancellation policy is as follows:
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>More than 48 hours before departure:</strong> Rs. 200 per
            passenger cancellation fee (no charges for kids below 1 year).
          </li>
          <li>
            <strong>Between 24 and 48 hours before departure:</strong> 50% of
            the fare collected will be refunded.
          </li>
          <li>
            <strong>Within 24 hours of departure:</strong> No refund will be
            given.
          </li>
          <li>
            <strong>No-show:</strong> No refund will be provided.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "refund",
    title: "3. Refund Policy",
    body: (
      <>
        <h3 className="text-base font-bold text-ink mt-4 mb-3">
          Refund Eligibility
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Duplicate payment made by the customer</li>
          <li>Failed transaction where amount was deducted but service was not delivered</li>
          <li>Booking cancellation approved as per the cancellation policy above</li>
          <li>Operator-cancelled sailings (full refund)</li>
          <li>Fraudulent or unauthorized transactions verified after investigation</li>
        </ul>

        <h3 className="text-base font-bold text-ink mt-6 mb-3">
          Refund Processing Time
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Approved refunds are generally processed within 5–10 business days.</li>
          <li>The refunded amount is credited to the original payment method.</li>
          <li>Processing time may vary based on your bank, card issuer, or payment provider.</li>
        </ul>

        <h3 className="text-base font-bold text-ink mt-6 mb-3">
          Non-Refundable Situations
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Services already availed or completed</li>
          <li>Bookings cancelled within 24 hours of departure</li>
          <li>No-show passengers</li>
          <li>Transactions declined due to customer-side issues</li>
          <li>Requests made beyond the permitted refund period</li>
        </ul>
      </>
    ),
  },
  {
    id: "failed",
    title: "4. Failed Transactions",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li>
          If a transaction fails but the amount is debited, the amount is
          usually auto-reversed by the bank within 5–7 business days.
        </li>
        <li>
          If the reversal is not received within the specified period, contact
          your bank or our support team with transaction details.
        </li>
      </ul>
    ),
  },
  {
    id: "chargebacks",
    title: "5. Chargebacks & Disputes",
    body: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Customers may raise disputes for unauthorized or incorrect transactions.</li>
        <li>We reserve the right to request supporting documents and transaction proof during investigation.</li>
        <li>Fraudulent chargeback claims may result in suspension of services or legal action.</li>
      </ul>
    ),
  },
  {
    id: "operator",
    title: "6. Operator Responsibility",
    body: (
      <>
        <p className="mb-4">
          Ferry operators using our platform are responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Service delivery as scheduled</li>
          <li>Communication of any changes or cancellations</li>
          <li>Compliance with applicable maritime laws and regulations</li>
        </ul>
        <p>
          Spay Ferry facilitates booking and transaction processing. Operator-
          related disputes are resolved in coordination with the respective
          operator.
        </p>
      </>
    ),
  },
];

export default function RefundCancellationPage() {
  const [openId, setOpenId] = useState("scope");

  return (
    <div className="bg-mist min-h-screen">
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.22em] text-white border border-white/20 mb-5">
            <RotateCcw size={12} className="text-crimson-light" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Refund &amp; Cancellation
          </h1>
          <p className="text-powder/80 mt-4">
            Effective Date: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="container-x -mt-10 relative z-10 pb-20 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-modal p-6 md:p-10">
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const open = openId === section.id;
              return (
                <div
                  key={section.id}
                  className={`border-2 rounded-2xl overflow-hidden transition-colors ${
                    open ? "border-steel" : "border-powder/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(open ? null : section.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-mist/50 transition-colors"
                  >
                    <h2 className="font-bold text-ink text-base md:text-lg pr-4">
                      {section.title}
                    </h2>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-crimson transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                      open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-sm text-navy/70 leading-relaxed">
                      {section.body}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 rounded-2xl bg-mist border-2 border-powder/50 p-6">
              <h2 className="text-xl font-black text-ink mb-3">Contact Us</h2>
              <p className="text-sm text-navy/70 mb-4">
                If you have any questions regarding this Refund &amp; Cancellation Policy:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-ink">Email: </span>
                  <a href="mailto:inquiry@spay.live" className="text-crimson hover:underline">
                    inquiry@spay.live
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-ink">Website: </span>
                  <a href={VITE_BASE_URL} className="text-crimson hover:underline">
                    { VITE_BASE_URL }
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}