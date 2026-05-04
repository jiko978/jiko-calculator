"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = [
    { name: "비만도 계산기", href: "/calculator/health/bmi", emoji: "⚖️", description: "체질량지수를 통한 비만도 진단" },
    { name: "배란일 계산기", href: "/calculator/health/ovulation", emoji: "📅", description: "가임기 및 배란일 예측" },
    { name: "기초대사량 계산기", href: "/calculator/health/bmr", emoji: "🔥", description: "숨만 쉬어도 소모되는 칼로리" },
    { name: "임신주수 계산기", href: "/calculator/health/pregnancy", emoji: "👶", description: "출산 예정일 및 임신 주수 산정" },
    { name: "칼로리 계산기", href: "/calculator/health/calorie", emoji: "🏃‍♂️", description: "활동량에 따른 일일 권장 칼로리" },
];

export default function HealthMoreCalculators() {
    const pathname = usePathname();
    const otherCalculators = CALCULATORS.filter(calc => !pathname.includes(calc.href));

    if (otherCalculators.length === 0) return null;

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                다른 건강 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {otherCalculators.map((calc) => (
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
}
