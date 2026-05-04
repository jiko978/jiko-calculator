import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import NewDtiCalculator from "./NewDti";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기",
    description: "다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다.",
    keywords: ["신DTI계산기", "다주택자대출", "강화된DTI", "주담대한도", "신총부채상환비율", "부동산규제"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/new-dti` },
    openGraph: {
        title: "신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기",
        description: "다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다.",
        url: `${BASE_URL}/calculator/real-estate/new-dti`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "신DTI 계산기" }],
    },
};

const faqList = [
    {
        question: "신DTI가 일반 DTI보다 왜 더 보수적인가요?",
        answer: "일반 DTI는 기존 주담대의 '이자'만 부채로 보지만, 신DTI는 기존 주담대의 '원금과 이자' 전체를 부채로 보기 때문입니다. 다주택자일수록 한도가 더 크게 줄어듭니다."
    },
    {
        question: "두 번째 주택담보대출부터는 무조건 신DTI가 적용되나요?",
        answer: "네, 현재 금융 규제상 추가 주담대 발급 시에는 강화된 신DTI 기준이 적용되며, 지역 및 대출 상품에 따라 LTV 규제와 함께 중첩 적용될 수 있습니다."
    },
    {
        question: "일반 DTI와 신 DTI는 언제 구분해서 적용되나요?",
        answer: "일반 DTI는 무주택자나 1주택자의 주담대 갱신 시 적용되는 경우가 많고, 신 DTI는 다주택자가 추가 주담대를 받거나 규제지역에서 대출을 받을 때 엄격하게 적용됩니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "신DTI 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/new-dti`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: q.answer
        }
    }))
};

const schema = {
    "@context": "https://schema.org",
    "name": "신DTI 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/new-dti`,
    "description": metadata.description as string
};

export default function NewDtiPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.NEW_DTI
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="신DTI 계산기" description="다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다." position="top" />
            <NewDtiCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        🏢 신DTI(New DTI) 계산기 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <b>신DTI</b>는 차주의 상환 능력을 더욱 엄격히 평가하기 위해 도입된 제도로, 보유한 <b>모든 주택담보대출의 원리금 상환액</b>을 부채로 산정합니다. 
                        특히 다주택자가 추가 대출을 받을 때 대출 한도가 대폭 줄어드는 결과를 초래하므로, 정확한 원리금 합산 계산이 필수적입니다.
                    </p>
                    <p className="text-xs mt-3 text-red-500/80 dark:text-red-400/80 font-medium bg-red-50/50 dark:bg-red-900/10 p-2.5 rounded-lg border border-red-100/50 dark:border-red-900/20 inline-block text-left">
                        ※ 본 계산기는 참고용이며 투자 판단의 책임은 사용자에게 있습니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>본인의 <strong>연소득</strong>을 입력합니다.</li>
                            <li><strong>신규 주택담보대출</strong>의 원리금 상환액을 입력합니다.</li>
                            <li><strong>기존 주택담보대출</strong>이 있다면 해당 대출의 <strong>원금+이자</strong>를 모두 입력합니다.</li>
                            <li>기타 대출(신용대출 등)이 있다면 해당 대출의 <strong>이자</strong>만 입력합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1 pointer-events-none">
                            <p>연소득 : <strong>6,000만 원</strong></p>
                            <p>기존 주담대 원리금 + 신규 주담대 원리금 : <strong>2,400만 원</strong></p>
                            <p>기타 대출 이자 : <strong>600만 원</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                신 DTI : 50%
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 1.8 추가 카드 세션 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 주요 적용 기준
                        </h2>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2 list-disc ml-5 font-bold leading-relaxed">
                            <li>기존 주담대 : 원금 + 이자 모두 부채 산입</li>
                            <li>신규 주담대 : 원금 + 이자 모두 부채 산입</li>
                            <li>기타 대출 : 이자 상환액만 부채 산입</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-red-500">🚫</span> 다주택자 규제
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            두 번째 주택담보대출부터는 만기 제한(15년) 등이 적용되어 DTI 비율이 급격히 상승할 수 있습니다. 
                            JIKO 계산기로 예상 한도를 미리 확인해 보세요.
                        </p>
                    </section>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqList} />
                </div>
                <RealEstateMoreCalculators />
                <InstallBanner />
            </div>
        </div>
    );
}
