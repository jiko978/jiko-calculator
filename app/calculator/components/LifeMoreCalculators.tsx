'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LifeMoreCalculators() {
    const pathname = usePathname();

    const calculators = [
        {
            name: "연봉/월급 계산기",
            path: "/calculator/life/salary",
            icon: "💸",
            description: "2025 최신 4대보험 반영 연봉/월급",
        },
    ];

    // 현재 페이지는 제외하고 다른 계산기 보여주기
    const otherCalculators = calculators.filter((calc) => !pathname?.startsWith(calc.path));

    if (otherCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-blue-500">📎</span> 생활 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherCalculators.map((calc, index) => (
                    <Link
                        key={index}
                        href={calc.path}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all group"
                    >
                        <span className="text-2xl pt-1 bg-white dark:bg-gray-800 w-12 h-12 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                            {calc.icon}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {calc.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                {calc.description}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
