"use client";

import { useState, useCallback } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";

type RepaymentMethod = "EQU_AMOUNT" | "EQU_PRINCIPAL" | "MATURITY";

const NewDtiCalculator = () => {
    const realEstateTabs = [
        { label: "DSR 계산기", href: "/calculator/real-estate/dsr" },
        { label: "신DTI 계산기", href: "/calculator/real-estate/new-dti" },
        { label: "DTI 계산기", href: "/calculator/real-estate/dti" },
        { label: "LTV 계산기", href: "/calculator/real-estate/ltv" },
    ];

    // 입력 상태
    const [salary, setSalary] = useState<string>("60000000"); // 연소득
    const [principal, setPrincipal] = useState<string>("300000000"); // 신규 대출 원금
    const [term, setTerm] = useState<string>("30"); // 대출기간(년)
    const [termUnit, setTermUnit] = useState<"month" | "year">("year");
    const [interest, setInterest] = useState<string>("4.5"); // 금리(%)
    const [method, setMethod] = useState<RepaymentMethod>("EQU_AMOUNT"); // 상환방식
    
    // 보유 대출 상태 (신DTI는 기존 주담대 원리금을 모두 합산)
    const [existingMortgagePrincipal, setExistingMortgagePrincipal] = useState<string>("0"); 
    const [existingMortgageInterest, setExistingMortgageInterest] = useState<string>("0"); 
    const [existingEtcInterest, setExistingEtcInterest] = useState<string>("0"); // 기타대출 이자

    const [calculated, setCalculated] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const resultRef = useCalculatorScroll(calculated);

    const formatNumber = (val: number) => Math.round(val).toLocaleString();

    const addValue = (setter: (v: string) => void, current: string, add: number) => {
        const next = (Number(current) || 0) + add;
        setter(next.toString());
        setCalculated(false);
    };

    const addTerm = (val: number) => {
        const current = termUnit === "month" ? Number(term) : Number(term) * 12;
        const next = current + val;
        setTerm(next.toString());
        setTermUnit("month");
        setCalculated(false);
    };

    const calculateNewDTI = useCallback(() => {
        const salaryV = Number(salary);
        const principalV = Number(principal);
        const totalMonths = termUnit === "year" ? Number(term) * 12 : Number(term);
        const interestV = Number(interest);
        
        const existMortPrinV = Number(existingMortgagePrincipal);
        const existMortIntV = Number(existingMortgageInterest);
        const existEtcIntV = Number(existingEtcInterest);

        if (!salaryV || !principalV || !totalMonths || !interestV) {
            const newErrors = new Set<string>();
            if (!salaryV) newErrors.add("salary");
            if (!principalV) newErrors.add("principal");
            if (!totalMonths) newErrors.add("term");
            if (!interestV) newErrors.add("interest");
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            setErrors(newErrors);
            setShakeField(Array.from(newErrors)[0] || null);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");
        setErrors(new Set());

        const r = interestV / 100 / 12;
        const n = totalMonths;

        let annualNewRepayment = 0;
        if (method === "EQU_AMOUNT") {
            const monthly = (principalV * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            annualNewRepayment = monthly * 12;
        } else if (method === "EQU_PRINCIPAL") {
            const firstMonth = (principalV / n) + (principalV * r);
            const twelfthMonth = (principalV / n) + ((principalV - (principalV/n*11)) * r);
            annualNewRepayment = ((firstMonth + twelfthMonth) / 2) * 12;
        } else {
            annualNewRepayment = principalV * (interestV / 100);
        }

        // 신DTI 공식: (신규 주담대 연원리금 + 기존 주담대 연원리금 + 기타대출 연이자) / 연소득
        const totalAnnualDebt = annualNewRepayment + existMortPrinV + existMortIntV + existEtcIntV;
        const newDtiScore = (totalAnnualDebt / salaryV) * 100;

        // 투기수요 관리 기준 (보통 40~50% 규제)
        const dtiLimit = 0.5; 
        const remainCapacity = Math.max(0, (salaryV * dtiLimit) - (existMortPrinV + existMortIntV + existEtcIntV));
        let maxAdditionalLoan = 0;
        if (method === "EQU_AMOUNT") {
            const monthlyCapacity = remainCapacity / 12;
            maxAdditionalLoan = (monthlyCapacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        } else {
            maxAdditionalLoan = remainCapacity / (interestV / 100);
        }

        setResultData({
            newDtiScore: newDtiScore.toFixed(2),
            annualNewRepayment,
            totalAnnualDebt,
            maxAdditionalLoan,
            isMultiMortgage: existMortPrinV > 0
        });
        setCalculated(true);
    }, [salary, principal, term, termUnit, interest, existingMortgagePrincipal, existingMortgageInterest, existingEtcInterest, method]);

    const handleReset = () => {
        setSalary("");
        setPrincipal("");
        setTerm("");
        setTermUnit("year");
        setInterest("");
        setExistingMortgagePrincipal("");
        setExistingMortgageInterest("");
        setExistingEtcInterest("");
        setCalculated(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generateShareText = () => {
        if (!resultData) return "";
        return `[🏢 신DTI 계산 결과]\n신DTI 스코어 : ${resultData.newDtiScore}%\n보유 주담대 원리금 합산 분석\n최대 추가 대출 가능액 : ${formatNumber(resultData.maxAdditionalLoan)}원\n\n📌 JIKO 신DTI 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/real-estate/new-dti`;
    };

    const handleCopy = async () => {
        const text = generateShareText();
        if (text) await navigator.clipboard.writeText(text);
    };

    const getGaugeColor = (score: number) => {
        if (score <= 30) return "bg-blue-500";
        if (score <= 50) return "bg-emerald-500";
        return "bg-red-500";
    };

    const getStatusText = (score: number) => {
        if (score <= 30) return { label: "안전", emoji: "✅", desc: "추가 대출 여력이 충분한 상태입니다." };
        if (score <= 50) return { label: "주의", emoji: "⚠️", desc: "규제 한도 진입 단계로 정밀 상담이 필요합니다." };
        return { label: "규제위험", emoji: "🚨", desc: "한도 초과 상태로 추가 주담대 발급이 어려울 수 있습니다." };
    };

    const amountButtons = [1000000, 3000000, 5000000, 10000000, 30000000, 50000000, 100000000];
    const principalButtons = [1000000, 5000000, 10000000, 50000000, 100000000, 500000000];

    const formatBtnLabel = (val: number) => {
        if (val >= 100000000) return `${val / 100000000}억`;
        if (val >= 10000000) return `${val / 10000000}천`;
        if (val >= 1000000) return `${val / 1000000}백`;
        return `${val / 10000}`;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>
                
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold tracking-tight">📊 신DTI 계산기</div>
                </div>

                <CalculatorTabs tabs={realEstateTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    
                    <div className="space-y-6 pb-6 border-b border-gray-50 dark:border-gray-700">
                        <div className={`space-y-3 ${shakeField === 'salary' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">나의 연소득 (세전)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={salary ? Number(salary).toLocaleString() : ""}
                                    onChange={(e) => { setSalary(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                    className={`w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('salary') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500'}`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setSalary(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => addValue(setSalary, salary, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 text-gray-600 dark:text-gray-300 hover:text-emerald-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30 space-y-4">
                            <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest leading-none">⚠️ 보유 주택담보대출 정보 (신DTI 핵심)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">기존 주담대 연간 원금 상환액</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={existingMortgagePrincipal ? Number(existingMortgagePrincipal).toLocaleString() : ""}
                                        onChange={(e) => { setExistingMortgagePrincipal(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                        className="w-full h-12 px-3 font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 outline-none text-right"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">기존 주담대 연간 이자 상환액</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={existingMortgageInterest ? Number(existingMortgageInterest).toLocaleString() : ""}
                                        onChange={(e) => { setExistingMortgageInterest(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                        className="w-full h-12 px-3 font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 outline-none text-right"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">기타 대출 연간 이자 합계</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={existingEtcInterest ? Number(existingEtcInterest).toLocaleString() : ""}
                                    onChange={(e) => { setExistingEtcInterest(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                    className="w-full h-12 px-3 font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 outline-none text-right"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`space-y-3 ${shakeField === 'principal' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">신규/희망 대출 원금</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={principal ? Number(principal).toLocaleString() : ""}
                                        onChange={(e) => { setPrincipal(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                        className={`w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('principal') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500'}`}
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <button onClick={() => {setPrincipal(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                    {principalButtons.map(v => (
                                        <button key={v} onClick={() => addValue(setPrincipal, principal, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 text-gray-600 dark:text-gray-300 hover:text-emerald-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">연 대출 금리</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={interest}
                                        onChange={(e) => { setInterest(e.target.value.replace(/[^0-9.]/g, "")); setCalculated(false); }}
                                        className={`w-full h-16 px-4 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('interest') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500'}`}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">대출 기간 (상환 기간)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={term}
                                        onChange={(e) => { setTerm(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                        className={`w-full h-14 px-4 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('term') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500'}`}
                                    />
                                    <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl shrink-0">
                                        {[ {id: "month", label: "월"}, {id: "year", label: "년"} ].map((u) => (
                                            <button key={u.id} onClick={() => setTermUnit(u.id as any)} className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${termUnit === u.id ? "bg-white dark:bg-gray-800 text-emerald-600 shadow-sm" : "text-gray-400"}`}>{u.label}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {[6, 12, 24, 36].map(v => (
                                        <button key={v} onClick={() => addTerm(v)} className="py-2.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-xl transition-all active:scale-95">{v}개월</button>
                                    ))}
                                </div>

                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">상환 방식</label>
                                <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl gap-1">
                                    {[ { id: "EQU_AMOUNT", label: "원리금균등" }, { id: "EQU_PRINCIPAL", label: "원금균등" }, { id: "MATURITY", label: "만기일시" } ].map(t => (
                                        <button key={t.id} onClick={() => setMethod(t.id as any)} className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold transition-all ${method === t.id ? "bg-white dark:bg-gray-800 text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}>{t.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center space-y-4">
                        <CalculatorButtons onCalculate={calculateNewDTI} onReset={handleReset} />
                        {errorMessage && (
                            <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>
                </div>

                {calculated && resultData && (
                    <div ref={resultRef} id="result-section" className={`mt-8 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-1000 ${getGaugeColor(Number(resultData.newDtiScore))}`}></div>
                            
                            <div className="text-center mb-10">
                                <p className="text-[12px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">강화된 신DTI 분석 리포트</p>
                                <div className="flex items-center justify-center gap-3">
                                    <h2 className={`text-6xl md:text-7xl font-black tracking-tighter transition-colors duration-1000 ${Number(resultData.newDtiScore) > 50 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                                        {resultData.newDtiScore}<span className="text-3xl ml-1 text-gray-400">%</span>
                                    </h2>
                                    <div className={`px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm ${getGaugeColor(Number(resultData.newDtiScore))} text-white animate-pulse`}>
                                        {getStatusText(Number(resultData.newDtiScore)).label} {getStatusText(Number(resultData.newDtiScore)).emoji}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-400 mt-5 leading-relaxed tracking-tight break-keep">
                                    {getStatusText(Number(resultData.newDtiScore)).desc}
                                </p>
                            </div>

                            {resultData.isMultiMortgage && (
                                <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-start gap-4">
                                    <span className="text-2xl">🚧</span>
                                    <div>
                                        <p className="text-xs font-black text-red-600 dark:text-red-400 mb-1 leading-none uppercase tracking-widest">다주택자 한도 절벽 알람</p>
                                        <p className="text-[11px] text-red-500 font-medium leading-relaxed tracking-tight">기존 주택담보대출의 <span className="font-black">원금 상환액</span>이 합산되어 한도가 급격히 축소되었습니다. 신DTI 규제 40~50% 초과 여부를 면밀히 확인하세요.</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 mb-10 max-w-xl mx-auto">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 px-1 uppercase tracking-widest">
                                    <span>SAFE</span>
                                    <span className="text-emerald-500">LIMIT (50%)</span>
                                    <span>RISK</span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-50 dark:border-gray-800 relative shadow-inner">
                                    <div className="absolute left-[50%] top-0 w-1 h-full bg-emerald-500/30 z-10"></div>
                                    <div className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${getGaugeColor(Number(resultData.newDtiScore))}`} style={{ width: `${Math.min(100, Number(resultData.newDtiScore))}%` }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-7 bg-gray-50/50 dark:bg-gray-900/30 rounded-[28px] border border-gray-100 dark:border-gray-800 group hover:border-emerald-500/30 transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 scale-100 group-hover:scale-125 transition-transform"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">신DTI 기준 연간 부채 합계</span>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{formatNumber(resultData.totalAnnualDebt)}<span className="text-sm ml-1 text-gray-400">원</span></p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-tight">주담대 원리금 합산 정밀 산정액</p>
                                </div>
                                <div className="p-7 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[28px] border border-emerald-100/50 dark:border-emerald-900/30 group hover:scale-[1.02] transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">보수적 추가 한도 (50% 기준)</span>
                                    </div>
                                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">{formatNumber(resultData.maxAdditionalLoan)}<span className="text-sm ml-1 text-emerald-400/60 font-bold uppercase">원</span></p>
                                    <p className="text-[10px] font-bold text-emerald-500/60 mt-2 tracking-tight">신규 대출 가능 여유분</p>
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle=""
                                shareDescription={generateShareText()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewDtiCalculator;
