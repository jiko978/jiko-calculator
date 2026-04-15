import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "세금 계산기 | 부가세, 양도소득세, 부동산 세금 계산기 - JIKO 계산기",
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
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="세금 계산기" description="부가세, 양도/취득세, 재산세, 자동차세 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">🧾 세금 절세 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">부가세, 양도소득세, 취득세, 재산세, 종합부동산세, 자동차세를 쉽고 빠르게 계산해보세요.</p>

                <div className="grid gap-4 w-full max-w-3xl mx-auto md:grid-cols-2">
                    {taxCalculators.map((calc) => (
                        <Link
                            key={calc.title}
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
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 세금 계산기만의 장점</h2>
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
                <InstallBanner />
            </div>
        </main>
    );
}
