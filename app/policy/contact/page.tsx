import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | JIKO Platform",
    description: "JIKO Platform 문의하기 페이지입니다.",
};

export default function ContactPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300">
                <p>
                    JIKO Platform 이용 중 궁금한 점이 있거나, 제휴 문의, 오류 제보 등이 있으시면 아래의 채널을 통해 연락해 주세요.
                    보내주시는 소중한 의견은 서비스 개선에 적극 반영하도록 하겠습니다.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 mt-8">
                    <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">이메일 문의</h2>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        <a href="mailto:njiko@naver.com" className="hover:underline">njiko@naver.com</a>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        * 영업일 기준 24시간 이내에 답변을 드리기 위해 노력하고 있습니다.
                    </p>
                </div>
                <h2 className="text-xl font-semibold mt-12 text-gray-900 dark:text-gray-100">자주 묻는 질문</h2>
                <p>
                    일반적인 문의 사항은 각 계산기 페이지 하단의 FAQ 영역을 먼저 확인하시면 더 빠르게 정보를 얻으실 수 있습니다.
                </p>
            </section>
        </article>
    );
}
