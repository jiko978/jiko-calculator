import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "금융 계산기 | 대출 이자, 예금 이자, 적금 이자, 복리, 중도상환수수료 계산기 - JIKO 계산기",
    description: "대출 이자, 예금 이자, 적금 이자, 중도상환수수료를 쉽게 계산할 수 있는 금융 계산기입니다. 이자와 상환 금액을 빠르게 확인하고 금융 계획을 세워보세요.",
    keywords: ["금융 계산기", "대출 이자 계산기", "예금 이자 계산기", "적금 이자 계산기", "복리 계산기", "중도상환수수료 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 금융 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/finance`,
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
            name: "예적금 이자 계산 시 세금이 반영되나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, 일반과세(15.4%), 세금우대, 비과세 등 다양한 과세 유형을 선택하여 실제 수령하시는 세후 금액을 정확히 확인하실 수 있습니다."
            }
        },
        {
            "@type": "Question",
            name: "대출 상환 방식을 비교해볼 수 있나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, 원리금균등, 원금균등, 만기일시 상환 방식별 월 납입액과 총 이자 비용을 한눈에 비교할 수 있도록 시각화된 데이터와 차트를 제공합니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "금융 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/finance`,
    "description": metadata.description as string
};

const financeCalculators = [
    {
        title: "📊 대출 이자 계산기",
        description: "원리금균등, 원금균등 등 상환 방식에 따른 월 납입액과 총 이자를 계산합니다.",
        href: "/calculator/finance/loans",
    },
    {
        title: "🏦 예금 이자 계산기",
        description: "목돈을 예치했을 때 만기 시 받을 수 있는 이자와 수령액을 계산합니다.",
        href: "/calculator/finance/deposits",
    },
    {
        title: "💰 적금 이자 계산기",
        description: "매월 일정 금액을 저축하여 만기 시 받을 수 있는 이자와 수령액을 계산합니다.",
        href: "/calculator/finance/savings",
    },
    {
        title: "📈 복리 계산기",
        description: "적립식 투자의 미래가치, 필요기간, 목표수익률, 월 적립액을 4-in-1으로 계산합니다.",
        href: "/calculator/finance/compound-interest",
    },
    {
        title: "💸 중도상환수수료 계산기",
        description: "대출금을 미리 갚을 때 발생하는 수수료를 계산하고 이자 절감액을 비교합니다.",
        href: "/calculator/finance/prepayment",
    },
];

export default function FinanceHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="금융 계산기" description="대출 이자, 예금 이자, 적금 이자, 복리 계산기, 중도상환수수료 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💵 금융 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">대출/예금/적금 이자 계산기를 통해 간편하게 금융 계획을 세워보세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {financeCalculators.map((calc) => (
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
                            JIKO 금융 계산기만의 특징
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">🏙️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">정확한 법정 이율 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">이자소득세(15.4%) 및 세금우대 세율을 정확히 반영하여 실수령액을 보여줍니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">📉</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">시각화 차트 제공</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">원금과 이자 비중을 한눈에 파악할 수 있는 다이내믹 차트를 제공합니다.</p>
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력하신 모든 금융 정보는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        금융 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 금융 계산기는 대출, 예금, 적금처럼 일상에서 자주 접하는 금융 상품의 이자와 상환 금액을 쉽고 빠르게 계산할 수 있는 페이지입니다. 복잡한 금융 계산식을 직접 입력하지 않아도, 원하는 조건에 맞춰 예상 금액을 손쉽게 확인할 수 있습니다.</p>
                        <p>• 대출 이자 계산기는 원금과 금리, 상환 기간에 따라 매달 부담해야 하는 금액과 총 이자를 확인하는 데 유용합니다. 예금과 적금 이자 계산기는 목돈 마련이나 자산 관리 계획을 세울 때 필요한 예상 수익을 비교하는 데 도움이 됩니다.</p>
                        <p>• 금융 계산기는 단순한 숫자 계산을 넘어, 내 상황에 맞는 금융 계획을 세우는 데 필요한 정보를 제공합니다. 대출을 알아보는 사람부터 저축 목표를 설정하는 사람까지 누구나 편리하게 활용할 수 있습니다.</p>
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
                            <span>대출을 받기 전 월 상환액이 궁금할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>금리 변화에 따른 이자 부담을 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>여러 대출 상품을 비교하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>예금이나 적금의 실제 수익을 미리 계산하고 싶을 때</span>
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
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 금융 계산기를 사용하기 위해 별도의 가입이나 로그인이 필요한가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 아니요, 금융 계산기는 별도의 회원가입이나 로그인 없이 누구나 무료로 이용하실 수 있습니다. 원하시는 계산기를 선택하여 바로 사용해보세요.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 계산 결과에 적용되는 금리는 실시간으로 반영되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 네, 금융 계산기는 최신 기준의 법정 이율과 세금을 반영하여 실시간으로 결과를 제공합니다. 다만, 실제 금융 기관의 상품 조건과 차이가 있을 수 있으니 참고용으로 활용하시기 바랍니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 입력한 금융 정보가 서버에 저장되나요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 아니요, 개인정보 보호를 위해 입력하신 모든 데이터는 서버에 저장되지 않고 브라우저 내에서만 처리됩니다.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 금융 상품의 조건에 따라 달라질 수 있습니다. 정확한 조건은 금융기관의 상품 안내를 반드시 확인하시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 금융 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Link href="/calculator/finance/loans" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                            📊 대출 이자 계산하기 →
                        </Link>
                        <Link href="/calculator/finance/deposits" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                            🏦 예금 이자 계산하기 →
                        </Link>
                        <Link href="/calculator/finance/savings" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                            💰 적금 이자 계산하기 →
                        </Link>
                        <Link href="/calculator/finance/compound-interest" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                            📈 복리 계산하기 →
                        </Link>
                        <Link href="/calculator/finance/prepayment" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                            💸 중도상환수수료 계산하기 →
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
