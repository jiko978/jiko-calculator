import { Metadata } from 'next';
import Car from './Car';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '자동차세 계산기 | 연납 할인 차령 경감 전기차 세금 자동 계산 - JIKO 계산기',
  description: '승용차, 화물차, 전기차 등 차종과 배기량에 따른 자동차세를 계산합니다. 차령 감면(최대 50%) 및 연납 할인(최대 4.5%) 로직이 모두 반영된 정확한 결과를 확인하세요.',
  keywords: ['자동차세 계산기', '자동차세 연납 할인', '전기차 자동차세', '차령 경감률', '배기량 자동차세', '신차 취득세'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/car` },
  openGraph: {
    title: '자동차세 계산기 | 연납 할인 차령 경감 전기차 세금 자동 계산 - JIKO 계산기',
    description: '승용차, 화물차, 전기차 등 차종과 배기량에 따른 자동차세를 계산합니다. 차령 감면(최대 50%) 및 연납 할인(최대 4.5%) 로직이 모두 반영된 정확한 결과를 확인하세요.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/car`,
  },
};

const faqList = [
  { question: '자동차세는 일년에 몇 번 내나요?', answer: '기본적으로 1년에 2번(6월, 12월) 나누어서 냅니다. 단, 연세액이 10만원 이하인 차량(예: 모닝, 스파크 등 경차 일부)은 6월에 한 번에 부과됩니다.' },
  { question: '연납 할인이 무엇인가요?', answer: '1년 치 세금을 미리 한꺼번에 신고하고 납부하면 일정 비율을 세액 공제해주는 제도입니다. 1월에 내는 것이 할인 폭(약 4.58%)이 가장 큽니다.' },
  { question: '전기차는 배기량이 없는데 세금을 어떻게 계산하나요?', answer: '전기차 및 수소차 등 친환경 차량은 배기량과 관계없이 지방세법에 따라 \'그 밖의 승용차\'로 분류되어 차령에 상관없이 지방교육세 포함 연간 정액 약 13만원이 부과됩니다.' },
  { question: '차가 오래되면 세금이 줄어드나요?', answer: '승용차의 경우 차령이 3년이 되는 해부터 매년 5%씩 세금이 감면되어, 12년 이상이 되면 최대 50%까지 세금이 줄어듭니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "자동차세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/car`,
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
  "name": "자동차세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/car`,
  "description": metadata.description as string
};

export default function CarTaxPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.CAR_TAX,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="자동차세 계산기" description="승용차, 화물차, 전기차 등 차종과 배기량에 따른 자동차세를 계산합니다. 차령 감면(최대 50%) 및 연납 할인(최대 4.5%) 로직이 모두 반영된 정확한 결과를 확인하세요." position="top" />
      <Car />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">🚗</span> 자동차세 부과 기준
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>배기량 기준 (비영업용 승용차)</strong> : 1,000cc 이하(cc당 80원), 1,600cc 이하(cc당 140원), 1,600cc 초과(cc당 200원)의 누진세율이 적용되며, 이 본세에 30%의 대상 지방교육세가 더해져 부과됩니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>차령 경감 혜택</strong> : 승용차는 신차 등록 후 3년 차부터 매년 5%씩 자동차세가 인하됩니다. 12년 차 이상이 되면 최대치인 최초 과세액의 50%까지 할인이 고정됩니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>내연기관, 전기차, 화물차 등 차량의 동력 및 차종을 선택합니다.</li>
              <li>내연기관 자동차의 경우 정확한 배기량(cc)을 기입합니다.</li>
              <li>최초 차량 등록 연도를 기입하여 연식(차령) 할인을 적용받습니다.</li>
              <li>연납(1년 치 일시납) 신청 여부를 토글하여 예상 할인 금액을 확인합니다.</li>
            </ul>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 flex items-center gap-2">
              <span className="text-red-500">🚨</span> 주의사항
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>자동차세는 자동차를 실제로 운행하지 않아도 등록원부상 소유권이 있다면 부과됩니다.</li>
              <li>연납 신청 후 기한 내 납부하지 않으면 정기분(6월, 12월)으로 원복되며, 연납 할인 혜택은 자동으로 취소됩니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">올해 신차 (2000cc 비영업용)</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 40만(본세) + 12만(지방교육세) = 52만원 (1월 연납 시 약 2.4만 할인)</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">전기차 또는 수소차 구매</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">결과: 년식 무관 정액 10만(본세) + 3만(교육세) = 총세액 13만원 고정 적용.</p>
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
