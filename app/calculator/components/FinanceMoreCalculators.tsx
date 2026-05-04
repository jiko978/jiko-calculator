"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FinanceMoreCalculators = () => {
    const pathname = usePathname();

    const calculators = [
        { name: "퍼센트 계산기", href: "/calculator/finance/percentage", emoji: "💯", description: "비율, 할인율, 수익률 자동 연산" },
        { name: "대출 이자 계산기", href: "/calculator/finance/loans", emoji: "📊", description: "이자 및 원리금 상환 계산" },
        { name: "예금 이자 계산기", href: "/calculator/finance/deposits", emoji: "🏦", description: "만기 수령액 및 이자 계산" },
        { name: "적금 이자 계산기", href: "/calculator/finance/savings", emoji: "💰", description: "목돈 마련을 위한 적립 계산" },
        { name: "복리 계산기", href: "/calculator/finance/compound-interest", emoji: "📈", description: "미래가치, 필요기간, 목표수익률, 월적립액 계산" },
        { name: "중도상환수수료 계산기", href: "/calculator/finance/prepayment", emoji: "💸", description: "대출 상환 비용 및 이자 절감액 비교" }
    ];

    const filteredCalculators = calculators.filter(calc => pathname !== calc.href && !pathname.startsWith(`${calc.href}/`));

    if (filteredCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-amber-600 rounded-full"></span>
                다른 금융 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-[24px] border border-gray-100 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{calc.emoji}</span>
                        <div>
                            <p className="font-black text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 text-sm mb-1">{calc.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-tight">{calc.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FinanceMoreCalculators;
