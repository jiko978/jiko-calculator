"use client";

import { useState } from "react";
import InstallBanner from "@/app/calculator/components/InstallBanner";

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
    const [isShaking, setIsShaking] = useState(false);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!age) newErrors.add("age");
        if (!height) newErrors.add("height");
        if (!weight) newErrors.add("weight");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("항목을 정확히 입력해주세요.");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
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
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setAge("");
        setHeight("");
        setWeight("");
        setWaist("");
        setResultBmi(null);
        setResultCategory("");
        setErrors(new Set());
        setErrorMessage("");
    };

    const handleCopy = () => {
        if (resultBmi !== null) {
            const text = `내 비만도(BMI)는 ${resultBmi.toFixed(1)} (${resultCategory}) 입니다.`;
            navigator.clipboard.writeText(text);
            alert("복사되었습니다.");
        }
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
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">나이 (만)</label>
                            <input
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none transition-all text-right ${errors.has("age") ? "ring-2 ring-red-500 border-red-500" : "focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                                    }`}
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
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">키 (cm)</label>
                            <input
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none transition-all text-right ${errors.has("height") ? "ring-2 ring-red-500 border-red-500" : "focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                                    }`}
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
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">체중 (kg)</label>
                            <input
                                type="number"
                                className={`w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl outline-none transition-all text-right ${errors.has("weight") ? "ring-2 ring-red-500 border-red-500" : "focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                                    }`}
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
                    <div className="flex flex-col items-center gap-3 pt-4">
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handleReset}
                                className={`flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleCalculate}
                                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-sm"
                            >
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

                    {/* 결과 */}
                    {resultBmi !== null && (
                        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-center text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">나의 비만도 (BMI)</h3>
                            <div className="text-center mb-4">
                                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{resultBmi.toFixed(1)}</span>
                            </div>
                            <div className="text-center mb-6">
                                <span className="inline-block px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-lg font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                                    {resultCategory}
                                </span>
                            </div>

                            <button
                                onClick={handleCopy}
                                className="w-full py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                결과 복사하기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* BMI 기준 정보 섹션 */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    성인 비만도 측정 (BMI 지수)
                </h2>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                    성인 비만 진단은 체질량지수(BMI: body mass index)를 주로 이용합니다.<br />
                    BMI 지수는 키와 몸무게를 이용하여 전반적인 체지방량을 추정하는 값으로서, 체중(kg)을 신장의 제곱(m²)으로 나눈 값으로 비만도를 측정합니다.
                </p>

                {/* BMI 시각화 차트 */}
                <div className="relative pt-10 pb-8 px-2">
                    {/* 현재 수치 마커 */}
                    {resultBmi !== null && (
                        <div
                            className="absolute top-0 transition-all duration-700 ease-out z-10"
                            style={{
                                left: (() => {
                                    if (resultBmi < 18.5) return `${Math.max((resultBmi - 10) / (18.5 - 10) * 25, 0)}%`;
                                    if (resultBmi < 23) return `${25 + (resultBmi - 18.5) / (23 - 18.5) * 25}%`;
                                    if (resultBmi < 25) return `${50 + (resultBmi - 23) / (25 - 23) * 25}%`;
                                    return `${Math.min(75 + (resultBmi - 25) / (40 - 25) * 25, 100)}%`;
                                })(),
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800 shadow-sm whitespace-nowrap">
                                    나의 BMI : {resultBmi.toFixed(1)}
                                </span>
                                <div className="w-0.5 h-10 bg-blue-500 relative">
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 컬러 바 */}
                    <div className="h-10 w-full flex rounded-lg overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
                        <div className="bg-[#00A2FF] flex-1 flex items-center justify-center text-white text-xs font-bold">저체중</div>
                        <div className="bg-[#00C853] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">정상</div>
                        <div className="bg-[#FAA61A] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">과체중</div>
                        <div className="bg-[#FF5252] flex-1 flex items-center justify-center text-white text-xs font-bold border-l border-white/20">비만</div>
                    </div>

                    {/* 수치 라벨 */}
                    <div className="relative w-full h-6 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <div className="absolute left-0">BMI</div>
                        <div className="absolute left-1/4 -translate-x-1/2">18.5</div>
                        <div className="absolute left-2/4 -translate-x-1/2">23</div>
                        <div className="absolute left-3/4 -translate-x-1/2">25.00</div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <div className="text-[10px] text-gray-400 mb-1">저체중</div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">18.5 미만</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <div className="text-[10px] text-gray-400 mb-1">정상</div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">18.5 ~ 22.9</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <div className="text-[10px] text-gray-400 mb-1">과체중</div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">23.0 ~ 24.9</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <div className="text-[10px] text-gray-400 mb-1">비만</div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300">25.0 이상</div>
                    </div>
                </div>
            </div>

            <InstallBanner />
        </div>
    );
}
