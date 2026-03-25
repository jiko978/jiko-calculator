'use client';

import React, { useState, useEffect } from 'react';
import ShareSheet from '../../components/ShareSheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NetPay() {
    const pathname = usePathname();
    const [calcType, setCalcType] = useState<"YEARLY" | "MONTHLY">("YEARLY");
    const [targetNetPay, setTargetNetPay] = useState<string>("");
    const [taxFreeAmount, setTaxFreeAmount] = useState<string>("200000");
    const [dependents, setDependents] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [includesSeverance, setIncludesSeverance] = useState<boolean>(false);

    const [result, setResult] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);
    
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

    // --- Core Calculation Logic (Reverse Iteration) ---
    const calculateTaxes = (monthlyGross: number, rawTaxFree: number, dep: number, child: number) => {
        const taxable = Math.max(0, monthlyGross - rawTaxFree);
        const pension = taxable * 0.045;
        const health = taxable * 0.03545;
        const longTermCare = health * 0.1295;
        const employment = taxable * 0.009;

        const deductionCount = dep + child;
        const adjustedTaxable = Math.max(0, taxable - (deductionCount * 150000));
        let incomeTax = 0;
        if (adjustedTaxable > 1060000) {
            if (adjustedTaxable <= 3000000) incomeTax = adjustedTaxable * 0.015;
            else if (adjustedTaxable <= 5000000) incomeTax = adjustedTaxable * 0.035;
            else if (adjustedTaxable <= 10000000) incomeTax = adjustedTaxable * 0.07;
            else incomeTax = adjustedTaxable * 0.12;
        }
        const localTax = incomeTax * 0.1;

        const totalDeductions = pension + health + longTermCare + employment + incomeTax + localTax;
        return {
            totalDeductions,
            pension, health, longTermCare, employment, incomeTax, localTax,
            netPay: monthlyGross - totalDeductions
        };
    };

    const handleCalculate = () => {
        if (!targetNetPay || parseInt(targetNetPay, 10) === 0) {
            setErrors(new Set(["targetNetPay"]));
            setShakeField("targetNetPay");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage(`${calcType === "YEARLY" ? "연봉" : "월급"}(실수령액)을 입력해주세요.`);
            return;
        }

        const inputAmount = parseInt(targetNetPay, 10);
        // 연봉 기준일 경우 월 실수령액 목표치를 1/12로 설정
        const goalMonthlyNet = calcType === "YEARLY" ? inputAmount / 12 : inputAmount;
        const rawTaxFree = parseInt(taxFreeAmount || "0", 10);

        // Binary search iteration to find Gross
        let low = goalMonthlyNet;
        let high = goalMonthlyNet * 2.5; 
        let bestMonthlyGross = goalMonthlyNet;
        
        for (let i = 0; i < 60; i++) {
            let mid = (low + high) / 2;
            let taxes = calculateTaxes(mid, rawTaxFree, dependents, children);
            
            if (taxes.netPay < goalMonthlyNet) {
                low = mid;
            } else {
                high = mid;
                bestMonthlyGross = mid;
            }
            if (Math.abs(taxes.netPay - goalMonthlyNet) < 0.1) break;
        }

        const finalTaxes = calculateTaxes(bestMonthlyGross, rawTaxFree, dependents, children);
        const yearlyGross = includesSeverance ? bestMonthlyGross * 13 : bestMonthlyGross * 12;

        setResult({
            monthlyGross: bestMonthlyGross,
            yearlyGross,
            taxes: finalTaxes,
            goal: goalMonthlyNet
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setTargetNetPay("");
        setTaxFreeAmount("200000");
        setDependents(1);
        setChildren(0);
        setIncludesSeverance(false);
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        
        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => btn.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500);
        }
    };

    const addAmount = (addValue: number) => {
        const currentAmount = parseInt(targetNetPay || "0", 10);
        setTargetNetPay((currentAmount + addValue).toString());
        setErrors(new Set());
        setErrorMessage("");
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                        💰 실수령액 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Switch Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <Link href="/calculator/life/salary" className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors text-center ${pathname === '/calculator/life/salary' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                            연봉/월급 계산기
                        </Link>
                        <Link href="/calculator/life/net-pay" className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors text-center ${pathname === '/calculator/life/net-pay' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                            실수령액 계산기
                        </Link>
                    </div>

                    {/* Criteria Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <button onClick={() => setCalcType('YEARLY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'YEARLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>연봉 기준</button>
                        <button onClick={() => setCalcType('MONTHLY')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'MONTHLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>월급 기준</button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">희망 {calcType === "YEARLY" ? "연봉" : "월급"} (실수령액/원)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={targetNetPay ? formatNumber(parseInt(targetNetPay)) : ''}
                                    onChange={(e) => setTargetNetPay(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="예: 50,000,000"
                                    className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('targetNetPay') ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'targetNetPay' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₩</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {[1000000, 3000000, 5000000, 10000000, 30000000, 50000000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => addAmount(val)}
                                        className="px-4 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all active:scale-95"
                                    >
                                        +{val >= 100000000 ? `${val / 100000000}억원` : val >= 10000000 ? `${val / 10000000}천만원` : `${val / 10000}만원`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {calcType === 'YEARLY' && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">퇴직금</label>
                                <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                                    <button onClick={() => setIncludesSeverance(false)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${!includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500'}`}>별도</button>
                                    <button onClick={() => setIncludesSeverance(true)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500'}`}>포함(1/13)</button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">비과세액 (원)</label>
                            <input
                                type="text"
                                value={taxFreeAmount ? formatNumber(parseInt(taxFreeAmount)) : ''}
                                onChange={(e) => setTaxFreeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                className="w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 dark:text-gray-100"
                            />
                            <p className="text-xs text-gray-500 mt-2">※ 2024년부터 식대 비과세 한도가 20만원으로 상향되었습니다.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">부양가족수 (본인포함)</label>
                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <button onClick={() => setDependents(Math.max(1, dependents - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded font-bold hover:bg-gray-100 transition-colors">-</button>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{dependents} 명</span>
                                    <button onClick={() => setDependents(dependents + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded font-bold hover:bg-gray-100 transition-colors">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">20세 이하 자녀수</label>
                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded font-bold hover:bg-gray-100 transition-colors">-</button>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{children} 명</span>
                                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded font-bold hover:bg-gray-100 transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button id="resetBtn" onClick={handleReset} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 transition-colors">초기화</button>
                        <button onClick={handleCalculate} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/20">계산하기</button>
                    </div>

                    {errorMessage && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 animate-pulse">🚨 {errorMessage}</div>}
                </div>
            </div>

            {result && (
                <div className="mt-8 space-y-6 animate-fade-in-up">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10">📄</div>
                        <h3 className="text-blue-100 font-medium mb-2 opacity-90">필요한 세전 계약 {calcType === "YEARLY" ? "연봉" : "월급"} (추정)</h3>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {formatNumber(calcType === "YEARLY" ? result.yearlyGross : result.monthlyGross)} <span className="text-blue-200 text-2xl font-semibold">원</span>
                        </div>
                        <div className="mt-8 pt-6 border-t border-blue-500/30 flex justify-between items-end">
                            <div>
                                <p className="text-blue-200 text-xs mb-1">매달 받게 될 실수령액 (세후)</p>
                                <p className="text-xl font-bold">{formatNumber(result.goal)} 원</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-xs mb-1">공제되는 세금/보험료 합계</p>
                                <p className="text-xl font-bold text-red-200">-{formatNumber(result.taxes.totalDeductions)} 원</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                            <span>계산 결과 상세 (근로자 부담분)</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between"><span>국민연금 (4.5%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.pension)} 원</span></div>
                            <div className="flex justify-between"><span>건강보험 (3.545%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.health)} 원</span></div>
                            <div className="flex justify-between"><span>장기요양 (12.95%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.longTermCare)} 원</span></div>
                            <div className="flex justify-between"><span>고용보험 (0.9%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.employment)} 원</span></div>
                            <div className="flex justify-between"><span>소득세 (근로소득)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.incomeTax)} 원</span></div>
                            <div className="flex justify-between"><span>지방소득세 (10%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.localTax)} 원</span></div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => {
                             const text = `💰 [실수령액 ${formatNumber(result.goal)}원 맞춤형 결과]\n\n계약 연봉 추정치: ${formatNumber(result.yearlyGross)}원\n월 기본급(세전): ${formatNumber(result.monthlyGross)}원\n\nJIKO 계산기에서 확인: https://jiko.kr/calculator/life/net-pay`;
                             navigator.clipboard.writeText(text);
                             alert("복사되었습니다.");
                        }} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 transition-colors">결과 복사</button>
                        <button onClick={() => setIsSharing(true)} className="flex-1 py-4 bg-[#FEE500] text-black/80 font-bold rounded-xl hover:bg-[#FDD800] transition-colors">카카오톡 공유</button>
                    </div>

                    {isSharing && (
                        <ShareSheet
                            onClose={() => setIsSharing(false)}
                            title="💰 실수령액 맞춤 연봉 계산 결과"
                            description={`월 ${formatNumber(result.goal)}원을 받으려면, 연간 ${formatNumber(result.yearlyGross)}원의 계약이 필요합니다!`}
                            url={typeof window !== "undefined" ? window.location.href : ""}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
