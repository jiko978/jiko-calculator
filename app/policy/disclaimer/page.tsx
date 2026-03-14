import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Disclaimer | JIKO Platform",
    description: "JIKO Platform의 책임 한계 및 법적 고지입니다.",
};

export default function DisclaimerPage() {
    return (
        <article className="prose-h2:text-xl prose-h2:mt-10">
            <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border-l-4 border-amber-400 dark:border-amber-600">
                    <p className="text-amber-900 dark:text-amber-200 font-bold mb-2">중요 공지</p>
                    <p className="text-amber-800 dark:text-amber-300 sm:text-sm">
                        본 사이트에서 제공하는 모든 계산 결과 및 정보는 참고용일 뿐이며, 어떠한 경우에도 법적 책임이나 투자 결과에 대한 보증의 근거가 될 수 없습니다.
                    </p>
                </div>

                <h2>1. 결과값의 정확성</h2>
                <p>JIKO Platform은 최신 알고리즘과 검증된 공식을 사용하여 계산기를 제작하지만, 입력값의 오류, 소수점 처리 방식의 차이, 혹은 예상치 못한 시스템 오류로 인해 실제 결과와 차이가 발생할 수 있습니다.</p>

                <h2>2. 투자 및 금융 결정</h2>
                <p>특히 주식, 예금, 대출 등 금융 관련 계산 결과는 거래 수수료, 세금, 시장 변동성 등이 반영되지 않은 단순 시뮬레이션입니다. 실제 금융 거래 전에는 반드시 해당 금융기관의 공식 데이터를 확인하시기 바랍니다.</p>

                <h2>3. 외부 링크 및 정보</h2>
                <p>사이트 내에 포함된 제3자 사이트로의 링크나 외부 정보는 이용자의 편의를 위한 것이며, 해당 사이트의 내용이나 정책에 대해서는 책임을 지지 않습니다.</p>

                <h2>4. 오류 보고</h2>
                <p>오류가 있거나 개선이 필요하다고 생각되는 부분이 있다면 언제든지 <Link href="/policy/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</Link> 페이지를 통해 알려주시기 바랍니다. 여러분의 피드백은 서비스 개선에 큰 도움이 됩니다.</p>

                <p className="mt-12 font-semibold">
                    이용자는 본 서비스를 이용함으로써 위 사항을 충분히 숙지하고 동의한 것으로 간주됩니다.
                </p>
            </section>
        </article>
    );
}
