import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Forecast, localTime } from "./weather";
export function ForecastCard({
  forecast,
  domain,
}: {
  forecast: Forecast;
  domain: [number, number];
}) {
  const { city, points, error } = forecast;
  const title = `city-${city.id}`;
  const missing = points.some(
    (p) =>
      p.temperature === null || p.humidity === null || p.precipitation === null,
  );
  return (
    <article className="card h-100" aria-labelledby={title}>
      <div className="card-body">
        <h2 id={title} className="h5 mb-2">
          {city.country} · {city.capital}
        </h2>
        {error ? (
          <p className="text-body-secondary">{error}</p>
        ) : (
          <>
            <p className="small text-body-secondary mb-2">
              24時間予報 · 現地時間（{city.timezone}）
            </p>
            <div
              className="d-flex flex-wrap gap-3 small mb-2"
              aria-label="凡例"
              role="img"
            >
              <span className="temperature-color">━ 気温 °C</span>
              <span className="humidity-color">┄ 相対湿度 %</span>
              <span className="rain-color">▮ 降水確率 %</span>
            </div>
            <div className="forecast-chart">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={points}
                  margin={{ top: 12, right: 0, bottom: 8, left: 0 }}
                  accessibilityLayer
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--bs-border-color)"
                  />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(time) =>
                      localTime(time, city.timezone, true)
                    }
                    minTickGap={28}
                    tick={{ fill: "var(--bs-body-color)", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="temperature"
                    domain={domain}
                    width={42}
                    tickFormatter={(v) => `${v}°C`}
                    tick={{ fill: "var(--bs-body-color)", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="percent"
                    orientation="right"
                    domain={[0, 100]}
                    width={40}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "var(--bs-body-color)", fontSize: 11 }}
                  />
                  <Tooltip
                    isAnimationActive={false}
                    filterNull={false}
                    labelFormatter={(time) =>
                      localTime(Number(time), city.timezone)
                    }
                    formatter={(value, name) => [
                      value == null
                        ? "データなし"
                        : value + (name === "気温" ? " °C" : " %"),
                      name,
                    ]}
                    contentStyle={{
                      background: "var(--bs-body-bg)",
                      borderColor: "var(--bs-border-color)",
                      color: "var(--bs-body-color)",
                    }}
                  />
                  <Bar
                    dataKey="precipitation"
                    name="降水確率"
                    yAxisId="percent"
                    fill="var(--rain)"
                    maxBarSize={8}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="humidity"
                    name="相対湿度"
                    yAxisId="percent"
                    stroke="var(--humidity)"
                    strokeDasharray="5 4"
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="temperature"
                    name="気温"
                    yAxisId="temperature"
                    stroke="var(--temperature)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            {missing && (
              <p className="small text-body-secondary">
                一部の値はデータなしです。
              </p>
            )}
            <details className="mt-2">
              <summary>予報を表で確認</summary>
              <div className="table-responsive mt-2">
                <table className="table table-sm small">
                  <caption>{city.capital}の24時間予報（現地時間）</caption>
                  <thead>
                    <tr>
                      <th scope="col">日時</th>
                      <th scope="col">気温 °C</th>
                      <th scope="col">湿度 %</th>
                      <th scope="col">降水確率 %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((p) => (
                      <tr key={p.time}>
                        <th scope="row" className="text-nowrap">
                          {localTime(p.time, city.timezone)}
                        </th>
                        <td>{p.temperature ?? "データなし"}</td>
                        <td>{p.humidity ?? "データなし"}</td>
                        <td>{p.precipitation ?? "データなし"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </div>
    </article>
  );
}
