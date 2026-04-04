"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = [
    { name: "주식 물타기 계산기", href: "/calculator/stock/avg-price", emoji: "📈", description: "물타기/불타기 평균단가 계산" },
    { name: "주식 수익률 계산기", href: "/calculator/stock/profit-rate", emoji: "💰", description: "매수/매도가 기반 수익률 계산" },
    { name: "주식 배당금 계산기", href: "/calculator/stock/dividend", emoji: "💸", description: "주식 배당수익률 및 실수령액 계산" },
    { name: "주식 수수료 계산기", href: "/calculator/stock/fee", emoji: "💳️️", description: "거래 수수료/세금 반영 순이익 계산" },
];

export default function StockMoreCalculators() {
    const pathname = usePathname();
    const otherCalculators = CALCULATORS.filter(calc => !pathname.includes(calc.href));

    if (otherCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                다른 주식 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-[24px] border border-gray-100 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{calc.emoji}</span>
                        <div>
                            <p className="font-black text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm mb-1">{calc.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-tight">{calc.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
