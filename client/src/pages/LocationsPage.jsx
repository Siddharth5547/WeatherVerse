import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Plus,
  Trash2,
  ArrowRight,
  MapPin,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { convertTemp } from "../Services/WeatherService";
import SkeletonLoader from "../components/SkeletonLoader";

export default function LocationsPage() {
  const { savedLocations, toggleSaveLocation, searchCity, weather, city, unit, theme, setIsSearchOpen, loading } = useWeather();
  const navigate = useNavigate();

  if (loading) return <SkeletonLoader theme={theme} />;

  const handleCardClick = (targetCity) => {
    searchCity(targetCity);
    navigate("/");
  };

  const isCurrentCitySaved = savedLocations.some(
    (item) => item.city.toLowerCase() === city.toLowerCase()
  );

  return (
    <div className="space-y-8 pb-16 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent-primary)] dark:text-[#8E8AFF] text-xs font-semibold uppercase tracking-wider mb-1">
            <Bookmark size={14} /> Location Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Saved Locations
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Quick-access bookmark directory of monitored atmospheric stations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isCurrentCitySaved && weather && (
            <button
              onClick={() => toggleSaveLocation(weather)}
              className="apple-btn-primary px-3 sm:px-4 py-2 text-xs font-medium flex items-center gap-1.5 shrink-0"
            >
              <Plus size={14} /> Save Current ({city})
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="apple-btn-secondary px-3.5 sm:px-4 py-2 text-xs font-medium"
          >
            + Search City
          </button>
        </div>
      </div>

      {/* Locations Grid */}
      {savedLocations.length === 0 ? (
        <div className="apple-card p-6 sm:p-12 text-center">
          <Bookmark size={36} className="mx-auto mb-3 text-[var(--accent-primary)] dark:text-[#8E8AFF] opacity-60" />
          <h3 className="font-semibold text-lg text-[var(--text-primary)]">No Saved Locations</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto mt-1 mb-5">
            Bookmark cities to monitor atmospheric conditions across multiple regions simultaneously.
          </p>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="apple-btn-primary px-5 py-2.5 text-xs font-medium"
          >
            Explore & Bookmark Cities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <AnimatePresence>
            {savedLocations.map((loc) => {
              const isCurrent = loc.city.toLowerCase() === city.toLowerCase();

              return (
                <motion.div
                  key={loc.city}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className={`apple-card p-4 sm:p-6 relative overflow-hidden group hover:border-[var(--accent-primary)]/40 transition-all ${
                    isCurrent ? "ring-2 ring-[var(--accent-primary)] border-[var(--accent-primary)]" : ""
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[var(--accent-primary)] dark:text-[#8E8AFF]" />
                      <h3 className="font-semibold text-xl text-[var(--text-primary)]">{loc.city}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] dark:text-[#8E8AFF]">
                          Active
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveLocation({ city: loc.city });
                      }}
                      className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Weather Information Body */}
                  <div
                    onClick={() => handleCardClick(loc.city)}
                    className="cursor-pointer my-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text-primary)]">
                          {convertTemp(loc.temp, unit)}°
                        </span>
                        <span className="text-sm font-normal text-[var(--text-muted)]">{unit}</span>
                      </div>
                      <span className="text-xs font-medium text-[var(--text-secondary)] block mt-1">{loc.condition}</span>
                    </div>

                    <img
                      src={loc.icon}
                      alt={loc.condition}
                      className="w-16 h-16 object-contain drop-shadow group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* High / Low Bar & Activation Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] text-xs">
                    <div className="flex items-center gap-3 font-medium text-[var(--text-secondary)]">
                      <span className="flex items-center gap-0.5">
                        <ArrowUp size={12} className="text-rose-500" /> H: {convertTemp(loc.high ?? loc.temp + 3, unit)}°
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ArrowDown size={12} className="text-[#8EB7C9]" /> L: {convertTemp(loc.low ?? loc.temp - 3, unit)}°
                      </span>
                    </div>

                    <button
                      onClick={() => handleCardClick(loc.city)}
                      className="font-semibold text-[var(--accent-primary)] dark:text-[#8E8AFF] hover:underline flex items-center gap-1 transition"
                    >
                      Inspect <ArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
