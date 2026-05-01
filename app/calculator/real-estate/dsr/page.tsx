import { Metadata } from "next";
import DsrCalculator from "./Dsr";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";
import NavBar from "@/app/calculator/components/NavBar";

import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "DSR 계산기 | 총부채원리금상환비율 및 스트레스 DSR 한도 계산 - JIKO",
    description: "최신 규제 반영! 연소득 대비 대출 원리금 상환액 비율(DSR)과 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요.",
    keywords: ["DSR계산기", "총부채원리금상환비율", "스트레스DSR", "대출한도계산", "부동산대출규제", "신용대출DSR"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/dsr` },
    openGraph: {
        title: "DSR 계산기 | 총부채원리금상환비율 및 스트레스 DSR 한도 계산 - JIKO",
        description: "최신 규제 반영! 연소득 대비 대출 원리금 상환액 비율(DSR)과 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요.",
        url: `${BASE_URL}/calculator/real-estate/dsr`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "DSR 계산기" }],
    },
};

const faqData = [
    {
        question: "DSR(총부채원리금상환비율)이란 무엇인가요?",
        answer: "DSR은 모든 가계대출의 원리금 상환액을 연간 소득으로 나눈 비율입니다. 현재 시중은행 기준 보통 40% 규제가 적용되어, 소득 대비 부채가 이 선을 넘으면 추가 대출이 제한됩니다."
    },
    {
        question: "스트레스 DSR이란 무엇이며 언제부터 적용되나요?",
        answer: "향후 금리 상승 가능성을 고려해 실제 금리에 '가산 금리'를 더해 대출 한도를 산정하는 제도입니다. 2024년 9월부터 2단계가 시행 중이며, 수도권 주담대에는 더 높은 가산금리가 적용됩니다."
    },
    {
        question: "DSR 계산 시 제외되는 대출도 있나요?",
        answer: "전세대출, 소액 생계비 대출, 서민금융상품(햇살론 등), 중도금대출 등은 DSR 산정 시 제외되거나 다른 기준이 적용될 수 있습니다. 정확한 규정은 금융사별로 상이할 수 있습니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DSR 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/dsr`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((q) => ({
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
    "name": "DSR 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/dsr`,
    "description": metadata.description as string
};

export default function DsrPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.DSR
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="DSR 계산기" description="최신 규제 반영! 연소득 대비 대출 원리금 상환액 비율(DSR)과 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요." />

            <DsrCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        DSR 및 스트레스 DSR 개요
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <b>DSR(Debt Service Ratio)</b>은 총부채원리금상환비율로, 차주의 연간 소득 대비 모든 가계대출의 원리금 상환액이 차지하는 비중을 말합니다. 
                        JIKO DSR 계산기는 최신 규제인 <b>스트레스 DSR</b>을 반영하여, 향후 금리 변동 리스크를 고려한 실제 대출 가능 한도를 정밀하게 산출해 드립니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> DSR 부채산정 방식
                        </h2>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-3 list-disc ml-5 font-bold leading-relaxed">
                            <li>주택담보대출 : 최장 만기를 기준으로 원리금 균등 산정</li>
                            <li>신용대출 : 실제 만기 관계없이 5년 균등분할 상환 간주</li>
                            <li>비주택담보대출 : 8년 균등분할 상환으로 간주하여 계산</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-red-500">⚠️</span> 주의사항
                        </h2>
                        <p className="text-xs text-red-500 dark:text-red-400/80 leading-relaxed font-bold tracking-tight">
                            금융당국의 지침은 원론적인 규칙이며, 실제 대출 가능 여부와 한도는 각 은행의 심사 기준 및 대출 시점의 정책 변화에 따라 달라질 수 있습니다. 정확한 상담은 반드시 금융기관을 통해 확인하시기 바랍니다.
                        </p>
                    </section>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqData} />
                </div>

                <RealEstateMoreCalculators />

                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </div>
    );
}
