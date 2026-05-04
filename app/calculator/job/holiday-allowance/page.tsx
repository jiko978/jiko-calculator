import type { Metadata } from "next";
import HolidayAllowance from "./HolidayAllowance";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import JobMoreCalculators from "@/app/calculator/components/JobMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "주휴수당 계산기 | 최신 근로기준법 적용 주급, 월급 계산 - JIKO 계산기",
    description: "시급과 주간근로시간만 간편히 입력해 주휴수당 발생 여부와 정확한 수령액(주급, 월급)을 계산해보세요.",
    keywords: ["주휴수당 계산기", "주휴수당 계산법", "주급 계산기", "알바 월급 계산기", "최저임금", "주휴수당 조건"],
    alternates: { canonical: `${BASE_URL}/calculator/job/holiday-allowance` },
    openGraph: {
        title: "주휴수당 계산기 | 최신 근로기준법 적용 주급, 월급 계산 - JIKO 계산기",
        description: "시급과 주간근로시간만 간편히 입력해 주휴수당 발생 여부와 정확한 수령액(주급, 월급)을 계산해보세요.",
        url: `${BASE_URL}/calculator/job/holiday-allowance`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "주휴수당 계산기" }],
    },
};

const faqList = [
    { question: "주휴수당 지급 기준 안내", answer: "주 15시간 이상 근무해야 하며, 근로계약서에 정한 소정 근로일에 1주간 모두 개근해야 주휴수당이 발생합니다. 정규직, 파트타임 등 근로형태와 무관하게 요건 충족 시 모든 근로자에게 적용됩니다." },
    { question: "주휴수당 계산 방법은 어떻게 되나요?", answer: "1주 소정근로시간이 40시간 미만인 경우 '(1주 근로시간 / 40) × 8시간 × 시급'으로 계산합니다. 단, 주 40시간 이상 근무하더라도 주휴시간은 최대 8시간까지만 인정됩니다." },
    { question: "미지급 시 어떻게 대처하나요?", answer: "주휴수당 미지급은 엄연한 임금체불에 해당합니다. 고용노동부 고객상담센터(1350)에 문의하거나 관할 고용노동청에 진정서를 제출하여 권리를 보장받으실 수 있습니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "주휴수당 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/job/holiday-allowance`,
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
    "name": "주휴수당 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/job/holiday-allowance`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        COMMON_BREADCRUMBS.HOLIDAY_ALLOWANCE
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="주휴수당 계산기" description="시급과 주간근로시간만 간편히 입력해 주휴수당 발생 여부와 정확한 수령액(주급, 월급)을 계산해보세요." position="top" />
            <HolidayAllowance />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💰</span> 주휴수당 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
                        근로기준법 제55조에 따라 사용자는 1주일에 평균 1회 이상의 유급휴일을 보장해야 합니다. 
                        법에서 정한 조건을 만족하는 근로자라면, 주휴수당은 반드시 지급되어야 하는 당당한 권리입니다.
                        미지급 시 임금체불에 해당되어 3년 이하 징역 또는 3천만원 이하 벌금(근로기준법 제109조)에 처해질 수 있습니다.
                    </p>
                    <div className="text-xs text-red-500/80 bg-red-50/50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg border border-red-100/50 dark:border-red-900/50 font-medium">
                        ※ 본 계산기는 근로기준법에 기반한 산식으로 제작되었으나 실제 지급되는 금액은 근로계약 체결 형태(개근 여부 등)에 따라 다소 다를 수 있습니다. 계산 결과를 참고자료로 활용하시고, 문제 발생 시 고용노동부에 정확한 해석을 문의하세요.
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>적용받는 시간당 시급을 입력하세요. (2025/2026년 최저시급은 10,320원입니다)</li>
                            <li>1주일간 계약되어 있는 실제로 근무하는 총 시간을 입력합니다.</li>
                            <li>빠른 시간 입력 버튼을 눌러 자주 지정되는 알바 스케줄을 손쉽게 세팅할 수 있습니다.</li>
                            <li>[계산하기] 버튼을 누르면 받을 수 있는 주휴수당 및 통장 입금 총액이 도출됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">시급 10,320원 / 1주 20시간 개근</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">
                                  주휴수당 발생 대상 (4시간치 시급 인정!)<br/>
                                  근로수당 + 주휴수당 = 주급 총액 약 247,680원
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">시급 10,320원 / 1주 14시간 개근</p>
                                <p className="font-bold text-red-500 dark:text-red-400">조건 미달 (15시간 미만)<br/>주휴수당 발생 안함 (근로수당만 수령)</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📌</span> 쪼개기 알바 주의사항
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>일주일 근로시간이 15시간 미만인 경우(초단시간 근로자) 주휴수당 지급 대상에서 제외됩니다.</li>
                            <li>이를 악용하여 주 14.5시간 등으로 쪼개서 계약하는 경우가 있으니 근로계약 시 반드시 소정근로시간을 확인하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🎯</span> 지각이나 조퇴 시에는?
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>'결근'이 아닌 지각이나 조퇴를 했더라도 '출근'을 했다면 개근으로 인정되어 주휴수당이 발생합니다.</li>
                            <li>다만, 지각이나 조퇴로 인해 일하지 못한 시간만큼의 임금(시급)은 공제될 수 있습니다.</li>
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
