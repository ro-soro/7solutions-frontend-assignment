import { Hono } from "hono";

import { getDepartmentSummary } from "@/services/department-summary";

// API ของข้อ 2 เขียนด้วย Hono (HTTP framework) Next.js ส่ง request /api/* มาที่นี่ผ่าน src/app/api/[[...route]]/route.ts
// Assignment 2 API built with Hono; Next.js forwards /api/* here.
export const app = new Hono().basePath("/api");

app.get("/health", (context) => context.json({ status: "ok" }));

app.get("/department-summary", async (context) =>
  context.json(await getDepartmentSummary()),
);

// ถ้าดึงข้อมูลจาก dummyjson ไม่สำเร็จ ตอบ 502 พร้อมข้อความ
// If dummyjson fails, respond 502 with a message.
app.onError((error, context) => {
  console.error("Failed API request >>", context.req.path, error);

  return context.json(
    { message: "Unable to load users from the upstream API." },
    502,
  );
});
