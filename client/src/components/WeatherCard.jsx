import { motion } from "framer-motion";
import WeatherEffects from "./WeatherEffects";
import TemperatureChart from "./TemperatureChart";

function WeatherCard({
  city,
  temperature,
  feelsLike,
  condition,
  description,
  humidity,
  pressure,
  visibility,
  wind,
  sunrise,
  sunset,
  icon,
  hourly = [],
  daily = [],
  theme,
}) {
  const cardClass =
    theme === "dark"
      ? "bg-white/10 border-white/20 text-white"
      : "bg-white/90 border-gray-200 text-slate-900";

  const boxClass =
    theme === "dark"
      ? "bg-white/10"
      : "bg-slate-100";

  const secondaryText =
    theme === "dark"
      ? "text-gray-300"
      : "text-slate-600";

  function getWeatherEmoji(condition) {
    const text = condition.toLowerCase();

    if (text.includes("thunder") || text.includes("storm"))
      return "⛈️";

    if (
      text.includes("heavy rain") ||
      text.includes("moderate rain") ||
      text.includes("light rain") ||
      text.includes("patchy rain") ||
      text.includes("rain shower") ||
      text.includes("rain")
    )
      return "🌧️";

    if (text.includes("drizzle"))
      return "🌦️";

    if (
      text.includes("snow") ||
      text.includes("blizzard") ||
      text.includes("ice")
    )
      return "❄️";

    if (
      text.includes("mist") ||
      text.includes("fog") ||
      text.includes("haze")
    )
      return "🌫️";

    if (text.includes("overcast"))
      return "☁️";

    if (text.includes("cloudy"))
      return "☁️";

    if (text.includes("partly cloudy"))
      return "⛅";

    if (
      text.includes("sunny") ||
      text.includes("clear")
    )
      return "☀️";

    return "🌤️";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative mt-6 w-full max-w-md sm:max-w-xl mx-auto overflow-hidden rounded-[24px] sm:rounded-[32px]
       backdrop-blur-2xl border shadow-[0_15px_40px_rgba(0,0,0,.35)]
       transition-all duration-500 ${cardClass}`}
    >
      <WeatherEffects condition={condition} />

      <div className="relative z-10 p-4 sm:p-7 text-center">

        <motion.img
          src={icon}
          alt=""
          className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto drop-shadow-2xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        <motion.h2
          className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 break-words"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          📍 {city}
        </motion.h2>

        <p
          className={`capitalize mt-2 text-sm sm:text-base ${
            theme === "dark"
              ? "text-cyan-300"
              : "text-blue-600"
          }`}
        >
          {description}
        </p>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-black mt-4"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {temperature}°
        </motion.h1>

        <p className={`${secondaryText} text-sm sm:text-base`}>
          Feels Like {feelsLike}°C
        </p>

      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-5">

        {[
          ["💧 Humidity", humidity + "%"],
          ["💨 Wind", wind + " km/h"],
          ["🌡 Pressure", pressure],
          ["👁 Visibility", visibility + " km"],
        ].map(([title, value], index) => (

          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`${boxClass} flex-1 rounded-2xl p-3 sm:p-4 text-center`}
          >

            <p className={`${secondaryText} text-sm sm:text-base`}>
              {title}
            </p>

            <h3 className="text-lg sm:text-2xl font-bold mt-2">
              {value}
            </h3>

          </motion.div>

        ))}

      </div>

       <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-5 py-5 sm:py-6">

        <motion.div
          whileHover={{ y: -4 }}
          className={`${boxClass} flex-1 rounded-2xl p-3 sm:p-4 text-center`}
        >

          <h2 className="text-2xl sm:text-3xl">🌅</h2>

          <p className={`${secondaryText} text-sm mt-2`}>
            Sunrise
          </p>

          <h3 className="font-bold mt-1">
            {sunrise}
          </h3>

        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className={`${boxClass} flex-1 rounded-3xl p-4 text-center`}
        >

          <h2 className="text-3xl">🌇</h2>

          <p className={`${secondaryText} text-sm mt-2`}>
            Sunset
          </p>

          <h3 className="font-bold mt-1">
            {sunset}
          </h3>

        </motion.div>

      </div>

      {hourly.length > 0 && (

        <div className="relative z-10 px-4 sm:px-5 pb-6">

          <h3 className="text-lg sm:text-xl font-bold mb-4">
            ⏰ Today
          </h3>

          <div className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 w-full">

            {hourly.map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.06 }}
                className={`min-w-[85px] sm:min-w-[90px] rounded-2xl border backdrop-blur-lg p-2 sm:p-3 text-center ${
                  theme === "dark"
                    ? "bg-white/10 border-white/10"
                    : "bg-slate-100 border-gray-200"
                }`}
              >

                <p className={`text-sm ${secondaryText}`}>
                  {item.time}
                </p>

                <img
                  src={item.icon}
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto"
                />

                <h3 className="text-lg sm:text-xl font-bold">
                  {item.temp}°
                </h3>

              </motion.div>

            ))}

          </div>

        </div>

      )}

      <TemperatureChart
        hourly={hourly}
        theme={theme}
      />
            {/* 5-Day Forecast */}

      {daily.length > 0 && (
        <div className="relative z-10 px-4 sm:px-5 pb-6">

          <h3 className="text-lg sm:text-xl font-bold mb-4">
            📅 5-Day Forecast
          </h3>

          <div className="space-y-3">

            {daily.map((item, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  x: 5,
                }}
                className={`flex items-center justify-between gap-2 sm:gap-3 rounded-2xl px-3 sm:px-4 py-3 backdrop-blur-lg border transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-white/10 border-white/10"
                    : "bg-slate-100 border-gray-200"
                }`}
              >

                <div>

                  <h3 className="font-bold text-sm sm:text-base">
                    {item.day}
                  </h3>

                  <p
                    className={`text-[11px] sm:text-xs ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-slate-600"
                    }`}
                  >
                    {item.condition.length > 18
                      ? item.condition.slice(0, 18) + "..."
                      : item.condition}
                  </p>

                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-3xl sm:text-4xl">
                  {getWeatherEmoji(item.condition)}
                </div>

                <h3 className="text-lg sm:text-2xl font-bold">
                  {item.temp}°
                </h3>

              </motion.div>

            ))}

          </div>

        </div>
      )}

    </motion.div>
  );
}

export default WeatherCard;