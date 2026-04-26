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
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">💪 건강 계산기 모음</h1>
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
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            JIKO 건강 계산기만의 특징
                        </h2>
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

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        건강 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 건강 계산기는 비만도, 배란일, 기초대사량, 임신주수, 칼로리처럼 건강 관리에 필요한 주요 정보를 쉽게 확인할 수 있는 페이지입니다. 체형 관리부터 임신 관련 일정 확인까지 폭넓게 활용할 수 있도록 구성되어 있습니다.</p>
                        <p>• 비만도 계산기로 현재 체형 상태를 간단히 파악할 수 있고, 기초대사량과 칼로리 계산기를 통해 하루 에너지 소비와 섭취량을 관리할 수 있습니다. 배란일과 임신주수 계산기는 임신 계획이나 산부인과 관련 일정 확인에 도움이 됩니다.</p>
                        <p>• 건강 계산기는 다이어트, 체중 관리, 건강 습관 형성에 관심 있는 사람에게 실용적인 정보를 제공합니다. 복잡한 의학 지식 없이도 기본적인 건강 지표를 쉽게 확인할 수 있어 일상적인 건강 관리에 유용합니다.</p>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        이런 경우 사용하세요
                    </h2>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>체중 감량이나 증량을 목표로 할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>현재 비만도 상태를 정확하게 알고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>기초대사량과 하루 섭취 권장 칼로리를 계산하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>임신을 계획 중이거나 임신 초기 단계에 있을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>정확한 배란일과 가임기를 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>건강한 식단 관리를 위해 칼로리를 계산하고 싶을 때</span>
                        </li>
                    </ul>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        자주 묻는 질문
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 비만도(BMI) 기준이 무엇인가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 세계보건기구(WHO) 기준에 따라 체질량지수(BMI) 18.5 미만은 저체중, 18.5~22.9는 정상, 23~24.9는 과체중, 25 이상은 비만으로 분류합니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 기초대사량은 왜 중요한가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 기초대사량은 생명 유지에 필요한 최소한의 에너지양으로, 이를 파악해야 적절한 칼로리 섭취 계획을 세울 수 있습니다.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 건강 상태와 차이가 있을 수 있습니다. 정확한 진단과 치료는 전문 의료인의 상담을 받으시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 건강 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Link href="/calculator/health/bmi" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                            ⚖️ 비만도 계산하기 →
                        </Link>
                        <Link href="/calculator/health/ovulation" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                            📅 배란일 계산하기 →
                        </Link>
                        <Link href="/calculator/health/bmr" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                            🔥 기초대사량 계산하기 →
                        </Link>
                        <Link href="/calculator/health/pregnancy" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                            👶 임신주수 계산하기 →
                        </Link>
                        <Link href="/calculator/health/calorie" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                            🏃‍♂️ 칼로리 계산하기 →
                        </Link>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        더 많은 계산기가 필요하신가요?
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 7가지 카테고리에서 찾고 있는 계산기를 모두 만나보세요. JIKO는 일상에서 필요한 모든 계산을 한곳에서 제공하는 계산 플랫폼입니다.
                    </p>
                    <Link href="/calculator" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition">
                        🧮 전체 계산기 보기
                    </Link>
                </section>
                <InstallBanner />
            </div>
        </main>
    );
}
