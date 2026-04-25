"use client";

import { useState } from "react";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

export default function Insurance() {
    const [salaryType, setSalaryType] = useState<"YEARLY" | "MONTHLY">("YEARLY");
    const [salary, setSalary] = useState<string>("");
    const [nonTaxable, setNonTaxable] = useState<string>("200000"); // 식대 등 기본 20만원
    const [companySize, setCompanySize] = useState<"UNDER_150" | "OVER_150">("UNDER_150");
    const [sanjaeRate, setSanjaeRate] = useState<string>("0.9"); // 기본 0.9% 세팅
    
    const [result, setResult] = useState<any>(null);
    const resultRef = useCalculatorScroll(result);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const formatComma = (raw: string) => raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const parseNum = (val: string) => Number(val.replace(/[^0-9]/g, ""));

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (val.length > 11) return; // limit to 1천억
        setSalary(val ? formatComma(val) : "");
        setResult(null);
    };

    const handleNonTaxableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (val.length > 10) return;
        setNonTaxable(val ? formatComma(val) : "");
        setResult(null);
    };

    const handleSanjaeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9.]/g, "");
        // Only one decimal point
        if ((val.match(/\./g) || []).length > 1) return;
        setSanjaeRate(val);
        setResult(null);
    };

    const addSalaryAmount = (amount: number) => {
        const current = parseNum(salary || "0");
        setSalary(formatComma((current + amount).toString()));
        setResult(null);
    };

    // Number formatting helper
    const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

    const calculateInsurance = () => {
        const fieldErrors = new Set<string>();
        const sVal = parseNum(salary);
        const ntVal = parseNum(nonTaxable);

        if (sVal === 0) fieldErrors.add("salary");

        if (fieldErrors.size > 0) {
            setErrors(fieldErrors);
            setShakeField(Array.from(fieldErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            setErrorMessage("급여액을 입력해주세요.");
            return;
        }

        setErrors(new Set());
        setErrorMessage("");

        // 로직 산출 (월 단위)
        const monthlyTotal = salaryType === "YEARLY" ? Math.floor(sVal / 12) : sVal;
        const taxBase = Math.max(monthlyTotal - ntVal, 0); // 과세대상액

        // 원단위 절사 함수
        const trunc10 = (val: number) => Math.trunc(val / 10) * 10;

        // 1. 국민연금 (4.5%)
        // 상한액 617만원 지정 (실제 2025/2026 기준 변경될 수 있음)
        const PENSION_MAX_BASE = 6170000;
        const pensionBase = Math.min(taxBase, PENSION_MAX_BASE);
        const pensionTotal = trunc10(pensionBase * 0.045);
        const employeePension = pensionTotal;
        const employerPension = pensionTotal;

        // 2. 건강보험 (3.545%)
        const healthTotal = trunc10(taxBase * 0.03545);
        const employeeHealth = healthTotal;
        const employerHealth = healthTotal;

        // 3. 장기요양보험 (건보료의 12.95%)
        const longTermTotal = trunc10(healthTotal * 0.1295);
        const employeeLongTerm = longTermTotal;
        const employerLongTerm = longTermTotal;

        // 4. 고용보험
        const employeeEmployment = trunc10(taxBase * 0.009); // 근로자 0.9%
        const employerEmpBase = 0.009 + (companySize === "UNDER_150" ? 0.0025 : 0.0085);
        const employerEmployment = trunc10(taxBase * employerEmpBase);

        // 5. 산재보험 (전액 사업주)
        const sjRateNum = parseFloat(sanjaeRate) || 0;
        const employerSanjae = trunc10(taxBase * (sjRateNum / 100));

        // 합계 산출
        const employeeSum = employeePension + employeeHealth + employeeLongTerm + employeeEmployment;
        const employerSum = employerPension + employerHealth + employerLongTerm + employerEmployment + employerSanjae;

        setResult({
            taxBase,
            monthlyTotal, // without nonTaxable deducted for reference
            employee: {
                pension: employeePension,
                health: employeeHealth,
                longTerm: employeeLongTerm,
                employment: employeeEmployment,
                sum: employeeSum
            },
            employer: {
                pension: employerPension,
                health: employerHealth,
                longTerm: employerLongTerm,
                employment: employerEmployment,
                sanjae: employerSanjae,
                sum: employerSum
            }
        });
    };

    const handleReset = () => {
        setSalary("");
        setNonTaxable("200000");
        setCompanySize("UNDER_150");
        setSanjaeRate("0.9");
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        
        // 스크롤 상단 이동
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const generateShareText = () => {
        if (!result) {
            return `📌 JIKO 4대보험 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/job/insurance`;
        }
        return `[🛡️ 4대보험 계산 결과]\n\n급여 기준 : ${salaryType === "YEARLY" ? "연봉" : "월급"}\n월 산출액 (상세 기준액) : ${formatComma(result.taxBase.toString())} 원\n\n[🙋 근로자 (개인 부담분)]\n국민연금 : ${formatComma(result.employee.pension.toString())} 원\n건강보험 : ${formatComma(result.employee.health.toString())} 원\n장기요양 : ${formatComma(result.employee.longTerm.toString())} 원\n고용보험 : ${formatComma(result.employee.employment.toString())} 원\n합계: 월 ${formatComma(result.employee.sum.toString())} 원 개인 납부\n\n[🏢 사업주 (회사 부담분)]\n국민연금 : ${formatComma(result.employer.pension.toString())} 원\n건강보험 : ${formatComma(result.employer.health.toString())} 원\n장기요양 : ${formatComma(result.employer.longTerm.toString())} 원\n고용보험 : ${formatComma(result.employer.employment.toString())} 원\n산재보험 : ${formatComma(result.employer.sanjae.toString())} 원\n합계: 월 ${formatComma(result.employer.sum.toString())} 원 회사 납부\n\n📌 JIKO 4대보험 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/job/insurance`;
    };

    const copyResultToClipboard = async () => {
        if (!result) return;
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                        🛡️ 4대보험 계산기
                    </span>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                
                {/* 1. 급여 설정 */}
                <div className="space-y-6">
                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <button onClick={() => { setSalaryType("YEARLY"); setResult(null); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${salaryType === "YEARLY" ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            연봉 기준
                        </button>
                        <button onClick={() => { setSalaryType("MONTHLY"); setResult(null); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${salaryType === "MONTHLY" ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                            월급 기준
                        </button>
                    </div>

                    <div>
                        <label htmlFor="total-salary" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                            총 {salaryType === "YEARLY" ? "연봉액" : "월급액"}
                        </label>
                        <div className="relative">
                            <input
                                id="total-salary"
                                type="text" inputMode="numeric"
                                placeholder={salaryType === "YEARLY" ? "예: 50,000,000" : "예: 3,000,000"}
                                value={salary}
                                onChange={handleSalaryChange}
                                className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-800 dark:text-gray-100 transition-all ${
                                    errors.has('salary') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'
                                } ${shakeField === 'salary' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">₩</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button onClick={() => { setSalary(""); setResult(null); }} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                            {[1000000, 3000000, 5000000, 10000000, 30000000, 50000000, 100000000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => addSalaryAmount(val)}
                                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all active:scale-95"
                                >
                                    +{val >= 100000000 ? `${val / 100000000}억` : val >= 10000000 ? `${val / 10000000}천` : val >= 1000000 ? `${val / 1000000}백` : `${val / 10000}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-6"></div>

                {/* 2. 세부 조건 설정 */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">비과세액 (1개월)</label>
                        <div className="relative">
                            <input
                                type="text" inputMode="numeric"
                                placeholder="예: 200,000"
                                value={nonTaxable ? formatNumber(parseInt(nonTaxable)) : ''}
                                onChange={handleNonTaxableChange}
                                className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-800 dark:text-gray-100 ${
                                    errors.has('nonTaxable') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'
                                } ${shakeField === 'nonTaxable' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">✨ 2024년부터 식대 비과세 한도가 20만원으로 상향되었습니다.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">기업 규모</label>
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                                <button onClick={() => { setCompanySize("UNDER_150"); setResult(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${companySize === "UNDER_150" ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                                    150인 미만
                                </button>
                                <button onClick={() => { setCompanySize("OVER_150"); setResult(null); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${companySize === "OVER_150" ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                                    150인 이상
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">산재 요율</label>
                            <div className="relative">
                                <input
                                    type="text" inputMode="decimal"
                                    placeholder="0.9"
                                    value={sanjaeRate}
                                    onChange={handleSanjaeChange}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-right text-sm font-semibold text-gray-800 dark:text-gray-100 pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 동작 버튼 */}
                <CalculatorButtons 
                    onReset={handleReset} 
                    onCalculate={calculateInsurance} 
                />

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                        🚨 {errorMessage}
                    </div>
                )}
                </div>
            </div>

            {/* 계산 결과 화면 */}
            {result && (
                <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
                    
                    {/* Top Insight Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-9xl opacity-10">🛡️</div>
                        <h3 className="text-indigo-100 font-medium mb-2 opacity-90">{salaryType === "YEARLY" ? "연봉" : "월급"} 기준, 나의 공제액 (월)</h3>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {formatComma(result.employee.sum.toString())} <span className="text-indigo-200 text-2xl font-semibold">원</span>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-indigo-500/30 flex justify-between items-end">
                            <div>
                                <p className="text-indigo-200 text-sm mb-1">나의 진짜 연봉 가치</p>
                                <p className="text-xs text-white/90">
                                    💡 회사가 나를 위해 <strong className="text-amber-300">{formatComma(result.employer.sum.toString())}원</strong>을 추가로 납부합니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 도넛 차트 및 상세 내역(테이블) */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">📊 항목별 분담금 상세 (월 기준)</h3>

                        {/* 시각화 - 도넛 차트 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10">
                            {/* CSS Conic Gradient 기반 차트 */}
                            <div 
                                className="w-48 h-48 rounded-full shadow-inner relative flex items-center justify-center"
                                style={{ 
                                    background: `conic-gradient(
                                        #3b82f6 0% ${Math.round((result.employee.pension / result.employee.sum) * 100)}%, 
                                        #10b981 ${Math.round((result.employee.pension / result.employee.sum) * 100)}% ${Math.round(((result.employee.pension + result.employee.health) / result.employee.sum) * 100)}%, 
                                        #f59e0b ${Math.round(((result.employee.pension + result.employee.health) / result.employee.sum) * 100)}% ${Math.round(((result.employee.pension + result.employee.health + result.employee.longTerm) / result.employee.sum) * 100)}%, 
                                        #8b5cf6 ${Math.round(((result.employee.pension + result.employee.health + result.employee.longTerm) / result.employee.sum) * 100)}% 100%
                                    )` 
                                }}
                            >
                                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">근로자 합계</span>
                                    <strong className="text-sm font-black text-gray-800 dark:text-gray-100">{formatComma(result.employee.sum.toString())}</strong>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold w-20">국민연금</span>
                                    <span className="text-xs text-gray-500 font-bold">{Math.round((result.employee.pension / result.employee.sum) * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold w-20">건강보험</span>
                                    <span className="text-xs text-gray-500 font-bold">{Math.round((result.employee.health / result.employee.sum) * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold w-20">장기요양</span>
                                    <span className="text-xs text-gray-500 font-bold">{Math.round((result.employee.longTerm / result.employee.sum) * 100)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-violet-500 shadow-sm"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold w-20">고용보험</span>
                                    <span className="text-xs text-gray-500 font-bold">{Math.round((result.employee.employment / result.employee.sum) * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* 리스트 테이블 (카드형 방식) */}
                        <div className="space-y-4">
                            {/* 범례 */}
                            <div className="grid grid-cols-4 gap-2 text-center pb-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] font-bold text-gray-400">구분</div>
                                <div className="text-[10px] font-bold text-gray-400">요율</div>
                                <div className="text-[10px] font-bold text-indigo-500">🙋 근로자</div>
                                <div className="text-[10px] font-bold text-orange-500">🏢 사업주</div>
                            </div>

                            {/* 국민연금 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">국민연금</div>
                                <div className="text-[11px] text-gray-500 text-center flex flex-col"><span>4.5%</span><span className="opacity-60">상·하한</span></div>
                                <div className="text-xs md:text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">{formatComma(result.employee.pension.toString())}</div>
                                <div className="text-xs md:text-sm text-right font-bold text-orange-500 dark:text-orange-400">{formatComma(result.employer.pension.toString())}</div>
                            </div>

                            {/* 건강보험 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">건강보험</div>
                                <div className="text-[11px] text-gray-500 text-center flex flex-col"><span>3.545%</span></div>
                                <div className="text-xs md:text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">{formatComma(result.employee.health.toString())}</div>
                                <div className="text-xs md:text-sm text-right font-bold text-orange-500 dark:text-orange-400">{formatComma(result.employer.health.toString())}</div>
                            </div>

                            {/* 장기요양보험 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200">장기요양</div>
                                <div className="text-[11px] text-gray-500 text-center flex flex-col"><span>건강의</span><span>12.9%</span></div>
                                <div className="text-xs md:text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">{formatComma(result.employee.longTerm.toString())}</div>
                                <div className="text-xs md:text-sm text-right font-bold text-orange-500 dark:text-orange-400">{formatComma(result.employer.longTerm.toString())}</div>
                            </div>

                            {/* 고용보험 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 flex flex-col"><span>고용보험</span></div>
                                <div className="text-[11px] text-gray-500 text-center flex flex-col"><span>근:0.9%</span><span>사:0.9%+α</span></div>
                                <div className="text-xs md:text-sm text-right font-bold text-indigo-600 dark:text-indigo-400">{formatComma(result.employee.employment.toString())}</div>
                                <div className="text-xs md:text-sm text-right font-bold text-orange-500 dark:text-orange-400">{formatComma(result.employer.employment.toString())}</div>
                            </div>

                            {/* 산재보험 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-orange-50/50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/40">
                                <div className="text-xs flex items-center gap-1 font-semibold text-orange-700 dark:text-orange-400">산재보험<span className="text-[9px] bg-orange-100 text-orange-600 px-1 rounded block md:inline mt-1 md:mt-0">100%회사</span></div>
                                <div className="text-[11px] text-orange-400 text-center flex flex-col"><span>{sanjaeRate}%</span></div>
                                <div className="text-xs md:text-sm text-right font-bold text-gray-300 dark:text-gray-500">-</div>
                                <div className="text-xs md:text-sm text-right font-bold text-orange-500 dark:text-orange-400">{formatComma(result.employer.sanjae.toString())}</div>
                            </div>
                            
                            {/* 합계 */}
                            <div className="grid grid-cols-4 gap-2 items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="text-sm font-bold text-gray-800 dark:text-gray-100">합계</div>
                                <div className="text-[11px] text-gray-500 text-center flex flex-col"><span>총납부액</span></div>
                                <div className="text-sm text-right font-black text-indigo-600 dark:text-indigo-400">{formatComma(result.employee.sum.toString())}</div>
                                <div className="text-sm text-right font-black text-orange-500 dark:text-orange-400">{formatComma(result.employer.sum.toString())}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 결과 복사 & 공유 */}
                    <CalculatorActions
                        onCopy={copyResultToClipboard}
                        shareTitle=""
                        shareDescription={generateShareText()}
                    />

                </div>
            )}
            
        </div>
    );
}
