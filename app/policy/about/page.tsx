import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About | JIKO Platform",
    description: "JIKO Platform에 대한 소개입니다.",
};

export default function AboutPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">About JIKO Platform</h1>
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300 leading-balanced">
                <p>
                    <strong>JIKO Platform</strong>은 복잡한 일상을 더 단순하고 명확하게 만들기 위해 탄생한 스마트 플랫폼입니다.
                </p>

                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">우리의 비전</h2>
                <p className="leading-relaxed">
                    단순한 계산 도구를 넘어, 일상 속 수많은 숫자와 데이터 사이에서 <strong>가장 빠르고 정확한 기준</strong>을 제시합니다.
                    JIKO는 사용자가 복잡한 수식 없이도 현명한 결정을 내릴 수 있도록 돕는 디지털 조력자를 지향합니다.
                </p>

                <h2 className="text-xl font-semibold mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">우리의 핵심 가치</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                        <div className="text-2xl mb-3">🎯</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-sm">신뢰성 (Accuracy)</h3>
                        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">최신 법률 및 소득 가이드라인을 철저히 반영하여, 오차 없는 정교한 로직으로 신뢰할 수 있는 데이터를 제공합니다.</p>
                    </div>
                    <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
                        <div className="text-2xl mb-3">⚡</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-sm">편의성 (Simplicity)</h3>
                        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">군더더기 없는 UI 설계와 직관적인 입력을 통해 누구나 최소한의 조작으로 원하는 결과를 즉시 얻을 수 있게 합니다.</p>
                    </div>
                    <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/20">
                        <div className="text-2xl mb-3">🔓</div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-sm">접근성 (Free Access)</h3>
                        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">복잡한 회원가입이나 광고의 방해 없이, 모든 핵심 기능을 누구나 어디서든 무료로 제약 없이 이용할 수 있습니다.</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">우리의 서비스</h2>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4">
                    <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-md">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-lg">🧮</span> JIKO 계산기
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            연봉/월급, 실수령액, 퇴직금 등 <strong>세무/직장</strong> 영역부터 주식 평단가, 수익률 등 <strong>금융/재테크</strong>까지 흩어져 있는 모든 수식을 한 곳에 모았습니다.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {['주식', '금융', '직장', '건강', '생활', '세금', '부동산'].map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded text-[10px] font-bold">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-12 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">우리의 특징</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                            <span className="text-lg">🌓</span> 다크/라이트 모드 지원
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            사용환경에 최적화된 시각적 경험을 제공합니다. 눈의 피로를 최소화하는 정교한 다크 모드와 명확한 화이트 모드를 자유롭게 자동/수동 전환할 수 있습니다.
                        </p>
                    </div>

                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                            <span className="text-lg">📲</span> 모바일 최적화 UX/UI
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            반응형 디자인을 넘어, 한 손 조작을 배려한 레이아웃과 직관적인 데이터 입력을 통해 이동 중에도 빠르고 편리한 조작감을 제공합니다.
                        </p>
                    </div>

                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                            <span className="text-lg">⭐</span> PWA 하이브리드 앱
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            별도의 설치 과정 없이 웹 브라우저에서 바로 홈 화면에 추가할 수 있습니다. 오프라인 접근 능력과 앱과 동일한 부드러운 사용성을 경험하세요.
                        </p>
                    </div>

                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                            <span className="text-lg">🔗</span> 스마트 이동/공유 지원
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            결과 페이지 내 QR 코드 기능을 통해 PC와 모바일을 자유롭게 오갈 수 있으며, 복잡한 결과 내용도 원클릭으로 손쉽게 공유할 수 있습니다.
                        </p>
                    </div>
                </div>

                <p className="mt-12 text-sm text-gray-500 italic pt-6 border-t border-gray-50 dark:border-gray-700/50">
                    JIKO는 항상 사용자의 목소리에 귀를 기울입니다. 더 필요한 서비스가 있다면 언제든지 <Link href="/policy/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</Link> 페이지를 통해 제안해 주세요.
                </p>
            </section>
        </article>
    );
}

