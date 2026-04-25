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
  {
    title: "💵 금융 계산기",
    description: "대출 이자, 예금 이자, 적금 이자 계산기",
    href: "/calculator/finance",
    intro: "대출 이자부터 예·적금 수익까지, 복잡한 금융 계산을 쉽고 빠르게 확인하세요. 금리 변동에 따른 월 상환액과 만기 수령액을 실시간으로 비교해 현명한 금융 결정을 도와드립니다.",
    badge: "내 돈의 흐름을 한눈에",
  },
  {
    title: "💼 직장 계산기",
    description: "연봉/월급, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산기",
    href: "/calculator/job",
    intro: "연봉에서 세금·4대보험을 제한 실수령액부터 퇴직금·실업급여·주휴수당·연차까지. 직장인이라면 꼭 알아야 할 모든 계산을 한 곳에서 해결하세요.",
    badge: "내 월급, 정확히 알고 받자",
  },
  {
    title: "🏠 생활 계산기",
    description: "나이, 날짜, 디데이, 전역일, 학점 계산기",
    href: "/calculator/life",
    intro: "만 나이 계산부터 D-Day, 전역일, 학점 계산까지 — 생활 속에서 자주 필요하지만 매번 헷갈리는 계산들을 간편하게 정리해 드립니다.",
    badge: "일상의 숫자가 궁금할 때",
  },
  {
    title: "💪 건강 계산기",
    description: "비만도, 배란일, 기초대사량, 임신주수 , 칼로리 계산기",
    href: "/calculator/health",
    intro: "BMI 비만도, 기초대사량, 칼로리 소비량부터 배란일·임신주수까지. 건강한 생활을 위해 꼭 필요한 신체 지표를 정확하게 계산해 드립니다.",
    badge: "숫자로 보는 내 몸 건강",
  },
  {
    title: "🧾 세금 계산기",
    description: "부가세, 양도소득세, 취득세, 자동차세, 재산세, 종부세 계산기",
    href: "/calculator/tax",
    intro: "부가세, 취득세, 양도소득세, 자동차세, 재산세, 종합부동산세까지. 복잡한 세금 체계를 쉽게 계산하고 예상 세액을 미리 파악해 절세 전략을 세워보세요.",
    badge: "미리 알면 절세가 보인다",
  },
  {
    title: "📈 주식 계산기",
    description: "주식 물타기, 수익률, 수수료, 배당금 계산기",
    href: "/calculator/stock",
    intro: "주식 매매 수수료, 수익률, 물타기 평균단가, 배당금 수익까지 투자 판단에 필요한 계산을 빠르게 정리해 드립니다. 감이 아닌 숫자로 투자하세요.",
    badge: "투자 계산의 모든 것",
  },
  {
    title: "🏢 부동산 계산기",
    description: "DSR, 신DTI, DTI, LTV 계산기",
    href: "/calculator/real-estate",
    intro: "DSR·신DTI·DTI·LTV 등 대출 규제 지표를 한번에 계산하고, 내가 받을 수 있는 대출 한도를 미리 파악해 보세요. 부동산 거래의 첫걸음은 정확한 계산입니다.",
    badge: "내 집 마련, 계산부터",
  },
];

const benefits = [
  {
    icon: "⚡",
    title: "입력 즉시 실시간 계산",
    desc: "버튼을 누를 필요 없이 값을 입력하는 순간 결과가 바뀝니다.",
  },
  {
    icon: "🎯",
    title: "최신 기준 반영",
    desc: "최신 세법·법정 이율·4대보험료율을 반영해 신뢰할 수 있는 결과를 제공합니다.",
  },
  {
    icon: "📱",
    title: "PC·모바일 최적화",
    desc: "어떤 기기에서도 동일하게 편리한 반응형 디자인으로 설계되었습니다.",
  },
  {
    icon: "🔒",
    title: "개인정보 걱정 없음",
    desc: "입력한 데이터는 서버에 저장되지 않습니다. 완전 익명으로 사용하세요.",
  },
  {
    icon: "🆓",
    title: "완전 무료 · 가입 불필요",
    desc: "회원가입 없이 누구나 34개의 계산기를 무료로 이용할 수 있습니다.",
  },
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

          {/* ── CTA 배너 ── */}
          <div className="mb-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white font-black text-sm md:text-base leading-tight">어떤 계산이 필요하신가요?</p>
              <p className="text-blue-100 text-xs mt-0.5">7가지 카테고리 · 34개 계산기가 무료로 제공됩니다. 지금 바로 계산해보세요. 복잡한 계산, JIKO가 대신합니다.</p>
            </div>
            <span className="text-white text-2xl select-none">👇</span>
          </div>

          {/* 메뉴 그리드 */}
          <div className="grid grid-cols-2 gap-3 w-full md:gap-4">
            {mainCalculators.map((calc) => {
              const subMenus = calc.description.replace(" 계산기", "").split(", ");
              const displayMenus = subMenus.slice(0, 3);
              const moreCount = subMenus.length - 3;

              return (
                  <Link
                      key={calc.href}
                      href={calc.href}
                      className="group block p-3 md:p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center justify-start md:justify-center gap-2 md:gap-4 h-full pl-0.5 md:pl-0">
                      {/* 좌측: 이모지 + 카테고리명 */}
                      <div className="flex flex-col items-center shrink-0 min-w-[50px] md:min-w-[150px]">
                        <span className="text-3xl md:text-4xl mb-1 drop-shadow-sm">{calc.title.split(" ")[0]}</span>
                        <h3 className="text-[10px] md:text-[13px] font-black text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 truncate">
                          {calc.title.split(" ")[1]}
                        </h3>
                      </div>

                      {/* 구분선 */}
                      <div className="w-px h-10 md:h-12 bg-gray-100 dark:bg-gray-700 shrink-0" />

                      {/* 우측: 주력 메뉴 3개 */}
                      <div className="flex-grow min-w-0">
                        <ul className="text-[9px] md:text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight space-y-0.5 md:space-y-1">
                          {displayMenus.map((menu) => (
                              <li key={menu} className="truncate whitespace-nowrap">· {menu}</li>
                          ))}
                          {moreCount > 0 && (
                              <li className="text-blue-600 dark:text-blue-400 font-bold opacity-90 mt-0.5">
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

          {/* ── 카테고리 소개 카드 섹션 ── */}
          <section className="mt-8">
            <div className="mb-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 flex items-center justify-between shadow-md">
              <div>
                <h2 className="text-white font-black text-sm md:text-base leading-tight">카테고리 소개</h2>
                <p className="text-blue-100 text-xs mt-0.5">어떤 계산이 필요하신가요? 아래 카테고리에서 원하는 계산기를 선택해 보세요. 계산은 빠르게! 결정은 현명하게!</p>
              </div>
              <span className="text-white text-2xl select-none">👇</span>
            </div>
            <div className="flex flex-col gap-3">
              {mainCalculators.map((calc) => (
                  <Link
                      key={calc.href + "-intro"}
                      href={calc.href}
                      className="group flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* 이모지 */}
                    <span className="text-3xl shrink-0 mt-0.5">{calc.title.split(" ")[0]}</span>
                    {/* 텍스트 */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {calc.title.split(" ").slice(1).join(" ")}
                        </h3>
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {calc.badge}
                    </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{calc.intro}</p>
                    </div>
                    {/* 화살표 */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 shrink-0 mt-1 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
              ))}
            </div>

            {/* 소개 섹션 하단 CTA */}
            <div className="mt-5 text-center">
              <Link
                  href="/calculator"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-bold text-sm px-6 py-3 rounded-full shadow-md"
              >
                지금 바로 계산해보세요
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ── JIKO 장점 섹션 (상하 재구성) ── */}
          <section className="mt-8 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 blur-2xl" />
            <div className="relative space-y-8">
              <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-950/40">
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                  JIKO 계산기의 장점
                </span>
                <h2 className="mt-4 text-3xl font-black text-gray-900 dark:text-white leading-tight">왜 JIKO 계산기인가요?</h2>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  일상 계산부터 투자·세금·건강·부동산까지, 34개의 계산기를 한 곳에 모았습니다. 복잡한 수치를 보기 쉽게 정리해 빠르게 비교하고 더 현명한 결정을 내릴 수 있습니다.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">빠르고 직관적인 계산 화면</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">입력 즉시 결과가 바뀌는 인터페이스로 시간 낭비 없이 바로 확인할 수 있습니다.</p>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">정확한 기준과 최신 규정 반영</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">세법, 대출 규제, 건강 공식 등 최신 기준을 반영하여 신뢰할 수 있는 계산 결과를 제공합니다.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((b) => (
                  <div key={b.title} className="rounded-3xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900 p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{b.icon}</span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{b.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 하단 섹션 */}
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
                title="JIKO 계산기"
                description="금융, 직장, 생활, 건강, 세금, 주식, 부동산 등 일상에 필요한 모든 계산기를 한곳에서 확인하세요!"
                onClose={() => setShowShare(false)}
            />
        )}
      </main>
  );
}