"use client";

import Link from "next/link";
import SiteQR from "./components/SiteQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../utils/seo";

const mainCalculators = [
  { title: "📈 주식 계산기(4)", description: "주식 물타기, 수익률, 배당금, 수수료 계산기", href: "/calculator/stock" },
  { title: "💵 금융 계산기(3)", description: "예금 이자, 적금 이자, 대출 이자 계산기", href: "/calculator/finance" },
  { title: "💼 직장 계산기(7)", description: "연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기", href: "/calculator/job" },
  { title: "💪 건강 계산기(5)", description: "비만도, 기초대사량, 칼로리, 배란일, 임신주수 계산기", href: "/calculator/health" },
  { title: "🏠 생활 계산기(4)", description: "나이, 디데이, 날짜, 전역일 계산기", href: "/calculator/life" },
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
      
      <div className="flex-grow px-4 py-6 w-full max-w-3xl mx-auto">
        {/* 상단 타이틀 섹션 */}
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-gray-100">
          🧮 JIKO 계산기
        </h1>
        <p className="text-sm font-semibold mb-4 text-center text-gray-500 dark:text-gray-400">
          일상에 필요한 주식, 금융, 직장, 건강, 생활, 세금, 부동산 계산기를 한 곳에서 만나보세요.
        </p>

        {/* 메뉴 그리드 */}
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
    </main>
  );
}
