import React, { useMemo } from "react";

export default function AtmosphereBackground({ condition = "", theme = "dark" }) {
  const cond = (condition || "").toLowerCase();

  const weatherType = useMemo(() => {
    if (cond.includes("thunder") || cond.includes("storm") || cond.includes("lightning")) return "thunder";
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) return "rain";
    if (cond.includes("snow") || cond.includes("blizzard") || cond.includes("sleet") || cond.includes("ice")) return "snow";
    if (cond.includes("fog") || cond.includes("mist") || cond.includes("haze")) return "fog";
    if (cond.includes("cloud") || cond.includes("overcast")) return "cloudy";
    return "clear";
  }, [cond]);

  // Rain particles
  const rainDrops = useMemo(() => {
    if (weatherType !== "rain") return [];
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: `${(i * 2.1 + (i % 5)) % 100}%`,
      duration: 0.7 + (i % 5) * 0.15,
      delay: (i % 8) * 0.12,
      height: 16 + (i % 4) * 8,
      opacity: 0.3 + (i % 4) * 0.15,
    }));
  }, [weatherType]);

  // Snow particles
  const snowflakes = useMemo(() => {
    if (weatherType !== "snow") return [];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: `${(i * 2.7) % 100}%`,
      size: 3 + (i % 4) * 2,
      duration: 4 + (i % 5) * 1.5,
      delay: (i % 7) * 0.4,
      opacity: 0.4 + (i % 3) * 0.25,
    }));
  }, [weatherType]);

  // Stars for dark mode night
  const stars = useMemo(() => {
    if (theme !== "dark" || weatherType === "rain" || weatherType === "thunder") return [];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      top: `${(i * 13) % 70}%`,
      left: `${(i * 19) % 96}%`,
      size: 1.5 + (i % 3),
      delay: (i % 5) * 0.7,
      duration: 2 + (i % 4),
    }));
  }, [theme, weatherType]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-1000">
      {/* Dynamic Background Gradients */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          theme === "dark"
            ? weatherType === "thunder"
              ? "bg-gradient-to-b from-[#0a0518] via-[#0d0d24] to-[#04040a]"
              : weatherType === "rain"
              ? "bg-gradient-to-b from-[#09152a] via-[#0c1c36] to-[#040b17]"
              : weatherType === "snow"
              ? "bg-gradient-to-b from-[#0f1f33] via-[#152740] to-[#0b1420]"
              : weatherType === "cloudy"
              ? "bg-gradient-to-b from-[#111827] via-[#162033] to-[#090d16]"
              : weatherType === "fog"
              ? "bg-gradient-to-b from-[#131b26] via-[#182330] to-[#0d121a]"
              : "bg-gradient-to-b from-[#0a152e] via-[#0d1b38] to-[#040814]"
            : weatherType === "thunder"
            ? "bg-gradient-to-b from-[#64748b] via-[#94a3b8] to-[#cbd5e1]"
            : weatherType === "rain"
            ? "bg-gradient-to-b from-[#bae6fd] via-[#e0f2fe] to-[#f0f9ff]"
            : weatherType === "snow"
            ? "bg-gradient-to-b from-[#e0f2fe] via-[#f1f5f9] to-[#ffffff]"
            : weatherType === "cloudy"
            ? "bg-gradient-to-b from-[#cbd5e1] via-[#e2e8f0] to-[#f8fafc]"
            : weatherType === "fog"
            ? "bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#f1f5f9]"
            : "bg-gradient-to-b from-[#38bdf8]/30 via-[#7dd3fc]/20 to-[#e0f2fe]/40"
        }`}
      />

      {/* Clear Day Sunlight Glow */}
      {weatherType === "clear" && (
        <div
          className={`absolute -top-32 right-10 w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000 ${
            theme === "dark"
              ? "bg-cyan-500/15"
              : "bg-amber-300/35"
          }`}
        />
      )}

      {/* Thunderstorm Lightning Flash */}
      {weatherType === "thunder" && (
        <div className="absolute inset-0 bg-indigo-100/10 animate-lightning" />
      )}

      {/* Rain Particle Layer */}
      {weatherType === "rain" && (
        <div className="absolute inset-0">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute top-0 w-[1.5px] rounded-full bg-cyan-400"
              style={{
                left: drop.left,
                height: `${drop.height}px`,
                opacity: drop.opacity,
                animation: `rain-fall ${drop.duration}s linear infinite`,
                animationDelay: `${drop.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Particle Layer */}
      {weatherType === "snow" && (
        <div className="absolute inset-0">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute top-0 rounded-full bg-white blur-[0.5px]"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: flake.opacity,
                animation: `snow-drift ${flake.duration}s linear infinite`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Night Starfield */}
      {stars.length > 0 && (
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient Volumetric Clouds */}
      {(weatherType === "cloudy" || weatherType === "fog" || weatherType === "rain") && (
        <div className="absolute top-12 -left-20 w-[600px] h-[250px] bg-slate-400/10 rounded-full blur-[90px] animate-float" />
      )}
    </div>
  );
}
