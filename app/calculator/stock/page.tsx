import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "주식 계산기 | 주식 물타기, 수익률, 수수료, 배당금 계산기 - JIKO 계산기",
    description: "주식 물타기, 수익률, 수수료, 배당금을 계산할 수 있는 주식 계산기입니다. 실제 투자 성과와 예상 수익을 빠르게 확인해보세요.",
    keywords: ["주식 계산기", "주식 물타기 계산기", "주식 수익률 계산기", "주식 수수료 계산기", "주식 배당금 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 주식 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/stock`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "주식 물타기 계산 시 최대 몇 회까지 입력 가능한가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "JIKO 주식 물타기 계산기는 최대 10회까지 추가 매수 기록을 입력할 수 있어, 장기적인 분할 매수 상황에서도 정확한 평균 단가를 산출해 드립니다."
            }
        },
        {
            "@type": "Question",
            name: "해외 주식 수수료 및 세금도 계산되나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, 주식 수수료 계산기를 통해 국내뿐만 아니라 해외 주식 거래 시 발생하는 매매 수수료와 양도소득세(22%) 등을 간편하게 시뮬레이션할 수 있습니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "주식 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/stock`,
    "description": metadata.description as string
};

const stockCalculators = [
    {
        title: "💧 주식 물타기 계산기",
        description: "물타기 시 주식 평균 매입 단가를 최대 10회에 걸쳐 간편하게 계산합니다.",
        href: "/calculator/stock/avg-price",
    },
    {
        title: "💰 주식 수익률 계산기",
        description: "매수가와 매도가를 입력해 수익률과 순이익을 간편하게 계산합니다.",
        href: "/calculator/stock/profit-rate",
    },
    {
        title: "💳️ 주식 수수료 계산기",
        description: "매매 수수료와 세금을 반영한 실제 거래 비용과 순이익을 계산합니다.",
        href: "/calculator/stock/fee",
    },
    {
        title: "💸 주식 배당금 계산기",
        description: "보유 주식수와 배당금을 입력하면 배당수익률 및 실수령액을 계산합니다.",
        href: "/calculator/stock/dividend",
    },
];

export default function StockHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="주식 계산기" description="주식 물타기, 수익률, 배당금, 수수료 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">📈 주식 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">주식 물타기(평단가), 수익률, 수수료, 배당금 계산기를 통해 투자 결과를 간편하고 빠르게 확인하세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {stockCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block h-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex items-center justify-center text-center">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-keep px-2">
                                    {calc.title}
                                </h3>
                                <p className="sr-only">{calc.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            JIKO 주식 계산기만의 특징
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">📈</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">실전 투자 맞춤 계산</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">물타기·불타기 등 실제 투자 시나리오에 최적화된 계산 방식을 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">💸</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">세금 및 수수료 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">증권거래세와 매매 수수료를 반영한 실제 순이익을 계산해 드립니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">📱</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">모바일 최적화 UX</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">어떤 기기에서도 편리하게 입력하고 결과를 확인할 수 있는 반응형 디자인입니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-xl">🔒</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">개인정보 보호</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력하신 모든 투자 정보는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        주식 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 주식 계산기는 주식 투자 시 필요한 모든 계산을 한 곳에서 해결할 수 있는 종합 계산 도구입니다. 물타기(평균 단가), 수익률, 수수료, 배당금 계산을 통해 투자 성과를 정확하게 분석하고 미래 투자를 계획할 수 있습니다.</p>
                        <p>• 초보 투자자부터 숙련된 투자자까지 모두가 쉽게 사용할 수 있도록 직관적인 인터페이스를 제공합니다. 복잡한 계산 공식은 자동으로 처리되므로 투자에만 집중할 수 있습니다.</p>
                        <p>• 실제 투자 상황을 반영한 정확한 계산 결과를 통해 더 현명한 투자 결정을 내릴 수 있도록 도와줍니다.</p>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        이런 경우 사용하세요
                    </h2>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주식 물타기 시 평균 매입 단가를 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주식 매도 시 예상 수익률과 순이익을 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주식 거래 수수료와 세금을 포함한 실제 비용을 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주식 배당금 수익률과 실수령액을 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>포트폴리오 전체 수익률을 분석하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주식 투자 전략을 세우기 위한 시뮬레이션을 하고 싶을 때</span>
                        </li>
                    </ul>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        자주 묻는 질문
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 주식 물타기 계산 시 최대 몇 회까지 입력 가능한가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. JIKO 주식 물타기 계산기는 최대 10회까지 추가 매수 기록을 입력할 수 있어, 장기적인 분할 매수 상황에서도 정확한 평균 단가를 산출해 드립니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 해외 주식 수수료 및 세금도 계산되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 네, 주식 수수료 계산기를 통해 국내뿐만 아니라 해외 주식 거래 시 발생하는 매매 수수료와 양도소득세(22%) 등을 간편하게 시뮬레이션할 수 있습니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 배당금 계산 시 세금은 어떻게 반영되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 배당금 계산 시 배당소득세(15.4%)를 자동으로 차감하여 실수령액을 계산해 드립니다. 다만 세율은 투자자의 상황에 따라 달라질 수 있으니 참고용으로 활용해 주세요.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 투자 결과와 차이가 있을 수 있습니다. 주식 투자는 원금 손실의 위험이 있으니 신중하게 결정하시기 바랍니다. 정확한 세금 계산을 위해서는 세무 전문가의 상담을 받으시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 주식 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
                        <Link href="/calculator/stock/avg-price" className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition">
                            💧 물타기 계산하기 →
                        </Link>
                        <Link href="/calculator/stock/profit-rate" className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition">
                            💰 수익률 계산하기 →
                        </Link>
                        <Link href="/calculator/stock/fee" className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition">
                            💳 수수료 계산하기 →
                        </Link>
                        <Link href="/calculator/stock/dividend" className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition">
                            💸 배당금 계산하기 →
                        </Link>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        더 많은 계산기가 필요하신가요?
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 7가지 카테고리에서 찾고 있는 계산기를 모두 만나보세요. JIKO는 일상에서 필요한 모든 계산을 한곳에서 제공하는 계산 플랫폼입니다.
                    </p>
                    <Link href="/calculator" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition">
                        🧮 전체 계산기 보기
                    </Link>
                </section>

                <InstallBanner />
            </div>
        </main>
    );
}