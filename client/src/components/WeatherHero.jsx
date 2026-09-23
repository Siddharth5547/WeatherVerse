import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import {
  MapPin,
  Droplets,
  Wind,
  Sunrise,
  Bookmark,
  BookmarkCheck,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { convertTemp, convertWind } from "../Services/WeatherService";

export default function WeatherHero({
  weather,
  unit = "C",
  theme = "dark",
  isSaved = () => false,
  toggleSaveLocation = () => {},
}) {
  const heroRef = useRef(null);
  const iconRef = useRef(null);
  const tempNumberRef = useRef(null);
  const glowRef = useRef(null);
  const prevTempRef = useRef(null);

  const hasWeather = Boolean(weather);

  const {
    city = "",
    temperature = 20,
    feelsLike = 20,
    condition = "",
    description = "",
    humidity = 60,
    wind = 10,
    sunrise = "06:12 AM",
    icon = "",
    sevenDay = [],
    daily = [],
  } = weather || {};

  const isLight = theme === "light";
  const tempDisplay = convertTemp(temperature, unit);
  const feelsLikeDisplay = convertTemp(feelsLike, unit);

  // Compute today's High and Low
  const todayForecast = sevenDay[0] || daily[0] || {};
  const highTemp =
    todayForecast.maxTemp !== undefined
      ? convertTemp(todayForecast.maxTemp, unit)
      : Math.round(Number(tempDisplay) + 3);
  const lowTemp =
    todayForecast.minTemp !== undefined
      ? convertTemp(todayForecast.minTemp, unit)
      : Math.round(Number(tempDisplay) - 3);

  // Derive condition category for weather-reactive animations
  const condText = (condition || description || "").toLowerCase();
  const weatherType = useMemo(() => {
    if (condText.includes("thunder") || condText.includes("storm") || condText.includes("lightning"))
      return "storm";
    if (condText.includes("rain") || condText.includes("drizzle") || condText.includes("shower"))
      return "rain";
    if (condText.includes("snow") || condText.includes("blizzard") || condText.includes("ice") || condText.includes("sleet"))
      return "snow";
    if (condText.includes("fog") || condText.includes("mist") || condText.includes("haze"))
      return "fog";
    if (condText.includes("cloud") || condText.includes("overcast"))
      return "cloudy";
    return "sunny";
  }, [condText]);

  // Ambient aura color based on condition and theme
  const auraGlow = useMemo(() => {
    if (weatherType === "sunny") {
      return isLight
        ? "radial-gradient(circle, rgba(217, 183, 122, 0.40) 0%, rgba(243, 233, 220, 0) 70%)"
        : "radial-gradient(circle, rgba(255, 214, 10, 0.25) 0%, rgba(255, 159, 10, 0.05) 60%, transparent 70%)";
    }
    if (weatherType === "rain" || weatherType === "storm") {
      return isLight
        ? "radial-gradient(circle, rgba(142, 183, 201, 0.40) 0%, rgba(243, 233, 220, 0) 70%)"
        : "radial-gradient(circle, rgba(100, 210, 255, 0.22) 0%, rgba(88, 86, 214, 0.10) 60%, transparent 70%)";
    }
    if (weatherType === "snow") {
      return isLight
        ? "radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(233, 216, 197, 0) 70%)"
        : "radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%)";
    }
    if (weatherType === "cloudy") {
      return isLight
        ? "radial-gradient(circle, rgba(185, 165, 148, 0.35) 0%, rgba(243, 233, 220, 0) 70%)"
        : "radial-gradient(circle, rgba(142, 142, 147, 0.20) 0%, transparent 70%)";
    }
    return isLight
      ? "radial-gradient(circle, rgba(217, 183, 122, 0.30) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(142, 138, 255, 0.20) 0%, transparent 70%)";
  }, [weatherType, isLight]);

  // 1. GSAP Staggered Entrance on Load & City Change
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      const heroEl = heroRef.current;
      const statusEl = heroEl?.querySelector(".hero-stagger-status");
      const iconEl = heroEl?.querySelector(".hero-stagger-icon");
      const cityEl = heroEl?.querySelector(".hero-stagger-city");
      const tempEl = heroEl?.querySelector(".hero-stagger-temp");
      const condEl = heroEl?.querySelector(".hero-stagger-condition");
      const pillsEl = heroEl?.querySelector(".hero-stagger-pills");

      if (heroEl) {
        tl.fromTo(heroEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 });
      }
      if (statusEl) {
        tl.fromTo(statusEl, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2");
      }
      if (iconEl) {
        tl.fromTo(iconEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" }, "-=0.15");
      }
      if (cityEl) {
        tl.fromTo(cityEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
      }
      if (tempEl) {
        tl.fromTo(tempEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
      }
      if (condEl) {
        tl.fromTo(condEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.25 }, "-=0.2");
      }
      if (pillsEl) {
        tl.fromTo(pillsEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.15");
      }
    }, heroRef);

    return () => ctx.revert();
  }, [city]);

  // 2. Weather-Aware Weather Icon & Ambient Glow Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Glow breathing
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.12,
          opacity: isLight ? 0.85 : 0.65,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Weather-reactive icon movement
      if (iconRef.current) {
        if (weatherType === "sunny") {
          gsap.to(iconRef.current, {
            y: -6,
            rotation: 2,
            duration: 3.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        } else if (weatherType === "cloudy") {
          gsap.to(iconRef.current, {
            x: 5,
            y: -3,
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        } else if (weatherType === "rain") {
          gsap.to(iconRef.current, {
            y: 4,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        } else if (weatherType === "storm") {
          const stormTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
          stormTl
            .to(iconRef.current, { x: -3, y: 2, duration: 0.1 })
            .to(iconRef.current, { x: 3, y: -2, duration: 0.1 })
            .to(iconRef.current, { x: 0, y: 0, duration: 0.2 });
        } else if (weatherType === "snow") {
          gsap.to(iconRef.current, {
            y: -5,
            x: 3,
            rotation: -2,
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        } else if (weatherType === "fog") {
          gsap.to(iconRef.current, {
            x: 6,
            opacity: 0.88,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        } else {
          gsap.to(iconRef.current, {
            y: -5,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, [weatherType, isLight]);

  // 3. Temperature Number Micro-Animation on Change
  useEffect(() => {
    if (prevTempRef.current !== null && prevTempRef.current !== tempDisplay) {
      if (tempNumberRef.current) {
        gsap.fromTo(
          tempNumberRef.current,
          { opacity: 0.35, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    }
    prevTempRef.current = tempDisplay;
  }, [tempDisplay, unit]);

  if (!hasWeather) return null;

  return (
    <div
      ref={heroRef}
      className="hero-compact-container relative overflow-hidden day-hero-gradient rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 md:p-8"
      style={{
        width: "100%",
        maxWidth: "1400px",
      }}
    >
      {/* Subtle Atmospheric Movement Behind Content */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full pointer-events-none blur-3xl transition-opacity duration-700"
        style={{
          background: auraGlow,
        }}
      />

      {/* TOP ROW: Live Station & Saved Location (Strictly Compact) */}
      <div className="hero-stagger-status relative z-10 flex items-center justify-between w-full mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF] border border-[var(--accent-primary)]/20">
            <MapPin size={11} /> Live Station
          </span>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--surface-card)]/80 border border-[var(--border-subtle)]">
            Real-time Telemetry
          </span>
        </div>

        <button
          onClick={() => toggleSaveLocation(weather)}
          type="button"
          className={`inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-all ${
            isSaved(city)
              ? "bg-[#D9B77A]/30 text-[#7A4F35] dark:text-[#FFD60A] border-[#D9B77A]"
              : "bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
          }`}
          aria-label={isSaved(city) ? "Remove saved location" : "Save location to bookmarks"}
        >
          {isSaved(city) ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          <span>{isSaved(city) ? "Bookmarked" : "Save Location"}</span>
        </button>
      </div>

      {/* CENTER HIERARCHY: Weather Icon -> City -> Temperature -> Condition -> Diurnal Pill */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1 sm:py-2">
        {/* Weather Icon / Character (Controlled 70-110px) */}
        <div
          ref={iconRef}
          className="hero-stagger-icon relative mb-1 flex items-center justify-center"
        >
          <img
            src={icon}
            alt={condition || "Current weather condition"}
            className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 lg:w-28 lg:h-28 object-contain weather-character-badge drop-shadow-md select-none"
            style={{
              maxHeight: "105px",
              maxWidth: "105px",
            }}
          />
        </div>

        {/* City Name (42-56px Desktop Responsive Clamp) */}
        <h1
          className="hero-stagger-city font-semibold tracking-tight text-[var(--text-primary)] leading-tight text-center truncate max-w-full px-2"
          style={{
            fontSize: "clamp(2rem, 3.8vw, 3.25rem)",
          }}
        >
          {city}
        </h1>

        {/* Temperature Number (80-110px Desktop Responsive Clamp) */}
        <div
          ref={tempNumberRef}
          className="hero-stagger-temp my-0.5 sm:my-1 flex items-baseline justify-center"
        >
          <span
            className="font-medium tracking-tighter leading-none text-[var(--text-primary)] select-none"
            style={{
              fontSize: "clamp(4.2rem, 7vw, 6.25rem)",
            }}
          >
            {tempDisplay}
          </span>
          <span
            className="font-light text-[var(--accent-primary)] dark:text-[#8E8AFF] ml-1 select-none"
            style={{
              fontSize: "clamp(1.8rem, 3.2vw, 2.75rem)",
            }}
          >
            °{unit}
          </span>
        </div>

        {/* Condition Text */}
        <p className="hero-stagger-condition text-base sm:text-lg md:text-xl font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] mb-1 leading-snug">
          {condition || description}
        </p>

        {/* Diurnal Pill: High / Low / Feels Like */}
        <div className="hero-stagger-condition flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-0.5">
            <ArrowUp size={11} className="text-rose-500" />
            <span>H:</span>
            <strong className="text-[var(--text-primary)] ml-0.5">{highTemp}°{unit}</strong>
          </span>
          <span className="opacity-40">•</span>
          <span className="inline-flex items-center gap-0.5">
            <ArrowDown size={11} className="text-[#8EB7C9]" />
            <span>L:</span>
            <strong className="text-[var(--text-primary)] ml-0.5">{lowTemp}°{unit}</strong>
          </span>
          <span className="opacity-40">•</span>
          <span>
            Feels like <strong className="text-[var(--text-primary)]">{feelsLikeDisplay}°{unit}</strong>
          </span>
        </div>
      </div>

      {/* BOTTOM WEATHER STATS PILLS (Compact & Close to Core Data) */}
      <div className="hero-stagger-pills relative z-10 grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:justify-center sm:gap-3 pt-3 sm:pt-4 border-t border-[var(--border-subtle)] w-full text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)]">
        {/* Humidity Pill */}
        <div className="telemetry-pill-hover flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xs cursor-default">
          <Droplets size={13} className="text-[#8EB7C9] shrink-0" />
          <span className="text-[var(--text-primary)] truncate">
            {humidity}% <span className="hidden sm:inline">Humidity</span>
          </span>
        </div>

        {/* Wind Pill */}
        <div className="telemetry-pill-hover flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xs cursor-default">
          <Wind size={13} className="text-[#8EAD91] shrink-0" />
          <span className="text-[var(--text-primary)] truncate">
            {convertWind(wind, unit)}
          </span>
        </div>

        {/* Sunrise/Sunset Pill */}
        <div className="telemetry-pill-hover flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-2xs cursor-default">
          <Sunrise size={13} className="text-[#D9B77A] shrink-0" />
          <span className="text-[var(--text-primary)] truncate">
            {sunrise || "06:12 AM"}
          </span>
        </div>
      </div>
    </div>
  );
}
