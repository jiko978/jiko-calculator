"use client";

import { useState } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type CalcType = "DDAY" | "DAYS" | "WEEKS" | "MONTHS" | "YEARS";

const DateCalculator = () => {
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [calcType, setCalcType] = useState<CalcType>("DAYS");

    const [calculated, setCalculated] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [resultData, setResultData] = useState<any>(null);

    const resultRef = useCalculatorScroll(calculated);

    const lifeTabs = [
        { label: "날짜 계산기", href: "/calculator/life/date" },
        { label: "디데이 계산기", href: "/calculator/life/d-day" },
        { label: "전역일 계산기", href: "/calculator/life/discharge-day" },
    ];

    const handleCalculate = () => {
        // 필수값 체크
        if (!startDate) {
            setErrorMessage("시작일을 선택해 주세요.");
            setShakeField("startDate");
            setTimeout(() => setShakeField(null), 500);
            return;
        }
        if (!endDate) {
            setErrorMessage("종료일을 선택해 주세요.");
            setShakeField("endDate");
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");
        // 날짜 객체 생성 시 로컬 시간 기준으로 자정 설정
        const [sY, sM, sD] = startDate.split('-').map(Number);
        const start = new Date(sY, sM - 1, sD);
        start.setHours(0, 0, 0, 0);

        const [eY, eM, eD] = endDate.split('-').map(Number);
        const end = new Date(eY, eM - 1, eD);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        const includeStartDays = diffDays + 1;
        
        let mainResult = "";

        if (calcType === "DDAY") {
            mainResult = diffDays === 0 ? "D-Day" : diffDays > 0 ? `D+${diffDays}` : `D${diffDays}`;
        } else if (calcType === "DAYS") {
            mainResult = `${includeStartDays.toLocaleString()}일째`;
        } else if (calcType === "WEEKS") {
            const weeks = Math.floor(includeStartDays / 7);
            const days = includeStartDays % 7;
            mainResult = `${weeks}주 ${days}일째`;
        } else if (calcType === "MONTHS") {
            const monthDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            let months = monthDiff;
            const tempDate = new Date(start);
            tempDate.setMonth(tempDate.getMonth() + months);
            if (tempDate > end) months--;
            const remainingDays = Math.ceil((end.getTime() - new Date(start).setMonth(start.getMonth() + months)) / (1000 * 60 * 60 * 24)) + 1;
            mainResult = `${months}개월 ${remainingDays}일째`;
        } else if (calcType === "YEARS") {
            let years = end.getFullYear() - start.getFullYear();
            const tempDate = new Date(start);
            tempDate.setFullYear(tempDate.getFullYear() + years);
            if (tempDate > end) years--;
            const monthsAfterYear = (end.getFullYear() - (start.getFullYear() + years)) * 12 + (end.getMonth() - start.getMonth());
            let finalMonths = monthsAfterYear;
            const tempDate2 = new Date(start);
            tempDate2.setFullYear(tempDate2.getFullYear() + years);
            tempDate2.setMonth(tempDate2.getMonth() + finalMonths);
            if (tempDate2 > end) finalMonths--;
            const remainingDays = Math.ceil((end.getTime() - new Date(start).setFullYear(start.getFullYear() + years, start.getMonth() + finalMonths)) / (1000 * 60 * 60 * 24)) + 1;
            mainResult = `${years}년 ${finalMonths}개월 ${remainingDays}일째`;
        }

        const milestones = [100, 200, 300, 365, 500, 730, 1000];
        const timeline = milestones.map(days => {
            const mDate = new Date(start);
            mDate.setDate(start.getDate() + days - 1); // 당일포함 기준
            const y = mDate.getFullYear();
            const m = String(mDate.getMonth() + 1).padStart(2, '0');
            const d = String(mDate.getDate()).padStart(2, '0');
            const formatted = `${y}-${m}-${d}`;

            return {
                label: days % 365 === 0 ? `${days / 365}주년` : `${days}일`,
                date: formatted,
                isToday: formatted === today
            };
        });

        setResultData({
            mainResult,
            timeline,
            startStr: startDate,
            endStr: endDate,
            typeLabel: calcType === "DDAY" ? "디데이" : "기간"
        });
        setCalculated(true);
    };

    const handleReset = () => {
        setStartDate(today);
        setEndDate(today);
        setCalcType("DAYS");
        setCalculated(false);
        setErrorMessage("");
        setShakeField(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generateShareText = () => {
        return `[📅 날짜 계산 결과]\n시작일 : ${resultData.startStr}\n종료일 : ${resultData.endStr}\n결과 : ${resultData.mainResult}\n\n📌 JIKO 날짜 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/life/date`;
    };

    const handleCopy = async () => {
        if (!resultData) return;
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>
                
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold tracking-tight">📅 날짜 계산기</div>
                </div>

                <CalculatorTabs tabs={lifeTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`space-y-4 ${shakeField === 'startDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">시작일 (기준일)</label>
                            <input
                                type="date"
                                value={startDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const yearPart = val.split("-")[0];
                                    if (yearPart && yearPart.length > 4) return;
                                    setStartDate(val);
                                    setCalculated(false);
                                }}
                                className={`w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'startDate' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                            />
                        </div>
                        <div className={`space-y-4 ${shakeField === 'endDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">종료일 (목표일)</label>
                            <input
                                type="date"
                                value={endDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const yearPart = val.split("-")[0];
                                    if (yearPart && yearPart.length > 4) return;
                                    setEndDate(val);
                                    setCalculated(false);
                                }}
                                className={`w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'endDate' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1 text-center">어떻게 계산해드릴까요?</label>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                { id: "DDAY", label: "디데이" },
                                { id: "DAYS", label: "일수" },
                                { id: "WEEKS", label: "주수" },
                                { id: "MONTHS", label: "월수" },
                                { id: "YEARS", label: "년수" }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => { setCalcType(type.id as CalcType); setCalculated(false); }}
                                    className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                                        calcType === type.id 
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105" 
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center border border-red-100 animate-pulse">
                            🚨 {errorMessage}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <CalculatorButtons 
                            onReset={handleReset} 
                            onCalculate={handleCalculate} 
                        />
                    </div>
                </div>

                {calculated && resultData && (
                    <div ref={resultRef} className={`mt-4 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
                            <p className="text-sm font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full inline-block mb-4 tracking-tighter">
                                {resultData.startStr} ~ {resultData.endStr}
                            </p>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                                {resultData.mainResult}
                            </h2>
                            
                            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">🗓️ 기념일 타임라인 (오늘기준)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {resultData.timeline.map((item: any, idx: number) => (
                                        <div key={idx} className={`p-4 rounded-2xl border transition-all ${item.isPassed ? "bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 opacity-60" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:scale-105"}`}>
                                            <p className={`text-[10px] font-black mb-1 ${item.isPassed ? "text-gray-400" : "text-blue-500"}`}>{item.label}</p>
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{item.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle=""
                                shareDescription={generateShareText()}
                            />
                        </div>
                    </div>
                )}

                {/* 하단 상세 가이드 카드 (상시 노출) */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        날짜 계산 상식 가이드
                    </h3>
                    <div className="space-y-6">
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400 mb-2">⚖️ 초일불산입 원칙이란?</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                민법 제157조에 따르면 기간을 일, 주, 월 또는 연으로 정한 때에는 기간의 초일은 산입하지 않는 것이 원칙입니다. 하지만 나이 계산이나 특별한 약정이 있는 경우에는 첫날을 포함하기도 합니다.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <p className="text-[11px] font-black text-gray-400 mb-1">D-Day 계산</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed">목표일 자체를 0으로 보고, 하루가 지날 때마다 숫자가 올라가는 방식입니다. (예: 수능 D-Day)</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <p className="text-[11px] font-black text-gray-400 mb-1">일수/주수 계산</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed">만난 날을 1일로 치는 커플 기념일이나 아기의 생후 개월수는 '시작일 포함' 방식이 표준입니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DateCalculator;
