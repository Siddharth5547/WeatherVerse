import React from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

export default function AQISection({ aqi, theme = "dark" }) {
  if (!aqi) return null;

  const {
    index = 1,
    pm25 = 0,
    pm10 = 0,
    co = 0,
    no2 = 0,
    o3 = 0,
  } = aqi;

  // EPA Standard classification
  const getAQIDetails = (idx) => {
    switch (idx) {
      case 1:
        return {
          status: "Good",
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10 border-emerald-500/20",
          pillColor: "bg-emerald-500",
          advice: "Air quality is ideal for outdoor activities, jogging, and natural ventilation.",
        };
      case 2:
        return {
          status: "Moderate",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10 border-yellow-500/20",
          pillColor: "bg-yellow-500",
          advice: "Air quality is acceptable; however, unusually sensitive individuals should monitor breathing.",
        };
      case 3:
        return {
          status: "Unhealthy for Sensitive Groups",
          color: "text-amber-400",
          bgColor: "bg-amber-500/10 border-amber-500/20",
          pillColor: "bg-amber-500",
          advice: "Members of sensitive groups (asthma, elderly) may experience health effects. Limit heavy exertion.",
        };
      case 4:
        return {
          status: "Unhealthy",
          color: "text-rose-400",
          bgColor: "bg-rose-500/10 border-rose-500/20",
          pillColor: "bg-rose-500",
          advice: "Some members of the general public may experience health effects. Wear an N95 mask outdoors.",
        };
      case 5:
        return {
          status: "Very Unhealthy",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10 border-purple-500/20",
          pillColor: "bg-purple-500",
          advice: "Health alert: The risk of health effects is increased for everyone. Keep windows closed.",
        };
      case 6:
        return {
          status: "Hazardous",
          color: "text-red-600",
          bgColor: "bg-red-500/10 border-red-500/20",
          pillColor: "bg-red-600",
          advice: "Health warning of emergency conditions. The entire population is likely to be affected.",
        };
      default:
        return {
          status: "Normal",
          color: "text-cyan-400",
          bgColor: "bg-cyan-500/10 border-cyan-500/20",
          pillColor: "bg-cyan-500",
          advice: "Atmospheric particulate metrics within standard parameters.",
        };
    }
  };

  const details = getAQIDetails(index);

  const pollutants = [
    { label: "PM2.5", name: "Fine Particles", val: pm25, unit: "µg/m³", max: 75, safe: 30 },
    { label: "PM10", name: "Inhalable Particles", val: pm10, unit: "µg/m³", max: 150, safe: 50 },
    { label: "CO", name: "Carbon Monoxide", val: co, unit: "µg/m³", max: 1000, safe: 400 },
    { label: "NO₂", name: "Nitrogen Dioxide", val: no2, unit: "µg/m³", max: 100, safe: 40 },
    { label: "O₃", name: "Ozone", val: o3, unit: "µg/m³", max: 100, safe: 50 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden ${
        theme === "dark" ? "glass-panel-dark" : "glass-panel-light"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HeartPulse size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Air Quality & Environment</h2>
            <p className="text-xs text-slate-400">US EPA Standard Atmospheric Measurement</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-800/40 border-slate-700/60 text-slate-300">
            Index Grade {index} / 6
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Big AQI Gauge & Advisory */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-4 rounded-2xl border ${details.bgColor}`}>
            <div className="flex items-center gap-3">
              <span className={`text-4xl sm:text-5xl font-extrabold font-display ${details.color}`}>
                Level {index}
              </span>
              <div>
                <span className={`text-base sm:text-lg font-bold block ${details.color}`}>
                  {details.status}
                </span>
                <span className="text-xs text-slate-400">EPA Air Quality Level</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm mt-3 text-slate-300 leading-relaxed font-medium">
              {details.advice}
            </p>
          </div>

          {/* Segmented Visual Scale */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy</span>
              <span>Hazardous</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 h-2.5 rounded-full overflow-hidden bg-slate-800/50 p-0.5">
              {["bg-emerald-400", "bg-yellow-400", "bg-amber-400", "bg-rose-400", "bg-purple-400", "bg-red-600"].map(
                (bg, i) => (
                  <div
                    key={i}
                    className={`h-full rounded-sm transition-all duration-500 ${
                      i < index ? bg : "opacity-20 " + bg
                    }`}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Right: Pollutant Breakdown Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pollutants.map((p, idx) => {
            const ratio = Math.min(100, Math.round((p.val / p.max) * 100));
            const isElevated = p.val > p.safe;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-white/80 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">{p.label}</span>
                  <span className="text-[10px] opacity-75">{p.unit}</span>
                </div>
                <div className="text-lg font-bold font-display">
                  {p.val}
                </div>
                <p className="text-[10px] text-slate-400 truncate mb-2">{p.name}</p>

                {/* Progress bar */}
                <div className="w-full bg-slate-700/30 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isElevated ? "bg-amber-400" : "bg-cyan-400"
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
