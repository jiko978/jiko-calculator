"use client";

import { useState } from "react";
import NavBar from "@/app/components/NavBar";
import { ANIMATION } from "@/app/config/animationConfig";

export default function AvgPriceCalculator() {
    const [price1, setPrice1] = useState("");
    const [qty1,   setQty1]   = useState("");
    const [price2, setPrice2] = useState("");
    const [qty2,   setQty2]   = useState("");
    const [price3, setPrice3] = useState("");
    const [qty3,   setQty3]   = useState("");
    const [calculated, setCalculated] = useState(false);
    const [copied,     setCopied]     = useState(false);
    const [shaking,    setShaking]    = useState(false);

    const n = (v: string) => Number(v.replace(/[^0-9]/g, ""));

    const amount1   = n(price1) * n(qty1);
    const amount2   = n(price2) * n(qty2);
    const amount3   = n(price3) * n(qty3);
    const totalCost = amount1 + amount2 + amount3;
    const totalQty  = n(qty1) + n(qty2) + n(qty3);
    const avgPrice  = totalQty ? totalCost / totalQty : 0;

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCalculated(false); setCopied(false);
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const noLeadingZero = raw.replace(/^0+/, "");
            setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
        };

    const handleReset = () => {
        [setPrice1, setQty1, setPrice2, setQty2, setPrice3, setQty3].forEach(s => s(""));
        setCalculated(false); setCopied(false);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const handleCopyResult = async () => {
        const text = [
            `평균 단가       : ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원`,
            `합계 수량       : ${totalQty.toLocaleString()} 개`,
            `매수 합계 금액  : ${totalCost.toLocaleString()} 원`,
        ].join("\n");
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const rows = [
        { label: "1차", price: price1, qty: qty1, amount: amount1, setPrice: setPrice1, setQty: setQty1 },
        { label: "2차", price: price2, qty: qty2, amount: amount2, setPrice: setPrice2, setQty: setQty2 },
        { label: "3차", price: price3, qty: qty3, amount: amount3, setPrice: setPrice3, setQty: setQty3 },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900">

            <NavBar title="평균 단가 계산기" description={"주식 평균 단가를 정확히 계산해보세요"}/>

            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">💧 물타기</span>
                    <span className="px-3 py-1 bg-red-100  text-red-600  rounded-full text-sm font-semibold">🔥 불타기</span>
                    <h1 className="px-3 py-1 font-bold text-gray-800 dark:text-gray-100">평균 단가 계산기</h1>
                </div>

                <div className="overflow-x-auto">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
                        <table className="border-collapse border border-gray-400 dark:border-gray-600 mx-auto w-full text-sm">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                {["차수", "매수가 (원)", "수량 (개)", "매수금액 (원)"].map(h => (
                                    <th key={h} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-gray-800 dark:text-gray-100 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map(({ label, price, qty, amount, setPrice, setQty }) => (
                                <tr key={label}>
                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-gray-800 dark:text-gray-100 font-medium">{label}</td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-1 py-2 text-center">
                                        <input type="text" inputMode="numeric" placeholder="0" value={price}
                                               onChange={handleChange(setPrice)}
                                               className="p-1 text-right w-20 sm:w-24 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-base" />
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-1 py-2 text-center">
                                        <input type="text" inputMode="numeric" placeholder="0" value={qty}
                                               onChange={handleChange(setQty)}
                                               className="p-1 text-right w-16 sm:w-20 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-base" />
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                        {amount > 0 ? amount.toLocaleString() : "-"}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
                                <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-gray-800 dark:text-gray-100" colSpan={2}>합계</td>
                                <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                    {totalQty > 0 ? totalQty.toLocaleString() : "-"}
                                </td>
                                <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-right text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                    {totalCost > 0 ? totalCost.toLocaleString() : "-"}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={handleReset}
                            className={`px-6 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 transition-colors duration-150 text-base ${ANIMATION.resetShake && shaking ? "animate-shake" : ""}`}>
                        초기화
                    </button>
                    <button onClick={() => setCalculated(true)}
                            className="px-8 py-3 min-h-[44px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors duration-150 text-base">
                        계산하기
                    </button>
                </div>

                {calculated && (
                    <div className={`mt-6 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md text-center space-y-2 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <p className="text-lg text-gray-800 dark:text-gray-100">
                            평균 단가 : <strong className="text-blue-600 dark:text-blue-400">{avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</strong>
                        </p>
                        <p className="text-lg text-gray-800 dark:text-gray-100">
                            합계 수량 : <strong>{totalQty.toLocaleString()} 개</strong>
                        </p>
                        <p className="text-lg text-gray-800 dark:text-gray-100">
                            매수 합계 금액 : <strong className="text-red-500 dark:text-red-400">{totalCost.toLocaleString()} 원</strong>
                        </p>
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button onClick={handleCopyResult}
                                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        copied ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}>
                                {copied ? (
                                    <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>복사 완료!</>
                                ) : (
                                    <><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>결과 복사</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}