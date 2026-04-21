"use client";

import { useState } from "react";
import Link from "next/link";
import SiteQR from "./components/SiteQR";
import ShareSheet from "./components/ShareSheet";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../utils/seo";
import Image from "next/image"

const BASE_URL = "https://jiko.kr";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JIKO 계산기",
  description: "금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 일상에 필요한 모든 계산기를 한곳에서 제공하는 서비스입니다.",
  url: `${BASE_URL}/calculator`,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "JIKO 계산기는 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, JIKO의 모든 계산기 서비스는 별도의 가입이나 비용 결제 없이 누구나 무료로 이용하실 수 있습니다."
      }
    },
    {
      "@type": "Question",
      name: "계산 결과의 정확도는 어떤가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JIKO는 각 분야별 최신 법정 이율, 소득세법, 병역 기준 등을 실시간으로 반영하여 가장 정확한 결과값을 제공하기 위해 노력합니다. 다만, 모든 결과는 참고용이며 최종 결정은 전문가와 상의하시길 권장합니다."
      }
    }
  ]
};

const schema = {
  "@context": "https://schema.org",
  "name": "JIKO 계산기",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "url": `${BASE_URL}/calculator`,
  "description": "금융, 직장, 생활, 건강, 세금, 주식, 부동산 계산기 모음"
};

const mainCalculators = [
  { title: "💵 금융 계산기", description: "대출 이자, 예금 이자, 적금 이자 계산기", href: "/calculator/finance" },
  { title: "💼 직장 계산기", description: "연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기", href: "/calculator/job" },
  { title: "🏠 생활 계산기", description: "나이, 날짜, 디데이, 전역일 계산기", href: "/calculator/life" },
  { title: "💪 건강 계산기", description: "비만도, 배란일, 기초대사량, 임신주수 , 칼로리 계산기", href: "/calculator/health" },
  { title: "🧾 세금 계산기", description: "부가세, 양도소득세, 취득세, 자동차세, 재산세, 종부세 계산기", href: "/calculator/tax" },
  { title: "📈 주식 계산기", description: "주식 물타기, 수익률, 수수료, 배당금 계산기", href: "/calculator/stock" },
  { title: "🏢 부동산 계산기", description: "DSR, 신DTI, DTI, LTV 계산기", href: "/calculator/real-estate" }
];

export default function Home() {
  const [showShare, setShowShare] = useState(false);

  const breadcrumbLd = generateBreadcrumbJsonLd([
    COMMON_BREADCRUMBS.HOME,
    COMMON_BREADCRUMBS.CALC_HOME
  ]);

  return (
    <main className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-items-start min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="flex-grow px-4 py-6 w-full max-w-3xl mx-auto relative">
        {/* 상단 타이틀 섹션 */}
        <div className="relative mb-2">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
            <Link href="/calculator" className="hover:text-red-500 flex items-center justify-center gap-1">
              <Image
                src="/icons/icon-512x512.png"
                alt="JIKO 계산기 로고"
                width={30}
                height={30}
                className="mr-3 items-center"
              />
              JIKO 계산기
            </Link>
          </h1>
          {/* 공유 버튼 */}
          <button
            onClick={() => setShowShare(true)}
            aria-label="공유"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md active:scale-95 transition-all text-gray-500 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
        <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">
          일상에 필요한 금융, 직장, 생활, 건강, 세금, 주식, 부동산 계산기를 한 곳에서 만나보세요.
        </p>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-2 gap-3 w-full md:gap-4">
          {mainCalculators.map((calc) => {
            // 설명글에서 하위 메뉴 추출 (최대 3개 표시)
            const subMenus = calc.description.replace(" 계산기", "").split(", ");
            const displayMenus = subMenus.slice(0, 3);
            const moreCount = subMenus.length - 3;

            return (
              <Link
                key={calc.href}
                href={calc.href}
                className="group block p-4 md:p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-3 md:gap-5 h-full">
                  {/* 좌측: 이모지 + 카테고리명 */}
                  <div className="flex flex-col items-center shrink-0 min-w-[65px] md:min-w-[85px]">
                    <span className="text-3xl md:text-4xl mb-1.5 drop-shadow-sm">{calc.title.split(" ")[0]}</span>
                    <h3 className="text-[13px] md:text-[15px] font-black text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 truncate">
                      {calc.title.split(" ")[1]}
                    </h3>
                  </div>

                  {/* 구분선 */}
                  <div className="w-px h-10 md:h-12 bg-gray-100 dark:bg-gray-700 shrink-0" />

                  {/* 우측: 주력 메뉴 3개 */}
                  <div className="min-w-0">
                    <ul className="text-[10px] md:text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-tight space-y-1">
                      {displayMenus.map((menu) => (
                        <li key={menu} className="truncate whitespace-nowrap">· {menu}</li>
                      ))}
                      {moreCount > 0 && (
                        <li className="text-blue-600 dark:text-blue-400 font-bold opacity-90 mt-1">
                          외 {moreCount}개
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 보강된 설명 섹션 (하위 메뉴와 통일감 있는 하단 카드 스타일) */}
        <section className="mt-6 bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl"></div>
          <div className="relative">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">왜 JIKO 계산기인가요? ✨</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1">
              JIKO는 복잡한 금융 수식과 건강 데이터를 가장 직관적이고 정확하게 풀어냅니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              검증된 로직과 깔끔한 인터페이스를 통해 당신의 일상을 숫자로 명확하게 확인하고 투자 및 건강 계획을 전략적으로 세워보세요.
            </p>
          </div>
        </section>

        {/* 하단 섹션 - 간격 디자인 통일 */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-left">
          <p className="text-[11px] max-w-xl text-gray-400 dark:text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
            JIKO 계산기의 모든 결과값은 표준 공식에 기반한 참고용 데이터이며, 실제 금융 거래나 의료적 판단을 대체할 수 없습니다.
            투자 및 건강에 관한 최종 결정은 전문가와 상의하시기 바랍니다.
          </p>
          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <SiteQR />
          </div>
        </div>
      </div>

      {showShare && (
        <ShareSheet
          url={typeof window !== "undefined" ? window.location.href : ""}
          title="JIKO 계산기 모음"
          description="금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 일상에 필요한 모든 계산기를 한곳에서 확인하세요!"
          onClose={() => setShowShare(false)}
        />
      )}
    </main>
  );
}
