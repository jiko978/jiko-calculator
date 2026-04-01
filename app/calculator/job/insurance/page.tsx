import { Metadata } from "next";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import JobMoreCalculators from "@/app/calculator/components/JobMoreCalculators";
import Insurance from "./Insurance";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "4대보험 계산기 | 2026 최신 근로자·사업주 보험료 계산 - JIKO 계산기",
    description: "내 연봉/월급에서 빠져나가는 4대보험! 근로자와 회사가 각각 얼마씩 내는지 정확한 비율과 금액을 차트로 직관적으로 확인하세요.",
    keywords: ["4대보험 계산기", "국민연금 상한액", "건강보험료 계산", "고용보험료", "산재보험 요율", "사업주 부담금", "실수령액 차이", "4대보험 징수 비율"],
    alternates: { canonical: `${BASE_URL}/calculator/job/insurance` },
    openGraph: {
        title: "4대보험 계산기 | 2026 최신 근로자·사업주 보험료 계산",
        description: "회사가 내 대신 내주는 4대보험은 얼마일까요? 정확한 비율과 공제액을 확인하세요.",
        url: `${BASE_URL}/calculator/job/insurance`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "4대보험 계산기" }],
    },
};

export default function InsurancePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        { name: "4대보험 계산기", item: "/calculator/job/insurance" }
    ]);

    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "JIKO 4대보험 분담금 계산기",
        url: "https://jiko.kr/calculator/job/insurance",
        applicationCategory: "FinanceApplication",
        description: "2026년 최신 요율 기반으로, 근로자와 사업주가 각각 내는 국민연금, 건강보험, 고용보험, 산재보험을 정확히 계산하고 시각화합니다.",
        operatingSystem: "Web"
    };

    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "과세대상액(비과세 제외)이란 무엇인가요?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "4대보험과 소득세 산정의 기준이 되는 금액입니다. 기본급에서 비과세 대상인 식대(월 최대 20만 원), 자가운전보조금, 보육수당 등을 뺀 순수 과세 금액을 의미합니다. 즉, 비과세액이 높을수록 4대보험 부과 기준 금액이 낮아져 납부액도 줄어들게 됩니다."
                }
            },
            {
                "@type": "Question",
                name: "산재보험은 왜 제 월급에서 안 빠지나요?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "산업재해보상보험은 근로자의 업무상 재해를 구제하기 위한 사업주(회사)의 의무 가입 보험입니다. 따라서 근로자 급여에서는 단 1원도 공제되지 않으며, 발생되는 보험료는 기업(사업주)이 100% 전액 부담합니다."
                }
            },
            {
                "@type": "Question",
                name: "월급이 계속 오르는데 국민연금 공제액이 똑같이 나옵니다. 왜 그런가요?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "국민연금에는 납부 기준의 하한액과 상한액(상한선 기준소득월액 약 617만 원 수준)이 존재합니다. 4.5%를 징수하더라도 최대로 걷을 수 있는 상한선이 법으로 정해져 있으므로, 월 급여액이 이 한도를 초과하면 계속 급여가 치솟아도 더 이상 연금 공제액이 오르지 않습니다."
                }
            },
            {
                "@type": "Question",
                name: "회사 근로자 숫자에 따라 4대보험료가 다른가요?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "근로자(나)가 내는 금액은 기업 규모와 무관하게 동일합니다. 하지만 회사(사업주)가 부담해야 하는 영역 중 '고용보험 - 고용안정 및 직업능력개발사업' 항목의 요율은 회사의 직원 수가 150명 미만인지 150명 이상인지 등에 따라 0.25%부터 0.85%까지 단계별로 차등 부과됩니다."
                }
            }
        ]
    };

    const faqList = faqLd.mainEntity.map((item) => ({
        question: item.name,
        answer: item.acceptedAnswer.text
    }));

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

            <NavBar title="4대보험 계산기" description="4대보험 예상금액 및 비율 계산" position="top" />
            <Insurance />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🛡️</span> 4대보험 계산기 및 분담 비율 안내
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        2026년도 최신 기준을 적용하여, 내 급여에서 빠져나가는 4대보험 공제액과 회사가 나를 위해 <strong>추가 납부해 주는 비용</strong>이 각각 얼마인지 비율과 함께 투명하게 분석해 드립니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 4대보험, 누가 부담하나요?
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>국민연금 (노령 보장)</strong>: 총 9% 중 사용자와 근로자가 정확히 절반인 4.5%씩 부담합니다. 상한액이 존재합니다.</li>
                            <li><strong>건강·장기요양 (의료 보장)</strong>: 건강보험료 7.09% 역시 근로자와 회사가 절반씩 분담합니다.</li>
                            <li><strong>고용보험 (실업 구제)</strong>: 근로자는 0.9% 지불하지만, 회사는 직업능력개발 비용 등을 추가 지불합니다.</li>
                            <li><strong>산재보험 (업무 재해)</strong>: 근로 중 상해 보상은 회사의 책임 의무이므로, 전담하여 100% 회사가 지불합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 포인트
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">상한액 컷오프 주의점 (국민연금 등)</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">연봉이 일정 범위를 계속 초과해도, 법정 상한선(약 617만 원 등) 기준을 초과한 금액에는 보험료가 추가 부과되지 않습니다.</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">기업 규모 (고용보험)</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">고용안정·직업능력 사업 비용은 기업이 150명 이상인지 여부 등에 따라 추가 부담률이 다릅니다.</p>
                            </div>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <JobMoreCalculators />
            </main>
        </div>
    );
}
