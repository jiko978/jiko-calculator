import type { Metadata } from "next";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import Prepayment from "./Prepayment";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "중도상환수수료 계산기 | 대출 상환 비용 및 이자 절감액 비교 - JIKO 계산기",
    description: "대출 만기 전 상환 시 발생하는 중도상환수수료를 정확하게 계산하고, 수수료를 내고 상환하는 것이 이득인지 이자 절감액과 비교 분석해 보세요.",
    keywords: ["중도상환수수료", "대출상환계산기", "중도상환수수료계산기", "주택담보대출상환", "대출이자절감", "JIKO계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/finance/prepayment` },
    openGraph: {
        title: "중도상환수수료 계산기 | 대출 상환 비용 및 이자 절감액 비교 - JIKO 계산기",
        description: "대출 만기 전 상환 시 발생하는 중도상환수수료를 정확하게 계산하고, 수수료를 내고 상환하는 것이 이득인지 이자 절감액과 비교 분석해 보세요.",
        url: `${BASE_URL}/calculator/finance/prepayment`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "중도상환수수료 계산기" }],
    },
};

const faqList = [
    {
        question: "중도상환수수료는 왜 발생하나요?",
        answer: "은행이 대출을 해줄 때 조달한 자금을 예정보다 일찍 돌려받게 되면 발생하는 자금 운용의 손실과 행정 비용을 보전하기 위해 부과하는 일종의 해약금입니다."
    },
    {
        question: "3년이 지나면 무조건 면제인가요?",
        answer: "대부분의 국내 가계대출은 '금융소비자 보호에 관한 법률'에 따라 대출 실행일로부터 3년이 지나면 중도상환수수료가 면제됩니다. 다만, 일부 특수 상품이나 기업 대출은 기간이 다를 수 있으니 약관 확인이 필요합니다."
    },
    {
        question: "일할 계산 방식이 무엇인가요?",
        answer: "남은 대출 기간에 비례하여 수수료가 매일 조금씩 줄어드는 방식입니다. 즉, 상환 시점이 만기에 가까울수록 내야 할 수수료 금액은 낮아집니다."
    },
    {
        question: "수수료를 내더라도 일찍 상환하는 것이 유리한가요?",
        answer: "대출 금리가 높고 남은 기간이 길다면, 지금 내는 수수료보다 앞으로 낼 이자의 총합이 훨씬 클 수 있습니다. JIKO 계산기의 '이자 절감 분석' 결과를 참고하여 결정하세요."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "중도상환수수료 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/finance/prepayment`,
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
    "name": "중도상환수수료 계산기",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/finance/prepayment`,
    "description": metadata.description as string
};


export default function PrepaymentPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.PREPAYMENT
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="중도상환수수료 계산기" description="대출 만기 전 상환 시 발생하는 중도상환수수료를 정확하게 계산하고, 수수료를 내고 상환하는 것이 이득인지 이자 절감액과 비교 분석해 보세요." position="top" />
            <Prepayment />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💸</span> 중도상환수수료 계산기 가이드 (상환 비용 및 이자 비교)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        대출금을 만기 전에 미리 갚을 때 발생하는 비용을 정확히 계산해 보세요. 단순히 수수료 금액만 확인하는 것이 아니라, 수수료를 내고서라도 지금 갚는 것이 경제적으로 유리한지 '이자 절감액'과 비교 분석해 드립니다. 시중은행 프리셋을 통해 더 간편하게 확인하실 수 있습니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside">
                            <li><strong>상환 금액</strong>과 해당 대출의 <strong>수수료율</strong>을 입력합니다.</li>
                            <li><strong>대출 실행일</strong>과 <strong>상환 예정일</strong>을 선택하세요.</li>
                            <li>대부분의 은행은 3년이 지나면 수수료가 면제되므로 이를 자동으로 확인해 드립니다.</li>
                            <li><strong>[계산하기]</strong>를 누르면 예상 수수료와 이자 절감액을 한눈에 비교할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-emerald-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">1억 상환 시 (수수료 1.2%, 잔존 1년)</p>
                            <p className="mb-1">• 예상 수수료 : 약 40만 원</p>
                            <p className="mb-2">• 대출 금리 5% 시 연 이자 : 500만 원</p>
                            <div className="border-t border-emerald-200 dark:border-emerald-800 my-2"></div>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">결과: 수수료 내고 갚는 것이 약 460만 원 유리!</p>
                        </div>
                    </section>
                </div>

                {/* 1.8 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">📌</span> 면제 비율 확인하기
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>대출 상품에 따라 매년 대출 원금의 10% 이내 상환 시 수수료를 면제해 주는 옵션이 있을 수 있습니다.</li>
                            <li>소액의 여유 자금이 생겼다면, 이 면제 한도 내에서 상환하여 수수료 없이 원금을 줄이는 것이 가장 좋습니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🎯</span> 대환대출(갈아타기) 주의사항
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc ml-5">
                            <li>금리가 더 낮은 대출로 갈아타기 위해 기존 대출을 상환할 때도 중도상환수수료가 발생합니다.</li>
                            <li>금리 인하로 인한 이자 절감액이 대환에 드는 중도상환수수료, 인지세 등 부대비용보다 큰지 반드시 계산해 보세요.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <FinanceMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
