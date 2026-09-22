import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { useWeather } from "../context/WeatherContext";

export default function WeatherEnvironment({ condition = "", sunrise, sunset }) {
  const { theme } = useWeather();
  const containerRef = useRef(null);
  const cond = (condition || "").toLowerCase();

  // Determine current weather mood & type
  const weatherType = useMemo(() => {
    if (cond.includes("thunder") || cond.includes("storm") || cond.includes("lightning")) return "storm";
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("shower")) return "rain";
    if (cond.includes("snow") || cond.includes("blizzard") || cond.includes("ice") || cond.includes("sleet")) return "snow";
    if (cond.includes("fog") || cond.includes("mist") || cond.includes("haze")) return "fog";
    if (cond.includes("cloud") || cond.includes("overcast")) return "cloudy";
    return "sunny";
  }, [cond]);

  const isDark = theme === "dark";

  // GSAP animation engine & smooth Night <-> Day transition
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Atmosphere Transition (0.8s smooth transition between night & day)
      gsap.to(".env-base-canvas", {
        backgroundColor: isDark ? "#000000" : "#F3E9DC",
        duration: 0.8,
        ease: "power2.inOut",
      });

      // 2. Ambient Aurora / Daylight Glow Pulsing
      gsap.to(".env-aurora-1", {
        x: "random(-35, 35)",
        y: "random(-25, 25)",
        scale: 1.12,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".env-aurora-2", {
        x: "random(-30, 30)",
        y: "random(-35, 35)",
        scale: 1.14,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // 3. Condition-specific GSAP Timelines
      if (weatherType === "sunny") {
        // Sun glow breathing
        gsap.to(".env-sun-disc", {
          scale: 1.08,
          opacity: isDark ? 0.38 : 0.82,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });

        // Floating solar motes
        const motes = gsap.utils.toArray(".env-solar-mote");
        motes.forEach((mote, i) => {
          gsap.to(mote, {
            y: "-=55",
            x: "random(-25, 25)",
            opacity: "random(0.3, 0.75)",
            duration: 3 + (i % 4) * 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        });
      }

      if (weatherType === "cloudy") {
        gsap.to(".env-cloud-layer-1", {
          x: "100vw",
          duration: 55,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".env-cloud-layer-2", {
          x: "100vw",
          duration: 38,
          repeat: -1,
          ease: "none",
          delay: 4,
        });
      }

      if (weatherType === "rain" || weatherType === "storm") {
        const drops = gsap.utils.toArray(".env-rain-drop");
        drops.forEach((drop, i) => {
          gsap.fromTo(
            drop,
            { y: -70, opacity: 0 },
            {
              y: window.innerHeight + 100,
              opacity: 0.65,
              duration: 0.65 + (i % 5) * 0.08,
              repeat: -1,
              ease: "none",
              delay: (i % 12) * 0.07,
            }
          );
        });
      }

      if (weatherType === "storm") {
        const flashTL = gsap.timeline({ repeat: -1, repeatDelay: 6 });
        flashTL
          .to(".env-lightning-flash", { opacity: 0.6, duration: 0.06, ease: "power4.in" })
          .to(".env-lightning-flash", { opacity: 0.1, duration: 0.04 })
          .to(".env-lightning-flash", { opacity: 0.8, duration: 0.08, ease: "power4.out" })
          .to(".env-lightning-flash", { opacity: 0, duration: 0.35, ease: "power2.out" });
      }

      if (weatherType === "snow") {
        const flakes = gsap.utils.toArray(".env-snow-flake");
        flakes.forEach((flake, i) => {
          gsap.fromTo(
            flake,
            { y: -40, x: 0, opacity: 0 },
            {
              y: window.innerHeight + 60,
              x: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 12),
              opacity: 0.8,
              duration: 4 + (i % 6) * 1.2,
              repeat: -1,
              ease: "none",
              delay: (i % 8) * 0.45,
            }
          );
        });
      }

      if (weatherType === "fog") {
        gsap.to(".env-fog-layer", {
          x: "random(-50, 50)",
          opacity: isDark ? 0.35 : 0.55,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [weatherType, isDark]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Ambient Canvas Layer (Animated with GSAP) */}
      <div
        className="env-base-canvas absolute inset-0"
        style={{
          backgroundColor: isDark ? "#000000" : "#F3E9DC",
        }}
      />

      {/* 2. Atmospheric Aurora Ambient Spheres */}
      <div
        className="env-aurora-1 absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(88, 86, 214, 0.22) 0%, rgba(10, 132, 255, 0.12) 60%, transparent 100%)"
            : "radial-gradient(circle, rgba(217, 183, 122, 0.30) 0%, rgba(233, 216, 197, 0.25) 60%, transparent 100%)",
        }}
      />
      <div
        className="env-aurora-2 absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(48, 209, 88, 0.12) 0%, rgba(100, 210, 255, 0.10) 65%, transparent 100%)"
            : "radial-gradient(circle, rgba(185, 130, 90, 0.18) 0%, rgba(142, 183, 201, 0.14) 65%, transparent 100%)",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255, 159, 10, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(217, 183, 122, 0.18) 0%, transparent 70%)",
        }}
      />

      {/* 3. Living Condition Layers */}
      {/* SUNNY STATE */}
      {weatherType === "sunny" && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="env-sun-disc absolute -top-20 right-10 w-96 h-96 rounded-full blur-[90px] pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(255, 214, 10, 0.28) 0%, rgba(255, 159, 10, 0.12) 60%, transparent 100%)"
                : "radial-gradient(circle, rgba(217, 183, 122, 0.45) 0%, rgba(185, 130, 90, 0.18) 60%, transparent 100%)",
            }}
          />
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={`mote-${i}`}
              className="env-solar-mote absolute rounded-full pointer-events-none"
              style={{
                top: `${12 + ((i * 5.4) % 65)}%`,
                left: `${35 + ((i * 4.3) % 60)}%`,
                width: `${3 + (i % 3) * 2}px`,
                height: `${3 + (i % 3) * 2}px`,
                backgroundColor: isDark ? "#FFD60A" : "#B9825A",
                opacity: 0.45,
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </div>
      )}

      {/* CLOUDY STATE */}
      {weatherType === "cloudy" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="env-cloud-layer-1 absolute -top-12 -left-[600px] w-[900px] h-[340px] rounded-full blur-[80px]"
            style={{
              backgroundColor: isDark ? "rgba(44, 44, 46, 0.65)" : "rgba(185, 165, 148, 0.38)",
            }}
          />
          <div
            className="env-cloud-layer-2 absolute top-28 -left-[500px] w-[750px] h-[280px] rounded-full blur-[70px]"
            style={{
              backgroundColor: isDark ? "rgba(58, 58, 60, 0.45)" : "rgba(233, 216, 197, 0.55)",
            }}
          />
        </div>
      )}

      {/* RAIN STATE */}
      {(weatherType === "rain" || weatherType === "storm") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundColor: isDark ? "rgba(10, 132, 255, 0.05)" : "rgba(142, 183, 201, 0.09)",
            }}
          />
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="env-rain-drop absolute top-0 rounded-full"
              style={{
                left: `${(i * 2.1 + (i % 5)) % 100}%`,
                width: "2px",
                height: `${18 + (i % 4) * 8}px`,
                backgroundColor: isDark ? "#64D2FF" : "#8EB7C9",
                transform: "rotate(14deg)",
              }}
            />
          ))}
        </div>
      )}

      {/* STORM STATE */}
      {weatherType === "storm" && (
        <>
          <div
            className="env-lightning-flash absolute inset-0 pointer-events-none opacity-0"
            style={{
              backgroundColor: isDark ? "rgba(218, 226, 255, 0.35)" : "rgba(243, 233, 220, 0.45)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? "radial-gradient(circle at 50% 20%, rgba(88, 86, 214, 0.18), transparent 70%)"
                : "radial-gradient(circle at 50% 20%, rgba(122, 79, 53, 0.15), transparent 70%)",
            }}
          />
        </>
      )}

      {/* SNOW STATE */}
      {weatherType === "snow" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="env-snow-flake absolute top-0 rounded-full shadow-sm"
              style={{
                left: `${(i * 2.6) % 100}%`,
                width: `${4 + (i % 3) * 2.5}px`,
                height: `${4 + (i % 3) * 2.5}px`,
                backgroundColor: isDark ? "#FFFFFF" : "#FFF9F2",
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </div>
      )}

      {/* FOG STATE */}
      {weatherType === "fog" && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="env-fog-layer absolute top-20 left-0 right-0 h-96 blur-3xl"
            style={{
              background: isDark
                ? "linear-gradient(90deg, rgba(44, 44, 46, 0.5), rgba(72, 72, 74, 0.4), rgba(44, 44, 46, 0.5))"
                : "linear-gradient(90deg, rgba(233, 216, 197, 0.5), rgba(248, 239, 229, 0.7), rgba(233, 216, 197, 0.5))",
            }}
          />
        </div>
      )}
    </div>
  );
}
