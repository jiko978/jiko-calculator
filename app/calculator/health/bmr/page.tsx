// app/calculator/health/bmr/page.tsx
import type { Metadata } from "next";
import Bmr from "./Bmr";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "기초대사량 계산기 | 기초대사량(BMR) 및 일일 권장 칼로리 측정 - JIKO 계산기",
    description: "생명 유지에 필요한 최소한의 에너지, 기초대사량(BMR)을 계산하여 하루 권장 칼로리를 알아보세요.",
    keywords: ["기초대사량 계산기", "BMR 계산기", "일일 권장 칼로리 계산기", "다이어트", "기초대사량", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/bmr` },
    openGraph: {
        title: "기초대사량 계산기 | 기초대사량(BMR) 및 일일 권장 칼로리 측정 - JIKO 계산기",
        description: "생명 유지에 필요한 최소한의 에너지, 기초대사량(BMR)을 계산하여 하루 권장 칼로리를 알아보세요.",
        url: `${BASE_URL}/calculator/health/bmr`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "기초대사량 계산기" }],
    },
};

const faqList = [
    { question: "기초대사량(BMR)이 무엇인가요?", answer: "기초대사량은 우리 몸이 휴식 상태에서도 체온 유지, 심장 박동 등 생명 유지를 위해 소모하는 최소한의 에너지(kcal)입니다. 아무것도 안 해도 기본적으로 빠지는 칼로리를 뜻합니다." },
    { question: "어떤 공식을 쓰나요?", answer: "본 계산기는 현대인에게 가장 정확도가 높다고 알려진 미플린-세인트 주어(Mifflin-St Jeor) 공식을 사용하여 계산됩니다." },
    { question: "기초대사량을 높이려면 어떻게 해야 하나요?", answer: "근력 운동을 통해 근육량을 늘리는 것이 가장 효과적입니다. 근육은 지방보다 유지에 더 많은 에너지를 소모하므로, 같은 체중이라도 근육이 많은 사람의 기초대사량이 더 높습니다. 또한 충분한 단백질 섭취와 규칙적인 식사도 큰 도움이 됩니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "기초대사량 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/bmr`,
    applicationCategory: "HealthApplication",
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
    "name": "기초대사량 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/bmr`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.BMR
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="기초대사량 계산기" description="생명 유지에 필요한 최소한의 에너지, 기초대사량(BMR)을 계산하여 하루 권장 칼로리를 알아보세요." position="top" />
            <Bmr>
                <div className="space-y-4">
                    {/* 1. 메뉴 설명 (계산기 가이드) */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-2xl">🔥</span> 기초대사량 계산기 가이드 (일일 권장 칼로리 안내)
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                            JIKO 기초대사량(BMR) 계산기는 생명 유지에 필요한 최소한의 에너지를 과학적으로 산출해주는 도구입니다. 다이어트의 핵심은 자신의 기초대사량을 정확히 아는 것부터 시작됩니다. 무작정 굶기만 하는 다이어트는 근손실을 유발하고 결국 기초대사량을 낮춰 요요현상의 원인이 되므로, 본 계산기를 통해 하루 권장 칼로리를 파악하고 건강한 식단을 계획해 보세요.
                        </p>
                    </section>

                    {/* 2. 사용 방법 / 계산 예시 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span className="text-blue-500">📖</span> 사용 방법
                            </h2>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                                <li>성별과 나이를 선택 및 입력합니다.</li>
                                <li>정확한 <strong>키(cm)</strong>와 <strong>체중(kg)</strong>을 입력합니다.</li>
                                <li>[계산하기] 버튼을 눌러 하루 필수 소모 칼로리를 확인하세요.</li>
                            </ul>
                        </section>

                        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span className="text-amber-500">📝</span> 계산 예시
                            </h2>
                            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                    <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">여성 / 30세 / 165cm / 55kg</p>
                                    <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 기초대사량 약 1,295 kcal</p>
                                </div>
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 opacity-80">
                                    <p className="text-amber-700 dark:text-amber-300 mb-1 font-bold">남성 / 40세 / 175cm / 75kg</p>
                                    <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 기초대사량 약 1,650 kcal</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </Bmr>

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4">

                {/* 4. 추가 카드 세션 (활동 대사량 / 다이어트 칼로리 설정법) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">🏃‍♂️</span> 활동 대사량(AMR)이란?
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>기초대사량 외에 우리가 걷고, 일하고, 운동하면서 <strong>추가로 소모하는 에너지</strong>를 말합니다.</p>
                            <p className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl text-green-700 dark:text-green-300">
                                <strong>일일 총 에너지 소모량(TDEE)</strong> = 기초대사량 + 활동 대사량 + 식사성 발열 효과
                            </p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">🍽️</span> 다이어트 칼로리 설정법
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>효과적인 다이어트를 위해서는 일일 총 소모량(TDEE)보다 <strong>약 300~500kcal 적게</strong> 섭취하는 것이 좋습니다.</p>
                            <p className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl text-purple-700 dark:text-purple-300">
                                주의: 식사량을 기초대사량 <strong>이하</strong>로 줄이면 오히려 살이 잘 찌는 체질로 변할 수 있습니다.
                            </p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <HealthMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
