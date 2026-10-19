// src/pages/legal/PrivacyPolicyPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { VITE_BASE_URL } from "../../lib/constants";

const SECTIONS = [
  {
    id: "interpretation",
    title: "1. Interpretation & Definitions",
    body: (
      <>
        <h3 className="text-base font-bold text-ink mt-4 mb-2">Interpretation</h3>
        <p className="mb-4">
          Terms with initial capital letters carry specific meanings as defined
          below. These definitions apply regardless of whether they appear in
          singular or plural form.
        </p>
        <h3 className="text-base font-bold text-ink mt-6 mb-3">Definitions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account:</strong> A unique account created for you to access our service.</li>
          <li><strong>Company:</strong> Spay Fintech Pvt Ltd, Mumbai, Maharashtra, India.</li>
          <li><strong>Service:</strong> The Spay Ferry online ferry and private boat booking platform.</li>
          <li><strong>Cookies:</strong> Small files placed on your device to store browsing data.</li>
          <li><strong>Personal Data:</strong> Information that relates to an identifiable individual.</li>
        </ul>
      </>
    ),
  },
  {
    id: "collection",
    title: "2. Collection & Use of Personal Data",
    body: (
      <>
        <h3 className="text-base font-bold text-ink mt-4 mb-3">Types of Data Collected</h3>
        <h4 className="font-semibold text-ink mt-4 mb-2">Personal Data</h4>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Email address</li>
          <li>First and last name</li>
          <li>Phone number</li>
          <li>Passenger details (name, age where required by operators)</li>
          <li>Booking and payment-related information</li>
        </ul>
        <h4 className="font-semibold text-ink mt-4 mb-2">Usage Data</h4>
        <p>
          Usage data is collected automatically and may include IP address,
          browser type, pages visited, and time spent on pages. This helps us
          improve the booking experience.
        </p>
      </>
    ),
  },
  {
    id: "usage",
    title: "3. How We Use Your Data",
    body: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process and confirm your ferry or private boat bookings</li>
          <li>To communicate with you about your booking status</li>
          <li>To send booking confirmations and updates</li>
          <li>To improve our platform and customer experience</li>
          <li>To comply with applicable laws and regulations</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Data Sharing",
    body: (
      <>
        <p className="mb-4">
          We may share necessary information with relevant service providers,
          ferry operators, transport operators, and payment partners only when
          required to provide the requested services or to comply with
          applicable laws. We do not sell your personal data.
        </p>
      </>
    ),
  },
  {
    id: "grievance",
    title: "5. Grievance Redressal",
    body: (
      <>
        <p className="mb-4">
          If you have concerns regarding this Privacy Policy or the processing
          of your personal information, you may contact our Grievance Officer
          using the details below:
        </p>
        <div className="space-y-2 mb-4">
          <p><span className="font-semibold text-ink">Company:</span> Spay Fintech Pvt Ltd</p>
          <p><span className="font-semibold text-ink">Email:</span> compliance@spay.live</p>
          <p><span className="font-semibold text-ink">Contact Number:</span> +91 7977322599</p>
          <p><span className="font-semibold text-ink">Address:</span> Office-316, Floor 3, 316 Laxmi Plaza, Andheri West, Mumbai, Maharashtra 400053</p>
          <p><span className="font-semibold text-ink">Working Hours:</span> Monday to Saturday, 10:00 AM to 7:00 PM (IST)</p>
        </div>
        <p>
          You may submit your grievance with relevant details including your
          name, contact information, and a description of the concern.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const [openId, setOpenId] = useState("interpretation");

  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.22em] text-white border border-white/20 mb-5">
            <ShieldCheck size={12} className="text-crimson-light" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-powder/80 mt-4">
            Effective Date: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
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

            {/* Contact card */}
            <div className="mt-8 rounded-2xl bg-mist border-2 border-powder/50 p-6">
              <h2 className="text-xl font-black text-ink mb-3">Contact Us</h2>
              <p className="text-sm text-navy/70 mb-4">
                If you have any questions regarding this Privacy Policy:
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