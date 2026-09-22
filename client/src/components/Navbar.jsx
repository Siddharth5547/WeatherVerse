import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Calendar,
  Activity,
  Clock,
  HeartPulse,
  Bot,
  Bookmark,
  Info,
  Compass,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function Navbar() {
  const { theme, toggleTheme, unit, toggleUnit, city, setIsSearchOpen } = useWeather();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const navLinks = [
    { to: "/", label: "Home", icon: Compass, exact: true },
    { to: "/forecast", label: "7-Day", icon: Calendar },
    { to: "/weather", label: "Analytics", icon: Activity },
    { to: "/hourly", label: "Hourly", icon: Clock },
    { to: "/air-quality", label: "Air Quality", icon: HeartPulse },
    { to: "/ai", label: "AI Copilot", icon: Bot },
    { to: "/locations", label: "Saved", icon: Bookmark },
    { to: "/about", label: "About", icon: Info },
  ];

  const isLight = theme === "light";

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full max-w-[1440px] mx-auto px-3 sm:px-6 mb-6 sm:mb-8">
      <div className="apple-nav flex items-center justify-between px-4 sm:px-6 py-3 rounded-[24px] relative transition-all duration-500">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${
            isLight
              ? "bg-[#7A4F35] text-[#FFF9F2]"
              : "bg-white text-[#111111]"
          }`}>
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-[var(--text-primary)] leading-none">
                WeatherVerse
              </span>
            </div>
            {city && (
              <span className="text-[11px] font-normal text-[var(--text-muted)] hidden md:block leading-tight mt-0.5">
                {city} • {formattedTime}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card-secondary)]">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `apple-nav-link ${isActive ? "active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls: Day/Night Segment + Unit Toggle + Search + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Day / Night Segmented Control */}
          <div
            className="apple-segmented-track"
            role="radiogroup"
            aria-label="Day and Night Theme Switcher"
          >
            <button
              type="button"
              onClick={() => !isLight && toggleTheme()}
              className={`apple-segmented-item ${isLight ? "active" : ""}`}
              aria-checked={isLight}
              role="radio"
              title="Switch to Day Mode"
            >
              <Sun size={13} className={isLight ? "text-[#FFF9F2]" : "text-[var(--text-muted)]"} />
              <span className="hidden sm:inline">Day</span>
            </button>
            <button
              type="button"
              onClick={() => isLight && toggleTheme()}
              className={`apple-segmented-item ${!isLight ? "active" : ""}`}
              aria-checked={!isLight}
              role="radio"
              title="Switch to Night Mode"
            >
              <Moon size={13} className={!isLight ? "text-[#8E8AFF]" : "text-[var(--text-muted)]"} />
              <span className="hidden sm:inline">Night</span>
            </button>
          </div>

          {/* Unit Toggle (°C / °F) */}
          <div
            className="apple-segmented-track hidden md:inline-flex"
            role="radiogroup"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => unit !== "C" && toggleUnit()}
              className={`apple-segmented-item ${unit === "C" ? "active" : ""}`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => unit !== "F" && toggleUnit()}
              className={`apple-segmented-item ${unit === "F" ? "active" : ""}`}
            >
              °F
            </button>
          </div>

          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 px-3 sm:px-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-2 hover:border-[var(--accent-primary)] transition shadow-2xs"
            title="Search city (⌘K)"
          >
            <Search size={14} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-xl text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Apple-Style Navigation Sheet for Tablet & Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden mt-3 p-5 rounded-3xl apple-card relative z-50 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Navigation
              </span>
              <div className="apple-segmented-track md:hidden">
                <button
                  type="button"
                  onClick={() => unit !== "C" && toggleUnit()}
                  className={`apple-segmented-item ${unit === "C" ? "active" : ""}`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => unit !== "F" && toggleUnit()}
                  className={`apple-segmented-item ${unit === "F" ? "active" : ""}`}
                >
                  °F
                </button>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-2.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `min-h-[46px] px-3.5 rounded-2xl text-[13px] font-medium flex items-center gap-2.5 transition-all border ${
                        isActive
                          ? "bg-[var(--accent-primary)] text-[#FFF9F2] dark:bg-white dark:text-black border-[var(--accent-primary)] font-semibold shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.02] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
