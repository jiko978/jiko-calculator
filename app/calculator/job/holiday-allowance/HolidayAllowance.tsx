"use client";

import { useState } from "react";
import CalculatorActions from "../../components/CalculatorActions";
import CalculatorButtons from "../../components/CalculatorButtons";
import { useCalculatorScroll } from "../../hooks/useCalculatorScroll";

interface CalculationResult {
    isEligible: boolean;
    holidayHours: number;
    holidayAllowance: number;
    regularPay: number;
    totalWeeklyPay: number;
    monthlyHolidayAllowance: number;
    monthlyRegularPay: number;
    totalMonthlyPay: number;
}

export default function HolidayAllowance() {
    const [hourlyWage, setHourlyWage] = useState<string>("10320");
    const [workHours, setWorkHours] = useState<string>("");
    
    const [result, setResult] = useState<CalculationResult | null>(null);
    const resultRef = useCalculatorScroll(result);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Format utility
    const formatNumber = (num: number) => Math.round(num).toLocaleString();

    // 입력 필터 (숫자만)
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        setter(rawValue);
    };

    const handleQuickSet = (hours: number) => {
        setHourlyWage("10320");
        setWorkHours(hours.toString());
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleCalculate = () => {
        const wage = parseInt(hourlyWage, 10);
        const hours = parseFloat(workHours);

        const fieldErrors = new Set<string>();
        if (!wage || wage <= 0) fieldErrors.add("wage");
        if (!hours || hours <= 0) fieldErrors.add("hours");

        if (fieldErrors.size > 0) {
            setErrors(fieldErrors);
            const firstError = Array.from(fieldErrors)[0];
            setShakeField(firstError);
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage(firstError === "wage" ? "시급을 입력해주세요." : "1주일간 총 근로시간을 입력해주세요.");
            return;
        }

        setErrors(new Set());
        setErrorMessage("");

        // Logic
        let holidayHours = 0;
        let holidayAllowance = 0;
        let isEligible = false;

        if (hours >= 15) {
            isEligible = true;
            // 주휴 시간: 40시간 미만일때 비례, 40시간 이상은 최대 8시간
            const cappedHours = hours > 40 ? 40 : hours;
            holidayHours = (cappedHours / 40) * 8;
            holidayAllowance = holidayHours * wage;
        }

        const regularPay = hours * wage;
        const totalWeeklyPay = regularPay + holidayAllowance;
        
        const WEEKS_PER_MONTH = 4.345;
        const monthlyHolidayAllowance = holidayAllowance * WEEKS_PER_MONTH;
        const monthlyRegularPay = regularPay * WEEKS_PER_MONTH;
        const totalMonthlyPay = totalWeeklyPay * WEEKS_PER_MONTH;

        setResult({
            isEligible,
            holidayHours,
            holidayAllowance,
            regularPay,
            totalWeeklyPay,
            monthlyHolidayAllowance,
            monthlyRegularPay,
            totalMonthlyPay
        });

        // 결과 영역으로 부드럽게 스크롤
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleReset = () => {
        setHourlyWage("10320");
        setWorkHours("");
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        
        // 스크롤 상단 이동
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const handleCopy = async () => {
        if (!result) return;
        
        let text = `[🏖️ 주휴수당 계산 결과]\n\n`;
        text += `책정 시급 : ${formatNumber(parseInt(hourlyWage))}원\n`;
        text += `1주 근무 : ${workHours}시간\n\n`;
        
        if (!result.isEligible) {
            text += `🚨 주 15시간 미만으로 주휴수당 발생 대상이 아닙니다.\n`;
            text += `👉 예상 주급(총액) : ${formatNumber(result.totalWeeklyPay)}원`;
        } else {
            text += `✅ 주휴수당 대상자입니다! (인정 주휴시간 : ${result.holidayHours.toFixed(1)}시간)\n\n`;
            text += `[주급 기준]\n`;
            text += `• 주간 근로수당 : ${formatNumber(result.regularPay)}원\n`;
            text += `• 주휴수당 : ${formatNumber(result.holidayAllowance)}원\n`;
            text += `▶ 주급(총액) : ${formatNumber(result.totalWeeklyPay)}원\n\n`;
            
            text += `[월급 기준]\n`;
            text += `• 월간 근로수당 : ${formatNumber(result.monthlyRegularPay)}원\n`;
            text += `• 월간 주휴수당 : ${formatNumber(result.monthlyHolidayAllowance)}원\n`;
            text += `▶ 월급(총액) : ${formatNumber(result.totalMonthlyPay)}원`;
        }

        await navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                        🏖️ 주휴수당 계산기
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="space-y-6 relative z-10 w-full">
                    
                    {/* 시급 입력 */}
                    <div>
                        <label htmlFor="hourly-wage" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">시급 (원)</label>
                        <div className="relative group">
                            <input
                                id="hourly-wage"
                                type="text"
                                inputMode="numeric"
                                value={hourlyWage ? parseInt(hourlyWage).toLocaleString() : ""}
                                onChange={(e) => {
                                    handleNumberInput(e, setHourlyWage);
                                    setErrors(new Set());
                                    setErrorMessage("");
                                }}
                                placeholder="적용 받을 시급 입력"
                                className={`w-full p-4 pr-12 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has("wage") ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'wage' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">원</span>
                        </div>
                        <p className="mt-2 pl-2 text-xs text-blue-500 font-medium font-bold italic">✨ 2026년 최저시급 : 10,320원</p>
                    </div>

                    {/* 주간 근로시간 입력 */}
                    <div>
                        <label htmlFor="weekly-hours" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">1주일간 총 근로시간 (시간)</label>
                        <div className="relative group">
                            <input
                                id="weekly-hours"
                                type="text"
                                inputMode="decimal"
                                value={workHours}
                                onChange={(e) => {
                                    setWorkHours(e.target.value.replace(/[^0-9.]/g, ''));
                                    setErrors(new Set());
                                    setErrorMessage("");
                                }}
                                placeholder="예: 20"
                                className={`w-full p-4 pr-16 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has("hours") ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'hours' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">시간</span>
                        </div>
                        <p className="mt-2 pl-2 text-xs text-blue-500 font-medium font-bold italic">✨ 주 15시간 이상 근무 시에만 주휴수당 발생함</p>
                    </div>

                    {/* 빠른 시간 설정 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">빠른 설정</span>
                            <div className="h-px bg-gray-100 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {[15, 20, 25, 30, 35, 40].map((h) => (
                                <button
                                    key={h}
                                    onClick={() => handleQuickSet(h)}
                                    className="py-2.5 rounded-xl text-xs font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                >
                                    주 {h}시간
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <CalculatorButtons 
                    onReset={handleReset} 
                    onCalculate={handleCalculate} 
                />
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                    🚨 {errorMessage}
                </div>
            )}

            {/* 계산 결과 */}
            {result && (
                <div ref={resultRef} className="animate-fade-in-up mt-8">
                    {!result.isEligible ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 p-6 md:p-8 rounded-[32px] text-center">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm mb-4">
                                😢
                            </div>
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                                주휴수당 발생 대상이 아닙니다
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                                1주일간 소정근로시간이 <strong>15시간 이상</strong>일 때 주휴수당이 발생합니다.
                            </p>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
                                <p className="text-sm font-bold text-gray-500 mb-1">순수 주간 근로수당</p>
                                <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{formatNumber(result.regularPay)}<span className="text-xl font-bold ml-1">원</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 메인 결과 카드 2개 (주급 / 월급) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 주급 통계 (메인 그라데이션) */}
                                <div className="bg-gradient-to-br from-blue-600 relative to-blue-800 rounded-3xl p-8 shadow-xl text-white overflow-hidden h-full flex flex-col justify-between">
                                    <div className="absolute -right-5 -top-5 text-8xl opacity-10">💵</div>
                                    <div>
                                        <h3 className="text-blue-100 font-medium mb-2 opacity-90">주급 (주휴수당 포함)</h3>
                                        <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                            {formatNumber(result.totalWeeklyPay)} <span className="text-blue-200 text-xl font-semibold">원</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-blue-500/30 space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-200">일반 근로수당 ({workHours}h)</span>
                                            <span className="font-bold">{formatNumber(result.regularPay)} 원</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-200">추가 주휴수당 (+{result.holidayHours.toFixed(1)}h)</span>
                                            <span className="font-bold text-yellow-300">+{formatNumber(result.holidayAllowance)} 원</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 월급 통계 (서브 그라데이션) */}
                                <div className="bg-gradient-to-br from-emerald-500 relative to-teal-700 rounded-3xl p-8 shadow-xl text-white overflow-hidden h-full flex flex-col justify-between">
                                    <div className="absolute -right-5 -top-5 text-8xl opacity-10">🗓️</div>
                                    <div>
                                        <h3 className="text-emerald-100 font-medium mb-2 opacity-90">월급 (주휴수당 포함)</h3>
                                        <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                            {formatNumber(result.totalMonthlyPay)} <span className="text-emerald-200 text-xl font-semibold">원</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-emerald-500/30 space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-emerald-200">월간 일반 수당</span>
                                            <span className="font-bold">{formatNumber(result.monthlyRegularPay)} 원</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-emerald-200">월간 추가 주휴수당</span>
                                            <span className="font-bold text-yellow-300">+{formatNumber(result.monthlyHolidayAllowance)} 원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Action Buttons (CalculatorActions) */}
                    <CalculatorActions
                        onCopy={handleCopy}
                        shareTitle="[🏖️ 주휴수당 계산 결과]"
                        shareDescription={`시급 : ${formatNumber(parseInt(hourlyWage))}원/${workHours}시간 근무\n주급(총액) : ${formatNumber(result.totalWeeklyPay)}원`}
                    />
                </div>
            )}
        </div>
    );
}
