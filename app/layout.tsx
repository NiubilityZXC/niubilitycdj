import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "周学聪 Xuecong Zhou | AI 系统与软件工程",
  description:
    "周学聪 Xuecong Zhou 的个人网站：视觉语言模型、机器人学习、软件工程、云端与移动应用。",
  icons: {
    icon: "/site/favicon.svg",
    shortcut: "/site/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
