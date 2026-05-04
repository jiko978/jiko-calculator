"use client";

import { useState } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";
import { numberToKorean } from "@/app/utils/financeUtils";

export default function Percentage() {
    // 필수: 전체값
    const [totalValue, setTotalValue] = useState("");

    // 옵션값 4가지
    const [ratioValue, setRatioValue] = useState("");
    const [partValue, setPartValue] = useState("");
    const [changeValue, setChangeValue] = useState("");
    const [diffRatioValue, setDiffRatioValue] = useState("");

    const [calculated, setCalculated] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const resultRef = useCalculatorScroll(calculated);

    const formatNumber = (value: string) => {
        const clean = value.replace(/[^\d.-]/g, '');
        if (!clean || clean === '-') return clean;
        const parts = clean.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const parseNum = (value: string) => parseFloat(value.replace(/,/g, ''));

    const handleTotal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalValue(formatNumber(e.target.value));
        setCalculated(false);
        if (e.target.value) {
            setErrorMessage("");
        }
        setErrors(prev => { const next = new Set(prev); next.delete("totalValue"); return next; });
    };

    const handleCalculate = () => {
        const errs = new Set<string>();
        if (!totalValue || isNaN(parseNum(totalValue))) errs.add("totalValue");

        if (errs.size > 0) {
            setErrors(errs);
            setErrorMessage("필수 항목을 모두 입력해주세요.");
            return;
        }

        setErrorMessage("");
        setErrors(new Set());
        setCalculated(true);
    };

    const handleReset = () => {
        setTotalValue("");
        setRatioValue("");
        setPartValue("");
        setChangeValue("");
        setDiffRatioValue("");
        setCalculated(false);
        setErrors(new Set());
        setErrorMessage("");
    };

    const t = parseNum(totalValue);

    let resRatio: number | null = null;
    let resPart: number | null = null;
    let resChange: number | null = null;
    let resDiff: number | null = null;

    if (calculated && !isNaN(t)) {
        if (ratioValue && !isNaN(parseNum(ratioValue))) resRatio = (t * parseNum(ratioValue)) / 100;
        if (partValue && !isNaN(parseNum(partValue)) && t !== 0) resPart = (parseNum(partValue) / t) * 100;
        if (changeValue && !isNaN(parseNum(changeValue)) && t !== 0) resChange = ((parseNum(changeValue) - t) / t) * 100;
        if (diffRatioValue && !isNaN(parseNum(diffRatioValue))) resDiff = t * (1 + parseNum(diffRatioValue) / 100);
    }

    const m3Text = resChange !== null && resChange >= 0 ? "증가" : "감소";
    const m4Text = resDiff !== null && parseNum(diffRatioValue) >= 0 ? "증가" : "감소";

    const generateShareText = () => {
        const lines = [
            `[💯 퍼센트 계산 결과]`,
            `전체값 : ${totalValue}`
        ];

        if (resRatio !== null) {
            lines.push(`1. 비율값 : ${ratioValue}%는 ${Number.isInteger(resRatio) ? resRatio.toLocaleString() : resRatio.toLocaleString(undefined, { maximumFractionDigits: 4 })}`);
        }
        if (resPart !== null) {
            lines.push(`2. 일부값 : ${partValue}은(는) ${Number.isInteger(resPart) ? resPart.toLocaleString() : resPart.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`);
        }
        if (resChange !== null) {
            lines.push(`3. 변경값 : ${changeValue}(으)로 변하면 ${Math.abs(resChange).toLocaleString(undefined, { maximumFractionDigits: 4 })}% ${m3Text}`);
        }
        if (resDiff !== null) {
            lines.push(`4. 증감비율 : ${Math.abs(parseNum(diffRatioValue))}% ${m4Text}하면 ${Number.isInteger(resDiff) ? resDiff.toLocaleString() : resDiff.toLocaleString(undefined, { maximumFractionDigits: 4 })}`);
        }

        lines.push(`\n📌JIKO 퍼센트 계산기에서 확인하기 :`);
        lines.push(`https://jiko.kr/calculator/finance/percentage`);

        return lines.join("\n");
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <div className={`max-w-3xl mx-auto px-4 py-6 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                {/* 1.2 카테고리 메뉴명 */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap text-sm">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full font-semibold shadow-sm border border-gray-100 dark:border-gray-700">💯 퍼센트 계산기</span>
                    </div>
                </div>

                {/* 1.4 입력 데이터 영역 */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">

                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label htmlFor="total-value" className={`block text-sm font-bold transition-colors ${errors.has("totalValue") ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}>
                                전체값 (기준값) <span className="text-red-500">*</span>
                            </label>
                            {totalValue && !isNaN(parseNum(totalValue)) && (
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 animate-fade-in">
                                    {numberToKorean(totalValue)}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="total-value"
                                type="text"
                                inputMode="decimal"
                                value={totalValue}
                                onChange={handleTotal}
                                placeholder="예) 10000"
                                className={`w-full h-16 px-5 text-2xl font-bold bg-gray-50 dark:bg-gray-900/50 border rounded-2xl transition-all outline-none text-right dark:text-white ${errors.has("totalValue") ? "border-red-500 focus:border-red-500 ring-4 ring-red-500/10" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 ring-blue-500/10 focus:ring-4"
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700/50 my-6"></div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">아래 항목 중 계산하고 싶은 옵션만 선택해서 입력하세요.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. 비율값 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">1. 비율값 (%)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={ratioValue}
                                    onChange={(e) => { setRatioValue(formatNumber(e.target.value)); setCalculated(false); }}
                                    placeholder="예) 20"
                                    className="w-full h-12 px-4 pr-10 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 outline-none text-right font-bold dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                            </div>
                        </div>

                        {/* 2. 일부값 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">2. 일부값</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={partValue}
                                    onChange={(e) => { setPartValue(formatNumber(e.target.value)); setCalculated(false); }}
                                    placeholder="예) 2000"
                                    className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 outline-none text-right font-bold dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 3. 변경값 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">3. 변경값</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={changeValue}
                                    onChange={(e) => { setChangeValue(formatNumber(e.target.value)); setCalculated(false); }}
                                    placeholder="예) 15000"
                                    className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 outline-none text-right font-bold dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 4. 증감비율 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">4. 증감비율 (%)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={diffRatioValue}
                                    onChange={(e) => { setDiffRatioValue(formatNumber(e.target.value)); setCalculated(false); }}
                                    placeholder="예) -20"
                                    className="w-full h-12 px-4 pr-10 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 outline-none text-right font-bold dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    {/* 제어 버튼 */}
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

                {/* 1.5 출력 데이터 영역 */}
                {calculated && (
                    <div ref={resultRef} className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900/30 animate-fade-slide-up space-y-6">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white text-center mb-6">계산 결과</h2>

                        <div className="space-y-4">
                            {resRatio !== null && (
                                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 break-keep text-center">전체값의 <strong>{ratioValue}%</strong>는</span>
                                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                        {Number.isInteger(resRatio) ? resRatio.toLocaleString() : resRatio.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </span>
                                </div>
                            )}

                            {resPart !== null && (
                                <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 break-keep text-center">전체값에서 <strong>{partValue}</strong>은(는)</span>
                                    <span className="text-2xl font-black text-green-600 dark:text-green-400">
                                        {Number.isInteger(resPart) ? resPart.toLocaleString() : resPart.toLocaleString(undefined, { maximumFractionDigits: 4 })}%
                                    </span>
                                </div>
                            )}

                            {resChange !== null && (
                                <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 break-keep text-center">전체값이 <strong>{changeValue}</strong>(으)로 변하면</span>
                                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                                        {Math.abs(resChange).toLocaleString(undefined, { maximumFractionDigits: 4 })}% {resChange >= 0 ? "증가" : "감소"}
                                    </span>
                                </div>
                            )}

                            {resDiff !== null && (
                                <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 break-keep text-center">전체값이 <strong>{Math.abs(parseNum(diffRatioValue))}%</strong> {parseNum(diffRatioValue) >= 0 ? "증가" : "감소"}하면</span>
                                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                                        {Number.isInteger(resDiff) ? resDiff.toLocaleString() : resDiff.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </span>
                                </div>
                            )}

                            {!ratioValue && !partValue && !changeValue && !diffRatioValue && (
                                <div className="text-center text-gray-500 py-4 font-medium">옵션값을 입력하시면 계산 결과가 이곳에 표시됩니다.</div>
                            )}
                        </div>

                        <CalculatorActions
                            onCopy={async () => {
                                await navigator.clipboard.writeText(generateShareText());
                            }}
                            shareTitle=""
                            shareDescription={generateShareText()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
