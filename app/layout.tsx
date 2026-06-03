import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tạp hóa Vũ Mai",
  description: "Website bán hàng tạp hóa Vũ Mai giao nhanh trong khu vực"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
          <div className="container-page flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold text-pitch-900">
              Tạp hóa Vũ Mai
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-pitch-700 hover:bg-pitch-50"
              >
                Cửa hàng
              </Link>
              <Link
                href="/admin"
                className="rounded-md bg-pitch-900 px-3 py-2 text-white hover:bg-pitch-700"
              >
                Đơn hàng
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
