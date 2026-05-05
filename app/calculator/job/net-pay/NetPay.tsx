'use client';

import React, { useState, useEffect } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import CalculatorTabs from '../../components/CalculatorTabs';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';
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
    const resultRef = useCalculatorScroll(result);

    const jobTabs = [
        { label: "연봉/월급 계산기", href: "/calculator/job/salary" },
        { label: "실수령액 계산기", href: "/calculator/job/net-pay" },
    ];
    
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
            pension, health, longTermCare, employment, incomeTax, localTax, totalDeductions,
            netPay: monthlyGross - totalDeductions
        };
    };

    const findRequiredGross = (goalNet: number) => {
        const rawTaxFree = parseInt(taxFreeAmount || "0", 10);
        let low = goalNet;
        let high = goalNet * 2;
        let bestGross = low;

        // Binary Search for roughly correct gross amount
        for (let i = 0; i < 40; i++) {
            let mid = (low + high) / 2;
            let currentNet = calculateTaxes(mid, rawTaxFree, dependents, children).netPay;
            if (currentNet < goalNet) {
                low = mid;
            } else {
                high = mid;
                bestGross = mid;
            }
        }
        return bestGross;
    };

    const handleCalculate = () => {
        if (!targetNetPay || parseInt(targetNetPay, 10) === 0) {
            setErrors(new Set(["targetNetPay"]));
            setShakeField("targetNetPay");
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("목표 실수령액을 입력해주세요.");
            return;
        }

        const goal = parseInt(targetNetPay, 10);
        const monthlyGross = findRequiredGross(goal);
        const taxes = calculateTaxes(monthlyGross, parseInt(taxFreeAmount || "0", 10), dependents, children);

        let yearlyGross = monthlyGross * 12;
        if (includesSeverance) {
            yearlyGross = monthlyGross * 13;
        }

        setResult({
            goal,
            monthlyGross,
            yearlyGross,
            taxes
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
        
        // 스크롤 상단 이동
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const generateShareText = () => {
        if (!result) return "";
        return `[💰 실수령액 역산 결과]\n\n목표 실수령액 : ${formatNumber(result.goal)}원\n필요한 세전 ${calcType === "YEARLY" ? "연봉" : "월급"} : ${formatNumber(calcType === "YEARLY" ? result.yearlyGross : result.monthlyGross)}원\n\n📌 JIKO 실수령액 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/job/net-pay`;
    };

    const handleCopy = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(generateShareText());
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setTargetNetPay(val);
        setErrors(new Set());
        setErrorMessage("");
    };

    const addAmount = (addValue: number) => {
        const currentAmount = parseInt(targetNetPay || "0", 10);
        setTargetNetPay((currentAmount + addValue).toString());
        setErrors(new Set());
        setErrorMessage("");
    };

    const resetAmount = () => {
        setTargetNetPay("");
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
            <CalculatorTabs tabs={jobTabs} />

            <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-8">

                {/* Criteria Tabs */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl flex gap-1 mb-8">
                    <button
                        onClick={() => { setCalcType('YEARLY'); setResult(null); }}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${calcType === 'YEARLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        연봉 기준
                    </button>
                    <button
                        onClick={() => { setCalcType('MONTHLY'); setResult(null); }}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${calcType === 'MONTHLY' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                        월급 기준
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">목표 실수령액 (월)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={targetNetPay ? formatNumber(parseInt(targetNetPay)) : ''}
                                onChange={handleAmountChange}
                                placeholder="예: 3,000,000"
                                className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('targetNetPay') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'targetNetPay' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₩</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button onClick={resetAmount} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                            {[100000, 500000, 1000000, 5000000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => addAmount(val)}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all active:scale-95"
                                >
                                    +{val >= 1000000 ? `${val / 1000000}백` : `${val / 10000}만`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">비과세액 (월)</label>
                        <input
                            type="text"
                            value={taxFreeAmount ? formatNumber(parseInt(taxFreeAmount)) : ''}
                            onChange={(e) => setTaxFreeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">✨ 식대 비과세 한도 20만원 포함을 권장합니다.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">부양가족수</label>
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

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">퇴직금 (계약 조건)</label>
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                            <button onClick={() => setIncludesSeverance(false)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${!includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>별도</button>
                            <button onClick={() => setIncludesSeverance(true)} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${includesSeverance ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>포함(1/13)</button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <CalculatorButtons 
                        onReset={handleReset} 
                        onCalculate={handleCalculate} 
                    />
                </div>

                {errorMessage && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 animate-pulse">🚨 {errorMessage}</div>}
            </div>

            {result && (
                <div id="result-section" ref={resultRef} className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden animate-fade-slide-up space-y-8">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                    <div className="text-center">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                            <span className="text-blue-500">✨</span> 계산 결과
                        </h2>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">필요한 세전 계약 소득 분석</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[24px] p-8 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10">📄</div>
                        <h3 className="text-blue-100 font-bold mb-2 opacity-90 text-center">필요한 세전 계약 {calcType === "YEARLY" ? "연봉" : "월급"} (추정)</h3>
                        <div className="text-4xl md:text-5xl font-black tracking-tight text-center">
                            {formatNumber(calcType === "YEARLY" ? result.yearlyGross : result.monthlyGross)} <span className="text-blue-200 text-2xl font-bold">원</span>
                        </div>
                        <div className="mt-8 pt-6 border-t border-blue-500/30 flex justify-between items-end gap-4">
                            <div>
                                <p className="text-blue-200 text-xs font-bold mb-1">매달 받게 될 실수령액 (세후)</p>
                                <p className="text-lg font-black">{formatNumber(result.goal)} 원</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-xs font-bold mb-1">공제되는 세금/보험료 합계</p>
                                <p className="text-lg font-black text-red-200">-{formatNumber(result.taxes.totalDeductions)} 원</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h4 className="text-gray-800 dark:text-gray-100 font-black mb-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 text-sm">
                            <span>계산 결과 상세 (근로자 부담분)</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600 dark:text-gray-300 font-bold">
                            <div className="flex justify-between"><span>국민연금 (4.5%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.pension)} 원</span></div>
                            <div className="flex justify-between"><span>건강보험 (3.545%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.health)} 원</span></div>
                            <div className="flex justify-between"><span>장기요양 (12.95%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.longTermCare)} 원</span></div>
                            <div className="flex justify-between"><span>고용보험 (0.9%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.employment)} 원</span></div>
                            <div className="flex justify-between"><span>소득세 (근로소득)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.incomeTax)} 원</span></div>
                            <div className="flex justify-between"><span>지방소득세 (10%)</span><span className="font-semibold text-gray-800 dark:text-gray-100">{formatNumber(result.taxes.localTax)} 원</span></div>
                        </div>
                    </div>

                    <CalculatorActions
                        onCopy={handleCopy}
                        shareTitle=""
                        shareDescription={generateShareText()}
                    />
                </div>
            )}
        </div>
    );
}
