import type { Metadata } from "next";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import DischargeDayCalculator from "./DischargeDay";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "전역일 계산기 | 군대 전역일 · 복무율 · 진급일 계산 - JIKO 계산기",
    description: "입대일과 복무구분(육군, 해군, 공군 등)을 선택하여 정확한 전역일과 현재 복무율을 확인하세요. 이병부터 병장까지의 진급일 타임라인도 함께 제공합니다.",
    keywords: ["전역일 계산기", "군대 전역일", "복무율 계산", "진급일 계산", "육군 전역일", "공군 전역일", "해군 전역일", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/discharge-day` },
    openGraph: {
        title: "전역일 계산기 | 군대 전역일 · 복무율 · 진급일 계산 - JIKO 계산기",
        description: "입대일과 복무구분(육군, 해군, 공군 등)을 선택하여 정확한 전역일과 현재 복무율을 확인하세요. 이병부터 병장까지의 진급일 타임라인도 함께 제공합니다.",
        url: `${BASE_URL}/calculator/life/discharge-day`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "전역일 계산기" }],
    },
};

const faqList = [
    {
        question: "복무 기간 단축 혜택이 적용된 결과인가요?",
        answer: "네, JIKO 전역일 계산기는 현재 시행되고 있는 각 군별(육군 18개월, 해군 20개월, 공군 21개월 등) 단축된 복무 기간 기준을 정확히 반영하고 있습니다."
    },
    {
        question: "진급일 계산 기준은 어떻게 되나요?",
        answer: "진급일은 입대일을 기준으로 각 계급별 의무 복무 기간(이병 2개월, 일병 6개월, 상병 6개월 등)을 더하여 산출합니다. 다만, 징계 등으로 인한 진급 누락은 반영되지 않으므로 참고용으로 활용해 주세요."
    },
    {
        question: "전역일 당일도 복무 기간에 포함되나요?",
        answer: "전역일 당일 24시(자정)까지가 법적인 복무 기간이지만, 통상적으로 전역일 아침에 부대를 나서게 됩니다. 계산기상으로는 전역일 당일까지를 총 복무 일수에 포함합니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "전역일 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/life/discharge-day`,
    applicationCategory: "UtilityApplication",
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
    "name": "전역일 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/life/discharge-day`,
    "description": metadata.description as string
};

export default function DischargeDayPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        COMMON_BREADCRUMBS.DISCHARGE_DAY
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="전역일 계산기" description="입대일과 복무구분(육군, 해군, 공군 등)을 선택하여 정확한 전역일과 현재 복무율을 확인하세요. 이병부터 병장까지의 진급일 타임라인도 함께 제공합니다." position="top" />
            <DischargeDayCalculator />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🎖️</span> 전역일 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 전역일 계산기는 육군, 해군, 공군, 해병대 등 각 군별 복무 기간에 맞춰 전역일과 실시간 복무율을 정확하게 산출합니다. 이병부터 병장까지의 계급별 진급 예정일도 타임라인으로 보여주어 계획적인 군 생활을 돕습니다.
                    </p>
                </section>

                {/* 2. 사용 방법 / 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📖</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>본인의 <strong>군별(육군, 해군, 공군 등)</strong>을 선택합니다.</li>
                            <li>정확한 <strong>입대일</strong>을 달력에서 지정합니다.</li>
                            <li>[계산하기]를 누르면 <strong>전역일, 복무율, 진급일</strong>이 산출됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl space-y-2">
                            <p className="font-bold text-amber-700 dark:text-amber-300">"육군으로 오늘 입대한다면 언제 전역할까?"</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>군별 :</strong> 육군 (18개월)</li>
                                <li><strong>입대일 :</strong> 오늘 날짜</li>
                                <li className="font-bold text-blue-600 dark:text-blue-400">결과 : 18개월 후 전역일 및 타임라인 표시</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* 3. 계산 팁 */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        전역일 계산 팁
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200 mb-1.5 leading-relaxed">💡 전역일 계산 기준</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">군별 복무 기간에 따라 '입대일 시점 + N개월 - 1일'을 전역일로 봅니다.</p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200 mb-1.5 leading-relaxed">🗓️ 진급일 예측</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">부대 상황에 따라 다를 수 있으며 시점 파악을 위한 참고용 데이터입니다.</p>
                        </div>
                    </div>
                </div>

                {/* 4. 추가 카드 세션 (실시간 복무율 / 진급 마일스톤) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📈</span> 실시간 복무율
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>현재까지 복무한 일수와 남은 일수를 실시간 퍼센트로 확인하세요.</p>
                            <p className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl text-blue-700 dark:text-blue-300">"국방부 시계는 오늘도 돌아갑니다!"</p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">🗓️</span> 진급 마일스톤
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>이병, 일병, 상병, 병장 각 계급별 진급 예정일 정보를 제공합니다.</p>
                            <p className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl text-amber-700 dark:text-amber-300">군 생활의 보람을 날짜로 확인해 보세요.</p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <LifeMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
