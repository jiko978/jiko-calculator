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

                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">우리의 비전</h2>
                <p>
                    우리는 누구나 쉽고 정확하게 필요한 정보를 얻을 수 있는 도구를 빠르게 제공하는 것을 목표로 합니다.
                    일상생활의 작은 계산기부터, JIKO는 여러분의 의사결정을 돕는 든든한 조력자가 될 것입니다.
                </p>

                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">우리의 방향</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Simplicity</strong> : 군더더기 없는 UI로 핵심 기능에 집중합니다.</li>
                    <li><strong>Accuracy</strong> : 정교한 로직을 통해 신뢰할 수 있는 데이터를 제공합니다.</li>
                    <li><strong>Free to Use</strong> : 모든 서비스는 별도의 가입 없이 누구나 무료로 이용 가능합니다.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">우리의 서비스</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>JIKO 계산기</strong> : 주식, 금융, 부동산, 건강, 생활 등 다양한 계산기를 한 곳에서 사용하세요.</li>
                </ul>

                <p className="mt-12 text-sm text-gray-500 italic">
                    JIKO는 항상 사용자의 목소리에 귀를 기울입니다. 더 필요한 서비스가 있다면 언제든지 <Link href="/policy/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</Link> 페이지를 통해 제안해 주세요.
                </p>
            </section>
        </article>
    );
}
