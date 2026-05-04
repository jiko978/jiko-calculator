import { Metadata } from 'next';
import CapitalGains from './CapitalGains';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '양도소득세 계산기 | 1세대 1주택 비과세/다주택 중과 자동 계산 - JIKO 계산기',
  description: '부동산을 매도할 때 양도차익에 대해 부과되는 세금을 계산합니다. 1세대1주택 비과세 여부, 장기보유특별공제율, 다주택 중과세 등을 최신 세법 기준으로 바로 확인해보세요.',
  keywords: ['양도소득세 계산기', '양도세 계산기', '1세대 1주택 비과세', '장기보유특별공제', '다주택자 양도세 중과', '부동산 세금 계산기'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/capital-gains` },
  openGraph: {
    title: '양도소득세 계산기 | 1세대 1주택 비과세/다주택 중과 자동 계산 - JIKO 계산기',
    description: '부동산을 매도할 때 양도차익에 대해 부과되는 세금을 계산합니다. 1세대1주택 비과세 여부, 장기보유특별공제율, 다주택 중과세 등을 최신 세법 기준으로 바로 확인해보세요.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/capital-gains`,
  },
};

const faqList = [
  { question: '양도소득세란?', answer: '양도소득세는 부동산(주택, 토지, 상가), 주식, 분양권 등 자산을 양도할 때 발생하는 소득에 대해 부과되는 국세입니다.' },
  { question: '일시적 2주택자 비과세가 가능한가요?', answer: '네, 이사를 위해 일시적으로 2주택이 된 경우 종전 주택을 일정 기간(보통 3년) 내에 처분하면 1주택으로 간주하여 비과세 혜택을 받을 수 있습니다.' },
  { question: '인테리어 비용은 모두 공제되나요?', answer: '아닙니다. 발코니 확장, 샤시 교체 등 집의 가치를 높이는 \'자본적 지출\'만 인정되며, 도배나 장판 등 단순 소모성 수리비는 제외됩니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "양도소득세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/capital-gains`,
  applicationCategory: "FinanceApplication",
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
  "@type": "WebApplication",
  "name": "양도소득세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/capital-gains`,
  "description": metadata.description as string
};

export default function CapitalGainsPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.CAPITAL_GAINS,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="양도소득세 계산기" description="부동산을 매도할 때 양도차익에 대해 부과되는 세금을 계산합니다. 1세대1주택 비과세 여부, 장기보유특별공제율, 다주택 중과세 등을 최신 세법 기준으로 바로 확인해보세요." position="top" />
      <CapitalGains />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏠</span> 양도소득세 계산기 가이드
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>1세대 1주택 비과세</strong> : 실거래가 12억 원 이하의 1주택(2년 보유, 조정대상지역의 경우 2년 거주 요건 충족)을 양도할 경우 양도세를 납부하지 않습니다. 12억 초과분은 비율에 따라 과세됩니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>장기보유특별공제</strong> : 3년 이상 보유한 자산에 대해 물가 상승에 따른 명목소득 부담을 덜어주기 위해 양도차익의 일정 비율을 공제해주는 혜택입니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>매도할 자산의 종류(주택, 상가 등)와 취득가액, 양도가액을 입력합니다.</li>
              <li>인테리어, 취득세 등 자산 가치 증가에 쓰인 필요경비를 입력합니다.</li>
              <li>보유기간과 1세대 1주택 비과세 여부를 체크합니다.</li>
              <li>공동명의 여부와 필요 옵션을 선택한 뒤 [계산하기] 버튼을 누릅니다.</li>
            </ul>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 flex items-center gap-2">
              <span className="text-red-500">🚨</span> 주의사항
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>양도소득세는 양도일이 속하는 달의 말일부터 2개월 이내에 예정신고를 해야 가산세를 피할 수 있습니다.</li>
              <li>조정대상지역 내 다주택자는 장기보유특별공제가 배제되거나 세율이 중과될 수 있으니 반드시 전문 세무사와 상담이 필요합니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">5억 아파트를 10년 보유(5년 거주) 후 10억에 매각</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 1주택 비과세(12억 이하) 요건 충족으로 양도소득세 0원 산출.</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">기본공제(연 250만원)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">1년에 한 번, 먼저 신고하는 자산에 한해 양도소득금액에서 250만원이 자동 공제됩니다.</p>
              </div>
            </div>
          </section>
        </div>

        {/* 3. 추가 카드 세션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-blue-500">🏠</span> 1세대 1주택 비과세 요건
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>1세대가 국내에 1주택을 보유하고 <strong>2년 이상 보유</strong>한 경우 비과세 혜택을 받습니다.</p>
              <p className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl text-blue-700 dark:text-blue-300">
                조정대상지역 내 주택이라면 2년 거주 요건이 추가되며, 실거래가 12억 원 초과분은 과세됩니다.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-green-500">📉</span> 장기보유 특별공제
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>보유 기간이 3년 이상인 부동산에 대해 물가 상승을 반영하여 양도차익의 일부를 공제합니다.</p>
              <p className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl text-green-700 dark:text-green-300">
                1세대 1주택자의 경우 <strong>보유 및 거주 기간에 따라 최대 80%</strong>까지 세액을 획기적으로 줄일 수 있습니다.
              </p>
            </div>
          </section>
        </div>

        <FAQ faqList={faqList} />
        <TaxMoreCalculators />
        <InstallBanner />
      </main>
    </div>
  );
}
