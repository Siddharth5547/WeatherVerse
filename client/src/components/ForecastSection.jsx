import React from "react";
import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";
import { convertTemp } from "../Services/WeatherService";

export default function ForecastSection({
  hourly = [],
  daily = [],
  unit = "C",
  theme = "dark",
}) {
  // Global min and max across daily forecasts for Apple-style range bars
  const allDailyTemps = daily.map((d) => convertTemp(d.temp, unit));
  const globalMin = Math.min(...allDailyTemps, 0) - 2;
  const globalMax = Math.max(...allDailyTemps, 40) + 2;

  return (
    <div className="space-y-6">
      {/* 1. Hourly Forecast Horizontal Carousel */}
      {hourly.length > 0 && (
        <div
          className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden ${
            theme === "dark" ? "glass-panel-dark" : "glass-panel-light"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Clock size={16} />
              </div>
              <h3 className="font-bold text-base sm:text-lg font-display">
                Hourly Timeline
              </h3>
            </div>
            <span className="text-xs text-slate-400">24-Hour Forecast</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
            {hourly.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className={`shrink-0 w-24 p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 ${
                  theme === "dark"
                    ? "bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80"
                    : "bg-white/90 border-slate-200 hover:border-cyan-400 hover:shadow-md"
                }`}
              >
                <span className="text-xs font-semibold text-slate-400">
                  {item.time}
                </span>

                <img
                  src={item.icon}
                  alt={item.condition}
                  className="w-10 h-10 object-contain drop-shadow"
                />

                <span className="text-base font-extrabold font-display">
                  {convertTemp(item.temp, unit)}°
                </span>

                <span className="text-[10px] text-slate-400 truncate w-full">
                  {item.condition}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Multi-Day Forecast with Apple Weather-Style Range Bars */}
      {daily.length > 0 && (
        <div
          className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden ${
            theme === "dark" ? "glass-panel-dark" : "glass-panel-light"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <CalendarDays size={16} />
              </div>
              <h3 className="font-bold text-base sm:text-lg font-display">
                Multi-Day Outlook
              </h3>
            </div>
            <span className="text-xs text-slate-400">Extended Forecast</span>
          </div>

          <div className="space-y-3">
            {daily.map((item, index) => {
              const dayTemp = convertTemp(item.temp, unit);
              const minVal = dayTemp - 2;
              const maxVal = dayTemp + 3;

              // Calculate percentage positions for range bar
              const range = Math.max(1, globalMax - globalMin);
              const leftPercent = Math.max(0, Math.min(100, ((minVal - globalMin) / range) * 100));
              const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((maxVal - minVal) / range) * 100));

              return (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between gap-4 p-3.5 rounded-2xl border transition-all ${
                    theme === "dark"
                      ? "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60"
                      : "bg-white/80 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {/* Day Label */}
                  <div className="w-20 sm:w-24">
                    <span className="font-bold text-sm block">
                      {index === 0 ? "Today" : item.day}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {item.condition}
                    </span>
                  </div>

                  {/* Condition Icon */}
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.condition}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Temperature Range Bar */}
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 w-8 text-right">
                      {minVal}°
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-slate-700/20 relative overflow-hidden">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-bold w-8 text-left text-cyan-400">
                      {maxVal}°
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
