// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  mapDepartmentStats,
  mapDepartmentSummary,
} from "@/services/department-summary";

import { USERS, buildUser } from "../fixtures/users";

describe("mapDepartmentStats", () => {
  it("groups users by department with gender, age, hair and address totals", () => {
    expect(mapDepartmentStats(USERS)).toEqual({
      Marketing: {
        male: 1,
        female: 2,
        minAge: 38,
        maxAge: 50,
        hair: { Black: 2, Chestnut: 1 },
        addressUser: {
          TerryMedhurst: "20020",
          TerrillHills: "80041",
          MilesCummerata: "37042",
        },
      },
      Services: {
        male: 1,
        female: 0,
        minAge: 28,
        maxAge: 28,
        hair: { Blond: 1 },
        addressUser: { SheldonQuigley: "60008" },
      },
    });
  });

  it("returns an empty object when there are no users", () => {
    expect(mapDepartmentStats([])).toEqual({});
  });

  it("keeps the youngest and oldest age whatever order users arrive in", () => {
    const statsList = mapDepartmentStats(
      [40, 22, 65, 31].map((age, index) =>
        buildUser({
          id: index,
          firstName: "User",
          lastName: String(index),
          age,
          gender: "female",
          hairColor: "Brown",
          postalCode: "10000",
          department: "Support",
        }),
      ),
    );

    expect(statsList.Support?.minAge).toBe(22);
    expect(statsList.Support?.maxAge).toBe(65);
  });

  it("summarises the full dummyjson list size quickly", () => {
    const departments = ["Engineering", "Support", "Sales", "Legal"];
    const users = Array.from({ length: 100_000 }, (_, index) =>
      buildUser({
        id: index,
        firstName: "User",
        lastName: String(index),
        age: 20 + (index % 40),
        gender: index % 2 ? "male" : "female",
        hairColor: index % 3 ? "Black" : "Brown",
        postalCode: String(10000 + index),
        department: departments[index % departments.length]!,
      }),
    );

    const startedAt = performance.now();
    const statsList = mapDepartmentStats(users);
    const elapsedMs = performance.now() - startedAt;

    expect(Object.keys(statsList)).toEqual(departments);
    expect(statsList.Engineering?.male).toBe(0);
    expect(statsList.Engineering?.female).toBe(25_000);
    expect(elapsedMs).toBeLessThan(500);
  });
});

describe("mapDepartmentSummary", () => {
  it("returns the assignment response shape with ageRange as min-max", () => {
    expect(mapDepartmentSummary(mapDepartmentStats(USERS))).toEqual({
      Marketing: {
        male: 1,
        female: 2,
        ageRange: "38-50",
        hair: { Black: 2, Chestnut: 1 },
        addressUser: {
          TerryMedhurst: "20020",
          TerrillHills: "80041",
          MilesCummerata: "37042",
        },
      },
      Services: {
        male: 1,
        female: 0,
        ageRange: "28-28",
        hair: { Blond: 1 },
        addressUser: { SheldonQuigley: "60008" },
      },
    });
  });
});
