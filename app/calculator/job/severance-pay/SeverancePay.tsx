'use client';

import React, { useState, useEffect } from 'react';
import CalculatorActions from '@/app/calculator/components/CalculatorActions';
import CalculatorButtons from '@/app/calculator/components/CalculatorButtons';
import { useCalculatorScroll } from '@/app/calculator/hooks/useCalculatorScroll';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SeverancePay() {
    const pathname = usePathname();
    const [calcType, setCalcType] = useState<"YEARLY" | "MONTHLY">("MONTHLY");
    const [joinDate, setJoinDate] = useState<string>("");
    const [quitDate, setQuitDate] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [bonusYearly, setBonusYearly] = useState<string>("0");
    const [holidayPayYearly, setHolidayPayYearly] = useState<string>("0");

    const [result, setResult] = useState<any>(null);
    const resultRef = useCalculatorScroll(result);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

    // --- Core Calculation Logic ---
    const handleCalculate = () => {
        const fieldErrors = new Set<string>();
        if (!joinDate) fieldErrors.add("joinDate");
        if (!quitDate) fieldErrors.add("quitDate");
        if (!amount || parseInt(amount, 10) === 0) fieldErrors.add("amount");

        if (fieldErrors.size > 0) {
            setErrors(fieldErrors);
            const firstError = Array.from(fieldErrors)[0];
            setShakeField(firstError);
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            return;
        }

        const dJoin = new Date(joinDate);
        const dQuit = new Date(quitDate);

        if (dQuit <= dJoin) {
            setErrors(new Set(["quitDate"]));
            setShakeField("quitDate");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("퇴사일은 입사일보다 늦어야 합니다.");
            return;
        }

        // 1. 재직일수 계산
        const diffMs = dQuit.getTime() - dJoin.getTime();
        const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (totalDays < 365) {
            setErrorMessage("재직일수가 1년(365일) 미만인 경우 법정 퇴직금 지급 대상이 아닙니다.");
            setResult(null);
            return;
        }

        // 2. 평균임금 계산
        const rawAmount = parseInt(amount, 10);
        const monthlyBase = calcType === "YEARLY" ? rawAmount / 12 : rawAmount;
        const bonus3mo = parseInt(bonusYearly || "0", 10) / 12 * 3;
        const holiday3mo = parseInt(holidayPayYearly || "0", 10) / 12 * 3;

        const total3moPay = (monthlyBase * 3) + bonus3mo + holiday3mo;
        const avgDailyWage = total3moPay / 91; // 평균 91일 기준 정밀 계산 가능하나 우선 91일 적용

        // 3. 퇴직금 공식 = (1일 평균임금 * 30일) * (총 재직일수 / 365)
        const severancePreTax = (avgDailyWage * 30) * (totalDays / 365);

        // 4. 퇴직소득세 추정 (간이 계산: 약 4.5% 가정)
        const estimatedTax = severancePreTax * 0.045;

        setResult({
            totalDays,
            years: Math.floor(totalDays / 365),
            months: Math.floor((totalDays % 365) / 30),
            days: (totalDays % 365) % 30,
            avgDailyWage,
            preTax: severancePreTax,
            tax: estimatedTax,
            postTax: severancePreTax - estimatedTax
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setJoinDate("");
        setQuitDate("");
        setAmount("");
        setBonusYearly("0");
        setHolidayPayYearly("0");
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        setShakeField(null);

        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => btn.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500);
        }
        
        // 스크롤 상단 이동
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const handleCopy = async () => {
        if (!result) return;
        const text = `[💼 퇴직금 계산 결과]\n\n총 재직일 : ${result.totalDays}일\n세전 퇴직금 : ${formatNumber(result.preTax)}원\n세후 예상 실수령액 : ${formatNumber(result.postTax)}원\n\n📌JIKO 퇴직금 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/job/severance-pay`;
        await navigator.clipboard.writeText(text);
    };

    const addAmount = (val: number) => {
        const current = parseInt(amount || "0", 10);
        setAmount((current + val).toString());
        setErrors(new Set());
    };

    const resetAmount = () => {
        setAmount("");
        setErrors(new Set());
    };

    const handleDateChange = (type: 'JOIN' | 'QUIT', val: string) => {
        // 연도 4자리 초과 입력 방지 (입력 시점에 즉시 차단)
        const yearPart = val.split('-')[0];
        if (yearPart && yearPart.length > 4) return;
        
        if (type === 'JOIN') setJoinDate(val);
        else setQuitDate(val);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                        💼 퇴직금 계산기
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden text-left">
                <div className="p-6 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 입사일 */}
                        <div>
                            <label htmlFor="join-date" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">입사일</label>
                            <input
                                id="join-date"
                                type="date"
                                value={joinDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                     const val = e.target.value;
                                     const yearPart = val.split('-')[0];
                                     if (yearPart && yearPart.length > 4) return;
                                     setJoinDate(val);
                                }}
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border font-semibold ${errors.has('joinDate') ? 'border-red-600 ring-2 ring-red-500/10' : 'border-gray-300 dark:border-gray-600'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-gray-800 dark:text-gray-100 [text-align:right] md:[text-align:left] ${shakeField === 'joinDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                        {/* 퇴사일 */}
                        <div>
                            <label htmlFor="quit-date" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">퇴사일</label>
                            <input
                                id="quit-date"
                                type="date"
                                value={quitDate}
                                max="9999-12-31"
                                onChange={(e) => {
                                     const val = e.target.value;
                                     const yearPart = val.split('-')[0];
                                     if (yearPart && yearPart.length > 4) return;
                                     setQuitDate(val);
                                }}
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border font-semibold ${errors.has('quitDate') ? 'border-red-600 ring-2 ring-red-500/10' : 'border-gray-300 dark:border-gray-600'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-gray-800 dark:text-gray-100 [text-align:right] md:[text-align:left] ${shakeField === 'quitDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Criteria Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <button onClick={() => setCalcType('YEARLY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'YEARLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>연봉 기준</button>
                        <button onClick={() => setCalcType('MONTHLY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'MONTHLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>월급 기준</button>
                    </div>

                    {/* 급여액 입력 */}
                    <div>
                        <label htmlFor="severance-amount" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">평균 {calcType === 'YEARLY' ? '연봉' : '월급'} (원)</label>
                        <div className="relative mb-3">
                            <input
                                id="severance-amount"
                                type="text"
                                value={amount ? formatNumber(parseInt(amount)) : ''}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder={calcType === 'YEARLY' ? "예: 50,000,000" : "예: 3,500,000"}
                                className={`w-full p-5 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('amount') ? 'border-red-600 ring-2 ring-red-500/10' : 'border-gray-300 dark:border-gray-600'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-gray-800 dark:text-gray-100 ${shakeField === 'amount' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold" aria-hidden="true">₩</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button onClick={resetAmount} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                            {[1000000, 3000000, 5000000, 10000000, 30000000, 50000000, 100000000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => addAmount(val)}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all active:scale-95"
                                >
                                    +{val >= 100000000 ? `${val / 100000000}억` : val >= 10000000 ? `${val / 10000000}천` : val >= 1000000 ? `${val / 1000000}백` : `${val / 10000}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
                        {/* 연간 상여금 */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-tight flex items-center gap-1.5">연간 상여금 총액 <span className="text-[10px] text-gray-400 font-normal">(전체 합계)</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={bonusYearly !== "0" ? formatNumber(parseInt(bonusYearly)) : ''}
                                    onChange={(e) => setBonusYearly(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0"
                                    className="w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-gray-800 dark:text-gray-100"
                                />
                                <button onClick={() => setBonusYearly("0")} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black border border-rose-100 hover:bg-rose-100 transition-all">C</button>
                            </div>
                        </div>
                        {/* 미사용 연차수당 */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-tight flex items-center gap-1.5">연간 연차수당 총액 <span className="text-[10px] text-gray-400 font-normal">(지급액 기준)</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={holidayPayYearly !== "0" ? formatNumber(parseInt(holidayPayYearly)) : ''}
                                    onChange={(e) => setHolidayPayYearly(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0"
                                    className="w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-gray-800 dark:text-gray-100"
                                />
                                <button onClick={() => setHolidayPayYearly("0")} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black border border-rose-100 hover:bg-rose-100 transition-all">C</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <CalculatorButtons 
                            onReset={handleReset} 
                            onCalculate={handleCalculate} 
                        />
                    </div>

                    {errorMessage && <div className="bg-red-50 dark:bg-red-900/10 text-red-500 text-sm font-bold p-5 rounded-2xl text-center border border-red-100 dark:border-red-900/20 animate-pulse tracking-tight">🚨 {errorMessage}</div>}
                </div>
            </div>

            {/* 결과 출력 영역 */}
            {result && (
                <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up text-left">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-[120px] opacity-10 rotate-12">💼</div>
                        <h3 className="text-blue-100 text-sm font-bold mb-4 opacity-90 flex items-center gap-2">
                            최종 예상 퇴직금
                            <span className="px-2 py-0.5 bg-white/20 rounded text-[10px]">재직 {result.totalDays}일</span>
                        </h3>
                        <div className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
                            {formatNumber(result.postTax)} <span className="text-blue-200 text-2xl font-bold">원</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/20">
                            <div>
                                <p className="text-blue-200 text-[10px] mb-1 font-bold">세전 퇴직금</p>
                                <p className="text-lg font-black">{formatNumber(result.preTax)} 원</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-[10px] mb-1 font-bold">예상 퇴직소득세</p>
                                <p className="text-lg font-black text-rose-300">-{formatNumber(result.tax)} 원</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-900 dark:text-gray-100 font-black mb-6 flex items-center gap-2 border-b border-gray-50 dark:border-gray-700 pb-4 text-lg">
                            🔍 상세 산출 내역
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">총 재직일수</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{result.years}년 {result.months}개월 {result.days}일 ({result.totalDays}일)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">1일 평균임금</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{formatNumber(result.avgDailyWage)} 원</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">기본 산정 결과</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{formatNumber(result.preTax)} 원</span>
                            </div>
                        </div>

                        <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 capitalize text-left">
                            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                                ※ 본 계산 결과는 입력하신 데이터를 바탕으로 산출된 <strong>추정치</strong>입니다. 실제 수령액은 기업의 퇴직연금 가입 종류(DB/DC형) 및 구체적인 소득 공제 요건에 따라 차이가 발생할 수 있으니 참고용으로 활용하시기 바랍니다.
                            </p>
                        </div>
                    </div>

                    <CalculatorActions
                        onCopy={handleCopy}
                        shareTitle="[💼 퇴직금 계산 결과]"
                        shareDescription={`총 재직일 : ${result.totalDays}일\n세후 예상 실수령액 : ${formatNumber(result.postTax)}원`}
                    />
                </div>
            )}
        </div>
    );
}

