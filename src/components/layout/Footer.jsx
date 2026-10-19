// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { NAV_LINKS, COMPANY_NAME, COMPANY_PHONE, COMPANY_EMAIL } from "../../lib/constants";
import BrandLogo from "../ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-brand via-[#142B78] to-ink text-powder mt-24 overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand/30 blur-3xl" />

      <div className="relative container-x pt-16 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-20 h-16 rounded-2xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <BrandLogo />
              </div>
              <div>
                <div className="font-extrabold text-white tracking-tight">Spay Fintech Pvt Ltd</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-cyan">
                  Ferry Booking
                </div>
              </div>
            </Link>
            <p className="text-sm text-powder/70 leading-relaxed mb-5">
              Digital ferry and private boat reservations for the Andaman Islands.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-brand-cyan hover:border-brand-cyan hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-[0.2em]">
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-powder/70 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-cyan group-hover:w-3 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-powder/70">
              <li className="text-white font-semibold">{COMPANY_NAME}</li>
              <li className="leading-relaxed">
                Your trusted partner for reliable,<br />
                seamless ferry and private boat bookings.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs uppercase tracking-[0.2em]">
              Contact
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan transition-colors">
                  <Phone size={14} className="text-brand-cyan group-hover:text-white transition-colors" />
                </span>
                <a href={`tel:${COMPANY_PHONE}`} className="pt-1 hover:text-white transition-colors">
                  {COMPANY_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan transition-colors">
                  <Mail size={14} className="text-brand-cyan group-hover:text-white transition-colors" />
                </span>
                <a href={`mailto:${COMPANY_EMAIL}`} className="pt-1 hover:text-white transition-colors break-all">
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-brand-cyan/20 flex items-center justify-center shrink-0 group-hover:bg-brand-cyan transition-colors">
                  <MapPin size={14} className="text-brand-cyan group-hover:text-white transition-colors" />
                </span>
                <span className="pt-1">Office-316, Floor 3, 316 Laxmi Plaza, Andheri West, Mumbai, Maharashtra 400053.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-powder/60">
          <div>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</div>
<div className="flex gap-6">
  <Link to="/terms-conditions" className="hover:text-white transition-colors">
    Terms &amp; Conditions
  </Link>
  <Link to="/privacy-policy" className="hover:text-white transition-colors">
    Privacy Policy
  </Link>
  <Link to="/refund-cancellation" className="hover:text-white transition-colors">
    Refund &amp; Cancellation
  </Link>
</div>
        </div>
      </div>
    </footer>
  );
}