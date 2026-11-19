"use client";

import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/utils/theme";

// ไอคอนเปลี่ยนตาม CSS (dark:) ไม่ต้องใช้ state เลยไม่มีปัญหา hydration
// The icon follows CSS (dark:), so no state and no hydration mismatch.
const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const handleToggleTheme = () => {
    const nextTheme: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // บางเบราว์เซอร์ (เช่นโหมดส่วนตัว) บันทึกไม่ได้ แต่ธีมยังเปลี่ยนได้ปกติ
      // Storage may be blocked (e.g. private mode); the theme still changes.
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:text-slate-400 dark:ring-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:outline-white ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5 dark:hidden"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-4.5 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
