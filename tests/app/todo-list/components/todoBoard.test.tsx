import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TodoBoard from "@/app/todo-list/components/todoBoard";
import { TODO_ITEMS } from "@/app/todo-list/utils/todo-items";

const getButtonNames = (region: HTMLElement) =>
  within(region)
    .queryAllByRole("button")
    .map((button) => button.getAttribute("aria-label"));

const setup = () => {
  render(<TodoBoard items={TODO_ITEMS} />);

  return {
    list: screen.getByRole("region", { name: "Todo list" }),
    fruit: screen.getByRole("region", { name: "Fruit" }),
    vegetable: screen.getByRole("region", { name: "Vegetable" }),
  };
};

describe("TodoBoard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders every item in the list and empty type columns", () => {
    const { list, fruit, vegetable } = setup();

    expect(getButtonNames(list)).toEqual(TODO_ITEMS.map((item) => item.name));
    expect(getButtonNames(fruit)).toEqual([]);
    expect(getButtonNames(vegetable)).toEqual([]);
  });

  it("moves clicked items into the column for their type", () => {
    const { list, fruit, vegetable } = setup();

    fireEvent.click(within(list).getByRole("button", { name: "Apple" }));
    fireEvent.click(within(list).getByRole("button", { name: "Broccoli" }));
    fireEvent.click(within(list).getByRole("button", { name: "Banana" }));

    expect(getButtonNames(fruit)).toEqual(["Apple", "Banana"]);
    expect(getButtonNames(vegetable)).toEqual(["Broccoli"]);
    expect(getButtonNames(list)).not.toContain("Apple");
  });

  it("moves an item back to the bottom of the list after 5 seconds", () => {
    const { list, fruit } = setup();

    fireEvent.click(within(list).getByRole("button", { name: "Apple" }));

    act(() => vi.advanceTimersByTime(5000));

    expect(getButtonNames(fruit)).toEqual([]);
    expect(getButtonNames(list).at(-1)).toBe("Apple");
  });

  it("moves an item back right away when it is clicked in its column", () => {
    const { list, vegetable } = setup();

    fireEvent.click(within(list).getByRole("button", { name: "Carrot" }));
    fireEvent.click(within(vegetable).getByRole("button", { name: "Carrot" }));

    expect(getButtonNames(vegetable)).toEqual([]);
    expect(getButtonNames(list).at(-1)).toBe("Carrot");
  });

  it("describes the countdown on items in a column", () => {
    const { list, vegetable } = setup();

    fireEvent.click(within(list).getByRole("button", { name: "Carrot" }));

    expect(
      within(vegetable).getByRole("button", { name: "Carrot" }),
    ).toHaveAccessibleDescription(
      "Goes back to the list in 5 seconds. Click to send it back now.",
    );
  });
});
