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
            
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300">
                <p>JIKO Platform(이하 '사이트')을 이용해 주셔서 감사합니다. 본 약관은 여러분이 사이트를 이용함에 있어 필요한 권리, 의무 및 책임사항을 규정합니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">1. 용어의 정의</h2>
                <p>'서비스'란 사이트가 제공하는 각종 계산기 기능 및 관련 정보 서비스를 의미합니다. '이용자'란 사이트에 접속하여 본 약관에 따라 서비스를 이용하는 사용자를 말합니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">2. 서비스의 이용</h2>
                <p>이용자는 사이트가 제공하는 계산 기능을 자유롭게 이용할 수 있습니다. 다만, 사이트의 정상적인 운영을 방해하거나 시스템에 무리를 주는 행위(크롤링, 디도스 공격 등)는 금지됩니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">3. 저작권 및 컨텐츠</h2>
                <p>사이트에서 제공하는 모든 텍스트, 디자인, 로고, 계산 로직에 대한 권리는 JIKO에 있습니다. 무단 복제, 배포, 상업적 이용은 법적 제재를 받을 수 있습니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">4. 서비스의 중단</h2>
                <p>시스템 점검, 서버 교체, 네트워크 장애 등의 사유로 서비스가 일시적으로 중단될 수 있으며, 이로 인한 직접적인 손해에 대해서는 책임을 지지 않습니다.</p>
            </section>
        </article>
    );
}
