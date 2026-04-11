import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import NewDtiCalculator from "./NewDti";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기",
    description: "다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다.",
    keywords: ["신DTI계산기", "다주택자대출", "강화된DTI", "주담대한도", "신총부채상환비율", "부동산규제"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/new-dti` },
    openGraph: {
        title: "신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기",
        description: "다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다.",
        url: `${BASE_URL}/calculator/real-estate/new-dti`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "신DTI 계산기" }],
    },
};

const faqList = [
    {
        question: "신DTI가 일반 DTI보다 왜 더 보수적인가요?",
        answer: "일반 DTI는 기존 주담대의 '이자'만 부채로 보지만, 신DTI는 기존 주담대의 '원금과 이자' 전체를 부채로 보기 때문입니다. 다주택자일수록 한도가 더 크게 줄어듭니다."
    },
    {
        question: "두 번째 주택담보대출부터는 무조건 신DTI가 적용되나요?",
        answer: "네, 현재 금융 규제상 추가 주담대 발급 시에는 강화된 신DTI 기준이 적용되며, 지역 및 대출 상품에 따라 LTV 규제와 함께 중첩 적용될 수 있습니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "신DTI 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/new-dti`,
    applicationCategory: "FinanceApplication",
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
    "name": "신DTI 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/new-dti`,
    "description": metadata.description as string
};

export default function NewDtiPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.NEW_DTI
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="신DTI 계산기" description="다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다." position="top" />
            <NewDtiCalculator />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏢</span> 신DTI(New DTI) 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <strong>신DTI</strong>는 차주의 상환 능력을 더욱 엄격히 평가하기 위해 도입된 제도로, 보유한 <strong>모든 주택담보대출의 원리금 상환액</strong>을 부채로 산정합니다. 다주택자가 추가 대출을 받을 때 '한도 절벽'을 겪게 되는 주요 원인이 됩니다.
                    </p>
                </section>

                <FAQ faqList={faqList} />
                <RealEstateMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
