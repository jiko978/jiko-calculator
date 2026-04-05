"use client";

import { useState, useCallback } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type LoanType = "MORTGAGE" | "CREDIT" | "JEONSE" | "CAR" | "DEPOSIT" | "INSURANCE" | "INTERIM" | "NON_HOUSE" | "SECURITY" | "CARD" | "ETC_MORTGAGE" | "ETC_SECURITY" | "ETC";
type RepaymentMethod = "EQU_AMOUNT" | "EQU_PRINCIPAL" | "MATURITY";
type InterestType = "VARIABLE" | "MIXED" | "PERIODIC";
type StressPhase = 0 | 1 | 2 | 3;

const DsrCalculator = () => {
    // 기본 입력 상태
    const [salary, setSalary] = useState<string>("50000000"); // 연소득
    const [loanType, setLoanType] = useState<LoanType>("MORTGAGE"); // 대출종류
    const [principal, setPrincipal] = useState<string>("300000000"); // 대출원금
    const [term, setTerm] = useState<string>("30"); // 대출기간(년)
    const [termUnit, setTermUnit] = useState<"month" | "year">("year");
    const [interest, setInterest] = useState<string>("4.5"); // 금리(%)
    const [method, setMethod] = useState<RepaymentMethod>("EQU_AMOUNT"); // 상환방식
    
    // 보유 대출 상태
    const [existingRepayment, setExistingRepayment] = useState<string>("0"); // 기존 대출 연간 원리금 합계
    
    // 스트레스 DSR 옵션
    const [phase, setPhase] = useState<StressPhase>(2); // 현재 2단계 기준
    const [isMetropolitan, setIsMetropolitan] = useState<boolean>(true); // 수도권 여부
    const [interestType, setInterestType] = useState<InterestType>("VARIABLE"); // 스트레스 금리 유형

    const [calculated, setCalculated] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const resultRef = useCalculatorScroll(calculated);

    const formatNumber = (val: number) => Math.round(val).toLocaleString();

    // 단위 버튼 기능
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

    const calculateDSR = useCallback(() => {
        const salaryV = Number(salary);
        const principalV = Number(principal);
        const totalMonths = termUnit === "year" ? Number(term) * 12 : Number(term);
        const interestV = Number(interest);
        const existV = Number(existingRepayment);

        if (!salaryV || !principalV || !totalMonths || !interestV) {
            const newErrors = new Set<string>();
            if (!salaryV) newErrors.add("salary");
            if (!principalV) newErrors.add("principal");
            if (!totalMonths) newErrors.add("term");
            if (!interestV) newErrors.add("interest");
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            setErrors(newErrors);
            setShakeField(Array.from(newErrors).find(e => e === "salary" || e === "principal" || e === "term" || e === "interest") || null);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");
        setErrors(new Set());

        // 스트레스 가산 금리 로직 (유형별 정밀 산출)
        let baseStressRate = 1.50; 
        let phaseRatio = phase === 1 ? 0.25 : phase === 2 ? 0.50 : phase === 3 ? 1.00 : 0;
        
        if (phase === 2 && isMetropolitan) baseStressRate = 2.40;
        if (phase === 2 && !isMetropolitan) baseStressRate = 1.50;

        let typeWeight = interestType === "VARIABLE" ? 1.0 : interestType === "MIXED" ? 0.6 : 0.3;
        const stressRate = baseStressRate * phaseRatio * typeWeight;
        
        const totalInterest = interestV + stressRate;
        const r = totalInterest / 100 / 12;
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

        const totalAnnualRepayment = annualNewRepayment + existV;
        const dsrScore = (totalAnnualRepayment / salaryV) * 100;

        const remainDsrCapacity = Math.max(0, (salaryV * 0.4) - existV);
        let maxAdditionalLoan = 0;
        if (method === "EQU_AMOUNT") {
            const monthlyCapacity = remainDsrCapacity / 12;
            maxAdditionalLoan = (monthlyCapacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        } else {
            maxAdditionalLoan = remainDsrCapacity / (interestV / 100);
        }

        setResultData({
            dsrScore: dsrScore.toFixed(2),
            annualNewRepayment,
            totalAnnualRepayment,
            maxAdditionalLoan,
            stressRate: stressRate.toFixed(2),
            isMetropolitan,
            phase,
            interestType
        });
        setCalculated(true);
    }, [salary, principal, term, termUnit, interest, existingRepayment, method, phase, isMetropolitan, interestType]);

    const handleReset = () => {
        setSalary("");
        setLoanType("MORTGAGE");
        setPrincipal("");
        setTerm("");
        setTermUnit("year");
        setInterest("");
        setExistingRepayment("");
        setInterestType("VARIABLE");
        setCalculated(false);
        setErrorMessage("");
        setErrors(new Set());
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCopy = async () => {
        if (!resultData) return;
        const text = `[📊 DSR 분석 결과]\nDSR 스코어 : ${resultData.dsrScore}%\n연소득 : ${formatNumber(Number(salary))}원\n최대 추가 대출 한도 : ${formatNumber(resultData.maxAdditionalLoan)}원\n\n📌 JIKO 부동산 계산기에서 확인하기:\nhttps://jiko.kr/calculator/real-estate/dsr`;
        await navigator.clipboard.writeText(text);
    };

    const getGaugeColor = (score: number) => {
        if (score <= 30) return "bg-blue-500";
        if (score <= 40) return "bg-emerald-500";
        if (score <= 50) return "bg-orange-500";
        return "bg-red-500";
    };

    const getStatusText = (score: number) => {
        if (score <= 30) return { label: "안전", emoji: "✅", desc: "추가 대출 여력 충분" };
        if (score <= 40) return { label: "보통", emoji: "⚖️", desc: "규제 한도(40%) 인접" };
        if (score <= 50) return { label: "주의", emoji: "⚠️", desc: "은행권 한도 제한 가능성" };
        return { label: "위험", emoji: "🚨", desc: "추가 대출 불가 단계" };
    };

    const loanTypes = [
        { id: "MORTGAGE", label: "주택담보대출" },
        { id: "CREDIT", label: "신용대출" },
        { id: "JEONSE", label: "전세대출" },
        { id: "CAR", label: "자동차담보대출" },
        { id: "DEPOSIT", label: "예적금담보대출" },
        { id: "INSURANCE", label: "보험계약대출" },
        { id: "INTERIM", label: "중도금 및 이주비" },
        { id: "NON_HOUSE", label: "비주택부동산담보대출" },
        { id: "ETC_MORTGAGE", label: "기타담보대출" },
        { id: "SECURITY", label: "유가증권담보대출" },
        { id: "CARD", label: "장기카드대출" },
        { id: "ETC_SECURITY", label: "전세보증금담보대출" },
        { id: "ETC", label: "기타대출" }
    ];

    const amountButtons = [1000000, 3000000, 5000000, 10000000, 30000000, 50000000];
    const principalButtons = [1000000, 10000000, 50000000, 100000000, 300000000, 500000000];

    const formatBtnLabel = (val: number) => {
        if (val >= 100000000) return `${val / 100000000}억`;
        return `${val / 10000}`;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>
                
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold tracking-tight">📊 DSR 계산기</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">대출 구분</label>
                        <select 
                            value={loanType}
                            onChange={(e) => { setLoanType(e.target.value as LoanType); setCalculated(false); }}
                            className="w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                        >
                            {loanTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50 dark:border-gray-700">
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

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">기존 대출 연 원리금 상환액</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={existingRepayment ? Number(existingRepayment).toLocaleString() : ""}
                                    onChange={(e) => { setExistingRepayment(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); }}
                                    className="w-full h-16 pl-12 pr-12 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:border-emerald-500 transition-all text-right"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setExistingRepayment(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => addValue(setExistingRepayment, existingRepayment, v)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 text-gray-600 dark:text-gray-300 hover:text-emerald-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
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
                                        <button key={v} onClick={() => addTerm(v)} className="py-2.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 text-gray-600 dark:text-gray-300 hover:text-emerald-600 rounded-xl transition-all active:scale-95">{v}개월</button>
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

                    {/* 스트레스 DSR 정밀 옵션 */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 mt-6 space-y-6">
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">스트레스 DSR 3단계 시뮬레이션</label>
                            
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold text-gray-500">시행 단계</span>
                                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700">
                                    {[0, 1, 2, 3].map((p) => (
                                        <button key={p} onClick={() => { setPhase(p as StressPhase); setCalculated(false); }} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${phase === p ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}>{p}단계</button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold text-gray-500">금리 유형</span>
                                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700 items-center justify-center">
                                    {[ {id: "VARIABLE", label: "변동형"}, {id: "MIXED", label: "혼합형"}, {id: "PERIODIC", label: "주기형"} ].map(t => (
                                        <button key={t.id} onClick={() => { setInterestType(t.id as InterestType); setCalculated(false); }} className={`px-3 py-2 rounded-lg text-[11px] font-black transition-all whitespace-nowrap ${interestType === t.id ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}>{t.label}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-bold text-gray-500">지역 구분</span>
                                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700">
                                    <button onClick={() => { setIsMetropolitan(true); setCalculated(false); }} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${isMetropolitan ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400"}`}>수도권</button>
                                    <button onClick={() => { setIsMetropolitan(false); setCalculated(false); }} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${!isMetropolitan ? "bg-emerald-500 text-white shadow-lg" : "text-gray-400"}`}>비수도권</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 가이드 정보 (옵션 섹션 아래 위치) */}
                    <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                        <h3 className="text-[11px] font-black text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2 uppercase tracking-widest leading-none">
                            💡 스트레스 DSR 핵심 가이드
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed tracking-tight break-keep">
                                    <span className="text-blue-800 dark:text-blue-200">[시행 단계]</span> 2단계(현행 기준) 선택을 권장합니다. 단계가 높아지면(3단계 등) 대출 가산 금리가 더해져 산출되는 한도가 줄어듭니다.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold leading-relaxed tracking-tight break-keep">
                                    <span className="text-blue-800 dark:text-blue-200">[금리 유형]</span> 변동형 &gt; 혼합형 &gt; 주기형 순으로 정책에 따른 가산 금리 비율이 차등 적용되어 한도 산출에 영향을 줍니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center space-y-4">
                        <CalculatorButtons onCalculate={calculateDSR} onReset={handleReset} />
                        {errorMessage && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center border border-red-100 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>
                </div>

                {calculated && resultData && (
                    <div ref={resultRef} id="result-section" className={`mt-8 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-2 transition-colors duration-1000 ${getGaugeColor(Number(resultData.dsrScore))}`}></div>
                            
                            <div className="text-center mb-10">
                                <p className="text-[12px] font-black text-gray-400 mb-2 uppercase tracking-widest leading-none">나의 DSR 분석 리포트</p>
                                <div className="flex items-center justify-center gap-3">
                                    <h2 className={`text-6xl md:text-7xl font-black tracking-tighter transition-colors duration-1000 ${Number(resultData.dsrScore) > 40 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                                        {resultData.dsrScore}<span className="text-3xl ml-1 text-gray-400">%</span>
                                    </h2>
                                    <div className={`px-4 py-2 rounded-2xl text-[11px] font-black shadow-sm ${getGaugeColor(Number(resultData.dsrScore))} text-white animate-pulse`}>
                                        {getStatusText(Number(resultData.dsrScore)).label} {getStatusText(Number(resultData.dsrScore)).emoji}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-400 mt-5 leading-relaxed tracking-tight break-keep">
                                    {getStatusText(Number(resultData.dsrScore)).desc}. DSR {resultData.dsrScore}%는 규제 한도(40%) 기준 {Number(resultData.dsrScore) > 40 ? '초과' : '이내'} 상태입니다.
                                </p>
                            </div>

                            <div className="space-y-3 mb-10 max-w-xl mx-auto">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 px-1 uppercase tracking-widest">
                                    <span>SAFE</span>
                                    <span className="text-emerald-500">LIMIT (40%)</span>
                                    <span>RISK</span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden border border-gray-50 dark:border-gray-800 relative shadow-inner">
                                    <div className="absolute left-[40%] top-0 w-1 h-full bg-emerald-500/30 z-10"></div>
                                    <div className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${getGaugeColor(Number(resultData.dsrScore))}`} style={{ width: `${Math.min(100, Number(resultData.dsrScore))}%` }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-7 bg-gray-50/50 dark:bg-gray-900/30 rounded-[28px] border border-gray-100 dark:border-gray-800 group hover:border-emerald-500/30 transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 scale-100 group-hover:scale-125 transition-transform"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">총 연 원리금 상환액</span>
                                    </div>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{formatNumber(resultData.totalAnnualRepayment)}<span className="text-sm ml-1 text-gray-400">원</span></p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-tight">월 {formatNumber(resultData.totalAnnualRepayment / 12)}원 상환 지출</p>
                                </div>
                                <div className="p-7 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[28px] border border-emerald-100/50 dark:border-emerald-900/30 group hover:scale-[1.02] transition-all shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">추가 대출 한도 (DSR 40%)</span>
                                    </div>
                                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">{formatNumber(resultData.maxAdditionalLoan)}<span className="text-sm ml-1 text-emerald-400/60 font-bold uppercase">원</span></p>
                                    <p className="text-[10px] font-bold text-emerald-500/60 mt-2 tracking-tight">한도 꽉 채울 시 최대 추가 가능 금액</p>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[24px] border border-dashed border-gray-200 dark:border-gray-700/50 inline-block w-full group">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl group-hover:rotate-12 transition-transform drop-shadow-sm">🌋</span>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-gray-700 dark:text-gray-300 tracking-tight uppercase leading-none">스트레스 DSR 분석 정보</span>
                                        <p className="text-[11px] text-gray-400 font-bold leading-relaxed mt-1 tracking-tight">
                                            {resultData.isMetropolitan ? '수도권' : '비수도권'} / {resultData.interestType === 'VARIABLE' ? '변동형' : resultData.interestType === 'MIXED' ? '혼합형' : '주기형'} 기준 가산금리 <span className="text-red-500 font-black">+{resultData.stressRate}%</span>가 반영되었습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle={`[📊 DSR 분석 결과] 내 위험도는 ${getStatusText(Number(resultData.dsrScore)).label}입니다.`}
                                shareDescription={`총 부채 상환율 ${resultData.dsrScore}%! `}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DsrCalculator;
