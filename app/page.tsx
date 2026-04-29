import Link from "next/link";
import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PlatformQR from "./components/PlatformQR";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "./utils/seo";
import Image from "next/image"

export const metadata: Metadata = {
    title: "JIKO Platform - 금융/직장/생활/건강/세금/주식/부동산 JIKO 계산기",
    description: "금융, 직장, 생활, 건강, 세금, 주식, 부동산 계산기를 제공하는 JIKO Platform 입니다.",
};

type ServiceLink = {
    label: string;
    href: string;
    disabled?: boolean;
};

type Service = {
    title: string;
    href: string;
    description: string;
    bgColor: string;
    borderColor: string;
    links: ServiceLink[];
};

const services: Service[] = [
    {
        title: "💵 금융",
        href: "/calculator/finance",
        description: "대출 이자부터 예금/적금 수익까지, 금융 계획을 정확히 세울 수 있는 계산기 모음입니다.",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-100 dark:border-green-800",
        links: [
            { label: "📊 대출 이자 계산기 →", href: "/calculator/finance/loans" },
            { label: "🏦 예금 이자 계산기 →", href: "/calculator/finance/deposits" },
            { label: "💰 적금 이자 계산기 →", href: "/calculator/finance/savings" },
            { label: "💸 중도상환수수료 계산기 →", href: "/calculator/finance/prepayment" },
        ]
    },
    {
        title: "💼 직장",
        href: "/calculator/job",
        description: "연봉, 실수령액, 퇴직금, 실업급여, 4대보험, 주휴수당, 연차 계산까지 직장 생활의 숫자를 정리합니다.",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        borderColor: "border-purple-100 dark:border-purple-800",
        links: [
            { label: "💸 연봉/월급 계산기 →", href: "/calculator/job/salary" },
            { label: "💰 실수령액 계산기 →", href: "/calculator/job/net-pay" },
            { label: "💼 퇴직금 계산기 →", href: "/calculator/job/severance-pay" },
            { label: "📋 실업급여 계산기 →", href: "/calculator/job/unemployment-benefit" },
            { label: "🛡️ 4대보험 계산기 →", href: "/calculator/job/insurance" },
            { label: "💰️ 주휴휴당 계산기 →", href: "/calculator/job/holiday-allowance" },
            { label: "🏖️ 연차 계산기 →", href: "/calculator/job/annual" }
        ]
    },
    {
        title: "🏠 생활",
        href: "/calculator/life",
        description: "나이, 날짜, D-Day, 전역일, 학점 계산기 등 일상 생활의 숫자 부담을 덜어드립니다.",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-100 dark:border-amber-800",
        links: [
            { label: "🎂 나이 계산기 →", href: "/calculator/life/age" },
            { label: "📅 날짜 계산기 →", href: "/calculator/life/date" },
            { label: "🕯️ 디데이 계산기 →", href: "/calculator/life/d-day" },
            { label: "🪖 전역일 계산기 →", href: "/calculator/life/discharge-day" },
            { label: "🎓 학점 계산기 →", href: "/calculator/life/grade" },
        ]
    },
    {
        title: "💪 건강",
        href: "/calculator/health",
        description: "BMI, 배란일, 기초대사량, 임신주수, 칼로리 계산 등 건강 관리를 돕는 모든 기능을 제공합니다.",
        bgColor: "bg-rose-50 dark:bg-rose-900/20",
        borderColor: "border-rose-100 dark:border-rose-800",
        links: [
            { label: "⚖️ 비만도 계산기 →", href: "/calculator/health/bmi" },
            { label: "📅 배란일 계산기 →", href: "/calculator/health/ovulation" },
            { label: "🔥 기초대사량 계산기 →", href: "/calculator/health/bmr" },
            { label: "👶 임신주수 계산기 →", href: "/calculator/health/pregnancy" },
            { label: "🏃‍♂️ 칼로리 계산기 →", href: "/calculator/health/calorie" },
        ]
    },
    {
        title: "🧾 세금",
        href: "/calculator/tax",
        description: "부가세, 양도소득세, 취득세, 자동차세, 재산세, 종부세까지 세금 계산을 한 번에 확인하세요.",
        bgColor: "bg-gray-50 dark:bg-gray-800/50",
        borderColor: "border-gray-200 dark:border-gray-700",
        links: [
            { label: "🧾 부가세 계산기 →", href: "/calculator/tax/vat" },
            { label: "🏠 양도소득세 계산기 →", href: "/calculator/tax/capital-gains" },
            { label: "🔑 취득세 계산기 →", href: "/calculator/tax/acquisition" },
            { label: "🚗 자동차세 계산기 →", href: "/calculator/tax/car" },
            { label: "📄 재산세 계산기 →", href: "/calculator/tax/property" },
            { label: "🏛️ 종부세 계산기 →", href: "/calculator/tax/comprehensive" }
        ]
    },
    {
        title: "📈 주식",
        href: "/calculator/stock",
        description: "주식 물타기, 수익률, 수수료, 배당금 계산기를 통해 투자 판단에 필요한 숫자를 명확히 보여줍니다.",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-100 dark:border-blue-800",
        links: [
            { label: "💧 주식 물타기 계산기 →", href: "/calculator/stock/avg-price" },
            { label: "💰 주식 수익률 계산기 →", href: "/calculator/stock/profit-rate" },
            { label: "💳️️ 주식 수수료 계산기 →", href: "/calculator/stock/fee" },
            { label: "💸 주식 배당금 계산기 →", href: "/calculator/stock/dividend" },
        ]
    },
    {
        title: "🏢 부동산",
        href: "/calculator/real-estate",
        description: "DSR, 신DTI, DTI, LTV 계산을 통해 부동산 대출 가능성을 미리 파악할 수 있습니다.",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-100 dark:border-amber-800",
        links: [
            { label: "📊 DSR 계산기 →", href: "/calculator/real-estate/dsr" },
            { label: "🏢 신DTI 계산기 →", href: "/calculator/real-estate/new-dti" },
            { label: "📉 DTI 계산기 →", href: "/calculator/real-estate/dti" },
            { label: "🏠 LTV 계산기 →", href: "/calculator/real-estate/ltv" },
        ]
    }
];

export default function Home() {
    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME
    ]);

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <Header />

            <main className="w-full bg-white dark:bg-gray-900 flex-grow py-6 px-4 transition-colors">
                <div className="max-w-3xl mx-auto">
                    <section className="text-center mb-12 px-4 sm:px-0">
                        <p className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs font-semibold uppercase tracking-[0.3em] px-4 py-2 mb-4">
                            <Image
                                src="/icons/icon-512x512.png"
                                alt="JIKO 계산기 로고"
                                width={18}
                                height={18}
                                className="mr-3 items-center"
                            />
                            JIKO 계산기
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            일상을 바꾸는 계산 플랫폼
                        </h1>
                        <p className="mt-5 text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            금융, 직장, 생활, 건강, 세금, 주식, 부동산 계산기를 한 곳에 모았습니다. 34개의 계산기로 복잡한 숫자를 빠르게 정리하고 더 현명한 결정을 내릴 수 있습니다.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                            <Link href="/calculator" className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-6 py-3 text-sm font-bold hover:bg-blue-700 transition">
                                🧮 계산기 전체 보기
                            </Link>
                        </div>
                    </section>

                    <section className="mb-12 px-4 sm:px-0">
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="text-sm uppercase font-semibold tracking-[0.3em] text-blue-600 dark:text-blue-400"></p>
                            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">7개 카테고리로
                                계산을 한 곳에</h2>
                            <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                지금까지 구축한 계산기는 7개 카테고리로 구성되어 있으며, 각 카테고리에서 핵심 계산을 빠르게 찾고 실행할 수 있습니다.
                            </p>
                        </div>
                        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
                            {services.map((service, idx) => (
                                <article key={idx}
                                         className={`group block rounded-2xl border ${service.borderColor} ${service.bgColor} p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                                    <Link href={service.href}
                                          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                                        {service.title}
                                    </Link>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                                        {service.links.slice(0, 8).map((link) => (
                                            <Link key={link.href} href={link.href}
                                                  className="block rounded-xl bg-white/80 dark:bg-white/5 px-3 py-2 hover:bg-white dark:hover:bg-gray-800 transition">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12 px-4 sm:px-0">
                        <div className="flex flex-col gap-6">
                            <div className="rounded-3xl border border-gray-100 bg-slate-50 dark:border-gray-700 dark:bg-gray-900 p-8 shadow-sm">
                                <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                                    JIKO 계산기가 제공하는 정보
                                </h2>
                                <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">헤드라인부터 세부 설명까지, 정보형 콘텐츠에 최적화</h2>
                                <p className="mt-5 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                    헤드라인, 메인 소개, 서브 소개, 세션별 요약, 각 계산기 소개, 장점 설명, CTA까지 체계적으로 구성하여 방문자가 페이지의 목적을 빠르게 이해할 수 있도록 했습니다.
                                </p>
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-3xl border border-gray-100 bg-blue-50 dark:bg-blue-900/20 p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📰 1. 헤드라인</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">JIKO 계산기의 핵심 가치를 간결하게 전달합니다.</p>
                                    </div>
                                    <div className="rounded-3xl border border-gray-100 bg-green-50 dark:bg-green-950/20 p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 2. 섹션별 소개</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">카테고리별 계산기 설명을 통해 검색 엔진과 사용자 모두에게 명확한 정보를 제공합니다.</p>
                                    </div>
                                    <div className="rounded-3xl border border-gray-100 bg-purple-50 dark:bg-purple-950/20 p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 3. 상세 설명</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">각 계산기의 기능과 사용 방법을 자세하게 설명합니다.</p>
                                    </div>
                                    <div className="rounded-3xl border border-gray-100 bg-amber-50 dark:bg-amber-950/20 p-5">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">✨ 4. 장점 강조</h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">빠른 계산, 정확한 결과, 모바일 최적화 등을 강조합니다.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900 p-8 shadow-sm">
                                <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                                    주요 특징
                                </h2>
                                <ul className="mt-5 grid gap-3 md:grid-cols-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li>✅ 방문자가 핵심 카테고리와 기능을 빠르게 이해</li>
                                    <li>✅ 7개 카테고리 및 34개 계산기를 명시적으로 소개</li>
                                    <li>✅ CTA 버튼과 계산기 진입 경로를 명확히 배치</li>
                                    <li>✅ 모바일 반응형 디자인으로 모든 기기 지원</li>
                                    <li>✅ 최신 기준과 법정 이율을 반영한 정확한 계산</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className="mb-12 px-4 sm:px-0">
                        <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900 p-8 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                                        JIKO 계산기 장점
                                    </h2>
                                    <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">더 쉽고 빠르게, 숫자를 읽는 습관</h2>
                                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                                        빠른 계산, 정확한 기준, 모바일 최적화, 개인정보 보호까지 JIKO는 신뢰할 수 있는 계산 경험을 제공합니다.
                                    </p>
                                </div>
                            </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-3xl border border-gray-100 bg-blue-50 dark:bg-blue-900/20 p-5">
                                    <p className="font-semibold text-gray-900 dark:text-white">⚡ 즉시 계산</p>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">입력 즉시 결과 확인으로 빠른 판단을 돕습니다.</p>
                                </div>
                                <div className="rounded-3xl border border-gray-100 bg-green-50 dark:bg-green-950/20 p-5">
                                    <p className="font-semibold text-gray-900 dark:text-white">🎯 정확한 기준</p>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">최신 법정 이율과 규정을 반영해 신뢰도를 높였습니다.</p>
                                </div>
                                <div className="rounded-3xl border border-gray-100 bg-purple-50 dark:bg-purple-950/20 p-5">
                                    <p className="font-semibold text-gray-900 dark:text-white">📱 모바일 최적화</p>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">모든 기기에서 편하게 이용할 수 있습니다.</p>
                                </div>
                                <div className="rounded-3xl border border-gray-100 bg-amber-50 dark:bg-amber-950/20 p-5">
                                    <p className="font-semibold text-gray-900 dark:text-white">🔒 개인정보 보호</p>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">입력 정보는 서버에 저장되지 않습니다.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="mb-16 px-4 sm:px-0 text-center">
                        <div className="inline-flex rounded-full bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-200">
                            지금도 계속 확장 중인 계산기 플랫폼</div>
                        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">지금 바로 계산을 시작하고 다음 결정을 준비하세요</h2>
                        <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            JIKO는 누구나 무료로 사용할 수 있는 계산 플랫폼입니다.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            <Link href="/calculator" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 transition">
                                🧮 전체 계산기
                            </Link>
                            <Link href="/calculator/finance" className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-600 transition">
                                💵 금융 계산기
                            </Link>
                            <Link href="/calculator/job" className="inline-flex items-center justify-center rounded-lg bg-violet-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-600 transition">
                                💼 직장 계산기
                            </Link>
                            <Link href="/calculator/life" className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-600 transition">
                                🏠 생활 계산기
                            </Link>
                            <Link href="/calculator/health" className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-rose-600 transition">
                                💪 건강 계산기
                            </Link>
                            <Link href="/calculator/tax" className="inline-flex items-center justify-center rounded-lg bg-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate-700 transition">
                                🧾 세금 계산기
                            </Link>
                            <Link href="/calculator/stock" className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition">
                                📈 주식 계산기
                            </Link>
                            <Link href="/calculator/real-estate" className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-xs sm:text-sm font-bold text-white hover:bg-orange-600 transition">
                                🏢 부동산 계산기
                            </Link>
                        </div>
                    </section>

                    <div className="px-4 sm:px-0">
                        <PlatformQR />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
