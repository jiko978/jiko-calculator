import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import LtvCalculator from "./Ltv";
import FAQ from "@/app/calculator/components/FAQ";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "LTV 계산기 | 주택담보대출 지역별 한도 및 규제 정밀 계산 - JIKO 계산기",
    description: "최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요.",
    keywords: ["LTV계산기", "담보인정비율", "주택담보대출한도", "생애최초LTV", "방공제계산", "부동산대출규제"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/ltv` },
    openGraph: {
        title: "LTV 계산기 | 주택담보대출 지역별 한도 및 규제 정밀 계산 - JIKO 계산기",
        description: "최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요.",
        url: `${BASE_URL}/calculator/real-estate/ltv`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "LTV 계산기" }],
    },
};

const faqData = [
    {
        question: "LTV(담보인정비율)란 무엇인가요?",
        answer: "주택의 담보 가치 대비 대출 가능한 최대 금액의 비율입니다. 예를 들어 10억 아파트의 LTV가 70%라면 이론상 최대 7억까지 대출이 가능합니다."
    },
    {
        question: "방공제(소액임차보증금 차감)가 무엇인가요?",
        answer: "주택담보대출 시 소액임차인을 보호하기 위한 최우선변제금을 대출 한도에서 미리 빼는 것을 말합니다. 지역에 따라 약 2,500만 원에서 5,500만 원까지 대출금에서 차감될 수 있습니다."
    },
    {
        question: "생애최초 주택구입 시 혜택이 있나요?",
        answer: "현재 생애최초 주택구입자는 지역에 관계없이 LTV 80%까지 적용받을 수 있습니다. 단, 총 대출 한도는 6억 원을 초과할 수 없으므로 주의가 필요합니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LTV 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/ltv`,
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
    "name": "LTV 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/ltv`,
    "description": metadata.description as string
};

export default function LtvPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.LTV
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="LTV 계산기" description="최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요." />

            <LtvCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        LTV 규제 및 한도 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <b>LTV(Loan to Value Ratio)</b>는 담보인정비율로, 주택의 가치 대비 대출 가능한 최대 금액의 비율을 의미합니다. 
                        JIKO LTV 계산기는 최신 규제 지역 정보, 생애최초 혜택, 방공제(소액임차보증금) 차감액까지 완벽하게 반영하여 실제 수령 가능한 대출 한도를 정밀하게 산출해 드립니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-amber-500">💡</span> 지역별 LTV 기준
                        </h2>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2 list-disc ml-5 font-bold leading-relaxed">
                            <li>비규제 지역 : LTV 70%</li>
                            <li>규제 지역 (강남3구, 용산) : LTV 50%</li>
                            <li>생애최초 주택구입 : 전 지역 LTV 80% (한도 6억)</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">🏘️</span> 시세 기준 확인
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            아파트는 주로 <b>KB시세</b>를 기준으로 하며, 빌라나 오피스텔은 감정평가액을 사용합니다. 
                            신축의 경우 분양가가 기준이 되기도 하니 확인이 필요합니다.
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
