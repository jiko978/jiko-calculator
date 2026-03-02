'use client'

import { useState } from 'react'

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
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-5">물타기 평균 단가 계산기</h1>

            <table className="border-collapse border border-gray-400">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-400 px-4 py-2 text-center">차수</th>
                    <th className="border border-gray-400 px-4 py-2 text-center">매수가 (원)</th>
                    <th className="border border-gray-400 px-4 py-2 text-center">수량 (개)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border border-gray-400 px-4 py-2 text-center">1차</td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="매수가"
                               value={price1}
                               onChange={handleChange(setPrice1)}
                               className="p-1 text-right w-32" />
                    </td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="수량"
                               value={qty1}
                               onChange={handleChange(setQty1)}
                               className="p-1 text-right w-32" />
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-400 px-4 py-2 text-center">2차</td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="매수가"
                               value={price2}
                               onChange={handleChange(setPrice2)}
                               className="p-1 text-right w-32" />
                    </td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="수량"
                               value={qty2}
                               onChange={handleChange(setQty2)}
                               className="p-1 text-right w-32" />
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-400 px-4 py-2 text-center">3차</td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="매수가"
                               value={price3}
                               onChange={handleChange(setPrice3)}
                               className="p-1 text-right w-32" />
                    </td>
                    <td className="border border-gray-400 px-2 py-2">
                        <input type="text" placeholder="수량"
                               value={qty3}
                               onChange={handleChange(setQty3)}
                               className="p-1 text-right w-32" />
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="mt-5">
                <p className="text-lg">평균 단가: <strong>{avgPrice.toLocaleString()} 원</strong></p>
                <p className="text-lg">합계 수량: <strong>{totalQty.toLocaleString()} 개</strong></p>
            </div>
        </div>
    )
}