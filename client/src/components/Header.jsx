import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

function Header({ theme, toggleTheme }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative text-center mb-8 sm:mb-10">

      {/* Theme Toggle */}

      <button
        onClick={toggleTheme}
        className={`absolute top-0 right-0
        w-11 h-11 sm:w-14 sm:h-14
        rounded-full flex items-center justify-center
        shadow-xl transition-all duration-300
        ${
          theme === "dark"
            ? "bg-white/10 border border-white/20 text-yellow-300"
            : "bg-white border border-slate-300 text-slate-800"
        }`}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 sm:w-7 sm:h-7" />
        ) : (
          <Moon className="w-5 h-5 sm:w-7 sm:h-7" />
        )}
      </button>

      {/* Logo */}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
        className={`mx-auto
        w-20 h-20 sm:w-28 sm:h-28
        rounded-full
        flex items-center justify-center
        border shadow-2xl
        ${
          theme === "dark"
            ? "bg-white/10 backdrop-blur-xl border-white/20"
            : "bg-white/80 backdrop-blur-xl border-slate-300"
        }`}
      >
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
          alt="Weather"
          className="w-12 h-12 sm:w-16 sm:h-16"
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
        />
      </motion.div>

      {/* Title */}

      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mt-5
        text-4xl sm:text-5xl lg:text-6xl
        font-black leading-tight
        ${
          theme === "dark"
            ? "text-white"
            : "text-slate-900"
        }`}
      >
        Weather
        <span className="text-cyan-500">Now</span>
      </motion.h1>

      {/* Subtitle */}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className={`mt-2
        text-base sm:text-xl lg:text-2xl
        ${
          theme === "dark"
            ? "text-gray-300"
            : "text-slate-700"
        }`}
      >
        Real-Time Weather Forecast
      </motion.p>

      {/* Date */}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-3
        text-sm sm:text-base lg:text-lg
        ${
          theme === "dark"
            ? "text-gray-400"
            : "text-slate-600"
        }`}
      >
        {today}
      </motion.p>

    </div>
  );
}

export default Header;