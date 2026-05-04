import type { Metadata } from "next";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import GradeCalculator from "./GradeCalculator";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "학점 계산기 | 총 평점, 전공 평점, 백분위 계산 - JIKO 계산기",
    description: "4.5만점, 4.3만점 기준 대학교 학점을 쉽고 정확하게 계산하세요. 전공 평점과 백분위 환산 점수까지 간편하게 확인할 수 있습니다.",
    keywords: ["학점계산기", "대학교 학점", "전공학점", "GPA 계산기", "4.5만점", "4.3만점", "백분위 계산기", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/grade` },
    openGraph: {
        title: "학점 계산기 | 총 평점, 전공 평점, 백분위 계산 - JIKO 계산기",
        description: "4.5만점, 4.3만점 기준 대학교 학점을 쉽고 정확하게 계산하세요. 전공 평점과 백분위 환산 점수까지 간편하게 확인할 수 있습니다.",
        url: `${BASE_URL}/calculator/life/grade`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "학점 계산기" }],
    },
};

const faqList = [
    {
        question: "P/NP (Pass/Non-Pass) 과목은 어떻게 계산되나요?",
        answer: "P/NP 과목은 이수 학점(총 취득 학점)에는 포함되지만, 총 평점(GPA) 산출을 위한 계산에는 제외됩니다. 성적표에서 평점을 계산할 때 점수가 부여되지 않기 때문입니다."
    },
    {
        question: "전공 평점은 별도로 계산되나요?",
        answer: "네, 전공으로 체크하신 과목들만 모아서 별도로 전공 평점을 계산해 드립니다. 졸업 요건이나 취업 시 전공 평점을 요구하는 경우가 많아 유용합니다."
    },
    {
        question: "4.5 만점과 4.3 만점의 차이는 무엇인가요?",
        answer: "학교마다 A+에 부여하는 점수(4.5 또는 4.3)가 다르며, 4.3 만점의 경우 A-, B- 등 세분화된 등급이 존재하는 경우가 많습니다. 이에 따라 만점 기준에 맞게 백분위 환산 점수에도 차이가 발생합니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "학점 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/life/grade`,
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
    "name": "학점 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/life/grade`,
    "description": metadata.description as string
};

export default function GradePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        COMMON_BREADCRUMBS.GRADE
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="학점 계산기" description="4.5만점, 4.3만점 기준 대학교 학점을 쉽고 정확하게 계산하세요. 전공 평점과 백분위 환산 점수까지 간편하게 확인할 수 있습니다." position="top" />
            <GradeCalculator />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🎓</span> 학점 계산기 가이드 (대학생 학점 관리 및 변환 안내)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 학점 계산기는 대학생들의 필수 도구입니다. 본인 대학교의 기준 평점(4.5/4.3/4.0/100점 만점)에 맞춰 이번 학기 성적을 예측하거나, 전체 누적 총 평점(GPA) 및 전공 평점을 쉽고 정확하게 관리할 수 있도록 도와줍니다. 백분위 환산 점수와 학점 변환 기능도 제공합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside">
                            <li>본인 대학교의 <strong>기준 평점</strong>(4.5 / 4.3 / 4.0 / 100점 만점)을 선택합니다.</li>
                            <li>이수한 과목의 <strong>학점</strong>과 <strong>성적</strong>을 입력하고 전공 여부를 체크합니다.</li>
                            <li><strong>[학점 계산하기]</strong>를 누르면 총 평점과 전공 평점을 확인할 수 있습니다.</li>
                            <li>다른 만점 기준으로 변환이 필요할 경우 상단의 <strong>학점 변환기</strong> 탭을 이용하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-emerald-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">4.5 만점 기준 성적 입력 시</p>
                            <p className="mb-1">• 전공 과목 : 3학점 A+ (4.5점)</p>
                            <p className="mb-2">• 교양 과목 : 2학점 B+ (3.5점)</p>
                            <div className="border-t border-emerald-200 dark:border-emerald-800 my-2"></div>
                            <p>• 이수 학점 : <strong>5학점</strong></p>
                            <p>• 전공 평점 : <strong>4.50</strong></p>
                            <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400">총 평점 : 4.10 / 백분위 : 94.6점</p>
                        </div>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📌</span> 재수강과 학점포기
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5 leading-relaxed">
                            <li>재수강 시 이전 성적과 새로운 성적 중 높은 것이 반영되는 학교가 많습니다.</li>
                            <li>학점포기 제도가 있는 경우, 낮은 성적의 과목을 삭제하여 전체 평점을 올릴 수 있습니다.</li>
                            <li>단, 학교별 학칙에 따라 다르게 적용되므로 반드시 학사 공지를 확인하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🎯</span> 졸업 요건 확인
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5 leading-relaxed">
                            <li>전체 졸업 필요 학점뿐만 아니라 <strong>전공 필수/선택 이수 학점</strong>을 꼭 확인하세요.</li>
                            <li>다전공(복수/부전공) 시 요구되는 학점 기준이 다를 수 있습니다.</li>
                            <li>마지막 학기에 요건을 채우지 못해 졸업이 유예되는 일이 없도록 미리 점검하세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <LifeMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
