import { cacheLife } from "next/cache";

import { getUsers, type UserResponse } from "./user";

import type {
  DepartmentStats,
  DepartmentStatsList,
  DepartmentSummaryListResponse,
} from "./models/department-summary-model";

export type * from "./models/department-summary-model";

const createDepartmentStats = (age: number): DepartmentStats => ({
  male: 0,
  female: 0,
  minAge: age,
  maxAge: age,
  hair: {},
  addressUser: {},
});

// จัดกลุ่มผู้ใช้ตาม company.department วน loop รอบเดียวจบ (O(n))
// Groups users by company.department in a single pass: O(n).
export const mapDepartmentStats = (
  users: UserResponse[],
): DepartmentStatsList => {
  const statsByDepartment = new Map<string, DepartmentStats>();

  for (const user of users) {
    const department = user.company.department;

    let stats = statsByDepartment.get(department);

    if (!stats) {
      stats = createDepartmentStats(user.age);
      statsByDepartment.set(department, stats);
    }

    if (user.gender === "male") stats.male += 1;
    if (user.gender === "female") stats.female += 1;

    stats.minAge = Math.min(stats.minAge, user.age);
    stats.maxAge = Math.max(stats.maxAge, user.age);

    const hairColor = user.hair.color;
    stats.hair[hairColor] = (stats.hair[hairColor] ?? 0) + 1;

    // key = ชื่อ + นามสกุลติดกัน เช่น "TerryMedhurst", value = รหัสไปรษณีย์
    // Key is firstName + lastName, e.g. "TerryMedhurst"; value is the postal code.
    stats.addressUser[`${user.firstName}${user.lastName}`] =
      user.address.postalCode;
  }

  return Object.fromEntries(statsByDepartment);
};

// แปลงเป็นรูปแบบ response ของโจทย์ (อายุกลายเป็น string "min-max")
// Converts to the assignment's response shape (ages become a "min-max" string).
export const mapDepartmentSummary = (
  statsList: DepartmentStatsList,
): DepartmentSummaryListResponse =>
  Object.fromEntries(
    Object.entries(statsList).map(([department, stats]) => [
      department,
      {
        male: stats.male,
        female: stats.female,
        ageRange: `${stats.minAge}-${stats.maxAge}`,
        hair: stats.hair,
        addressUser: stats.addressUser,
      },
    ]),
  );

// ใช้ร่วมกันทั้งหน้าเว็บและ API: "use cache" จำผลไว้ ไม่ต้องยิง dummyjson ทุกครั้ง และดึงใหม่ทุก 1 นาที
// Shared by the page and the API; the result is cached and refreshed every minute.
export const getDepartmentStats = async () => {
  "use cache";
  cacheLife("minutes");

  return mapDepartmentStats(await getUsers());
};

export const getDepartmentSummary = async () =>
  mapDepartmentSummary(await getDepartmentStats());
