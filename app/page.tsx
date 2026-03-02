import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 flex flex-col items-center justify-items-start">
        <div className="flex-grow px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-10">📈 주식 계산기 모음</h1>
          <p className="text-3xl md:text-2xl font-bold mb-10">필요한 계산기를 선택하세요.</p>

          <div className="grid gap-6 w-full max-w-3xl mx-auto md:grid-cols-2">
            <Link href="/avg-price" className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                평단가 계산기
            </Link>

            <Link href="/profit-rate"
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center text-lg font-semibold">
                수익률 계산기
            </Link>
          </div>
        </div>
    </main>
  );
}