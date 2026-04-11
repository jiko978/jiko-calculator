import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import DtiCalculator from "./Dti";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "DTI 계산기 | 총부채상환비율 대출 한도 계산 - JIKO 계산기",
    description: "내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요.",
    keywords: ["DTI계산기", "총부채상환비율", "부동산대출한도", "주담대DTI", "JIKO계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/dti` },
    openGraph: {
        title: "DTI 계산기 | 총부채상환비율 대출 한도 계산 - JIKO 계산기",
        description: "내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요.",
        url: `${BASE_URL}/calculator/real-estate/dti`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "DTI 계산기" }],
    },
};

const faqList = [
    {
        question: "DTI와 DSR의 가장 큰 차이점은 무엇인가요?",
        answer: "DTI는 '기존 대출의 이자'만 부채로 합산하지만, DSR은 '기존 대출의 이자와 원금'을 모두 부채로 합산합니다. 따라서 보통 DSR이 더 엄격한 기준이 됩니다."
    },
    {
        question: "연소득 증빙이 어려운 경우는 어떻게 하나요?",
        answer: "근로소득 외에 카드 사용액, 건강보험료 납부액 등으로 환산 소득을 인정받을 수 있습니다. JIKO 계산기는 증빙 가능한 정보를 기준으로 입력하시길 권장합니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DTI 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/dti`,
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
    "name": "DTI 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/dti`,
    "description": metadata.description as string
};

export default function DtiPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.DTI
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="DTI 계산기" description="내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요." position="top" />
            <DtiCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">📊</span> DTI 계산 상식 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <strong>DTI(Debt to Income)</strong>는 총부채상환비율로, 차주의 연간 소득에서 부채 상환액이 차지하는 비중을 말합니다. 주택담보대출의 경우 원리금 전체를 합산하고, 신용대출 등 기타 대출은 <strong>이자 상환액</strong>만 합산하는 것이 특징입니다.
                    </p>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqList} />
                </div>

                <RealEstateMoreCalculators />

                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </div>
    );
}
