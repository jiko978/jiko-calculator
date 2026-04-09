"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const RealEstateMoreCalculators = () => {
    const pathname = usePathname();

    const calculators = [
        { name: "DSR 계산기", href: "/calculator/real-estate/dsr", emoji: "📊", description: "부채상환비율 및 한도 시나리오 분석" },
        { name: "신DTI 계산기", href: "/calculator/real-estate/new-dti", emoji: "🏢", description: "다주택자 한도 규제 및 보수적 한도 시뮬레이션" },
        { name: "DTI 계산기", href: "/calculator/real-estate/dti", emoji: "📉", description: "소득 대비 부채 상환 능력 정밀 계산" },
    ];

    const filteredCalculators = calculators.filter(calc => pathname !== calc.href && !pathname.startsWith(`${calc.href}/`));

    if (filteredCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
                다른 부동산 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-[24px] border border-gray-100 dark:border-gray-800 hover:border-green-400 dark:hover:border-green-500 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{calc.emoji}</span>
                        <div>
                            <p className="font-black text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 text-sm mb-1">{calc.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-tight">{calc.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RealEstateMoreCalculators;
