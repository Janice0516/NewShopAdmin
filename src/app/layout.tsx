import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/navbar.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Xiaomi® UK | Buy Mobiles, Watches, Smart Electronics Online',
  description: 'Buy Xiaomi Products from Xiaomi® official store with big discounts & fast shipping! Best prices for Xiaomi, Redmi, POCO phones, bands, buds and home devices.',
  icons: {
    // 通用 favicon（现代浏览器）
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/Xiaomi_logo_(2021-).svg.png', type: 'image/png', sizes: '32x32' },
      { url: '/Xiaomi_logo_(2021-).svg.png', type: 'image/png', sizes: '16x16' },
    ],
    // 兼容旧浏览器的快捷方式（可用 PNG）
    shortcut: [
      { url: '/Xiaomi_logo_(2021-).svg.png', type: 'image/png', sizes: '32x32' },
    ],
    // Apple Touch Icon（iOS 主屏图标）
    apple: [
      { url: '/Xiaomi_logo_(2021-).svg.png', sizes: '180x180' },
    ],
    // Safari Pinned Tab（遮罩图标）
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#ff6900' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
