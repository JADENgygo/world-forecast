import { useEffect, useState } from "react";
import { cities } from "./cities";
import { ForecastCard } from "./ForecastCard";
import { applyTheme, type Theme } from "./theme";
import { type Forecast, fetchForecasts, temperatureDomain } from "./weather";

export function App({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState(initialTheme);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    loading: boolean;
    forecasts: Forecast[];
    error: string;
  }>({ loading: true, forecasts: [], error: "" });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      try {
        const forecasts = await fetchForecasts(controller.signal);
        if (active) setState({ loading: false, forecasts, error: "" });
      } catch {
        if (active)
          setState({
            loading: false,
            forecasts: [],
            error: "世界の予報を取得できませんでした。",
          });
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt]);
  const failed = Boolean(state.error) || state.forecasts.some((f) => f.error);
  function retry() {
    if (state.loading) return;
    setState({ loading: true, forecasts: [], error: "" });
    setAttempt((value) => value + 1);
  }
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }
  const domain = temperatureDomain(state.forecasts);
  return (
    <div className="container-fluid px-3 px-lg-4">
      <header className="d-flex justify-content-end align-items-center gap-2 py-3 border-bottom mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary icon-button"
          onClick={toggleTheme}
          aria-label={
            theme === "light"
              ? "ダークテーマに切り替える"
              : "ライトテーマに切り替える"
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            {theme === "light" ? (
              <path d="M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
              </>
            )}
          </svg>
        </button>
        <a
          className="btn btn-outline-secondary icon-button"
          href="https://x.com/JADENgygo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="JADENgygoのXプロフィール（新しいタブ）"
        >
          <span className="visually-hidden">
            JADENgygoのXプロフィール（新しいタブ）
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.97 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.43 4.05H6.58L17.8 19.84Z" />
          </svg>
        </a>
      </header>
      <main aria-label="世界の予報" className="pb-4">
        <div
          role="status"
          className={
            state.loading ? "mb-3 text-body-secondary" : "visually-hidden"
          }
        >
          {state.loading
            ? "予報を読み込んでいます"
            : "予報の読み込みが完了しました"}
        </div>
        {failed && (
          <div className="alert alert-warning">
            <p role="alert">
              {state.error || "一部の地点の予報を取得できませんでした。"}
            </p>
            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={state.loading}
              onClick={retry}
            >
              もう一度読み込む
            </button>
          </div>
        )}
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
          {state.loading
            ? cities.map((city) => (
                <div className="col" key={city.id}>
                  <div className="card p-3" aria-hidden="true">
                    <div className="placeholder col-6 mb-3" />
                    <div className="forecast-chart bg-body-tertiary rounded" />
                  </div>
                </div>
              ))
            : state.forecasts.map((forecast) => (
                <div className="col" key={forecast.city.id}>
                  <ForecastCard forecast={forecast} domain={domain} />
                </div>
              ))}
        </div>
        <p className="small text-body-secondary mt-3 mb-0">
          予報データ: <a href="https://open-meteo.com/">Open-Meteo</a> ·{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> ·
          各都市の現地時間で表示
        </p>
      </main>
    </div>
  );
}
