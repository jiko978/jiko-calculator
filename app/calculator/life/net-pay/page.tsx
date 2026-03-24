// app/calculator/life/net-pay/page.tsx
import type { Metadata } from "next";
import NetPay from "@/app/calculator/life/net-pay/NetPay";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "실수령액 계산기 · 세후 연봉 월급 계산기 | 희망 실수령액 기준 세전 금액 찾기 - JIKO 계산기",
    description: "원하는 한 달 실수령액을 받기 위해 계약해야 할 연봉이나 월급(세전)을 알려드립니다. 2025 최신 세율을 반영한 정밀 계산.",
    keywords: ["실수령액 계산기", "세후 연봉 계산기", "세후 월급 계산기", "실수령액 350만원 연봉", "희망 실수령액 계산", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/net-pay` },
    openGraph: {
        title: "실수령액 계산기 | 희망하는 세후 금액으로 연봉 찾기",
        description: "통장에 딱 이만큼 찍히려면 연봉은 얼마여야 할까? 실수령액 기준으로 세전 급여를 역으로 확인하세요.",
        url: `${BASE_URL}/calculator/life/net-pay`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "실수령액 계산기" }],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "실수령액 계산기",
    description: "한 달에 실제로 받고 싶은 금액을 입력하면, 그에 필요한 세전 연봉과 월급을 도출해드립니다.",
    url: `${BASE_URL}/calculator/life/net-pay`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        COMMON_BREADCRUMBS.NET_PAY
    ]);

    const faqList = [
        { question: "실수령액 계산기는 어떤 때 사용하나요?", answer: "주로 이직 협상이나 연봉 계약 시, 본인이 실제로 통장에 받기를 원하는 월 '실수령액'을 기준으로 거꾸로 계약 연봉(세전)을 파악하고 싶을 때 유용합니다." },
        { question: "연봉/월급 계산기와 무엇이 다른가요?", answer: "연봉 계산기는 '세전 오퍼 금액을 넣고 세후를 확인'하는 용도이며, 실수령액 계산기는 '내가 원하는 세후 금액을 넣고 세전 오퍼 금액을 확인'하는 용도입니다." },
        { question: "계산 결과가 얼마나 정확한가요?", answer: "2025년 최신 4대보험 요율과 간이세액표를 바탕으로 반복 연산(Iteration) 로직을 적용하여 1원 단위까지 정밀하게 추정합니다. 단, 개별적인 비과세 항목이나 공제에 따라 실제와는 다소 차이가 날 수 있습니다." }
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <NavBar title="실수령액 계산기" description="원하는 수령액에 필요한 세전 급여 확인" position="top" />
            <NetPay />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💰</span> 실수령액 계산기 및 희망 급여 안내
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        내가 매달 실제로 통장에 받고 싶은 금액(세후)을 입력해 보세요. 2025년 최신 세율을 바탕으로 세금을 포함한 <strong>최종 계약 연봉과 월 기본급(세전)</strong>을 찾아드립니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>매달 통장에 입금되길 원하는 <strong>희망 실수령액</strong>을 입력합니다.</li>
                            <li>비과세액(식대 등 기본 20만원)과 인적 공제 정보를 확인합니다.</li>
                            <li>[계산하기] 버튼을 누르면 해당 금액을 받기 위해 필요한 세전 연봉과 월급이 산출됩니다.</li>
                        </ul>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <LifeMoreCalculators />
            </main>
        </div>
    );
}
