import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "금융 계산기 | 대출 이자, 예금 이자, 적금 이자 계산기 - JIKO 계산기",
    description: "목돈 마련을 위한 예금/적금/대출 이자 계산부터 대출 상환 계획까지, JIKO의 금융 계산기로 스마트한 자산 관리를 시작해보세요.",
    keywords: ["금융 계산기", "대출 이자 계산기", "예금 이자 계산기", "적금 이자 계산기"],
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
];

export default function FinanceHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        { name: "금융 계산기", item: "https://jiko.kr/calculator/finance" }
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="금융 계산기" description="대출 이자, 예금 이자, 적금 이자 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💵 금융 계획 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">대출/예금/적금 이자 계산기를 통해 간편하게 금융 계획을 세워보세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {financeCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {calc.title}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 flex-grow">
                                    {calc.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 금융 계산기만의 특징</h2>
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
                <InstallBanner />
            </div>
        </main>
    );
}
