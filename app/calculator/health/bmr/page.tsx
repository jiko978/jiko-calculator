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
    { question: "어떤 공식을 쓰나요?", answer: "본 계산기는 현대인에게 가장 정확도가 높다고 알려진 미플린-세인트 주어(Mifflin-St Jeor) 공식을 사용하여 계산됩니다." }
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
            <Bmr />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🔥</span> 기초대사량 계산기 및 일일 권장 칼로리 안내
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        다이어트의 핵심은 자신의 기초대사량을 아는 것부터 시작됩니다. 굶기만 하는 다이어트는 근손실을 가져오고 결국 기초대사량을 낮춰 요요현상의 원인이 됩니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>성별과 나이를 선택 및 입력합니다.</li>
                            <li>정확한 <strong>키(cm)</strong>와 <strong>체중(kg)</strong>을 입력합니다.</li>
                            <li>[계산하기] 버튼을 눌러 하루 필수 소모 칼로리를 확인하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">여성 / 30세 / 165cm / 55kg</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">기초대사량: 약 1,295 kcal</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">남성 / 40세 / 175cm / 75kg</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">기초대사량: 약 1,650 kcal</p>
                            </div>
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
