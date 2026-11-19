import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AUTO_RETURN_DELAY_MS,
  useAutoDeleteTodo,
} from "@/app/todo-list/hooks/use-auto-delete-todo";
import type { TodoItem } from "@/app/todo-list/utils/todo-items";

const apple: TodoItem = { type: "Fruit", name: "Apple" };
const broccoli: TodoItem = { type: "Vegetable", name: "Broccoli" };
const banana: TodoItem = { type: "Fruit", name: "Banana" };

const renderTodo = () =>
  renderHook(() => useAutoDeleteTodo([apple, broccoli, banana]));

const names = (items: TodoItem[]) => items.map((item) => item.name);

describe("useAutoDeleteTodo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("moves a clicked item out of the list and into the moved items", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));

    expect(names(result.current.list)).toEqual(["Broccoli", "Banana"]);
    expect(names(result.current.movedItems)).toEqual(["Apple"]);
  });

  it("returns a moved item to the bottom of the list after 5 seconds", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => vi.advanceTimersByTime(AUTO_RETURN_DELAY_MS - 1));

    expect(names(result.current.movedItems)).toEqual(["Apple"]);

    act(() => vi.advanceTimersByTime(1));

    expect(names(result.current.list)).toEqual(["Broccoli", "Banana", "Apple"]);
    expect(result.current.movedItems).toEqual([]);
  });

  it("gives every moved item its own 5 second countdown", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.moveToColumn(broccoli));
    act(() => vi.advanceTimersByTime(3000));

    expect(names(result.current.list)).toEqual(["Banana", "Apple"]);
    expect(names(result.current.movedItems)).toEqual(["Broccoli"]);

    act(() => vi.advanceTimersByTime(2000));

    expect(names(result.current.list)).toEqual(["Banana", "Apple", "Broccoli"]);
  });

  it("returns an item immediately when it is clicked in its column", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => result.current.returnToList(apple));

    expect(names(result.current.list)).toEqual(["Broccoli", "Banana", "Apple"]);
    expect(result.current.movedItems).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("restarts the countdown when an item is moved again after a manual return", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => vi.advanceTimersByTime(4000));
    act(() => result.current.returnToList(apple));
    act(() => result.current.moveToColumn(apple));

    // The first countdown would have ended here if it had not been cancelled
    act(() => vi.advanceTimersByTime(1000));

    expect(names(result.current.movedItems)).toEqual(["Apple"]);

    act(() => vi.advanceTimersByTime(AUTO_RETURN_DELAY_MS - 1000));

    expect(result.current.movedItems).toEqual([]);
  });

  it("clears pending countdowns on unmount", () => {
    const { result, unmount } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => result.current.moveToColumn(banana));

    expect(vi.getTimerCount()).toBe(2);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("sends back items whose time is up when the tab becomes visible, even if the timer is late", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));
    act(() => result.current.moveToColumn(broccoli));

    // Move the clock forward without firing timers, as when a hidden tab delays setTimeout
    vi.setSystemTime(Date.now() + AUTO_RETURN_DELAY_MS + 1000);

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(names(result.current.list)).toEqual(["Banana", "Apple", "Broccoli"]);
    expect(result.current.movedItems).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("keeps items whose time is not up when the tab becomes visible", () => {
    const { result } = renderTodo();

    act(() => result.current.moveToColumn(apple));

    vi.setSystemTime(Date.now() + 2000);

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(names(result.current.movedItems)).toEqual(["Apple"]);
  });
});
