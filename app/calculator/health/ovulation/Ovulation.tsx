"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

export default function Ovulation() {
    const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
    const [cycleLength, setCycleLength] = useState<number>(28);

    const [resultNextPeriod, setResultNextPeriod] = useState<string | null>(null);
    const [resultOvulation, setResultOvulation] = useState<string | null>(null);
    const [resultFertileWindow, setResultFertileWindow] = useState<string | null>(null);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!lastPeriodDate) newErrors.add("date");
        if (!cycleLength || cycleLength < 20 || cycleLength > 45) newErrors.add("cycle");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
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
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setLastPeriodDate("");
        setCycleLength(28);
        setResultNextPeriod(null);
        setResultOvulation(null);
        setResultFertileWindow(null);
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleCopy = () => {
        if (resultNextPeriod) {
            const text = `다음 생리 예정일: ${resultNextPeriod}\n배란 예정일: ${resultOvulation}\n가임기: ${resultFertileWindow}`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
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
                            className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("date") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all [text-align:right] md:[text-align:left] focus:ring-2 focus:ring-pink-500 dark:text-gray-100 placeholder-gray-400`}
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
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("cycle") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all pr-12 text-right focus:ring-2 focus:ring-pink-500 dark:text-gray-100 placeholder-gray-400`}
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

                    <div className="flex flex-col items-center gap-3 pt-4">
                        <div className="flex gap-3 w-full">
                            <button onClick={handleReset} className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>초기화</button>
                            <button onClick={handleCalculate} className="flex-[2] py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-colors shadow-sm">계산하기</button>
                        </div>
                        {errorMessage && (
                            <p className="text-center text-red-500 text-sm font-bold flex items-center justify-center gap-1 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    {resultNextPeriod && (
                        <div className="mt-8 p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-800">
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">다음 생리 예정일</span>
                                    <span className="text-pink-600 dark:text-pink-400 font-bold">{resultNextPeriod}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-pink-200 dark:border-pink-700">
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">🌸 배란 예정일</span>
                                    <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">{resultOvulation}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">가임기 캘린더</span>
                                    <span className="text-pink-600 dark:text-pink-400 font-bold">{resultFertileWindow}</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
                                * 생리 주기가 불규칙한 경우 계산 결과가 부정확할 수 있습니다.
                                본 계산 결과는 단순 참조용이며, 의학적 피임이나 진단을 대체할 수 없습니다.
                            </p>

                            <button onClick={handleCopy} className="w-full py-3 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-bold rounded-xl border border-pink-200 dark:border-pink-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">결과 복사하기</button>
                        </div>
                    )}
                </div>
            </div>
            <InstallBanner />
        </div>
    );
}
