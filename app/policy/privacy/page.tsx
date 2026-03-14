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
            
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300">
                <p>JIKO Platform은 사용자의 개인정보를 소중하게 생각하며, '정보통신망 이용촉진 및 정보보호 등에 관한 법률' 등 관련 법규를 준수하고 있습니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">1. 수집하는 개인정보 항목</h2>
                <p>본 사이트는 별도의 회원가입 없이 이용 가능하며, 사용자의 이름, 연락처 등의 민감한 개인정보를 직접적으로 수집하지 않습니다. 다만 서비스 이용 과정에서 IP 접속 기록, 쿠키, 방문 일시 등의 정보가 자동 생성되어 수집될 수 있습니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">2. 쿠키(Cookie) 및 광고 정책</h2>
                <p>JIKO Platform은 사용자에게 최적화된 서비스를 제공하고 광고를 게재하기 위해 '쿠키'를 사용합니다. 쿠키는 웹사이트가 사용자의 브라우저에 전송하는 작은 텍스트 파일입니다.</p>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Google AdSense</strong> : 구글을 포함한 제3자 제공업체는 사용자의 이전 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.</li>
                    <li><strong>DoubleClick 쿠키</strong> : 구글 및 파트너사는 이 쿠키를 통해 본 사이트 및 다른 인터넷 사이트 방문 기록을 기반으로 사용자에게 맞춤형 광고를 제공합니다.</li>
                    <li>사용자는 구글의 <strong>광고 설정</strong>을 방문하여 맞춤형 광고 게재를 중단할 수 있습니다.</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">3. 개인정보의 보호 및 제3자 제공</h2>
                <p>우리는 수집된 비식별 정보를 외부로 판매하거나 무단 공유하지 않습니다. 법령에 의거한 정당한 절차에 의한 요청이 있는 경우를 제외하고는 사용자의 정보를 보호합니다.</p>
                
                <h2 className="text-xl font-semibold mt-8 text-gray-900 dark:text-gray-100">4. 정책 변경에 대한 고지</h2>
                <p>본 개인정보처리방침은 법령이나 서비스 변경에 따라 내용이 수정될 수 있으며, 수정 시 본 페이지를 통해 공지합니다.</p>
            </section>
        </article>
    );
}
