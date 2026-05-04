"use client";

import { useState } from "react";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

export default function Bmi() {
    const [gender, setGender] = useState<"M" | "F">("M");
    const [age, setAge] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");

    // Optional
    const [waist, setWaist] = useState<string>("");

    const [resultBmi, setResultBmi] = useState<number | null>(null);
    const [resultCategory, setResultCategory] = useState<string>("");
    const [resultWhr, setResultWhr] = useState<number | null>(null);

    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");
    const [shakeField, setShakeField] = useState<string | null>(null);
    const resultRef = useCalculatorScroll(resultBmi);

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

        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);

        if (h > 0 && w > 0) {
            setErrorMessage("");
            const bmi = w / (h * h);
            setResultBmi(bmi);

            if (bmi < 18.5) setResultCategory("저체중");
            else if (bmi < 23) setResultCategory("정상");
            else if (bmi < 25) setResultCategory("과체중");
            else if (bmi < 30) setResultCategory("비만");
            else setResultCategory("고도비만");
        }
    };

    const handleReset = () => {
        setAge("");
        setHeight("");
        setWeight("");
        setWaist("");
        setResultBmi(null);
        setResultCategory("");
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
        if (resultBmi === null) {
            return `📌 JIKO BMI 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/bmi`;
        }
        return `[⚖️ BMI 계산 결과]\n\n나이: ${age}세\n키: ${height}cm\n몸무게: ${weight}kg\nBMI: ${resultBmi.toFixed(1)} (${resultCategory})${waist ? `\n허리둘레: ${waist}cm` : ''}\n\n📌 JIKO BMI 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/health/bmi`;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            {/* 헤더 섹션 */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex justify-center flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        ⚖️ 비만도 계산기
                    </span>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-6">
                    {/* 성별/나이 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "M" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("M")}
                                >
                                    남성
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-colors ${gender === "F" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                    onClick={() => setGender("F")}
                                >
                                    여성
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="bmi-age" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">나이 (만)</label>
                            <input
                                id="bmi-age"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none border transition-all text-right focus:ring-2 focus:ring-blue-500 dark:text-gray-100 ${errors.has("age") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-200 dark:border-gray-600"} ${shakeField === "age" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
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

                    {/* 키/몸무게 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="bmi-height" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input
                                id="bmi-height"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none border transition-all text-right focus:ring-2 focus:ring-blue-500 dark:text-gray-100 ${errors.has("height") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-200 dark:border-gray-600"} ${shakeField === "height" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
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
                            <label htmlFor="bmi-weight" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input
                                id="bmi-weight"
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none border transition-all text-right focus:ring-2 focus:ring-blue-500 dark:text-gray-100 ${errors.has("weight") ? "border-red-600 ring-2 ring-red-500/20" : "border-gray-200 dark:border-gray-600"} ${shakeField === "weight" ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
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

                    {/* Buttons */}
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

                    {/* 결과 */}
                    {resultBmi !== null && (
                        <div id="result-section" ref={resultRef} className="animate-fade-in-up space-y-6 mt-8">
                            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] text-white shadow-xl relative overflow-hidden text-center">
                                <div className="absolute -right-6 -top-6 text-9xl opacity-10">⚖️</div>
                                <p className="text-blue-100 font-medium mb-2 opacity-90">나의 비만도 (BMI)</p>
                                <div className="text-5xl font-black mb-4 tracking-tighter">
                                    {resultBmi.toFixed(1)}
                                </div>
                                <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-2xl text-xl font-bold border border-white/30">
                                    {resultCategory}
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



        </div>
    );
}
