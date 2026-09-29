import { expect, test } from "@playwright/test";

const api = "https://api.open-meteo.com/v1/forecast?**";
function payload() {
  const start = Math.floor(Date.now() / 3600000) * 3600;
  return Array.from({ length: 12 }, () => ({
    hourly: {
      time: Array.from({ length: 25 }, (_, i) => start + i * 3600),
      temperature_2m: Array(25).fill(21),
      relative_humidity_2m: Array(25).fill(60),
      precipitation_probability: Array(25).fill(null),
    },
  }));
}
test("読み込みから12地点・データ表を表示する", async ({ page }) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(api, async (route) => {
    await gate;
    await route.fulfill({ json: payload() });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status")).toHaveText("予報を読み込んでいます");
  release();
  await expect(page.getByRole("article")).toHaveCount(12);
  const tokyo = page.getByRole("article", { name: "日本 · 東京" });
  await tokyo.locator("summary").click();
  await expect(tokyo.getByRole("table")).toBeVisible();
  await expect(tokyo.locator("tbody tr")).toHaveCount(24);
  await expect(tokyo.locator("tbody tr").first()).toContainText("データなし");
  await expect(page.locator("footer, h1")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "JADENgygoのXプロフィール（新しいタブ）" }),
  ).toHaveAttribute("href", "https://x.com/JADENgygo");
});
test("テーマ・標準部品・ブラウザ色を同期し保存する", async ({ page }) => {
  await page.route(api, (route) => route.fulfill({ json: payload() }));
  await page.goto("/");
  await page.getByRole("button", { name: "ダークテーマに切り替える" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-bs-theme", "dark");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#212529",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-bs-theme", "dark");
});
test("失敗から再試行できる", async ({ page }) => {
  let fail = true;
  await page.route(api, (route) =>
    fail ? route.fulfill({ status: 503 }) : route.fulfill({ json: payload() }),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("取得できません");
  fail = false;
  await page.getByRole("button", { name: "もう一度読み込む" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
});
test("部分失敗でも正常地点を表示する", async ({ page }) => {
  await page.route(api, (route) => {
    const data: unknown[] = payload();
    data[0] = {};
    return route.fulfill({ json: data });
  });
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("一部");
  await expect(
    page.getByRole("article", { name: "日本 · 東京" }),
  ).toContainText("この地点");
  await expect(
    page.getByRole("article", { name: "フランス · パリ" }).locator("summary"),
  ).toBeVisible();
});
test("スマホで横にはみ出さずアニメーションがない", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route(api, (route) => route.fulfill({ json: payload() }));
  await page.goto("/");
  await expect(page.getByRole("article")).toHaveCount(12);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});
