'use client'

import { useState } from "react";
import PageTitle from "@/app/components/pageTitle";

export default function AvgPriceCalculator() {
    const [price1, setPrice1] = useState("")
    const [qty1, setQty1] = useState("")

    const [price2, setPrice2] = useState("")
    const [qty2, setQty2] = useState("")

    const [price3, setPrice3] = useState("")
    const [qty3, setQty3] = useState("")

    const nprice1 = Number(price1.replace(/[^0-9]/g, ""));
    const nprice2 = Number(price2.replace(/[^0-9]/g, ""));
    const nprice3 = Number(price3.replace(/[^0-9]/g, ""));

    const nqty1 = Number(qty1.replace(/[^0-9]/g, ""));
    const nqty2 = Number(qty2.replace(/[^0-9]/g, ""));
    const nqty3 = Number(qty3.replace(/[^0-9]/g, ""));

    const totalCost = (nprice1 * nqty1) + (nprice2 * nqty2) + (nprice3 * nqty3)
    const totalQty = nqty1 + nqty2 + nqty3
    const avgPrice = totalQty ? totalCost / totalQty : 0

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const noLeadingZero = raw.replace(/^0+/, "");
            setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
        };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    💧 물타기
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                    🔥 불타기
                    </span>
                    <h1 className="px-3 py-1 font-bold text-center text-gray-800 dark:text-gray-100">평균 단가 계산기</h1>
                </div>

                {/* 테이블 카드 */}
                <div className="overflow-x-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                        <table className="border-collapse border border-gray-400 dark:border-gray-600 mx-auto">
                            <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center text-gray-800 dark:text-gray-100">차수</th>
                                <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center text-gray-800 dark:text-gray-100">매수가 (원)</th>
                                <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center text-gray-800 dark:text-gray-100">수량 (개)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[
                                { label: "1차", price: price1, qty: qty1, setPrice: setPrice1, setQty: setQty1 },
                                { label: "2차", price: price2, qty: qty2, setPrice: setPrice2, setQty: setQty2 },
                                { label: "3차", price: price3, qty: qty3, setPrice: setPrice3, setQty: setQty3 },
                            ].map(({ label, price, qty, setPrice, setQty }) => (
                                <tr key={label}>
                                    <td className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center text-gray-800 dark:text-gray-100">{label}</td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center">
                                        <input type="text" placeholder="매수가"
                                               value={price}
                                               onChange={handleChange(setPrice)}
                                               className="p-2 text-right w-28 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </td>
                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center">
                                        <input type="text" placeholder="수량"
                                               value={qty}
                                               onChange={handleChange(setQty)}
                                               className="p-2 text-right w-28 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-lg text-gray-800 dark:text-gray-100">평균 단가 : <strong>{avgPrice.toLocaleString()} 원</strong></p>
                    <p className="text-lg text-gray-800 dark:text-gray-100">합계 수량 : <strong>{totalQty.toLocaleString()} 개</strong></p>
                </div>
            </div>
        </div>
    )
}