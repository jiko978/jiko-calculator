'use client';

import React, { useState, useEffect } from 'react';
import { useCalculatorScroll } from '@/app/calculator/hooks/useCalculatorScroll';
import CalculatorActions from '@/app/calculator/components/CalculatorActions';

interface LeaveHistory {
    type: string;
    date: string;
    days: number;
}

interface CalculationResult {
    totalHistory: LeaveHistory[];
    totalGenerated: number;
    usedLeave: number;
    remainingLeave: number;
    serviceYears: number;
    serviceMonths: number;
    serviceDays: number;
    isEligible: boolean;
    estimatedAllowance: number;
    dailyWage: number;
}

const formatDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getServicePeriod = (start: Date, end: Date) => {
    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    let d = end.getDate() - start.getDate();
    if (d < 0) {
        m--;
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        d += prevMonth.getDate();
    }
    if (m < 0) {
        y--;
        m += 12;
    }
    return { y, m, d };
};

export default function Annual() {
    // Inputs
    const [baseOption, setBaseOption] = useState<'HIRE_DATE' | 'FISCAL_YEAR'>('HIRE_DATE');
    const [hireDate, setHireDate] = useState<string>('');
    const [targetDate, setTargetDate] = useState<string>(formatDateStr(new Date()));
    const [usedLeave, setUsedLeave] = useState<string>('');
    const [monthlyWage, setMonthlyWage] = useState<string>('');
    const [weeklyHours, setWeeklyHours] = useState<string>('40');

    // System States
    const [result, setResult] = useState<CalculationResult | null>(null);
    const resultRef = useCalculatorScroll(result);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Formatter
    const formatComma = (val: string | number) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value.replace(/[^0-9]/g, ""));
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setBaseOption('HIRE_DATE');
        setHireDate('');
        setTargetDate(formatDateStr(new Date()));
        setUsedLeave('');
        setMonthlyWage('');
        setWeeklyHours('40');
        
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");

        // 스크롤 상단 이동
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const handleCalculate = () => {
        const fieldErrors = new Set<string>();
        if (!hireDate) fieldErrors.add("hireDate");
        if (!targetDate) fieldErrors.add("targetDate");
        
        if (fieldErrors.size > 0) {
            setErrors(fieldErrors);
            const firstError = Array.from(fieldErrors)[0];
            setShakeField(firstError);
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("필수 날짜 항목(입사일 등)을 입력해주세요.");
            return;
        }

        const hDate = new Date(hireDate);
        const tDate = new Date(targetDate);
        hDate.setHours(0,0,0,0);
        tDate.setHours(0,0,0,0);

        if (tDate.getTime() < hDate.getTime()) {
            setErrors(new Set(["targetDate"]));
            setShakeField("targetDate");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("기준일은 입사일 이후여야 합니다.");
            return;
        }

        setErrors(new Set());
        setErrorMessage("");

        const history: LeaveHistory[] = [];
        const { y: sY, m: sM, d: sD } = getServicePeriod(hDate, tDate);
        const totalWorkedDays = Math.floor((tDate.getTime() - hDate.getTime()) / (1000*60*60*24));

        if (totalWorkedDays > 0) {
            // 1. 월차 발생 (1년 미만) - 공통
            for (let m = 1; m <= 11; m++) {
                const mDate = new Date(hDate);
                mDate.setMonth(mDate.getMonth() + m);
                if (mDate.getTime() <= tDate.getTime()) {
                    history.push({ type: '1년 미만 월차', date: formatDateStr(mDate), days: 1 });
                }
            }

            if (baseOption === 'HIRE_DATE') {
                // 입사일 기준 알고리즘
                let yearCount = 1;
                while (true) {
                    const anniv = new Date(hDate);
                    anniv.setFullYear(anniv.getFullYear() + yearCount);
                    if (anniv.getTime() > tDate.getTime()) break;

                    let granted = 15;
                    if (yearCount >= 3) {
                        granted = Math.min(25, 15 + Math.floor((yearCount - 1) / 2));
                    }
                    history.push({ type: `${yearCount + 1}년차 연차`, date: formatDateStr(anniv), days: granted });
                    yearCount++;
                }
            } else {
                // 회계연도 기준 알고리즘 (1.1)
                const hireYear = hDate.getFullYear();
                let yearCount = 1;
                while (true) {
                    const jan1 = new Date(hireYear + yearCount, 0, 1);
                    if (jan1.getTime() > tDate.getTime()) break;

                    if (yearCount === 1) {
                        const dec31 = new Date(hireYear, 11, 31);
                        const daysInYear = (hireYear % 4 === 0 && (hireYear % 100 !== 0 || hireYear % 400 === 0)) ? 366 : 365;
                        const workedDaysFirstYear = Math.floor((dec31.getTime() - hDate.getTime()) / (1000*60*60*24)) + 1;
                        const proRated = Number((15 * (workedDaysFirstYear / daysInYear)).toFixed(1));
                        history.push({ type: '회계기준 비례연차 (1년차)', date: formatDateStr(jan1), days: proRated });
                    } else {
                        // yearCount >= 2 means 2nd Jan 1st
                        let granted = 15;
                        if (yearCount >= 3) {
                            granted = Math.min(25, 15 + Math.floor((yearCount - 1) / 2));
                        }
                        history.push({ type: `회계기준 ${yearCount}년차 연차`, date: formatDateStr(jan1), days: granted });
                    }
                    yearCount++;
                }
            }
        }

        const totalGenerated = history.reduce((acc, curr) => acc + curr.days, 0);
        const used = usedLeave ? parseInt(usedLeave) : 0;
        const remaining = Math.max(0, totalGenerated - used); // 음수 방지

        // 수당 계산
        let allowance = 0;
        let dailyWageAmount = 0;
        if (monthlyWage && remaining > 0) {
            const mw = parseInt(monthlyWage);
            const wHours = weeklyHours ? parseFloat(weeklyHours) : 40;
            const dailyHours = wHours / 5;
            const monthlyHours = Math.round((wHours + dailyHours) * (365 / 7 / 12)); // 209 for 40hrs
            dailyWageAmount = Math.floor(mw / monthlyHours * dailyHours);
            allowance = dailyWageAmount * remaining;
        }

        setResult({
            totalHistory: history.reverse(), // 최신순
            totalGenerated: Number(totalGenerated.toFixed(1)),
            usedLeave: used,
            remainingLeave: Number(remaining.toFixed(1)),
            serviceYears: sY,
            serviceMonths: sM,
            serviceDays: sD,
            isEligible: totalWorkedDays >= 28, // 1개월
            estimatedAllowance: allowance,
            dailyWage: dailyWageAmount
        });
    };

    const copyResultToClipboard = async () => {
        if (!result) return;
        const text = `[🏖️ 연차 & 연차수당 계산 결과]\n\n총 근속 : ${result.serviceYears}년 ${result.serviceMonths}개월 ${result.serviceDays}일\n발생 연차 누계 : ${result.totalGenerated}일\n소진 연차 : ${result.usedLeave}일\n잔여 연차 : ${result.remainingLeave}일\n${result.estimatedAllowance > 0 ? `\n💰 예상 미사용 연차수당(세전) : ${formatComma(result.estimatedAllowance)}원` : ''}`;
        await navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col items-center gap-4 mb-8">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                    🏖️ 연차 계산기
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[32px] shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    {/* 운영 방식 선택 */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">내 회사 연차 운영 기준</label>
                            <p className="mt-2 pl-2 text-xs text-blue-500 font-medium">✨ 관리가 편한 회계기준 채택 기업이 많아요</p>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
                            <button onClick={() => setBaseOption('HIRE_DATE')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${baseOption === 'HIRE_DATE' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>입사일 등 개별 기준</button>
                            <button onClick={() => setBaseOption('FISCAL_YEAR')} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${baseOption === 'FISCAL_YEAR' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>회계기준 (일괄 1.1)</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 입사일 */}
                        <div>
                            <label htmlFor="hireDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">입사일</label>
                            <input
                                id="hireDate"
                                type="date"
                                value={hireDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    setHireDate(e.target.value);
                                    setErrors(new Set());
                                    setErrorMessage("");
                                }}
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border ${errors.has('hireDate') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'hireDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                        {/* 기준일 */}
                        <div>
                            <label htmlFor="targetDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">계산 기준일</label>
                            <input
                                id="targetDate"
                                type="date"
                                value={targetDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                    setTargetDate(e.target.value);
                                    setErrors(new Set());
                                    setErrorMessage("");
                                }}
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border ${errors.has('targetDate') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'targetDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                    </div>

                    {/* 기사용 연차 */}
                    <div>
                        <label htmlFor="usedLeave" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">사용한 연차 (일)</label>
                        <div className="relative">
                            <input
                                id="usedLeave"
                                type="text"
                                inputMode="decimal"
                                placeholder="예: 3"
                                value={usedLeave}
                                onChange={(e) => {
                                    setUsedLeave(e.target.value.replace(/[^0-9.]/g, ""));
                                }}
                                className="w-full p-4 pr-12 text-right bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">일</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>

                    {/* 수당계산 옵션 */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">미사용 연차수당 시뮬레이션 (선택)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="monthlyWage" className="block text-xs text-gray-400 font-bold mb-1">월 통상임금</label>
                                <div className="relative">
                                    <input
                                        id="monthlyWage"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="기본급+고정수당"
                                        value={monthlyWage ? formatComma(monthlyWage) : ''}
                                        onChange={(e) => handleNumberInput(e, setMonthlyWage)}
                                        className="w-full p-3 pr-10 text-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-800 dark:text-gray-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">원</span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="weeklyHours" className="block text-xs text-gray-400 font-bold mb-1">1주 소정근로시간</label>
                                <div className="relative">
                                    <input
                                        id="weeklyHours"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="주 평균 근로시간"
                                        value={weeklyHours}
                                        onChange={(e) => handleNumberInput(e, setWeeklyHours)}
                                        className="w-full p-3 pr-10 text-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-800 dark:text-gray-100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">시간</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                        <button id="resetBtn" onClick={handleReset} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95">초기화</button>
                        <button onClick={handleCalculate} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20">계산하기</button>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse mt-4">
                            🚨 {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {result && (
                <div id="result-section" ref={resultRef} className="animate-fade-in-up mt-8 space-y-6">
                    {!result.isEligible ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 p-6 md:p-8 rounded-[32px] text-center">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm mb-4">😢</div>
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">아직 연차 발생 기준에 미치지 못했어요</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">최소 1개월 이상 개근해야 첫 연차(월차)가 발생합니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                                <div className="absolute -right-8 -top-8 text-9xl opacity-10 blur-xl">🏖️</div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <p className="text-blue-100 font-medium mb-1 drop-shadow-sm">총 {result.serviceYears}년 {result.serviceMonths}개월 {result.serviceDays}일 근속</p>
                                        <h3 className="text-3xl font-black tracking-tight">{result.remainingLeave} <span className="text-xl font-medium">일 남았어요!</span></h3>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <div className="text-blue-100 text-sm mb-1">사용 현황</div>
                                        <div className="text-xl font-bold">생성 {result.totalGenerated}일 <span className="text-blue-200 mx-2">|</span> 사용 {result.usedLeave}일</div>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="relative z-10 mt-6 pt-6 border-t border-blue-500/30">
                                    <div className="flex justify-between text-xs font-bold text-blue-100 mb-2">
                                        <span>소진율</span>
                                        <span>{result.totalGenerated > 0 ? Math.round((result.usedLeave / result.totalGenerated) * 100) : 0}%</span>
                                    </div>
                                    <div className="h-3 bg-blue-900/40 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            style={{ width: `${result.totalGenerated > 0 ? Math.min(100, (result.usedLeave / result.totalGenerated) * 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Allowance Card (Optional) */}
                            {monthlyWage && result.remainingLeave > 0 && result.estimatedAllowance > 0 && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">💰</span>
                                        <h3 className="text-gray-800 dark:text-gray-100 font-bold">예상 미사용 연차수당 (세전)</h3>
                                    </div>
                                    <div className="text-right mt-4">
                                        <p className="text-sm font-medium text-gray-500 mb-1">1일 통상임금 기준: 약 {formatComma(result.dailyWage)}원</p>
                                        <div className="text-3xl font-black text-orange-500 dark:text-orange-400">
                                            {formatComma(result.estimatedAllowance)}<span className="text-xl font-bold ml-1 text-gray-500 dark:text-gray-400">원</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* History Timeline */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-gray-800 dark:text-gray-100 font-bold mb-6 flex items-center justify-between">
                                    <span>📅 최근 연차 발생 내역</span>
                                    <span className="text-xs text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">히스토리</span>
                                </h3>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {result.totalHistory.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <div>
                                                <div className="text-[10px] font-bold text-gray-400 mb-1">{h.date}</div>
                                                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{h.type}</div>
                                            </div>
                                            <div className="font-black text-blue-600 dark:text-blue-400">
                                                +{h.days}개
                                            </div>
                                        </div>
                                    ))}
                                    {result.totalHistory.length === 0 && (
                                        <div className="text-center text-gray-400 text-sm py-8">기록이 없습니다.</div>
                                    )}
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={copyResultToClipboard}
                                shareTitle="[🏖️ 연차 & 연차수당 계산 결과]"
                                shareDescription={`총 연차 : ${result.totalGenerated}일\n소진 연차 : ${result.usedLeave}일, 잔여 연차 : ${result.remainingLeave}일`}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
