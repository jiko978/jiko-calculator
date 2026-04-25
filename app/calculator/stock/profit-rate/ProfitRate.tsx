"use client";

import { useState } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

interface ProfitRateProps {
    stockName?: string;
    initialCode?: string;
}

export default function ProfitRate({ stockName, initialCode }: ProfitRateProps) {
    const [buyPrice, setBuyPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stockCode, setStockCode] = useState(initialCode || "");
    const [result, setResult] = useState<{ profit: number; rate: string; buyTotal: number; currentTotal: number } | null>(null);
    const [copied, setCopied] = useState(false);
    const [shakeField, setShakeField] = useState<string | null>(null);
    const resultRef = useCalculatorScroll(result);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const formatComma = (raw: string) =>
        raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const handleChange = (setter: (v: string) => void, key?: string) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setResult(null);
            const raw = e.target.value.replace(/[^0-9]/g, "");
            const noLeadingZero = raw.replace(/^0+/, "");
            setter(noLeadingZero === "" ? "" : formatComma(noLeadingZero));
            setErrorMessage("");

            if (key && noLeadingZero) {
                setErrors(prev => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!buyPrice) newErrors.add("buyPrice");
        if (!currentPrice) newErrors.add("currentPrice");
        if (!quantity) newErrors.add("quantity");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            setShakeField(Array.from(newErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");
        const buy = Number(buyPrice.replace(/[^0-9]/g, ""));
        const current = Number(currentPrice.replace(/[^0-9]/g, ""));
        const qty = Number(quantity.replace(/[^0-9]/g, ""));
        const buyTotal = buy * qty;
        const currentTotal = current * qty;
        const profit = currentTotal - buyTotal;
        const rate = buy > 0 ? (((current - buy) / buy) * 100).toFixed(2) : "0";
        setResult({ profit, rate, buyTotal, currentTotal });
    };

    const handleReset = () => {
        setBuyPrice(""); setCurrentPrice(""); setQuantity("");
        setResult(null); setCopied(false);
        setErrors(new Set()); setErrorMessage("");
        
        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => btn.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500);
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const generateShareText = () => {
        if (!result) return "";
        return [
            `[💰 주식 수익률 계산 결과]`,
            `매수가 : ${buyPrice}원`,
            `현재가 : ${currentPrice}원`,
            `수량 : ${quantity}주`,
            `매수 금액 : ${result.buyTotal.toLocaleString()} 원`,
            `현재 금액 : ${result.currentTotal.toLocaleString()} 원`,
            `수익금 : ${result.profit >= 0 ? "+" : ""}${result.profit.toLocaleString()} 원`,
            `수익률 : ${Number(result.rate) >= 0 ? "+" : ""}${result.rate} %`,
            `\n📌JIKO 주식 수익률 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/stock/profit-rate`
        ].join("\n");
    };

    const handleCopyResult = async () => {
        const text = generateShareText();
        if (text) await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 그래프 계산
    const getBarWidths = () => {
        if (!result) return { buyWidth: 0, currentWidth: 0 };
        const max = Math.max(result.buyTotal, result.currentTotal);
        if (max === 0) return { buyWidth: 0, currentWidth: 0 };
        return {
            buyWidth: Math.round((result.buyTotal / max) * 100),
            currentWidth: Math.round((result.currentTotal / max) * 100),
        };
    };

    const { buyWidth, currentWidth } = getBarWidths();
    const isProfit = result ? result.profit >= 0 : true;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">


            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="flex justify-center flex-wrap gap-2">
                        {stockName && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-100 dark:border-blue-800">
                                📊 {stockName} {stockCode ? `(${stockCode})` : ""}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold">
                            💰 주식 수익률 계산기
                        </span>
                    </div>
                </div>

                {/* 입력 영역 */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8">
                    <div className="space-y-6">
                        {[
                            { label: "매수가", unit: "원", value: buyPrice, setter: setBuyPrice, placeholder: "평균 매입 단가", key: "buyPrice", id: "stock-buy-price" },
                            { label: "현재가", unit: "원", value: currentPrice, setter: setCurrentPrice, placeholder: "현재 주식 가격", key: "currentPrice", id: "stock-current-price" },
                            { label: "수량", unit: "개", value: quantity, setter: setQuantity, placeholder: "보유 주식 수", key: "quantity", id: "stock-quantity" },
                        ].map(({ label, unit, value, setter, placeholder, key, id }) => (
                            <div key={label} className="flex flex-col gap-1">
                                <div className="flex items-center gap-4">
                                    <label htmlFor={id} className={`w-20 font-semibold shrink-0 ${errors.has(key) ? "text-red-500" : "text-gray-800 dark:text-gray-100"}`}>{label}</label>
                                    <div className="flex items-center flex-1">
                                        <input
                                            id={id}
                                            type="text" inputMode="numeric" placeholder={placeholder}
                                            value={value}
                                            onChange={handleChange(setter, key)}
                                            className={`w-full border-2 rounded-lg px-4 py-2 text-right focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-base transition-all font-semibold ${
                                                errors.has(key) ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-300 dark:border-gray-600 focus:ring-blue-400 ring-blue-400/10 focus:ring-4"
                                            } ${shakeField === key ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                        />
                                        <span aria-hidden="true" className={`ml-2 w-8 shrink-0 ${errors.has(key) ? "text-red-500 font-bold" : "text-gray-500 dark:text-gray-400"}`}>{unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 버튼 */}
                <div className="mt-8 w-full">
                    <CalculatorButtons 
                        onReset={handleReset} 
                        onCalculate={handleCalculate} 
                        calculateText="계산하기"
                    />
                    {errorMessage && (
                        <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                            🚨 {errorMessage}
                        </div>
                    )}
                </div>

                {/* 결과 영역 */}
                {result && (
                    <div ref={resultRef} className={`mt-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* 좌측: 결과 수치 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md space-y-3">
                                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">계산 결과</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">매수 금액</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{result.buyTotal.toLocaleString()} 원</strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">현재 금액</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{result.currentTotal.toLocaleString()} 원</strong>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">수익금</span>
                                    <strong className={isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}>
                                        {result.profit >= 0 ? "+" : ""}{result.profit.toLocaleString()} 원
                                    </strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">수익률</span>
                                    <strong className={`text-xl ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                        {Number(result.rate) >= 0 ? "+" : ""}{result.rate} %
                                    </strong>
                                </div>
                            </div>

                            {/* 우측: 그래프 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col justify-center">
                                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-5">금액 비교</h2>

                                {/* 수익률 % 크게 표시 */}
                                <div className="text-center mb-5">
                                    <span className={`text-4xl font-bold ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                        {Number(result.rate) >= 0 ? "+" : ""}{result.rate}%
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {isProfit ? "수익" : "손실"}
                                    </p>
                                </div>

                                {/* 가로 막대 그래프 */}
                                <div className="space-y-3">
                                    {/* 매수금액 바 */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <span>매수 금액</span>
                                            <span>{result.buyTotal.toLocaleString()} 원</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-4 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-700 ease-out"
                                                style={{ width: `${buyWidth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 현재금액 바 */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <span>현재 금액</span>
                                            <span>{result.currentTotal.toLocaleString()} 원</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-700 ease-out ${isProfit ? "bg-red-400 dark:bg-red-500" : "bg-blue-400 dark:bg-blue-500"}`}
                                                style={{ width: `${currentWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 범례 */}
                                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
                                        매수
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className={`w-3 h-3 rounded-full inline-block ${isProfit ? "bg-red-400" : "bg-blue-400"}`} />
                                        현재
                                    </span>
                                </div>
                            </div>

                        </div>
                        <CalculatorActions
                            onCopy={handleCopyResult}
                            shareTitle=""
                            shareDescription={generateShareText()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}