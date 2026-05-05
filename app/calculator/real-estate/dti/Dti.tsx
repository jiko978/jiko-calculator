"use client";

import { useState, useCallback } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";

type RepaymentMethod = "EQU_AMOUNT" | "EQU_PRINCIPAL" | "MATURITY";

const DtiCalculator = () => {
    const realEstateTabs = [
        { label: "DSR 계산기", href: "/calculator/real-estate/dsr" },
        { label: "신DTI 계산기", href: "/calculator/real-estate/new-dti" },
        { label: "DTI 계산기", href: "/calculator/real-estate/dti" },
        { label: "LTV 계산기", href: "/calculator/real-estate/ltv" },
    ];

    // 입력 상태
    const [salary, setSalary] = useState<string>("50000000"); // 연소득
    const [principal, setPrincipal] = useState<string>("300000000"); // 신규 대출 원금
    const [term, setTerm] = useState<string>("30"); // 대출기간(년)
    const [termUnit, setTermUnit] = useState<"month" | "year">("year");
    const [interest, setInterest] = useState<string>("4.5"); // 금리(%)
    const [method, setMethod] = useState<RepaymentMethod>("EQU_AMOUNT"); // 상환방식
    
    // 보유 대출 상태 (DTI는 이자만 합산)
    const [existingInterest, setExistingInterest] = useState<string>("0"); 

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

    const calculateDTI = useCallback(() => {
        const salaryV = Number(salary);
        const principalV = Number(principal);
        const totalMonths = termUnit === "year" ? Number(term) * 12 : Number(term);
        const interestV = Number(interest);
        const existIntV = Number(existingInterest);

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

        // DTI 공식: (신규 주담대 연간 원리금 + 기존 대출 연간 이자) / 연소득
        const totalAnnualDebt = annualNewRepayment + existIntV;
        const dtiScore = (totalAnnualDebt / salaryV) * 100;

        // 추가 한도 역산 (DTI 60% 기준 여유분 예시)
        const dtiLimit = 0.6; 
        const remainCapacity = Math.max(0, (salaryV * dtiLimit) - existIntV);
        let maxAdditionalLoan = 0;
        if (method === "EQU_AMOUNT") {
            const monthlyCapacity = remainCapacity / 12;
            maxAdditionalLoan = (monthlyCapacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        } else {
            maxAdditionalLoan = remainCapacity / (interestV / 100);
        }

        setResultData({
            dtiScore: dtiScore.toFixed(2),
            annualNewRepayment,
            totalAnnualDebt,
            maxAdditionalLoan
        });
        setCalculated(true);
    }, [salary, principal, term, termUnit, interest, existingInterest, method]);

    const handleReset = () => {
        setSalary("");
        setPrincipal("");
        setTerm("");
        setTermUnit("year");
        setInterest("");
        setExistingInterest("");
        setCalculated(false);
        setErrorMessage("");
        setErrors(new Set());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generateShareText = () => {
        if (!resultData) return "";
        return `[📉 DTI 계산 결과]\nDTI 스코어 : ${resultData.dtiScore}%\n연소득 : ${formatNumber(Number(salary))}원\n최대 추가 대출 가능액 : ${formatNumber(resultData.maxAdditionalLoan)}원\n\n📌 JIKO DTI 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/real-estate/dti`;
    };

    const handleCopy = async () => {
        const text = generateShareText();
        if (text) await navigator.clipboard.writeText(text);
    };

    const getGaugeColor = (score: number) => {
        if (score <= 40) return "bg-blue-500";
        if (score <= 60) return "bg-emerald-500";
        return "bg-red-500";
    };

    const getStatusText = (score: number) => {
        if (score <= 40) return { label: "안전", emoji: "✅", desc: "추가 대출 여유가 충분합니다" };
        if (score <= 60) return { label: "주의", emoji: "⚖️", desc: "대출 규제 범위 내에 있습니다" };
        return { label: "위험", emoji: "🚨", desc: "한도 초과 가능성이 높습니다" };
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
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold tracking-tight">📊 DTI 계산기</div>
                </div>

                <CalculatorTabs tabs={realEstateTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50 dark:border-gray-700">
                        <div className={`space-y-3 ${shakeField === 'salary' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">나의 연소득 (세전)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={salary ? Number(salary).toLocaleString() : ""}
                                    onChange={(e) => { setSalary(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                    className={`w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('salary') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'}`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setSalary(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => addValue(setSalary, salary, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">기존 보유 대출 연간 이자 합계</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={existingInterest ? Number(existingInterest).toLocaleString() : ""}
                                    onChange={(e) => { setExistingInterest(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                    className="w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:border-blue-500 transition-all text-right"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setExistingInterest(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => addValue(setExistingInterest, existingInterest, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
                                ))}
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
                                        className={`w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('principal') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'}`}
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <button onClick={() => {setPrincipal(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                    {principalButtons.map(v => (
                                        <button key={v} onClick={() => addValue(setPrincipal, principal, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
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
                                        className={`w-full h-16 px-4 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('interest') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'}`}
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
                                        className={`w-full h-14 px-4 text-xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl transition-all text-right ${errors.has('term') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'}`}
                                    />
                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl flex gap-1 mb-8">
                                        {[ {id: "month", label: "월"}, {id: "year", label: "년"} ].map((u) => (
                                            <button
                                                key={u.id}
                                                onClick={() => { setTermUnit(u.id as any); setResultData(null); }}
                                                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${termUnit === u.id ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                            >
                                                {u.label}
                                            </button>
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
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl flex gap-1 mb-8">
                                    {[ { id: "EQU_AMOUNT", label: "원리금균등" }, { id: "EQU_PRINCIPAL", label: "원금균등" }, { id: "MATURITY", label: "만기일시" } ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => { setMethod(t.id as any); setResultData(null); }}
                                            className={`flex-1 py-3.5 rounded-xl text-[11px] font-bold transition-all ${method === t.id ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center space-y-4">
                        <CalculatorButtons onCalculate={calculateDTI} onReset={handleReset} />
                        {errorMessage && (
                            <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>
                </div>

                {calculated && resultData && (
                    <div ref={resultRef} id="result-section" className={`mt-8 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden animate-fade-slide-up space-y-8">
                            {/* 카드 상단 테두리 그라데이션 */}
                            <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-1000 ${getGaugeColor(Number(resultData.dtiScore))}`}></div>

                            <div className="text-center">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                                    <span className="text-blue-500">✨</span> 계산 결과
                                </h2>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">나의 DTI 분석 리포트</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[24px] p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <h3 className={`text-6xl md:text-7xl font-black tracking-tighter transition-colors duration-1000 ${Number(resultData.dtiScore) > 60 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                                            {resultData.dtiScore}<span className="text-3xl ml-1 text-gray-400">%</span>
                                        </h3>
                                        <div className={`px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm ${getGaugeColor(Number(resultData.dtiScore))} text-white animate-pulse`}>
                                            {getStatusText(Number(resultData.dtiScore)).label} {getStatusText(Number(resultData.dtiScore)).emoji}
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 text-center leading-relaxed tracking-tight break-keep max-w-md">
                                        {getStatusText(Number(resultData.dtiScore)).desc}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-10 max-w-xl mx-auto">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 px-1 uppercase tracking-widest">
                                    <span>SAFE</span>
                                    <span className="text-blue-500">LIMIT (60%)</span>
                                    <span>RISK</span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-50 dark:border-gray-800 relative shadow-inner">
                                    <div className="absolute left-[60%] top-0 w-1 h-full bg-blue-500/30 z-10"></div>
                                    <div className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${getGaugeColor(Number(resultData.dtiScore))}`} style={{ width: `${Math.min(100, Number(resultData.dtiScore))}%` }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-7 bg-gray-50/50 dark:bg-gray-900/30 rounded-[28px] border border-gray-100 dark:border-gray-800 group hover:border-blue-500/30 transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 scale-100 group-hover:scale-125 transition-transform"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">종합 연 부채 상환액</span>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{formatNumber(resultData.totalAnnualDebt)}<span className="text-sm ml-1 text-gray-400">원</span></p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-tight">월 평균 {formatNumber(resultData.totalAnnualDebt / 12)}원 상환 예상</p>
                                </div>
                                <div className="p-7 bg-blue-50/50 dark:bg-blue-900/10 rounded-[28px] border border-blue-100/50 dark:border-blue-900/30 group hover:scale-[1.02] transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">추가 대출 가능액 (60% 기준)</span>
                                    </div>
                                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter leading-none">{formatNumber(resultData.maxAdditionalLoan)}<span className="text-sm ml-1 text-blue-400/60 font-bold uppercase">원</span></p>
                                    <p className="text-[10px] font-bold text-blue-500/60 mt-2 tracking-tight">DTI 상한선까지 확보 가능한 여력</p>
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

export default DtiCalculator;
