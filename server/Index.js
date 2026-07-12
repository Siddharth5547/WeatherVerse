const express = require("express");
const cors = require("cors");

const weatherRoutes = require("./Routes/WeatherRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "https://weather-verse-b79bu3624-weather-now.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET"],
  })
);

app.use(express.json());

app.use("/api/weather", weatherRoutes);

module.exports = app;