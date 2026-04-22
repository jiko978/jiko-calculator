import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "건강 계산기 | 비만도, 배란일, 기초대사량, 임신주수, 칼로리 계산기 - JIKO 계산기",
    description: "나의 비만도(BMI), 기초대사량(BMR), 권장 칼로리는 물론 배란일과 임신주수까지 건강 관리에 필요한 계산기를 한곳에서 이용하세요.",
    keywords: ["건강 계산기", "비만도 계산기", "배란일 계산기", "기초대사량 계산기", "임신주수 계산기", "칼로리 계산기", "BMI 계산기", "BMR 계산기",],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 건강 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/health`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: "ko",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "건강 계산기의 결과는 정확한가요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "JIKO 건강 계산기는 WHO(세계보건기구) 및 Mifflin-St Jeor 등 검증된 의학 공식을 기반으로 설계되었습니다. 다만, 참고용 자료이므로 전문가의 상담을 대체할 수는 없습니다."
            }
        },
        {
            "@type": "Question",
            name: "입력한 건강 데이터가 서버에 저장되나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "아니요, JIKO는 사용자의 민감한 건강 정보를 서버에 저장하지 않으며 모든 계산은 사용자의 브라우저 내에서만 안전하게 처리됩니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "건강 계산기",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/health`,
    "description": metadata.description as string
};

const healthCalculators = [
    {
        title: "⚖️ 비만도 계산기",
        description: "나의 키와 체중을 바탕으로 비만도를 간단하게 측정하고 체질량지수를 확인하세요.",
        href: "/calculator/health/bmi",
    },
    {
        title: "📅 배란일 계산기",
        description: "생리 주기와 마지막 생리일을 입력하여 배란 예정일과 가임기를 예측합니다.",
        href: "/calculator/health/ovulation",
    },
    {
        title: "🔥 기초대사량 계산기",
        description: "나이가 들수록 중요한 기초대사량! 숨만 쉬어도 소모되는 최소 에너지를 계산합니다.",
        href: "/calculator/health/bmr",
    },
    {
        title: "👶 임신주수 계산기",
        description: "출산 예정일과 현재 임신 주수, 아기를 만나기까지의 D-Day를 확인하세요.",
        href: "/calculator/health/pregnancy",
    },
    {
        title: "🏃‍♂️ 칼로리 계산기",
        description: "평소 활동량을 고려한 하루 권장 섭취 칼로리와 유지 에너지를 정확히 산출합니다.",
        href: "/calculator/health/calorie",
    },
];

export default function HealthHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.HEALTH_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="건강 계산기" description="비만도, 배란일, 기초대사량, 임신주수, 칼로리 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💪 건강 생활 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">비만도(BMI), 배란일, 기초대사량(BMR), 임신주기, 칼로리 계산기를 통해 나의 현재 건강 상태를 확인하세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {healthCalculators.map((calc) => (
                        <Link
                            key={calc.href}
                            href={calc.href}
                            className="group block h-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-full flex items-center justify-center text-center">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-keep px-2">
                                    {calc.title}
                                </h3>
                                <p className="sr-only">{calc.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <section className="mt-4 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5">JIKO 건강 계산기만의 특징</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center shrink-0 text-xl">🧘</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">과학적인 공식 기반</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">WHO 및 Mifflin-St Jeor 등 검증된 의학 공식을 활용해 정확한 수치를 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0 text-xl">📊</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">직관적인 결과 분석</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">단순한 숫자를 넘어 현재 상태와 권장 가이드라인을 한눈에 보기 쉽게 설명해 드립니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">👩‍🍼</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">생애 주기별 맞춤 도구</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">다이어트부터 임신 준비까지 일상의 다양한 건강 이벤트에 필요한 도구를 갖추고 있습니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-xl">🔒</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">철저한 데이터 보호</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">민감할 수 있는 모든 건강 관련 데이터는 절대 서버에 저장되지 않습니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                <InstallBanner />
            </div>
        </main>
    );
}
