// ─────────────────────────────────────────────────────────
// app/stock/profit-rate/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import ProfitRatePage from "./ProfitRate";

const BASE_URL = "https://jiko-calculator-nine.vercel.app";

export const metadata: Metadata = {
  title: "수익률 계산기",
  description: "매입가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  keywords: ["수익률 계산기", "주식 수익률", "수익금 계산", "투자 수익률"],
  alternates: { canonical: `${BASE_URL}/stock/profit-rate` },
  openGraph: {
    title: "수익률 계산기",
    description: "매입가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
    url: `${BASE_URL}/stock/profit-rate`,
    images: [{ url: "/kakao-thumbnail.png", width: 1200, height: 630, alt: "수익률 계산기" }],
  },
  twitter: {
    title: "수익률 계산기",
    description: "매입가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "수익률 계산기",
  description: "매입가, 현재가, 수량을 입력하면 수익금과 수익률을 자동으로 계산해드립니다.",
  url: `${BASE_URL}/stock/profit-rate`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

export default function Page() {
  return (
      <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProfitRatePage />
      </>
  );
}