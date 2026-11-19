"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "./themeToggle";

const NAV_ITEMS = [
  { href: "/todo-list", step: "1", label: "Auto Delete Todo" },
  { href: "/department-summary", step: "2", label: "Department Summary" },
];

const SiteNav = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <p className="flex flex-1 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <span className="size-2 rounded-full bg-emerald-500" />7 Solutions
          <span className="font-normal text-slate-500 dark:text-slate-400">
            · Frontend Assignment
          </span>
        </p>

        <ThemeToggle className="sm:order-last" />

        <nav
          aria-label="Assignment"
          className="grid w-full grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-xs sm:w-auto sm:text-sm dark:bg-white/5"
        >
          {NAV_ITEMS.map(({ href, step, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 font-medium whitespace-nowrap transition sm:gap-2 sm:px-3 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <span
                  className={`grid size-4.5 place-items-center rounded-full text-[10px] font-semibold ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-300 text-white dark:bg-white/15 dark:text-slate-300"
                  }`}
                >
                  {step}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default SiteNav;
