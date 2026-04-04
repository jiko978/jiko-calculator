import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "생활 계산기 | 나이, 디데이, 날짜, 전역일 계산기 모음 - JIKO 계산기",
    description: "내 정확한 만 나이는? 중요한 기념일까지 며칠 남았을까? 나이 계산부터 디데이, 날짜 수 계산, 군대 전역일 확인까지 일상에 꼭 필요한 생활 계산기를 만나보세요.",
    keywords: ["생활 계산기", "나이 계산기", "만 나이 계산기", "디데이 계산기", "날짜 계산기", "전역일 계산기", "군대 계산기", "JIKO 계산기"],
};

const lifeCalculators = [
    {
        title: "🎂 나이 계산기",
        description: "정확한 만 나이와 연 나이를 계산하고, 투표권 발생일 등 법적 나이 기준을 확인해드립니다.",
        href: "/calculator/life/age",
    },
    {
        title: "🕯️ 디데이 계산기",
        description: "커플 기념일, 시험일 등 중요한 날까지 남은 기간을 계산하거나 특정 일수 전후의 날짜를 찾아드립니다.",
        href: "/calculator/life/d-day",
    },
    {
        title: "📅 날짜 계산기",
        description: "두 날짜 사이의 정확한 일수, 주수, 개월수를 계산하고 주요 기념일 타임라인을 제공합니다.",
        href: "/calculator/life/date",
    },
    {
        title: "🪖 전역일 계산기",
        description: "입대일만 입력하면 군별 복무 기간을 반영하여 전역일과 실시간 복무율, 진급일을 알려드립니다.",
        href: "/calculator/life/discharge-day",
    },
];

export default function LifeHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title="생활 계산기" description="일상의 숫자를 명확하게 | 나이, 디데이, 날짜, 전역일 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">🏠 생활 편의 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">나이, 디데이, 날짜, 전역일 계산기를 통해 일상 속 궁금한 날짜들을 간편하게 확인하세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {lifeCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                                    {calc.description}
                                </p>
                                <div className="flex items-center text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    지금 바로 계산하기
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 생활 계산기 안내</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">🎂</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">정확한 법적 나이 계산</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">만 나이 통일법 시행 이후 헷갈리는 나이 기준을 명확하게 짚어드립니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0 text-xl">🕯️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">기념일 자동 타임라인</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력한 날짜를 기준으로 100일, 1주년 등 주요 기념일을 자동으로 계산하여 보여줍니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">⚖️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">날짜 계산 원칙 적용</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">초일불산입 등 상황에 맞는 날짜 계산 방식을 설명과 함께 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">🪖</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">최신 병역 제도 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">각 군별 상이한 복무 기간을 최신 기준으로 반영하여 정확한 전역일을 산출합니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                <InstallBanner />
            </div>
        </main>
    );
}
