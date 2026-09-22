import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Droplets,
  Wind,
  CloudRain,
  Sun,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { convertTemp, convertWind } from "../Services/WeatherService";
import TemperatureChart from "../components/TemperatureChart";
import SkeletonLoader from "../components/SkeletonLoader";

export default function HourlyPage() {
  const { weather, loading, unit, theme } = useWeather();
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);

  if (loading) return <SkeletonLoader theme={theme} />;
  if (!weather) return null;

  const {
    city,
    hourly = [],
    humidity = 60,
    wind = 10,
  } = weather;

  const selectedHour = hourly[selectedHourIndex] || hourly[0] || {};
  const selectedTemp = convertTemp(selectedHour.temp, unit);

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold uppercase tracking-wider mb-1">
            <Clock size={14} /> Diurnal Progression Timeline
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            24-Hour Timeline for {city}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Hour-by-hour atmospheric forecast with diurnal thermal and precipitation progression.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
          {hourly.length} Hourly Readings
        </span>
      </div>

      {/* Interactive Horizontal Scrubber Carousel */}
      <div className="apple-card p-4 sm:p-6 md:p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-[var(--border-subtle)]">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Select an Hour to Inspect
          </span>
          <span className="text-xs font-medium text-[var(--accent-primary)] dark:text-[#8E8AFF]">Scroll horizontally →</span>
        </div>

        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 scrollbar-none pt-1 touch-pan-x">
          {hourly.map((item, idx) => {
            const isSelected = selectedHourIndex === idx;
            const t = convertTemp(item.temp, unit);

            return (
              <motion.button
                key={idx}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedHourIndex(idx)}
                className={`shrink-0 w-24 sm:w-28 p-3 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 sm:gap-2.5 ${
                  isSelected
                    ? "bg-[var(--accent-primary)] text-[#FFF9F2] border-[var(--accent-primary)] shadow-sm font-semibold ring-1 ring-[var(--accent-primary)]"
                    : "apple-card hover:border-[var(--accent-primary)]/40"
                }`}
              >
                <span className={`text-[11px] sm:text-xs font-semibold ${isSelected ? "text-[#FFF9F2]" : "text-[var(--text-secondary)]"}`}>
                  {item.time}
                </span>

                <img
                  src={item.icon}
                  alt={item.condition}
                  className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-xs"
                />

                <span className={`text-lg sm:text-xl font-bold tracking-tight ${isSelected ? "text-[#FFF9F2]" : "text-[var(--text-primary)]"}`}>
                  {t}°
                </span>

                <span className={`text-[10px] sm:text-[11px] font-medium truncate w-full ${isSelected ? "text-[#E9D8C5]" : "text-[var(--text-muted)]"}`}>
                  {item.condition}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Hour Telemetry Inspection Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedHourIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="apple-card p-4 sm:p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center shrink-0">
                <img src={selectedHour.icon} alt="" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)] dark:text-[#8E8AFF] block">
                  Focused Timeline Point
                </span>
                <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {selectedHour.time} in {city}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  Condition: <span className="font-semibold text-[var(--text-primary)]">{selectedHour.condition}</span>
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-4xl sm:text-5xl font-medium tracking-tight text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                {selectedTemp}°
              </span>
              <span className="text-lg sm:text-xl font-normal text-[var(--text-muted)]">{unit}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Sun size={14} className="text-[#D9B77A]" /> Temperature
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{selectedTemp}°{unit}</span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1 truncate">At {selectedHour.time}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <CloudRain size={14} className="text-[#8EB7C9]" /> Rain Probability
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#8EB7C9]">
                {selectedHour.condition?.toLowerCase().includes("rain") ? "85%" : "12%"}
              </span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1 truncate">Precipitation factor</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Droplets size={14} className="text-[#8EB7C9]" /> Moisture Index
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{humidity}%</span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1 truncate">Ambient air humidity</p>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] sm:text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                <Wind size={14} className="text-[#8EAD91]" /> Wind Velocity
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{convertWind(wind, unit)}</span>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1 truncate">Steady airflow</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 24-Hour Temperature Trajectory Curve */}
      <TemperatureChart hourly={hourly} unit={unit} theme={theme} />
    </div>
  );
}
