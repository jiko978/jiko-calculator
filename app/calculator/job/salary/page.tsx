// app/calculator/job/salary/page.tsx
import type { Metadata } from "next";
import Salary from "./Salary";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import JobMoreCalculators from "@/app/calculator/components/JobMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "연봉/월급 계산기 | 세후 연봉 월급 계산 및 희망 실수령액 기준 세전 금액 계산 - JIKO 계산기",
    description: "최신 4대보험 요율과 간이세액표를 적용하여 연봉/월급의 정확한 예상 실수령액과 세금을 계산해드립니다.",
    keywords: ["연봉 계산기", "월급 계산기", "실수령액 계산기", "4대보험 계산기", "연봉 실수령액", "월급 실수령액", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/job/salary` },
    openGraph: {
        title: "연봉/월급 계산기 | 세후 연봉 월급 계산 및 희망 실수령액 기준 세전 금액 계산 - JIKO 계산기",
        description: "최신 4대보험 요율과 간이세액표를 적용하여 연봉/월급의 정확한 예상 실수령액과 세금을 계산해드립니다.",
        url: `${BASE_URL}/calculator/job/salary`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "연봉/월급 계산기" }],
    },
};

const faqList = [
    { question: "연봉 계산기와 월급 계산기의 차이점은 무엇인가요?", answer: "연봉 계산기는 1년 총 급여를 바탕으로 1개월치 실수령액을 산출하고, 월급 계산기는 1개월 급여를 기준으로 세금 및 4대보험 공제액을 산출합니다. 근본적인 세액 공제 산출식 자체는 동일하게 적용됩니다." },
    { question: "2025년 4대보험 공제율은 어떻게 되나요?", answer: "근로자 부담분 기준으로 국민연금 4.5%, 건강보험 3.545%, 고용보험 0.9%이며, 장기요양보험은 건강보험료의 12.95%가 부과됩니다. 우리 계산기는 이 최신 요율을 모두 반영하고 있습니다." },
    { question: "비과세액은 무엇이고, 기본값이 왜 20만원인가요?", answer: "식대, 자가운전보조금 등 4대보험 및 세금이 부과되지 않는 금액입니다. 2024년부터 법률이 개정되어 식대 비과세 한도가 월 10만원에서 20만원으로 상향되었기에 이를 기본값으로 설정했습니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "연봉/월급 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/job/salary`,
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
    "name": "연봉/월급 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/job/salary`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        COMMON_BREADCRUMBS.SALARY
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="연봉/월급 계산기" description="최신 4대보험 요율과 간이세액표를 적용하여 연봉/월급의 정확한 예상 실수령액과 세금을 계산해드립니다." position="top" />
            <Salary />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💸</span> 연봉/월급 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        2025년도의 최신 4대보험 요율과 간이세액표를 적용하여 연봉(또는 월급)에 따른 정확한 세금, 공제액, 그리고 최종적으로 내가 받게 될 <strong>매월 실수령액</strong>을 계산해드립니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>연봉인지 월급인지 기준을 선택 후 금액을 입력합니다. (빠른 단위 버튼 지원)</li>
                            <li>퇴직금 포함 여부를 명시합니다. (일반적으로 퇴직금 별도로 계약합니다.)</li>
                            <li>비과세액(식대 등 기본 20만원 세팅)과 부양가족수를 확인합니다.</li>
                            <li>[계산하기] 버튼을 누르면 세금과 내 통장에 꽂힐 실수령액이 도출됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">연봉 4,000만원 / 비과세 20 / 부양가족 1명</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">월 실수령액: 약 2,935,000원</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">월급 500만원 / 비과세 20 / 부양가족 1명</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">월 실수령액: 약 4,142,000원</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📌</span> 비과세 수당의 중요성
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>식대(월 20만원 한도), 자가운전보조금(월 20만원 한도) 등은 세금과 4대보험료가 면제됩니다.</li>
                            <li>연봉이 같더라도 비과세 수당의 비중이 높을수록 실수령액이 증가합니다.</li>
                            <li>계약서 작성 시 비과세 항목이 어떻게 구성되어 있는지 꼭 확인하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🎯</span> 연봉협상 꿀팁
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>퇴직금 포함 여부를 반드시 확인하세요. 연봉 1/13을 퇴직금으로 빼는 곳도 있습니다.</li>
                            <li>포괄임금제인지 확인하여 야간/휴일/연장 근로 수당이 연봉에 포함되어 있는지 체크하세요.</li>
                            <li>성과급(인센티브)이 고정인지 변동인지 조건부인지 명확히 물어보세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <JobMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}

