import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "직장 계산기 | 연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기 - JIKO 계산기",
    description: "연봉, 월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차를 한곳에서 계산할 수 있습니다. 직장 생활에 필요한 금액을 간편하게 확인해보세요.",
    keywords: ["직장 계산기", "연봉 계산기", "월급 계산기", "실수령액 계산기", "퇴직금 계산기", "실업급여 계산기", "4대보험 계산기", "주휴수당 계산기", "연차 계산기", "연차수당 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 직장 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/job`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "2025년 최신 세율이 반영되어 있나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, JIKO 직장 계산기는 매년 바뀌는 국민연금, 건강보험 등 4대보험 요율과 소득세법 개정안을 즉시 업데이트하여 정확한 결과를 제공합니다."
            }
        },
        {
            "@type": "Question",
            name: "실수령액을 기준으로 연봉을 역산할 수 있나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, 실수령액 계산기를 통해 내가 받고 싶은 월 실수령액을 입력하면 그에 필요한 세전 연봉과 월급을 즉시 확인하실 수 있습니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "직장 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/job`,
    "description": metadata.description as string
};

const jobCalculators = [
    {
        title: "💸 연봉/월급 계산기",
        description: "2025년 최신 세율을 반영하여 내 연봉이나 월급의 정확한 세금과 실수령액을 계산해드립니다.",
        href: "/calculator/job/salary",
    },
    {
        title: "💰 실수령액 계산기",
        description: "목표로 하는 한 달 실수령액을 받기 위해 필요한 세전 계약 연봉과 월급을 계산해드립니다.",
        href: "/calculator/job/net-pay",
    },
    {
        title: "💼 퇴직금 계산기",
        description: "2025년 최신 산정 기준을 반영하여 근속 연수와 평균임금을 기반으로 정확한 퇴직금을 계산해드립니다.",
        href: "/calculator/job/severance-pay",
    },
    {
        title: "📑 실업급여 계산기",
        description: "2025년 고용보험법 개정 기준을 반영하여 예상 수급액과 지급 기간을 정확하게 계산해드립니다.",
        href: "/calculator/job/unemployment-benefit",
    },
    {
        title: "🛡️ 4대보험 계산기",
        description: "국민연금, 건강보험, 고용보험, 산재보험 중 나와 회사가 부담하는 금액을 시각화하여 계산해드립니다.",
        href: "/calculator/job/insurance",
    },
    {
        title: "🏖️ 주휴수당 계산기",
        description: "시급과 주간근로시간만 입력하여 주휴수당 발생 여부 및 정확한 월급/주급을 계산해드립니다.",
        href: "/calculator/job/holiday-allowance",
    },
    {
        title: "🌴 연차 계산기",
        description: "입사일 및 회계기준별 예상 연차 발생일수를 자동으로 계산하고 미사용 연차수당을 계산해드립니다.",
        href: "/calculator/job/annual",
    },
];

export default function JobHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="직장 계산기" description="연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기 모음 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💼 직장 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기를 통해 나의 현재 상황을 점검하세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {jobCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block h-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex items-center justify-center text-center">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-keep px-2">
                                    {calc.title}
                                </h3>
                                <p className="sr-only">{calc.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            JIKO 직장 계산기만의 특징
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">🗓️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">2025년 최신 요율 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">매년 바뀌는 국민연금, 건보료 등 4대보험 요율을 즉시 업데이트하여 정확한 결과를 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-xl">🎯</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">목표 중심의 역산기</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">단순 계산을 넘어, 내가 원하는 실수령액을 받기 위해 필요한 연봉을 찾아주는 협사용 도구를 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0 text-xl">📋</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">복잡한 세액 산출 자동화</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">부양가족, 비과세 항목 등 까다로운 조건을 클릭 몇 번으로 간편하게 설정하고 확인하세요.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">🔗</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">상호 연동 검색 편의성</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">연봉과 실수령액 계산기를 하나로 묶어, 필요한 정보를 끊김 없이 탐색할 수 있는 인터페이스를 제공합니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        직장 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 직장 계산기는 연봉, 월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차까지 직장 생활에서 꼭 필요한 계산을 한곳에서 확인할 수 있는 페이지입니다. 복잡한 급여 구조를 쉽게 이해하고, 실제 받게 될 금액을 미리 예상하는 데 도움을 줍니다.</p>
                        <p>• 연봉과 월급 계산을 통해 급여 체계를 바꿔서 비교할 수 있고, 실수령액 계산기로 세금과 보험료를 반영한 실제 수령 금액을 확인할 수 있습니다. 퇴직금이나 실업급여처럼 상황에 따라 조건이 달라지는 항목도 간편하게 계산할 수 있어 실무적으로 유용합니다.</p>
                        <p>• 직장 계산기는 회사원, 아르바이트생, 이직 준비자 모두에게 필요한 정보를 제공합니다. 급여 협상, 근로 조건 확인, 퇴직 후 예상 금액 파악 등 다양한 상황에서 활용할 수 있는 실용적인 계산기입니다.</p>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        이런 경우 사용하세요
                    </h2>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>연봉 협상 전 실제 실수령액이 궁금할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>이직을 고민하며 급여 조건을 비교할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>퇴직 전 예상 퇴직금을 미리 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>실업급여 수급 금액을 예상해보고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주휴수당이나 연차 발생 기준이 궁금할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>4대보험 공제 금액을 확인하고 싶을 때</span>
                        </li>
                    </ul>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        자주 묻는 질문
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 실수령액은 왜 연봉보다 적은가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 소득세와 지방세, 그리고 4대보험 공제 금액이 포함되기 때문입니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 퇴직금은 언제부터 받을 수 있나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 일반적으로 1년 이상 근무 시 지급 대상이 됩니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 실업급여는 누구나 받을 수 있나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 고용보험 가입 기간과 퇴사 사유 등에 따라 수급 여부가 결정됩니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 주휴수당은 어떤 경우에 지급되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 일정 근무시간을 충족한 근로자에게 지급됩니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 연차는 자동으로 발생하나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 근로기준법에 따라 근속 기간에 따라 발생합니다.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 급여 및 수급 금액과 차이가 있을 수 있습니다. 정확한 정보는 고용노동부 또는 관련 기관의 안내를 확인하시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 직장 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
                        <Link href="/calculator/job/salary" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            💸 연봉/월급 계산하기 →
                        </Link>
                        <Link href="/calculator/job/net-pay" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            💰 실수령액 계산하기 →
                        </Link>
                        <Link href="/calculator/job/severance-pay" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            💼 퇴직금 계산하기 →
                        </Link>
                        <Link href="/calculator/job/unemployment-benefit" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            📑 실업급여 계산하기 →
                        </Link>
                        <Link href="/calculator/job/insurance" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            🛡️ 4대보험 계산하기 →
                        </Link>
                        <Link href="/calculator/job/holiday-allowance" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            🏖️ 주휴수당 계산하기 →
                        </Link>
                        <Link href="/calculator/job/annual" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                            🌴 연차 계산하기 →
                        </Link>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        더 많은 계산기가 필요하신가요?
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 7가지 카테고리에서 찾고 있는 계산기를 모두 만나보세요. JIKO는 일상에서 필요한 모든 계산을 한곳에서 제공하는 계산 플랫폼입니다.
                    </p>
                    <Link href="/calculator" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition">
                        🧮 전체 계산기 보기
                    </Link>
                </section>
                <InstallBanner />
            </div>
        </main>
    );
}

