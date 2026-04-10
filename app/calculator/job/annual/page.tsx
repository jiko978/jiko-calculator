import { Metadata } from 'next';
import Annual from './Annual';
import FAQ from '@/app/calculator/components/FAQ';
import JobMoreCalculators from '@/app/calculator/components/JobMoreCalculators';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import NavBar from '@/app/calculator/components/NavBar';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

export const metadata: Metadata = {
    title: '연차 계산기 | 연차 발생일수 및 미사용 연차수당 계산 - JIKO 계산기',
    description: '입사일 및 회계기준별(1월 1일) 예상 연차 발생일수를 정확하게 계산하고, 미사용 시 지급받을 수 있는 세전 연차수당을 월 통상임금 기준으로 시뮬레이션 해보세요.',
    keywords: ['연차 계산기', '연차수당 계산기', '월차 계산기', '연차발생일수', '회계기준 연차', '미사용연차수당', 'JIKO 계산기'],
    openGraph: {
        title: '연차 계산기 | 연차 발생일수 및 미사용 연차수당 계산 - JIKO 계산기',
        description: '입사일 및 회계기준별(1월 1일) 예상 연차 발생일수를 정확하게 계산하고, 미사용 시 지급받을 수 있는 세전 연차수당을 시뮬레이션 해보세요.',
        type: 'website',
        url: 'https://jiko.kr/calculator/job/annual',
    }
};

const faqData = [
    {
        question: "근로기준법상 연차 발생 기준은 어떻게 되나요?",
        answer: "입사 1년 미만 근로자는 1개월 개근 시 1일의 유급휴가(최대 11일)가 발생합니다. 입사 1년 이상인 경우, 1년간 80% 이상 출근 시 15일의 유급휴가가 주어지며, 3년 이상 근속 시 매 2년마다 1일씩 가산되어 최대 25일의 연차가 발생합니다."
    },
    {
        question: "입사 1년차(월차)와 2년차 연차는 어떻게 다른가요?",
        answer: "입사 후 1년이 되기 전에 매월 발생하는 연차를 흔히 '월차'라고 부르며 최대 11일까지 발생합니다. 그리고 입사 딱 1년이 되는 시점에 15일의 '연차'가 추가로 발생하여, 최초 1년 근무 완료 시 총 26일(11일+15일)의 휴가 권리가 생깁니다."
    },
    {
        question: "미사용 연차수당은 어떻게 계산하나요?",
        answer: "근로기준법상 미사용 연차수당은 '1일 통상임금'의 100%를 지급하는 것이 원칙입니다.\n\n[1일 통상임금 산정식]\n월 통상임금 ÷ 209시간(주 40시간 기준) × 8시간\n\n예를 들어 월 통상임금이 300만원이고 5일이 남았다면, (3,000,000 ÷ 209 × 8) × 5일 = 약 574,162원 (세전)이 지급됩니다."
    },
    {
        question: "입사일 기준과 회계연도 기준은 무슨 차이인가요?",
        answer: "근로기준법의 원칙은 근로자 개인의 '입사일'을 기준으로 연차를 부여하는 것입니다. 하지만 전 직원의 입사일이 달라 관리가 어려울 경우, 회사는 '회계연도(보통 1월 1일)' 기준으로 모든 직원의 연차를 일괄 부여할 수 있습니다. 단, 퇴사 시점에 근로자에게 입사일 기준보다 회계연도 기준이 불리할 경우 유리한 쪽으로 보전해 주어야 합니다."
    },
    {
        question: "연차수당 지급 기한은 언제까지인가요?",
        answer: "퇴직으로 인해 발생하는 미사용 연차수당은 원칙적으로 퇴사일(혹은 발생일)로부터 14일 이내에 지급해야 합니다. 임금 체불에 해당하지 않도록 합의 시 지급 기한을 연장할 수는 있습니다."
    }
];

export default function AnnualLeavePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "연차/연차수당 계산기",
        "description": "입사일 및 회계기준별(1월 1일) 예상 연차 발생일수를 체계적으로 계산하고 세전 미사용 연차수당을 알아봅니다.",
        "applicationCategory": "FinanceApplication",
        "url": "https://jiko.kr/calculator/job/annual",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KRW"
        }
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.JOB_HOME,
        COMMON_BREADCRUMBS.ANNUAL
    ]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            
            <NavBar title="연차 계산기" description="연차 발생일수 및 미사용 연차수당 계산" position="top" />
            <Annual />

            <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🌴</span> 연차 계산기 및 산정 기준 안내
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        내 연차는 도대체 몇 개일까? 헷갈리는 연차 발생 일수를 2025년 근로기준법 최신 기준에 맞춰 투명하게 계산해 드립니다. 입사일 기준과 회계연도 기준 모두를 지원하며, 남은 연차에 대해 회사가 지급해야 할 예상 미사용 연차수당(세전)까지 한 번에 시뮬레이션 할 수 있습니다. 지금 바로 똑똑하게 내 휴가 권리를 챙겨보세요!
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>운영 기준 선택:</strong> 사규에 맞게 '입사일 기준' 또는 '회계연도(1월 1일)'를 선택합니다.</li>
                            <li><strong>입사일 입력:</strong> 정확한 근무 시작일을 입력하세요.</li>
                            <li><strong>사용 연차:</strong> 소비한 연차 일수를 누적 기입합니다.</li>
                            <li><strong>월 통상임금:</strong> 정보를 입력하면 미사용 연차수당 예상 환산액이 표기됩니다.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">📝</span> 계산 예시
                        </h2>
                        <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-gray-400 mb-1">입사 1년 만근 (1년 1일차)</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">총 발생 연차액: 26일 (월차11+기본15)</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                                <p className="text-gray-400 mb-1">통상임금 300만 원 / 연차 5일 미사용</p>
                                <p className="font-bold text-gray-700 dark:text-gray-200">예상 미사용 수당: 574,160원</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-left border border-red-100 dark:border-red-900/10">
                    <span className="text-red-500 text-xs leading-relaxed block">
                        ※ 본 자동 계산 결과는 근로기준법 기본 산식에 기반하지만, 기업별 취업규칙(특별휴가, 포괄임금제 등)에 따라 실지급액 등 세부 내용이 다를 수 있으므로 법적 증빙 효력이 없습니다.
                    </span>
                </div>

                <FAQ faqList={faqData} />
                <JobMoreCalculators />
                <InstallBanner />
            </main>
        </div>
    );
}
