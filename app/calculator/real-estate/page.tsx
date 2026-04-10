import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "부동산 계산기 | DSR, DTI, 신DTI, LTV 등 부동산 대출 및 세금 계산기 - JIKO",
    description: "내 집 마련의 시작! DSR 대출 한도 계산부터 DTI, 신DTI, 중도상환수수료까지 부동산 투자와 대출에 필요한 모든 계산기를 JIKO에서 만나보세요.",
    keywords: ["부동산계산기", "DSR계산기", "DTI계산기", "신DTI계산기", "LTV계산기", "대출한도"]
};

const realEstateCalculators = [
    {
        title: "📊 DSR 계산기",
        description: "최신 스트레스 DSR 규제 반영한 대출 한도 분석 및 시뮬레이션을 해보세요.",
        href: "/calculator/real-estate/dsr",
        status: "ACTIVE"
    },
    {
        title: "🏢 신DTI 계산기",
        description: "다주택자 한도 규제 및 보수적 한도 산정 기준을 적용한 정밀 한도 시뮬레이션.",
        href: "/calculator/real-estate/new-dti",
        status: "ACTIVE"
    },
    {
        title: "📉 DTI 계산기",
        description: "소득 대비 부채 상환 능력을 정밀하게 계산하고 추가 대출 여력을 확인하세요.",
        href: "/calculator/real-estate/dti",
        status: "ACTIVE"
    },
    {
        title: "🏠 LTV 계산기",
        description: "주택 담보 가치 대비 대출 가능한 한도를 규제 지역별로 확인하세요.",
        href: "/calculator/real-estate/ltv",
        status: "ACTIVE"
    },
];

export default function RealEstateHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "부동산 계산기", item: "https://jiko.kr/calculator/real-estate" }
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title="부동산 계산기" description="DSR, DTI, 신DTI, 대출 한도 계산기 - JIKO" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">🏢 부동산 계획 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">성공적인 내 집 마련을 위한 대출 한도 및 세금을 미리 확인해보세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {realEstateCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.status === "ACTIVE" ? calc.href : "#"}
                            className={`group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 ${calc.status === "ACTIVE" ? "hover:shadow-xl hover:-translate-y-1" : "opacity-60 cursor-not-allowed filter grayscale"}`}
                        >
                            <div className="h-full flex flex-col">
                                <h3 className={`text-lg font-bold mb-2 transition-colors ${calc.status === "ACTIVE" ? "text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400" : "text-gray-400"}`}>
                                    {calc.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                                    {calc.description}
                                </p>
                                {calc.status === "ACTIVE" ? (
                                    <div className="flex items-center text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        지금 바로 계산하기
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="text-[10px] uppercase font-black text-gray-300 tracking-widest">준비 중입니다</div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 부동산 계산기만의 특징</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-xl">🏛️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">최신 금융 규제 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">금융당국의 최신 DSR 및 스트레스 DSR 정책을 실시간으로 반영하여 계산합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">🏗️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">전문가 자문 로직</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">시중은행 부담보 대출 담당자의 자문을 통해 설계된 고도화된 연산 로직을 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-xl">⚖️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">다양한 시나리오 분석</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">지역별 가산 금리와 단계별 변수 조정을 통해 최적의 대출 한도를 진단합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">📱</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">현장 맞춤형 인터페이스</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입률이 간편하고 결과가 직관적인 디자인으로 현장에서 즉시 활용이 가능합니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </main>
    );
}
