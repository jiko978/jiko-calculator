"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TaxMoreCalculators = () => {
    const pathname = usePathname();

    const calculators = [
        { name: "부가세 계산기", href: "/calculator/tax/vat", emoji: "🧾", description: "부가세액 및 공급가액 양방향 자동 계산" },
        { name: "양도소득세 계산기", href: "/calculator/tax/capital-gains", emoji: "🏠", description: "양도차익 및 비과세/중과세 모의 계산" },
        { name: "취득세 계산기", href: "/calculator/tax/acquisition", emoji: "🔑", description: "부동산 취득 시 예상 부과세액 자동 산출" },
        { name: "자동차세 계산기", href: "/calculator/tax/car", emoji: "🚗", description: "차종별 세금 및 차령/연납 할인 혜택 산출" },
        { name: "재산세 계산기", href: "/calculator/tax/property", emoji: "📄", description: "보유 자산별 재산세 예상 고지액 산출" },
        { name: "종부세 계산기", href: "/calculator/tax/comprehensive", emoji: "🏛️", description: "종합부동산세 및 다주택/노후 공제 계산" },
    ];

    const filteredCalculators = calculators.filter(calc => pathname !== calc.href && !pathname.startsWith(`${calc.href}/`));

    if (filteredCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                다른 세금 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCalculators.map((calc) => (
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
};

export default TaxMoreCalculators;
