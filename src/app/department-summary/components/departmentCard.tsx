import type { DepartmentStats } from "@/services/department-summary";

const HAIR_SWATCH: Record<string, string> = {
  Auburn: "#a0522d",
  Black: "#1f2937",
  Blond: "#f5d06f",
  Blonde: "#f5d06f",
  Blue: "#3b82f6",
  Brown: "#7c4a2d",
  Chestnut: "#954535",
  Gray: "#9ca3af",
  Green: "#22c55e",
  Purple: "#a855f7",
  Red: "#ef4444",
  White: "#f8fafc",
};

interface DepartmentCardProps {
  department: string;
  stats: DepartmentStats;
}

const DepartmentCard = ({ department, stats }: DepartmentCardProps) => {
  const total = stats.male + stats.female;
  const malePercent = total ? (stats.male / total) * 100 : 0;

  const hairColors = Object.entries(stats.hair).sort(([, a], [, b]) => b - a);
  const addressUsers = Object.entries(stats.addressUser);

  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/60 dark:shadow-none dark:ring-white/10">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {department}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {total} users
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
            {stats.minAge}–{stats.maxAge}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            age range
          </p>
        </div>
      </header>

      <section aria-label="Gender">
        <div className="flex h-2 overflow-hidden rounded-full bg-pink-400">
          <div className="bg-sky-500" style={{ width: `${malePercent}%` }} />
        </div>
        <dl className="mt-2 flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-500" />
            <dt>Male</dt>
            <dd className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {stats.male}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-pink-400" />
            <dt>Female</dt>
            <dd className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {stats.female}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-label="Hair color">
        <h3 className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          Hair color
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {hairColors.map(([color, count]) => (
            <li
              key={color}
              className="flex items-center gap-1.5 rounded-full bg-slate-50 py-0.5 pr-2 pl-1 text-xs text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10"
            >
              <span
                aria-hidden
                className="size-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/25"
                style={{ background: HAIR_SWATCH[color] ?? "#94a3b8" }}
              />
              {color}
              <span className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <details className="group mt-auto rounded-xl bg-slate-50 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 select-none dark:text-slate-300">
          Postal codes ({addressUsers.length})
          <span aria-hidden className="transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <ul className="max-h-48 overflow-y-auto border-t border-slate-200 px-3 py-2 text-xs dark:border-white/10">
          {addressUsers.map(([name, postalCode]) => (
            <li key={name} className="flex justify-between gap-3 py-1">
              <span className="truncate text-slate-700 dark:text-slate-300">
                {name}
              </span>
              <span className="font-mono text-slate-500 tabular-nums dark:text-slate-400">
                {postalCode}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
};

export default DepartmentCard;
