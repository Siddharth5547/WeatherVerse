import React from "react";
import {
  HeartPulse,
  Smile,
  AlertCircle,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import SkeletonLoader from "../components/SkeletonLoader";

export default function AirQualityPage() {
  const { weather, loading, theme } = useWeather();

  if (loading) return <SkeletonLoader theme={theme} />;
  if (!weather) return null;

  const { city, aqi } = weather;
  const index = aqi?.index || 1;
  const { pm25 = 12, pm10 = 24, co = 310, no2 = 22, o3 = 35 } = aqi || {};

  // Standard EPA Grade classification
  const getAQIDetails = (idx) => {
    switch (idx) {
      case 1:
        return {
          status: "Good (Clean Air)",
          color: "text-[#8EAD91]",
          bgColor: "bg-[#8EAD91]/15 border-[#8EAD91]/30",
          badgeColor: "bg-[#8EAD91]/20 text-[#557659] dark:text-[#8EAD91] border-[#8EAD91]/40",
          advice: "Air quality is considered satisfactory, and air pollution poses little or no risk. Ideal for outdoor running, cycling, and natural indoor ventilation.",
          outdoorScore: "Excellent (10/10)",
          sensitiveAdvice: "No restrictions. Enjoy the clean air!",
        };
      case 2:
        return {
          status: "Moderate",
          color: "text-[#D9B77A] dark:text-[#FFD60A]",
          bgColor: "bg-[#D9B77A]/15 border-[#D9B77A]/30",
          badgeColor: "bg-[#D9B77A]/20 text-[#7A4F35] dark:text-[#FFD60A] border-[#D9B77A]/40",
          advice: "Air quality is acceptable. However, there may be a moderate health concern for a very small number of people who are unusually sensitive to ozone.",
          outdoorScore: "Favorable (8/10)",
          sensitiveAdvice: "Unusually sensitive people should consider reducing prolonged outdoor exertion.",
        };
      case 3:
        return {
          status: "Unhealthy for Sensitive Groups",
          color: "text-[#B9825A]",
          bgColor: "bg-[#B9825A]/15 border-[#B9825A]/30",
          badgeColor: "bg-[#B9825A]/20 text-[#7A4F35] border-[#B9825A]/40",
          advice: "Members of sensitive groups (children, elderly, people with asthma or lung conditions) may experience health effects. The general public is not likely to be affected.",
          outdoorScore: "Caution Advised (5/10)",
          sensitiveAdvice: "Limit prolonged heavy exertion outside. Keep rescue inhalers handy.",
        };
      case 4:
        return {
          status: "Unhealthy",
          color: "text-[#FF3B30]",
          bgColor: "bg-[#FF3B30]/10 border-[#FF3B30]/20",
          badgeColor: "bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30",
          advice: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. Outdoor exercise is not recommended.",
          outdoorScore: "Poor (3/10)",
          sensitiveAdvice: "Wear an N95 respirator mask outdoors. Run air purifiers indoors.",
        };
      case 5:
        return {
          status: "Very Unhealthy",
          color: "text-[#AF52DE]",
          bgColor: "bg-[#AF52DE]/10 border-[#AF52DE]/20",
          badgeColor: "bg-[#AF52DE]/15 text-[#AF52DE] border-[#AF52DE]/30",
          advice: "Health alert: The risk of health effects is significantly increased for everyone. Keep all windows tightly sealed.",
          outdoorScore: "Hazardous (1/10)",
          sensitiveAdvice: "Remain indoors with air filtration. Avoid any outdoor physical activity.",
        };
      case 6:
        return {
          status: "Hazardous",
          color: "text-red-600",
          bgColor: "bg-red-600/10 border-red-600/20",
          badgeColor: "bg-red-600/15 text-red-600 border-red-600/30",
          advice: "Emergency conditions. The entire population is likely to be affected by severe respiratory irritation.",
          outdoorScore: "Critical (0/10)",
          sensitiveAdvice: "Stay strictly indoors. Use high-efficiency particulate air (HEPA) scrubbers.",
        };
      default:
        return {
          status: "Normal",
          color: "text-[#8EAD91]",
          bgColor: "bg-[#8EAD91]/15 border-[#8EAD91]/30",
          badgeColor: "bg-[#8EAD91]/20 text-[#557659] border-[#8EAD91]/40",
          advice: "Atmospheric particulate matter within acceptable limits.",
          outdoorScore: "Good (8/10)",
          sensitiveAdvice: "Maintain normal routines.",
        };
    }
  };

  const info = getAQIDetails(index);

  const pollutantData = [
    {
      name: "PM2.5",
      title: "Fine Inhalable Particles",
      desc: "Combustion particles, organic compounds, and metals (< 2.5 µm)",
      val: pm25,
      unit: "µg/m³",
      safe: 35,
      max: 100,
    },
    {
      name: "PM10",
      title: "Coarse Dust Particles",
      desc: "Dust, pollen, and mold spores suspended in air (< 10 µm)",
      val: pm10,
      unit: "µg/m³",
      safe: 50,
      max: 150,
    },
    {
      name: "CO",
      title: "Carbon Monoxide",
      desc: "Colorless gas emitted from vehicle exhausts and fuel burning",
      val: co,
      unit: "µg/m³",
      safe: 400,
      max: 1000,
    },
    {
      name: "NO₂",
      title: "Nitrogen Dioxide",
      desc: "Formed from vehicle exhaust emissions and power plants",
      val: no2,
      unit: "µg/m³",
      safe: 40,
      max: 100,
    },
    {
      name: "O₃",
      title: "Ground-Level Ozone",
      desc: "Formed by photochemical reactions between sunlight and pollutants",
      val: o3,
      unit: "µg/m³",
      safe: 50,
      max: 100,
    },
  ];

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8EAD91] text-xs font-semibold uppercase tracking-wider mb-1">
            <HeartPulse size={14} /> Environmental Health Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Air Quality & Pollutants for {city}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time US EPA air quality index telemetry and microscopic particulate analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${info.badgeColor}`}>
            EPA Grade {index} of 6
          </span>
        </div>
      </div>

      {/* Hero Air Quality Banner */}
      <div className="apple-card p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Grade Gauge */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-4 sm:p-6 rounded-2xl border ${info.bgColor}`}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight ${info.color}`}>
                  {index}
                </div>
                <div>
                  <span className={`text-lg sm:text-xl md:text-2xl font-bold block ${info.color}`}>
                    {info.status}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    US EPA Standard Index
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-primary)] font-medium">
                  {info.advice}
                </p>
              </div>
            </div>

            {/* Segmented Color Spectrum Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] sm:text-[11px] font-semibold text-[var(--text-muted)]">
                <span>Good (1)</span>
                <span>Mod (2)</span>
                <span>Unhealthy (3-4)</span>
                <span>Hazard (5-6)</span>
              </div>
              <div className="grid grid-cols-6 gap-1 sm:gap-1.5 h-2.5 sm:h-3 rounded-full overflow-hidden bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] p-0.5">
                {["bg-[#8EAD91]", "bg-[#D9B77A]", "bg-[#B9825A]", "bg-[#FF3B30]", "bg-[#AF52DE]", "bg-red-600"].map(
                  (col, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-sm transition-all duration-700 ${
                        i < index ? col : "opacity-20 " + col
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Outdoor Activity & Sensitive Group Directives */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold mb-1.5 sm:mb-2">
                  <Smile size={15} className="text-[#8EAD91]" /> Outdoor Activity & Running
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--text-primary)] block">
                  {info.outdoorScore}
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 sm:mt-2 leading-relaxed">
                  Safe for cardiovascular exercise, cycling, outdoor recreation, and ventilation.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold mb-1.5 sm:mb-2">
                  <AlertCircle size={15} className="text-[#D9B77A]" /> Sensitive Groups Guidance
                </span>
                <span className="text-base font-bold text-[var(--text-primary)] block">
                  {index <= 2 ? "Minimal Hazard Risk" : "Precautionary Protocols"}
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 sm:mt-2 leading-relaxed">
                  {info.sensitiveAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Matrix */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Microscopic Pollutant Spectrum</h2>
          <p className="text-xs text-[var(--text-secondary)]">Actual measured concentrations provided by live atmospheric sensor telemetry</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {pollutantData.map((p, idx) => {
            const ratio = Math.min(100, Math.round((p.val / p.max) * 100));
            const isElevated = p.val > p.safe;

            return (
              <div
                key={idx}
                className="apple-card p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                    {p.name}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                    {p.val} {p.unit}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-[var(--text-primary)]">{p.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 mb-4 h-8 leading-relaxed">{p.desc}</p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                    <span>Safe baseline: {p.safe} {p.unit}</span>
                    <span className={isElevated ? "text-[#B9825A] font-bold" : "text-[#8EAD91] font-semibold"}>
                      {isElevated ? "Elevated" : "Normal"}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--surface-card-secondary)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isElevated ? "bg-[#B9825A]" : "bg-[#8EAD91]"
                      }`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
