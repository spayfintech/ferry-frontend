// src/pages/legal/TermsConditionsPage.jsx
import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { VITE_BASE_URL } from "../../lib/constants";

const SECTIONS = [
  {
    id: "welcome",
    title: "1. Welcome to Spay Ferry",
    body: (
      <>
        <p className="mb-4">
          These Terms &amp; Conditions govern your use of the Spay Ferry website
          and booking services operated by Spay Fintech Pvt Ltd, accessible at
          { VITE_BASE_URL }.
        </p>
        <p className="mb-4">
          By accessing this website, you acknowledge and accept these terms and
          conditions. If you do not agree to all the terms outlined on this
          page, please refrain from using Spay Ferry.
        </p>
        <p className="mb-4">
          Terminology: "Client," "You," and "Your" refer to the individual
          accessing this website and accepting the Company's terms. "The
          Company," "We," "Our," and "Us" refer to Spay Fintech Pvt Ltd.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "2. Cookies",
    body: (
      <p>
        We utilize cookies on our website. By accessing Spay Ferry, you consent
        to the use of cookies in accordance with our Privacy Policy. Most
        interactive websites employ cookies to enhance user experience. Some of
        our affiliate partners may also use cookies.
      </p>
    ),
  },
  {
    id: "license",
    title: "3. License",
    body: (
      <>
        <p className="mb-4">
          Unless otherwise stated, Spay Fintech Pvt Ltd and/or its licensors own
          the intellectual property rights for all content on Spay Ferry. All
          rights are reserved. You may not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Republish material from Spay Ferry</li>
          <li>Sell, rent, or sub-license material from Spay Ferry</li>
          <li>Reproduce, duplicate, or copy material from Spay Ferry</li>
          <li>Redistribute content from Spay Ferry</li>
        </ul>
      </>
    ),
  },
  {
    id: "booking",
    title: "4. Booking Terms",
    body: (
      <>
        <p className="mb-4">
          All ferry and private boat bookings made through Spay Ferry are
          subject to the following:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Bookings are subject to availability of seats at the time of reservation</li>
          <li>Passenger details provided must be accurate and match valid government ID</li>
          <li>Payment is collected on boarding unless otherwise specified</li>
          <li>Booking confirmation is issued on successful reservation</li>
          <li>Operators may reschedule or cancel services due to weather, technical, or operational reasons</li>
        </ul>
      </>
    ),
  },
  {
    id: "conduct",
    title: "5. User Conduct",
    body: (
      <>
        <p className="mb-4">By using our platform, you agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide false or misleading passenger information</li>
          <li>Book multiple seats with intent to resell</li>
          <li>Interfere with the proper functioning of the website</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    title: "6. Content Liability",
    body: (
      <p>
        We shall not be held responsible for any content that appears on your
        website or third-party sites linked from our platform. We reserve the
        right to request removal of any link to our website at any time.
      </p>
    ),
  },
  {
    id: "reservation",
    title: "7. Reservation of Rights",
    body: (
      <p>
        We reserve the right to request removal of any links to our website. You
        agree to promptly remove all links upon request. We also reserve the
        right to amend these terms and conditions at any time.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "8. Disclaimer",
    body: (
      <>
        <p className="mb-4">
          To the fullest extent permitted by applicable law, we disclaim all
          representations, warranties, and conditions related to our website
          and its use.
        </p>
        <p>
          As long as the website and the information and services it provides
          are offered free of charge, we will not be liable for any loss or
          damage of any nature arising from use of our services.
        </p>
      </>
    ),
  },
];

export default function TermsConditionsPage() {
  const [openId, setOpenId] = useState("welcome");

  return (
    <div className="bg-mist min-h-screen">
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.22em] text-white border border-white/20 mb-5">
            <FileText size={12} className="text-crimson-light" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Terms &amp; Conditions
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
                If you have any questions about these Terms &amp; Conditions:
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