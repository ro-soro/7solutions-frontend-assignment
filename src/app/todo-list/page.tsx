import TodoBoard from "./components/todoBoard";

import { TODO_ITEMS } from "./utils/todo-items";

const HOW_IT_WORKS = [
  { step: "1", text: "Click an item to sort it into its column" },
  { step: "2", text: "It returns to the bottom of the list after 5s" },
  { step: "3", text: "Click it in the column to return it right away" },
];

// Server Component: render HTML เสร็จที่ server ส่วนที่กดได้แยกไปอยู่ใน TodoBoard (Client Component)
// Rendered on the server; only the interactive TodoBoard runs in the browser.
const TodoListPage = () => (
  <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Assignment 1
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Auto Delete Todo List
        </h1>
      </div>

      <ol className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
        {HOW_IT_WORKS.map(({ step, text }) => (
          <li key={step} className="flex items-center gap-2.5">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900">
              {step}
            </span>
            {text}
          </li>
        ))}
      </ol>
    </header>

    <TodoBoard items={TODO_ITEMS} />
  </main>
);

export default TodoListPage;
