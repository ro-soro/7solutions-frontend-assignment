import type { Metadata } from "next";

import DepartmentCard from "./components/departmentCard";

import { getDepartmentStats } from "@/services/department-summary";

export const metadata: Metadata = { title: "Department Summary" };

// Server Component: ดึงข้อมูลบน server แล้วส่ง HTML ที่เสร็จแล้วมาให้ browser เลยไม่เห็นการเรียก dummyjson ใน F12
// Data is fetched on the server and the browser gets finished HTML, so dummyjson never shows in DevTools.
const DepartmentSummaryPage = async () => {
  const statsList = await getDepartmentStats();

  const departments = Object.entries(statsList).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const userCount = departments.reduce(
    (count, [, department]) => count + department.male + department.female,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Assignment 2
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Department Summary
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Users from dummyjson.com grouped by company department. The page and
            the JSON API share one cached summary that refreshes every minute.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-white/80 px-3 py-1 text-slate-600 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10">
            <strong className="text-slate-900 tabular-nums dark:text-slate-100">
              {userCount}
            </strong>{" "}
            users
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-slate-600 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10">
            <strong className="text-slate-900 tabular-nums dark:text-slate-100">
              {departments.length}
            </strong>{" "}
            departments
          </span>
          <a
            href="/api/department-summary"
            target="_blank"
            className="rounded-full bg-slate-900 px-3 py-1 font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            View JSON API ↗
          </a>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map(([department, stats]) => (
          <DepartmentCard
            key={department}
            department={department}
            stats={stats}
          />
        ))}
      </div>
    </main>
  );
};

export default DepartmentSummaryPage;
