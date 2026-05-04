import type { Metadata } from "next";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import DDayCalculator from "./DDay";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "디데이 계산기 | 기념일 · 시험 · 생일 · 목표일 d-day 계산 - JIKO 계산기",
    description: "중요한 날까지 남은 기간을 D-day로 확인하거나, 특정 일수 전후의 날짜를 계산해보세요. 100일, 1주년 등 주요 기념일 자동 계산 기능도 제공합니다.",
    keywords: ["디데이 계산기", "D-day 계산", "기념일 계산기", "수능 디데이", "커플 디데이", "날짜 계산", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/d-day` },
    openGraph: {
        title: "디데이 계산기 | 기념일 · 시험 · 생일 · 목표일 d-day 계산 - JIKO 계산기",
        description: "중요한 날까지 남은 기간을 D-day로 확인하거나, 특정 일수 전후의 날짜를 계산해보세요. 100일, 1주년 등 주요 기념일 자동 계산 기능도 제공합니다.",
        url: `${BASE_URL}/calculator/life/d-day`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "디데이 계산기" }],
    },
};

const faqList = [
    {
        question: "디데이 계산 시 '기준일'도 포함되나요?",
        answer: "일반적으로 기념일 계산 방식에 따라 다릅니다. '그날부터 1일'인 커플 기념일은 기준일을 포함하고, 시험이나 목표일 등 남은 기간을 잴 때는 기준일을 제외하고 계산합니다. JIKO 계산기는 두 방식을 모두 명확히 안내해 드립니다."
    },
    {
        question: "음력 날짜로 디데이를 계산할 수 있나요?",
        answer: "현재 JIKO 디데이 계산기는 양력 날짜를 기준으로 합니다. 음력 기념일(생일, 제사 등)의 경우 매년 양력 날짜가 바뀌므로 확인된 양력 날짜를 입력하여 계산해 주세요."
    },
    {
        question: "D-Day와 D+Day의 차이는 무엇인가요?",
        answer: "D-Day는 목표일까지 남은 일수를 나타내며, D+Day는 목표일로부터 며칠이 지났는지를 나타내는 기점 방식입니다."
    }
];

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "디데이 계산기",
    description: metadata.description as string,
    url: `${BASE_URL}/calculator/life/d-day`,
    applicationCategory: "UtilityApplication",
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
    "name": "디데이 계산기",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "url": `${BASE_URL}/calculator/life/d-day`,
    "description": metadata.description as string
};

export default function DDayPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        COMMON_BREADCRUMBS.D_DAY
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <NavBar title="디데이 계산기" description="중요한 날까지 남은 기간을 D-day로 확인하거나, 특정 일수 전후의 날짜를 계산해보세요. 100일, 1주년 등 주요 기념일 자동 계산 기능도 제공합니다." position="top" />
            <DDayCalculator />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
                {/* 1. 메뉴 설명 (계산기 가이드) */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🕯️</span> 디데이 계산 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        JIKO 디데이 계산기는 수능, 결혼, 기념일 등 목표일까지 남은 일수나 기준일로부터 지난 일수를 정확하게 계산해 줍니다. 1일 포함 여부 등 일상에서 사용하는 다양한 방식에 맞춰 디데이를 관리할 수 있습니다.
                    </p>
                </section>

                {/* 2. 사용 방법 / 계산 예시 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📖</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>계산할 <strong>기준일</strong>과 <strong>목표일</strong>을 선택합니다.</li>
                            <li>또는 기준일로부터 <strong>더하거나 뺄 일수</strong>를 직접 입력합니다.</li>
                            <li>목표일까지 남은 <strong>D-Day</strong>나 지난 일수를 즉시 확인합니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📝</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl space-y-2">
                            <p className="font-bold text-amber-700 dark:text-amber-300">"수능까지 며칠 남았지?"</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>기준일 :</strong> 오늘 날짜</li>
                                <li><strong>목표일 :</strong> 수능 당일 날짜</li>
                                <li className="font-bold text-blue-600 dark:text-blue-400">결과 : D-150 (150일 남음)</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* 3. 계산 팁 */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                        디데이 계산 팁
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-pink-600 dark:text-pink-400 mb-2">💘 커플 기념일</p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">연인과의 만남은 보통 '그날부터 1일'을 선호하지만, 순수한 디데이 형식은 기준일 다음 날을 1일로 계산합니다.</p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400 mb-2">🎓 시험 D-Day</p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">수업, 시험 등 중요한 날은 목표일 자체를 0으로 봅니다. 목표일이 지나면 D+1 형식으로 자동 전환됩니다.</p>
                        </div>
                    </div>
                </div>

                {/* 4. 추가 카드 세션 (기념일 / 목표일) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-pink-500">💕</span> 기념일(1일 포함)
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>연인이나 특정 기점을 축하할 때는 그날을 1일로 포함합니다.</p>
                            <p className="bg-pink-50 dark:bg-pink-900/10 p-3 rounded-xl text-pink-700 dark:text-pink-300">예 : 1월 1일 커플 탄생 → 1월 100일째는 4월 10일</p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">🎯</span> 목표일(0일 기준)
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>수능, 결혼식, 여행 등은 남은 일수(D-Day)를 중요시합니다.</p>
                            <p className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl text-blue-700 dark:text-blue-300">예 : 시험 전날 = D-1, 시험 당일 = D-Day</p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <LifeMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
