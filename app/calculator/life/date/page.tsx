import type { Metadata } from "next";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import DateCalculator from "./Date";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "날짜 계산기 | 날짜 일수 계산 · 주수 · 개월수 확인 - JIKO 계산기",
    description: "두 날짜 사이의 정확한 기간을 계산하고, 특정 시점까지의 일수나 주수를 한눈에 확인하세요. 100일, 1주년 등 기념일 타임라인도 함께 확인하실 수 있습니다.",
    keywords: ["날짜 계산기", "날짜 수 계산", "디데이 계산", "주수 계산", "개월수 계산", "기념일 계산", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/date` },
    openGraph: {
        title: "날짜 계산기 | 날짜 일수 계산 · 주수 · 개월수 계산 - JIKO 계산기",
        description: "두 날짜 사이의 정확한 기간을 계산하고, 특정 시점까지의 일수나 주수를 한눈에 확인하세요. 100일, 1주년 등 기념일 타임라인도 함께 확인하실 수 있습니다.",
        url: `${BASE_URL}/calculator/life/date`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "날짜 계산기" }],
    },
};

const faqList = [
    {
        question: "시작일과 종료일 중 어느 날을 포함해야 하나요?",
        answer: "일반적인 기간 계산(만 나이 등)은 시작일을 포함하지 않는 경우가 많지만, 기념일이나 군 복무 기간 계산 등은 시작일을 1일로 포함합니다. JIKO 계산기는 선택에 따라 정확한 일수를 보여드립니다."
    },
    {
        question: "윤년(2월 29일)이 포함된 경우 계산 결과는 어떻게 되나요?",
        answer: "JIKO 날짜 계산기는 4년마다 돌아오는 윤년을 자동으로 인식하여 366일로 계산하므로, 장기적인 기간 계산도 매우 정확합니다."
    },
    {
        question: "주수(Weeks) 계산은 어떤 경우에 쓰이나요?",
        answer: "주수 계산은 주로 임신 주수 확인, 대규모 프로젝트 일정 관리, 운동 계획 수립 등에 유용하게 활용됩니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "날짜 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/life/date`,
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
    "name": "날짜 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/life/date`,
    "description": metadata.description as string
};

export default function DatePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        { name: "날짜 계산기", item: `${BASE_URL}/calculator/life/date` }
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="날짜 계산기" description="두 날짜 사이의 정확한 기간을 계산하고, 특정 시점까지의 일수나 주수를 한눈에 확인하세요. 100일, 1주년 등 기념일 타임라인도 함께 확인하실 수 있습니다." position="top" />
            <DateCalculator />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📅</span> 날짜 계산 상식 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        날짜 계산 시 가장 흔히 혼동되는 부분이 <strong>'초일 산입(첫날 포함)'</strong> 여부입니다. 법제처나 민법 기준으로는 보통 첫날을 산입하지 않는 것이 원칙이지만, 우리의 일상적인 기념일(예: 100일)은 당일을 포함하여 셉니다. JIKO 날짜 계산기는 이러한 일상의 편의를 반영하여 설계되었습니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📏</span> 기간 측정
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>두 날짜 사이가 몇 개월, 몇 주, 몇 일인지 정밀하게 측정합니다.</p>
                            <p className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl text-blue-700 dark:text-blue-300">중장기 프로젝트 및 여행 계획 수립에 유용합니다.</p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-emerald-500">🗓️</span> 타임라인 생성
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>기준일로부터 100일, 200일, 1주년 등 주요 기념일을 자동으로 보여줍니다.</p>
                            <p className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl text-emerald-700 dark:text-emerald-300">잊기 쉬운 기념일을 미리 체크할 수 있습니다.</p>
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
