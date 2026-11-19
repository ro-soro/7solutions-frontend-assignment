import { app } from "@/server/app";

// ทุก request ที่ขึ้นต้นด้วย /api/ ส่งต่อให้ Hono จัดการ
// Every /api/* request is handled by the Hono app.
export const GET = (request: Request) => app.fetch(request);
