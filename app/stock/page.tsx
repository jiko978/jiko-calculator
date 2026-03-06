import Link from "next/link";

export default function Home() {
    return (
        <main className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-items-start">
            <div className="flex-grow px-4 py-12">
                <h1 className="text-4xl md:text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">📈 주식 계산기</h1>
                <p className="text-2xl md:text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-100">필요한 계산기를 선택하세요.</p>

                <div className="grid gap-6 w-full max-w-3xl mx-auto md:grid-cols-2">
                    <Link href="/stock/avg-price"
                          className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                        💧🔥 평균 단가
                    </Link>
                    <Link href="/stock/profit-rate"
                          className="bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                        💰 수익률
                    </Link>
                </div>
            </div>
        </main>
    );
}