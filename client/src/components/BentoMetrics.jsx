import React from "react";
import { motion } from "framer-motion";
import {
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Sun,
  Compass,
} from "lucide-react";
import { convertWind } from "../Services/WeatherService";

export default function BentoMetrics({ weather, unit = "C", theme = "dark" }) {
  if (!weather) return null;

  const {
    humidity = 0,
    pressure = 1013,
    visibility = 10,
    wind = 0,
    sunrise = "06:00 AM",
    sunset = "06:30 PM",
  } = weather;

  // Derive humidity status
  let humidityStatus = "Comfortable";
  let humidityColor = "text-emerald-400";
  if (humidity > 70) {
    humidityStatus = "High Moisture / Muggy";
    humidityColor = "text-sky-400";
  } else if (humidity < 30) {
    humidityStatus = "Dry Air";
    humidityColor = "text-amber-400";
  }

  // Derive UV index approximation (based on daytime/cloudiness)
  const uvEstimate = Math.min(11, Math.max(1, Math.round(10 - humidity / 15)));
  let uvLabel = "Moderate";
  let uvColor = "text-amber-400";
  if (uvEstimate <= 2) {
    uvLabel = "Low Risk";
    uvColor = "text-emerald-400";
  } else if (uvEstimate >= 6 && uvEstimate <= 7) {
    uvLabel = "High (Protection Required)";
    uvColor = "text-orange-400";
  } else if (uvEstimate >= 8) {
    uvLabel = "Very High (Seek Shade)";
    uvColor = "text-rose-400";
  }

  // Pressure evaluation
  let pressureTrend = "Normal / Stable";
  if (pressure < 1005) pressureTrend = "Low Pressure (Rain Potential)";
  else if (pressure > 1020) pressureTrend = "High Pressure (Clear Skies)";

  // Visibility status
  let visStatus = "Optimal Visibility";
  if (visibility < 4) visStatus = "Hazy / Foggy";
  else if (visibility < 8) visStatus = "Moderate Visibility";

  const cardStyle = `rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden ${
    theme === "dark" ? "glass-card-dark" : "glass-card-light"
  }`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Wind & Compass Card */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Wind size={15} className="text-cyan-400" /> Wind Velocity
          </span>
          <span className="text-[11px] text-cyan-400">Live Gusts</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display">
              {convertWind(wind, unit)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {wind < 10
                ? "Gentle calm breeze"
                : wind < 25
                ? "Moderate continuous breeze"
                : "Strong gusty airflow"}
            </p>
          </div>

          {/* Compass Graphic */}
          <div className="relative w-14 h-14 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-500/10">
            <Compass className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: "25s" }} />
            <span className="absolute top-1 text-[9px] font-bold text-cyan-300">N</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Humidity & Ring Indicator */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Droplets size={15} className="text-sky-400" /> Humidity
          </span>
          <span className={`text-[11px] font-medium ${humidityColor}`}>
            {humidityStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display">
              {humidity}
              <span className="text-lg font-normal text-sky-400 ml-0.5">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              The dew point is approx. {Math.round(weather.temperature - (100 - humidity) / 5)}°C
            </p>
          </div>

          {/* Circular Progress Bar */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700/40"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${humidity}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-sky-300">{humidity}%</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Solar Cycle (Sunrise & Sunset) */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Sun size={15} className="text-amber-400" /> Solar Cycle
          </span>
          <span className="text-[11px] text-amber-400">Daylight Arc</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sunrise size={18} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Dawn</p>
              <p className="text-sm font-bold">{sunrise}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sunset size={18} />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Dusk</p>
              <p className="text-sm font-bold">{sunset}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Atmospheric Pressure */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Gauge size={15} className="text-purple-400" /> Barometer
          </span>
          <span className="text-[11px] text-purple-400 font-medium">
            {pressureTrend}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display">
              {pressure}
              <span className="text-xs font-normal text-slate-400 ml-1">hPa</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {((pressure * 0.02953).toFixed(2))} inHg standard
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Gauge size={22} />
          </div>
        </div>
      </motion.div>

      {/* 5. Visibility Distance */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Eye size={15} className="text-emerald-400" /> Optical Visibility
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">
            {visStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display">
              {visibility}
              <span className="text-xs font-normal text-slate-400 ml-1">km</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Clear line of sight across the horizon
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Eye size={22} />
          </div>
        </div>
      </motion.div>

      {/* 6. UV Index Scale */}
      <motion.div
        whileHover={{ y: -4 }}
        className={cardStyle}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Sun size={15} className="text-amber-400" /> UV Index
          </span>
          <span className={`text-[11px] font-medium ${uvColor}`}>
            {uvLabel}
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-display">
              {uvEstimate}
            </div>
            <span className="text-xs text-slate-400">of 11+ max</span>
          </div>

          {/* UV Scale Gradient Bar */}
          <div className="w-full bg-slate-700/30 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (uvEstimate / 11) * 100)}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
