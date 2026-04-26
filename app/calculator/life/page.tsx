import { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/calculator/components/NavBar";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../utils/seo";

export const metadata: Metadata = {
    title: "생활 계산기 | 나이, 날짜, 디데이, 전역일, 학점 계산기 - JIKO 계산기",
    description: "내 정확한 만 나이는? 중요한 기념일까지 며칠 남았을까? 나이 계산부터 디데이, 날짜 수 계산, 군대 전역일 확인까지 일상에 꼭 필요한 생활 계산기를 만나보세요.",
    keywords: ["생활 계산기", "나이 계산기", "만 나이 계산기", "날짜 계산기", "디데이 계산기", "전역일 계산기"],
};

const BASE_URL = "https://jiko.kr";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JIKO 생활 계산기 모음",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/life`,
    applicationCategory: "UtilityApplication",
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
            name: "만 나이 통일법이 적용되어 있나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "네, JIKO 나이 계산기는 최신 만 나이 통일법 기준을 적용하여 투표권, 운전면허 등 법적 나이 기준을 정확하게 안내해 드립니다."
            }
        },
        {
            "@type": "Question",
            name: "날짜 계산 시 초일(첫날)을 포함하나요?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "상황에 따라 다릅니다. 기념일 등 '오늘부터 1일'인 경우는 포함하고, 일반적인 기간 계산은 제외하는 등 사용자가 선택할 수 있도록 옵션을 제공합니다."
            }
        }
    ]
};

const schema = {
    "@context": "https://schema.org",
    "name": "생활 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/life`,
    "description": metadata.description as string
};

const lifeCalculators = [
    {
        title: "🎂 나이 계산기",
        description: "정확한 만 나이와 연 나이를 계산하고, 투표권 발생일 등 법적 나이 기준을 확인해드립니다.",
        href: "/calculator/life/age",
    },
    {
        title: "📅 날짜 계산기",
        description: "두 날짜 사이의 정확한 일수, 주수, 개월수를 계산하고 주요 기념일 타임라인을 제공합니다.",
        href: "/calculator/life/date",
    },
    {
        title: "🕯️ 디데이 계산기",
        description: "커플 기념일, 시험일 등 중요한 날까지 남은 기간을 계산하거나 특정 일수 전후의 날짜를 찾아드립니다.",
        href: "/calculator/life/d-day",
    },
    {
        title: "🪖 전역일 계산기",
        description: "입대일만 입력하면 군별 복무 기간을 반영하여 전역일과 실시간 복무율, 진급일을 알려드립니다.",
        href: "/calculator/life/discharge-day",
    },
    {
        title: "🎓 학점 계산기",
        description: "대학교 학점을 간편하게 계산하고 환산 점수까지 변환해서 알려드립니다.",
        href: "/calculator/life/grade",
    },
];

export default function LifeHubPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="생활 계산기" description="나이, 날짜, 디데이, 전역일, 학점 계산기 - JIKO 계산기" />

            <div className="flex-grow px-4 py-6">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">🏠 생활 계산기 모음</h1>
                <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">나이, 날짜, 디데이, 전역일 계산기를 통해 일상 속 궁금한 날짜들을 간편하게 확인하세요.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mx-auto">
                    {lifeCalculators.map((calc) => (
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
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                    <div className="relative">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            JIKO 생활 계산기만의 특징
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-xl">🎂</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">정확한 법적 나이 계산</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">만 나이 통일법 시행 이후 헷갈리는 나이 기준을 명확하게 짚어드립니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0 text-xl">🕯️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">기념일 자동 타임라인</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력한 날짜를 기준으로 100일, 1주년 등 주요 기념일을 자동으로 계산하여 보여줍니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-xl">⚖️</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">날짜 계산 원칙 적용</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">초일불산입 등 상황에 맞는 날짜 계산 방식을 설명과 함께 제공합니다.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-xl">🪖</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">최신 병역 제도 반영</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">각 군별 상이한 복무 기간을 최신 기준으로 반영하여 정확한 전역일을 산출합니다.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                        생활 계산기 소개
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>• 생활 계산기는 나이, 날짜, 디데이, 전역일, 학점처럼 일상에서 자주 필요하지만 직접 계산하기 번거로운 항목을 빠르게 확인할 수 있는 페이지입니다. 단순한 숫자 계산이 아니라 생활 속에서 자주 쓰는 정보를 쉽게 정리해 줍니다.</p>
                        <p>• 나이 계산기로 만 나이와 세는 나이를 확인할 수 있고, 날짜 계산과 디데이 계산으로 중요한 일정까지 남은 기간을 간편하게 알 수 있습니다. 전역일 계산기는 군 복무 중인 사람에게 유용하며, 학점 계산기는 학업 성적과 졸업 요건을 관리하는 데 도움이 됩니다.</p>
                        <p>• 생활 계산기는 복잡한 계산보다 빠른 확인이 필요한 순간에 특히 유용합니다. 일상, 학업, 일정 관리까지 한 번에 도와주는 실용적인 도구로 활용할 수 있습니다.</p>
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
                            <span>만 나이와 세는 나이를 비교해야 할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>시험, 면접 등 중요한 일정까지 남은 날짜가 궁금할 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>결혼기념일, 생일 등 D-Day를 챙기고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>군 복무 중인 경우 전역까지 남은 기간을 확인하고 싶을 때</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                            <span>학업 성취도를 평가하거나 졸업까지 남은 기간을 계산하고 싶을 때</span>
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
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 만 나이 계산과 세는 나이 계산은 어떻게 다른가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 만 나이는 생일을 기준으로 1년씩 더하는 방식이며, 세는 나이는 태어난 해를 1살로 시작하는 방식입니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. D-Day 계산에서 '초일불산입'이란 무엇인가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 기준일 다음 날부터 계산을 시작하는 방식입니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 전역일 계산 시 육군, 해군, 공군의 복무 기간이 다른가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 네, 각 군별로 상이한 복무 기간을 적용합니다.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Q. 학점 계산 결과가 실제와 다른 이유는 무엇인가요?</p>
                            <p className="text-gray-600 dark:text-gray-300">A. 학교별 학점 인정 기준과 다를 수 있으니, 참고용으로만 활용하시기 바랍니다.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        유의사항
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">계산 결과는 입력한 정보를 기준으로 한 예상 값이며 실제 급여 및 수급 금액과 차이가 있을 수 있습니다. 정확한 정보는 고용노동부 또는 관련 기관의 안내를 확인하시기 바랍니다.</p>
                </section>

                <section className="mt-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">지금 바로 JIKO 생활 계산기를 이용해보세요!</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <Link href="/calculator/life/age" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                            🎂 나이 계산하기 →
                        </Link>
                        <Link href="/calculator/life/date" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                            📅 날짜 계산하기 →
                        </Link>
                        <Link href="/calculator/life/d-day" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                            🕯️ 디데이 계산하기 →
                        </Link>
                        <Link href="/calculator/life/discharge-day" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                            🪖 전역일 계산하기 →
                        </Link>
                        <Link href="/calculator/life/grade" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                            🎓 학점 계산하기 →
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
