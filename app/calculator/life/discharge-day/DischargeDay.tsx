"use client";

import { useState } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type ServiceBranch = "ARMY" | "NAVY" | "AIR" | "SOCIAL";

const DischargeDayCalculator = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const [enlistDate, setEnlistDate] = useState(todayStr);
    const [branch, setBranch] = useState<ServiceBranch>("ARMY");

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

    const branches = [
        { id: "ARMY", label: "육군/해병/카투사/의경", months: 18 },
        { id: "NAVY", label: "해군/해경", months: 20 },
        { id: "AIR", label: "공군", months: 21 },
        { id: "SOCIAL", label: "사회복무요원", months: 21 },
    ];

    const handleCalculate = () => {
        if (!enlistDate) {
            setErrorMessage("입대일(복무 시작일)을 선택해 주세요.");
            setShakeField("enlistDate");
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");

        // 날짜 추출
        const [eY, eM, eD] = enlistDate.split('-').map(Number);
        const start = new Date(eY, eM - 1, eD);
        start.setHours(0, 0, 0, 0);

        const targetBranch = branches.find(b => b.id === branch);
        const serviceMonths = targetBranch?.months || 18;

        // 전역일 계산: (입대일 + 복무기간) - 1일
        const discharge = new Date(start);
        discharge.setMonth(discharge.getMonth() + serviceMonths);
        discharge.setDate(discharge.getDate() - 1);

        const dY = discharge.getFullYear();
        const dM = String(discharge.getMonth() + 1).padStart(2, '0');
        const dD = String(discharge.getDate()).padStart(2, '0');
        const dischargeDateStr = `${dY}-${dM}-${dD}`;

        // 오늘 날짜 (계산용)
        const [tY, tM, tD] = todayStr.split('-').map(Number);
        const todayObj = new Date(tY, tM - 1, tD);
        todayObj.setHours(0, 0, 0, 0);

        const totalDays = Math.round((discharge.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const servedDays = Math.max(0, Math.round((todayObj.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const progress = Math.min(100, Math.max(0, (servedDays / totalDays) * 100));
        const remainingDays = Math.max(0, totalDays - servedDays);

        // 계급별 진급 마일스톤 (통상 기준)
        const promotionTerms = [2, 6, 6];
        let currentPromoDate = new Date(start);
        const milestoneTimeline = promotionTerms.map((months, idx) => {
            currentPromoDate.setMonth(currentPromoDate.getMonth() + months);
            currentPromoDate.setDate(1);
            const y = currentPromoDate.getFullYear();
            const m = String(currentPromoDate.getMonth() + 1).padStart(2, '0');
            const d = String(currentPromoDate.getDate()).padStart(2, '0');
            return {
                rank: ["일병", "상병", "병장"][idx],
                date: `${y}-${m}-${d}`,
                isPassed: currentPromoDate < todayObj
            };
        });

        setResultData({
            dischargeDate: dischargeDateStr,
            progress: progress.toFixed(2),
            servedDays,
            remainingDays,
            totalDays,
            timeline: milestoneTimeline,
            branchLabel: targetBranch?.label,
            startDate: enlistDate
        });
        setCalculated(true);
    };

    const handleReset = () => {
        setEnlistDate(todayStr);
        setBranch("ARMY");
        setCalculated(false);
        setErrorMessage("");
        setShakeField(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCopy = async () => {
        if (!resultData) return;
        const text = `[🪖 전역일 계산 결과]\n입대일 : ${resultData.startDate}\n전역일 : ${resultData.dischargeDate}\n복무율 : ${resultData.progress}%\n남은일수 : ${resultData.remainingDays}일\n\n📌 JIKO 전역일 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/discharge-day`;
        await navigator.clipboard.writeText(text);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold tracking-tight">🪖 전역일 계산기</div>
                </div>

                <CalculatorTabs tabs={lifeTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">복무 구분 선택</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {branches.map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => { setBranch(b.id as ServiceBranch); setCalculated(false); }}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 ${branch === b.id ? "bg-blue-50 dark:bg-blue-900/4 border-blue-500 text-blue-600 dark:text-blue-400" : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"}`}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`space-y-4 ${shakeField === 'enlistDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">입대일 선택</label>
                            <input
                                type="date"
                                value={enlistDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const yearPart = val.split("-")[0];
                                    if (yearPart && yearPart.length > 4) return;
                                    setEnlistDate(val);
                                    setCalculated(false);
                                }}
                                className={`w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${shakeField === 'enlistDate' ? 'border-red-500' : 'border-gray-100 dark:border-gray-700 focus:border-blue-500'}`}
                            />
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
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                            <p className="text-[12px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">전역일까지 D-{resultData.remainingDays}</p>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">{resultData.dischargeDate}</h2>

                            <div className="space-y-3 mb-10">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-xs font-bold text-gray-400 tracking-widest">{resultData.branchLabel} 복무율</span>
                                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{resultData.progress}%</span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${resultData.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                                    <span>입대 {resultData.servedDays}일차</span>
                                    <span>남은 기간 {resultData.remainingDays}일</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">🎖️ 진급 마일스톤</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {resultData.timeline.map((item: any, idx: number) => (
                                        <div key={idx} className={`p-4 rounded-2xl border transition-all ${item.isPassed ? "bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 opacity-60" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"}`}>
                                            <p className={`text-[10px] font-black mb-1 ${item.isPassed ? "text-gray-400" : "text-blue-500"}`}>{item.rank} 진급</p>
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{item.date}</p>
                                        </div>
                                    ))}
                                    <div className="p-4 rounded-2xl border bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 shadow-sm">
                                        <p className="text-[10px] font-black mb-1 text-blue-600 dark:text-blue-400">전역</p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{resultData.dischargeDate}</p>
                                    </div>
                                </div>
                            </div>
                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle={`[🪖 전역일 계산 결과] ${resultData.dischargeDate} 전역!`}
                                shareDescription={`현재 복무율은 ${resultData.progress}% 입니다.`}
                            />
                        </div>
                    </div>
                )}

                {/* 하단 가이드 (상시 노출) */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        군 복무 및 전역 상식
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200 mb-1.5 leading-relaxed">💡 전역일 계산 기준</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">군별 복무 기간에 따라 '입대일 시점 + N개월 - 1일'을 전역일로 봅니다.</p>
                        </div>
                        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <p className="text-sm font-black text-gray-800 dark:text-gray-200 mb-1.5 leading-relaxed">🗓️ 진급일 예측</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">부대 상황에 따라 다를 수 있으며 시점 파악을 위한 참고용 데이터입니다.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DischargeDayCalculator;
