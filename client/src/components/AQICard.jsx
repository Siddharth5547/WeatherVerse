function AQICard({ aqi, theme }) {

  const airQuality = aqi || {
    index: 0,
    pm25: 0,
    pm10: 0,
    co: 0,
    no2: 0,
    o3: 0,
  };


  const getStatus = (index) => {
    if (index === 1) return "Good";
    if (index === 2) return "Moderate";
    if (index === 3) return "Unhealthy";
    if (index === 4) return "Poor";
    if (index === 5) return "Very Poor";

    return "Not Available";
  };


  const getStatusColor = (index) => {
    if (index === 1) return "text-green-400";
    if (index === 2) return "text-yellow-400";
    if (index === 3) return "text-orange-400";
    if (index === 4) return "text-red-400";
    if (index === 5) return "text-purple-400";

    return "text-gray-400";
  };


  return (
    <div
      className={`
        mt-6
        rounded-2xl
        p-5
        backdrop-blur-xl
        border
        transition-all
        duration-300

        ${
          theme === "dark"
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/80 border-slate-200 text-slate-900"
        }
      `}
    >

      <h2 className="text-xl font-bold mb-5">
        🌿 Air Quality Index
      </h2>


      <div className="flex items-center gap-5">

        <div className="text-5xl font-bold">
          {airQuality.index}
        </div>


        <div>

          <p
            className={`text-xl font-semibold ${getStatusColor(
              airQuality.index
            )}`}
          >
            {getStatus(airQuality.index)}
          </p>


          <p className="text-sm opacity-70">
            US EPA Air Quality Index
          </p>

        </div>

      </div>



      <div className="grid grid-cols-2 gap-4 mt-6">


        <div className="bg-black/10 rounded-xl p-3">
          <p className="text-sm opacity-70">
            PM2.5
          </p>

          <p className="text-lg font-bold">
            {airQuality.pm25}
          </p>
        </div>



        <div className="bg-black/10 rounded-xl p-3">
          <p className="text-sm opacity-70">
            PM10
          </p>

          <p className="text-lg font-bold">
            {airQuality.pm10}
          </p>
        </div>



        <div className="bg-black/10 rounded-xl p-3">
          <p className="text-sm opacity-70">
            CO
          </p>

          <p className="text-lg font-bold">
            {airQuality.co}
          </p>
        </div>



        <div className="bg-black/10 rounded-xl p-3">
          <p className="text-sm opacity-70">
            NO₂
          </p>

          <p className="text-lg font-bold">
            {airQuality.no2}
          </p>
        </div>



        <div className="bg-black/10 rounded-xl p-3">
          <p className="text-sm opacity-70">
            O₃
          </p>

          <p className="text-lg font-bold">
            {airQuality.o3}
          </p>
        </div>


      </div>


    </div>
  );
}


export default AQICard;