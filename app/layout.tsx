import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "주식 평단가 계산기",
  description: "주식 평균 매입 단가를 쉽게 계산해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
          className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-black dark:text-white"
      >
      <Header />
      {/* 콘텐츠 영역 */}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      </body>
    </html>
  );
}
