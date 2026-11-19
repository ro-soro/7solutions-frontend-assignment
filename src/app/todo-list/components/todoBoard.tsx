"use client";

import type { CSSProperties } from "react";

import {
  AUTO_RETURN_DELAY_MS,
  useAutoDeleteTodo,
} from "../hooks/use-auto-delete-todo";

import { TODO_TYPES, type TodoItem, type TodoType } from "../utils/todo-items";

const ITEM_EMOJI: Record<string, string> = {
  Apple: "🍎",
  Broccoli: "🥦",
  Mushroom: "🍄",
  Banana: "🍌",
  Tomato: "🍅",
  Orange: "🍊",
  Mango: "🥭",
  Pineapple: "🍍",
  Cucumber: "🥒",
  Watermelon: "🍉",
  Carrot: "🥕",
};

const TYPE_STYLE: Record<
  TodoType,
  {
    icon: string;
    iconTile: string;
    tag: string;
    card: string;
    header: string;
    count: string;
    track: string;
    progress: string;
    badge: string;
  }
> = {
  Fruit: {
    icon: "🍓",
    iconTile: "bg-orange-100 dark:bg-orange-400/15",
    tag: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/25",
    card: "bg-orange-50/70 ring-orange-200 hover:bg-orange-100/80 hover:ring-orange-300 dark:bg-orange-400/10 dark:ring-orange-400/25 dark:hover:bg-orange-400/15 dark:hover:ring-orange-400/40",
    header: "from-orange-50 dark:from-orange-400/10",
    count:
      "bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
    track: "text-orange-200 dark:text-orange-400/20",
    progress: "text-orange-500 dark:text-orange-400",
    badge:
      "bg-orange-500 text-white ring-white dark:bg-orange-400 dark:text-slate-950 dark:ring-slate-900",
  },
  Vegetable: {
    icon: "🥬",
    iconTile: "bg-emerald-100 dark:bg-emerald-400/15",
    tag: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25",
    card: "bg-emerald-50/70 ring-emerald-200 hover:bg-emerald-100/80 hover:ring-emerald-300 dark:bg-emerald-400/10 dark:ring-emerald-400/25 dark:hover:bg-emerald-400/15 dark:hover:ring-emerald-400/40",
    header: "from-emerald-50 dark:from-emerald-400/10",
    count:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    track: "text-emerald-200 dark:text-emerald-400/20",
    progress: "text-emerald-500 dark:text-emerald-400",
    badge:
      "bg-emerald-500 text-white ring-white dark:bg-emerald-400 dark:text-slate-950 dark:ring-slate-900",
  },
};

const BUTTON_BASE =
  "todo-enter group flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 md:gap-3 md:px-3 md:py-2.5 text-left ring-1 transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:scale-[0.98] dark:focus-visible:outline-white";

interface TodoButtonProps {
  item: TodoItem;
  onClick: (item: TodoItem) => void;
}

const getItemEmoji = (item: TodoItem) =>
  ITEM_EMOJI[item.name] ?? TYPE_STYLE[item.type].icon;

const ItemEmoji = ({ item }: { item: TodoItem }) => (
  <span
    aria-hidden
    className={`grid size-7 shrink-0 place-items-center rounded-lg text-base md:size-9 md:text-lg ${TYPE_STYLE[item.type].iconTile}`}
  >
    {getItemEmoji(item)}
  </span>
);

const ListButton = ({ item, onClick }: TodoButtonProps) => (
  <button
    type="button"
    aria-label={item.name}
    onClick={() => onClick(item)}
    className={`${BUTTON_BASE} bg-white shadow-xs ring-slate-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300 dark:bg-slate-800/60 dark:shadow-none dark:ring-white/10 dark:hover:bg-slate-800 dark:hover:ring-white/20`}
  >
    <ItemEmoji item={item} />
    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
      {item.name}
    </span>
    <span
      aria-hidden
      className={`hidden rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset lg:inline ${TYPE_STYLE[item.type].tag}`}
    >
      {item.type}
    </span>
  </button>
);

const AUTO_RETURN_SECONDS = AUTO_RETURN_DELAY_MS / 1000;

// ตัวเลขนับถอยหลัง 5 → 1 ทำด้วย CSS ล้วน (ดู .todo-seconds ใน globals.css) React ไม่ต้อง re-render ทุกวินาที
// The 5 → 1 countdown is pure CSS (see .todo-seconds), so React does not re-render every second.
const SecondsLeft = ({ className = "" }: { className?: string }) => (
  <span
    className={`todo-tick inline-block tabular-nums ${className}`}
    style={{ animationIterationCount: AUTO_RETURN_SECONDS }}
  >
    <span
      className="todo-seconds"
      style={
        {
          "--todo-seconds-from": AUTO_RETURN_SECONDS,
          animationDuration: `${AUTO_RETURN_DELAY_MS}ms`,
          animationTimingFunction: `steps(${AUTO_RETURN_SECONDS}, jump-end)`,
        } as CSSProperties
      }
    />
  </span>
);

const ColumnButton = ({ item, onClick }: TodoButtonProps) => {
  const style = TYPE_STYLE[item.type];

  return (
    <button
      type="button"
      aria-label={item.name}
      title={`Goes back to the list in ${AUTO_RETURN_SECONDS} seconds. Click to send it back now.`}
      onClick={() => onClick(item)}
      className={`${BUTTON_BASE} ${style.card}`}
    >
      <span
        aria-hidden
        className="relative grid size-7 shrink-0 place-items-center rounded-full bg-white text-sm md:size-9 dark:bg-slate-900 md:text-base"
      >
        <svg
          viewBox="0 0 36 36"
          shapeRendering="geometricPrecision"
          className="absolute inset-0 size-full"
        >
          <g transform="rotate(-90 18 18)">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={style.track}
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              className={`todo-countdown ${style.progress}`}
              style={{ animationDuration: `${AUTO_RETURN_DELAY_MS}ms` }}
            />
          </g>
        </svg>
        <span className="relative">{getItemEmoji(item)}</span>
        {/* จอมือถือ: แสดงตัวเลขเป็นวงเล็กที่มุมวง จะได้มีที่ให้ชื่อ
            On small screens the number sits on the ring to leave room for the name. */}
        <span
          className={`absolute -right-1.5 -bottom-1 grid size-4 place-items-center rounded-full text-[10px] leading-none font-bold ring-2 md:hidden ${style.badge}`}
        >
          <SecondsLeft />
        </span>
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
        {item.name}
      </span>
      <span
        aria-hidden
        className={`hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset md:inline-block ${style.tag}`}
      >
        <SecondsLeft className="font-semibold" />s
      </span>
    </button>
  );
};

interface TodoBoardProps {
  items: TodoItem[];
}

// logic ทั้งหมดอยู่ใน useAutoDeleteTodo ไฟล์นี้แค่แสดงผล
// All logic lives in useAutoDeleteTodo; this file only renders.
const TodoBoard = ({ items }: TodoBoardProps) => {
  const { list, movedItems, moveToColumn, returnToList } =
    useAutoDeleteTodo(items);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
      <section
        aria-labelledby="list-heading"
        className="col-span-2 flex flex-col rounded-2xl bg-white/80 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/60 dark:shadow-none dark:ring-white/10 md:col-span-1"
      >
        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-white/5">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-slate-100 text-base dark:bg-white/5"
          >
            🧺
          </span>
          <h2
            id="list-heading"
            className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Todo list
          </h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 tabular-nums dark:bg-white/10 dark:text-slate-300">
            {list.length}
          </span>
        </header>

        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 md:grid-cols-1">
          {list.map((item) => (
            <ListButton key={item.name} item={item} onClick={moveToColumn} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="px-4 pb-6 text-center text-sm text-slate-400 dark:text-slate-500">
            Everything is sorted. Items come back here in a moment.
          </p>
        )}
      </section>

      {TODO_TYPES.map((type) => {
        const style = TYPE_STYLE[type];
        const columnItems = movedItems.filter((item) => item.type === type);

        return (
          <section
            key={type}
            aria-labelledby={`${type}-heading`}
            className="flex min-h-72 flex-col overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/60 dark:shadow-none dark:ring-white/10 md:min-h-[34rem]"
          >
            <header
              className={`flex items-center gap-3 border-b border-slate-100 bg-gradient-to-b to-white px-4 py-3.5 dark:border-white/5 dark:to-transparent ${style.header}`}
            >
              <span
                aria-hidden
                className={`grid size-8 place-items-center rounded-lg text-base ${style.iconTile}`}
              >
                {style.icon}
              </span>
              <h2
                id={`${type}-heading`}
                className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {type}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${style.count}`}
              >
                {columnItems.length}
              </span>
            </header>

            {columnItems.length > 0 ? (
              <div className="flex flex-col gap-2 p-2 md:p-3">
                {columnItems.map((item) => (
                  <ColumnButton
                    key={item.name}
                    item={item}
                    onClick={returnToList}
                  />
                ))}
              </div>
            ) : (
              <div className="m-3 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-6 dark:border-white/10 text-center">
                <span aria-hidden className="text-2xl opacity-60 grayscale">
                  {style.icon}
                </span>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Click a {type.toLowerCase()} in the list to drop it here
                </p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default TodoBoard;
