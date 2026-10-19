// src/pages/AboutPage.jsx
import { Building2, Briefcase, Phone, MapPin, Mail, Zap, Search, Headphones, Shield, Check } from "lucide-react";
import Reveal from "../components/ui/Reveal";
import BrandLogo from "../components/ui/BrandLogo";
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_EMAIL } from "../lib/constants";

const DETAILS = [
  { label: "Company Name",  value: COMPANY_NAME },
  { label: "Business Focus", value: "Ferry Booking, Private Boat Booking & Travel Support" },
  { label: "Mobile",         value: COMPANY_PHONE },
];

const BUSINESS = [
  { icon: MapPin,  label: "Office Address",  value: "Office-316, Floor 3, 316 Laxmi Plaza, Andheri West, Mumbai, Maharashtra 400053." },
  { icon: Phone,   label: "Contact Number",  value: `${COMPANY_PHONE} — For ferry, private boat and general travel booking assistance.` },
  { icon: Mail,    label: "Core Services",   value: "Online ferry booking, private boat booking, route discovery and booking-related travel support." },
];

const PERKS = [
  { icon: Zap,        title: "Fast Booking",    desc: "Search and reserve in a few simple steps." },
  { icon: Search,     title: "Clear Choices",   desc: "Compare operators, timings and fares." },
  { icon: Headphones, title: "Travel Support",  desc: "Help available for booking-related questions." },
  { icon: Shield,     title: "Secure Journey",  desc: "Designed for reliable digital reservations." },
];

export default function AboutPage() {
  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-20 md:py-24 text-center">
          <div className="section-label text-crimson-light">Company Profile</div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {COMPANY_NAME}
          </h1>
          <p className="text-powder/80 max-w-2xl mx-auto leading-relaxed">
            A digital travel and booking company focused on making ferry and private boat
            reservations simple, accessible and convenient for travellers.
          </p>
        </div>
      </div>

      {/* Profile + Logo */}
      <div className="container-x py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="card p-8 h-full">
              <div className="section-label">About the Company</div>
              <h2 className="text-2xl font-black text-ink tracking-tight mb-5">
                Our Profile
              </h2>
              <p className="text-navy/70 leading-relaxed mb-4">
                {COMPANY_NAME} operates this ferry booking website to provide a convenient
                digital experience for discovering ferry services, private boat options and
                travel booking support for the Andaman Islands.
              </p>
              <p className="text-navy/70 leading-relaxed mb-7">
                Our platform is designed around clear route information, simple booking steps
                and responsive customer support. The website brings ferry and private boat
                enquiries together in one place so travellers can plan their island journeys
                more easily.
              </p>

              <div className="space-y-3">
                {DETAILS.map((d) => (
                  <div key={d.label} className="rounded-xl border-2 border-powder/50 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">
                      {d.label}
                    </div>
                    <div className="font-bold text-ink">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="card p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-mist">
              <div className="w-40 h-40 rounded-3xl bg-white border-2 border-powder flex items-center justify-center shadow-lg mb-6">
                <BrandLogo />
              </div>
              <div className="text-2xl font-black text-ink tracking-tight mb-2">
                Spay Fintech Pvt Ltd 
              </div>
              <div className="text-sm text-navy/60 font-semibold uppercase tracking-[0.15em] mb-1">
                Ferry &amp; Private Boat Booking
              </div>
              <div className="text-xs text-navy/50">Andaman Islands • Digital Travel Services</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white py-20">
        <div className="container-x">
          <Reveal>
            <div className="text-center mb-14">
              <div className="section-label">Company Information</div>
              <h2 className="section-title">Business Details</h2>
              <p className="text-navy/60 mt-4 max-w-2xl mx-auto">
                For booking assistance and business enquiries, use the company contact information below.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {BUSINESS.map((b, i) => (
              <Reveal key={b.label} delay={i * 120}>
                <div className="card p-7 h-full group hover:shadow-cardHover transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-steel to-navy flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                    <b.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-black text-ink text-lg mb-2 tracking-tight">{b.label}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{b.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Perks */}
      <div className="container-x py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="card p-6 h-full group hover:-translate-y-1 transition-transform duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center mb-5 shadow-md">
                  <p.icon size={20} className="text-white" />
                </div>
                <h3 className="font-black text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}