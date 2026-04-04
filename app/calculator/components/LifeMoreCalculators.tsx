'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LifeMoreCalculators() {
    const pathname = usePathname();

    const CALCULATORS = [
        { name: "나이 계산기", href: "/calculator/life/age", emoji: "🎂", description: "만 나이, 연 나이, 띠 정보 및 생애 마일스톤" },
        { name: "날짜 계산기", href: "/calculator/life/date", emoji: "📅", description: "두 날짜 사이의 정확한 기간 및 일수 계산" },
        { name: "디데이 계산기", href: "/calculator/life/d-day", emoji: "🕯️", description: "목표일까지 남은 날짜 및 기념일 확인" },
        { name: "전역일 계산기", href: "/calculator/life/discharge-day", emoji: "🪖", description: "군별 전역일 계산 및 실시간 복무율 확인" }
    ];

    // 현재 페이지는 정확히 일치할 때 제외
    const otherCalculators = CALCULATORS.filter((calc) => pathname !== calc.href);

    if (otherCalculators.length === 0) return null;

    return (
        <section className="max-w-3xl mx-auto w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 mt-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                다른 생활 계산기도 확인해보세요!
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {otherCalculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="flex items-center gap-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800 transition-all group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    >
                        <span className="text-3xl group-hover:scale-110 transition-transform shrink-0 drop-shadow-sm">{calc.emoji}</span>
                        <div>
                            <p className="font-black text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm mb-1">
                                {calc.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-tight">
                                {calc.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
