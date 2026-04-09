'use client';

import React, { useState, useEffect } from 'react';
import CalculatorActions from '@/app/calculator/components/CalculatorActions';
import CalculatorButtons from '@/app/calculator/components/CalculatorButtons';
import { useCalculatorScroll } from '@/app/calculator/hooks/useCalculatorScroll';
import { usePathname } from 'next/navigation';

interface CompanyHistory {
    id: number;
    startDate: string;
    endDate: string;
}

export default function UnemploymentBenefit() {
    const pathname = usePathname();
    const [birthDate, setBirthDate] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyHistory[]>([
        { id: Date.now(), startDate: "", endDate: "" }
    ]);
    const [isSameSalary, setIsSameSalary] = useState<boolean>(true);
    const [salaries, setSalaries] = useState<string[]>(["", "", ""]); // [최근, 1개월전, 2개월전]

    const [result, setResult] = useState<any>(null);
    const resultRef = useCalculatorScroll(result);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const formatNumber = (num: number) => num ? Math.round(num).toLocaleString('ko-KR') : "";

    // --- Helper Functions ---
    const addCompany = () => {
        if (companies.length >= 5) {
            setErrorMessage("회사 이력은 최대 5개까지 추가 가능합니다.");
            return;
        }
        setCompanies([...companies, { id: Date.now(), startDate: "", endDate: "" }]);
        setErrorMessage("");
    };

    const removeCompany = (id: number) => {
        if (companies.length > 1) {
            setCompanies(companies.filter(c => c.id !== id));
        }
    };

    const updateCompany = (id: number, field: 'startDate' | 'endDate', val: string) => {
        const yearPart = val.split('-')[0];
        if (yearPart && yearPart.length > 4) return;
        setCompanies(companies.map(c => c.id === id ? { ...c, [field]: val } : c));
        setErrors(new Set());
        setErrorMessage("");
    };

    const calculateAge = (birth: string, quitDate: string) => {
        if (birth.length !== 8) return 0;
        const year = parseInt(birth.substring(0, 4));
        const month = parseInt(birth.substring(4, 6)) - 1;
        const day = parseInt(birth.substring(6, 8));
        const b = new Date(year, month, day);
        const q = new Date(quitDate);
        
        let age = q.getFullYear() - b.getFullYear();
        const m = q.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && q.getDate() < b.getDate())) {
            age--;
        }
        return age;
    };

    const calculateTenureDays = (start: string, end: string) => {
        const s = new Date(start);
        const e = new Date(end);
        return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    };

    const addAmount = (amount: number, idx: number = 0) => {
        if (isSameSalary) {
            const current = salaries[0] === "" ? 0 : parseInt(salaries[0]);
            const next = current + amount;
            setSalaries([next.toString(), next.toString(), next.toString()]);
        } else {
            const current = salaries[idx] === "" ? 0 : parseInt(salaries[idx]);
            const next = current + amount;
            const newSalaries = [...salaries];
            newSalaries[idx] = next.toString();
            setSalaries(newSalaries);
        }
    };

    const resetAmount = (idx: number = 0) => {
        if (isSameSalary) {
            setSalaries(["", "", ""]);
        } else {
            const newSalaries = [...salaries];
            newSalaries[idx] = "";
            setSalaries(newSalaries);
        }
    };

    // --- Calculation Logic ---
    const handleCalculate = () => {
        const fieldErrors = new Set<string>();
        if (!birthDate || birthDate.length !== 8) fieldErrors.add("birthDate");
        if (companies.some(c => !c.startDate || !c.endDate)) fieldErrors.add("companies");
        if (isSameSalary && (!salaries[0] || salaries[0] === "0")) fieldErrors.add("salaries");
        if (!isSameSalary && salaries.some(s => !s || s === "0")) fieldErrors.add("salaries");

        if (fieldErrors.size > 0) {
            setErrors(fieldErrors);
            setShakeField(Array.from(fieldErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            return;
        }

        const sortedCompanies = [...companies].sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        const lastCompany = sortedCompanies[0];
        const age = calculateAge(birthDate, lastCompany.endDate);
        
        let totalTenureDays = 0;
        companies.forEach(c => {
            totalTenureDays += calculateTenureDays(c.startDate, c.endDate);
        });

        const estimatedInsuredDays = Math.floor(totalTenureDays * (6 / 7));
        const isEligible = estimatedInsuredDays >= 180;

        const avgMonthlySalary = isSameSalary 
            ? parseInt(salaries[0], 10) 
            : (parseInt(salaries[0], 10) + parseInt(salaries[1], 10) + parseInt(salaries[2], 10)) / 3;
        
        const dailyWage = avgMonthlySalary / 30;
        let dailyBenefit = dailyWage * 0.6;

        const upperLimit = 66000;
        const lowerLimit = 64192;

        if (dailyBenefit > upperLimit) dailyBenefit = upperLimit;
        if (dailyBenefit < lowerLimit) dailyBenefit = lowerLimit;

        let benefitDays = 120;
        const totalTenureYears = totalTenureDays / 365;

        if (age < 50 && !isDisabled) {
            if (totalTenureYears >= 1 && totalTenureYears < 3) benefitDays = 150;
            else if (totalTenureYears >= 3 && totalTenureYears < 5) benefitDays = 180;
            else if (totalTenureYears >= 5 && totalTenureYears < 10) benefitDays = 210;
            else if (totalTenureYears >= 10) benefitDays = 240;
        } else {
            if (totalTenureYears >= 1 && totalTenureYears < 3) benefitDays = 180;
            else if (totalTenureYears >= 3 && totalTenureYears < 5) benefitDays = 210;
            else if (totalTenureYears >= 5 && totalTenureYears < 10) benefitDays = 240;
            else if (totalTenureYears >= 10) benefitDays = 270;
        }

        setResult({
            isEligible,
            estimatedInsuredDays,
            age,
            dailyBenefit,
            benefitDays,
            totalBenefit: dailyBenefit * benefitDays,
            totalTenureDays,
            totalTenureYears: totalTenureYears.toFixed(1)
        });
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleReset = () => {
        setBirthDate("");
        setIsDisabled(false);
        setCompanies([{ id: Date.now(), startDate: "", endDate: "" }]);
        setSalaries(["", "", ""]);
        setIsSameSalary(true);
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
        const text = `[📋 실업급여 계산 결과]\n\n예상 수급일수 : ${result.benefitDays}일\n1일 수령액 : ${formatNumber(result.dailyBenefit)}원\n총 예상 수급액 : ${formatNumber(result.totalBenefit)}원\n\n📌JIKO 실업급여 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/job/unemployment-benefit`;
        await navigator.clipboard.writeText(text);
    };

    const quickAmounts = [100000, 300000, 500000, 1000000, 3000000, 5000000, 10000000];

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4 mb-8">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    📋 실업급여 계산기
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden text-left">
                <div className="p-6 md:p-10 space-y-8">
                    {/* Input: 생년월일 & 장애여부 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="birth-date" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">생년월일 (8자리)</label>
                            <input
                                id="birth-date"
                                type="text"
                                maxLength={8}
                                placeholder="예) 19900101"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value.replace(/[^0-9]/g, ''))}
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border font-semibold ${errors.has('birthDate') ? 'border-red-600 ring-2 ring-red-500/10' : 'border-gray-300 dark:border-gray-600'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-gray-800 dark:text-gray-100 text-right ${shakeField === 'birthDate' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">장애인 여부</label>
                            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
                                <button
                                    onClick={() => setIsDisabled(false)}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isDisabled ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm outline-none ring-1 ring-blue-500/10' : 'text-gray-400'}`}
                                >
                                    아니오
                                </button>
                                <button
                                    onClick={() => setIsDisabled(true)}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isDisabled ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm outline-none ring-1 ring-blue-500/10' : 'text-gray-400'}`}
                                >
                                    예
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Input: 고용보험 가입 이력 */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">고용보험 가입 이력 (최대 5개)</label>
                            <p className="text-[10px] text-gray-400">✨ 최종 퇴사일 기준 18개월 내 기간 합산</p>
                        </div>
                        {companies.map((company) => (
                            <div key={company.id} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-right">
                                        <label className="text-xs text-gray-400 block mb-1">입사일</label>
                                        <input
                                            type="date"
                                            value={company.startDate}
                                            max="9999-12-31"
                                            onChange={(e) => updateCompany(company.id, 'startDate', e.target.value)}
                                            className={`w-full p-3 bg-white dark:bg-gray-800 border font-semibold ${errors.has('companies') && !company.startDate ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-100 dark:border-gray-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-right ${shakeField === 'companies' && !company.startDate ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <label className="text-xs text-gray-400 block mb-1">퇴사일</label>
                                        <input
                                            type="date"
                                            value={company.endDate}
                                            max="9999-12-31"
                                            onChange={(e) => updateCompany(company.id, 'endDate', e.target.value)}
                                            className={`w-full p-3 bg-white dark:bg-gray-800 border font-semibold ${errors.has('companies') && !company.endDate ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-100 dark:border-gray-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-right ${shakeField === 'companies' && !company.endDate ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                        />
                                    </div>
                                </div>
                                {companies.length > 1 && (
                                    <button onClick={() => removeCompany(company.id)} className="absolute -right-2 -top-2 bg-rose-100 text-rose-500 p-1.5 rounded-full hover:bg-rose-200 transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        {companies.length < 5 && (
                            <button onClick={addCompany} className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">+ 회사 추가 (합산)</button>
                        )}
                    </div>

                    {/* Input: 월급액 */}
                    <div className="space-y-4">
                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
                            <button onClick={() => {
                                setIsSameSalary(true);
                                setSalaries([salaries[0], salaries[0], salaries[0]]);
                            }} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${isSameSalary ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>퇴사 전 최근 월급 동일</button>
                            <button onClick={() => setIsSameSalary(false)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${!isSameSalary ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500'}`}>3개월 개별 입력</button>
                        </div>
                        <div className="space-y-6">
                            {isSameSalary ? (
                                <div>
                                    <label htmlFor="salary-main" className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2 underline underline-offset-4 decoration-blue-200/50">퇴사 전 최근 월급 (세전)</label>
                                    <div className="relative mb-4">
                                        <input
                                            id="salary-main"
                                            type="text"
                                            placeholder="예) 3,500,000"
                                            value={salaries[0] ? formatNumber(parseInt(salaries[0])) : ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setSalaries([val, val, val]);
                                                setErrors(new Set());
                                                setErrorMessage("");
                                            }}
                                            className={`w-full p-4 bg-gray-50 dark:bg-gray-900 border ${errors.has('salaries') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-right font-black text-xl text-gray-800 dark:text-gray-100 ${shakeField === 'salaries' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                        />
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg" aria-hidden="true">₩</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <button onClick={() => resetAmount(0)} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-xl text-[11px] font-black text-rose-500 hover:bg-rose-100 transition-all outline-none">C</button>
                                        {quickAmounts.map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => addAmount(val)}
                                                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-[11px] font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all outline-none"
                                            >
                                                +{val >= 100000000 ? `${val / 1000000}` : `${val / 10000}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {["최근 1개월", "2개월 전", "3개월 전"].map((label, idx) => (
                                        <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <label className="text-xs font-bold text-gray-400 block mb-2">{label}</label>
                                            <div className="relative mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="예) 3,500,000"
                                                    value={salaries[idx] ? formatNumber(parseInt(salaries[idx])) : ""}
                                                    onChange={(e) => {
                                                        const newSalaries = [...salaries];
                                                        newSalaries[idx] = e.target.value.replace(/[^0-9]/g, '');
                                                        setSalaries(newSalaries);
                                                        setErrors(new Set());
                                                        setErrorMessage("");
                                                    }}
                                                    className={`w-full p-3 bg-white dark:bg-gray-800 border ${errors.has('salaries') && !salaries[idx] ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl text-right font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 ${shakeField === 'salaries' && !salaries[idx] ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₩</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 justify-end">
                                                <button onClick={() => resetAmount(idx)} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-lg text-[10px] font-black text-rose-500 hover:bg-rose-100 transition-all outline-none">C</button>
                                                {quickAmounts.map((val) => (
                                                    <button
                                                        key={val}
                                                        onClick={() => addAmount(val, idx)}
                                                        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-[11px] font-bold text-gray-400 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all"
                                                    >
                                                        +{val >= 1000000 ? `${val / 1000000}00만원` : `${val / 10000}만원`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <CalculatorButtons 
                            onReset={handleReset} 
                            onCalculate={handleCalculate} 
                        />
                    </div>

                    {errorMessage && (
                        <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                            🚨 {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* Result Display */}
            {result && (
                <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up text-left">
                    <div className={`rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden ${result.isEligible ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'}`}>
                        <div className="absolute -right-6 -top-6 text-[120px] opacity-10 rotate-12">📋</div>
                        <h3 className="text-white/80 text-xs font-bold mb-4 opacity-90 flex items-center gap-2">
                           실업급여 예상 수급 진단
                           <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-black tracking-widest">만 {result.age}세</span>
                        </h3>
                        <div className="text-2xl md:text-3xl font-black tracking-tight mb-8">
                            {result.isEligible ? '✅ 수급 가능 대상입니다!' : '⚠️ 고용보험 기간 확인이 필요합니다.'}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/20">
                            <div>
                                <p className="text-white/60 text-[10px] mb-1 font-bold">총 예상 수급액</p>
                                <p className="text-2xl font-black">{formatNumber(result.totalBenefit)} 원</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/60 text-[10px] mb-1 font-bold">수급 가능 일수</p>
                                <p className="text-2xl font-black">{result.benefitDays} 일</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-gray-900 dark:text-gray-100 font-black mb-6 flex items-center gap-2 border-b border-gray-50 dark:border-gray-700 pb-4 text-left">🔍 상세 산출 내역</h4>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">피보험 단위기간 (추정)</span>
                                <span className={`font-bold ${result.isEligible ? 'text-blue-500' : 'text-rose-500'}`}>약 {result.estimatedInsuredDays} 일 <span className="text-[10px] text-gray-400 font-normal">(180일 이상 필)</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">1일 실업급여 예상 수급액</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{formatNumber(result.dailyBenefit)} 원</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-700">
                                <span className="text-gray-500 dark:text-gray-400">고용보험 가입기간 ({result.totalTenureYears}년)</span>
                                <span className="font-bold text-gray-800 dark:text-gray-100">{result.totalTenureDays} 일</span>
                            </div>
                        </div>
                        <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/20 text-left">
                            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 font-medium mb-1.5 opacity-80">
                                ※ 피보험 단위기간은 유급 휴일(주휴수당 등)을 포함해야 하므로, 실제 이직확인서상의 기록과 차이가 있을 수 있습니다.
                            </p>
                            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 font-bold">
                                가급적 관할 고용센터를 통해 실제 가입 일수를 확인하시기 바랍니다.
                            </p>
                        </div>
                    </div>

                    <a href="https://m.work24.go.kr/cm/main.do" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-center shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mb-4">
                        고용24 실업급여 신청하기 🚀
                    </a>

                    <CalculatorActions
                        onCopy={handleCopy}
                        shareTitle="[📋 실업급여 계산 결과]"
                        shareDescription={`예상 수급일수 : ${result.benefitDays}일\n총 ${formatNumber(result.totalBenefit)}원`}
                    />
                </div>
            )}
        </div>
    );
}

