import { useCallback, useEffect, useRef, useState } from "react";

import type { TodoItem } from "../utils/todo-items";

// เวลาที่ปุ่มอยู่ในคอลัมน์ Fruit/Vegetable ก่อนเด้งกลับไปท้ายรายการซ้าย
// How long an item stays in its column before it goes back to the bottom of the list.
export const AUTO_RETURN_DELAY_MS = 5000;

// list = รายการฝั่งซ้าย, moved = ปุ่มที่อยู่ในคอลัมน์ขวา (เรียงตามลำดับที่กด)
// list = left column, moved = items in the type columns (in click order).
interface TodoBoard {
  list: TodoItem[];
  moved: TodoItem[];
}

// returnAt = เวลาที่ต้องเด้งกลับจริง ใช้เช็คตอน timer มาช้า
// returnAt is the real deadline, used when the timer fires late.
interface ReturnTimer {
  item: TodoItem;
  returnAt: number;
  timer: ReturnType<typeof setTimeout>;
}

const isSameItem = (a: TodoItem, b: TodoItem) => a.name === b.name;

export const useAutoDeleteTodo = (initialItems: TodoItem[]) => {
  // เก็บ list กับ moved ไว้ใน state ก้อนเดียว ย้ายปุ่มทีเดียวจบ ไม่มีจังหวะที่ปุ่มหายหรือซ้ำ
  // One state object, so a move is a single update and an item is never lost or shown twice.
  const [board, setBoard] = useState<TodoBoard>({
    list: initialItems,
    moved: [],
  });

  // timer ของแต่ละปุ่ม (key = ชื่อปุ่ม) เก็บใน useRef เพราะเปลี่ยนแล้วไม่ต้อง re-render
  // One timer per item, keyed by name; kept in useRef because it does not need a re-render.
  const returnTimers = useRef(new Map<string, ReturnTimer>());

  const clearReturnTimer = useCallback((item: TodoItem) => {
    const returnTimer = returnTimers.current.get(item.name);

    if (!returnTimer) return;

    clearTimeout(returnTimer.timer);
    returnTimers.current.delete(item.name);
  }, []);

  // ส่งปุ่มกลับไปท้ายรายการซ้าย ใช้ทั้งตอนกดเองและตอนครบ 5 วิ
  // Sends an item back to the list; used by both a click and the 5-second timer.
  const returnToList = useCallback(
    (item: TodoItem) => {
      // สำคัญ: ล้าง timer ก่อน ไม่งั้น timer เก่าจะดีดปุ่มกลับเร็วเกินตอนกดย้ายรอบใหม่
      // Clear the old timer first, or it would send the item back too early after a re-move.
      clearReturnTimer(item);

      setBoard((current) => {
        // ปุ่มกลับไปแล้ว ไม่ต้องทำอะไร (กันการเรียกซ้ำ)
        // Already back in the list: ignore repeated calls.
        if (!current.moved.some((moved) => isSameItem(moved, item))) {
          return current;
        }

        return {
          list: [...current.list, item],
          moved: current.moved.filter((moved) => !isSameItem(moved, item)),
        };
      });
    },
    [clearReturnTimer],
  );

  const moveToColumn = useCallback(
    (item: TodoItem) => {
      clearReturnTimer(item);

      setBoard((current) => {
        // ปุ่มไม่ได้อยู่ฝั่งซ้ายแล้ว ไม่ต้องทำอะไร (กันการกดซ้ำ)
        // Not in the list anymore: ignore repeated clicks.
        if (!current.list.some((listed) => isSameItem(listed, item))) {
          return current;
        }

        return {
          list: current.list.filter((listed) => !isSameItem(listed, item)),
          moved: [...current.moved, item],
        };
      });

      returnTimers.current.set(item.name, {
        item,
        returnAt: Date.now() + AUTO_RETURN_DELAY_MS,
        timer: setTimeout(() => returnToList(item), AUTO_RETURN_DELAY_MS),
      });
    },
    [clearReturnTimer, returnToList],
  );

  // ตอนแท็บถูกซ่อนหรือเครื่อง sleep, setTimeout อาจมาช้า พอกลับมาที่แท็บ ปุ่มที่หมดเวลาแล้วต้องเด้งกลับทันที
  // A hidden tab or a sleeping computer can delay setTimeout; on return, send back every item whose time is up.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();

      [...returnTimers.current.values()]
        .filter(({ returnAt }) => returnAt <= now)
        .forEach(({ item }) => returnToList(item));
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [returnToList]);

  // ตอนออกจากหน้านี้ ล้าง timer ที่ค้างทั้งหมด กัน setState หลัง component ถูกถอดออก
  // Clear all pending timers on unmount so nothing updates a removed component.
  useEffect(() => {
    const timers = returnTimers.current;

    return () => {
      timers.forEach(({ timer }) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return {
    list: board.list,
    movedItems: board.moved,
    moveToColumn,
    returnToList,
  };
};
