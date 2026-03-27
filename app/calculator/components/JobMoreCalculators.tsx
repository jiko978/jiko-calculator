'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JobMoreCalculators() {
    const pathname = usePathname();

    const CALCULATORS = [
        { name: "연봉/월급 계산기", href: "/calculator/job/salary", emoji: "💸", description: "2025 최신 4대보험 반영 연봉/월급 실수령액" },
        { name: "실수령액 계산기", href: "/calculator/job/net-pay", emoji: "💰", description: "2025 최신 4대보험 반영 연봉/월급 실수령액" },
        { name: "퇴직금 계산기", href: "/calculator/job/severance-pay", emoji: "💼", description: "2025 최신 4대보험 반영 퇴직금 실수령액" },
        { name: "실업급여 계산기", href: "/calculator/job/unemployment-benefit", emoji: "💡", description: "2025 최신 4대보험 반영 실업급여 실수령액" }
    ];

    // 현재 페이지는 제외하고 다른 계산기 보여주기
    const otherCalculators = CALCULATORS.filter((calc) =>  !pathname.includes(calc.href));

    if (otherCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-blue-500">📎</span> 직장 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform shrink-0">{calc.emoji}</span>
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                                {calc.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                {calc.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

