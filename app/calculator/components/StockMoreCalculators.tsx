"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = [
    { name: "평균 단가", href: "/calculator/stock/avg-price", emoji: "📈" },
    { name: "수익률", href: "/calculator/stock/profit-rate", emoji: "💰" },
    { name: "배당금", href: "/calculator/stock/dividend", emoji: "💸" },
    { name: "수수료", href: "/calculator/stock/fee", emoji: "📊" },
];

export default function StockMoreCalculators() {
    const pathname = usePathname();

    // 현재 페이지를 제외한 나머지 계산기 필터링
    const otherCalculators = CALCULATORS.filter(calc => !pathname.includes(calc.href));

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                📂 주식 계산기 더 보기
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-700 transition-all active:scale-95 group font-semibold text-gray-700 dark:text-gray-300"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">{calc.emoji}</span>
                        <span>{calc.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
