"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

export default function Ovulation() {
    const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
    const [cycleLength, setCycleLength] = useState<number>(28);

    const [resultNextPeriod, setResultNextPeriod] = useState<string | null>(null);
    const [resultOvulation, setResultOvulation] = useState<string | null>(null);
    const [resultFertileWindow, setResultFertileWindow] = useState<string | null>(null);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [shakeField, setShakeField] = useState<string | null>(null);
    const resultRef = useCalculatorScroll(resultNextPeriod);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!lastPeriodDate) newErrors.add("date");
        if (!cycleLength || cycleLength < 20 || cycleLength > 45) newErrors.add("cycle");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setShakeField(Array.from(newErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        const date = new Date(lastPeriodDate);
        if (isNaN(date.getTime())) {
            newErrors.add("date");
            setErrors(newErrors);
            setErrorMessage("날짜 형식이 올바르지 않습니다.");
            return;
        }

        setErrorMessage("");

        // 다음 생리 예정일 = 마지막 생리일 + 주기
        const nextPeriod = new Date(date.getTime());
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

        // 배란 예정일 = 다음 생리일 - 14일
        const ovulation = new Date(nextPeriod.getTime());
        ovulation.setDate(ovulation.getDate() - 14);

        // 가임기 = 배란일 - 5일 ~ 배란일 + 2일
        const fertileStart = new Date(ovulation.getTime());
        fertileStart.setDate(fertileStart.getDate() - 5);
        const fertileEnd = new Date(ovulation.getTime());
        fertileEnd.setDate(fertileEnd.getDate() + 2);

        const formatDate = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

        setResultNextPeriod(formatDate(nextPeriod));
        setResultOvulation(formatDate(ovulation));
        setResultFertileWindow(`${formatDate(fertileStart)} ~ ${formatDate(fertileEnd)}`);
    };

    const handleReset = () => {
        setLastPeriodDate("");
        setCycleLength(28);
        setResultNextPeriod(null);
        setResultOvulation(null);
        setResultFertileWindow(null);
        setErrors(new Set());
        setErrorMessage("");

        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => btn.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500);
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const handleCopy = async () => {
        if (resultNextPeriod) {
            const text = `[📅️ 배란일 계산 결과]\n\n다음 생리 예정일 : ${resultNextPeriod}\n배란 예정일 : ${resultOvulation}\n가임기 : ${resultFertileWindow}\n\n📌JIKO 배란일 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/ovulation`;
            await navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold">
                        📅 배란일 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="last-period-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">마지막 생리 시작일</label>
                        <input
                            id="last-period-date"
                            type="date"
                            max="9999-12-31"
                            className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border font-semibold ${errors.has("date") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all [text-align:right] md:[text-align:left] focus:ring-2 focus:ring-pink-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "date" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                            value={lastPeriodDate}
                            onChange={(e) => {
                                const val = e.target.value;
                                const yearPart = val.split('-')[0];
                                if (yearPart && yearPart.length > 4) return;
                                setLastPeriodDate(val);
                                if (val) {
                                    setErrors(prev => {
                                        const next = new Set(prev);
                                        next.delete("date");
                                        return next;
                                    });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="cycle-length" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">평균 생리 주기 (20~45일)</label>
                        <div className="relative">
                            <input
                                id="cycle-length"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border font-semibold ${errors.has("cycle") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all pr-12 text-right focus:ring-2 focus:ring-pink-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "cycle" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                value={cycleLength}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setCycleLength(val || 0);
                                    if (val >= 20 && val <= 45) {
                                        setErrors(prev => {
                                            const next = new Set(prev);
                                            next.delete("cycle");
                                            return next;
                                        });
                                    }
                                }}
                                min="20"
                                max="45"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">일</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <CalculatorButtons 
                            onReset={handleReset} 
                            onCalculate={handleCalculate} 
                        />
                        {errorMessage && (
                            <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>

                    {resultNextPeriod && (
                        <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
                            <div className="p-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-[40px] text-white shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute -right-6 -top-6 text-9xl opacity-10">🌸</div>
                                <p className="text-pink-100 font-medium mb-2 opacity-90">배란 예정일</p>
                                <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                                    {resultOvulation}
                                </div>
                                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/30">
                                    {resultNextPeriod} (생리 예정일)
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-widest">🗓️ 가임기 기간</span>
                                    <span className="text-pink-600 dark:text-pink-400 font-black text-lg">{resultFertileWindow}</span>
                                </div>
                                <p className="mt-6 text-xs text-center text-gray-400 leading-relaxed">
                                    * 주기나 스트레스 등 개인 상황에 따라 오차가 있을 수 있습니다.
                                </p>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle="[📅 배란일 계산 결과]"
                                shareDescription={`예상 배란일 : ${resultOvulation}, 다음 생리 예정일 : ${resultNextPeriod}`}
                            />
                        </div>
                    )}
                </div>
            </div>



            <InstallBanner />
        </div>
    );
}
