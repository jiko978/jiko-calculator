import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import LtvCalculator from "./Ltv";
import FAQ from "@/app/calculator/components/FAQ";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "LTV 계산기 | 주택담보대출 지역별 한도 및 규제 정밀 분석 - JIKO",
    description: "2025 최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요.",
    keywords: ["LTV계산기", "담보인정비율", "주택담보대출한도", "생애최초LTV", "방공제계산", "부동산대출규제"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/ltv` },
};

const LTV_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "JIKO LTV 계산기",
    "operatingSystem": "iOS, Android, Windows, macOS",
    "applicationCategory": "FinanceApplication",
    "offers": { "@type": "Offer", "price": "0" },
    "description": "지역별/조건별 LTV 및 방공제 금액을 반영한 주택담보대출 정밀 한도 계산기"
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LTV_SCHEMA) }} />

            <NavBar title="🏠 LTV 계산기" description="지역별 규제 및 생애최초 한도 리포트 - JIKO" />

            <LtvCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        LTV 규제 및 한도 상식
                    </h2>

                    <div className="space-y-6">
                        <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100">
                            <p className="text-base font-black text-amber-800 dark:text-amber-300 mb-2">💡 지역별 LTV 기본 비율 (무주택자 기준)</p>
                            <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-2 list-disc ml-5 font-bold">
                                <li>비규제 지역 : LTV 70%</li>
                                <li>규제 지역 (강남3구, 용산) : LTV 50%</li>
                                <li>생애최초 주택구입 : 전 지역 LTV 80% (한도 6억)</li>
                            </ul>
                        </div>

                        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200 mb-2">🏘️ 주택 종류에 따른 시세 기준</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                                아파트는 대개 KB시세를 기준으로 하며, 오피스텔이나 빌라는 감정평가액을 주로 사용합니다. KB시세가 없는 신축 단지는 분양가를 기준으로 대출이 실행되기도 합니다.
                            </p>
                        </div>
                    </div>
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
