"use client";

import { useState } from "react";
import PageTitle from "@/app/components/pageTitle";

export default function ProfitRatePage() {
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
  const current = Number(currentPrice.replace(/[^0-9]/g, ""));
  const qty = Number(quantity.replace(/[^0-9]/g, ""));

  const profit = (current - buy) * qty;
  const rate =
      buy > 0
          ? (((current - buy) / buy) * 100).toFixed(2)
          : "0";

  const formatComma = (raw: string) =>
      raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleChange = (setter: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          const noLeadingZero = raw.replace(/^0+/, "");
          setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
          setResult(null)
      };

  const [result, setResult] = useState<{ profit: number; rate: string } | null>(null);

  const handleCalculate = () => {
    const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
    const current = Number(currentPrice.replace(/[^0-9]/g, ""));
    const qty = Number(quantity.replace(/[^0-9]/g, ""));

    const profit = (current - buy) * qty;
    const rate =
        buy > 0 ? (((current - buy) / buy) * 100).toFixed(2) : "0";

    setResult({ profit, rate });
  };

  const nRate = Number(rate);

  return (
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <PageTitle
            badge="💰 수익률 계산기"
            badgeColor="bg-yellow-100 text-yellow-600"
            title=""
        />

        {/* 카드 영역 */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
          <div className="space-y-6">

            {/* 매입가 */}
            <div>
              <label className={`block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>매입가</label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="0"
                  value={buyPrice}
                  onChange={handleChange(setBuyPrice)}
                  className={`w-full border rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400
  bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                />
                <span className="ml-2 text-gray-800 dark:text-gray-100">원</span>
              </div>
            </div>

            {/* 현재가 */}
            <div>
              <label className={`block mb-2 font-semibold text-gray-800 dark:text-gray-100`}>현재가</label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="0"
                  value={currentPrice}
                  onChange={handleChange(setCurrentPrice)}
                  className={`w-full border rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400
  bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                />
                <span className="ml-2 text-gray-800 dark:text-gray-100">원</span>
              </div>
            </div>

            {/* 수량 */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">수량</label>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="0"
                  value={quantity}
                  onChange={handleChange(setQuantity)}
                  className={`w-full border rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400
  bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                />
                <span className="ml-2 text-gray-800 dark:text-gray-100">개</span>
              </div>
            </div>
          </div>
        </div>

        <button
            onClick={handleCalculate}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
        >
          계산하기
        </button>

        {result && (
          <div className="mt-8 transition-all duration-500 transform opacity-100 translate-y-0">
            <div className={`rounded-2xl p-6 shadow-inner text-center bg-gray-50 dark:bg-gray-700`}>
              <h2 className="text-lg mb-3 text-gray-800 dark:text-gray-100">수익금</h2>
              <p
                  className={`text-2xl font-bold ${
                      profit >= 0 ? "text-red-500" : "text-blue-500"
                  }`}
              >
                {profit.toLocaleString()} 원
              </p>

              <h2 className="text-lg mt-6 mb-3 text-gray-800 dark:text-gray-100">수익률</h2>
              <p
                  className={`text-2xl font-bold ${
                      profit >= 0 ? "text-red-500" : "text-blue-500"
                  }`}
              >
                {nRate.toLocaleString()} %
              </p>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}