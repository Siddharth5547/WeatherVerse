import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CloudRain,
  Bot,
  HeartPulse,
  Calendar,
  Activity,
  Cpu,
  Globe2,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function AboutPage() {
  const { theme } = useWeather();

  const coreCapabilities = [
    {
      icon: CloudRain,
      title: "Atmospheric Telemetry & Real-Time Sync",
      desc: "Instantaneous synchronization with global meteorological sensor stations, measuring temperature, barometric pressure, wind velocity, humidity, and optical visibility.",
    },
    {
      icon: Calendar,
      title: "Genuine 7-Day Synoptic Forecasting",
      desc: "Seven full days of predictive meteorological data powered by Open-Meteo & WeatherAPI, showing diurnal ranges, precipitation probabilities, and atmospheric stability.",
    },
    {
      icon: HeartPulse,
      title: "US EPA Environmental Air Quality Monitoring",
      desc: "Microscopic particulate telemetry evaluating PM2.5, PM10, Carbon Monoxide, Nitrogen Dioxide, and Ground Ozone with health guidance protocols.",
    },
    {
      icon: Bot,
      title: "Cognitive AI Copilot with Gemini 3.1 Flash",
      desc: "Meteorological reasoning engine answering lifestyle, wardrobe, travel safety, and outdoor fitness questions tailored to live atmospheric physics.",
    },
    {
      icon: Activity,
      title: "Diurnal Hourly Progression & Visual Analytics",
      desc: "Continuous 24-hour thermal curves and instruments including 360° wind vector compasses and solar dawn-to-dusk arc trackers.",
    },
    {
      icon: Globe2,
      title: "Universal Global Station Search & Bookmarks",
      desc: "Fast global city indexing, browser voice recognition queries, automated geolocation detection, and persistent client-side location bookmarks.",
    },
  ];

  const techStack = [
    { name: "React 19", role: "Component Architecture & Hooks" },
    { name: "React Router DOM", role: "Client-Side Multi-Page Routing" },
    { name: "Tailwind CSS v4", role: "Utility-First Styling & Apple Design Tokens" },
    { name: "GSAP & Framer Motion", role: "Living Environmental Motion & Micro-Interactions" },
    { name: "Recharts", role: "SVG Diurnal Thermal Area Trajectories" },
    { name: "Google Gemini 3.1 Flash", role: "Cognitive Meteorological Reasoning" },
    { name: "WeatherAPI & Open-Meteo", role: "Live Telemetry & 7-Day Forecast Data" },
    { name: "Node.js & Express 5", role: "Backend Microservice & API Proxy" },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 pt-2 max-w-5xl mx-auto">
      {/* Hero Editorial Card */}
      <div className="apple-card p-6 sm:p-10 md:p-14 text-center sm:text-left relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF] border border-[var(--accent-primary)]/20 mb-3 sm:mb-4">
            <Sparkles size={12} className="text-[#D9B77A]" /> Next-Gen Meteorological Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)]">
            WeatherVerse Platform
          </h1>

          <p className="text-sm sm:text-lg text-[var(--text-secondary)] mt-3 sm:mt-4 leading-relaxed font-normal">
            WeatherVerse is a personal atmospheric intelligence platform designed to bridge physical meteorological telemetry with cognitive AI reasoning. Engineered from the ground up to replace dated, cluttered weather portals with a calm, aesthetic, and interactive experience inspired by Apple's human interface principles.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-3 mt-6 sm:mt-8">
            <Link
              to="/"
              className="apple-btn-primary px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium"
            >
              Explore Live Weather
            </Link>
            <Link
              to="/ai"
              className="apple-btn-secondary px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium"
            >
              Consult AI Copilot
            </Link>
          </div>
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Platform Architecture & Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Engineered with strict separation of concerns, high-density visualization, and live sensor synthesis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {coreCapabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="apple-card p-4 sm:p-6 flex flex-col justify-between group hover:border-[var(--accent-primary)]/40 transition-all"
              >
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF] mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] mb-1.5 sm:mb-2">{cap.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="apple-card p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[var(--border-subtle)]">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF] shrink-0">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-[var(--text-primary)]">Technology Ecosystem</h3>
            <p className="text-xs text-[var(--text-secondary)]">Modern web technologies powering the WeatherVerse stack</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-card-secondary)] border border-[var(--border-subtle)]"
            >
              <span className="font-semibold text-xs sm:text-sm text-[var(--accent-primary)] dark:text-[#8E8AFF] block">
                {tech.name}
              </span>
              <span className="text-xs text-[var(--text-secondary)] block mt-0.5 leading-relaxed">{tech.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
