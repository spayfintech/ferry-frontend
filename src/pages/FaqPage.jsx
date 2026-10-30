// src/pages/FaqPage.jsx
import { useState } from "react";
import { Plus, HelpCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { useGet } from "../hooks/useGet";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import { COMPANY_PHONE, COMPANY_EMAIL } from "../lib/constants";

export default function FaqPage() {
  const { data: resp, loading } = useGet("/faqs");
  const faqs = resp?.data || [];
  const [openId, setOpenId] = useState(null);

  const fallback = [
    { id: 1, question: "How do I book a ferry ticket?",  answer: "Search your route, pick a departure, select seats, fill passenger details and confirm." },
    { id: 2, question: "Which routes are available?",    answer: "Port Blair ↔ Havelock, Havelock ↔ Neil Island, Neil Island ↔ Port Blair and more." },
    { id: 3, question: "Can I cancel my ferry booking?", answer: "Yes. Free cancellation up to 24 hours before departure." },
    { id: 4, question: "Can I book a private boat?",     answer: "Yes. Choose Boat Booking, select your boat and submit a charter request." },
    { id: 5, question: "How early should I arrive?",     answer: "Please arrive at the jetty at least 30 minutes before departure." },
    { id: 6, question: "Is the fare per person?",        answer: "Yes for ferries. Private charters are priced per vessel." },
    { id: 7, question: "Will I receive a ticket after booking?", answer: "Yes. A booking confirmation is shown instantly and emailed to you. You can download the PDF ticket from your booking page." },
  ];

  const list = faqs.length > 0 ? faqs : fallback;

  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-20 md:py-24 text-center">
          <div className="section-label text-crimson-light">Support</div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-powder/80 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about booking ferries and private boats in the Andamans.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="container-x py-16 max-w-3xl">
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {list.map((f, i) => {
              const open = openId === f.id;
              return (
                <Reveal key={f.id} delay={i * 60}>
                  <div
                    className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                      open ? "border-steel shadow-card" : "border-powder/50 hover:border-steel/50"
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(open ? null : f.id)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-bold text-ink text-sm md:text-base pr-4">
                        {f.question}
                      </span>
                      <span
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                          open ? "bg-crimson rotate-45" : "bg-ink"
                        }`}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                        open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-5 text-sm text-navy/70 leading-relaxed">
                        {f.answer}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Still have questions */}
        <Reveal delay={200}>
          <div className="mt-16 rounded-3xl bg-navy-gradient p-8 md:p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-crimson/20 blur-3xl -translate-y-1/3 translate-x-1/3" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-5 border border-white/20">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Still have questions?</h3>
              <p className="text-powder/80 mb-7 max-w-md mx-auto leading-relaxed">
                Our team is here to help with any booking-related inquiry.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <a href={`tel:${COMPANY_PHONE}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-ink font-bold hover:bg-powder transition-colors">
                  <Phone size={16} /> Call Us
                </a>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    COMPANY_EMAIL.trim()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  <Mail size={16} />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}