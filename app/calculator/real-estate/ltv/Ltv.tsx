"use client";

import { useState, useCallback, useMemo } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import CalculatorTabs from "@/app/calculator/components/CalculatorTabs";

type LoanPurpose = "PURCHASE" | "STABILIZATION";
type RegionType = "REGULATED" | "METRO_OVER" | "METRO_CITY" | "OTHERS";
type OwnershipType = "FIRST_HOME" | "NONE" | "ONE" | "TWO_PLUS";

const LtvCalculator = () => {
    const realEstateTabs = [
        { label: "DSR 계산기", href: "/calculator/real-estate/dsr" },
        { label: "신DTI 계산기", href: "/calculator/real-estate/new-dti" },
        { label: "DTI 계산기", href: "/calculator/real-estate/dti" },
        { label: "LTV 계산기", href: "/calculator/real-estate/ltv" },
    ];

    // 입력 상태
    const [purpose, setPurpose] = useState<LoanPurpose>("PURCHASE");
    const [region, setRegion] = useState<RegionType>("METRO_OVER");
    const [ownership, setOwnership] = useState<OwnershipType>("NONE");
    const [housePrice, setHousePrice] = useState<string>("500000000"); // 5억 기본값
    const [salary, setSalary] = useState<string>("50000000"); // DSR 연동용 연소득
    const [existingLoan, setExistingLoan] = useState<string>("0"); // 기존 대출(생활안정자급 시)

    const [calculated, setCalculated] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [shakeField, setShakeField] = useState<string | null>(null);

    const resultRef = useCalculatorScroll(calculated);

    const formatNumber = (val: number) => Math.round(val).toLocaleString();

    const calculateLTV = useCallback(() => {
        const price = Number(housePrice);
        const sal = Number(salary);
        
        let newErrors = new Set<string>();
        if (!price || price <= 0) newErrors.add("housePrice");
        
        if (newErrors.size > 0) {
            setErrorMessage("주택 시세를 정확히 입력해 주세요.");
            setErrors(newErrors);
            setShakeField(Array.from(newErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        setErrorMessage("");
        setErrors(new Set());

        // 1. LTV 기본 비율 산정 (규제 기반)
        let ltvRatio = 0.7; // 비규제 무주택 기본

        if (ownership === "FIRST_HOME") {
            ltvRatio = 0.8;
        } else if (region === "REGULATED") {
            if (ownership === "NONE") ltvRatio = 0.5;
            else if (ownership === "ONE") ltvRatio = 0.3; // 다주택자 규제 지역 한심
            else ltvRatio = 0; // 2주택 이상 규제지역 금지
        } else {
            if (ownership === "ONE") ltvRatio = 0.6;
            else if (ownership === "TWO_PLUS") ltvRatio = 0.5;
        }

        // 2. 방공제액 결정 (지역별)
        let bangGongJe = 0;
        if (region === "REGULATED") bangGongJe = 55000000; // 서울 가정
        else if (region === "METRO_OVER") bangGongJe = 48000000;
        else if (region === "METRO_CITY") bangGongJe = 28000000;
        else bangGongJe = 25000000;

        // 3. 한도액 산출
        let calcLimit = price * ltvRatio - bangGongJe;

        // 생애최초 한도 6억 제한 예외처리
        if (ownership === "FIRST_HOME" && calcLimit > 600000000) {
            calcLimit = 600000000;
        }

        if (calcLimit < 0) calcLimit = 0;

        // 4. DSR 간이 경고 (DSR 40% 기준 역산 예시 한도)
        // (간단히 연소득의 7~8배 정도로 안전선 표시)
        const safeDsrLimit = sal * 7;

        setResultData({
            ltvRatio,
            calcLimit,
            bangGongJe,
            safeDsrLimit,
            isLimitedByDsr: calcLimit > safeDsrLimit
        });
        setCalculated(true);
    }, [housePrice, salary, region, ownership, purpose]);

    const handleReset = () => {
        setPurpose("PURCHASE");
        setRegion("METRO_OVER");
        setOwnership("NONE");
        setHousePrice("");
        setSalary("");
        setCalculated(false);
        setResultData(null);
        setErrorMessage("");
        setErrors(new Set());
        setShakeField(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCopy = async () => {
        if (!resultData) return;
        const text = `[🏠 LTV 계산 결과]\n주택 시세 : ${formatNumber(Number(housePrice))}원\n최종 예상 한도 : ${formatNumber(resultData.calcLimit)}원 (LTV ${resultData.ltvRatio * 100}%)\n\n📌 JIKO LTV 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/real-estate/ltv`;
        await navigator.clipboard.writeText(text);
    };

    const amountButtons = [1000000, 5000000, 10000000, 50000000, 100000000, 500000000];
    const formatBtnLabel = (val: number) => {
        if (val >= 100000000) return `${val / 100000000}억`;
        if (val >= 10000000) return `${val / 10000000}천`;
        if (val >= 1000000) return `${val / 1000000}백`;
        return `${val / 10000}`;
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 pt-8 pb-8 ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>
                
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-semibold tracking-tight">📊 LTV 계산기</div>
                </div>

                <CalculatorTabs tabs={realEstateTabs} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    
                    {/* 대출 목적 선택 */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">대출 목적</label>
                        <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-2xl gap-1">
                            {[{ id: "PURCHASE", label: "주택 구입 자금" }, { id: "STABILIZATION", label: "생활 안정 자금" }].map(p => (
                                <button key={p.id} onClick={() => {setPurpose(p.id as any); setCalculated(false);}} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${purpose === p.id ? "bg-white dark:bg-gray-800 text-amber-500 shadow-sm" : "text-gray-400"}`}>{p.label}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 지역 선택 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">주택 소재 지역</label>
                            <select value={region} onChange={(e) => {setRegion(e.target.value as any); setCalculated(false);}} className="w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-amber-500 outline-none">
                                <option value="REGULATED">규제 지역 (강남3구/용산)</option>
                                <option value="METRO_OVER">수도권 과밀억제권역</option>
                                <option value="METRO_CITY">광역시 / 특례시</option>
                                <option value="OTHERS">기타 지역 (비규제)</option>
                            </select>
                        </div>
                        {/* 주택수 선택 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">나의 주택 수</label>
                            <select value={ownership} onChange={(e) => {setOwnership(e.target.value as any); setCalculated(false);}} className="w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-amber-500 outline-none">
                                <option value="FIRST_HOME">무주택 (생애최초)</option>
                                <option value="NONE">무주택 (일반)</option>
                                <option value="ONE">1주택 (처분조건부 포함)</option>
                                <option value="TWO_PLUS">2주택 이상 (다주택)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 주택 시세 */}
                        <div className={`space-y-3 ${shakeField === 'housePrice' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">주택 시세 (매매가/KB시세)</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={housePrice ? Number(housePrice).toLocaleString() : ""}
                                    onChange={(e) => { setHousePrice(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false); setErrors(new Set()); }}
                                    className={`w-full h-16 pl-12 pr-12 text-2xl font-bold rounded-2xl transition-all text-right ${errors.has('housePrice') ? 'border-2 border-red-500 bg-red-50 dark:bg-red-900/10 focus:border-red-500' : 'bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 focus:border-amber-500'}`}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 font-mono">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setHousePrice(""); setCalculated(false); setErrors(new Set());}} className="px-3 py-1.5 text-xs font-black bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => {setHousePrice(prev => (Number(prev) + v).toString()); setCalculated(false); setErrors(new Set());}} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-amber-50 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-xl transition-all">+{formatBtnLabel(v)}</button>
                                ))}
                            </div>
                        </div>

                        {/* 연소득 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">나의 연소득 (세전)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={salary ? Number(salary).toLocaleString() : ""}
                                    onChange={(e) => {setSalary(e.target.value.replace(/[^0-9]/g, "")); setCalculated(false);}}
                                    className="w-full h-14 pl-10 pr-10 text-xl font-bold bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-amber-500 text-right"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 font-mono">₩</span>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">원</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                <button onClick={() => {setSalary(""); setCalculated(false);}} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100">C</button>
                                {amountButtons.map(v => (
                                    <button key={v} onClick={() => {setSalary(prev => (Number(prev) + v).toString()); setCalculated(false);}} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-amber-50 text-gray-600 dark:text-gray-300 hover:text-amber-600 rounded-xl transition-all active:scale-95">+{formatBtnLabel(v)}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 dark:border-gray-700 text-center">
                        <CalculatorButtons onCalculate={calculateLTV} onReset={handleReset} />
                        {errorMessage && (
                            <div className="w-full mt-4 bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold animate-pulse">🚨 {errorMessage}</div>
                        )}
                    </div>
                </div>

                {calculated && resultData && (
                    <div ref={resultRef} id="result-section" className={`mt-8 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>

                            <div className="text-center mb-10">
                                <p className="text-[12px] font-black text-gray-400 mb-2 uppercase tracking-widest">부동산 담보 가치 분석 결과</p>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
                                    {formatNumber(resultData.calcLimit)}<span className="text-2xl ml-1 text-gray-400 uppercase">원</span>
                                </h2>
                                <p className="text-sm font-bold text-amber-500 mt-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 inline-block rounded-xl">
                                    {ownership === "FIRST_HOME" ? "🏠 생애최초 혜택 적용" : "⚖️ 규제 지역 한도 준수"} (LTV {resultData.ltvRatio * 100}%)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">방공제(소액임차보증금) 차감</span>
                                    <p className="text-2xl font-black text-rose-500">-{formatNumber(resultData.bangGongJe)}<span className="text-xs ml-1">원</span></p>
                                    <p className="text-[10px] text-gray-500 mt-1">{region === "REGULATED" ? "서울 지역 기준 차감액" : "해당 지역 최우선 변제금 반영"}</p>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-700">
                                    <span className="text-[10px] font-black text-blue-500 uppercase block mb-1">DSR 예상 안전선 (연소득 7배)</span>
                                    <p className="text-2xl font-black text-blue-600">{formatNumber(resultData.safeDsrLimit)}<span className="text-xs ml-1">원</span></p>
                                    <p className="text-[10px] text-blue-400 mt-1">이 금액 초과 시 승인이 어려울 수 있습니다</p>
                                </div>
                            </div>

                            {resultData.isLimitedByDsr && (
                                <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 flex items-start gap-3">
                                    <span className="text-xl">⚠️</span>
                                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 leading-relaxed">
                                        LTV 규제상 한도는 높으나, <span className="underline underline-offset-2">입력하신 연소득 대비 DSR 한도가 부족할 것으로 예측</span>됩니다. 정확한 한도는 JIKO DSR 계산기 탭에서 보수적으로 다시 점검해 보세요.
                                    </p>
                                </div>
                            )}

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle="[🏠 LTV 계산 결과]"
                                shareDescription={`${formatNumber(resultData.calcLimit)}원 대출 가능 확률이 높습니다.`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LtvCalculator;
