// ─────────────────────────────────────────────────────────
// app/stock/avg-price/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import AvgPriceCalculator from "./AvgPrice";

const BASE_URL = "https://jiko-calculator-nine.vercel.app";

export const metadata: Metadata = {
    title: "평균 단가 계산기",
    description: "주식 물타기, 불타기 시 평균 매입 단가를 최대 3회에 걸쳐 간편하게 계산해드립니다.",
    keywords: ["평단가 계산기", "주식 물타기", "주식 불타기", "평균 매입 단가"],
    alternates: { canonical: `${BASE_URL}/stock/avg-price` },
    openGraph: {
        title: "평균 단가 계산기",
        description: "주식 물타기, 불타기 시 평균 매입 단가를 최대 3회에 걸쳐 간편하게 계산해드립니다.",
        url: `${BASE_URL}/stock/avg-price`,
        images: [{ url: "/kakao-thumbnail.png", width: 1200, height: 630, alt: "평균 단가 계산기" }],
    },
    twitter: {
        title: "평균 단가 계산기",
        description: "주식 물타기, 불타기 시 평균 매입 단가를 최대 3회에 걸쳐 간편하게 계산해드립니다.",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "평균 단가 계산기",
    description: "주식 물타기, 불타기 시 평균 매입 단가를 최대 3회에 걸쳐 간편하게 계산해드립니다.",
    url: `${BASE_URL}/stock/avg-price`,
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
            <AvgPriceCalculator />
        </>
    );
}