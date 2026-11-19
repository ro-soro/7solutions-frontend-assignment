import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // เปิดหน้าแรก (/) แล้วพาไปข้อ 1 อัตโนมัติ
  // The home page opens assignment 1.
  redirects: async () => [
    { source: "/", destination: "/todo-list", permanent: false },
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
