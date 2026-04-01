"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type CalcType = "A" | "B" | "C";

export default function Pregnancy() {
    const [calcType, setCalcType] = useState<CalcType>("A");

    // Inputs
    const [lastPeriod, setLastPeriod] = useState<string>("");
    
    // For type B
    const [refDate, setRefDate] = useState<string>("");
    const [inputWeeks, setInputWeeks] = useState<number>(0);
    const [inputDays, setInputDays] = useState<number>(0);
    
    // For type C
    const [expectedDueDate, setExpectedDueDate] = useState<string>("");

    const [resultDueDate, setResultDueDate] = useState<string | null>(null);
    const [resultCurrentWeeks, setResultCurrentWeeks] = useState<number>(0);
    const [resultCurrentDays, setResultCurrentDays] = useState<number>(0);
    const [resultProgress, setResultProgress] = useState<number>(0);
    const [resultTrimester, setResultTrimester] = useState<string>("");
    const [resultDDay, setResultDDay] = useState<number>(0);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [shakeField, setShakeField] = useState<string | null>(null);
    const resultRef = useCalculatorScroll(resultDueDate);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        let day1: Date | null = null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (calcType === "A") {
            if (!lastPeriod) newErrors.add("lastPeriod");
        } else if (calcType === "B") {
            if (!refDate) newErrors.add("refDate");
            if (inputWeeks === 0 && inputDays === 0) {
                newErrors.add("inputWeeks");
                newErrors.add("inputDays");
            }
        } else if (calcType === "C") {
            if (!expectedDueDate) newErrors.add("expectedDueDate");
        }

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setShakeField(Array.from(newErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        if (calcType === "A") {
            day1 = new Date(lastPeriod);
        } else if (calcType === "B") {
            const ref = new Date(refDate);
            const diffDays = (inputWeeks * 7) + inputDays;
            day1 = new Date(ref.getTime());
            day1.setDate(day1.getDate() - diffDays);
        } else if (calcType === "C") {
            const due = new Date(expectedDueDate);
            day1 = new Date(due.getTime());
            day1.setDate(day1.getDate() - 280);
        }

        if (day1 && isNaN(day1.getTime())) {
            setErrorMessage("날짜 형식이 올바르지 않습니다.");
            return;
        }

        if (day1) {
            setErrorMessage("");
            // Due date is 280 days from day1
            const dueDate = new Date(day1.getTime());
            dueDate.setDate(dueDate.getDate() + 280);

            // Current elapsed days
            const diffTime = today.getTime() - day1.getTime();
            let elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (elapsedDays < 0) elapsedDays = 0;
            if (elapsedDays > 290) elapsedDays = 290; // Exceeds slightly is fine, but cap it.

            const currentW = Math.floor(elapsedDays / 7);
            const currentD = elapsedDays % 7;
            const progress = (elapsedDays / 280) * 100;

            const dueDiffTime = dueDate.getTime() - today.getTime();
            const dDay = Math.ceil(dueDiffTime / (1000 * 60 * 60 * 24));

            let trimester = "";
            if (currentW < 14) trimester = "임신 초기";
            else if (currentW < 28) trimester = "임신 중기";
            else trimester = "임신 후기";

            const formatDate = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

            setResultDueDate(formatDate(dueDate));
            setResultCurrentWeeks(currentW);
            setResultCurrentDays(currentD);
            setResultProgress(Math.min(100, Math.max(0, progress)));
            setResultDDay(dDay);
            setResultTrimester(trimester);
        }
    };

    const handleReset = () => {
        setLastPeriod("");
        setRefDate("");
        setInputWeeks(0);
        setInputDays(0);
        setExpectedDueDate("");
        setResultDueDate(null);
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
        if (resultDueDate) {
            const text = `[👶️ 임신주수 계산 결과]\n\n출산 예정일 : ${resultDueDate}\n현재 임신기간 : ${resultCurrentWeeks}주 ${resultCurrentDays}일차 (${resultTrimester})\n진행률 : ${resultProgress.toFixed(1)}%\n\n📌JIKO 임신주수 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/pregnancy`;
            await navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                        👶 임신주수 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    {/* 탭 헤더 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button onClick={() => setCalcType("A")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "A" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>마지막 생리일 기준</button>
                        <button onClick={() => setCalcType("B")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "B" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>초음파 주수 기준</button>
                        <button onClick={() => setCalcType("C")} className={`py-3 px-2 rounded-xl text-sm font-bold transition-colors ${calcType === "C" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>출산 예정일 기준</button>
                    </div>

                    <div className="pt-2">
                        {calcType === "A" && (
                            <div>
                                <label htmlFor="last-period" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">마지막 생리 시작일</label>
                                <input 
                                    id="last-period"
                                    type="date" 
                                    max="9999-12-31"
                                    className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border font-semibold ${errors.has("lastPeriod") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all [text-align:right] md:[text-align:left] focus:ring-2 focus:ring-purple-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "lastPeriod" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                    value={lastPeriod} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const yearPart = val.split('-')[0];
                                        if (yearPart && yearPart.length > 4) return;
                                        setLastPeriod(val);
                                        if (val) {
                                            setErrors(prev => {
                                                const next = new Set(prev);
                                                next.delete("lastPeriod");
                                                return next;
                                            });
                                        }
                                    }} 
                                />
                            </div>
                        )}
                        {calcType === "B" && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="ref-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">초음파 기준 날짜</label>
                                    <input 
                                        id="ref-date"
                                        type="date" 
                                        max="9999-12-31"
                                        className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("refDate") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all [text-align:right] md:[text-align:left] focus:ring-2 focus:ring-purple-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "refDate" ? "animate-[shake_0.5s_ease-in-out]" : ""}`} 
                                        value={refDate} 
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const yearPart = val.split('-')[0];
                                            if (yearPart && yearPart.length > 4) return;
                                            setRefDate(val);
                                            if (val) {
                                                setErrors(prev => {
                                                    const next = new Set(prev);
                                                    next.delete("refDate");
                                                    return next;
                                                });
                                            }
                                        }} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="input-weeks" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">진단 주수 (주)</label>
                                        <input 
                                            id="input-weeks"
                                            type="number" 
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("inputWeeks") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all focus:ring-2 focus:ring-purple-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "inputWeeks" ? "animate-[shake_0.5s_ease-in-out]" : ""}`} 
                                            placeholder="0" 
                                            value={inputWeeks || ""} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setInputWeeks(val);
                                                if (val > 0) {
                                                    setErrors(prev => {
                                                        const next = new Set(prev);
                                                        next.delete("inputWeeks");
                                                        next.delete("inputDays");
                                                        return next;
                                                    });
                                                }
                                            }} 
                                            min="0" max="42" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="input-days" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">진단 일수 (일)</label>
                                        <input 
                                            id="input-days"
                                            type="number" 
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("inputDays") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all focus:ring-2 focus:ring-purple-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "inputDays" ? "animate-[shake_0.5s_ease-in-out]" : ""}`} 
                                            placeholder="0" 
                                            value={inputDays || ""} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setInputDays(val);
                                                if (val > 0) {
                                                    setErrors(prev => {
                                                        const next = new Set(prev);
                                                        next.delete("inputWeeks");
                                                        next.delete("inputDays");
                                                        return next;
                                                    });
                                                }
                                            }} 
                                            min="0" max="6" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {calcType === "C" && (
                            <div>
                                <label htmlFor="expected-due-date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">출산 예정일</label>
                                <input 
                                    id="expected-due-date"
                                    type="date" 
                                    max="9999-12-31"
                                    className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("expectedDueDate") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all [text-align:right] md:[text-align:left] focus:ring-2 focus:ring-purple-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "expectedDueDate" ? "animate-[shake_0.5s_ease-in-out]" : ""}`} 
                                    value={expectedDueDate} 
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const yearPart = val.split('-')[0];
                                        if (yearPart && yearPart.length > 4) return;
                                        setExpectedDueDate(val);
                                        if (val) {
                                            setErrors(prev => {
                                                const next = new Set(prev);
                                                next.delete("expectedDueDate");
                                                return next;
                                            });
                                        }
                                    }} 
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4 w-full">
                            <button
                                id="resetBtn"
                                onClick={handleReset}
                                className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleCalculate}
                                className="flex-[2] py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-purple-500/20 active:scale-95"
                            >
                                계산하기
                            </button>
                        </div>
                        {errorMessage && (
                            <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>

                    {resultDueDate && (
                        <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
                            <div className="p-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[40px] text-white shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute -right-6 -top-6 text-9xl opacity-10">👶</div>
                                <p className="text-purple-100 font-medium mb-2 opacity-90">우리 아기 만나는 날 👶</p>
                                <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                                    {resultDueDate}
                                </div>
                                <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/30">
                                    {resultDDay > 0 ? `D-${resultDDay}` : resultDDay === 0 ? "D-Day (오늘)" : `D+${Math.abs(resultDDay)} (예정일 지남)`}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
                                <p className="text-center text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase tracking-widest font-bold">오늘 기준 진행 상황</p>
                                <p className="text-center font-black text-2xl text-purple-600 dark:text-purple-400 mb-6">
                                    {resultCurrentWeeks}주 {resultCurrentDays}일차 ({resultTrimester})
                                </p>
                                
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-6 mb-2 overflow-hidden border border-gray-100 dark:border-gray-600">
                                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out shadow-inner" style={{ width: `${resultProgress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold px-1">
                                    <span className="text-gray-400">0%</span>
                                    <span className="text-purple-600 dark:text-purple-400 text-lg">{resultProgress.toFixed(1)}%</span>
                                    <span className="text-gray-400">100%</span>
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle="[👶 임신주수 계산 결과]"
                                shareDescription={`출산 예정일 : ${resultDueDate}, 현재 임신기간 : ${resultCurrentWeeks}주 ${resultCurrentDays}일차`}
                            />
                        </div>
                    )}
                </div>
            </div>



            <InstallBanner />
        </div>
    );
}
