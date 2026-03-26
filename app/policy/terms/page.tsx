import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | JIKO Platform",
    description: "JIKO Platform 이용약관입니다.",
};

export default function TermsPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">시행일: 2026년 3월 13일</p>
            
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    JIKO Platform(이하 '사이트')을 방문해 주셔서 진심으로 감사합니다. 본 약관은 여러분이 사이트가 제공하는 유용한 기능을 쾌적하게 이용함에 있어 상호 간에 지켜야 할 기본적인 권리와 의무, 그리고 법적 책임사항을 명확하게 안내합니다.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-indigo-500">1.</span> 용어의 명확한 정의
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>'서비스'</strong>란 본 사이트 환경(PC, 모바일 웹, PWA 등)에서 제공되는 모든 계산기 애플리케이션 및 그에 파생된 부가 정보 데이터를 의미합니다.<br />
                            <strong>'이용자'</strong>란 어떠한 방식으로든 본 사이트에 정상 접속하여 제공되는 서비스를 열람하고 자율적으로 활용하는 개인 또는 단체를 통칭합니다.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-indigo-500">2.</span> 올바른 서비스의 이용
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            모든 이용자는 번거로운 회원가입 절차 없이 사이트의 강력한 기능을 무료로 일상에 적용하실 수 있습니다. 단, 자동화된 프로그램(매크로, 크롤링 봇)을 이용한 무단 데이터 수집이나 의도적으로 서버에 과부하를 초래하는 디도스, 해킹 행위 등은 플랫폼 생태계 보호를 위해 엄격히 차단 및 금지됩니다.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-indigo-500">3.</span> 지적 재산권의 보호
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            사이트 내 체계적으로 구성된 UI/UX 템플릿, 고유한 브랜드 로고 자산, 그리고 각 계산기에 정밀하게 적용된 내부 산출 로직 코드 및 설명 가이드 등 모든 지적 권리는 JIKO 개발팀에 배타적으로 귀속됩니다. 사전 서면 합의 없는 복제, 스크래핑, 2차 가공 후 상업적 배포 행위는 예고 없는 강력한 법적 대응 대상입니다.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-indigo-500">4.</span> 서비스의 운영상 중단 및 면책
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            더 나은 품질을 위한 시스템 정기 점검, 하드웨어 확충, 혹은 예기치 못한 천재지변 및 통신사 네트워크 붕괴 등 불가항력적인 외부 사유로 서비스가 일시 제한되거나 접속 불량 상태가 발생할 수 있습니다. JIKO 플랫폼은 무상 서비스의 특성상 본의 아닌 일시적 운영 중단으로 빚어진 경제적, 정신적 손실에 대해 법적 구상 의무가 면제됩니다.
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
}
