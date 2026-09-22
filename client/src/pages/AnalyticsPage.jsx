import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sun,
  CloudRain,
  Compass,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { convertTemp, convertWind } from "../Services/WeatherService";
import TemperatureChart from "../components/TemperatureChart";
import SkeletonLoader from "../components/SkeletonLoader";

export default function AnalyticsPage() {
  const { weather, loading, unit, theme } = useWeather();

  if (loading) return <SkeletonLoader theme={theme} />;
  if (!weather) return null;

  const {
    city,
    temperature = 20,
    feelsLike = 21,
    humidity = 60,
    pressure = 1013,
    visibility = 10,
    wind = 12,
    sunrise = "06:15 AM",
    sunset = "06:45 PM",
    hourly = [],
    sevenDay = [],
  } = weather;

  const currentT = convertTemp(temperature, unit);
  const feelsLikeT = convertTemp(feelsLike, unit);
  const todayForecast = sevenDay[0] || {};
  const highT = todayForecast.maxTemp !== undefined ? convertTemp(todayForecast.maxTemp, unit) : Math.round(Number(currentT) + 3);
  const lowT = todayForecast.minTemp !== undefined ? convertTemp(todayForecast.minTemp, unit) : Math.round(Number(currentT) - 3);

  // Derive UV Index
  const uvEstimate = Math.min(11, Math.max(1, Math.round(10 - humidity / 15)));

  // Precipitation estimate
  const rainProb = todayForecast.rainProb ?? Math.min(90, Math.max(5, (humidity - 40) * 1.5));

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity size={14} /> Telemetry & Atmospheric Metrics
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Meteorological Analytics for {city}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time physical atmospheric measurements and solar cycle telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
            Live Sensor Telemetry
          </span>
        </div>
      </div>

      {/* 1. Thermal & Trend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 cols: Current Thermal Summary */}
        <div className="lg:col-span-4 apple-card p-6 sm:p-8 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-2">
              Thermal Profile
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-medium tracking-tight text-[var(--text-primary)]">
                {currentT}°
              </span>
              <span className="text-xl font-normal text-[var(--text-muted)]">
                {unit}
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
              Feels like <span className="font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF]">{feelsLikeT}°{unit}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-[var(--border-subtle)]">
            <div className="p-3.5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                <ArrowUp size={12} className="text-rose-500" /> Day High
              </span>
              <span className="text-xl font-bold text-[var(--text-primary)] mt-0.5 block">{highT}°{unit}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] flex items-center gap-1">
                <ArrowDown size={12} className="text-[#8EB7C9]" /> Day Low
              </span>
              <span className="text-xl font-bold text-[var(--text-primary)] mt-0.5 block">{lowT}°{unit}</span>
            </div>
          </div>
        </div>

        {/* Right 8 cols: 24-Hour Temperature Trajectory */}
        <div className="lg:col-span-8">
          <TemperatureChart hourly={hourly} unit={unit} theme={theme} />
        </div>
      </div>

      {/* 2. Visual Precision Instruments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Instrument 1: Wind Direction & Compass */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <Wind size={16} className="text-[#8EAD91]" /> Wind Velocity & Heading
            </span>
            <span className="text-[#8EAD91] font-medium">360° Vector</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                {convertWind(wind, unit)}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Gusts up to {convertWind(wind * 1.35, unit)}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#8EAD91]/15 text-[#557659] dark:text-[#8EAD91] border border-[#8EAD91]/30 font-medium">
                Beaufort Scale 3 (Gentle)
              </div>
            </div>

            {/* Visual 360 Compass with Rotating Needle */}
            <div className="relative w-20 h-20 rounded-full border border-dashed border-[var(--border-subtle)] flex items-center justify-center bg-[var(--surface-card-secondary)]">
              <span className="absolute top-1 text-[10px] font-bold text-[var(--accent-primary)] dark:text-[#8E8AFF]">N</span>
              <span className="absolute bottom-1 text-[10px] font-bold text-[var(--text-muted)]">S</span>
              <span className="absolute left-1.5 text-[10px] font-bold text-[var(--text-muted)]">W</span>
              <span className="absolute right-1.5 text-[10px] font-bold text-[var(--text-muted)]">E</span>
              <motion.div
                animate={{ rotate: [45, 65, 45] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF]"
              >
                <Compass size={28} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Instrument 2: Relative Humidity Circular Gauge */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <Droplets size={16} className="text-[#8EB7C9]" /> Relative Humidity
            </span>
            <span className="text-[#8EB7C9] font-medium">Moisture</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                {humidity}%
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Dew point approx. {Math.round(temperature - (100 - humidity) / 5)}°C
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#8EB7C9]/15 text-[#4E7688] dark:text-[#8EB7C9] border border-[#8EB7C9]/30 font-medium">
                {humidity > 70 ? "Elevated Moisture" : "Optimal Comfort Zone"}
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--border-subtle)]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#8EB7C9]"
                  strokeDasharray={`${humidity}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-bold text-[var(--text-primary)]">{humidity}%</span>
            </div>
          </div>
        </div>

        {/* Instrument 3: Atmospheric Pressure Barometer */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <Gauge size={16} className="text-[var(--accent-primary)] dark:text-[#8E8AFF]" /> Atmospheric Pressure
            </span>
            <span className="text-[var(--accent-primary)] dark:text-[#8E8AFF] font-medium">Barometer</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{pressure}</span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">hPa / mb</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Equivalent to {(pressure * 0.02953).toFixed(2)} inHg mercury height
            </p>

            <div className="w-full bg-[var(--surface-card-secondary)] h-2.5 rounded-full mt-4 overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent-primary)] via-[#B9825A] to-[#D9B77A] rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, ((pressure - 970) / 70) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1 font-medium">
              <span>970 Low</span>
              <span>1013 Std</span>
              <span>1040 High</span>
            </div>
          </div>
        </div>

        {/* Instrument 4: Optical Visibility */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <Eye size={16} className="text-[#8EAD91]" /> Optical Visibility
            </span>
            <span className="text-[#8EAD91] font-medium">Clarity</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{visibility}</span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">km</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {visibility >= 10 ? "Clear horizon without optical haze obstruction" : "Mild atmospheric haze detected"}
            </p>

            <div className="w-full bg-[var(--surface-card-secondary)] h-2.5 rounded-full mt-4 overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-[#8EAD91] rounded-full"
                style={{ width: `${Math.min(100, (visibility / 10) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Instrument 5: UV Radiation Index */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <Sun size={16} className="text-[#D9B77A]" /> Solar UV Irradiance
            </span>
            <span className="text-[#D9B77A] font-medium">Scale 1-11+</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-[var(--accent-primary)] dark:text-[#FFD60A]">{uvEstimate}</span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">of 11 max</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {uvEstimate <= 2 ? "Minimal solar exposure hazard" : "Sun protection (SPF 30+) suggested outdoors"}
            </p>

            <div className="w-full bg-[var(--surface-card-secondary)] h-2.5 rounded-full mt-4 overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-gradient-to-r from-[#8EAD91] via-[#D9B77A] to-rose-500 rounded-full"
                style={{ width: `${Math.min(100, (uvEstimate / 11) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Instrument 6: Precipitation Probability */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-4">
            <span className="flex items-center gap-1.5">
              <CloudRain size={16} className="text-[#8EB7C9]" /> Precipitation Probability
            </span>
            <span className="text-[#8EB7C9] font-medium">Forecast</span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-[#8EB7C9]">{rainProb}%</span>
              <span className="text-xs text-[var(--text-muted)] font-semibold">Probability</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {rainProb > 40 ? "Rain protection strongly advised" : "Dry ambient conditions expected"}
            </p>

            <div className="w-full bg-[var(--surface-card-secondary)] h-2.5 rounded-full mt-4 overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="h-full bg-[#8EB7C9] rounded-full"
                style={{ width: `${Math.min(100, rainProb)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Solar Arc & Sun Path */}
      <section className="apple-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9B77A]/15 border border-[#D9B77A]/30 flex items-center justify-center text-[#B9825A] dark:text-[#FFD60A]">
              <Sun size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Solar Arc & Sun Path</h2>
              <p className="text-xs text-[var(--text-secondary)]">Solar zenith, daylight progression, and dusk coordinates</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D9B77A]/20 text-[#7A4F35] dark:text-[#FFD60A] border border-[#D9B77A]/40">
            Daylight Cycle
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-center">
            <div className="text-2xl mb-1">🌅</div>
            <span className="text-xs text-[var(--text-muted)] block">Sunrise</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5 block">{sunrise}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-center">
            <div className="text-2xl mb-1">☀️</div>
            <span className="text-xs text-[var(--text-muted)] block">Solar Peak</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5 block">12:45 PM</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-center">
            <div className="text-2xl mb-1">🌇</div>
            <span className="text-xs text-[var(--text-muted)] block">Sunset</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5 block">{sunset}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-center">
            <div className="text-2xl mb-1">🌙</div>
            <span className="text-xs text-[var(--text-muted)] block">Night Arc</span>
            <span className="text-base font-bold text-[var(--text-primary)] mt-0.5 block">Dusk to Dawn</span>
          </div>
        </div>
      </section>
    </div>
  );
}
