// app/calculator/health/bmi/page.tsx
import type { Metadata } from "next";
import Bmi from "./Bmi";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "비만도 계산기 | 나의 체질량지수(BMI) 및 비만도 측정 - JIKO 계산기",
    description: "키와 체중을 입력하여 나의 체질량지수(BMI)와 비만도를 정확하게 측정해보세요.",
    keywords: ["비만도 계산기", "BMI 계산기", "체지방률", "체질량지수", "다이어트", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/bmi` },
    openGraph: {
        title: "비만도 계산기 | 나의 체질량지수(BMI) 및 비만도 측정 - JIKO 계산기",
        description: "키와 체중을 입력하여 나의 체질량지수(BMI)와 비만도를 정확하게 측정해보세요.",
        url: `${BASE_URL}/calculator/health/bmi`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "비만도 계산기" }],
    },
};

const faqList = [
    { question: "BMI란 무엇인가요?", answer: "체질량지수(Body Mass Index)의 약자로, 체중(kg)을 키의 제곱(㎡)으로 나눈 값입니다. 비만도를 판정하는 객관적인 기준이 됩니다." },
    { question: "정상 BMI 범위는 어떻게 되나요?", answer: "WHO 아시아 태평양 기준에 따르면 18.5 ~ 22.9 가 정상 범위에 속합니다. 23 이상은 과체중, 25 이상은 비만으로 분류됩니다." },
    { question: "근육량이 많은 사람도 BMI가 높게 나오나요?", answer: "네, BMI는 체중과 키만을 고려하기 때문에 근육량이 많은 운동선수의 경우 체지방률이 낮아도 BMI가 비만으로 측정될 수 있습니다. 이런 경우 체지방률(인바디 등) 측정을 병행하는 것이 좋습니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "비만도 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/bmi`,
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
    "name": "비만도 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/bmi`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.BMI
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="비만도 계산기" description="키와 체중을 입력하여 나의 체질량지수(BMI)와 비만도를 정확하게 측정해보세요." position="top" />
            <Bmi />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚖️</span> 비만도 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 비만도 계산기는 키와 체중을 바탕으로 체질량지수(BMI)를 계산하여 비만 정도를 객관적으로 판정하는 도구입니다. 세계보건기구(WHO) 아시아 태평양 기준을 적용하여 한국인에게 가장 정확한 비만도 측정 결과를 제공하며, 성인뿐만 아니라 전반적인 건강 관리의 핵심 지표로 활용될 수 있습니다.
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
                            <li>[계산하기] 버튼을 누르면 나의 체질량지수(BMI) 및 비만도 결과가 출력됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl space-y-2">
                            <p className="font-bold text-amber-700 dark:text-amber-300">"키 175cm, 체중 70kg인 경우의 BMI는?"</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>신장 :</strong> 175cm</li>
                                <li><strong>체중 :</strong> 70kg</li>
                                <li className="font-bold text-blue-600 dark:text-blue-400">결과 : BMI 22.9 (정상)</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* 3. 계산 팁 (성인 비만도 측정 - BMI 지수) */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        성인 비만도 측정 (BMI 지수)
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-sm">
                        성인 비만 진단은 체질량지수(BMI: body mass index)를 주로 이용합니다.<br />
                        BMI 지수는 키와 몸무게를 이용하여 전반적인 체지방량을 추정하는 값으로서, 체중(kg)을 신장의 제곱(m²)으로 나눈 값으로 비만도를 측정합니다.
                    </p>

                    {/* BMI 시각화 차트 (정적 버전) */}
                    <div className="relative pt-4 pb-8 px-2">
                        {/* 컬러 바 */}
                        <div className="h-10 w-full flex rounded-lg overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
                            <div className="bg-[#00A2FF] flex-1 flex items-center justify-center text-white text-xs font-bold">저체중</div>
                            <div className="bg-[#00C853] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">정상</div>
                            <div className="bg-[#FAA61A] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">과체중</div>
                            <div className="bg-[#FF5252] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">비만</div>
                        </div>
                        {/* 수치 라벨 */}
                        <div className="relative w-full h-6 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <div className="absolute left-0">BMI</div>
                            <div className="absolute left-1/4 -translate-x-1/2">18.5</div>
                            <div className="absolute left-2/4 -translate-x-1/2">23.0</div>
                            <div className="absolute left-3/4 -translate-x-1/2">25.0</div>
                        </div>
                    </div>
                </div>

                {/* 4. 추가 카드 세션 (아시아 태평양 기준 / 소아청소년 비만 기준) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 아시아 태평양 BMI 기준
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>저체중 : <strong>18.5 미만</strong></p>
                            <p>정상 : <strong>18.5 ~ 22.9</strong></p>
                            <p>과체중 : <strong>23.0 ~ 24.9</strong></p>
                            <p>비만 : <strong>25.0 ~ 29.9</strong></p>
                            <p>고도비만 : <strong>30.0 이상</strong></p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">👶</span> 소아청소년 비만 기준
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>소아청소년은 성인과 달리 성별과 연령에 따른 <strong>성장도표 백분위수</strong>를 기준으로 비만도를 평가합니다.</p>
                            <p className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl text-purple-700 dark:text-purple-300">
                                95백분위수 이상일 경우 비만으로 판정합니다.
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
