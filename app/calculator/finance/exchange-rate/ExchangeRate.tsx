"use client";

import React, { useState, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type TabType = "exchange" | "simulation";
type Currency =
    | "KRW" | "USD" | "JPY" | "EUR" | "CNY"
    | "GBP" | "CHF" | "CAD" | "AUD" | "HKD"
    | "SGD" | "THB" | "VND" | "TWD" | "PHP"
    | "IDR" | "MYR";

const CURRENCY_INFO: Record<Currency, { name: string; symbol: string }> = {
    KRW: { name: "대한민국 원", symbol: "₩" },
    USD: { name: "미국 달러", symbol: "$" },
    JPY: { name: "일본 엔", symbol: "¥" },
    EUR: { name: "유로", symbol: "€" },
    CNY: { name: "중국 위안", symbol: "¥" },
    GBP: { name: "영국 파운드", symbol: "£" },
    CHF: { name: "스위스 프랑", symbol: "Fr" },
    CAD: { name: "캐나다 달러", symbol: "$" },
    AUD: { name: "호주 달러", symbol: "$" },
    HKD: { name: "홍콩 달러", symbol: "$" },
    SGD: { name: "싱가포르 달러", symbol: "$" },
    THB: { name: "태국 바트", symbol: "฿" },
    VND: { name: "베트남 동", symbol: "₫" },
    TWD: { name: "대만 달러", symbol: "$" },
    PHP: { name: "필리핀 페소", symbol: "₱" },
    IDR: { name: "인도네시아 루피아", symbol: "Rp" },
    MYR: { name: "말레이시아 링깃", symbol: "RM" },
};

export default function ExchangeRate() {
    const [activeTab, setActiveTab] = useState<TabType>("exchange");

    // States for data fetching
    const [isLoading, setIsLoading] = useState(true);
    const [eximData, setEximData] = useState<any[]>([]);
    const [globalRates, setGlobalRates] = useState<Record<string, number>>({});

    // States for Exchange Mode
    const [fromCurrency, setFromCurrency] = useState<Currency>("KRW");
    const [toCurrency, setToCurrency] = useState<Currency>("USD");
    const [amountStr, setAmountStr] = useState<string>("");
    const [rateType, setRateType] = useState<"DEAL" | "CASH_BUY" | "CASH_SELL" | "TT_SEND" | "TT_RECV">("DEAL");
    const [discountRate, setDiscountRate] = useState<number>(0);

    // States for Simulation Mode
    const [simFromCurrency, setSimFromCurrency] = useState<Currency>("KRW");
    const [simToCurrency, setSimToCurrency] = useState<Currency>("USD");
    const [simAmountStr, setSimAmountStr] = useState<string>("");
    const [simRateChangeStr, setSimRateChangeStr] = useState<string>("10");

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [calculatedResult, setCalculatedResult] = useState<any>(null);

    const resultRef = useCalculatorScroll(calculatedResult !== null);

    // Fetch API Data on mount
    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            try {
                const [eximRes, globalRes] = await Promise.all([
                    fetch("/api/exchange-rate/koreaexim"),
                    fetch("/api/exchange-rate/exchangerate?base=USD")
                ]);

                if (eximRes.ok) {
                    const eximJson = await eximRes.json();
                    if (eximJson.success) setEximData(eximJson.rates);
                }

                if (globalRes.ok) {
                    const globalJson = await globalRes.json();
                    if (globalJson.result === "success") setGlobalRates(globalJson.conversion_rates);
                }
            } catch (error) {
                console.error("Failed to fetch rates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRates();
    }, []);

    // Helper: format numbers
    const formatNumber = (num: number) => num.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
    const parseNumber = (str: string) => Number(str.replace(/,/g, ""));

    const handleAmountChange = (val: string, setter: (v: string) => void, fieldId: string) => {
        const raw = val.replace(/[^0-9]/g, "");
        if (raw) {
            setter(Number(raw).toLocaleString());
            setErrors(prev => {
                const next = new Set(prev);
                next.delete(fieldId);
                return next;
            });
            if (errors.size <= 1) setErrorMessage("");
        } else {
            setter("");
        }
        setCalculatedResult(null);
    };

    // Extract EXIM data correctly
    const getEximRate = (currency: Currency) => {
        if (currency === "KRW") return null;
        const target = currency === "JPY" ? "JPY(100)" : (currency === "IDR" ? "IDR(100)" : currency);
        const data = eximData.find(d => d.CUR_UNIT === target);
        if (!data) return null;

        const parseEximNum = (str: string) => parseFloat(str.replace(/,/g, ""));
        return {
            deal: parseEximNum(data.DEAL_BAS_R),
            tts: parseEximNum(data.TTS), // 송금 보낼때
            ttb: parseEximNum(data.TTB)  // 송금 받을때
        };
    };

    // Calculate applied rate
    const getAppliedRate = (from: Currency, to: Currency, type: string, discount: number) => {
        // Same currency
        if (from === to) return 1;

        // Using EXIM if KRW is involved
        if (from === "KRW" || to === "KRW") {
            const foreignCurr = from === "KRW" ? to : from;
            const rates = getEximRate(foreignCurr);

            if (rates) {
                const dealRate = rates.deal;
                let appliedBase = dealRate;

                // 수출입은행 API는 송금환율(TT)만 제공하므로, 현찰 환율은 보통 매매기준율의 1.75% 스프레드로 계산
                const cashSpread = dealRate * 0.0175;
                const cashBuy = dealRate + cashSpread;
                const cashSell = dealRate - cashSpread;

                if (type === "CASH_BUY") appliedBase = cashBuy;
                else if (type === "CASH_SELL") appliedBase = cashSell;
                else if (type === "TT_SEND") appliedBase = rates.tts;
                else if (type === "TT_RECV") appliedBase = rates.ttb;

                // Apply discount to spread
                const spread = Math.abs(appliedBase - dealRate);
                const discountedSpread = spread * (1 - (discount / 100));

                let finalRate = appliedBase;
                if (appliedBase > dealRate) {
                    finalRate = dealRate + discountedSpread;
                } else if (appliedBase < dealRate) {
                    finalRate = dealRate - discountedSpread;
                }

                const isUnit100 = foreignCurr === "JPY" || foreignCurr === "IDR";

                // 환율은 1 외화 = N 원화 기준
                if (from === "KRW") {
                    return isUnit100 ? 100 / finalRate : 1 / finalRate;
                } else {
                    return isUnit100 ? finalRate / 100 : finalRate;
                }
            }
        }

        // Global Cross Rate using ExchangeRate-API (Fallback / Cross)
        if (globalRates[from] && globalRates[to]) {
            const rateUSDToFrom = globalRates[from];
            const rateUSDToTo = globalRates[to];
            return rateUSDToTo / rateUSDToFrom;
        }

        return 0; // Default fallback
    };

    // Calculate Handler
    const handleCalculate = () => {
        const newErrors = new Set<string>();

        if (activeTab === "exchange") {
            const amount = parseNumber(amountStr);
            if (!amountStr || amount <= 0) {
                newErrors.add("amount");
            }

            if (newErrors.size > 0) {
                setErrors(newErrors);
                setErrorMessage("필수 항목을 모두 입력해주세요.");
                setCalculatedResult(null);
                return;
            }

            setErrorMessage("");
            setErrors(new Set());

            const multiplier = getAppliedRate(fromCurrency, toCurrency, rateType, discountRate);
            if (!multiplier) {
                setErrorMessage("환율 정보를 불러올 수 없습니다. 다시 시도해주세요.");
                return;
            }

            const resultAmount = amount * multiplier;

            // 기준 환율 표시용 (1단위 당)
            let displayBaseRate = 0;
            if (fromCurrency === "KRW") displayBaseRate = 1 / multiplier;
            else displayBaseRate = multiplier;

            const isToUnit100 = toCurrency === "JPY" || toCurrency === "IDR";
            const isFromUnit100 = fromCurrency === "JPY" || fromCurrency === "IDR";

            if (isToUnit100 && fromCurrency === "KRW") displayBaseRate = 100 / multiplier;
            if (isFromUnit100 && toCurrency === "KRW") displayBaseRate = multiplier * 100;

            setCalculatedResult({
                mode: "exchange",
                amount,
                resultAmount,
                displayBaseRate
            });

        } else {
            const amount = parseNumber(simAmountStr);
            const rateChange = parseFloat(simRateChangeStr);

            if (!simAmountStr || amount <= 0) newErrors.add("simAmount");
            if (!simRateChangeStr || isNaN(rateChange)) newErrors.add("simRateChange");

            if (newErrors.size > 0) {
                setErrors(newErrors);
                setErrorMessage("필수 항목을 모두 입력해주세요.");
                setCalculatedResult(null);
                return;
            }

            setErrorMessage("");
            setErrors(new Set());

            const currentMultiplier = getAppliedRate(simFromCurrency, simToCurrency, "DEAL", 0);
            if (!currentMultiplier) {
                setErrorMessage("환율 정보를 불러올 수 없습니다.");
                return;
            }

            const currentResult = amount * currentMultiplier;
            const newMultiplier = currentMultiplier * (1 + (rateChange / 100));
            const newResult = amount * newMultiplier;
            const difference = newResult - currentResult;

            setCalculatedResult({
                mode: "simulation",
                amount,
                currentResult,
                newResult,
                difference,
                rateChange
            });
        }
    };

    const handleReset = () => {
        setAmountStr("");
        setSimAmountStr("");
        setSimRateChangeStr("10");
        setErrorMessage("");
        setErrors(new Set());
        setCalculatedResult(null);
    };

    // Share text generator
    const generateShareText = () => {
        if (!calculatedResult) return "JIKO 환율 계산기로 쉽고 빠른 실시간 환전 및 환율 시뮬레이션을 경험해보세요.";

        if (calculatedResult.mode === "exchange") {
            return `[🌏 환전 계산 - 환율 계산기 결과]\n${formatNumber(calculatedResult.amount)} ${CURRENCY_INFO[fromCurrency].symbol} -> ${formatNumber(calculatedResult.resultAmount)} ${CURRENCY_INFO[toCurrency].symbol}\n(적용환율 : ${formatNumber(calculatedResult.displayBaseRate)})\n\n📌JIKO 환율 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/finance/exchange-rate`;
        } else {
            const updown = calculatedResult.rateChange > 0 ? "상승" : "하락";
            return `[🌏 환율 시뮬레이션 - 환율 계산기 결과]\n환율이 ${Math.abs(calculatedResult.rateChange)}% ${updown}하면?\n기존: ${formatNumber(calculatedResult.currentResult)} ${CURRENCY_INFO[simToCurrency].symbol}\n예상 : ${formatNumber(calculatedResult.newResult)} ${CURRENCY_INFO[simToCurrency].symbol}\n(${formatNumber(Math.abs(calculatedResult.difference))} 차이)\n\n📌JIKO 환율 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/finance/exchange-rate`;
        }
    };

    // Currency Switcher
    const switchCurrencies = () => {
        if (activeTab === "exchange") {
            setFromCurrency(toCurrency);
            setToCurrency(fromCurrency);
            setCalculatedResult(null);
        } else {
            setSimFromCurrency(simToCurrency);
            setSimToCurrency(simFromCurrency);
            setCalculatedResult(null);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                {/* 1.2 카테고리 메뉴명 */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full font-semibold shadow-sm border border-gray-100 dark:border-gray-700">🌏 환율 계산기</span>
                    </div>
                </div>

                {/* 1.3 탭 구조 (복리 계산기 디자인 적용) */}
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-6 flex overflow-x-auto hide-scrollbar gap-1">
                    <button
                        className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "exchange" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => { setActiveTab("exchange"); setErrorMessage(""); setErrors(new Set()); setCalculatedResult(null); }}
                    >
                        💱 환전 계산
                    </button>
                    <button
                        className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === "simulation" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        onClick={() => { setActiveTab("simulation"); setErrorMessage(""); setErrors(new Set()); setCalculatedResult(null); }}
                    >
                        📈 환율 시뮬레이션
                    </button>
                </div>

                {/* 1.4 입력 데이터 영역 카드 세션 */}
                <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    {isLoading && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-xl flex items-center justify-center animate-pulse">
                            <span className="mr-2">🔄</span> 최신 환율 정보를 불러오는 중입니다...
                        </div>
                    )}

                    {activeTab === "exchange" ? (
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span className="text-2xl">💱</span> 환전 계산 모드
                            </h3>

                            <div className="space-y-4">
                                {/* 통화 선택 영역 */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">보내는 통화</label>
                                        <select
                                            className="w-full bg-transparent text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
                                            value={fromCurrency}
                                            onChange={(e) => { setFromCurrency(e.target.value as Currency); setCalculatedResult(null); }}
                                        >
                                            {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                                                <option key={`from-${code}`} value={code} className="text-black">{code} ({info.name})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button onClick={switchCurrencies} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95 border border-gray-200 dark:border-gray-600">
                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>

                                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">받는 통화</label>
                                        <select
                                            className="w-full bg-transparent text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
                                            value={toCurrency}
                                            onChange={(e) => { setToCurrency(e.target.value as Currency); setCalculatedResult(null); }}
                                        >
                                            {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                                                <option key={`to-${code}`} value={code} className="text-black">{code} ({info.name})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 금액 입력 영역 */}
                                <div>
                                    <label className={`block text-sm font-bold mb-2 transition-colors ${errors.has("amount") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                                        환전할 금액 ({fromCurrency}) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className={`font-bold ${errors.has("amount") ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>{CURRENCY_INFO[fromCurrency].symbol}</span>
                                        </div>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="금액을 입력하세요"
                                            className={`w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border rounded-2xl text-lg font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${errors.has("amount") ? "border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-amber-500"}`}
                                            value={amountStr}
                                            onChange={(e) => handleAmountChange(e.target.value, setAmountStr, "amount")}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                                        />
                                    </div>
                                </div>

                                {/* 환율 기준 및 우대율 (원화 포함일 때만 유의미하게 노출) */}
                                {(fromCurrency === "KRW" || toCurrency === "KRW") && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">환율 기준</label>
                                            <select
                                                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500"
                                                value={rateType}
                                                onChange={(e) => { setRateType(e.target.value as any); setCalculatedResult(null); }}
                                            >
                                                <option value="DEAL">매매기준율 (도매가)</option>
                                                <option value="CASH_BUY">현찰 살 때 (지폐 살때)</option>
                                                <option value="CASH_SELL">현찰 팔 때 (지폐 팔때)</option>
                                                <option value="TT_SEND">송금 보낼 때 (전신환)</option>
                                                <option value="TT_RECV">송금 받을 때 (전신환)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">환율 우대 (수수료 할인)</label>
                                            <select
                                                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500"
                                                value={discountRate}
                                                onChange={(e) => { setDiscountRate(Number(e.target.value)); setCalculatedResult(null); }}
                                                disabled={rateType === "DEAL"}
                                            >
                                                <option value={0}>우대 없음</option>
                                                <option value={30}>30% 우대</option>
                                                <option value={50}>50% 우대</option>
                                                <option value={80}>80% 우대</option>
                                                <option value={90}>90% 우대</option>
                                                <option value={100}>100% (수수료 면제)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span className="text-2xl">📈</span> 환율 시뮬레이션 모드
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">기준 통화</label>
                                        <select
                                            className="w-full bg-transparent text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
                                            value={simFromCurrency}
                                            onChange={(e) => { setSimFromCurrency(e.target.value as Currency); setCalculatedResult(null); }}
                                        >
                                            {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                                                <option key={`s-from-${code}`} value={code} className="text-black">{code} ({info.name})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={switchCurrencies} className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95 border border-gray-200 dark:border-gray-600">
                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>
                                    <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">타겟 통화</label>
                                        <select
                                            className="w-full bg-transparent text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none cursor-pointer"
                                            value={simToCurrency}
                                            onChange={(e) => { setSimToCurrency(e.target.value as Currency); setCalculatedResult(null); }}
                                        >
                                            {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                                                <option key={`s-to-${code}`} value={code} className="text-black">{code} ({info.name})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-bold mb-2 transition-colors ${errors.has("simAmount") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                                            환전 예정 금액 ({simFromCurrency}) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="예: 1,000"
                                                className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border rounded-2xl text-lg font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${errors.has("simAmount") ? "border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-amber-500"}`}
                                                value={simAmountStr}
                                                onChange={(e) => handleAmountChange(e.target.value, setSimAmountStr, "simAmount")}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-bold mb-2 transition-colors ${errors.has("simRateChange") ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                                            환율 예상 변동률 (%) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="예: 10"
                                                className={`w-full pl-4 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border rounded-2xl text-lg font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all ${errors.has("simRateChange") ? "border-red-500" : "border-gray-200 dark:border-gray-700 focus:border-amber-500"}`}
                                                value={simRateChangeStr}
                                                onChange={(e) => {
                                                    setSimRateChangeStr(e.target.value);
                                                    setErrors(prev => { const next = new Set(prev); next.delete("simRateChange"); return next; });
                                                    if (errors.size <= 1) setErrorMessage("");
                                                    setCalculatedResult(null);
                                                }}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className={`font-bold ${errors.has("simRateChange") ? "text-red-500" : "text-gray-500"}`}>%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 제어 버튼 및 에러 메시지 (복리 계산기 패턴) */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                        <CalculatorButtons
                            onReset={handleReset}
                            onCalculate={handleCalculate}
                            calculateText="계산하기"
                        />
                        {errorMessage && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800/30 animate-pulse flex items-center justify-center gap-2">
                                <span>🚨</span> {errorMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* 1.5 출력 데이터 영역 카드 세션 */}
                {calculatedResult && (
                    <div ref={resultRef} className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden animate-fade-slide-up space-y-8">
                        {/* 카드 상단 테두리 그라데이션 */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

                        <div className="text-center">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                                <span className="text-amber-500">✨</span> 계산 결과
                            </h2>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                {calculatedResult.mode === "exchange" ? "최종 환전 예상 금액" : "환율 변동에 따른 예상 결과"}
                            </p>
                        </div>

                        {calculatedResult.mode === "exchange" ? (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-500 to-orange-700 rounded-[24px] text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute -right-10 -top-10 text-9xl opacity-10">💰</div>
                                    <div className="text-amber-100 font-bold mb-2 opacity-90 text-center">최종 환전 수취액</div>
                                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-center">
                                        <span className="text-amber-200 mr-2">{CURRENCY_INFO[toCurrency as Currency].symbol}</span>
                                        {formatNumber(calculatedResult.resultAmount)}
                                    </div>
                                </div>
                                <div className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 py-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    적용 환율 : {fromCurrency === "KRW" ? "1 외화 당" : "1 외화 당"} {formatNumber(calculatedResult.displayBaseRate)} {CURRENCY_INFO[fromCurrency === "KRW" ? toCurrency : "KRW"].symbol}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 text-center">현재 환율 기준</div>
                                        <div className="text-2xl font-black text-gray-700 dark:text-gray-200">
                                            {formatNumber(calculatedResult.currentResult)} {CURRENCY_INFO[simToCurrency as Currency].symbol}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-700 border-2 rounded-2xl shadow-sm text-center relative overflow-hidden text-white">
                                        <div className="absolute top-1 right-2 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-bl-lg">예상</div>
                                        <div className="text-amber-100 font-bold mb-2 opacity-90 text-center text-xs">예상 환율 적용 시</div>
                                        <div className="text-3xl font-black tracking-tight">
                                            {formatNumber(calculatedResult.newResult)} {CURRENCY_INFO[simToCurrency as Currency].symbol}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-center font-black p-5 rounded-2xl shadow-sm border ${calculatedResult.difference > 0 ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30" : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"}`}>
                                    {Math.abs(calculatedResult.rateChange)}% {calculatedResult.rateChange > 0 ? "상승" : "하락"} 시, 약 {formatNumber(Math.abs(calculatedResult.difference))} {CURRENCY_INFO[simToCurrency as Currency].symbol} {calculatedResult.difference > 0 ? "이득" : "손해"} 발생
                                </div>
                            </div>
                        )}

                        {/* 공유 / 복사 버튼 */}
                        <div className="border-gray-100 dark:border-gray-700/50">
                            <CalculatorActions
                                onCopy={async () => {
                                    await navigator.clipboard.writeText(generateShareText());
                                }}
                                shareTitle=""
                                shareDescription={generateShareText()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
