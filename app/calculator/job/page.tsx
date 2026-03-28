import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "직장 계산기 | 연봉, 퇴직금, 실업급여 계산기 모음 - JIKO 계산기",
    description: "내 연봉/실수령액은 얼마일까? 퇴직금과 실업급여는? 일상 생활에 꼭 필요한 급여, 세금, 실업급여 계산기를 2025년 최신 기준으로 이용하세요.",
    keywords: ["직장 계산기", "연봉 계산기", "월급 계산기", "실수령액 계산기", "퇴직금 계산기", "실업급여 계산기", "세금 계산기", "JIKO 계산기"],
};

const jobCalculators = [
    {
        title: "💸 연봉/월급 계산기",
        description: "2025년 최신 세율을 반영하여 내 연봉이나 월급의 정확한 세금과 실수령액을 계산합니다.",
        href: "/calculator/job/salary",
    },
    {
        title: "💰 실수령액 계산기",
        description: "목표로 하는 한 달 실수령액을 받기 위해 필요한 세전 계약 연봉과 월급을 찾아드립니다.",
        href: "/calculator/job/net-pay",
    },
    {
        title: "💼 퇴직금 계산기",
        description: "2025년 최신 산정 기준을 반영하여 근속 연수와 평균임금을 기반으로 정확한 퇴직금을 계산해드립니다.",
        href: "/calculator/job/severance-pay",
    },
    {
        title: "📑 실업급여 계산기",
        description: "2025년 고용보험법 개정 기준을 반영하여 예상 수급액과 지급 기간을 정확하게 산출해드립니다.",
        href: "/calculator/job/unemployment-benefit",
    },
    {
        title: "🛡️ 4대보험 계산기",
        description: "국민연금, 건강보험, 고용보험, 산재보험 중 나와 회사가 각각 부담하는 금액의 비율을 시각화하여 파악하세요.",
        href: "/calculator/job/insurance",
    },
];

export default function JobHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title="직장 계산기" description="직장 계산기 | 연봉, 실수령액, 퇴직금, 실업급여 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-4xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💼 직장 계산기</h1>
                <p className="text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">필요한 직장 계산기를 선택하세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {jobCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                                    {calc.description}
                                </p>
                                <div className="flex items-center text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    지금 바로 계산하기
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 직장 계산기 안내</h2>
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
            </div>
        </main>
    );
}

