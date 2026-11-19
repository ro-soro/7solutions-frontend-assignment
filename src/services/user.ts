import { z } from "zod";

import type { UserListResponse, UserResponse } from "./models/user-model";

export type * from "./models/user-model";

const USER_API_URL = "https://dummyjson.com/users";

// ถ้าไม่ใส่อะไร dummyjson ส่งมาแค่ 30 คน ต้องใส่ limit=0 ถึงจะได้ครบ ส่วน select = ขอเฉพาะ field ที่ใช้
// dummyjson returns only 30 users by default; limit=0 returns all. select keeps only the fields we need.
const USER_LIST_QUERY = new URLSearchParams({
  limit: "0",
  select: "firstName,lastName,age,gender,hair,address,company",
});

const REQUEST_TIMEOUT_MS = 5000;

// TypeScript เช็คแค่ตอน compile ส่วนนี้เช็คข้อมูลจริงตอนรัน ถ้า dummyjson เปลี่ยนรูปแบบจะรู้ทันที ไม่พังเงียบ
// TypeScript only checks at compile time; this checks the real response at runtime so a format change fails loudly.
const userListSchema: z.ZodType<UserListResponse> = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      age: z.number(),
      gender: z.enum(["male", "female"]),
      hair: z.object({ color: z.string(), type: z.string() }),
      address: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        stateCode: z.string(),
        postalCode: z.string(),
        country: z.string(),
      }),
      company: z.object({
        department: z.string(),
        name: z.string(),
        title: z.string(),
      }),
    }),
  ),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await fetch(`${USER_API_URL}?${USER_LIST_QUERY}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed getUsers >> ${response.status}`);
  }

  const userList = userListSchema.safeParse(await response.json());

  if (!userList.success) {
    throw new Error(
      `Failed getUsers >> invalid response\n${z.prettifyError(userList.error)}`,
    );
  }

  return userList.data.users;
};
