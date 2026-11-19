// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { app } from "@/server/app";

import { USERS } from "../fixtures/users";

// "use cache" and cacheLife only take effect inside the Next.js runtime
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

const stubUsersResponse = () =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ users: USERS, total: USERS.length, skip: 0, limit: 0 }),
    ),
  );

describe("Hono API", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("GET /api/department-summary responds with users grouped by department", async () => {
    stubUsersResponse();

    const response = await app.request("/api/department-summary");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toMatchObject({
      Marketing: { male: 1, female: 2, ageRange: "38-50" },
      Services: { male: 1, female: 0, ageRange: "28-28" },
    });
  });

  it("GET /api/department-summary responds 502 when the upstream API fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 503 })),
    );

    const response = await app.request("/api/department-summary");

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      message: "Unable to load users from the upstream API.",
    });
  });

  it("GET /api/department-summary responds 502 when the upstream data has an unexpected format", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ users: "not a list" })),
    );

    const response = await app.request("/api/department-summary");

    expect(response.status).toBe(502);
  });

  it("GET /api/health responds ok", async () => {
    const response = await app.request("/api/health");

    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("responds 404 for unknown routes", async () => {
    const response = await app.request("/api/unknown");

    expect(response.status).toBe(404);
  });
});
