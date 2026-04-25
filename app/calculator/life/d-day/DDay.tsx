"use client";

import { useState } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type DDayMode = "TARGET_DATE" | "DAYS_OFFSET";

const DDayCalculator = () => {
    const today = new Date().toISOString().split("T")[0];
    const [baseDate, setBaseDate] = useState(today);
    const [calcMode, setCalcMode] = useState<DDayMode>("TARGET_DATE");

    // Mode A: Target Date
    const [targetDate, setTargetDate] = useState(today);

    // Mode B: Days Offset
    const [offsetDays, setOffsetDays] = useState<string>("100");
    const [offsetType, setOffsetType] = useState<"AFTER" | "BEFORE">("AFTER");

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
        if (!baseDate) {
            setErrorMessage("기준일을 선택해 주세요.");
            setShakeField("baseDate");
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        if (calcMode === "TARGET_DATE" && !targetDate) {
            setErrorMessage("목표일을 선택해 주세요.");
            setShakeField("targetDate");
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        if (calcMode === "DAYS_OFFSET" && !offsetDays) {
            setErrorMessage("계산할 일수를 입력해 주세요.");
            setShakeField("offsetDays");
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");

        // 날짜 객체 생성 시 로컬 시간 기준으로 자정 설정
        const [bY, bM, bD] = baseDate.split('-').map(Number);
        const base = new Date(bY, bM - 1, bD);
        base.setHours(0, 0, 0, 0);

        let mainResultText = "";
        let mainResultSubText = "";

        if (calcMode === "TARGET_DATE") {
            const [tY, tM, tD] = targetDate.split('-').map(Number);
            const target = new Date(tY, tM - 1, tD);
            target.setHours(0, 0, 0, 0);

            const diffTime = target.getTime() - base.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            mainResultText = diffDays === 0 ? "D-Day" : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
            mainResultSubText = `${targetDate}까지`;
        } else {
            const daysV = parseInt(offsetDays) || 0;
            const target = new Date(base);
            // AFTER/BEFORE 계산
            if (offsetType === "AFTER") target.setDate(base.getDate() + daysV);
            else target.setDate(base.getDate() - daysV);

            const yyyy = target.getFullYear();
            const mm = String(target.getMonth() + 1).padStart(2, '0');
            const dd = String(target.getDate()).padStart(2, '0');
            mainResultText = `${yyyy}-${mm}-${dd}`;
            mainResultSubText = `${daysV}일 ${offsetType === "AFTER" ? "후" : "전"} 날짜`;
        }

        const milestones = [100, 200, 300, 365, 500, 730, 1000];
        const timeline = milestones.map(days => {
            const mDate = new Date(base);
            mDate.setDate(base.getDate() + days);
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
            mainResultText,
            mainResultSubText,
            timeline,
            baseDate,
        });
        setCalculated(true);
    };

    const handleReset = () => {
        setBaseDate(today);
        setCalcMode("TARGET_DATE");
        setTargetDate(today);
        setOffsetDays("100");
        setOffsetType("AFTER");
        setCalculated(false);
        setErrorMessage("");
        setShakeField(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generateShareText = () => {
        if (!resultData) {
            return `📌 JIKO 디데이 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/d-day`;
        }

        return `[🕯️ 디데이 계산 결과]\n기준일 : ${resultData.baseDate}\n목표일 : ${resultData.mainResultSubText} ${resultData.mainResultText}\n\n📌 JIKO 디데이 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/d-day`;
    };

    const handleCopy = async () => {
        if (!resultData) return;
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm font-semibold tracking-tight">🕯️ 디데이 계산기</div>
                </div>

                <CalculatorTabs tabs={lifeTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-8">
                    <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl">
                        <button onClick={() => { setCalcMode("TARGET_DATE"); setCalculated(false); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${calcMode === "TARGET_DATE" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400"}`}>D-day 날짜 선택</button>
                        <button onClick={() => { setCalcMode("DAYS_OFFSET"); setCalculated(false); }} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${calcMode === "DAYS_OFFSET" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400"}`}>전/후 날짜 계산</button>
                    </div>

                    <div className="space-y-6">
                        <div className={`space-y-4 ${shakeField === 'baseDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">기준일 선택</label>
                            <input
                                type="date"
                                value={baseDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const yearPart = val.split("-")[0];
                                    if (yearPart && yearPart.length > 4) return;
                                    setBaseDate(val);
                                    setCalculated(false);
                                }}
                                className={`w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'baseDate' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                            />
                        </div>

                        {calcMode === "TARGET_DATE" ? (
                            <div className={`space-y-4 ${shakeField === 'targetDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">목표일 선택</label>
                                <input
                                    type="date"
                                    value={targetDate}
                                    max="9999-12-31"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const yearPart = val.split("-")[0];
                                        if (yearPart && yearPart.length > 4) return;
                                        setTargetDate(val);
                                        setCalculated(false);
                                    }}
                                    className={`w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'targetDate' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                                />
                            </div>
                        ) : (
                            <div className={`space-y-4 ${shakeField === 'offsetDays' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1 text-center">기준일로부터 며칠째 인가요?</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={offsetDays}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, "");
                                                setOffsetDays(val);
                                                setCalculated(false);
                                            }}
                                            className={`w-full h-14 px-4 pr-12 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'offsetDays' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                                            placeholder="100"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">일</span>
                                    </div>
                                    <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl w-32 border-2 border-gray-100 dark:border-gray-800">
                                        <button onClick={() => { setOffsetType("AFTER"); setCalculated(false); }} className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${offsetType === "AFTER" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400"}`}>후</button>
                                        <button onClick={() => { setOffsetType("BEFORE"); setCalculated(false); }} className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${offsetType === "BEFORE" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400"}`}>전</button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <p className="text-sm font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">{resultData.mainResultSubText}</p>
                            <h2 className={`text-6xl md:text-7xl font-black mb-6 tracking-tighter ${resultData.mainResultText.startsWith("D-") ? "text-blue-600" : "text-pink-600"}`}>
                                {resultData.mainResultText}
                            </h2>
                            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">🕯️ 기념일 한눈에 보기</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {resultData.timeline.map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                            <p className="text-[10px] font-black text-blue-500 mb-1">{item.label}</p>
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

                {/* 하단 가이드 (상시 노출) */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                        디데이 계산 팁
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-pink-600 dark:text-pink-400 mb-2">💘 커플 기념일</p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">연인과의 만남은 보통 '그날부터 1일'을 선호하지만, 순수한 디데이 형식은 기준일 다음 날을 1일로 계산합니다.</p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400 mb-2">🎓 시험 D-Day</p>
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">수업, 시험 등 중요한 날은 목표일 자체를 0으로 봅니다. 목표일이 지나면 D+1 형식으로 자동 전환됩니다.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DDayCalculator;
