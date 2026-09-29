export type Theme = "light" | "dark";
export const themeKey = "world-forecast-theme";
export function initialTheme(read: () => string | null, dark: boolean): Theme {
  try {
    const saved = read();
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return dark ? "dark" : "light";
}
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.bsTheme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="color-scheme"]')
    ?.setAttribute("content", theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#212529" : "#ffffff");
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    /* 保存できなくても切り替えは有効。 */
  }
}
