// app/calculator/health/calorie/page.tsx
import type { Metadata } from "next";
import Calorie from "./Calorie";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "칼로리 계산기 | 운동 및 식단 칼로리 계산기 - JIKO 계산기",
    description: "내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요.",
    keywords: ["칼로리 계산기", "운동 칼로리 소모 계산기", "다이어트 식단 계산기", "다이어트", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/calorie` },
    openGraph: {
        title: "칼로리 계산기 | 운동 및 식단 칼로리 계산기 - JIKO 계산기",
        description: "내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요.",
        url: `${BASE_URL}/calculator/health/calorie`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "칼로리 계산기" }],
    },
};

const faqList = [
    { question: "권장 칼로리(TDEE)가 중요한 이유가 뭔가요?", answer: "기초대사량이 몸을 가만히 둘 때 쓰는 에너지라면, 유지 칼로리(TDEE)는 걷고, 직장생활하고, 운동하는 모든 활동대사량을 합친 총 소모 에너지입니다. 이보다 덜 먹으면 살이 빠지고, 더 먹으면 살이 찌게 됩니다." },
    { question: "다이어트를 하려면 얼마나 줄여야 하나요?", answer: "하루 권장 에너지에서 300 ~ 500 kcal 정도를 줄이는 것이 몸에 무리가 가지 않으면서 근손실을 최소화하는 정석적인 방법입니다. 너무 급격한 단식은 피해주세요." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "칼로리 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/calorie`,
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
    "name": "칼로리 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/calorie`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.CALORIE
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="칼로리 계산기" description="내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요." position="top" />
            <Calorie />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏃‍♂️</span> 칼로리 계산기 및 운동/다이어트 밸런스 측정
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        기초대사량에 평소 생활 패턴 및 운동 활동량을 반영하여, 내가 하루 종일 섭취해야 할 최적의 칼로리를 산출합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>성별과 나이, 신체정보를 입력합니다.</li>
                            <li>본인의 **평소 활동량**을 최대한 솔직하게 선택해 주세요.</li>
                            <li>[계산하기] 버튼을 누르면 목표에 따른 식단 조절 플랜 기준점이 나타납니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">성인 여성 / 사무직 / 다이어트 목적</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">일일 권장 섭취: 약 1,500 ~ 1,600 kcal</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">성인 남성 / 운동형 / 현상 유지 목적</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">일일 권장 섭취: 약 2,400 ~ 2,600 kcal</p>
                            </div>
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
