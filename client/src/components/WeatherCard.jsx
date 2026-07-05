function WeatherCard(props) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl text-white">

      <h2 className="text-3xl font-bold text-center mb-6">
        📍 {props.city || "Search a City"}
      </h2>

      <div className="space-y-4 text-lg">

        <p>
          🌡️ <span className="font-semibold">Temperature :</span>{" "}
          {props.temperature}°C
        </p>

        <p>
          ☁️ <span className="font-semibold">Condition :</span>{" "}
          {props.condition}
        </p>

        <p>
          💧 <span className="font-semibold">Humidity :</span>{" "}
          {props.humidity}%
        </p>

        <p>
          💨 <span className="font-semibold">Wind :</span>{" "}
          {props.wind} km/h
        </p>

      </div>

    </div>
  );
}

export default WeatherCard;