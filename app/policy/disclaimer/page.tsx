import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Disclaimer | JIKO Platform",
    description: "JIKO Platform의 책임 한계 및 법적 고지입니다.",
};

export default function DisclaimerPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-900/20 flex gap-4 items-start">
                    <div className="text-2xl">⚠️</div>
                    <div>
                        <h2 className="text-amber-900 dark:text-amber-200 font-bold mb-2">중요 공지</h2>
                        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                            본 사이트에서 제공하는 모든 계산 결과 및 정보는 참고용일 뿐이며, 어떠한 경우에도 법적 책임이나 투자 결과에 대한 보증의 근거가 될 수 없습니다.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-lg">🎯</span> 1. 결과값의 정확성
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            JIKO Platform은 최신 알고리즘과 검증된 공식을 사용하여 계산기를 제작하지만, 입력값의 오류, 소수점 처리 방식의 차이, 혹은 예상치 못한 시스템 오류로 인해 실제 결과와 차이가 발생할 수 있습니다.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-lg">📈</span> 2. 투자 및 금융 결정
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            특히 주식, 예금, 대출 등 금융 관련 계산 결과는 거래 수수료, 세금, 시장 변동성 등이 반영되지 않은 단순 시뮬레이션입니다. 실제 은행 및 증권사 데이터와 다를 수 있습니다.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-lg">🔗</span> 3. 외부 링크 및 정보
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            사이트 내에 포함된 제3자 사이트로의 링크나 외부 안내 정보는 이용자의 편의를 위한 제공일 뿐이며, 해당 웹사이트의 내용이나 보안 정책에 대해서는 JIKO가 책임지지 않습니다.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-colors">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <span className="text-lg">🛠️</span> 4. 오류 보고
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            서비스 내 오류가 있거나 개선이 필요하다고 생각되는 부분이 있다면 언제든지 <Link href="/policy/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Contact</Link> 페이지를 통해 알려주세요. 피드백은 서비스 발전에 큰 도움이 됩니다.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-500 font-bold text-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                    이용자는 본 서비스를 이용함으로써 위 사항을 충분히 숙지하고 동의한 것으로 간주됩니다.
                </div>
            </section>
        </article>
    );
}
