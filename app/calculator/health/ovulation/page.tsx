// app/calculator/health/ovulation/page.tsx
import type { Metadata } from "next";
import Ovulation from "./Ovulation";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "배란일 계산기 | 임신 가능성이 높은 가임기 및 배란일 예측 - JIKO 계산기",
    description: "마지막 생리 시작일과 평균 주기를 통하여 다음 생리 예정일, 임신 가능성이 높은 가임기 및 배란일 캘린더를 간단히 계산해드립니다.",
    keywords: ["배란일 계산기", "가임기 계산기", "생리달력", "임신 가임기", "생리주기 계산", "다음 생리일", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/ovulation` },
    openGraph: {
        title: "배란일 계산기 | 임신 가능성이 높은 가임기 및 배란일 예측 - JIKO 계산기",
        description: "마지막 생리 시작일과 평균 주기를 통하여 다음 생리 예정일, 임신 가능성이 높은 가임기 및 배란일 캘린더를 간단히 계산해드립니다.",
        url: `${BASE_URL}/calculator/health/ovulation`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "배란일 생리주기 계산기" }],
    },
};

const faqList = [
    { question: "배란일은 어떤 기준으로 떨어지나요?", answer: "개인의 생리 주기와 무관하게 황체기는 보통 14일로 고정되어 있습니다. 따라서 다음 생리 예정일을 구한 뒤 14일 전으로 역산하는 것이 배란일 계산의 원리입니다." },
    { question: "가임기는 며칠인가요?", answer: "배란 전 정자의 생존기간(약 3~5일)과 배란 후 난자의 생존기간(약 1~2일)을 더하여 넉넉히 배란일 전 5일, 후 2일을 모두 임신 가임기 확률이 높은 안전하지 않은 구간으로 설정합니다." },
    { question: "생리 주기가 불규칙한 경우에도 정확한가요?", answer: "생리 주기가 심하게 불규칙할 경우(다낭성 난소 증후군 등) 단순 계산식으로는 정확한 예측이 어렵습니다. 이 경우 배란기 테스트기(배테기)를 사용하거나 산부인과 검진을 병행하는 것을 권장합니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "배란일 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/ovulation`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: q.answer
        }
    }))
};

const schema = {
    "@context": "https://schema.org",
    "name": "배란일 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/ovulation`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.OVULATION
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="배란일 계산기" description="마지막 생리 시작일과 평균 주기를 통하여 다음 생리 예정일, 임신 가능성이 높은 가임기 및 배란일 캘린더를 간단히 계산해드립니다." position="top" />
            <Ovulation />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📅</span> 배란일 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 배란일 계산기는 마지막 생리 시작일과 평균 생리 주기를 바탕으로 다음 생리 예정일, 배란 예정일, 그리고 임신 가능성이 높은 가임기(Fertile Window)를 과학적인 방법으로 예측해 드립니다. 임신을 준비하거나 피임을 계획하는 등 여성 건강 및 신체 사이클을 체계적으로 관리하는 데 유용한 지표가 됩니다.
                    </p>
                </section>

                {/* 2. 사용 방법 / 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📖</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>가장 최근에 했던 생리의 <strong>시작일</strong>을 입력합니다.</li>
                            <li>나의 <strong>평균 생리 주기</strong>(20일~45일)를 입력합니다. (기본 28일)</li>
                            <li>[계산하기] 버튼을 누르면 다음 생리 예정일과 가임기를 안내해 드립니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">시작일: 3월 1일 / 주기: 28일</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 배란 예정일 3월 15일</p>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 opacity-80">
                                <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">시작일: 3월 1일 / 주기: 35일</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 배란 예정일 3월 22일</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-pink-500">🔍</span> 배란일 산출 원리
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>개인의 생리 주기가 달라도 <strong>황체기(배란 후 생리 시작 전까지의 기간)</strong>는 보통 14일로 일정합니다.</p>
                            <p className="bg-pink-50 dark:bg-pink-900/10 p-3 rounded-xl text-pink-700 dark:text-pink-300">
                                다음 생리 예정일에서 <strong>14일을 뺀 날짜</strong>를 배란일로 예측합니다.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📊</span> 가임기 판정 기준
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>정자의 체내 생존 기간(3~5일)과 난자의 생존 기간(1~2일)을 모두 고려하여 산출합니다.</p>
                            <p className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl text-purple-700 dark:text-purple-300">
                                배란 예정일 <strong>앞으로 5일, 뒤로 2일</strong>을 가장 임신 확률이 높은 가임기로 판정합니다.
                            </p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
