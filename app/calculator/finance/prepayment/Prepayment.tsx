"use client";

import React, { useState, useEffect } from "react";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import { numberToKorean } from "@/app/utils/financeUtils";

type CalcType = "period" | "date";

const PRESETS = [
    { name: "시중은행 표준 (1.2%)", rate: 1.2, desc: "KB, 신한, 하나, 우리 등 주담대 표준" },
    { name: "시중은행 신용 (0.7%)", rate: 0.7, desc: "일반 신용대출 평균" },
    { name: "카카오/토스 (면제)", rate: 0.0, desc: "인터넷 은행 중도상환 무료" },
];

export default function Prepayment() {
    // 1. 입력 데이터 상태
    const [amount, setAmount] = useState<string>(""); // 상환 금액
    const [rate, setRate] = useState<string>("1.2"); // 수수료율
    const [loanRate, setLoanRate] = useState<string>("5.0"); // 대출 금리 (이자 절감 분석용)
    const [calcType, setCalcType] = useState<CalcType>("date"); // 계산 구분

    // 기간 모드
    const [loanTerm, setLoanTerm] = useState<string>("36");
    const [remainingTerm, setRemainingTerm] = useState<string>("12");
    const [exemptionPeriod, setExemptionPeriod] = useState<string>("0"); // 면제 기간

    // 날짜 모드
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [prepayDate, setPrepayDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>(new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0]);

    // 결과 상태
    const [result, setResult] = useState<{
        penalty: number;
        interestSaved: number;
        totalBenefit: number;
        elapsedDays: number;
        remainingDays: number;
        isExempt: boolean;
    } | null>(null);

    const [scrollTrigger, setScrollTrigger] = useState(0);
    const resultRef = useCalculatorScroll(scrollTrigger);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [copied, setCopied] = useState(false);

    // 단위 버튼 도우미
    const addAmount = (val: number) => {
        const current = amount === "" ? 0 : parseInt(amount.replace(/,/g, ''));
        setAmount((current + val).toLocaleString());
        setErrors(prev => { const next = new Set(prev); next.delete("amount"); return next; });
        setErrorMessage("");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setAmount(val ? parseInt(val).toLocaleString() : "");
        setErrors(prev => { const next = new Set(prev); next.delete("amount"); return next; });
        setErrorMessage("");
    };

    // 초기화
    const handleReset = () => {
        setAmount("");
        setRate("1.2");
        setLoanRate("5.0");
        setCalcType("date");
        setExemptionPeriod("0");
        setLoanTerm("36");
        setRemainingTerm("12");
        setStartDate(new Date().toISOString().split('T')[0]);
        setPrepayDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0]);
        setResult(null);
        setErrors(new Set());
        setErrorMessage("");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    };

    // 계산 로직
    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!amount || amount === "0") newErrors.add("amount");
        if (!rate || isNaN(parseFloat(rate))) newErrors.add("rate");
        if (!loanRate || isNaN(parseFloat(loanRate))) newErrors.add("loanRate");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            return;
        }
        
        setErrorMessage("");
        const numAmount = parseInt(amount.replace(/,/g, ''));
        const numRate = parseFloat(rate);
        const numLoanRate = parseFloat(loanRate);

        let penalty = 0;
        let elapsedDays = 0;
        let remainingDays = 0;

        if (calcType === "date") {
            const start = new Date(startDate);
            const prepay = new Date(prepayDate);
            const end = new Date(endDate);

            elapsedDays = Math.ceil((prepay.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const fullPeriod = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            // 국내 대출 관행: 수수료 부과 기간은 최대 3년(1095일)
            const penaltyTargetDays = Math.min(fullPeriod, 1095);

            if (elapsedDays >= penaltyTargetDays) {
                penalty = 0;
            } else {
                remainingDays = penaltyTargetDays - elapsedDays;
                penalty = numAmount * (numRate / 100) * (remainingDays / penaltyTargetDays);
            }
            // 실제 남은 기간 (이자 절감 계산용)
            remainingDays = Math.ceil((end.getTime() - prepay.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            // 기간 모드 (단순화: 1개월 = 30일 가정)
            const numLoanTerm = parseInt(loanTerm);
            const numRemTerm = parseInt(remainingTerm);

            const penaltyPeriod = Math.min(numLoanTerm, 36); // 최대 3년
            const elapsedMonths = numLoanTerm - numRemTerm;

            if (elapsedMonths >= penaltyPeriod || numRemTerm <= 0) {
                penalty = 0;
            } else {
                const targetRemMonths = penaltyPeriod - elapsedMonths;
                penalty = numAmount * (numRate / 100) * (targetRemMonths / penaltyPeriod);
            }
            remainingDays = numRemTerm * 30;
            elapsedDays = elapsedMonths * 30;
        }

        // 이자 절감액 계산 (상환금액 * 금리 * 남은기간/365)
        const interestSaved = numAmount * (numLoanRate / 100) * (remainingDays / 365);

        setResult({
            penalty: Math.max(0, Math.floor(penalty)),
            interestSaved: Math.floor(interestSaved),
            totalBenefit: Math.floor(interestSaved - penalty),
            elapsedDays,
            remainingDays,
            isExempt: penalty <= 0
        });

        setScrollTrigger(prev => prev + 1);
    };

    const generateShareText = () => {
        if (!result) return "";
        return [
            `[💰 중도상환수수료 계산 결과]`,
            `상환금액 : ${amount}원`,
            `수수료율 : ${rate}%`,
            `\n예상 수수료 : ${result.penalty.toLocaleString()}원`,
            `이자 절감액 : ${result.interestSaved.toLocaleString()}원`,
            `최종 손익 : ${result.totalBenefit.toLocaleString()}원 ${result.totalBenefit > 0 ? '이득' : '손해'}`,
            `\n📌 JIKO 중도상환수수료 계산기에서 확인하기 :`,
            `https://jiko.kr/calculator/finance/prepayment`
        ].join("\n");
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateShareText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-safe w-full">
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold tracking-tight">💸 중도상환수수료 계산기</div>
            </div>

            {/* 입력 폼 카드 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-8 space-y-6">

                {/* 상환 금액 */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">상환 금액</label>
                        {amount && (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 animate-fade-in">
                                {numberToKorean(amount)} 원
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            value={amount}
                            onChange={handleAmountChange}
                            className={`w-full bg-gray-50 dark:bg-gray-900 border rounded-xl px-4 py-4 text-xl font-bold transition-all text-right pr-12 focus:outline-none ${
                                errors.has("amount") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-blue-600"
                            }`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">원</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3">
                        <button
                            onClick={() => {
                                setAmount("");
                                setResult(null);
                                setErrors(prev => { const next = new Set(prev); next.delete("amount"); return next; });
                            }}
                            className="px-3 py-2 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95"
                        >
                            C
                        </button>
                        {[100, 500, 1000, 5000, 10000, 50000].map((v) => (
                            <button
                                key={v}
                                onClick={() => addAmount(v * 10000)}
                                className="py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                            >
                                +{v >= 10000 ? `${v / 10000}억` : `${v}만`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 수수료율 */}
                    <div>
                        <label className={`block text-sm font-bold mb-3 transition-colors ${errors.has("rate") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>중도상환수수료율</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="1.2"
                                value={rate}
                                onChange={(e) => {
                                    setRate(e.target.value);
                                    setErrors(prev => { const next = new Set(prev); next.delete("rate"); return next; });
                                    setErrorMessage("");
                                }}
                                className={`w-full bg-gray-50 dark:bg-gray-900 border rounded-xl px-4 py-4 text-lg font-bold transition-all text-right pr-12 focus:outline-none ${
                                    errors.has("rate") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-blue-600"
                                }`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-3">
                            <div className="flex flex-wrap gap-2">
                                {PRESETS.map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => {
                                            setRate(p.rate.toString());
                                            setErrors(prev => { const next = new Set(prev); next.delete("rate"); return next; });
                                            setErrorMessage("");
                                        }}
                                        title={p.desc}
                                        className="px-3 py-1.5 text-[10px] font-bold border bg-blue-50 dark:bg-blue-900/20 border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400">✨ 시중은행은 보통 대출 후 3년까지 수수료를 부과하며, 이후에는 면제됩니다.</p>
                        </div>
                    </div>

                    {/* 대출 금리 */}
                    <div>
                        <label className={`block text-sm font-bold mb-3 transition-colors ${errors.has("loanRate") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>대출 금리</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="5.0"
                                value={loanRate}
                                onChange={(e) => {
                                    setLoanRate(e.target.value);
                                    setErrors(prev => { const next = new Set(prev); next.delete("loanRate"); return next; });
                                    setErrorMessage("");
                                }}
                                className={`w-full bg-gray-50 dark:bg-gray-900 border rounded-xl px-4 py-4 text-lg font-bold transition-all text-right pr-12 focus:outline-none ${
                                    errors.has("loanRate") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-blue-600"
                                }`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                        </div>
                    </div>
                </div>

                {/* 계산 방식 선택 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">계산 기준</label>
                    <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl">
                        <button
                            onClick={() => setCalcType("date")}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${calcType === "date" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-500"}`}
                        >
                            날짜로 계산 (정확함)
                        </button>
                        <button
                            onClick={() => setCalcType("period")}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${calcType === "period" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-500"}`}
                        >
                            기간으로 계산 (간편함)
                        </button>
                    </div>
                </div>

                {calcType === "date" ? (
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">대출 실행일</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">중도 상환일</label>
                                <input type="date" value={prepayDate} onChange={(e) => setPrepayDate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">대출 만기일</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">전체 대출 기간</label>
                                <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-blue-600 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <div className="flex gap-2 mt-2">
                                    {["6", "12", "24", "36"].map(m => (
                                        <button key={m} onClick={() => setLoanTerm(m)} className="flex-1 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-700 rounded-md border text-blue-600 border-gray-100 dark:border-gray-600 text-gray-500">{m}개월</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">남은 잔존 기간</label>
                                <input type="number" value={remainingTerm} onChange={(e) => setRemainingTerm(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-blue-600 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">수수료 면제 기간 (개월)</label>
                            <input type="number" value={exemptionPeriod} onChange={(e) => setExemptionPeriod(e.target.value)} placeholder="0" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-blue-600 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {["0", "3", "6", "9", "12", "18", "24"].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setExemptionPeriod(m)}
                                        className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${exemptionPeriod === m ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-500"}`}
                                    >
                                        {m}개월
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-6 space-y-4 border-t border-gray-100 dark:border-gray-700/50">
                    <CalculatorButtons onReset={handleReset} onCalculate={handleCalculate} />
                    {errorMessage && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800/30 animate-pulse flex items-center justify-center gap-2">
                            <span>🚨</span>
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            {/* 결과 영역 */}
            {result && (
                <div id="result-section" ref={resultRef} className="mt-12 animate-fade-slide-up space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>

                        <div className="mt-4">
                            <p className="text-gray-500 dark:text-gray-400 font-bold mb-2 tracking-tight">예상 중도상환수수료 금액</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className={`text-5xl md:text-6xl font-black ${result.isExempt ? "text-emerald-500" : "text-gray-900 dark:text-white"}`}>
                                    {result.penalty.toLocaleString()}
                                </span>
                                <span className="text-xl font-bold text-gray-400">원</span>
                            </div>
                            {result.isExempt && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-black">
                                    ✅ 수수료 면제 대상입니다!
                                </div>
                            )}
                        </div>

                        {/* 이자 절감 분석 (JIKO 차별화) */}
                        <div className={`mt-10 p-6 rounded-2xl border-2 border-dashed ${result.totalBenefit > 0 ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30" : "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30"}`}>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">💡 이자 절감 분석 결과</h3>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    남은 기간 동안 낼 이자 <span className="font-bold text-gray-800 dark:text-gray-100">{result.interestSaved.toLocaleString()}원</span> 중<br />
                                    수수료를 빼면 실질적으로 <span className={`font-black text-lg ${result.totalBenefit > 0 ? "text-blue-600" : "text-red-500"}`}>
                                        {Math.abs(result.totalBenefit).toLocaleString()}원 {result.totalBenefit > 0 ? "이득" : "손해"}
                                    </span> 입니다.
                                </p>
                                {result.totalBenefit > 0 && (
                                    <div className="mt-2 text-blue-600 dark:text-blue-400 text-xs font-black animate-bounce">
                                        지금 상환하시는 것을 추천드려요! 🚀
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] font-black text-gray-400 mb-1">대출 경과 일수</p>
                                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{result.elapsedDays}일</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] font-black text-gray-400 mb-1">수수료 부과 잔여일</p>
                                <p className="text-lg font-black text-gray-700 dark:text-gray-200">{result.isExempt ? 0 : result.remainingDays}일</p>
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
    );
}
