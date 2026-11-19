export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

// script นี้รันใน <head> ก่อนหน้าเว็บแสดง จะได้ไม่กระพริบสีผิด ถ้าเคยกดเลือกธีมไว้ใช้ค่านั้น ถ้าไม่เคยใช้ตามการตั้งค่าเครื่อง
// Runs in <head> before the first paint: uses the saved theme, otherwise the system setting.
export const THEME_INIT_SCRIPT = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const getSaved = () => {
    try { return localStorage.getItem("${THEME_STORAGE_KEY}"); } catch { return null; }
  };
  const apply = (isDark) => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  };
  const saved = getSaved();
  apply(saved ? saved === "dark" : media.matches);
  media.addEventListener("change", (event) => {
    if (!getSaved()) apply(event.matches);
  });
})();`;
