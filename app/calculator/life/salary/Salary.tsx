'use client';

import React, { useState, useRef, useEffect } from 'react';
import ShareSheet from '../../components/ShareSheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Salary() {
    const pathname = usePathname();
    const [calcType, setCalcType] = useState<"YEARLY" | "MONTHLY">("YEARLY");
    const [amount, setAmount] = useState<string>("");
    const [includesSeverance, setIncludesSeverance] = useState<boolean>(false);
    const [taxFreeAmount, setTaxFreeAmount] = useState<string>("200000");
    const [dependents, setDependents] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);

    const [result, setResult] = useState<any>(null);
    const [isSharing, setIsSharing] = useState(false);

    // UI Validation states
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Number formatting helper
    const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

    // Handle Amount Input with Commas
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
        if (value) {
            const newErrors = new Set(errors);
            newErrors.delete('amount');
            setErrors(newErrors);
            setErrorMessage("");
        }
    };

    const handleTaxFreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setTaxFreeAmount(value);
    };

    const addAmount = (addValue: number) => {
        const currentAmount = parseInt(amount || "0", 10);
        setAmount((currentAmount + addValue).toString());
        const newErrors = new Set(errors);
        newErrors.delete('amount');
        setErrors(newErrors);
        setErrorMessage("");
    };

    const handleCalculate = () => {
        const newErrors = new Set<string>();

        if (!amount || parseInt(amount, 10) === 0) {
            newErrors.add("amount");
            setShakeField("amount");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("연봉/월급을 입력해주세요.");
            setErrors(newErrors);
            return;
        }

        const rawAmount = parseInt(amount, 10);
        const rawTaxFree = parseInt(taxFreeAmount || "0", 10);

        // Calculate Monthly Gross
        let monthlyGross = rawAmount;
        if (calcType === "YEARLY") {
            monthlyGross = includesSeverance ? rawAmount / 13 : rawAmount / 12;
        }

        if (monthlyGross <= rawTaxFree) {
            newErrors.add("taxFreeAmount");
            setShakeField("taxFreeAmount");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("비과세액이 소득액보다 클 수 없습니다.");
            setErrors(newErrors);
            return;
        }

        const taxable = monthlyGross - rawTaxFree;

        // 2025 Rates
        const pension = taxable * 0.045; // 최대 금액 상한선 처리는 편의상 생략
        const health = taxable * 0.03545;
        const longTermCare = health * 0.1295;
        const employment = taxable * 0.009;

        // Income Tax (Simplified brackets for demonstration)
        let incomeTax = 0;
        const deductionCount = dependents + children;
        const adjustedTaxable = taxable - (deductionCount * 150000); // Basic rough deduction

        if (adjustedTaxable > 1060000) {
            if (adjustedTaxable <= 3000000) {
                incomeTax = adjustedTaxable * 0.015;
            } else if (adjustedTaxable <= 5000000) {
                incomeTax = adjustedTaxable * 0.035;
            } else if (adjustedTaxable <= 10000000) {
                incomeTax = adjustedTaxable * 0.07;
            } else {
                incomeTax = adjustedTaxable * 0.12;
            }
        }

        const localTax = incomeTax * 0.1;

        const totalDeductions = pension + health + longTermCare + employment + incomeTax + localTax;

        // Safety net to prevent negative net pay
        const safeDeductions = Math.min(totalDeductions, monthlyGross - rawTaxFree);
        const netPay = monthlyGross - safeDeductions;

        // Company Burden
        const compPension = taxable * 0.045;
        const compHealth = taxable * 0.03545;
        const compLongTermCare = compHealth * 0.1295;
        const compEmployment = taxable * 0.0115; // Usually slightly higher for company
        const compTotal = compPension + compHealth + compLongTermCare + compEmployment;

        setResult({
            monthlyGross,
            taxable,
            deductions: {
                pension, health, longTermCare, employment, incomeTax, localTax, total: safeDeductions
            },
            netPay,
            company: {
                pension: compPension, health: compHealth, longTermCare: compLongTermCare, employment: compEmployment, total: compTotal
            }
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setCalcType("YEARLY");
        setAmount("");
        setIncludesSeverance(false);
        setTaxFreeAmount("200000");
        setDependents(1);
        setChildren(0);
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");

        // Reset Shake effect
        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => {
                btn.classList.remove("animate-[shake_0.5s_ease-in-out]");
            }, 500);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        const text = `💰 연봉/월급 실수령액 계산 결과\n\n기준: ${calcType === "YEARLY" ? "연봉" : "월급"} ${formatNumber(parseInt(amount))}원\n예상 실수령액(월): ${formatNumber(result.netPay)}원\n\n- 공제액 합계: ${formatNumber(result.deductions.total)}원\n(국민연금: ${formatNumber(result.deductions.pension)}원 등)\n\n📌 JIKO 계산기에서 확인하기:\nhttps://jiko.kr/calculator/life/salary`;
        navigator.clipboard.writeText(text);
        alert("결과가 클립보드에 복사되었습니다.");
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                        💸 연봉/월급 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* Header Tabs - Switch Between Different Calc Types */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <button
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${pathname === '/calculator/life/salary' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            onClick={() => {}} // Already on this page
                        >
                            연봉/월급 계산기
                        </button>
                        <Link
                            href="/calculator/life/net-pay"
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors text-center ${pathname === '/calculator/life/net-pay' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            실수령액 계산기
                        </Link>
                    </div>

                    {/* Header Tabs - Gross Type (Monthly/Yearly) */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <button
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'YEARLY' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            onClick={() => setCalcType('YEARLY')}
                        >
                            연봉 기준
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcType === 'MONTHLY' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            onClick={() => setCalcType('MONTHLY')}
                        >
                            월급 기준
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {calcType === 'YEARLY' ? '연봉' : '월급'} (원)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount ? formatNumber(parseInt(amount)) : ''}
                                    onChange={handleAmountChange}
                                    placeholder={`${calcType === 'YEARLY' ? '예: 50,000,000' : '예: 3,000,000'}`}
                                    className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('amount') ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'amount' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₩</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {[1000000, 3000000, 5000000, 10000000, 30000000, 50000000, 100000000].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => addAmount(val)}
                                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
                                    <button onClick={() => setIncludesSeverance(false)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${!includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>별도</button>
                                    <button onClick={() => setIncludesSeverance(true)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>포함(1/13)</button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">비과세액 (원)</label>
                            <input
                                type="text"
                                value={taxFreeAmount ? formatNumber(parseInt(taxFreeAmount)) : ''}
                                onChange={handleTaxFreeChange}
                                className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('taxFreeAmount') ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800 dark:text-gray-100 ${shakeField === 'taxFreeAmount' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <p className="text-xs text-gray-500 mt-2">※ 2024년부터 식대 비과세 한도가 20만원으로 상향되었습니다.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">부양가족수 (본인포함)</label>
                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <button onClick={() => setDependents(Math.max(1, dependents - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">-</button>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{dependents} 명</span>
                                    <button onClick={() => setDependents(dependents + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">20세 이하 자녀수</label>
                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">-</button>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">{children} 명</span>
                                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button id="resetBtn" onClick={handleReset} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            초기화
                        </button>
                        <button onClick={handleCalculate} className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                            계산하기
                        </button>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                            🚨 {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            {result && (
                <div id="result-section" className="mt-8 space-y-6 animate-fade-in-up">
                    <div className="bg-gradient-to-br from-blue-600 relative to-blue-800 rounded-3xl p-8 shadow-xl text-white overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10">💸</div>
                        <h3 className="text-blue-100 font-medium mb-2 opacity-90">예상 실수령액 (월)</h3>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {formatNumber(result.netPay)} <span className="text-blue-200 text-2xl font-semibold">원</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-blue-500/30 flex justify-between items-end">
                            <div>
                                <p className="text-blue-200 text-sm mb-1">월 예상 소득액 (공제 전)</p>
                                <p className="text-xl font-bold">{formatNumber(result.monthlyGross)} 원</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-sm mb-1">공제액 합계</p>
                                <p className="text-xl font-bold text-red-200">-{formatNumber(result.deductions.total)} 원</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                                <span>나의 공제액 (근로자 부담분)</span>
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>국민연금 (4.5%)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.pension)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>건강보험 (3.545%)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.health)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>장기요양 (건보료의 12.95%)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.longTermCare)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>고용보험 (0.9%)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.employment)} 원</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>소득세 (근로소득세)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.incomeTax)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>지방소득세 (소득세의 10%)</span>
                                    <span className="font-semibold">{formatNumber(result.deductions.localTax)} 원</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                                <span>회사 부담액 (사업주 공제)</span>
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>국민연금</span>
                                    <span className="font-semibold">{formatNumber(result.company.pension)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>건강보험</span>
                                    <span className="font-semibold">{formatNumber(result.company.health)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>장기요양보험</span>
                                    <span className="font-semibold">{formatNumber(result.company.longTermCare)} 원</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <span>고용보험 (실업급여 등)</span>
                                    <span className="font-semibold">{formatNumber(result.company.employment)} 원</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
                                <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-100">
                                    <span className="text-blue-600 dark:text-blue-400">총 회사 지원 보험료</span>
                                    <span>{formatNumber(result.company.total)} 원</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={handleCopy} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex justify-center items-center gap-2">
                            <span>📋</span> 결과 텍스트 복사
                        </button>
                        <button onClick={() => setIsSharing(true)} className="flex-1 py-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000]/80 font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                            <span>💬</span> 친구에게 공유
                        </button>
                    </div>

                    {isSharing && (
                        <ShareSheet
                            onClose={() => setIsSharing(false)}
                            title="💰 연봉/월급 실수령액 계산 결과"
                            description={`[${calcType === "YEARLY" ? "연봉" : "월급"} ${formatNumber(parseInt(amount))}원]\n제 통장에는 매월 ${formatNumber(result.netPay)}원이 찍힙니다!\n\n(세금 및 공제 합계: -${formatNumber(result.deductions.total)}원)`}
                            url={window.location.href}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
