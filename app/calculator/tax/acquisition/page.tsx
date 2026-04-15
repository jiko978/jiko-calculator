import { Metadata } from 'next';
import Acquisition from './Acquisition';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '취득세 계산기 | 아파트 분양권 생애최초 부동산 취득세 자동 계산 - JIKO 계산기',
  description: '주택, 상가, 토지 등 부동산 취득 시 납부해야 하는 취득세를 최신 세법으로 계산합니다. 생애최초 주택 구입 감면, 조정대상지역 중과세 등을 버튼 클릭 하나로 확인할 수 있습니다.',
  keywords: ['취득세 계산기', '아파트 취득세 계산기', '부동산 취득세', '생애최초 취득세 감면', '조정지역 취득세 중과세', '오피스텔 취득세', '상가 취득세'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/acquisition` },
  openGraph: {
    title: '취득세 계산기 | 아파트 분양권 생애최초 부동산 취득세 자동 계산 - JIKO 계산기',
    description: '주택, 상가, 토지 등 부동산 취득 시 납부해야 하는 취득세를 최신 세법으로 계산합니다. 생애최초 주택 구입 감면, 조정대상지역 중과세 등을 버튼 클릭 하나로 확인할 수 있습니다.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/acquisition`,
  },
};

const faqList = [
  { question: '취득세란?', answer: '부동산, 차량, 기계장비 등 자산을 취득한 자에게 부과되는 지방세입니다. \'취득\'이란 매매, 교환, 상속, 증여 등 유·무상의 모든 취득을 의미합니다.' },
  { question: '취득세 신고 기한은 언제인가요?', answer: '취득한 날(잔금지급일 기준)로부터 60일 이내에 신고하고 납부해야 합니다. 상속의 경우 상속개시일이 속하는 달의 말일부터 6개월 이내입니다. 기한을 넘기면 무신고/납부지연 가산세가 발생합니다.' },
  { question: '생애최초 주택 구입 시 혜택은?', answer: '실거래가 12억원 이하 주택을 처음으로 구입할 경우 소득 제한 없이 200만원 한도 내에서 취득세를 100% 감면받을 수 있습니다.' },
  { question: '조정대상지역 다주택 취득세 중과세가 뭔가요?', answer: '부동산 투기를 억제하기 위해 조정대상지역의 2주택, 혹은 비조정지역의 3주택 이상을 취득할 때 1~3%의 기본세율 대신 8%나 12%의 매우 높은 중과세율이 적용되는 것을 의미합니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "취득세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/acquisition`,
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
  "name": "취득세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/acquisition`,
  "description": metadata.description as string
};

export default function AcquisitionTaxPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.ACQUISITION,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="취득세 계산기" description="주택, 상가, 토지 등 부동산 취득 시 납부해야 하는 취득세를 최신 세법으로 계산합니다. 생애최초 주택 구입 감면, 조정대상지역 중과세 등을 버튼 클릭 하나로 확인할 수 있습니다." position="top" />
      <Acquisition />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">📑</span> 취득세 부과 구조 안내
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>기본 체계</strong> : 취득세는 단순히 순수 &apos;취득세&apos;뿐만 아니라 그 금액의 10%에 해당하는 <strong>지방교육세</strong>, 그리고 전용면적 85㎡ (국민주택규모) 초과 시 부과되는 <strong>농어촌특별세(0.2%)</strong>의 3종 세금 합산액으로 구성됩니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>생애최초 주택 구입 감면</strong> : 대한민국 국민이 처음으로 가구의 주택을 구입할 때는 취득세율 산출 금액에서 최대 200만원 한도로 세금을 100% 한시 감면해 줍니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>부동산의 종류(주택, 상가, 토지 등)와 취득 방식(매매, 증여, 상속)을 선택합니다.</li>
              <li>주택일 경우 다주택 점검을 위해 본인 소유의 주택 수를 지정합니다.</li>
              <li>평수 제한에 따른 농특세 부과 여부 판별을 위해 면적을 선택합니다.</li>
              <li>취득가액(매수금액 또는 시가표준액)을 입력한 뒤 [계산하기] 버튼을 누릅니다.</li>
            </ul>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 flex items-center gap-2">
              <span className="text-red-500">🚨</span> 주의사항
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>취득일부터 60일(상속은 6개월)의 기한 내 미신고 시 가산세 패널티가 붙습니다.</li>
              <li>생애최초 감면은 취득 후 다른 사유로 인한 전입신고 불이행 시 감면 취소 또는 추징될 위험이 있습니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">비조정 지역 6억 아파트 매수 (1주택, 85㎡ 이하)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 취득세 600만(1%) + 지방교육세 60만(0.1%) = 660만원</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">위 조건이되 생애최초 주택 매수라면?</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 산출된 취득세 600만원 - 200만원 전액 감면 = 실 납부 취득세 400만원 (교육세 연동 할인)</p>
              </div>
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
