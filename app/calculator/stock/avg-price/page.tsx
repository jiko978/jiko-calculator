// ─────────────────────────────────────────────────────────
// app/calculator/stock/avg-price/page.tsx
// ─────────────────────────────────────────────────────────

import type { Metadata } from "next";
import AvgPriceCalculator from "./AvgPrice";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import StockMoreCalculators from "@/app/calculator/components/StockMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주식 물타기 계산기 | 주식 투자 평균단가 목표 달성 계산기 - JIKO 계산기",
    description: "주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    keywords: ["주식 물타기 계산기", "주식 물타기", "주식 불타기", "주식 평균단가"],
    alternates: { canonical: `${BASE_URL}/calculator/stock/avg-price` },
    openGraph: {
        title: "주식 물타기 계산기 | 주식 물타기, 불타기, 평균단가 계산기 - JIKO 계산기",
        description: "주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
        url: `${BASE_URL}/calculator/stock/avg-price`,
        images: [
            {
                url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`,
                width: 1200,
                height: 630,
                alt: "주식 물타기 계산기",
            },
        ],
    },
    twitter: {
        title: "주식 물타기 계산기 | 주식 투자 평균단가 목표 달성 계산기 - JIKO 계산기",
        description: "주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "주식 물타기 계산기",
    description: "주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다.",
    url: `${BASE_URL}/calculator/stock/avg-price`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "주식 물타기는 어떻게 계산하나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "총 매수 금액을 총 주식 수로 나누면 평균 매입 단가를 계산할 수 있습니다."
            }
        },
        {
            "@type": "Question",
            name: "주식 물타기와 불타기는 무엇인가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "물타기는 주가가 하락했을 때 추가 매수하여 평균 단가를 낮추는 방어적 전략입니다. 반대로 불타기는 주가가 상승 중에 추가 매수하여 비중을 늘리는 공격적 전략을 의미합니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "주식 물타기 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/stock/avg-price`,
    "description": "주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다."
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        COMMON_BREADCRUMBS.AVG_PRICE
    ]);

    const faqList = [
        {
            question: "주식 물타기는 어떻게 계산하나요?",
            answer: "총 매수 금액을 총 주식 수로 나누면 정확한 평균 단가가 계산됩니다."
        },
        {
            question: "물타기와 불타기는 무엇인가요?",
            answer: "물타기는 주가가 하락했을 때 추가 매수하여 평균 단가를 낮추는 방어적 전략입니다. 반대로 불타기는 주가가 상승 중에 추가 매수하여 비중을 늘리는 공격적 전략을 의미합니다."
        },
        {
            question: "물타기를 10회 이상 하려면 어떻게 하나요?",
            answer: "매수 횟수가 10회를 초과한다면, 여러 회차의 기록을 묶어 하나의 '평균단가'와 '총수량'으로 합산하여 1회차에 기입한 뒤 남은 입력칸을 활용하시면 편리합니다."
        }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            {/* 계산기 UI */}
            <NavBar title="주식 물타기 계산기" description="주식 물타기 시 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산해드립니다." position="top" />
            <AvgPriceCalculator />

            {/* SEO 및 정보 영역 (계산기 하단에 자연스럽게 배치) */}
            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">

                {/* H1 및 소개문 (검색엔진 최적화 및 사용자 안내) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📈</span> 주식 물타기 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 주식 물타기 계산기는 주식을 여러 번 나누어 매수(물타기/불타기)했을 때의 전체 평균 매입 단가와 총 투자금액을 정확히 산출해주는 스마트한 도구입니다. 복잡한 계산 없이 각 회차별 매수가와 수량만 입력하면, 현재 보유 주식의 전체 평균단가는 물론 현재 주가 대비 예상 수익률과 수익금까지 한눈에 파악할 수 있어 성공적인 투자 전략을 세우는 데 필수적입니다.
                    </p>
                    <p className="text-xs mt-3 text-red-500/80 dark:text-red-400/80 font-medium bg-red-50/50 dark:bg-red-900/10 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/20 inline-block text-left">
                        ※ 본 계산기는 참고용이며 투자 판단의 책임은 사용자에게 있습니다.
                    </p>
                </section>

                {/* 사용 방법 및 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>각 회차별 <strong>매수가</strong>와 <strong>수량</strong>을 입력하세요.</li>
                            <li>자동으로 전체 평균 단가가 계산되어 출력됩니다.</li>
                            <li>최대 <strong>10회차</strong>까지 매수 기록 추가가 가능합니다.</li>
                            <li><strong>현재가</strong>를 입력하면 수익률과 수익금을 추가로 계산합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <p>1차 : <strong>10,000원</strong>에 <strong>100주</strong> 매수</p>
                            <p className="border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">2차 : <strong>12,000원</strong>에 <strong>100주</strong> 매수 (불타기)</p>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">총 투자금 : 2,200,000원</p>
                            <p className="text-red-500 dark:text-red-400 font-bold">최종 평균 단가 : 11,000원</p>
                        </div>
                    </section>
                </div>

                {/* 3. 추가 카드 세션 (전체 폭 사용) */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        📉 주식 물타기, 언제 하는 것이 가장 좋을까요?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                        주식 투자에서 물타기(분할매수)는 평균 단가를 획기적으로 낮춰 반등 시 빠른 탈출이나 수익 전환을 돕는 강력한 무기입니다. 하지만 무계획적인 물타기는 계좌 전체를 돌이킬 수 없는 손실로 이끌 수 있으므로 철저한 전략이 필요합니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-blue-600 rounded-full" /> 올바른 물타기 원칙
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li><strong>확실한 반등 시그널</strong>이나 지지선이 확인될 때 진입합니다.</li>
                                <li>기업의 펀더멘털(본질적 가치)에 이상이 없는지 먼저 점검합니다.</li>
                                <li>자금 여력을 고려하여 미리 계획된 비중과 가격대에서만 매수합니다.</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-bold text-red-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-red-600 rounded-full" /> 위험한 물타기 사례
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1">
                                <li>주가가 조금 내렸다고 조급하게 바로 매수하는 '묻지마 물타기'</li>
                                <li>상장폐지 위험이나 치명적 악재가 터진 종목에 대한 미련</li>
                                <li>가용 현금이 고갈되어 대출(신용/미수)을 무리하게 끌어쓰는 행위</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FAQ faqList={faqList} />

                {/* 주식 계산기 더 보기 */}
                <StockMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}