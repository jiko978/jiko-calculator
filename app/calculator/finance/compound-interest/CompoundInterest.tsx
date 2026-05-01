"use client";

import { useState, useRef, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import { numberToKorean } from "@/app/utils/financeUtils";

type CalcMode = "fv" | "period" | "rate" | "pmt";

interface YearlyData {
    year: number;
    principal: number;
    interest: number;
    total: number;
}

export default function CompoundInterest() {
    const [mode, setMode] = useState<CalcMode>("fv");

    // Inputs
    const [principal, setPrincipal] = useState(""); // 초기 투자금
    const [monthlyContribution, setMonthlyContribution] = useState(""); // 월 적립금
    const [years, setYears] = useState(""); // 투자 기간(년)
    const [rate, setRate] = useState(""); // 예상 연평균 수익률(%)
    const [targetAmount, setTargetAmount] = useState(""); // 목표 금액

    // Options
    const [compoundingFrequency, setCompoundingFrequency] = useState<"yearly" | "monthly">("monthly");
    const [useInflation, setUseInflation] = useState(false);
    const [inflationRate, setInflationRate] = useState("3.0"); // 기본 3%

    // UI States
    const [calculated, setCalculated] = useState(false);
    const [scrollTrigger, setScrollTrigger] = useState(0);
    const [shaking, setShaking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [showMonthlyTable, setShowMonthlyTable] = useState(false);
    const resultRef = useCalculatorScroll(scrollTrigger);

    // Results
    const [resultFV, setResultFV] = useState(0);
    const [resultTotalPrincipal, setResultTotalPrincipal] = useState(0);
    const [resultInterest, setResultInterest] = useState(0);
    const [resultYears, setResultYears] = useState(0);
    const [resultRate, setResultRate] = useState(0);
    const [resultPmt, setResultPmt] = useState(0);
    const [schedule, setSchedule] = useState<YearlyData[]>([]);

    // Simple Interest Comparison
    const [simpleInterestResult, setSimpleInterestResult] = useState(0);

    const n = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
    const formatComma = (raw: string | number) => {
        const val = typeof raw === "number" ? Math.floor(raw).toString() : raw;
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void, fieldId: string, isDecimal = false) => {
        const regex = isDecimal ? /[^0-9.]/g : /[^0-9]/g;
        let raw = e.target.value.replace(regex, "");
        if (!isDecimal) raw = raw.replace(/^0+/, "");
        
        if (raw.length > 13) return; // Prevent overflow
        setter(isDecimal ? raw : (raw === "" ? "" : formatComma(raw)));
        setCalculated(false);
        if (raw) {
            setErrorMessage("");
            setErrors(prev => {
                const next = new Set(prev);
                next.delete(fieldId);
                return next;
            });
        }
    };

    const handleReset = () => {
        setPrincipal("");
        setMonthlyContribution("");
        setYears("");
        setRate("");
        setTargetAmount("");
        setUseInflation(false);
        setInflationRate("3.0");
        setCalculated(false);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    // Core Calculation Function (Forward calculation for FV)
    const calculateCore = (p: number, pmt: number, yrs: number, r: number, freq: "yearly" | "monthly") => {
        let balance = p;
        let totalP = p;
        const totalMonths = yrs * 12;
        const monthRate = r / 100 / 12;
        const yearRate = r / 100;
        let yearlyData: YearlyData[] = [];
        let cumInterest = 0;

        for (let month = 1; month <= totalMonths; month++) {
            totalP += pmt;
            balance += pmt;

            if (freq === "monthly") {
                const interest = balance * monthRate;
                balance += interest;
                cumInterest += interest;
            }

            if (month % 12 === 0) {
                if (freq === "yearly") {
                    const interest = balance * yearRate;
                    balance += interest;
                    cumInterest += interest;
                }
                yearlyData.push({
                    year: month / 12,
                    principal: totalP,
                    interest: cumInterest,
                    total: balance
                });
            }
        }
        return { balance, totalP, cumInterest, yearlyData };
    };

    const handleCalculate = () => {
        const newErrors = new Set<string>();

        // Validation based on mode
        if (mode !== "pmt" && mode !== "period" && !principal && !monthlyContribution) {
            newErrors.add("monthlyContribution");
        }
        if (mode === "fv" || mode === "rate" || mode === "pmt") {
            if (!years) newErrors.add("years");
        }
        if (mode === "fv" || mode === "period" || mode === "pmt") {
            if (!rate) newErrors.add("rate");
        }
        if (mode === "period" || mode === "rate" || mode === "pmt") {
            if (!targetAmount) newErrors.add("targetAmount");
        }

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            setCalculated(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        setErrorMessage("");
        
        const p = n(principal);
        const pmt = n(monthlyContribution);
        const y = n(years);
        const r = n(rate);
        const t = n(targetAmount);

        let finalFV = 0;
        let finalP = 0;
        let finalInt = 0;
        let finalY = y;
        let finalR = r;
        let finalPmt = pmt;
        let finalSchedule: YearlyData[] = [];

        if (mode === "fv") {
            const res = calculateCore(p, pmt, y, r, compoundingFrequency);
            finalFV = res.balance;
            finalP = res.totalP;
            finalInt = res.cumInterest;
            finalSchedule = res.yearlyData;

            // 단리 계산 (원금에만 이자)
            const simpleTotalP = p + (pmt * y * 12);
            let simpleInt = 0;
            if (compoundingFrequency === "monthly") {
                // 단리 (월 단위 적립)
                simpleInt = p * (r/100) * y;
                for(let i=1; i<=y*12; i++) {
                    simpleInt += pmt * (r/100) * ((y*12 - i + 1)/12);
                }
            } else {
                simpleInt = p * (r/100) * y;
                for(let i=1; i<=y; i++) {
                    simpleInt += (pmt * 12) * (r/100) * (y - i + 1);
                }
            }
            setSimpleInterestResult(simpleTotalP + simpleInt);
        } 
        else if (mode === "period") {
            // Binary search for years (0 to 100)
            let low = 0;
            let high = 100;
            let mid = 0;
            let bestRes = null;
            for(let i=0; i<50; i++) {
                mid = (low + high) / 2;
                const res = calculateCore(p, pmt, mid, r, compoundingFrequency);
                if (res.balance >= t) high = mid;
                else low = mid;
            }
            finalY = high;
            const res = calculateCore(p, pmt, Math.ceil(finalY), r, compoundingFrequency);
            finalFV = res.balance;
            finalP = res.totalP;
            finalInt = res.cumInterest;
            finalSchedule = res.yearlyData;
            setResultYears(finalY);
        }
        else if (mode === "rate") {
            // Binary search for rate (0 to 1000%)
            let low = 0;
            let high = 1000;
            let mid = 0;
            for(let i=0; i<50; i++) {
                mid = (low + high) / 2;
                const res = calculateCore(p, pmt, y, mid, compoundingFrequency);
                if (res.balance >= t) high = mid;
                else low = mid;
            }
            finalR = high;
            const res = calculateCore(p, pmt, y, finalR, compoundingFrequency);
            finalFV = res.balance;
            finalP = res.totalP;
            finalInt = res.cumInterest;
            finalSchedule = res.yearlyData;
            setResultRate(finalR);
        }
        else if (mode === "pmt") {
            // Binary search for PMT (0 to target)
            let low = 0;
            let high = t;
            let mid = 0;
            for(let i=0; i<50; i++) {
                mid = (low + high) / 2;
                const res = calculateCore(p, mid, y, r, compoundingFrequency);
                if (res.balance >= t) high = mid;
                else low = mid;
            }
            finalPmt = high;
            const res = calculateCore(p, finalPmt, y, r, compoundingFrequency);
            finalFV = res.balance;
            finalP = res.totalP;
            finalInt = res.cumInterest;
            finalSchedule = res.yearlyData;
            setResultPmt(finalPmt);
        }

        setResultFV(finalFV);
        setResultTotalPrincipal(finalP);
        setResultInterest(finalInt);
        setSchedule(finalSchedule);
        setCalculated(true);
        setScrollTrigger(prev => prev + 1);
    };

    // Calculate Inflation Adjusted Value
    const inflationMultipler = useInflation ? Math.pow(1 + n(inflationRate) / 100, mode === 'period' ? resultYears : n(years)) : 1;
    const realFV = resultFV / inflationMultipler;
    const realInterest = realFV - resultTotalPrincipal;
    const realReturnRate = resultTotalPrincipal > 0 ? (realInterest / resultTotalPrincipal) * 100 : 0;

    const generateShareText = () => {
        const modeMap = { fv: "미래가치 계산", period: "필요기간 계산", rate: "목표수익률 계산", pmt: "필요 월적립액 계산" };
        let text = `[📈 ${modeMap[mode]} - 복리 계산기 결과]\n`;
        text += `초기투자금 : ${principal || "0"}원\n`;
        text += `월 적립금 : ${mode === 'pmt' ? formatComma(resultPmt) : (monthlyContribution || "0")}원\n`;
        text += `투자 기간 : ${mode === 'period' ? resultYears.toFixed(1) : years}년\n`;
        text += `연 수익률 : ${mode === 'rate' ? resultRate.toFixed(2) : rate}%\n`;
        text += `최종 자산 : ${formatComma(resultFV)}원\n`;
        text += `총 원금 : ${formatComma(resultTotalPrincipal)}원\n`;
        text += `복리 수익 : ${formatComma(resultInterest)}원\n`;
        
        if (useInflation) {
            text += `\n*물가상승률(${inflationRate}%) 반영 시 실질 가치: ${formatComma(realFV)}원\n`;
        }
        
        text += `\n📌JIKO 복리 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/finance/compound-interest`;
        return text;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateShareText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Chart Data calculations
    const maxVal = schedule.length > 0 ? schedule[schedule.length - 1].total : 1;
    
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>
                
                {/* Header & Modes */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full font-semibold shadow-sm border border-gray-100 dark:border-gray-700">📈 복리 계산기</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-6 flex overflow-x-auto hide-scrollbar">
                    {[
                        { id: "fv", label: "미래 가치" },
                        { id: "period", label: "필요 기간" },
                        { id: "rate", label: "목표 수익률" },
                        { id: "pmt", label: "월 적립액" }
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => { setMode(m.id as CalcMode); setCalculated(false); setErrors(new Set()); }}
                            className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${mode === m.id ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Inputs */}
                    <div className="space-y-6 relative z-10">
                        {/* 초기 투자금 */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <label className={`block text-sm font-bold transition-colors ${errors.has("principal") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>초기 투자금 (선택)</label>
                                {principal && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{numberToKorean(principal)} 원</span>}
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={principal}
                                    onChange={(e) => handleNumericChange(e, setPrincipal, "principal")}
                                    placeholder="0"
                                    className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("principal") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"}`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">원</span>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-3">
                                <button onClick={() => { setPrincipal(""); setCalculated(false); }} className="py-2 text-xs font-black bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">C</button>
                                {[10, 50, 100, 500, 1000, 5000, 10000].map(v => (
                                    <button key={v} onClick={() => { setPrincipal(formatComma(n(principal) + v * 10000)); setCalculated(false); }} className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                        +{v >= 10000 ? `${v / 10000}억` : v >= 1000 ? `${v / 1000}천만` : `${v}만`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 월 적립금 (pmt 모드 제외) */}
                        {mode !== "pmt" && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className={`block text-sm font-bold transition-colors ${errors.has("monthlyContribution") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>매월 적립금</label>
                                    {monthlyContribution && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{numberToKorean(monthlyContribution)} 원</span>}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={monthlyContribution}
                                        onChange={(e) => handleNumericChange(e, setMonthlyContribution, "monthlyContribution")}
                                        placeholder="0"
                                        className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("monthlyContribution") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"}`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">원</span>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    <button onClick={() => { setMonthlyContribution(""); setCalculated(false); }} className="py-2 text-xs font-black bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">C</button>
                                    {[5, 10, 30, 50, 100].map(v => (
                                        <button key={v} onClick={() => { setMonthlyContribution(formatComma(n(monthlyContribution) + v * 10000)); setCalculated(false); }} className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            +{v}만
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 목표 금액 (fv 제외) */}
                        {mode !== "fv" && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className={`block text-sm font-bold transition-colors ${errors.has("targetAmount") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>목표 금액</label>
                                    {targetAmount && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{numberToKorean(targetAmount)} 원</span>}
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={targetAmount}
                                        onChange={(e) => handleNumericChange(e, setTargetAmount, "targetAmount")}
                                        placeholder="0"
                                        className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("targetAmount") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"}`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">원</span>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3">
                                    <button onClick={() => { setTargetAmount(""); setCalculated(false); }} className="py-2 text-xs font-black bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">C</button>
                                    {[100, 500, 1000, 5000, 10000, 50000].map(v => (
                                        <button key={v} onClick={() => { setTargetAmount(formatComma(n(targetAmount) + v * 10000)); setCalculated(false); }} className="py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            +{v >= 10000 ? `${v / 10000}억` : v >= 1000 ? `${v / 1000}천만` : `${v}만`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 기간 및 수익률 그리드 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* 투자 기간 (period 모드 제외) */}
                            {mode !== "period" && (
                                <div className="space-y-3">
                                    <label className={`block text-sm font-bold transition-colors ${errors.has("years") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>투자 기간</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={years}
                                            onChange={(e) => handleNumericChange(e, setYears, "years")}
                                            placeholder="0"
                                            className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("years") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"}`}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">년</span>
                                    </div>
                                    <input type="range" min="1" max="100" step="1" value={n(years) || 1} onChange={(e) => { setYears(e.target.value); setCalculated(false); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                </div>
                            )}

                            {/* 연 수익률 (rate 모드 제외) */}
                            {mode !== "rate" && (
                                <div className="space-y-3">
                                    <label className={`block text-sm font-bold transition-colors ${errors.has("rate") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>예상 연 수익률</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={rate}
                                            onChange={(e) => handleNumericChange(e, setRate, "rate", true)}
                                            placeholder="0.0"
                                            className={`w-full h-14 px-4 pr-12 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("rate") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"}`}
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">%</span>
                                    </div>
                                    <input type="range" min="0" max="50" step="0.5" value={n(rate) || 0} onChange={(e) => { setRate(e.target.value); setCalculated(false); }} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                    <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-1">
                                        {[
                                            { l: '예적금(3%)', v: '3.0' },
                                            { l: 'S&P500(10%)', v: '10.0' },
                                            { l: '나스닥(12%)', v: '12.0' }
                                        ].map(preset => (
                                            <button key={preset.v} onClick={() => { setRate(preset.v); setCalculated(false); }} className="px-3 py-1.5 text-[10px] font-bold border bg-blue-50 dark:bg-blue-900/20 border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all whitespace-nowrap">
                                                {preset.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">복리 주기</label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl gap-1">
                                    <button onClick={() => setCompoundingFrequency("yearly")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${compoundingFrequency === "yearly" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>연복리</button>
                                    <button onClick={() => setCompoundingFrequency("monthly")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${compoundingFrequency === "monthly" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>월복리</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">물가상승률(인플레이션) 반영</label>
                                    <button 
                                        onClick={() => setUseInflation(!useInflation)} 
                                        className={`w-11 h-6 rounded-full transition-colors relative ${useInflation ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${useInflation ? "left-6" : "left-1"}`}></div>
                                    </button>
                                </div>
                                {useInflation && (
                                    <div className="relative animate-fade-in">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={inflationRate}
                                            onChange={(e) => handleNumericChange(e, setInflationRate, "inflation", true)}
                                            className="w-full h-10 px-3 pr-8 text-sm font-bold bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-right dark:text-blue-300"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500">%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
                            <CalculatorButtons onReset={handleReset} onCalculate={handleCalculate} />
                            {errorMessage && (
                                <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800/30 animate-pulse flex items-center justify-center gap-2">
                                    <span>🚨</span>{errorMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {calculated && (
                    <div ref={resultRef} className={`mt-8 space-y-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        {/* Main Result Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                            
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
                                {mode === "fv" ? "만기 시 최종 자산 (예상 미래가치)" : 
                                 mode === "period" ? "목표 달성 예상 소요 기간" : 
                                 mode === "rate" ? "필요 연평균 수익률" : "필요 매월 적립액"}
                            </p>
                            
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 break-all">
                                {mode === "period" ? `${Math.floor(resultYears)}년 ${(resultYears % 1 * 12).toFixed(0)}개월` : 
                                 mode === "rate" ? `${resultRate.toFixed(2)}%` : 
                                 mode === "pmt" ? `${formatComma(resultPmt)}원` :
                                 `${formatComma(resultFV)}원`}
                            </h2>

                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 dark:border-gray-700/50">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">총 투자 원금</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formatComma(resultTotalPrincipal)}원</p>
                                </div>
                                <div className="space-y-1 border-l border-gray-100 dark:border-gray-700/50">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">순수 복리 수익</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">+{formatComma(resultInterest)}원</p>
                                </div>
                            </div>

                            {/* 단리 비교 (FV 모드일 때만) */}
                            {mode === "fv" && (
                                <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">⚖️</span>
                                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">복리의 마법 체감하기</h4>
                                    </div>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mb-2">
                                        만약 이자가 재투자되지 않는 <b>단리</b>였다면 최종 자산은 <b className="text-amber-900 dark:text-amber-200">{formatComma(simpleInterestResult)}원</b>입니다.
                                    </p>
                                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                        복리 효과로 인해 <span className="text-lg text-amber-700 dark:text-amber-300">+{formatComma(resultFV - simpleInterestResult)}원</span>을 더 벌었습니다!
                                    </p>
                                </div>
                            )}

                            {/* 인플레이션 결과 */}
                            {useInflation && (
                                <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-4 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">🛒</span>
                                        <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-400">물가상승률({inflationRate}%) 반영 실질 가치</h4>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-indigo-700/80 dark:text-indigo-300/80">실질 예상 자산</span>
                                        <span className="font-bold text-indigo-900 dark:text-indigo-200">{formatComma(realFV)}원</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <span className="text-indigo-700/80 dark:text-indigo-300/80">실질 수익률</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{realReturnRate.toFixed(2)}%</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                                <CalculatorActions onCopy={handleCopy} shareTitle="" shareDescription={generateShareText()} />
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 도넛 차트 (원금 vs 수익) */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 w-full mb-6">자산 구성 비중</h3>
                                <div className="relative w-48 h-48 mb-6 drop-shadow-xl">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-700" />
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(resultTotalPrincipal / resultFV) * 100 || 0} ${100 - ((resultTotalPrincipal / resultFV) * 100 || 0)}`} className="text-indigo-400 transition-all duration-1000" />
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(resultInterest / resultFV) * 100 || 0} ${100 - ((resultInterest / resultFV) * 100 || 0)}`} strokeDashoffset={`-${(resultTotalPrincipal / resultFV) * 100 || 0}`} className="text-blue-500 transition-all duration-1000" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-[10px] text-gray-500 font-bold">수익 비중</p>
                                        <p className="text-2xl font-black text-blue-600">{((resultInterest / resultFV) * 100 || 0).toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="w-full flex justify-around text-xs font-bold">
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-400 shadow-inner"></span>원금 ({((resultTotalPrincipal / resultFV) * 100 || 0).toFixed(1)}%)</div>
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-inner"></span>수익 ({((resultInterest / resultFV) * 100 || 0).toFixed(1)}%)</div>
                                </div>
                            </div>

                            {/* 라인/영역 차트 (자산 성장) - 2.5D 효과 */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 flex flex-col">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-6">자산 성장 추이 (Snowball)</h3>
                                <div className="flex-1 relative w-full h-48 mt-auto flex items-end">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 100`}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                            </linearGradient>
                                            <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        {/* 총 자산 영역 */}
                                        <polyline 
                                            points={`0,100 ${schedule.map((d, i) => `${(i / (schedule.length - 1 || 1)) * 100},${100 - (d.total / maxVal) * 100}`).join(" ")} 100,100`} 
                                            fill="url(#areaGradient)" 
                                        />
                                        {/* 총 자산 선 */}
                                        <polyline 
                                            points={schedule.map((d, i) => `${(i / (schedule.length - 1 || 1)) * 100},${100 - (d.total / maxVal) * 100}`).join(" ")} 
                                            fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                                            className="drop-shadow-md"
                                        />
                                        {/* 원금 선 */}
                                        <polyline 
                                            points={schedule.map((d, i) => `${(i / (schedule.length - 1 || 1)) * 100},${100 - (d.principal / maxVal) * 100}`).join(" ")} 
                                            fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" 
                                        />
                                    </svg>
                                </div>
                                <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold">
                                    <span>1년차</span>
                                    <span>{schedule.length > 0 ? schedule[schedule.length - 1].year : 0}년차</span>
                                </div>
                            </div>
                        </div>

                        {/* 상세 테이블 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">연도별 상세 내역</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-900/50">
                                            <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 whitespace-nowrap">연도</th>
                                            <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">총 원금</th>
                                            <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-500 text-right">누적 이자</th>
                                            <th className="p-3 border-b border-gray-100 dark:border-gray-700 font-bold text-blue-600 text-right">최종 자산</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.map((row) => (
                                            <tr key={row.year} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                                <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 font-bold">{Math.floor(row.year)}년차</td>
                                                <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-gray-600 dark:text-gray-300">{formatComma(row.principal)}</td>
                                                <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-indigo-500 dark:text-indigo-400">{formatComma(row.interest)}</td>
                                                <td className="p-3 border-b border-gray-50 dark:border-gray-700/50 text-right text-blue-600 dark:text-blue-400 font-bold">{formatComma(row.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
