import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | JIKO Platform",
    description: "JIKO Platform의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 3월 13일</p>
            
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    JIKO Platform은 사용자의 개인정보를 소중하게 생각하며, '정보통신망 이용촉진 및 정보보호 등에 관한 법률' 등 관련 법규를 철저히 준수하고 있습니다.
                </p>
                
                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-blue-500">1.</span> 수집하는 개인정보 항목
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            본 사이트는 별도의 회원가입 없이 이용 가능하며, 사용자의 이름, 연락처 등의 민감한 개인정보를 직접적으로 수집하지 않습니다. 다만 서비스 제공 안정성과 통계 분석을 위해 접속 IP 정보, 방문 일시, 오류 로그 등이 플랫폼 내에 자동으로 수집될 수 있습니다.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-blue-500">2.</span> 쿠키(Cookie) 및 광고 정책
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            JIKO Platform은 사용자에게 더 나은 편의성과 맞춤형 광고를 제공하기 위해 브라우저 '쿠키'를 활용합니다.
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3 font-medium list-none px-2">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span><strong>Google AdSense</strong> : 구글 및 제3자 제공업체는 사용자의 이전 방문 기록 및 성향을 분석하여 적절한 광고를 게재하기 위해 쿠키를 활용합니다.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span><strong>DoubleClick 쿠키</strong> : 구글 파트너사는 이 쿠키를 통해 본 사이트 및 다른 인터넷 사이트 방문 기록을 기반으로 타겟팅 광고를 화면에 노출합니다.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>개인정보 보호를 위해 사용자는 구글의 <strong>광고 설정</strong> 페이지를 방문하여 맞춤형 광고 게재를 언제든지 차단 및 비활성화할 수 있습니다.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                                <span className="text-blue-500">3.</span> 정보 보호 및 제3자 제공
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                우리는 수집된 비식별 접속 데이터를 상업적으로 외부 기업에 판매하거나 무단으로 공유하지 않습니다. 법령에 의거한 수사기관의 정당한 법적 절차 등 예외적인 경우를 제외하고 안전하게 보호됩니다.
                            </p>
                        </div>
                        
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                                <span className="text-blue-500">4.</span> 정책 변경 고지
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                본 개인정보처리방침은 관련 법령의 제/개정, 정부 지침의 변경, 혹은 플랫폼의 신규 서비스 출시에 따라 내용이 지속적으로 수정될 수 있으며, 의미 있는 변경 시 본 페이지 상단에 갱신 일자를 표시하여 안내합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    );
}
