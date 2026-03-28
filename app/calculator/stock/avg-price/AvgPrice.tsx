"use client";

import { useState, useRef, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import ShareSheet from "@/app/calculator/components/ShareSheet";

const MAX_ROWS = 10;

interface Row {
    id: number;
    price: string;
    qty: string;
}

const createRow = (id: number): Row => ({ id, price: "", qty: "" });

// 수익률 기준 등급 (현재가 있을 때만)
const getGrade = (rate: number) => {
    if (rate >= 30) return { label: "주식 고수", emoji: "🏆", color: "text-yellow-500 dark:text-yellow-400" };
    if (rate >= 20) return { label: "주식 달인", emoji: "👑", color: "text-amber-500 dark:text-amber-400" };
    if (rate >= 10) return { label: "손절 불가자", emoji: "✨", color: "text-blue-500 dark:text-blue-400" };
    if (rate >= 5) return { label: "주식 초보", emoji: "😅", color: "text-gray-500 dark:text-gray-400" };
    if (rate >= 0) return { label: "주식 호구", emoji: "🐥", color: "text-gray-400 dark:text-gray-500" };
    if (rate >= -10) return { label: "묻지마 투자자", emoji: "🤷", color: "text-orange-400 dark:text-orange-500" };
    return { label: "야수의 심장", emoji: "🔥", color: "text-red-500 dark:text-red-400" };
};

interface AvgPriceProps {
    stockName?: string;
    initialCode?: string;
}

export default function AvgPrice({ stockName, initialCode }: AvgPriceProps) {
    const [rows, setRows] = useState<Row[]>([
        createRow(1), createRow(2), createRow(3),
    ]);
    const [currentPrice, setCurrentPrice] = useState("");
    const [stockCode, setStockCode] = useState(initialCode || "");
    const [calculated, setCalculated] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const currentPriceRef = useRef<HTMLInputElement>(null);
    const [placeholderFontSize, setPlaceholderFontSize] = useState(16);

    // input 너비에 맞게 placeholder 폰트 크기 계산 (ResizeObserver 적용)
    useEffect(() => {
        const inputEl = currentPriceRef.current;
        if (!inputEl) return;

        const calcSize = () => {
            const w = inputEl.offsetWidth;
            // "현재가를 입력하면 수익률을 계산해드려요" 문구: 한글 17자 + 공백 4자 = 약 18.5em
            // padding(px-3: 좌우 24px) 고려하여 폰트 크기 계산
            let size = Math.floor((w - 24) / 18.5);
            if (size > 15) size = 15;
            if (size < 8) size = 8;
            setPlaceholderFontSize(size);
        };

        calcSize();
        const observer = new ResizeObserver(calcSize);
        observer.observe(inputEl);

        return () => observer.disconnect();
    }, []);

    const n = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
    const formatComma = (raw: string) => raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 입력 길이에 따라 폰트 크기 조절 (최대 10자리 기준)
    const getFontSize = (value: string): number => {
        // 640px(sm 사이즈) 이상의 PC/태블릿 화면에서는 항상 14px 고정
        if (typeof window !== "undefined" && window.innerWidth >= 640) {
            return 14;
        }
        // 모바일 환경(640px 미만)에서는 기존처럼 길이에 따라 폰트 축소
        const len = value.replace(/[^0-9]/g, "").length;
        if (len >= 9) return 10;
        if (len >= 7) return 12;
        return 14;
    };

    const validAmounts = rows.map(r => (n(r.price) > 0 && n(r.qty) > 0) ? n(r.price) * n(r.qty) : 0);
    const totalCost = validAmounts.reduce((s, a) => s + a, 0);
    const totalQty = rows.reduce((s, r) => (n(r.price) > 0 && n(r.qty) > 0) ? s + n(r.qty) : s, 0);
    const avgPrice = totalQty ? totalCost / totalQty : 0;

    const firstPrice = n(rows[0].price);
    const maxPrice = Math.max(...rows.map(r => n(r.price)));
    const reducedRate = firstPrice > 0 && avgPrice > 0
        ? ((firstPrice - avgPrice) / firstPrice) * 100
        : 0;
    const isUp = avgPrice > firstPrice && firstPrice > 0;

    const curPrice = n(currentPrice);
    const hasCurrent = curPrice > 0 && calculated;
    const evalTotal = curPrice * totalQty;
    const profitAmt = evalTotal - totalCost;
    const profitRate = totalCost > 0 ? ((profitAmt / totalCost) * 100).toFixed(2) : "0";
    const isProfit = profitAmt >= 0;

    const grade = hasCurrent ? getGrade(Number(profitRate)) : null;

    const maxAmount = Math.max(...validAmounts, 1);
    const validRows = rows.filter((_, i) => validAmounts[i] > 0);

    const barColors = [
        "bg-blue-400 dark:bg-blue-500",
        "bg-indigo-400 dark:bg-indigo-500",
        "bg-violet-400 dark:bg-violet-500",
        "bg-purple-400 dark:bg-purple-500",
        "bg-fuchsia-400 dark:bg-fuchsia-500",
        "bg-pink-400 dark:bg-pink-500",
        "bg-rose-400 dark:bg-rose-500",
        "bg-orange-400 dark:bg-orange-500",
        "bg-amber-400 dark:bg-amber-500",
        "bg-teal-400 dark:bg-teal-500",
    ];

    const handleChange = (id: number, field: "price" | "qty") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCalculated(false); setCopied(false);
            const raw = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
            if (raw.length > 9) return;
            setRows(prev => prev.map(r =>
                r.id === id ? { ...r, [field]: raw === "" ? "" : formatComma(raw) } : r
            ));
            if (raw) {
                setErrorMessage("");
                setErrors(prev => {
                    const next = new Set(prev);
                    next.delete(`${field}-${id}`);
                    return next;
                });
            }
        };

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        let hasValidRow = false;

        rows.forEach(r => {
            const hasPrice = n(r.price) > 0;
            const hasQty = n(r.qty) > 0;

            if (hasPrice && hasQty) {
                hasValidRow = true;
            } else if (hasPrice && !hasQty) {
                newErrors.add(`qty-${r.id}`);
            } else if (!hasPrice && hasQty) {
                newErrors.add(`price-${r.id}`);
            }
        });

        if (!hasValidRow && newErrors.size === 0) {
            newErrors.add(`price-${rows[0].id}`);
            newErrors.add(`qty-${rows[0].id}`);
        }

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setCalculated(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        setErrorMessage("");
        setCalculated(true);
    };

    const handleCurrentPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalculated(false);
        const raw = e.target.value.replace(/[^0-9]/g, "").replace(/^0+/, "");
        if (raw.length > 9) return;
        setCurrentPrice(raw === "" ? "" : formatComma(raw));
    };

    const handleAddRow = () => {
        if (rows.length >= MAX_ROWS) return;
        const newId = Math.max(...rows.map(r => r.id)) + 1;
        setRows(prev => [...prev, createRow(newId)]);
        setCalculated(false);
    };

    const handleRemoveRow = (id: number) => {
        if (rows.length <= 1) return;
        setRows(prev => prev.filter(r => r.id !== id));
        setCalculated(false); setCopied(false);
    };

    const handleReset = () => {
        setRows([createRow(1), createRow(2), createRow(3)]);
        setCurrentPrice("");
        setCalculated(false); setCopied(false);
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
    };

    const breakevenQty = hasCurrent && curPrice < avgPrice && curPrice > 0
        ? Math.ceil(totalCost / curPrice - totalQty)
        : null;

    const handleCopyResult = async () => {
        const lines = [
            `평균 단가       : ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원`,
            `합계 수량       : ${totalQty.toLocaleString()} 개`,
            `매수 합계 금액  : ${totalCost.toLocaleString()} 원`,
        ];
        if (hasCurrent) {
            lines.push(`현재 평가금액   : ${evalTotal.toLocaleString()} 원`);
            lines.push(`수익금          : ${profitAmt >= 0 ? "+" : ""}${profitAmt.toLocaleString()} 원`);
            lines.push(`수익률          : ${Number(profitRate) >= 0 ? "+" : ""}${profitRate} %`);
            if (breakevenQty !== null) lines.push(`본전 추가매수    : ${breakevenQty.toLocaleString()} 개`);
        }
        lines.push(`\n📌JIKO 물타기 계산기에서 확인하기:\nhttps://jiko.kr/calculator/stock/avg-price`);
        await navigator.clipboard.writeText(lines.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const priceBarMax = Math.max(maxPrice, curPrice, avgPrice, 1);
    const avgBarPct = Math.round((avgPrice / priceBarMax) * 100);
    const curBarPct = Math.round((curPrice / priceBarMax) * 100);
    const maxBarPct = Math.round((maxPrice / priceBarMax) * 100);

    // sticky 공통 스타일
    const stickyTh = (left: number, width: number, extra = "") =>
        `border border-gray-400 dark:border-gray-600 py-2 text-center text-gray-800 dark:text-gray-100 text-xs bg-gray-100 dark:bg-gray-700 z-20 ${extra}`
        + ` sticky`;
    const stickyTd = (bgClass: string, extra = "") =>
        `border border-gray-400 dark:border-gray-600 ${bgClass} z-10 sticky ${extra}`;

    return (
        <div className="bg-gray-50 dark:bg-gray-900">

            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        {stockName && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-full font-bold border border-gray-200 dark:border-gray-600">
                                🏢 {stockName} {stockCode ? `(${stockCode})` : ""}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full font-semibold">💧 주식 물타기 계산기</span>
                    </div>
                </div>

                {/* 입력 카드 목록 */}
                <div className="space-y-4">
                    {rows.map((row, idx) => (
                        <div key={row.id} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative group space-y-4">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{idx + 1}차 매수</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 text-right">매수가</label>
                                    <div className="relative">
                                        <input type="text" inputMode="numeric" placeholder="0" value={row.price}
                                            onChange={handleChange(row.id, "price")}
                                            aria-label={`${idx + 1}차 매수가`}
                                            className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-right font-bold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-8 ${
                                                errors.has(`price-${row.id}`) ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-200 dark:border-gray-600"
                                            }`} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs font-bold pointer-events-none">원</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 text-right">수량</label>
                                    <div className="relative">
                                        <input type="text" inputMode="numeric" placeholder="0" value={row.qty}
                                            onChange={handleChange(row.id, "qty")}
                                            aria-label={`${idx + 1}차 수량`}
                                            className={`w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl text-right font-bold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-8 ${
                                                errors.has(`qty-${row.id}`) ? "border-red-500 ring-2 ring-red-200 dark:ring-red-900/30" : "border-gray-200 dark:border-gray-600"
                                            }`} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs font-bold pointer-events-none">개</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">매수 금액</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {validAmounts[idx] > 0 ? validAmounts[idx].toLocaleString() + " 원" : "-"}
                                </span>
                            </div>

                            {idx === rows.length - 1 && rows.length > 1 && (
                                <button onClick={() => handleRemoveRow(row.id)}
                                    className="absolute -right-2 -top-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-500 dark:text-rose-400 transition-all md:opacity-0 md:group-hover:opacity-100 shadow-sm"
                                    aria-label="행 삭제">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {rows.length < MAX_ROWS && (
                        <button onClick={handleAddRow}
                            className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                            + 매수 추가 ({rows.length}/{MAX_ROWS})
                        </button>
                    )}
                    {rows.length >= MAX_ROWS && (
                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium pb-2">최대 {MAX_ROWS}차까지 추가 가능합니다.</p>
                    )}

                    {/* 합계 요약 영역 */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex justify-between items-center mt-2">
                        <div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block mb-1">합계 수량</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{totalQty > 0 ? totalQty.toLocaleString() : "0"} 개</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block mb-1">총 매수 금액</span>
                            <span className="text-base font-black text-gray-900 dark:text-gray-100">{totalCost > 0 ? totalCost.toLocaleString() : "0"} 원</span>
                        </div>
                    </div>
                </div>

                {/* 현재가 입력 (선택) */}
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md px-5 py-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="stock-current-price" className="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                            현재가
                            <span className="text-xs font-normal text-gray-600 dark:text-gray-400">(선택)</span>
                        </label>
                        <div className="flex items-center flex-1">
                            <input
                                id="stock-current-price"
                                ref={currentPriceRef}
                                type="text" inputMode="numeric"
                                placeholder="현재가를 입력하면 수익률을 계산해드려요"
                                value={currentPrice}
                                onChange={handleCurrentPrice}
                                style={{
                                    fontSize: currentPrice ? getFontSize(currentPrice) : placeholderFontSize
                                }}
                                className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 placeholder:text-left transition-all duration-150" />                            <span aria-hidden="true" className="ml-2 text-gray-800 dark:text-gray-100 shrink-0 text-sm">원</span>
                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="flex justify-center gap-3 w-full">
                        <button onClick={handleReset}
                            className={`flex-1 px-6 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 transition-colors duration-150 text-base ${ANIMATION.resetShake && shaking ? "animate-shake" : ""}`}>
                            초기화
                        </button>
                        <button onClick={handleCalculate}
                            className="flex-[2] px-8 py-3 min-h-[44px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors duration-150 text-base">
                            계산하기
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="text-center text-red-500 text-sm font-bold flex items-center justify-center gap-1 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {errorMessage}
                        </p>
                    )}
                </div>

                {/* 결과 — 모바일: 상하 / PC: 좌우 */}
                {calculated && (
                    <div className={`mt-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="flex flex-col sm:flex-row gap-4">

                            {/* 좌측: 결과 수치 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md space-y-3">
                                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">계산 결과</h2>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">평균 단가</span>
                                    <strong className="text-blue-600 dark:text-blue-400 text-lg">
                                        {avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
                                    </strong>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">합계 수량</span>
                                    <strong className="text-gray-800 dark:text-gray-100">{totalQty.toLocaleString()} 개</strong>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                                    <span className="text-gray-600 dark:text-gray-300">매수 합계 금액</span>
                                    <strong className="text-red-500 dark:text-red-400">{totalCost.toLocaleString()} 원</strong>
                                </div>

                                {hasCurrent && (
                                    <>
                                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                                            <span className="text-gray-600 dark:text-gray-300">현재 평가금액</span>
                                            <strong className="text-gray-800 dark:text-gray-100">{evalTotal.toLocaleString()} 원</strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">수익금</span>
                                            <strong className={isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}>
                                                {profitAmt >= 0 ? "+" : ""}{profitAmt.toLocaleString()} 원
                                            </strong>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-300">수익률</span>
                                            <strong className={`text-xl ${isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"}`}>
                                                {Number(profitRate) >= 0 ? "+" : ""}{profitRate} %
                                            </strong>
                                        </div>
                                        {breakevenQty !== null && (
                                            <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2">
                                                <span className="text-xs text-amber-600 dark:text-amber-400">본전되려면 추가매수</span>
                                                <strong className="text-amber-600 dark:text-amber-400 text-sm">{breakevenQty.toLocaleString()} 개</strong>
                                            </div>
                                        )}
                                        {curPrice >= avgPrice && (
                                            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2">
                                                <span className="text-xs text-green-600 dark:text-green-400">손익분기</span>
                                                <strong className="text-green-600 dark:text-green-400 text-sm">이미 본전 이상 ✅</strong>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="mt-8 flex flex-col gap-3 w-full">
                                    <button
                                        onClick={handleCopyResult}
                                        className={`w-full py-4 font-bold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 ${copied ? "bg-green-500 text-white" : "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
                                    >
                                        {copied ? (
                                            <><span>✅</span> 복사 완료</>
                                        ) : (
                                            <><span>📋</span> 결과 복사하기</>
                                        )}
                                    </button>
                                    <button onClick={() => setIsSharing(true)} className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000]/80 font-bold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-xl">
                                        <span>💬</span> 친구에게 공유하기
                                    </button>
                                </div>
                            </div>

                            {/* 우측: 그래프 */}
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md flex flex-col">
                                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-6">시각화 분석</h2>

                                <div className="text-center mb-5">
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <span className={`text-3xl font-bold ${hasCurrent ? (isProfit ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400") : "text-blue-600 dark:text-blue-400"}`}>
                                            {hasCurrent
                                                ? `${Number(profitRate) >= 0 ? "▲" : "▼"} ${Math.abs(Number(profitRate)).toFixed(2)}%`
                                                : `${isUp ? "▲" : "▼"} ${Math.abs(reducedRate).toFixed(1)}%`
                                            }
                                        </span>
                                        {grade && (
                                            <span className={`text-sm font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${grade.color}`}>
                                                {grade.emoji} {grade.label}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {hasCurrent
                                            ? (isProfit ? "현재가 대비 수익 중" : "현재가 대비 손실 중")
                                            : (isUp ? "불타기 — 1차 대비 단가 상승" : "1차 대비 단가 절감률")
                                        }
                                    </p>
                                    {grade && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            등급 기준: 수익률 {Number(profitRate) >= 0 ? "+" : ""}{profitRate}%
                                        </p>
                                    )}
                                    {!grade && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            현재가를 입력하면 등급을 알 수 있어요 👆
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {rows.map((row, idx) => {
                                        const amount = validAmounts[idx];
                                        const barWidth = maxAmount > 0 ? Math.round((amount / maxAmount) * 100) : 0;
                                        const ratio = totalCost > 0 ? ((amount / totalCost) * 100).toFixed(1) : "0";
                                        if (amount === 0) return null;
                                        return (
                                            <div key={row.id}>
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>{idx + 1}차 ({n(row.price).toLocaleString()}원 × {n(row.qty).toLocaleString()}개)</span>
                                                    <span className="font-medium">{ratio}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                                    <div className={`h-4 rounded-full transition-all duration-700 ease-out ${barColors[idx % barColors.length]}`}
                                                        style={{ width: `${barWidth}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {hasCurrent && validRows.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">단가 위치 비교</p>
                                        <div className="space-y-2">
                                            {[
                                                { label: "최고 매수가", value: maxPrice, pct: maxBarPct, color: "bg-gray-400 dark:bg-gray-500" },
                                                { label: "평균 단가", value: avgPrice, pct: avgBarPct, color: "bg-blue-400 dark:bg-blue-500" },
                                                { label: "현재가", value: curPrice, pct: curBarPct, color: isProfit ? "bg-red-400 dark:bg-red-500" : "bg-blue-300 dark:bg-blue-400" },
                                            ].map(({ label, value, pct, color }) => (
                                                <div key={label}>
                                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        <span>{label}</span>
                                                        <span className="font-medium">{value.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                        <div className={`h-3 rounded-full transition-all duration-700 ease-out ${color}`}
                                                            style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!hasCurrent && validRows.length > 1 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 dark:text-gray-500">1차 매수가</span>
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">{firstPrice.toLocaleString()} 원</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 dark:text-gray-500">평균 단가</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                {avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {isSharing && (
                    <ShareSheet
                        onClose={() => setIsSharing(false)}
                        title="💧 나의 주식 물타기 계산 결과"
                        description={`현재 평단가 ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}원, 총 ${totalQty.toLocaleString()}주 보유 중입니다!`}
                        url={typeof window !== "undefined" ? window.location.href : ""}
                    />
                )}
                <InstallBanner />
            </div>
        </div>
    );
}