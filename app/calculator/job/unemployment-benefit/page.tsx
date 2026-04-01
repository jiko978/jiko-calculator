import { Metadata } from "next";
import UnemploymentBenefit from "./UnemploymentBenefit";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../utils/seo";
import NavBar from "@/app/calculator/components/NavBar";
import JobMoreCalculators from "@/app/calculator/components/JobMoreCalculators";
import FAQ from "@/app/calculator/components/FAQ";

const BASE_URL = "https://jiko.kr";

export const metadata: Metadata = {
    title: "실업급여 계산기 | 2025 최신 고용보험법 기준 - JIKO 계산기",
    description: "2025년 최신 실업급여 지급액과 기간을 계산하세요. 피보험 단위기간 180일 확인부터 1일 최대 66,000원까지, 내 조건에 맞는 실업급여를 정밀하게 산출합니다.",
    keywords: ["실업급여 계산기", "2025 실업급여", "실업급여 하한액", "실업급여 상한액", "실업급여 신청방법", "고용보험 실업급여", "JIKO 계산기"],
    alternates: { canonical: `${BASE_URL}/calculator/job/unemployment-benefit` },
    openGraph: {
        title: "실업급여 계산기 | 2025 최신 고용보험법 기준",
        description: "내가 받을 수 있는 실업급여는 얼마일까요? 지급액과 기간을 정확하게 확인하세요.",
        url: `${BASE_URL}/calculator/job/unemployment-benefit`,
        images: [{ url: `${BASE_URL}/calculator/jiko-calculator-icon2.png`, width: 1200, height: 630, alt: "실업급여 계산기" }],
    },
};

const unemploymentFaqs = [
    {
        question: "실업급여 수급 조건과 대상은 어떻게 되나요?",
        answer: "주요 조건은 다섯 가지입니다: ① 고용보험 가입 기간(피보험 단위기간)이 180일 이상일 것, ② 일할 의사와 능력이 있음에도 취업하지 못한 상태일 것, ③ 재취업을 위한 노력을 적극적으로 할 것, ④ 퇴사 사유가 비자발적(권고사직, 계약만료 등)일 것, ⑤ 이직(퇴사) 다음 날부터 12개월 이내에 신청할 것."
    },
    {
        question: "자발적으로 퇴사해도 실업급여를 받을 수 있나요?",
        answer: "원칙적으로는 불가하지만, 정당한 사유(임금 체납 2개월 이상, 채용 시 조건과 실제 조건이 현저히 다른 경우, 왕따나 성희롱 등 괴롭힘, 3시간 이상 거리의 사업장 이전 등)가 증빙될 경우 예외적으로 수급이 가능합니다."
    },
    {
        question: "실업급여 신청은 어디서 하나요?",
        answer: "거주지 관할 고용복지+센터를 직접 방문하여 신청해야 합니다. 방문 전 '워크넷 구직등록'과 '온라인 수급자격 신청교육'을 미리 이수하면 대기 시간을 크게 줄일 수 있습니다."
    },
    {
        question: "부정수급 시 어떤 처벌을 받나요?",
        answer: "취업 사실을 숨기거나 허위로 구직 활동을 신고하여 급여를 받을 경우, 수급한 금액의 최대 5배까지 추가 징수될 수 있으며 5년 이하의 징역 또는 5천만 원 이하의 벌금 등 형사 처벌 대상이 됩니다."
    }
];

export default function UnemploymentBenefitPage() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        { name: "실업급여 계산기", item: "https://jiko.kr/calculator/job/unemployment-benefit" }
    ]);

    return (
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <NavBar title="실업급여 계산기" description="2025년 최신 고용보험 기준 실업급여 계산 도구" />

            <UnemploymentBenefit />

            {/* Content Area for SEO */}
            <div className="max-w-3xl mx-auto px-4 mt-2 space-y-12">

                {/* 6.1 실업급여 기본 안내 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">💡</span> 실업급여 계산기 안내
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-8">
                        2025년 최신 고용보험 요율과 상/하한액 기준을 적용하여, 퇴사 후 내가 받을 수 있는 <strong>예상 실업급여액</strong>과 <strong>지급 기간</strong>을 빠르고 정확하게 계산해드립니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <section>
                            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <span className="text-blue-500">✔</span> 사용 방법
                            </h3>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-3 font-medium list-none px-1">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>본인의 생년월일 8자리와 장애인 여부를 선택합니다.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>고용보험 가입 이력을 입력합니다. (최대 5개까지 합산 가능)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>퇴사 전 3개월간의 세전 월급을 입력합니다. (단위 버튼 활용)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>[계산하기]를 누르면 일액, 총액, 지급일수가 산출됩니다.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <span className="text-blue-500">⭐</span> 주요 특징
                            </h3>
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-3 font-medium list-none px-1">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span><strong>2025년 최신 기준</strong> 상한액(6.6만) / 하한액(6.4만) 반영</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>퇴사 시점 <strong>만 나이</strong>와 가입 기간별 지급일수 자동 산출</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>여러 회사를 옮긴 경우를 위한 <strong>가입 기간 합산</strong> 기능</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>복잡한 단위기간(180일)을 고려한 <strong>수급 자격 진단</strong> 서비스</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </section>

                {/* 실업급여 수급 조건 5계명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        📜 실업급여 수급 조건 및 대상
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                        {[
                            "고용보험 가입기간이 180일 이상",
                            "일할 의사와 능력이 있지만 취업하지 못한 상태",
                            "재취업을 위한 노력을 적극적으로 할 것",
                            "비자발적인 퇴사일 것",
                            "이직일(퇴사일) 다음 날로부터 12개월 내"
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-blue-500 font-bold">✔</span>
                                <span className="text-sm font-bold tracking-tight">{text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                            ※ 실업급여는 퇴직 전 3개월간의 평균 월급을 기준으로 산정되며, 퇴사 당시 나이와 가입 기간에 따라 지급 기간이 결정됩니다.
                        </p>
                    </div>
                </section>

                {/* 6.2 실업급여 받는 방법 */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 border-l-4 border-blue-500 pl-4">
                        🚶‍♂️ 실업급여 받는 방법 (7단계)
                    </h2>
                    <div className="relative space-y-4">
                        {[
                            { step: 1, title: "워크넷 구직등록", desc: "워크넷 홈페이지에서 본인의 이력을 등록하고 구직 신청을 완료합니다." },
                            { step: 2, title: "온라인 수급자격 신청교육 수강", desc: "고용보험 홈페이지에서 동영상 교육을 끝까지 이수합니다." },
                            { step: 3, title: "관할 고용센터 방문", desc: "교육 이수 후 14일 이내 신분증을 지참하여 거주지 관할 센터를 방문합니다." },
                            { step: 4, title: "수급자격인정 신청서 제출", desc: "현장에서 대상자 여부 확인 후 신청서를 작성하여 제출합니다." },
                            { step: 5, title: "약 2주 후 센터 재방문", desc: "취업희망카드를 발급받고 1차 실업인정을 받습니다." },
                            { step: 6, title: "적극적인 구직활동 진행", desc: "4주에 2회 이상 워크넷 등을 통해 구직 활동을 성실히 수행합니다." },
                            { step: 7, title: "구직활동 확인서 제출", desc: "지정된 실업인정일에 온라인 또는 방문으로 활동 내역을 증빙합니다." }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">{item.step}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ 및 다른 계산기 */}
                <FAQ faqList={unemploymentFaqs} />
                <JobMoreCalculators />
            </div>
        </main>
    );
}

