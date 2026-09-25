import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Keep clock updated
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <header className="sticky top-2 sm:top-4 z-40 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 mb-4 sm:mb-8 box-border">
      <div className="apple-nav flex items-center justify-between px-2.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-[20px] sm:rounded-[24px] relative transition-all duration-500 w-full max-w-full box-border">
        
        {/* ======================================================== */}
        {/* LEFT: Brand Logo & Title (Desktop, Tablet, Mobile)       */}
        {/* ======================================================== */}
        <Link
          to="/"
          className="flex items-center gap-1.5 sm:gap-2.5 shrink min-w-0 group"
          aria-label="WeatherVerse Home"
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${
              isLight
                ? "bg-[#7A4F35] text-[#FFF9F2]"
                : "bg-white text-[#111111]"
            }`}
          >
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

          <div className="flex flex-col min-w-0 truncate">
            <span className="text-[14px] sm:text-[17px] font-semibold tracking-tight text-[var(--text-primary)] leading-tight truncate">
              WeatherVerse
            </span>
            {city && (
              <span className="text-[11px] font-normal text-[var(--text-muted)] hidden xl:block leading-tight mt-0.5 truncate">
                {city} • {formattedTime}
              </span>
            )}
          </div>
        </Link>

        {/* ======================================================== */}
        {/* CENTER: Desktop Navigation Links (>= 1024px ONLY)        */}
        {/* ======================================================== */}
        <nav
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card-secondary)] shrink-0"
          aria-label="Desktop primary navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `px-2.5 xl:px-3 py-1.5 rounded-full text-[12px] xl:text-[13px] font-medium transition-all ${
                  isActive
                    ? isLight
                      ? "bg-[#7A4F35] text-[#FFF9F2] font-semibold shadow-xs"
                      : "bg-white text-black font-semibold shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ======================================================== */}
        {/* RIGHT: Desktop Controls (>= 1024px)                      */}
        {/* Day/Night segmented track + °C/°F track + Search button  */}
        {/* ======================================================== */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {/* Day / Night Segmented Control */}
          <div
            className="apple-segmented-track"
            role="radiogroup"
            aria-label="Day and Night Theme Switcher"
          >
            <button
              type="button"
              onClick={() => !isLight && toggleTheme()}
              className={`apple-segmented-item !px-3 !py-1 ${isLight ? "active" : ""}`}
              aria-checked={isLight}
              role="radio"
              title="Switch to Day Mode"
            >
              <Sun size={13} className={isLight ? "text-[#FFF9F2]" : "text-[var(--text-muted)]"} />
              <span className="text-[12px]">Day</span>
            </button>
            <button
              type="button"
              onClick={() => isLight && toggleTheme()}
              className={`apple-segmented-item !px-3 !py-1 ${!isLight ? "active" : ""}`}
              aria-checked={!isLight}
              role="radio"
              title="Switch to Night Mode"
            >
              <Moon size={13} className={!isLight ? "text-[#8E8AFF]" : "text-[var(--text-muted)]"} />
              <span className="text-[12px]">Night</span>
            </button>
          </div>

          {/* Unit Switcher (°C / °F) */}
          <div
            className="apple-segmented-track"
            role="radiogroup"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => unit !== "C" && toggleUnit()}
              className={`apple-segmented-item !px-2.5 !py-1 text-[12px] ${unit === "C" ? "active" : ""}`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => unit !== "F" && toggleUnit()}
              className={`apple-segmented-item !px-2.5 !py-1 text-[12px] ${unit === "F" ? "active" : ""}`}
            >
              °F
            </button>
          </div>

          {/* Global Search Button */}
          <button
            type="button"
            id="desktop-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 px-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 hover:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] transition shadow-2xs active:scale-95 cursor-pointer"
            title="Search city (⌘K)"
            aria-label="Search city"
          >
            <Search size={14} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
            <span>Search</span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: Tablet Controls (768px <= width < 1024px)         */}
        {/* Structure: [Search] [Day/Night] [Hamburger]              */}
        {/* ======================================================== */}
        <div className="hidden md:flex lg:hidden items-center gap-2 shrink-0">
          {/* Visible Tablet Search Button */}
          <button
            type="button"
            id="tablet-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="h-10 px-3.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] text-xs font-medium flex items-center gap-1.5 hover:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] transition shadow-2xs active:scale-95 shrink-0 cursor-pointer"
            title="Search city (⌘K)"
            aria-label="Search city"
          >
            <Search size={15} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Day / Night Segmented Control */}
          <div
            className="apple-segmented-track"
            role="radiogroup"
            aria-label="Day and Night Theme Switcher"
          >
            <button
              type="button"
              onClick={() => !isLight && toggleTheme()}
              className={`apple-segmented-item !px-3 !py-1.5 ${isLight ? "active" : ""}`}
              aria-checked={isLight}
              role="radio"
              title="Switch to Day Mode"
            >
              <Sun size={13} className={isLight ? "text-[#FFF9F2]" : "text-[var(--text-muted)]"} />
              <span className="text-[12px]">Day</span>
            </button>
            <button
              type="button"
              onClick={() => isLight && toggleTheme()}
              className={`apple-segmented-item !px-3 !py-1.5 ${!isLight ? "active" : ""}`}
              aria-checked={!isLight}
              role="radio"
              title="Switch to Night Mode"
            >
              <Moon size={13} className={!isLight ? "text-[#8E8AFF]" : "text-[var(--text-muted)]"} />
              <span className="text-[12px]">Night</span>
            </button>
          </div>

          {/* Hamburger / Menu Toggle Button */}
          <button
            type="button"
            id="tablet-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-2xl text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition border border-[var(--border-subtle)] bg-[var(--surface-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95 shadow-2xs shrink-0 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: Mobile Controls (< 768px)                         */}
        {/* Mandatory Structure: [Day/Night] [Search] [Hamburger]     */}
        {/* Search is ALWAYS directly visible in the top navbar      */}
        {/* ======================================================== */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Day / Night Toggle Button */}
          <button
            type="button"
            id="mobile-theme-btn"
            onClick={toggleTheme}
            className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] flex items-center justify-center hover:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] transition shadow-2xs active:scale-95 shrink-0 cursor-pointer"
            title={isLight ? "Switch to Night Mode" : "Switch to Day Mode"}
            aria-label="Toggle Day and Night theme"
          >
            {isLight ? (
              <Sun size={17} className="text-[#7A4F35]" />
            ) : (
              <Moon size={17} className="text-[#8E8AFF]" />
            )}
          </button>

          {/* 2. Search Button (ALWAYS VISIBLE DIRECTLY IN NAVBAR) */}
          <button
            type="button"
            id="mobile-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="h-10 sm:h-11 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-primary)] flex items-center justify-center gap-1.5 hover:border-[var(--accent-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] transition shadow-2xs active:scale-95 shrink-0 cursor-pointer"
            title="Search city (⌘K)"
            aria-label="Search city"
          >
            <Search size={17} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
            <span className="hidden sm:inline text-xs font-medium">Search</span>
          </button>

          {/* 3. Hamburger Menu Button */}
          <button
            type="button"
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] rounded-2xl text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition border border-[var(--border-subtle)] bg-[var(--surface-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95 shadow-2xs shrink-0 cursor-pointer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Apple-Style Navigation Sheet for Tablet & Mobile        */}
      {/* Contains: Search, °C/°F, Day/Night, and all 8 Nav Links */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-2 p-4 sm:p-5 rounded-3xl apple-card relative z-50 shadow-2xl border border-[var(--border-elevated)] overflow-hidden"
          >
            {/* 1. Integrated Search Button in Menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full min-h-[46px] h-12 px-3.5 sm:px-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card-secondary)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-between transition-all group shadow-2xs mb-3.5"
            >
              <div className="flex items-center gap-2.5">
                <Search size={16} className={isLight ? "text-[#7A4F35]" : "text-[#8E8AFF]"} />
                <span className="text-xs sm:text-sm font-medium">Search any global city or airport...</span>
              </div>
              <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 text-[var(--text-muted)] border border-[var(--border-subtle)]">
                ⌘K
              </kbd>
            </button>

            {/* 2. Controls Row: Units & Day/Night Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3.5 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Preferences
              </span>
              <div className="flex items-center gap-2">
                {/* Temperature Unit Control */}
                <div
                  className="apple-segmented-track"
                  role="radiogroup"
                  aria-label="Temperature unit selection"
                >
                  <button
                    type="button"
                    onClick={() => unit !== "C" && toggleUnit()}
                    className={`apple-segmented-item !min-h-[38px] !px-3.5 ${unit === "C" ? "active" : ""}`}
                  >
                    °C
                  </button>
                  <button
                    type="button"
                    onClick={() => unit !== "F" && toggleUnit()}
                    className={`apple-segmented-item !min-h-[38px] !px-3.5 ${unit === "F" ? "active" : ""}`}
                  >
                    °F
                  </button>
                </div>

                {/* Day / Night Theme Control */}
                <div
                  className="apple-segmented-track"
                  role="radiogroup"
                  aria-label="Theme switcher"
                >
                  <button
                    type="button"
                    onClick={() => !isLight && toggleTheme()}
                    className={`apple-segmented-item !min-h-[38px] !px-3 ${isLight ? "active" : ""}`}
                  >
                    <Sun size={12} className={isLight ? "text-[#FFF9F2]" : ""} />
                    <span className="ml-1 text-[12px]">Day</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => isLight && toggleTheme()}
                    className={`apple-segmented-item !min-h-[38px] !px-3 ${!isLight ? "active" : ""}`}
                  >
                    <Moon size={12} className={!isLight ? "text-[#8E8AFF]" : ""} />
                    <span className="ml-1 text-[12px]">Night</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Navigation Links (8 Clean Touch-Friendly items) */}
            <nav className="grid grid-cols-2 gap-2" aria-label="Mobile and Tablet navigation">
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
                          ? isLight
                            ? "bg-[#7A4F35] text-[#FFF9F2] border-[#7A4F35] font-semibold shadow-xs"
                            : "bg-white text-black border-white font-semibold shadow-xs"
                          : "bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:bg-black/5 dark:hover:bg-white/5"
                      }`
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* 4. Active City Status Footer */}
            {city && (
              <div className="mt-3.5 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span className="truncate">
                  Location: <strong className="text-[var(--text-primary)] font-medium">{city}</strong>
                </span>
                <span className="shrink-0">{formattedTime}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
