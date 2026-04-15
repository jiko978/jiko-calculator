import { Metadata } from 'next';
import Vat from './Vat';
import NavBar from '@/app/calculator/components/NavBar';
import FAQ from '@/app/calculator/components/FAQ';
import InstallBanner from '@/app/calculator/components/InstallBanner';
import TaxMoreCalculators from '@/app/calculator/components/TaxMoreCalculators';
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from '@/app/utils/seo';

const BASE_URL = 'https://jiko.kr';

export const metadata: Metadata = {
  title: '부가세 계산기 | 세금계산서/간이과세자 VAT 자동 계산 - JIKO 계산기',
  description: '부가세 계산기로 합계금액에서 공급가액과 부가세(10%)를 자동으로 계산하세요. 일반과세자, 간이과세자 업종별 부가가치율 반영 및 양방향 역산 기능을 제공합니다.',
  keywords: ['부가세 계산기', '부가가치세 계산기', 'VAT 계산기', '부가세 역산', '공급가액 계산', '간이과세자 부가세', '세금계산서 계산'],
  alternates: { canonical: `${BASE_URL}/calculator/tax/vat` },
  openGraph: {
    title: '부가세 계산기 | 세금계산서/간이과세자 VAT 자동 계산 - JIKO 계산기',
    description: '부가세 계산기로 합계금액에서 공급가액과 부가세(10%)를 자동으로 계산하세요. 일반과세자, 간이과세자 업종별 부가가치율 반영 및 양방향 역산 기능을 제공합니다.',
    type: 'website',
    url: `${BASE_URL}/calculator/tax/vat`,
  },
};

const faqList = [
  { question: '부가세 역산 계산이란 무엇인가요?', answer: '합계금액(공급대가)에서 부가세 10%를 제외한 순수 공급가액을 찾아내는 계산 방식입니다. (예: 11,000원 -> 공급가액 10,000원, 부가세 1,000원)' },
  { question: '간이과세자도 10%를 적용하나요?', answer: '아닙니다. 간이과세자는 업종별 부가가치율(15~40%)에 따라 실질적인 세액이 달라지며, JIKO 계산기는 이를 선택하여 계산할 수 있는 기능을 제공합니다.' },
  { question: '면세 사업자도 부가세 계산기를 써야 하나요?', answer: '면세 사업자는 부가세 신고/납부 의무가 없으므로 본 계산기를 사용하실 필요가 없습니다. 다만, 과세와 면세 겸업 사업자는 과세 매출분에 대해서만 사용하시면 됩니다.' }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "부가세 계산기",
  description: metadata.description as string,
  url: `${BASE_URL}/calculator/tax/vat`,
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
  "name": "부가세 계산기",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator/tax/vat`,
  "description": metadata.description as string
};

export default function VatPage() {
  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME,
    COMMON_BREADCRUMBS.TAX_HOME,
    COMMON_BREADCRUMBS.VAT,
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NavBar title="부가세 계산기" description="부가세 계산기로 합계금액에서 공급가액과 부가세(10%)를 자동으로 계산하세요. 일반과세자, 간이과세자 업종별 부가가치율 반영 및 양방향 역산 기능을 제공합니다." position="top" />
      <Vat />

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <span className="text-2xl">📊</span> 부가세 계산기 및 역산 안내
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4">
            <strong>순산 (공급가액 → 합계금액)</strong>: 물건의 실제 가격(공급가액)을 기준으로 소비자에게 받을 전체 금액을 계산할 때 사용합니다. 공급가액의 10%를 부가세로 더합니다.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            <strong>역산 (합계금액 → 공급가액)</strong>: 이미 정해진 최종 결제액(합계금액)에서 세금과 순수 물건 값을 분리해야 할 때 사용합니다. 세금계산서 발행 시 매우 유용합니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">💡</span> 사용 방법
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>본인의 사업 유형(일반과세자/간이과세자)을 선택합니다.</li>
              <li>금액 기준이 '세전(공급가)'인지 '세후(합계액)'인지 탭으로 선택합니다.</li>
              <li>금액을 기입하고 계산하기 버튼을 클릭합니다.</li>
              <li>결과 하단의 아이콘을 통해 계산 내역을 빠르게 복사하거나 공유할 수 있습니다.</li>
            </ul>
            <h3 className="text-md font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2 flex items-center gap-2">
              <span className="text-red-500">🚨</span> 주의사항
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li>간이과세자는 업종마다 부가가치율이 다르므로 주의하여 선택해야 합니다.</li>
              <li>면세 대상 품목(미가공 식료품 등)은 부가세가 발생하지 않으므로 계산에서 제외해야 합니다.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 font-medium">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-indigo-500">📝</span> 계산 예시
            </h2>
            <div className="space-y-4 text-xs dark:text-gray-300 pointer-events-none">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-400 mb-1">일반과세자 / 역산(합계금액) / 1,100,000원 입력</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">공급가액: 1,000,000원 / 부가세: 100,000원</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 opacity-60">
                <p className="text-gray-400 mb-1">간이과세자(소매업 15%) / 1,000,000원 매출</p>
                <p className="font-bold text-gray-700 dark:text-gray-200">내야 할 부가세 요금: 15,000원</p>
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
