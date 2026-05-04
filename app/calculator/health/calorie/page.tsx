// app/calculator/health/calorie/page.tsx
import type { Metadata } from "next";
import Calorie from "./Calorie";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import HealthMoreCalculators from "@/app/calculator/components/HealthMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "칼로리 계산기 | 운동 및 식단 칼로리 계산기 - JIKO 계산기",
    description: "내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요.",
    keywords: ["칼로리 계산기", "운동 칼로리 소모 계산기", "다이어트 식단 계산기", "다이어트", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/health/calorie` },
    openGraph: {
        title: "칼로리 계산기 | 운동 및 식단 칼로리 계산기 - JIKO 계산기",
        description: "내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요.",
        url: `${BASE_URL}/calculator/health/calorie`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "칼로리 계산기" }],
    },
};

const faqList = [
    { question: "권장 칼로리(TDEE)가 중요한 이유가 뭔가요?", answer: "기초대사량이 몸을 가만히 둘 때 쓰는 에너지라면, 유지 칼로리(TDEE)는 걷고, 직장생활하고, 운동하는 모든 활동대사량을 합친 총 소모 에너지입니다. 이보다 덜 먹으면 살이 빠지고, 더 먹으면 살이 찌게 됩니다." },
    { question: "다이어트를 하려면 얼마나 줄여야 하나요?", answer: "하루 권장 에너지에서 300 ~ 500 kcal 정도를 줄이는 것이 몸에 무리가 가지 않으면서 근손실을 최소화하는 정석적인 방법입니다. 너무 급격한 단식은 피해주세요." },
    { question: "운동 칼로리는 정확한가요?", answer: "본 계산기는 널리 알려진 운동 강도지수(METs)를 바탕으로 계산됩니다. 다만, 개인의 심박수나 정확한 운동 자세 등에 따라 실제 소모량과는 오차가 발생할 수 있습니다." }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "칼로리 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health/calorie`,
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
    "name": "칼로리 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health/calorie`,
    "description": metadata.description as string
};

export default function Page() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME,
        COMMON_BREADCRUMBS.CALORIE
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="칼로리 계산기" description="내 몸에 딱 맞는 하루 권장 칼로리를 활동량과 엮어서 계산해드립니다. 다이어트와 건강 관리를 칼로리 계산으로 시작하세요." position="top" />
            <Calorie />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏃‍♂️</span> 칼로리 계산기 가이드 (운동/다이어트 밸런스 측정)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 칼로리 계산기는 내 몸에 딱 맞는 하루 권장 칼로리를 산출해주는 스마트한 도구입니다. 성별, 체중과 같은 기본 정보에 평소 생활 패턴 및 운동 활동량을 구체적으로 반영하여, 체중 감량(다이어트), 현상 유지, 혹은 체중 증량 등 나의 목표에 맞춰 하루 종일 섭취해야 할 최적의 칼로리를 정확하게 계산해드립니다.
                    </p>
                </section>

                {/* 2. 사용 방법 / 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>성별과 나이, 신체정보를 입력합니다.</li>
                            <li>본인의 <strong>평소 활동량</strong>을 최대한 솔직하게 선택해 주세요.</li>
                            <li>[계산하기] 버튼을 누르면 목표에 따른 식단 조절 플랜 기준점이 나타납니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">성인 여성 / 사무직 / 다이어트 목적</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">일일 권장 섭취: 약 1,500 ~ 1,600 kcal</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">성인 남성 / 운동형 / 현상 유지 목적</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">일일 권장 섭취: 약 2,400 ~ 2,600 kcal</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. 계산 팁 (WHO 권장 올바른 식생활 지침) */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">🥗</span> WHO 권장 올바른 식생활 지침
                    </h3>
                    <ul className="space-y-4">
                        {[
                            ["나트륨 섭취 줄이기", "하루 5g(소금 1큰술) 미만 섭취 권장"],
                            ["채소와 과일", "하루 400g 이상 다양한 색상의 채소 섭취"],
                            ["적정 당분", "총 에너지 섭취량의 10% 미만으로 당분 제한"],
                            ["규칙적인 식사", "폭식을 피하고 일정한 시간에 정량 식사"]
                        ].map(([title, desc], i) => (
                            <li key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">✓</div>
                                <div className="text-sm">
                                    <strong className="text-gray-800 dark:text-gray-100 block mb-1">{title}</strong>
                                    <span className="text-gray-500 dark:text-gray-400">{desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 4. 추가 카드 세션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-red-500">🔥</span> 활동대사량 (TDEE) 이해하기
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>기초대사량(BMR)에 일상생활과 운동으로 소모하는 칼로리를 모두 더한 <strong>총 에너지 소모량</strong>입니다.</p>
                            <p className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl text-red-700 dark:text-red-300">
                                이 TDEE 수치를 기준으로 식단 계획을 세우는 것이 건강한 다이어트의 핵심입니다.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">⚠️</span> 극단적인 저칼로리 식단의 위험성
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>하루 1,000kcal 미만의 초저칼로리 식단은 근손실, 영양 불균형, 요요현상의 주요 원인이 됩니다.</p>
                            <p className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl text-orange-700 dark:text-orange-300">
                                아무리 다이어트 중이더라도 <strong>최소한 자신의 기초대사량 이상</strong>의 칼로리는 반드시 섭취해야 합니다.
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
