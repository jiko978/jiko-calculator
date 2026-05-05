import { Metadata } from "next";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";
import ExchangeRate from "./ExchangeRate";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";

export const metadata: Metadata = {
    title: "환율 계산기 | 원화-외화 실시간 변환 및 수수료 우대 - JIKO 계산기",
    description: "실시간 환율 변환, 은행 환전 수수료 및 우대율 적용 계산, 미래 환율 시뮬레이션까지 완벽 지원합니다. 달러, 엔화, 유로 등 주요 통화 환전 시 필수!",
    keywords: ["환율 계산기", "실시간 환율", "환전 수수료", "환율 우대", "달러 환율", "엔화 환율", "유로 환율", "환전 시뮬레이션"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 환율 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/finance/exchange-rate`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqList = [
    {
        question: "주말이나 공휴일에도 실시간 환율이 반영되나요?",
        answer: "네, KOREA EXIM(수출입은행) 데이터의 경우 직전 영업일의 최종 고시환율을 적용하며, 글로벌 실시간 환율 API를 통해 365일 언제나 정확한 환율을 제공합니다."
    },
    {
        question: "매매기준율과 현찰 살때 환율의 차이가 무엇인가요?",
        answer: "'매매기준율'은 수수료가 포함되지 않은 도매가 환율입니다. 반면 우리가 은행에서 실제 지폐를 바꿀 때는 외화 운송 및 보관 비용(스프레드 마진)이 포함된 '현찰 살때/팔때' 환율이 적용됩니다. 본 계산기에서는 두 가지 기준을 모두 지원합니다!"
    },
    {
        question: "환율 우대 90%를 적용하면 얼마나 싸지는 건가요?",
        answer: "은행이 남기는 마진(현찰 살때 환율 - 매매기준율)의 90%를 깎아준다는 의미입니다. JIKO 계산기에서 우대율 옵션을 선택하시면 은행 앱과 동일하게 수수료가 절감된 최종 금액을 즉시 확인하실 수 있습니다."
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
    "name": "환율 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/finance/exchange-rate`,
    "description": metadata.description as string
};

export default function ExchangeRatePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.EXCHANGE_RATE
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="환율 계산기" description="원화-외화 실시간 자동 변환 - JIKO 계산기" />

            <ExchangeRate />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-0">

                {/* 1.6 가이드 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 mb-6 font-medium animate-fade-slide-up">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-2xl drop-shadow-sm">🌏</span> 환율 계산기 가이드
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3 pl-2 sm:pl-3 border-l-4 border-amber-400">
                        <p>
                            해외여행, 직구, 유학, 해외 주식 투자 시 필수적인 환전 계산을 위한 전문가용 계산기입니다. 달러, 엔화, 유로 등 주요국 통화의 실시간 환율을 적용하여 1원부터 역산까지 한 번에 계산됩니다.
                        </p>
                    </div>
                    <p className="text-xs mt-3 text-red-500/80 dark:text-red-400/80 font-medium bg-red-50/50 dark:bg-red-900/10 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/20 inline-block">
                        ※ 본 계산기는 참고용이며 투자 판단의 책임은 사용자에게 있습니다.
                    </p>
                </section>

                {/* 1.7 사용 방법 및 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-decimal ml-5">
                            <li>환전 계산 모드에서 환전할 금액과 통화를 선택합니다.</li>
                            <li>매매기준율 외에도 은행의 환율 우대율(90%, 80% 등)을 적용해 볼 수 있습니다.</li>
                            <li>시뮬레이션 모드에서는 미래의 환율 변동(증감률)에 따른 예상 금액을 미리 계산해볼 수 있습니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li><strong>(환전)</strong> 100만원을 미국 달러로 환전하면? → <strong>약 730달러!</strong></li>
                            <li><strong>(시뮬레이션)</strong> 만약 환율이 10% 오르면, 100만원은 <strong>약 660달러!</strong></li>
                        </ul>
                    </section>
                </div>

                {/* 1.8 환율 및 수수료 상식 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">💰</span> 환율 우대 90%의 의미
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>은행이 이윤을 남기는 현찰 살 때 환율과 매매기준율의 차이(스프레드 마진) 중 90%를 할인해준다는 의미입니다.</li>
                            <li>환전 금액이 클수록 우대율에 따른 수수료 절감 효과가 매우 커집니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🚫</span> 이중환전(DCC) 주의
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>해외 현지에서 신용카드 결제 시 현지 통화가 아닌 원화(KRW)로 결제할 경우 3~8%의 추가 수수료가 발생합니다.</li>
                            <li>결제 전 반드시 현지 통화로 청구되는지 확인하세요!</li>
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
