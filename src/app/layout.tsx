import type { Metadata } from "next";
import { Geist } from "next/font/google";

import SiteNav from "@/components/siteNav";

import { THEME_INIT_SCRIPT } from "@/utils/theme";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "7 Solutions Frontend Assignment",
    template: "%s · 7 Solutions Assignment",
  },
  description: "Auto Delete Todo List and Department Summary",
};

// suppressHydrationWarning: script ธีมใส่ class "dark" ก่อน React โหลด เลยต้องบอก React ว่าไม่ต้องเตือน
// The theme script adds the "dark" class before React hydrates, so React should not warn about it.
const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={`${geistSans.variable} h-full antialiased`}
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
    </head>
    <body className="flex min-h-full flex-col font-sans">
      <SiteNav />
      {children}
    </body>
  </html>
);

export default RootLayout;
