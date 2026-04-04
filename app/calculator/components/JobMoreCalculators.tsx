'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JobMoreCalculators() {
    const pathname = usePathname();

    const CALCULATORS = [
        { name: "연봉/월급 계산기", href: "/calculator/job/salary", emoji: "💸", description: "2025 최신 4대보험 반영 연봉/월급 실수령액" },
        { name: "실수령액 계산기", href: "/calculator/job/net-pay", emoji: "💰", description: "2025 최신 4대보험 반영 연봉/월급 실수령액" },
        { name: "퇴직금 계산기", href: "/calculator/job/severance-pay", emoji: "💼", description: "2025 최신 4대보험 반영 퇴직금 실수령액" },
        { name: "실업급여 계산기", href: "/calculator/job/unemployment-benefit", emoji: "📑", description: "2025 최신 4대보험 반영 실업급여 실수령액" },
        { name: "4대보험 계산기", href: "/calculator/job/insurance", emoji: "🛡️", description: "근로자 사업주 분담 4대보험 내역 추출" },
        { name: "주휴수당 계산기", href: "/calculator/job/holiday-allowance", emoji: "🏖️", description: "1주일 개근 시 주휴수당 발생액 계산" },
        { name: "연차 계산기", href: "/calculator/job/annual", emoji: "🏖️", description: "입사일 기준 연차 발생 및 수당 계산" },
    ];

    const otherCalculators = CALCULATORS.filter((calc) => !pathname.includes(calc.href));

    if (otherCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                다른 직장 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-[24px] border border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{calc.emoji}</span>
                        <div>
                            <p className="font-black text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm mb-1">{calc.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-tight">{calc.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

