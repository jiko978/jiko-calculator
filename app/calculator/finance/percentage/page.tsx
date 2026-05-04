import { Metadata } from "next";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";
import Percentage from "./Percentage";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "퍼센트 계산기 | 비율, 할인율, 수익률 자동 연산 - JIKO 계산기",
    description: "4가지 다중 모드를 통해 비율 계산, 일부값 계산, 증감값 계산, 증감율 계산을 실시간으로 빠르게 확인하세요. 일상 속 쇼핑 할인율부터 주식 투자 수익률까지 완벽하게 계산해 드립니다.",
    keywords: ["퍼센트 계산기", "백분율 계산기", "할인율 계산기", "수익률 계산기", "비율 계산", "증감율 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 퍼센트 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/finance/percentage`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqList = [
    {
        question: "퍼센트 포인트(%p)와 퍼센트(%)의 차이는 무엇인가요?",
        answer: "기준 금리가 2.0%에서 2.5%로 올랐을 때, 이는 '0.5%p 올랐다'고 표현하는 것이 맞습니다. 만약 '퍼센트(%)'로 표현한다면 2.0에서 2.5로 변한 것이므로 '25% 증가했다'가 됩니다."
    },
    {
        question: "소수점은 몇 째 자리까지 계산되나요?",
        answer: "사용자의 편의를 위해 결과값은 소수점 최대 4째 자리까지 자동으로 처리되어 깔끔하게 표시됩니다."
    },
    {
        question: "마이너스(-) 값도 입력이 가능한가요?",
        answer: "네, 손실율 계산이나 가격 하락 등을 계산할 때는 증감율 계산 모드 등에서 자연스럽게 파악이 가능하도록 마이너스 입력 및 연산을 지원합니다."
    }
];

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
        }
    }))
};

const schema = {
    "@context": "https://schema.org",
    "name": "퍼센트 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/finance/percentage`,
    "description": metadata.description as string
};

export default function PercentagePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.PERCENTAGE
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="퍼센트 계산기" description="비율, 할인율, 수익률 자동 연산 - JIKO 계산기" />

            <Percentage />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-0">

                {/* 1.6 가이드 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mb-6 font-medium animate-fade-slide-up">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-3xl drop-shadow-sm">💯</span> 퍼센트 계산기 가이드
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3 pl-2 sm:pl-3 border-l-4 border-amber-400">
                        <p>
                            쇼핑할 때 할인율 계산부터, 주식/코인 투자 시 수익률 계산, 부동산 세금 등 일상생활과 금융 전반에서 가장 많이 쓰이는 4가지 퍼센트 공식을 한 번에 제공합니다. 복잡한 수식 없이 숫자만 입력하면 즉시 답을 찾아드립니다.
                        </p>
                    </div>
                </section>

                {/* 1.7 사용 방법 및 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-decimal ml-5">
                            <li>4가지 모드 중 내가 원하는 계산 방식을 확인합니다.</li>
                            <li>빈칸에 숫자(전체값, 비율, 일부값 등)를 입력합니다.</li>
                            <li>버튼을 누를 필요 없이 입력과 동시에 아래에 결과가 표시됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li><strong>(할인율)</strong> 50,000원짜리 옷이 20% 할인하면? → <strong>40,000원!</strong></li>
                            <li><strong>(수익률)</strong> 10,000원에 산 주식이 13,000원이 되면? → <strong>30% 상승!</strong></li>
                        </ul>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">🛒</span> 생활 속 퍼센트 활용법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>쇼핑몰에서 "30% 할인 + 추가 10% 쿠폰"은 총 40% 할인이 아닙니다! (0.7 × 0.9 = 0.63, 즉 37% 할인)</li>
                            <li>마트에서 100g당 단가 계산 시 비율 계산기를 활용하면 어떤 상품이 더 저렴한지 1초 만에 알 수 있습니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">📈</span> 투자에서의 퍼센트
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>주식이 -50% 떨어지면, 다시 원금을 회복하기 위해서는 +50%가 아닌 +100%가 올라야 합니다.</li>
                            <li>복리의 마법도 결국 퍼센트 누적의 결과입니다. 수익률 증감 모드를 통해 목표 금액을 쉽게 역산해 보세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <FinanceMoreCalculators />
                <InstallBanner />
            </div>
        </main>
    );
}
