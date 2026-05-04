import { Metadata } from 'next';
import Comprehensive from './Comprehensive';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '종합부동산세 계산기 | 종부세 공시가격 인별 합산 세금 자동 계산 - JIKO 계산기',
  description: '공시가격과 1세대 1주택 기본 공제(12억), 고령자 및 장기보유 세액 공제를 매년 최신 세법에 맞춰 종합부동산세(종부세)를 계산해 드립니다.',
  keywords: ['종합부동산세 계산기', '종부세 계산기', '1세대 1주택 종부세', '공시가격 종부세', '고령자 세액공제', '장기보유 세액공제', '재산세 중복분'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/comprehensive` },
  openGraph: {
    title: '종합부동산세 계산기 | 종부세 공시가격 인별 합산 세금 자동 계산 - JIKO 계산기',
    description: '공시가격과 1세대 1주택 기본 공제(12억), 고령자 및 장기보유 세액 공제를 매년 최신 세법에 맞춰 종합부동산세(종부세)를 계산해 드립니다.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/comprehensive`,
  },
};

const faqList = [
  { question: '종합부동산세(종부세) 부과 기준은 뭔가요?', answer: '매년 6월 1일(과세기준일) 현재, 국내에 위치한 주택과 토지의 공시가격 합해서 1세대 1주택자는 12억 원, 그 외 일반은 9억 원(법인은 공제 없음)을 초과하는 경우 부과됩니다.' },
  { question: '공동명의가 단일명의보다 종부세 절감에 좋은가요?', answer: '부부 공동명의인 경우 각각 9억 원씩 총 18억 원까지 기본 공제를 받을 수 있어 종부세 대상에서 빠지거나 세액이 현저히 줄어드는 경우가 많습니다. 단, 1세대 1주택 단독명의(12억원 공제+세액공제 최대 80%)가 더 유리한 역전 구간도 존재하므로 비교가 필요합니다.' },
  { question: '재산세 중복분 차감이 무엇인가요?', answer: '종합부동산세 과세표준 구간은 이미 재산세명목으로도 부과된 금액(이중과세)이므로, 납세자 보호를 위해 종부세액 산출 시 그 겹친 부분만큼의 재산세액을 차감해 주는 것을 의미합니다.' },
  { question: '고령자 및 장기보유 세액 공제는 누구만 받나요?', answer: '1세대 1주택자(부부 공동명의 1주택 특례 신청자 포함)에 한해서만 중복 적용이 가능합니다. 최대 나이 40%, 보유연수 50%를 적용받아 합산 최대 80% 한도 내에서 종부세를 파격적으로 경감받을 수 있습니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "종합부동산세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/comprehensive`,
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
  "name": "종합부동산세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/comprehensive`,
  "description": metadata.description as string
};

export default function ComprehensiveTaxPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.COMPREHENSIVE_TAX,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="종부세 계산기" description="공시가격과 1세대 1주택 기본 공제(12억), 고령자 및 장기보유 세액 공제를 매년 최신 세법에 맞춰 종합부동산세(종부세)를 계산해 드립니다." position="top" />

      <Comprehensive />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6 mt-8">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">🏛️</span> 종부세 계산기 가이드
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>과세표준 산정</strong> : 보유하신 주택(들)의 전국 합산 공시가격에서 기본 공제액(1주택자 12억, 다주택자 개인별 9억)을 차감하고, 거기에 공정시장가액비율(60%)을 곱하는 방식입니다. 만약 12억 주택을 가진 1주택자라면 초과분이 없으므로 0원입니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>세액 공제 및 부가세</strong> : 1주택 산출세액에서 <strong>재산세 중복분</strong>을 차감하고, 최종 금액에서 최대 80%의 고령자/장기보유 세액 공제를 빼줍니다. 이 최종 종부세액에 20%의 <strong>농어촌특별세</strong>를 합산하여 최종 고지됩니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>사용자가 소유한 부동산의 공시가격을 입력하세요.</li>
              <li>본인이 1세대 1주택 자격 요건을 유지 중인지 선택합니다.</li>
              <li>1주택자라면 자신의 나이 구간과 연속 보유 기간을 선택합니다. (한도 80% 공제)</li>
              <li>공동명의(부부 등)일 경우 본인의 소유 지분비율을 입력하여 개인별 세액을 검증합니다.</li>
            </ul>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 flex items-center gap-2">
              <span className="text-red-500">🚨</span> 주의사항
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>납부할 종부세액(농특세 제외)이 250만 원 초과 시에는 6개월(12.15~다음 해 6.15) 동안 2차 분할납부가 허용됩니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">공시가격 15억 (1주택 단독, 65세 이상, 10년 이상 보유)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 15억 - 12억 = 3억 차액 * 60% = 과표 1.8억. <br />산출된 세금에서 70% 세액할인 적용 후, 농특세 합산 부과 (종부세 실납부액 대폭 하락)</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">공시가격 13억 (부부 공동명의 5:5)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 인별 자산가치가 6.5억씩 매핑. 개인별 기본공제선인 9억에 둘 다 미달하므로 양쪽 모두 종부세 0원 전액 면제.</p>
              </div>
            </div>
          </section>
        </div>

        {/* 3. 추가 카드 세션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-cyan-500">🏙️</span> 재산세와의 차이점
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>재산세는 부동산 소유자라면 누구나 내는 지방세이지만, 종부세는 다릅니다.</p>
              <p className="bg-cyan-50 dark:bg-cyan-900/10 p-3 rounded-xl text-cyan-700 dark:text-cyan-300">
                종합부동산세는 전국 부동산 <strong>공시가격 합계액이 일정 기준을 초과</strong>하는 사람만 내는 '국세'입니다.
              </p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-teal-500">👥</span> 부부 공동명의 혜택
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <p>종부세는 인별로 과세되므로, 부부가 공동명의로 소유하면 공제액도 각각 적용됩니다.</p>
              <p className="bg-teal-50 dark:bg-teal-900/10 p-3 rounded-xl text-teal-700 dark:text-teal-300">
                단, 1주택 단독명의 고령자 세액공제가 더 유리한 경우가 있으므로 <strong>유불리 비교</strong>가 필수입니다.
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
