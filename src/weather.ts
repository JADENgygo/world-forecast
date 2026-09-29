import { type City, cities } from "./cities";
export type Point = {
  time: number;
  temperature: number | null;
  humidity: number | null;
  precipitation: number | null;
};
export type Forecast = { city: City; points: Point[]; error?: string };
const fields = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation_probability",
] as const;
export function forecastUrl() {
  return (
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: cities.map((c) => c.latitude).join(","),
      longitude: cities.map((c) => c.longitude).join(","),
      hourly: fields.join(","),
      forecast_hours: "25",
      timeformat: "unixtime",
      timezone: "GMT",
    })
  );
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("予報の形式が不正です");
  return value as Record<string, unknown>;
}
export function parseForecast(
  city: City,
  payload: unknown,
  now: number,
): Forecast {
  const hourly = record(record(payload).hourly);
  const times = hourly.time;
  if (!Array.isArray(times) || !times.length)
    throw new Error("予報日時がありません");
  const series = fields.map((field, index) => {
    const values = hourly[field];
    if (
      !Array.isArray(values) ||
      values.length !== times.length ||
      values.some(
        (v) =>
          v !== null &&
          (typeof v !== "number" ||
            !Number.isFinite(v) ||
            (index > 0 && (v < 0 || v > 100))),
      )
    )
      throw new Error("予報値が不正です");
    return values as (number | null)[];
  });
  if (
    times.some(
      (v, i) =>
        typeof v !== "number" ||
        !Number.isFinite(v) ||
        !Number.isFinite(new Date(v * 1000).getTime()) ||
        (i > 0 && v - times[i - 1] !== 3600),
    )
  )
    throw new Error("予報日時が不正です");
  const points = times
    .map((time, i) => ({
      time: time * 1000,
      temperature: series[0][i],
      humidity: series[1][i],
      precipitation: series[2][i],
    }))
    .filter((p) => p.time >= now)
    .slice(0, 24);
  if (points.length !== 24) throw new Error("24時間分の予報がありません");
  return { city, points };
}
export async function fetchForecasts(signal: AbortSignal): Promise<Forecast[]> {
  const now = Date.now();
  const response = await fetch(forecastUrl(), { signal });
  if (!response.ok) throw new Error("予報を取得できませんでした。");
  const payload: unknown = await response.json();
  signal.throwIfAborted();
  if (!Array.isArray(payload) || payload.length !== cities.length)
    throw new Error("地点数が一致しません。");
  return cities.map((city, i) => {
    try {
      return parseForecast(city, payload[i], now);
    } catch {
      return {
        city,
        points: [],
        error: "この地点の予報データを取得できませんでした。",
      };
    }
  });
}
export function temperatureDomain(forecasts: Forecast[]): [number, number] {
  const values = forecasts.flatMap((f) =>
    f.points.flatMap((p) => (p.temperature === null ? [] : [p.temperature])),
  );
  return values.length
    ? [
        Math.floor(Math.min(...values) / 5) * 5 - 5,
        Math.ceil(Math.max(...values) / 5) * 5 + 5,
      ]
    : [0, 40];
}
export function localTime(time: number, timezone: string, short = false) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: timezone,
    ...(short ? {} : { month: "numeric", day: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(time);
}
