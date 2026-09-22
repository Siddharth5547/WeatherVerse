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
    <header className="sticky top-2 sm:top-4 z-40 w-full max-w-[1440px] mx-auto px-2.5 sm:px-6 mb-4 sm:mb-8">
      <div className="apple-nav flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 rounded-[20px] sm:rounded-[24px] relative transition-all duration-500">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${
            isLight
              ? "bg-[#7A4F35] text-[#FFF9F2]"
              : "bg-white text-[#111111]"
          }`}>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] sm:text-[18px] font-semibold tracking-tight text-[var(--text-primary)] leading-none truncate">
                WeatherVerse
              </span>
            </div>
            {city && (
              <span className="text-[11px] font-normal text-[var(--text-muted)] hidden md:block leading-tight mt-0.5 truncate">
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

        {/* Action Controls: [Theme] [Unit (md+)] [Search] [Menu] */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Day / Night Control: Desktop Full Segmented Track */}
          <div
            className="apple-segmented-track hidden sm:inline-flex"
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
              <span>Day</span>
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
              <span>Night</span>
            </button>
          </div>

          {/* Day / Night Control: Mobile Compact One-Touch Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="sm:hidden w-8 h-8 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] flex items-center justify-center hover:border-[var(--accent-primary)] transition shadow-2xs"
            title={isLight ? "Switch to Night Mode" : "Switch to Day Mode"}
            aria-label="Toggle Day and Night theme"
          >
            {isLight ? (
              <Sun size={14} className="text-[#7A4F35]" />
            ) : (
              <Moon size={14} className="text-[#8E8AFF]" />
            )}
          </button>

          {/* Unit Toggle (°C / °F) - visible on md+ */}
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
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 sm:gap-2 hover:border-[var(--accent-primary)] transition shadow-2xs"
            title="Search city (⌘K)"
          >
            <Search size={13} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
            className="xl:hidden mt-2 p-4 sm:p-5 rounded-3xl apple-card relative z-50 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Navigation & Units
              </span>
              <div className="flex items-center gap-2">
                <div className="apple-segmented-track" role="radiogroup" aria-label="Theme switcher">
                  <button
                    type="button"
                    onClick={() => !isLight && toggleTheme()}
                    className={`apple-segmented-item ${isLight ? "active" : ""}`}
                  >
                    <Sun size={12} /> Day
                  </button>
                  <button
                    type="button"
                    onClick={() => isLight && toggleTheme()}
                    className={`apple-segmented-item ${!isLight ? "active" : ""}`}
                  >
                    <Moon size={12} /> Night
                  </button>
                </div>
                <div className="apple-segmented-track md:hidden" role="radiogroup" aria-label="Unit switcher">
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
            </div>

            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `min-h-[44px] px-3 rounded-2xl text-[13px] font-medium flex items-center gap-2.5 transition-all border ${
                        isActive
                          ? "bg-[var(--accent-primary)] text-[#FFF9F2] dark:bg-white dark:text-black border-[var(--accent-primary)] font-semibold shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.02] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`
                    }
                  >
                    <Icon size={15} />
                    <span className="truncate">{link.label}</span>
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
