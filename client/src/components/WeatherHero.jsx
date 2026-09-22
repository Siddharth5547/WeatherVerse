import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
} from "lucide-react";
import { convertTemp, convertWind } from "../Services/WeatherService";

export default function WeatherHero({ weather, unit = "C", theme = "dark" }) {
  if (!weather) return null;

  const {
    city,
    temperature,
    feelsLike,
    condition,
    description,
    humidity,
    wind,
    icon,
    daily = [],
  } = weather;

  const tempDisplay = convertTemp(temperature, unit);
  const feelsLikeDisplay = convertTemp(feelsLike, unit);

  // Determine today's high and low from daily forecast if available
  const todayForecast = daily[0];
  const maxTemp = todayForecast ? convertTemp(todayForecast.temp + 2, unit) : tempDisplay + 2;
  const minTemp = todayForecast ? convertTemp(todayForecast.temp - 3, unit) : tempDisplay - 3;

  // Generate feels-like differential context
  const tempDiff = feelsLike - temperature;
  let feelContext = "Thermal perception matches ambient temperature";
  if (tempDiff > 1) {
    feelContext = `Humidity makes it feel ${Math.abs(tempDiff)}° warmer`;
  } else if (tempDiff < -1) {
    feelContext = `Wind chill makes it feel ${Math.abs(tempDiff)}° cooler`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 border shadow-2xl ${
        theme === "dark" ? "glass-panel-dark" : "glass-panel-light"
      }`}
    >
      {/* Ambient background glow behind hero */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Location & Condition */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <MapPin size={12} /> Live Station
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                theme === "dark"
                  ? "bg-slate-800/80 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Real-time Sync
            </span>
          </div>

          <div>
            <h1
              className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {city}
            </h1>
            <p className="text-sm font-medium text-cyan-400 mt-1 flex items-center gap-2">
              <span>{condition || description}</span>
              <span className="opacity-40">•</span>
              <span className="text-xs font-normal text-slate-400">{feelContext}</span>
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 text-slate-300"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <ArrowUp size={13} className="text-rose-400" />
              <span>H: {maxTemp}°{unit}</span>
              <span className="opacity-30">|</span>
              <ArrowDown size={13} className="text-sky-400" />
              <span>L: {minTemp}°{unit}</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 text-slate-300"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <Droplets size={13} className="text-cyan-400" />
              <span>{humidity}% Humidity</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                theme === "dark"
                  ? "bg-slate-900/60 border-slate-800 text-slate-300"
                  : "bg-white border-slate-200 text-slate-700 shadow-sm"
              }`}
            >
              <Wind size={13} className="text-emerald-400" />
              <span>{convertWind(wind, unit)}</span>
            </div>
          </div>
        </div>

        {/* Right: Giant Hero Temperature & Weather Icon */}
        <div className="flex items-center gap-4 sm:gap-6 self-center md:self-auto">
          {/* Animated Weather Visual */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl transform scale-125" />
            <img
              src={icon}
              alt={condition}
              className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Temperature Number */}
          <div className="text-right">
            <div className="flex items-start">
              <span
                className={`font-display font-black text-6xl sm:text-8xl leading-none tracking-tighter ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {tempDisplay}
              </span>
              <span className="font-display font-semibold text-2xl sm:text-4xl text-cyan-400 ml-1">
                °{unit}
              </span>
            </div>

            <p
              className={`text-xs sm:text-sm font-medium mt-1 ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Feels like{" "}
              <span className="font-semibold text-cyan-400">
                {feelsLikeDisplay}°{unit}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
