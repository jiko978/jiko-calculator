import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "세금 계산기 | 부가세, 양도소득세, 취득세, 자동차세, 재산세, 종합부동산세 계산기 - JIKO 계산기",
    description: "어려운 세금 계산을 쉽고 정확하게! 부가가치세, 양도소득세, 취득세, 재산세, 종합부동산세, 자동차세 계산 결과를 즉시 확인하세요.",
    keywords: ["세금 계산기", "부가세 계산기", "양도소득세 계산기", "취득세 계산기", "종부세 계산기", "재산세 계산기", "자동차세 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 세금 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/tax`,
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
            name: "매년 바뀌는 세법이 적용되나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, JIKO 세금 계산기는 매년 최신 세법 개정안(세율, 공제 한도, 비과세 요건 등)을 반영하여 정확한 산출 결과를 제공합니다."
            }
        },
        {
            "@type": "Question",
            name: "다주택자 중과세도 계산 가능한가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "가능합니다. 취득세 및 양도소득세 계산 시 조정대상지역 여부와 주택 수를 선택하시면 다주택자 중과세율이 자동으로 적용됩니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "세금 계산기 모음",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/tax`,
    "description": metadata.description as string
};

const taxCalculators = [
    {
        title: "🧾 부가세 계산기",
        description: "합계금액에서 부가세(10%)와 공급가액을 역산/순산합니다. 간이과세자 업종별 요율도 지원합니다.",
        href: "/calculator/tax/vat",
    },
    {
        title: "🏠 양도소득세 계산기",
        description: "부동산 매도 시 발생하는 양도차익에 대한 세금을 계산합니다. (1주택 비과세, 다주택 중과 판정)",
        href: "/calculator/tax/capital-gains",
    },
    {
        title: "🔑 취득세 계산기",
        description: "부동산 등 자산 취득 시 납부할 세금을 계산합니다. (생애최초 감면, 다주택 중과 반영)",
        href: "/calculator/tax/acquisition",
    },
    {
        title: "🚗 자동차세 계산기",
        description: "차종 및 배기량 기반으로 자동차세를 계산하고 연납 할인 및 차령 경감 혜택을 확인합니다.",
        href: "/calculator/tax/car",
    },
    {
        title: "📄 재산세 계산기",
        description: "공시가 및 공동명의 지분율에 따라 주택, 상가, 토지 등에 부과될 재산세 예상액을 계산합니다.",
        href: "/calculator/tax/property",
    },
    {
        title: "🏛️ 종부세 계산기",
        description: "종합부동산세 공제 혜택(1세대 1주택, 고령자/장기보유)을 반영하여 최종 납부액을 계산합니다.",
        href: "/calculator/tax/comprehensive",
    },
];

export default function TaxHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.TAX_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="세금 계산기" description="부가세, 양도소득세, 취득세, 자동차세, 재산세, 종합부동산세 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">🧾 세금 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">부가세, 양도소득세, 취득세, 자동차세, 재산세, 종합부동산세를 쉽고 빠르게 계산해보세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {taxCalculators.map((calc) => (
                        <Link
                            key={calc.title}
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
                            JIKO 세금 계산기만의 특징
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">👩‍⚖️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">최신 세법 자동 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">매년 개정되는 소득세율, 양도세 비과세 요건, 종부세 공제 한도 등을 신속하게 적용합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">💡</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">절세 시뮬레이션</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">공동명의 설정, 연납 신청 등 절세 팁을 선택하면 줄어드는 세금 폭을 바로 확인할 수 있습니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">📊</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">핵심 로직 시각화</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">복잡한 과세표준 도출 과정이나 세율 적용 구간을 차트 및 도표로 알기 쉽게 표시합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-xl">🔒</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">프라이버시 완벽 보호</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">재산 및 자산 정보는 서버로 전송되지 않으며 사용자 기기에서만 안전하게 계산됩니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        세금 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 세금 계산기는 부가세, 양도소득세, 취득세, 자동차세, 재산세, 종합부동산세처럼 헷갈리기 쉬운 세금을 손쉽게 계산할 수 있는 페이지입니다. 세금 부담을 미리 확인하고, 상황에 맞는 계획을 세우는 데 도움을 줍니다.</p>
                        <p>• 사업자에게는 부가세 계산이, 부동산 거래를 준비하는 사람에게는 양도소득세와 취득세 계산이 특히 중요합니다. 자동차세나 재산세, 종합부동산세처럼 정기적으로 발생하는 세금도 간편하게 계산할 수 있어 예상 비용을 미리 파악하기 좋습니다.</p>
                        <p>• 세금 계산기는 세금에 익숙하지 않은 사람도 쉽게 이해할 수 있도록 구성된 실용적인 도구입니다. 복잡한 세금 구조를 간단하게 정리해 주어, 보다 현실적인 재무 계획을 세울 수 있게 도와줍니다.</p>
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
                            <span>사업 수익에서 부가세를 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>부동산 매도 시 양도소득세를 미리 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>주택 취득 시 납부할 취득세를 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>자동차 보유세(자동차세)를 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>부동산 재산세를 미리 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>종합부동산세 납부액을 확인하고 싶을 때</span>
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
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 매년 바뀌는 세법이 적용되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 네, JIKO 세금 계산기는 매년 최신 세법 개정안(세율, 공제 한도, 비과세 요건 등)을 반영하여 정확한 산출 결과를 제공합니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 다주택자 중과세도 계산 가능한가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 가능합니다. 취득세 및 양도소득세 계산 시 조정대상지역 여부와 주택 수를 선택하시면 다주택자 중과세율이 자동으로 적용됩니다.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 세금과 차이가 있을 수 있습니다. 정확한 세액은 국세청 또는 세무 전문가의 상담을 받으시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 세금 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3">
                        <Link href="/calculator/tax/vat" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            🧾 부가세 계산하기 →
                        </Link>
                        <Link href="/calculator/tax/capital-gains" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            🏠 양도소득세 계산하기 →
                        </Link>
                        <Link href="/calculator/tax/acquisition" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            🔑 취득세 계산하기 →
                        </Link>
                        <Link href="/calculator/tax/car" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            🚗 자동차세 계산하기 →
                        </Link>
                        <Link href="/calculator/tax/property" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            📄 재산세 계산하기 →
                        </Link>
                        <Link href="/calculator/tax/comprehensive" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                            🏛️ 종부세 계산하기 →
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
