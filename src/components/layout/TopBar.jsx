// src/components/layout/TopBar.jsx
import { Phone, Star } from "lucide-react";
import { COMPANY_NAME, COMPANY_PHONE } from "../../lib/constants";

export default function TopBar() {
  return (
    <div className="relative bg-brand text-white text-xs overflow-hidden">
      {/* Animated gradient accent bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-cyan to-brand opacity-95" />

      <div className="relative container-x flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <Star size={12} className="text-brand-cyan fill-brand-cyan animate-pulse-slow" />
          <span className="hidden sm:inline">
            {COMPANY_NAME} <span className="text-powder mx-1.5">•</span> Ferry &amp; Private Boat Booking
          </span>
          <span className="sm:hidden">Spay Ferry • Island Booking</span>
        </div>

        <a
          href={`tel:${COMPANY_PHONE.replace(/[^0-9+]/g, "")}`}
          className="group flex items-center gap-2 font-bold hover:text-brand-cyan transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-brand-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone size={11} />
          </span>
          <span className="hidden xs:inline">Call {COMPANY_PHONE}</span>
          {`${COMPANY_PHONE.replace(/[^0-9+]/g, " ")}`}
        </a>
      </div>
    </div>
  );
}