
// src/components/layout/Header.jsx

import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  UserCircle2,
  CalendarDays,
} from "lucide-react";

import { NAV_LINKS } from "../../lib/constants";
import BrandLogo from "../ui/BrandLogo";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  // Update header shadow when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu after route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close menu with Escape
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Desktop navigation styling
  const navClass = ({ isActive }) =>
    [
      "relative inline-flex items-center justify-center",
      "whitespace-nowrap rounded-md",
      "px-[clamp(5px,0.65vw,12px)] py-2",
      "text-[clamp(10px,0.85vw,13px)] font-medium",
      "transition-colors duration-200",
      "after:absolute after:bottom-0",
      "after:left-[clamp(5px,0.65vw,12px)]",
      "after:right-[clamp(5px,0.65vw,12px)]",
      "after:h-[2px] after:rounded-full",
      "after:bg-blue-600 after:transition-transform",
      isActive
        ? "text-blue-700 after:scale-x-100"
        : "text-slate-600 after:scale-x-0 hover:text-blue-700 hover:after:scale-x-100",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "border-b border-slate-200",
        "bg-white",
        "transition-shadow duration-200",
        scrolled ? "shadow-md" : "shadow-sm",
      ].join(" ")}
    >
      {/* MAIN HEADER */}
      <div
        className="
          mx-auto grid w-full max-w-none
          grid-cols-[minmax(0,1fr)_auto]
          items-center
          gap-2
          px-[3%]
          min-h-[clamp(58px,5vw,76px)]
          lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
          lg:gap-[clamp(8px,1vw,20px)]
        "
      >
        {/* LEFT: LOGO AND COMPANY NAME */}
        <Link
          to="/"
          aria-label="Spay Fintech home"
          className="
            flex min-w-0 items-center
            gap-[clamp(6px,0.8vw,12px)]
            justify-self-start
            rounded-md
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500
          "
        >
          <div
            className="
              flex shrink-0 items-center justify-center
              w-[clamp(45px,5.2vw,76px)]
              h-[clamp(34px,4.3vw,58px)]
            "
          >
            <BrandLogo />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p
              className="
                whitespace-nowrap
                text-[clamp(10px,0.9vw,14px)]
                font-bold leading-tight text-slate-800
              "
            >
              Spay Fintech Pvt Ltd
            </p>

            <p
              className="
                mt-1 max-w-[clamp(130px,14vw,210px)]
                text-[clamp(7px,0.58vw,9px)]
                font-semibold uppercase leading-snug
                tracking-[0.07em] text-sky-600
              "
            >
              Ferry Booking &amp; Travel Services
            </p>
          </div>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="
            hidden min-w-0 items-center justify-center
            gap-0 lg:flex
          "
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={navClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT: BOOKINGS AND LOGIN */}
        <div
          className="
            hidden items-center justify-self-end
            gap-[clamp(4px,0.6vw,12px)]
            lg:flex
          "
        >
          <Link
            to="/my-bookings"
            className="
              inline-flex items-center justify-center
              gap-1.5 whitespace-nowrap
              rounded-md px-2 py-2
              text-[clamp(10px,0.8vw,12px)]
              font-semibold text-slate-700
              transition-colors hover:text-blue-700
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500
            "
          >
            <CalendarDays
              size={14}
              className="shrink-0"
            />

            <span>My Bookings</span>
          </Link>

          <Link
            to="/login"
            className="
              inline-flex items-center justify-center
              gap-1.5 whitespace-nowrap
              rounded-lg bg-blue-800
              px-[clamp(9px,1vw,16px)] py-2
              text-[clamp(10px,0.8vw,12px)]
              font-semibold text-white
              transition-colors hover:bg-blue-700
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500
              focus-visible:ring-offset-2
            "
          >
            <UserCircle2
              size={14}
              className="shrink-0"
            />

            Login
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            justify-self-end rounded-lg
            text-slate-700
            transition-colors hover:bg-slate-100
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500
            lg:hidden
          "
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        id="mobile-navigation"
        className={[
          "grid overflow-hidden",
          "border-t border-slate-100",
          "transition-[grid-template-rows,opacity] duration-200",
          "lg:hidden",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        ].join(" ")}
        aria-hidden={!open}
        inert={!open}
      >
        <nav
          aria-label="Mobile navigation"
          className="min-h-0 overflow-hidden bg-white px-4 py-3"
        >
          <div className="mx-auto flex w-full flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2.5",
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-1 border-t border-slate-100" />

            <Link
              to="/my-bookings"
              className="
                flex items-center gap-2 rounded-lg
                px-3 py-2.5 text-sm font-medium
                text-slate-700 hover:bg-slate-50
              "
            >
              <CalendarDays size={17} />
              My Bookings
            </Link>

            <Link
              to="/login"
              className="
                mt-1 flex items-center justify-center gap-2
                rounded-lg bg-blue-800 px-4 py-2.5
                text-sm font-semibold text-white
                transition-colors hover:bg-blue-700
              "
            >
              <UserCircle2 size={17} />
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
