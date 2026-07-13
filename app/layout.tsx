import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "周学聪 Xuecong Zhou | AI Systems & Software Engineering",
  description:
    "周学聪 Xuecong Zhou 的个人网站：AI systems, visual-language models, robotics, software engineering, cloud and mobile applications.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
