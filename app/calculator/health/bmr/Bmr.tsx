"use client";

import { useState } from "react";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

export default function Bmr({ children }: { children?: React.ReactNode }) {
    const [gender, setGender] = useState<"M" | "F">("M");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [resultBmr, setResultBmr] = useState<number | null>(null);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [shakeField, setShakeField] = useState<string | null>(null);
    const resultRef = useCalculatorScroll(resultBmr);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!age) newErrors.add("age");
        if (!height) newErrors.add("height");
        if (!weight) newErrors.add("weight");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setShakeField(Array.from(newErrors)[0]);
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        const a = parseInt(age);
        const h = parseFloat(height);
        const w = parseFloat(weight);

        if (a > 0 && h > 0 && w > 0) {
            setErrorMessage("");
            // 미플린-세인트 주어(Mifflin-St Jeor) 공식
            let bmr = (10 * w) + (6.25 * h) - (5 * a);
            if (gender === "M") {
                bmr += 5;
            } else {
                bmr -= 161;
            }
            setResultBmr(Math.round(bmr));
        }
    };

    const handleReset = () => {
        setAge("");
        setHeight("");
        setWeight("");
        setResultBmr(null);
        setErrors(new Set());
        setErrorMessage("");

        const btn = document.getElementById("resetBtn");
        if (btn) {
            btn.classList.add("animate-[shake_0.5s_ease-in-out]");
            setTimeout(() => btn.classList.remove("animate-[shake_0.5s_ease-in-out]"), 500);
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const generateShareText = () => {
        if (resultBmr === null) {
            return `📌 JIKO 기초대사량 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/bmr`;
        }
        return `[🔥 기초대사량(BMR) 계산 결과]\n\n성별: ${gender === "M" ? "남성" : "여성"}\n나이: ${age}세\n키: ${height}cm\n몸무게: ${weight}kg\n기초대사량: ${resultBmr.toLocaleString()} kcal\n\n📌 JIKO 기초대사량 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/bmr`;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                        🔥 기초대사량 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "M" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("M")}
                                >
                                    남성
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "F" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("F")}
                                >
                                    여성
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="bmr-age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">나이 (만)</label>
                            <input
                                id="bmr-age"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("age") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all text-right focus:ring-2 focus:ring-red-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "age" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                placeholder="예: 30"
                                value={age}
                                onChange={(e) => {
                                    setAge(e.target.value);
                                    if (e.target.value) {
                                        setErrors(prev => {
                                            const next = new Set(prev);
                                            next.delete("age");
                                            return next;
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="bmr-height" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input
                                id="bmr-height"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("height") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all text-right focus:ring-2 focus:ring-red-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "height" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                placeholder="예: 175"
                                value={height}
                                onChange={(e) => {
                                    setHeight(e.target.value);
                                    if (e.target.value) {
                                        setErrors(prev => {
                                            const next = new Set(prev);
                                            next.delete("height");
                                            return next;
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="bmr-weight" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input
                                id="bmr-weight"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 border ${errors.has("weight") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-300 dark:border-gray-600"} rounded-xl outline-none transition-all text-right focus:ring-2 focus:ring-red-500 dark:text-gray-100 placeholder-gray-400 ${shakeField === "weight" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                                placeholder="예: 70"
                                value={weight}
                                onChange={(e) => {
                                    setWeight(e.target.value);
                                    if (e.target.value) {
                                        setErrors(prev => {
                                            const next = new Set(prev);
                                            next.delete("weight");
                                            return next;
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <CalculatorButtons 
                            onReset={handleReset} 
                            onCalculate={handleCalculate} 
                        />
                        {errorMessage && (
                            <div className="w-full mt-2 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                                🚨 {errorMessage}
                            </div>
                        )}
                    </div>

                    {resultBmr !== null && (
                        <div id="result-section" ref={resultRef} className="animate-fade-in-up space-y-6 mt-8">
                            <div className="p-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-[32px] text-white shadow-xl relative overflow-hidden text-center">
                                <div className="absolute -right-6 -top-6 text-9xl opacity-10">🔥</div>
                                <p className="text-red-100 font-medium mb-2 opacity-90">하루 기초대사량 (BMR)</p>
                                <div className="text-5xl font-black mb-2 tracking-tighter">
                                    {resultBmr.toLocaleString()} <span className="text-xl opacity-70">kcal</span>
                                </div>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle=""
                                shareDescription={generateShareText()}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* page.tsx에서 넘겨받은 1.6 가이드 및 1.7 사용방법 영역 렌더링 */}
            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}

            {/* BMR 비교 및 정보 섹션 (동적 마커 포함 이전 버전 완벽 복구) */}
            <div className="mt-4 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                    연령대별 평균 기초대사량 비교
                </h2>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10 text-sm">
                    기초대사량(BMR)은 생명 유지에 필요한 최소한의 에너지량입니다.<br />
                    근육량이 많을수록 기초대사량이 높아지며, 이는 똑같이 먹어도 살이 덜 찌는 체질이 됨을 의미합니다. 아래 차트에서 나의 위치를 확인해보세요.
                </p>

                {/* BMR 시각화 차트 */}
                <div className="relative pt-10 pb-8 px-2">
                    {/* 현재 수치 마커 */}
                    {resultBmr !== null && (
                        <div
                            className="absolute top-0 transition-all duration-700 ease-out z-10"
                            style={{
                                left: (() => {
                                    const avg = (() => {
                                        const a = parseInt(age);
                                        if (gender === "M") {
                                            if (a < 30) return 1728;
                                            if (a < 50) return 1669;
                                            if (a < 65) return 1550;
                                            return 1403;
                                        } else {
                                            if (a < 30) return 1311;
                                            if (a < 50) return 1316;
                                            if (a < 65) return 1250;
                                            return 1186;
                                        }
                                    })();

                                    // 맵핑: 평균의 0.7배 ~ 1.3배 사이를 시각화 (더 넓은 범위를 보여줌)
                                    const min = avg * 0.7;
                                    const max = avg * 1.3;
                                    return `${Math.min(Math.max((resultBmr - min) / (max - min) * 100, 0), 100)}%`;
                                })(),
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-red-600 dark:text-blue-400 mb-1 bg-red-50 dark:bg-red-900/40 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-800 shadow-sm whitespace-nowrap">
                                    나의 BMR : {resultBmr.toLocaleString()}
                                </span>
                                <div className="w-0.5 h-10 bg-red-500 relative">
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 컬러 바 */}
                    <div className="h-10 w-full flex rounded-lg overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-700 flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-[10px] font-bold">낮음</div>
                        <div className="bg-green-500 flex-1 flex items-center justify-center text-white text-xs font-bold border-x border-white/20">평균 범위</div>
                        <div className="bg-orange-500 flex-1 flex items-center justify-center text-white text-xs font-bold">높음</div>
                    </div>

                    {/* 수치 라벨 */}
                    <div className="relative w-full h-6 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <div className="absolute left-1/3 -translate-x-1/2">평균의 90%</div>
                        <div className="absolute left-2/3 -translate-x-1/2">평균의 110%</div>
                    </div>
                </div>

                {/* 평균 데이터 요약 표 */}
                <div className="mt-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-4 py-3 font-bold">연령대 (만)</th>
                                <th className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400 text-right">남성 평균</th>
                                <th className="px-4 py-3 font-bold text-pink-600 dark:text-pink-400 text-right">여성 평균</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                            <tr className={age && parseInt(age) < 30 ? "bg-red-50/50 dark:bg-red-900/10 font-bold" : ""}>
                                <td className="px-4 py-3">18 ~ 29세</td>
                                <td className="px-4 py-3 text-right">1,728 kcal</td>
                                <td className="px-4 py-3 text-right">1,311 kcal</td>
                            </tr>
                            <tr className={age && parseInt(age) >= 30 && parseInt(age) < 50 ? "bg-red-50/50 dark:bg-red-900/10 font-bold" : ""}>
                                <td className="px-4 py-3">30 ~ 49세</td>
                                <td className="px-4 py-3 text-right">1,669 kcal</td>
                                <td className="px-4 py-3 text-right">1,316 kcal</td>
                            </tr>
                            <tr className={age && parseInt(age) >= 50 && parseInt(age) < 65 ? "bg-red-50/50 dark:bg-red-900/10 font-bold" : ""}>
                                <td className="px-4 py-3">50 ~ 64세</td>
                                <td className="px-4 py-3 text-right">1,550 kcal</td>
                                <td className="px-4 py-3 text-right">1,250 kcal</td>
                            </tr>
                            <tr className={age && parseInt(age) >= 65 ? "bg-red-50/50 dark:bg-red-900/10 font-bold" : ""}>
                                <td className="px-4 py-3">65세 이상</td>
                                <td className="px-4 py-3 text-right">1,403 kcal</td>
                                <td className="px-4 py-3 text-right">1,186 kcal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-[11px] text-gray-400 dark:text-gray-500">
                    * 보건복지부/한국영양학회 한국인 영양소 섭취기준 참고. 개인의 근육량, 체지방률, 활동량에 따라 실제 기초대사량은 차이가 있을 수 있습니다.
                </p>
            </div>
        </div>
    );
}
