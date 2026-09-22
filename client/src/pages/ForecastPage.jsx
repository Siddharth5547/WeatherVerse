import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Droplets,
  Wind,
  CloudRain,
  Eye,
  Gauge,
  Sun,
  Sunrise,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { convertTemp, convertWind } from "../Services/WeatherService";
import SkeletonLoader from "../components/SkeletonLoader";

export default function ForecastPage() {
  const { weather, loading, unit, theme } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (loading) return <SkeletonLoader theme={theme} />;
  if (!weather) return null;

  const {
    city,
    sevenDay = [],
    pressure = 1013,
    visibility = 10,
    sunrise = "06:12 AM",
    sunset = "06:45 PM",
  } = weather;

  const isLight = theme === "light";

  // Selected Day Data
  const selectedDay = sevenDay[selectedDayIndex] || sevenDay[0] || {};
  const maxT = convertTemp(selectedDay.maxTemp ?? selectedDay.temp, unit);
  const minT = convertTemp(selectedDay.minTemp ?? selectedDay.temp - 4, unit);
  const feelsLikeEstimated = convertTemp((selectedDay.temp ?? 20) + (selectedDay.humidity > 70 ? 2 : -1), unit);

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar size={14} /> 7-Day Synoptic Outlook
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            7-Day Forecast for {city}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Predictive atmospheric model derived from global meteorological sensor networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
            7-Day Synoptic Model
          </span>
        </div>
      </div>

      {/* 7-Day Apple Card Deck with Explicit Day Mode Highlight */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {sevenDay.slice(0, 7).map((item, index) => {
          const isSelected = selectedDayIndex === index;
          const maxTemp = convertTemp(item.maxTemp, unit);
          const minTemp = convertTemp(item.minTemp, unit);

          return (
            <motion.button
              key={index}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDayIndex(index)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between h-48 ${
                isSelected
                  ? isLight
                    ? "bg-[#7A4F35] text-[#FFF9F2] border-[#7A4F35] shadow-md ring-2 ring-[#7A4F35]/40"
                    : "bg-[#2C2C2E] text-[#FFFFFF] border-[#38383A] shadow-sm ring-1 ring-white/30"
                  : "apple-card hover:border-[var(--accent-primary)]/40"
              }`}
            >
              {isSelected && (
                <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
                  isLight ? "bg-[#D9B77A]" : "bg-[#8E8AFF]"
                }`} />
              )}

              {/* Day & Date */}
              <div>
                <span className={`text-sm font-semibold block ${
                  isSelected
                    ? isLight ? "text-[#FFF9F2]" : "text-white"
                    : "text-[var(--text-primary)]"
                }`}>
                  {item.day}
                </span>
                <span className={`text-[11px] block ${
                  isSelected
                    ? isLight ? "text-[#E9D8C5]" : "text-[#AEAEB2]"
                    : "text-[var(--text-muted)]"
                }`}>
                  {item.date}
                </span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-2 text-center">
                <img
                  src={item.icon}
                  alt={item.condition}
                  className="w-12 h-12 mx-auto object-contain drop-shadow-sm"
                />
                <span className={`text-[11px] font-medium block truncate mt-1 ${
                  isSelected
                    ? isLight ? "text-[#E9D8C5]" : "text-[#AEAEB2]"
                    : "text-[var(--text-secondary)]"
                }`}>
                  {item.condition}
                </span>
              </div>

              {/* Temp Range & Rain */}
              <div>
                <div className="flex items-baseline justify-between text-xs font-semibold">
                  <span className={`text-base font-bold ${
                    isSelected
                      ? isLight ? "text-[#FFF9F2]" : "text-white"
                      : "text-[var(--text-primary)]"
                  }`}>
                    {maxTemp}°
                  </span>
                  <span className={`font-normal ${
                    isSelected
                      ? isLight ? "text-[#E9D8C5]" : "text-[#8E8E93]"
                      : "text-[var(--text-muted)]"
                  }`}>
                    {minTemp}°
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] mt-1 font-medium">
                  <span className={`flex items-center gap-0.5 ${
                    isSelected && isLight ? "text-[#D9B77A]" : "text-[#8EB7C9]"
                  }`}>
                    <CloudRain size={11} /> {item.rainProb}%
                  </span>
                  <span className={isSelected && isLight ? "text-[#E9D8C5]" : "text-[var(--text-muted)]"}>
                    {item.humidity}% hum
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Day Detailed Breakdown Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="apple-card p-6 sm:p-8"
        >
          {/* Header of Detail */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center">
                <img
                  src={selectedDay.icon}
                  alt={selectedDay.condition}
                  className="w-12 h-12 object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                    {selectedDay.day}, {selectedDay.date}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF] border border-[var(--accent-primary)]/20">
                    Selected
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium mt-0.5">
                  {selectedDay.condition} • High {maxT}°{unit} / Low {minT}°{unit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-[var(--text-muted)] block">Forecast Peak</span>
                <span className="text-2xl font-bold text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                  {maxT}°{unit}
                </span>
              </div>
            </div>
          </div>

          {/* Full Grid of Selected Day Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {/* 1. Feels Like */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Sun size={14} className="text-[#D9B77A]" /> Feels Like
              </span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{feelsLikeEstimated}°{unit}</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Thermal sensory adjustment</p>
            </div>

            {/* 2. Precipitation Probability */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <CloudRain size={14} className="text-[#8EB7C9]" /> Precipitation
              </span>
              <span className="text-2xl font-bold text-[#8EB7C9]">{selectedDay.rainProb}%</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {selectedDay.rainProb > 40 ? "Rain protection recommended" : "Low precipitation likelihood"}
              </p>
            </div>

            {/* 3. Relative Humidity */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Droplets size={14} className="text-[#8EB7C9]" /> Relative Humidity
              </span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{selectedDay.humidity}%</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {selectedDay.humidity > 70 ? "High moisture saturation" : "Comfortable ambient range"}
              </p>
            </div>

            {/* 4. Wind Speed */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Wind size={14} className="text-[#8EAD91]" /> Wind Velocity
              </span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{convertWind(selectedDay.windSpeed, unit)}</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Steady atmospheric breeze</p>
            </div>

            {/* 5. Barometric Pressure */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Gauge size={14} className="text-[var(--accent-primary)] dark:text-[#8E8AFF]" /> Pressure
              </span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{pressure} hPa</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Standard sea level pressure</p>
            </div>

            {/* 6. Visibility */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Eye size={14} className="text-[#8EAD91]" /> Optical Visibility
              </span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{visibility} km</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Clear line-of-sight horizon</p>
            </div>

            {/* 7. UV Index */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Sun size={14} className="text-[#D9B77A]" /> UV Index
              </span>
              <span className="text-2xl font-bold text-[var(--accent-primary)] dark:text-[#FFD60A]">
                {Math.min(11, Math.max(1, Math.round(9 - (selectedDay.rainProb / 15))))} / 11
              </span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Moderate solar irradiance</p>
            </div>

            {/* 8. Solar Window */}
            <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Sunrise size={14} className="text-[#D9B77A]" /> Solar Window
              </span>
              <span className="text-sm font-bold block text-[var(--text-primary)]">{sunrise} → {sunset}</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Natural daylight duration</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
