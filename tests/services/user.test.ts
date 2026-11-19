// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { getUsers } from "@/services/user";

import { USERS } from "../fixtures/users";

describe("getUsers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests every user with only the fields the summary needs", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ users: USERS, total: USERS.length, skip: 0, limit: 0 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getUsers()).resolves.toEqual(USERS);

    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));

    expect(url.origin + url.pathname).toBe("https://dummyjson.com/users");
    expect(url.searchParams.get("limit")).toBe("0");
    expect(url.searchParams.get("select")).toBe(
      "firstName,lastName,age,gender,hair,address,company",
    );
  });

  it("throws when the upstream API responds with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 503 })),
    );

    await expect(getUsers()).rejects.toThrow("Failed getUsers >> 503");
  });

  it("throws when the response does not match the expected user format", async () => {
    const [firstUser] = USERS;
    const userWithoutDepartment = {
      ...firstUser,
      company: { name: "Acme", title: "Engineer" },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          users: [userWithoutDepartment],
          total: 1,
          skip: 0,
          limit: 0,
        }),
      ),
    );

    await expect(getUsers()).rejects.toThrow(
      /invalid response[\s\S]*company\.department/,
    );
  });
});
