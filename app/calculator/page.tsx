"use client";

import Link from "next/link";
import SiteQR from "./components/SiteQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../utils/seo";

const mainCalculators = [
  { title: "📈 주식 계산기(4)", description: "주식 물타기, 수익률, 배당금, 수수료 계산기", href: "/calculator/stock" },
  { title: "💵 금융 계산기(3)", description: "예금 이자, 적금 이자, 대출 이자 계산기", href: "/calculator/finance" },
  { title: "💼 직장 계산기(5)", description: "연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험 계산기", href: "/calculator/job" },
  { title: "💪 건강 계산기(5)", description: "비만도, 기초대사량, 칼로리, 배란일, 임신주수 계산기", href: "/calculator/health" },
  { title: "🏠 생활 계산기(0)", description: "준비 중입니다.", href: "/calculator/life" },
  { title: "🧾 세금 계산기(0)", description: "준비 중입니다.", href: "/calculator/tax" },
  { title: "🏢 부동산 계산기(0)", description: "준비 중입니다.", href: "/calculator/real-estate" }
];

export default function Home() {
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
      
      <div className="flex-grow px-4 py-8 w-full max-w-3xl mx-auto">
        {/* 상단 타이틀 섹션 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            🧮 JIKO 계산기
          </h1>
          
          {/* 보강된 설명 섹션 (하위 메뉴와 통일감 있는 카드 스타일) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10 text-left">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">왜 JIKO 계산기인가요? ✨</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              JIKO는 복잡한 금융 수식과 건강 데이터를 가장 직관적이고 정확하게 풀어냅니다. 
              검증된 로직과 깔끔한 인터페이스를 통해 당신의 일상을 숫자로 명확하게 확인하고 투자 및 건강 계획을 전략적으로 세워보세요.
            </p>
          </div>

          <p className="text-xl font-semibold mb-6 text-gray-400 dark:text-gray-500">필요한 계산기를 선택하세요</p>
        </div>

        {/* 메뉴 그리드 (기존 큼직한 카드 규격 복구) */}
        <div className="grid gap-4 w-full md:grid-cols-2">
          {mainCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                  {calc.description || "새로운 계산기를 준비 중입니다."}
                </p>
                <div className="flex items-center text-xs font-black uppercase tracking-wider text-blue-600">
                  지금 바로 계산하기
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 섹션 - 간격 대폭 축소 */}
        <div className="mt-12 mb-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
            JIKO 계산기의 모든 결과값은 표준 공식에 기반한 참고용 데이터이며, 실제 금융 거래나 의료적 판단을 대체할 수 없습니다. 투자 및 건강에 관한 최종 결정은 전문가와 상의하시기 바랍니다.
          </p>
          <div className="flex justify-center opacity-80 hover:opacity-100 transition-opacity">
            <SiteQR />
          </div>
        </div>
      </div>
    </main>
  );
}
