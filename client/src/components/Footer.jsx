import React from "react";
import { CloudRain, Sparkles, Cpu } from "lucide-react";

export default function Footer({ theme: _theme = "dark" } = {}) {
  return (
    <footer className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 mt-10 sm:mt-16 pb-8 sm:pb-12 z-20 relative">
      <div className="apple-card p-5 sm:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#5856D6]/10 border border-[#5856D6]/20 flex items-center justify-center text-[#5856D6] dark:text-[#8E8AFF]">
              <CloudRain size={18} />
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight text-[#111111] dark:text-[#F5F5F7]">
                WeatherVerse
              </span>
              <p className="text-xs text-[#515154] dark:text-[#AEAEB2]">
                Atmospheric Intelligence & Multi-Model Telemetry
              </p>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-[#515154] dark:text-[#AEAEB2]">
            <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
              React 19
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
              Tailwind CSS v4
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
              GSAP Motion
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
              Recharts
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#5856D6]/10 text-[#5856D6] dark:text-[#8E8AFF] border border-[#5856D6]/20 flex items-center gap-1 font-semibold">
              <Sparkles size={11} className="text-[#FFCC00]" /> Gemini 3.1 AI
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] border border-[#34C759]/20 flex items-center gap-1 font-semibold">
              <Cpu size={11} /> Open-Meteo & WeatherAPI
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-[#6E6E73] dark:text-[#8E8E93]">
          <p>© {new Date().getFullYear()} WeatherVerse. Designed with Apple Human Interface principles.</p>
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span className="text-[#515154] dark:text-[#AEAEB2]">Telemetry Synchronized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
