import { afterEach, describe, expect, it, vi } from "vitest";
import { cities } from "./cities";
import { initialTheme } from "./theme";
import {
  fetchForecasts,
  forecastUrl,
  localTime,
  parseForecast,
  temperatureDomain,
} from "./weather";

const start = Date.UTC(2026, 8, 28, 15);
function payload() {
  return {
    hourly: {
      time: Array.from({ length: 25 }, (_, i) => start / 1000 + i * 3600),
      temperature_2m: Array(25).fill(20),
      relative_humidity_2m: Array(25).fill(60),
      precipitation_probability: Array(25).fill(null),
    },
  };
}
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("予報", () => {
  it("現在時刻以降の24時間と欠測を保持する", () => {
    const f = parseForecast(cities[0], payload(), start + 1);
    expect(f.points).toHaveLength(24);
    expect(f.points[0].time).toBe(start + 3600000);
    expect(f.points[0].precipitation).toBeNull();
  });
  it("配列長と割合を検証する", () => {
    const p = payload();
    p.hourly.relative_humidity_2m[0] = 101;
    expect(() => parseForecast(cities[0], p, start)).toThrow();
    p.hourly.relative_humidity_2m = [];
    expect(() => parseForecast(cities[0], p, start)).toThrow();
  });
  it("重複日時と不足時間を拒否する", () => {
    const p = payload();
    p.hourly.time[1] = p.hourly.time[0];
    expect(() => parseForecast(cities[0], p, start)).toThrow();
    expect(() =>
      parseForecast(cities[0], payload(), start + 7200001),
    ).toThrow();
  });
  it("現地時間の日付またぎを表示する", () => {
    expect(localTime(start, "Asia/Tokyo")).toContain("9/29");
    expect(localTime(start, "America/New_York")).toContain("9/28");
  });
  it("共通気温軸を作る", () => {
    expect(
      temperatureDomain([parseForecast(cities[0], payload(), start)]),
    ).toEqual([15, 25]);
    expect(temperatureDomain([])).toEqual([0, 40]);
  });
  it("12地点と全系列を要求する", () => {
    const url = new URL(forecastUrl());
    expect(url.searchParams.get("latitude")?.split(",")).toHaveLength(12);
    expect(url.searchParams.get("hourly")).toBe(
      "temperature_2m,relative_humidity_2m,precipitation_probability",
    );
    expect(url.searchParams.get("timeformat")).toBe("unixtime");
  });
  it("一地点が不正でも他地点は表示できる", async () => {
    vi.spyOn(Date, "now").mockReturnValue(start);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => cities.map((_, i) => (i === 0 ? {} : payload())),
      }),
    );
    const result = await fetchForecasts(new AbortController().signal);
    expect(result[0].error).toBeTruthy();
    expect(result[1].points).toHaveLength(24);
  });
  it("HTTP失敗を通知する", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      fetchForecasts(new AbortController().signal),
    ).rejects.toThrow();
  });
  it("中断後の応答を採用しない", async () => {
    const controller = new AbortController();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          controller.abort();
          return [];
        },
      }),
    );
    await expect(fetchForecasts(controller.signal)).rejects.toThrow();
  });
});
describe("初期テーマ", () => {
  it("保存値を優先する", () =>
    expect(initialTheme(() => "dark", false)).toBe("dark"));
  it("不正値と保存不能時はOS設定に従う", () => {
    expect(initialTheme(() => "invalid", true)).toBe("dark");
    expect(
      initialTheme(() => {
        throw new Error();
      }, false),
    ).toBe("light");
  });
});
