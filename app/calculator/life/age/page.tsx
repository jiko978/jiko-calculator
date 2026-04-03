import type { Metadata } from "next";
import Age from "./Age";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import FAQ from "@/app/calculator/components/FAQ";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "나이 계산기 | 만 나이 · 연 나이 · 띠 · 법적 권리 확인 - JIKO 계산기",
    description: "출생 연월일을 입력하여 현재 나의 만 나이, 연 나이, 세는 나이와 띠를 확인하세요. 각 나이별 법적 권리와 의무 변화를 한눈에 보여드립니다.",
    keywords: ["나이 계산기", "만 나이", "연 나이", "한국 나이", "띠 계산기", "성인 나이", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/life/age` },
    openGraph: {
        title: "나이 계산기 | 나의 정확한 만 나이와 법적 권리 확인",
        description: "나는 지금 무엇을 할 수 있는 나이일까요? 정확한 만 나이와 사회적 마일스톤을 확인하세요.",
        url: `${BASE_URL}/calculator/life/age`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "나이 계산기" }],
    },
};

const faqList = [
    {
        question: "만 나이와 연 나이의 차이는 무엇인가요?",
        answer: "만 나이는 생일의 경과 여부를 따지는 공식적인 나이이며, 연 나이는 단순히 '현재 연도 - 출생 연도'를 계산한 나이입니다. 병역법이나 청소년보호법에서는 연 나이를 기준으로 삼는 경우가 많습니다."
    },
    {
        question: "띠는 언제 바뀌나요?",
        answer: "일반적으로 띠는 음력 설(구정) 또는 입춘을 기준으로 바뀝니다. JIKO 나이 계산기는 입춘을 기준으로 띠를 더욱 정밀하게 안내해 드립니다."
    },
    {
        question: "만 나이 통일법이 시행되었는데 세는 나이는 안 쓰나요?",
        answer: "사회적으로는 여전히 관습적으로 세는 나이(태어나자마자 1살)를 사용하지만, 공문서나 법적 절차에서는 모두 '만 나이'를 사용하도록 법이 개정되었습니다."
    }
];

export default function AgePage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.LIFE_HOME,
        { name: "나이 계산기", item: `${BASE_URL}/calculator/life/age` }
    ]);

    const softwareLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "JIKO 나이 계산기",
        description: "만 나이, 연 나이, 띠 및 생애 주기별 법적 권리 안내 서비스",
        url: `${BASE_URL}/calculator/life/age`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />

            <NavBar title="나이 계산기" description="정확한 만 나이와 법적 권리를 확인하세요." position="top" />
            <Age />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🎂</span> 나이 계산기 가이드
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        현행법상 공식적인 나이는 <strong>'만 나이'</strong>로 통일되었으나, 일상생활과 특정 법률(병역법, 청소년보호법 등)에서는 여전히 '연 나이'가 활용됩니다. JIKO 나이 계산기는 복잡한 나이 체계를 한눈에 비교하고, 각 나이별로 변화하는 법적 권리 정보를 제공합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>본인의 <strong>생년월일 8자리</strong>를 정확히 입력합니다.</li>
                            <li>나이를 알고 싶은 <strong>기준일</strong>을 설정합니다.</li>
                            <li>[나이 계산하기] 버튼을 누르면 만/연/세는 나이를 확인합니다.</li>
                            <li>하단 <strong>마일스톤</strong>에서 주요 입학 및 자격 취득 시점을 봅니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                            <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">2000년 5월 20일생 기준 (2025년 기준)</p>
                            <p>• 만 나이 : <strong>25세</strong> (생일 경과)</p>
                            <p>• 연 나이 : 25세 (2025 - 2000)</p>
                            <p>• 세는 나이 : 26세</p>
                            <p className="mt-2 font-bold text-amber-600 dark:text-amber-400">띠 : 용띠 🐲</p>
                        </div>
                    </section>
                </div>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        ⚖️ 주요 연령별 법적 기준
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-blue-600 mb-1">만 18세 미만</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 가입 및 시청 제한 (청소년 보호)</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 유해업소 출입 및 고용 금지</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-600 mb-1">만 18세 이상</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 선거권 및 피선거권 행사 가능</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 운전면허(제1종, 2종 보통) 취득</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-blue-600 mb-1">만 19세 이상</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 민법상 성인 (독자적 계약 가능)</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 연 19세부터 술, 담배 구매 가능</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-600 mb-1">만 60세 ~ 65세</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 만 60세 : 법정 정년 도달</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">• 만 65세 : 기초연금 및 경로 우대</p>
                            </div>
                        </div>
                    </div>
                </section>

                <FAQ faqList={faqList} />
                <LifeMoreCalculators />
            </main>
        </div>
    );
}
