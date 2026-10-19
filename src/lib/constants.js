// src/lib/constants.js
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Spay Ferry";
export const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "Spay Ferry Pvt. Ltd.";
export const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE || "0124-4646165";
export const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL || "info@spayferry.com";
export const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || "https://ferry.spay.live";

export const NAV_LINKS = [
  { label: "Home",          path: "/" },
  { label: "Ferry Booking", path: "/ferry-booking" },
  { label: "Boat Booking",  path: "/boat-list" },
  { label: "About Us",      path: "/about" },
  { label: "FAQs",          path: "/faq" },
  { label: "Contact",       path: "/contact" },
];