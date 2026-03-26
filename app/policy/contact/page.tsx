import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | JIKO Platform",
    description: "JIKO Platform 문의하기 페이지입니다.",
};

export default function ContactPage() {
    return (
        <article>
            <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    JIKO Platform 이용 중 궁금한 점이 있거나, 제휴 문의, 오류 제보 등이 있으시면 아래의 채널을 통해 연락해 주세요.
                    보내주시는 소중한 의견은 서비스 발전에 적극 반영하도록 하겠습니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 flex flex-col justify-center items-center text-center">
                        <div className="text-3xl mb-3">📧</div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">이메일 문의</h2>
                        <a href="mailto:njiko@naver.com" className="text-xl font-black text-blue-600 dark:text-blue-400 hover:underline mb-2">njiko@naver.com</a>
                        <p className="text-xs text-gray-500 dark:text-gray-400">영업일 기준 24시간 이내 답변을 위해 노력합니다.</p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center text-center">
                        <div className="text-3xl mb-3">💬</div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">자주 묻는 질문</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            일반적인 문의 사항은 각 계산기 하단의<br />
                            <strong>FAQ 영역</strong>을 먼저 확인하시면<br />
                            더욱 빠르게 답변을 얻으실 수 있습니다.
                        </p>
                    </div>
                </div>
            </section>
        </article>
    );
}
