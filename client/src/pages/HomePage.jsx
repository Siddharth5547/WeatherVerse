import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Activity,
  Clock,
  HeartPulse,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { convertTemp } from "../Services/WeatherService";
import SkeletonLoader from "../components/SkeletonLoader";
import WeatherHero from "../components/WeatherHero";

export default function HomePage() {
  const { weather, loading, error, unit, theme, setIsSearchOpen, isSaved, toggleSaveLocation } = useWeather();

  if (loading) return <SkeletonLoader theme={theme} />;
  if (error) {
    return (
      <div className="max-w-xl mx-auto my-14 p-8 rounded-3xl apple-card text-center border border-rose-500/30">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Location Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="apple-btn-primary px-6 py-2.5 text-sm font-medium"
        >
          Search Another City
        </button>
      </div>
    );
  }
  if (!weather) return null;

  const {
    city,
    temperature,
    condition,
    icon,
    hourly = [],
  } = weather;

  // Day timeline progression segments
  const daySegments = [
    {
      title: "Morning",
      time: "08:00 AM",
      temp: hourly[8]?.temp ?? temperature - 2,
      cond: hourly[8]?.condition ?? condition,
      icon: hourly[8]?.icon ?? icon,
      summary: "Crisp start with gentle morning light.",
    },
    {
      title: "Afternoon",
      time: "01:00 PM",
      temp: hourly[13]?.temp ?? temperature + 2,
      cond: hourly[13]?.condition ?? condition,
      icon: hourly[13]?.icon ?? icon,
      summary: "Diurnal thermal peak with radiant skies.",
    },
    {
      title: "Evening",
      time: "06:00 PM",
      temp: hourly[18]?.temp ?? temperature,
      cond: hourly[18]?.condition ?? condition,
      icon: hourly[18]?.icon ?? icon,
      summary: "Golden twilight transition and cooling.",
    },
    {
      title: "Night",
      time: "10:00 PM",
      temp: hourly[22]?.temp ?? temperature - 3,
      cond: hourly[22]?.condition ?? condition,
      icon: hourly[22]?.icon ?? icon,
      summary: "Calm nocturnal atmosphere under stars.",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 pt-2">
      {/* 1. Compact WeatherVerse Hero Section */}
      <WeatherHero
        weather={weather}
        unit={unit}
        theme={theme}
        isSaved={isSaved}
        toggleSaveLocation={toggleSaveLocation}
      />

      {/* 2. 24-Hour Horizontal Scrubber Strip */}
      {hourly && hourly.length > 0 && (
        <section className="apple-card p-4 sm:p-6 md:p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[var(--accent-primary)] dark:text-[#8E8AFF]" />
              <h2 className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                24-Hour Hourly Forecast
              </h2>
            </div>
            <Link
              to="/hourly"
              className="text-xs font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] hover:underline flex items-center gap-1"
            >
              Interactive Timeline <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Horizontal Scrubber */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {hourly.slice(0, 24).map((hour, idx) => {
              const isNow = idx === 0;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between min-w-[72px] sm:min-w-[76px] p-2.5 sm:p-3.5 rounded-2xl border transition-all shrink-0 ${
                    isNow
                      ? "bg-[var(--accent-primary)] text-[#FFF9F2] border-[var(--accent-primary)] shadow-sm font-semibold"
                      : "bg-[var(--surface-card)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40"
                  }`}
                >
                  <span className={`text-[11px] sm:text-xs font-medium ${isNow ? "text-[#FFF9F2] font-bold" : "text-[var(--text-secondary)]"}`}>
                    {isNow ? "Now" : hour.time}
                  </span>
                  <img src={hour.icon} alt="" className="w-8 h-8 sm:w-9 sm:h-9 my-1 object-contain drop-shadow-xs" />
                  <span className={`text-sm font-bold ${isNow ? "text-[#FFF9F2]" : "text-[var(--text-primary)]"}`}>
                    {convertTemp(hour.temp, unit)}°
                  </span>
                  {hour.pop > 0 && (
                    <span className={`text-[10px] font-semibold mt-0.5 ${isNow ? "text-[#D9B77A]" : "text-[#8EB7C9]"}`}>
                      {hour.pop}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. "Your Day with Weather" Diurnal Breakdown */}
      <section className="apple-card p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Day with Weather</h2>
            <p className="text-xs text-[var(--text-secondary)]">Diurnal microclimate progression for {city}</p>
          </div>
          <Link
            to="/hourly"
            className="text-xs font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] hover:underline"
          >
            Detailed View →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {daySegments.map((seg, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold mb-2">
                <span>{seg.title}</span>
                <span className="text-[11px] opacity-75">{seg.time}</span>
              </div>
              <div className="flex items-center gap-3 my-2">
                <img src={seg.icon} alt="" className="w-10 h-10 object-contain drop-shadow-xs" />
                <div>
                  <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {convertTemp(seg.temp, unit)}°{unit}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] block truncate">{seg.cond}</span>
                </div>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-2 leading-relaxed">{seg.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Feature Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Portal 1: 7-Day Forecast */}
        <Link
          to="/forecast"
          className="apple-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[var(--accent-primary)]/50 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF] mb-4 group-hover:scale-105 transition-transform">
              <Calendar size={18} />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] dark:group-hover:text-[#8E8AFF] transition-colors">
              7-Day Forecast
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Explore 7 complete days of weather data with day-by-day telemetry and precipitation probabilities.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] mt-5 group-hover:translate-x-1 transition-transform">
            View 7-Day Outlook →
          </span>
        </Link>

        {/* Portal 2: Deep Analytics */}
        <Link
          to="/weather"
          className="apple-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[var(--accent-secondary)]/50 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-secondary)]/15 border border-[var(--accent-secondary)]/25 flex items-center justify-center text-[var(--accent-secondary)] mb-4 group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-secondary)] transition-colors">
              Visual Analytics
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Barometric pressure, 360° wind compass, optical visibility, UV index scale, and Sun Path arc.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[var(--accent-secondary)] mt-5 group-hover:translate-x-1 transition-transform">
            Open Analytics Lab →
          </span>
        </Link>

        {/* Portal 3: Air Quality */}
        <Link
          to="/air-quality"
          className="apple-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[#8EAD91]/50 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#8EAD91]/20 border border-[#8EAD91]/30 flex items-center justify-center text-[#557659] dark:text-[#8EAD91] mb-4 group-hover:scale-105 transition-transform">
              <HeartPulse size={18} />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[#557659] dark:group-hover:text-[#8EAD91] transition-colors">
              Air Quality Index
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              US EPA Grade {weather.aqi?.index || 1} with live PM2.5, PM10, CO, NO2 & health exercise advisories.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[#557659] dark:text-[#8EAD91] mt-5 group-hover:translate-x-1 transition-transform">
            Inspect AQI Pollutants →
          </span>
        </Link>

        {/* Portal 4: AI Copilot */}
        <Link
          to="/ai"
          className="apple-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[var(--accent-primary)]/50 transition-all"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF] mb-4 group-hover:scale-105 transition-transform">
              <Bot size={18} />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] dark:group-hover:text-[#8E8AFF] transition-colors">
              WeatherVerse AI
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Conversational meteorological intelligence powered by Gemini 3.1 Flash for lifestyle & travel questions.
            </p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] mt-5 group-hover:translate-x-1 transition-transform">
            Chat with Copilot →
          </span>
        </Link>
      </div>
    </div>
  );
}
