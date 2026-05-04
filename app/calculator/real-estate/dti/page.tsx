import type { Metadata } from "next";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import DtiCalculator from "./Dti";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "DTI 계산기 | 총부채상환비율 대출 한도 계산 - JIKO 계산기",
    description: "내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요.",
    keywords: ["DTI계산기", "총부채상환비율", "부동산대출한도", "주담대DTI", "JIKO계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/real-estate/dti` },
    openGraph: {
        title: "DTI 계산기 | 총부채상환비율 대출 한도 계산 - JIKO 계산기",
        description: "내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요.",
        url: `${BASE_URL}/calculator/real-estate/dti`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "DTI 계산기" }],
    },
};

const faqList = [
    {
        question: "DTI와 DSR의 가장 큰 차이점은 무엇인가요?",
        answer: "DTI는 '기존 대출의 이자'만 부채로 합산하지만, DSR은 '기존 대출의 이자와 원금'을 모두 부채로 합산합니다. 따라서 보통 DSR이 더 엄격한 기준이 됩니다."
    },
    {
        question: "연소득 증빙이 어려운 경우는 어떻게 하나요?",
        answer: "근로소득 외에 카드 사용액, 건강보험료 납부액 등으로 환산 소득을 인정받을 수 있습니다. JIKO 계산기는 증빙 가능한 정보를 기준으로 입력하시길 권장합니다."
    },
    {
        question: "마이너스 통장(신용한도대출)은 DTI 계산 시 어떻게 반영되나요?",
        answer: "마이너스 통장은 실제 사용액이 아닌 전체 '한도'를 기준으로 이자액이 계산되어 기타 대출 이자 상환액에 합산됩니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DTI 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/real-estate/dti`,
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
    "name": "DTI 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/real-estate/dti`,
    "description": metadata.description as string
};

export default function DtiPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.REAL_ESTATE_HOME,
        COMMON_BREADCRUMBS.DTI
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="DTI 계산기" description="내 연소득에 맞는 대출 한도는? 주택담보대출의 원리금과 기존 대출의 이자를 합산하여 DTI를 정밀하게 계산하고 추가 대출 여력을 확인하세요." position="top" />
            <DtiCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        📉 DTI 계산기 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <b>DTI(Debt to Income)</b>는 총부채상환비율로, 차주의 연간 소득에서 부채 상환액이 차지하는 비중을 말합니다. 
                        주택담보대출의 경우 원리금 전체를 합산하고, 신용대출 등 기타 대출은 <b>이자 상환액</b>만 합산하는 것이 특징입니다. 
                        내 연소득에 맞는 대출 한도를 정밀하게 계산하고 추가 대출 여력을 확인하세요.
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
                            <li>차주의 <strong>연간 총 소득</strong>을 기입합니다.</li>
                            <li><strong>해당 주택담보대출</strong>의 1년간 상환할 <strong>원금과 이자</strong>를 입력합니다.</li>
                            <li>주담대 외 <strong>기타 대출</strong>(신용, 마이너스 통장 등)이 있다면 1년간 상환할 <strong>이자</strong>만 입력합니다.</li>
                            <li>'계산하기'를 통해 나의 DTI 비율을 즉시 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1 pointer-events-none">
                            <p>연소득 : <strong>5,000만 원</strong></p>
                            <p>신규 주담대 원금+이자 : <strong>1,500만 원</strong></p>
                            <p>기존 대출금 이자액 : <strong>500만 원</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                DTI 비율 : 40%
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 1.8 추가 카드 세션 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> DTI와 DSR 차이
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            DTI는 기존 대출의 <b>이자</b>만 부채로 보지만, DSR은 기존 대출의 <b>원금과 이자</b> 모두를 부채로 봅니다. 
                            따라서 DSR이 DTI보다 더 엄격한 대출 규제 수단으로 활용됩니다.
                        </p>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-emerald-500">📊</span> 소득 증빙 팁
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            근로소득 외에도 신용카드 사용액, 건강보험료 납부액 등으로 환산 소득을 인정받을 수 있습니다. 
                            정확한 산출을 위해 증빙 가능한 모든 소득 정보를 미리 준비하세요.
                        </p>
                    </section>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqList} />
                </div>

                <RealEstateMoreCalculators />

                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </div>
    );
}
