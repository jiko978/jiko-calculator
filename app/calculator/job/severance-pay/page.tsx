// app/calculator/job/severance-pay/page.tsx
import type { Metadata } from "next";
import SeverancePay from "./SeverancePay";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import JobMoreCalculators from "@/app/calculator/components/JobMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "퇴직금 계산기 | 근속 연수와 평균임금을 반영하여 퇴직 실수령액 계산 - JIKO 계산기",
    description: "최신 산정 기준을 반영하여 근속 연수와 평균임금을 기반으로 정확한 퇴직금 및 세금을 계산해드립니다.",
    keywords: ["퇴직금 계산기", "예상 퇴직금", "퇴직금 계산 방법", "퇴직금 세금 계산", "퇴직소득세 계산", "평균임금 계산", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/job/severance-pay` },
    openGraph: {
        title: "퇴직금 계산기 | 근속 연수와 평균임금을 반영하여 퇴직 실수령액 계산 - JIKO 계산기",
        description: "최신 산정 기준을 반영하여 근속 연수와 평균임금을 기반으로 정확한 퇴직금 및 세금을 계산해드립니다.",
        url: `${BASE_URL}/calculator/job/severance-pay`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "퇴직금 계산기" }],
    },
};

const faqList = [
    { question: "퇴직금 지급 대상은 어떻게 되나요?", answer: "1주당 소정근로시간이 15시간 이상이고, 계속 근로기간이 1년 이상이면 지급 대상입니다. 1년 미만 근로 시 법정 퇴직금은 발생하지 않습니다." },
    { question: "퇴직금 산정 기준인 '평균임금'은 무엇인가요?", answer: "퇴직 전 3개월 동안 지급된 임금의 총액을 해당 기간의 총 일수로 나룬 금액입니다. 여기에는 상여금의 1/4과 연차수당의 1/4도 포함됩니다." },
    { question: "퇴직금은 언제까지 지급되어야 하나요?", answer: "근로기준법에 따라 퇴사일로부터 14일 이내에 지급되어야 합니다. 특별한 사정이 있는 경우 합의에 의해 연장할 수 있습니다." },
    { question: "퇴직금은 반드시 IRP 계좌로 받아야 하나요?", answer: "2022년 4월부터 퇴직연금 가입 여부와 관계없이 모든 퇴직금은 원칙적으로 개인형퇴직연금(IRP) 계좌로 이전하여 지급해야 합니다. 단, 만 55세 이후 퇴직하거나 금액이 300만원 이하인 경우 등은 예외가 있습니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "퇴직금 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/job/severance-pay`,
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
    "name": "퇴직금 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/job/severance-pay`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        COMMON_BREADCRUMBS.SEVERANCE_PAY
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="퇴직금 계산기" description="최신 산정 기준을 반영하여 근속 연수와 평균임금을 기반으로 정확한 퇴직금 및 세금을 계산해드립니다." position="top" />
            <SeverancePay />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💼</span> 퇴직금 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        내 퇴직금이 얼마인지 궁금하신가요? <strong>2025년 최신 퇴직금 산정 방식</strong>을 적용하여 근속 기간에 따른 정확한 세전 퇴직금과 세금, 그리고 최종 실수령액까지 한눈에 확인해 보세요.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>입사일과 퇴사일</strong>을 정확히 입력합니다. (재직일수 자동 계산)</li>
                            <li>퇴사 직전 <strong>3개월간의 급여</strong> 내역을 입력합니다.</li>
                            <li><strong>연간 상여금과 연차수당</strong> 총액을 입력하여 산정에 포함합니다.</li>
                            <li>[계산하기] 버튼을 누르면 세후 실수령 예상액을 포함한 결과가 출력됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">근속 3년 / 평균월급 350만원 / 상여 0</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">예상 퇴직금: 약 1,050만원</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">근속 10년 / 평균월급 500만원 / 상여 500</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">예상 퇴직금: 약 5,400만원</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📌</span> 퇴직금 미지급 대처법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>퇴사일로부터 14일 이내에 지급되지 않으면 관할 고용노동청에 진정이나 고소를 제기할 수 있습니다.</li>
                            <li>지연 지급 시 연 20%의 지연 이자가 발생할 수 있으므로, 미지급 기간의 이자도 함께 청구하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🎯</span> IRP 계좌 활용법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>퇴직금을 IRP 계좌로 받으면 퇴직소득세 납부가 이연되어 실질적으로 더 큰 금액을 굴릴 수 있습니다.</li>
                            <li>IRP 계좌 해지 시 세금이 부과되므로 가급적 연금 형태로 수령하여 절세 효과(세율 30% 감면)를 누리는 것이 좋습니다.</li>
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

