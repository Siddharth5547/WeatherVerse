import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { convertTemp } from "../Services/WeatherService";
import { TrendingUp } from "lucide-react";

export default function TemperatureChart({ hourly = [], unit = "C", theme = "dark" }) {
  if (!hourly || hourly.length === 0) return null;

  const isDark = theme === "dark";

  // Format hourly points for chart
  const data = hourly.map((item) => ({
    time: item.time,
    temp: convertTemp(item.temp, unit),
    rawTemp: item.temp,
    condition: item.condition,
    icon: item.icon,
  }));

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;

  // Day mode uses Coffee Brown #7A4F35 + Champagne #D9B77A; Night mode uses #5856D6 / #8E8AFF
  const strokeColor = isDark ? "#8E8AFF" : "#7A4F35";
  const gradientColor = isDark ? "#5856D6" : "#D9B77A";
  const axisColor = isDark ? "#AEAEB2" : "#5E4A3A";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(122, 79, 53, 0.09)";

  // Apple Minimal Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="p-3 rounded-2xl border shadow-lg backdrop-blur-xl text-xs space-y-1 apple-card">
          <div className="flex items-center gap-2">
            {p.icon && <img src={p.icon} alt="" className="w-5 h-5 object-contain" />}
            <span className="font-semibold text-[var(--text-primary)]">{p.time}</span>
          </div>
          <div className="text-base font-bold text-[var(--accent-primary)] dark:text-[#8E8AFF]">
            {p.temp}°{unit}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">{p.condition}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="apple-card p-4 sm:p-6 md:p-8 w-full min-w-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] dark:text-[#8E8AFF] shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-[var(--text-primary)] leading-tight">
              24-Hour Temperature Trajectory
            </h3>
            <p className="text-[11px] sm:text-xs text-[var(--text-secondary)]">Diurnal continuous thermal gradient</p>
          </div>
        </div>

        <div className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:text-[#8E8AFF] border border-[var(--accent-primary)]/20">
          Peak {Math.max(...temps)}°{unit}
        </div>
      </div>

      <div className="h-52 sm:h-64 w-full pt-1 sm:pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: -26, bottom: 0 }}>
            <defs>
              <linearGradient id="appleTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={isDark ? 0.45 : 0.35} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridColor}
            />

            <XAxis
              dataKey="time"
              interval="preserveStartEnd"
              tick={{
                fill: axisColor,
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={{ stroke: isDark ? "#38383A" : "#D8C5B3" }}
              tickLine={false}
            />

            <YAxis
              domain={[minTemp, maxTemp]}
              tick={{
                fill: axisColor,
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="natural"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#appleTempGradient)"
              dot={{ r: 2.5, fill: strokeColor, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: strokeColor,
                stroke: isDark ? "#000000" : "#FFF9F2",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
