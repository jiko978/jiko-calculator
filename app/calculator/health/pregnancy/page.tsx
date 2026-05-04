// app/calculator/health/pregnancy/page.tsx
import type { Metadata } from "next";
import Pregnancy from "./Pregnancy";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "임신주수 계산기 | 마지막 생리일, 초음파 주수, 출산예정일 예측 - JIKO 계산기",
    description: "마지막 생리일, 초음파 주수 출산 예정일 기준으로 임신 N주차인지 알아보고 출산 예정일 D-Day를 확인하세요.",
    keywords: ["임신주수 계산기", "출산예정일 계산기", "출산 예정일", "배란일", "임신 디데이", "임신주기", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/pregnancy` },
    openGraph: {
        title: "임신주수 계산기 | 마지막 생리일, 초음파 주수, 출산예정일 예측 - JIKO 계산기",
        description: "마지막 생리일, 초음파 주수 출산 예정일 기준으로 임신 N주차인지 알아보고 출산 예정일 D-Day를 확인하세요.",
        url: `${BASE_URL}/calculator/health/pregnancy`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "임신주수 출산예정일 계산기" }],
    },
};

const faqList = [
    { question: "출산 예정일은 어떤 기준으로 계산되나요?", answer: "마지막 생리 시작일에서 평균 임신 기간인 280일(40주)을 더하여 출산 예정일을 산출하게 됩니다(네겔레 법칙). 단순 달력 기준이므로 실상황과는 ±2주가량 편차가 존재합니다." },
    { question: "병원(초음파) 주수와 다를 수 있나요?", answer: "네, 아기의 크기 등 성장 상황에 따라 의사 선생님이 주수를 새롭게 정정해주기도 합니다. 이 경우 '초음파 주수 기준' 탭에 날짜/주수를 기입하시면 그에 맞춰 정확한 D-Day를 반영해 줍니다." },
    { question: "임신 주수는 언제부터 1주차로 계산하나요?", answer: "실제 수정된 날이 아니라, '마지막 생리 시작일'을 임신 0주 0일로 기준 삼아 계산합니다. 즉, 실제로 정자와 난자가 만나 수정되는 시점은 대략 임신 2주차 무렵이 됩니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "임신주수 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/pregnancy`,
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
    "name": "임신주수 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/pregnancy`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.PREGNANCY
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="임신주수 계산기" description="마지막 생리일, 초음파 주수 출산 예정일 기준으로 임신 N주차인지 알아보고 출산 예정일 D-Day를 확인하세요." position="top" />
            <Pregnancy />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">👶</span> 임신주수 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 임신주수 계산기는 뱃속의 소중한 생명이 얼마나 자라고 있는지 매일매일 확인하고 싶은 예비 부모를 위한 도구입니다. 마지막 생리 시작일 또는 산부인과 초음파 기준일을 바탕으로 아기를 만나는 출산 예정일까지 얼마나 남았는지 D-DAY와 현재 임신 주수(주/일차)를 계산하여, 임신 진행 상황을 직관적인 퍼센트(%) 바를 통해 시각적으로 보여줍니다.
                    </p>
                </section>

                {/* 2. 사용 방법 / 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📖</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>총 3가지 탭(마지막 생리, 초음파, 예정일 기준)으로 내 상황에 맞게 입력기를 고릅니다.</li>
                            <li>날짜 또는 주수를 입력 후 [계산하기]를 클릭합니다.</li>
                            <li>퍼센트로 나타나는 귀여운 프로그레스 바를 통해 얼마나 아이가 크고 있는지 확인해보세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">마지막 생리일: 1월 1일</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 출산 예정일 10월 8일 (40주 0일)</p>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 opacity-80">
                                <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">초음파 기준: 10주 2일 (오늘 기준)</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 남은 기간 약 208일 (D-208)</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-pink-500">👶</span> 임신 시기별 구분
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p><strong>초기 (1~13주)</strong>, <strong>중기 (14~27주)</strong>, <strong>후기 (28주~출산)</strong>로 나뉩니다.</p>
                            <p className="bg-pink-50 dark:bg-pink-900/10 p-3 rounded-xl text-pink-700 dark:text-pink-300">
                                각 시기(Trimester)별로 태아의 발달 단계와 산모에게 나타나는 신체 변화 및 주의사항이 달라집니다.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📏</span> 네겔레 법칙
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>마지막 생리일(LMP)을 기준으로 <strong>280일(40주)</strong>을 더하여 분만 예정일을 산출합니다.</p>
                            <p className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl text-purple-700 dark:text-purple-300">
                                월(Month)에서 3을 빼거나 9를 더하고, 일(Day)에 7을 더하는 방식으로 전 세계 표준으로 사용됩니다.
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
