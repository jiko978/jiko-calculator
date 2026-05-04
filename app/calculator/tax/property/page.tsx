import { Metadata } from 'next';
import Property from './Property';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '재산세 계산기 | 아파트 주택 토지 보유 부동산 세금 자동 계산 - JIKO 계산기',
  description: '공시지가와 1세대 1주택 혜택 여부, 공동명의 지분에 따라 주택, 상가, 토지의 재산세(도시지역분 포함)를 정확하게 계산해드립니다.',
  keywords: ['재산세 계산기', '아파트 재산세 계산기', '오피스텔 재산세', '재산세율', '재산세 도시지역분', '1세대1주택 재산세', '공동명의 재산세'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/property` },
  openGraph: {
    title: '재산세 계산기 | 아파트 주택 토지 보유 부동산 세금 자동 계산 - JIKO 계산기',
    description: '공시지가와 1세대 1주택 혜택 여부, 공동명의 지분에 따라 주택, 상가, 토지의 재산세(도시지역분 포함)를 정확하게 계산해드립니다.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/property`,
  },
};

const faqList = [
  { question: '재산세 과세 대상 및 부과 기준일은 언제인가요?', answer: '재산세는 매년 6월 1일 현재 재산을 사실상 소유하고 있는 자에게 부과됩니다. 6월 1일에 소유권 등기를 마쳤다면 당해 연도 귀속 재산세는 매수자가 납부해야 합니다.' },
  { question: '재산세 고지서가 두 번 나오는데 왜 그런가요?', answer: '주택(아파트 등)의 경우 재산세액이 20만원을 초과하면 납부자의 부담을 줄이기 위해 7월(1기분)과 9월(2기분)에 세액을 절반씩 나누어 일괄 고지합니다. (20만원 이하는 7월 전액 부과)' },
  { question: '1세대 1주택 특례가 무엇인가요?', answer: '1세대 1주택자가 소유한 공시가격 9억원 이하 주택에 한해, 과세표준을 산정하는 공정시장가액비율 인하 혜택 및 구간별 0.05%p 인하된 특례 세율을 적용받아 세금이 크게 줄어드는 제도입니다.' },
  { question: '공동명의가 재산세 절세에 유리한가요?', answer: '재산세는 물건(부동산 자체) 가액을 기준으로 과세표준을 구한 뒤 지분별로 나뉘어 고지되므로, 종합부동산세와 달리 단독명의와 공동명의 간 재산세(본세) 총액 자체의 차이는 거의 없습니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "재산세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/property`,
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
  "name": "재산세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/property`,
  "description": metadata.description as string
};

export default function PropertyTaxPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.PROPERTY_TAX,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="재산세 계산기" description="공시지가와 1세대 1주택 혜택 여부, 공동명의 지분에 따라 주택, 상가, 토지의 재산세(도시지역분 포함)를 정확하게 계산해드립니다." position="top" />

      <Property />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6 mt-8">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span> 재산세 계산기 가이드
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>기본 체계</strong> : 재산세는 매년 당해 부동산의 공시가격(시가표준액)에 <strong>공정시장가액비율(명목상 주택 60%, 토지/상가 70%)</strong>을 곱하여 나온 '과세표준' 금액을 바탕으로 구간별 0.1% ~ 0.4% 의 누진 세율체계로 부과됩니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>추가 부가세 액수</strong> : 순수 재산세 외에도, 재산세의 20%에 해당하는 <strong>지방교육세</strong>와 도시계획 구역 안의 부동산에 부과되는 <strong>도시지역분(과표의 0.14%)</strong>, 그리고 건물 등 일부 자산의 <strong>지역자원시설세</strong>가 합산 청구됩니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>부동산 대상(주택, 상가/건물, 토지 등)을 선택합니다.</li>
              <li>주택일 경우 본인이 1세대 1주택 대상자인지 체크합니다. (세율 0.05%p 인하 혜택)</li>
              <li>당해 연도의 부동산 공시가격(시가표준액)을 정확히 입력합니다.</li>
              <li>공동명의일 경우 본인의 보유 지분율을 입력하여 부과될 인별 세액을 산출합니다.</li>
              <li>도시지역분 등 부가세금 포함 여부를 선택하여 최종 고지액을 확인합니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">공시가격 5억 아파트 (1주택자 단독명의)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 특례비율(45%) 과표 2.25억 반영 → 재산세(약 12만) + 교육세/도시지역분 = 약 56만원 내외 산출</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">공시가격 5억 아파트 (2주택자 단독명의)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과 : 표준비율(60%) 과표 3.0억 반영 → 재산세(약 57만) + 과표증가에 따른 부가세 합계 급증 = 약 110만원 부과</p>
              </div>
            </div>
          </section>
        </div>

        {/* 3. 추가 카드 세션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-rose-500">📆</span> 과세기준일 (6월 1일)
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>재산세는 매년 <strong>6월 1일 현재</strong> 부동산을 실소유하고 있는 사람에게 1년 치가 모두 부과됩니다.</p>
              <p className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl text-rose-700 dark:text-rose-300">
                부동산 매매 시 잔금 지급일이 6월 1일 이전인지 이후인지에 따라 납세 의무자가 완전히 달라집니다.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💳</span> 재산세 분할 납부
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>재산세 납부 세액이 250만 원을 초과한다면 분할 납부 제도를 이용할 수 있습니다.</p>
              <p className="bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-xl text-indigo-700 dark:text-indigo-300">
                납부 기한이 지난 날부터 <strong>2개월 이내에 세액의 일부를 분납</strong>하여 목돈 부담을 줄여보세요.
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
