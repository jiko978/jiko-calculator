"use client";

import React, { useState, useCallback, useMemo } from "react";
import CalculatorButtons from "@/app/calculator/components/CalculatorButtons";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

type ScaleType = "4.5" | "4.3" | "4.0" | "100";

interface Subject {
    id: string;
    name: string;
    credit: string;
    grade: string;
    isMajor: boolean;
    error: boolean;
}

const GRADE_SCORES: Record<ScaleType, Record<string, number>> = {
    "4.5": { "A+": 4.5, "A0": 4.0, "B+": 3.5, "B0": 3.0, "C+": 2.5, "C0": 2.0, "D+": 1.5, "D0": 1.0, "F": 0, "P": 0, "NP": 0 },
    "4.3": { "A+": 4.3, "A0": 4.0, "A-": 3.7, "B+": 3.3, "B0": 3.0, "B-": 2.7, "C+": 2.3, "C0": 2.0, "C-": 1.7, "D+": 1.3, "D0": 1.0, "D-": 0.7, "F": 0, "P": 0, "NP": 0 },
    "4.0": { "A+": 4.0, "A0": 4.0, "A-": 3.7, "B+": 3.3, "B0": 3.0, "B-": 2.7, "C+": 2.3, "C0": 2.0, "C-": 1.7, "D+": 1.3, "D0": 1.0, "D-": 0.7, "F": 0, "P": 0, "NP": 0 },
    "100": { "A+": 100, "A0": 95, "B+": 90, "B0": 85, "C+": 80, "C0": 75, "D+": 70, "D0": 65, "F": 0, "P": 0, "NP": 0 },
};

const GRADES: Record<ScaleType, string[]> = {
    "4.5": ["A+", "A0", "B+", "B0", "C+", "C0", "D+", "D0", "F", "P", "NP"],
    "4.3": ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F", "P", "NP"],
    "4.0": ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F", "P", "NP"],
    "100": ["A+", "A0", "B+", "B0", "C+", "C0", "D+", "D0", "F", "P", "NP"]
};

// 백분위 환산 (단순 계산식, 학교마다 약간 다를 수 있음)
function getPercentile(gpa: number, scale: ScaleType) {
    if (gpa === 0 || isNaN(gpa)) return 0;
    const max = parseFloat(scale);
    let p = 100 - (max - gpa) * 10;
    if (p < 0) p = 0;
    return Number(p.toFixed(1));
}

// 학점 변환 공식
function convertGPA(gpa: number, from: ScaleType, to: ScaleType): string {
    if (isNaN(gpa) || gpa === 0) return "0.00";
    if (from === to) return gpa.toFixed(2);
    
    if (to === "100") return getPercentile(gpa, from).toFixed(1);
    if (from === "100") {
        const toMax = parseFloat(to);
        const val = toMax - ((100 - gpa) / 10);
        return Math.max(0, val).toFixed(2);
    }
    const fromMax = parseFloat(from);
    const toMax = parseFloat(to);
    const val = (gpa * toMax) / fromMax;
    return val.toFixed(2);
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function GradeCalculator() {
    const [activeTab, setActiveTab] = useState<"calc" | "conv">("calc");
    
    // 계산기 상태
    const [scale, setScale] = useState<ScaleType>("4.5");
    const [subjects, setSubjects] = useState<Subject[]>(Array.from({ length: 6 }).map(() => ({
        id: generateId(), name: "", credit: "", grade: "A+", isMajor: false, error: false
    })));
    const [result, setResult] = useState<{
        calculated: boolean;
        totalCredits: number;
        gpaCredits: number;
        totalGpa: number;
        majorCredits: number;
        majorGpaCredits: number;
        majorGpa: number;
        percentile: number;
        pnCredits: number;
    } | null>(null);

    // 변환기 상태
    const [convScale, setConvScale] = useState<ScaleType>("4.5");
    const [convGpa, setConvGpa] = useState<string>("");
    const [convResult, setConvResult] = useState<{ "4.5": string; "4.3": string; "4.0": string; "100": string } | null>(null);

    const [scrollTrigger, setScrollTrigger] = useState(0);
    const resultRef = useCalculatorScroll(scrollTrigger);
    const [hasError, setHasError] = useState(false);

    // [학점 계산기 기능]
    const handleAddSubject = () => {
        setSubjects([...subjects, { id: generateId(), name: "", credit: "", grade: "A+", isMajor: false, error: false }]);
    };

    const handleRemoveSubject = (id: string) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const handleSubjectChange = (id: string, field: keyof Subject, value: any) => {
        setSubjects(subjects.map(s => {
            if (s.id === id) {
                // 등급을 변경할 때 P/NP면 숫자가 아닌 것을 입력하므로, 에러를 풀어주는 건 학점 입력시만
                if (field === "credit") {
                    return { ...s, [field]: value, error: false };
                }
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const handleResetCalc = () => {
        setSubjects(Array.from({ length: 6 }).map(() => ({ id: generateId(), name: "", credit: "", grade: "A+", isMajor: false, error: false })));
        setResult(null);
        setHasError(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    };

    const handleCalculate = () => {
        let errorFound = false;
        const validSubjects = subjects.filter(s => s.credit !== "" || s.grade !== "A+" || s.name !== "");
        
        // 아무것도 입력안한 경우 체크
        if (validSubjects.length === 0) {
            setHasError(true);
            const newSubjects = [...subjects];
            newSubjects[0].error = true;
            setSubjects(newSubjects);
            return;
        }

        const newSubjects = subjects.map(s => {
            // 행에 무언가 입력이 되었는데 학점이 빠진 경우 에러처리 (단, P/NP가 아닌 이상)
            if ((s.name || s.credit || s.grade !== "A+") && !s.credit) {
                errorFound = true;
                return { ...s, error: true };
            }
            return s;
        });

        if (errorFound) {
            setSubjects(newSubjects);
            setHasError(true);
            return;
        }

        setHasError(false);

        let totalC = 0, gpaC = 0, sum = 0;
        let majC = 0, majGpaC = 0, majSum = 0;
        let pnC = 0;

        validSubjects.forEach(s => {
            if (!s.credit) return;
            const c = parseFloat(s.credit);
            if (isNaN(c)) return;

            const isPn = s.grade === "P" || s.grade === "NP";
            const isP = s.grade === "P";
            
            totalC += c;
            if (s.isMajor) majC += c;

            if (isPn) {
                pnC += c;
            } else {
                gpaC += c;
                const score = GRADE_SCORES[scale][s.grade] || 0;
                sum += (c * score);
                
                if (s.isMajor) {
                    majGpaC += c;
                    majSum += (c * score);
                }
            }
        });

        const gpa = gpaC > 0 ? sum / gpaC : 0;
        const mGpa = majGpaC > 0 ? majSum / majGpaC : 0;

        setResult({
            calculated: true,
            totalCredits: totalC,
            gpaCredits: gpaC,
            totalGpa: gpa,
            majorCredits: majC,
            majorGpaCredits: majGpaC,
            majorGpa: mGpa,
            percentile: getPercentile(gpa, scale),
            pnCredits: pnC
        });
        setScrollTrigger(prev => prev + 1);
    };

    // [학점 변환기 기능]
    const handleResetConv = () => {
        setConvGpa("");
        setConvResult(null);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    };

    const handleConvert = () => {
        const val = parseFloat(convGpa);
        if (isNaN(val) || val <= 0) {
            setHasError(true);
            return;
        }
        
        setHasError(false);
        setConvResult({
            "4.5": convertGPA(val, convScale, "4.5"),
            "4.3": convertGPA(val, convScale, "4.3"),
            "4.0": convertGPA(val, convScale, "4.0"),
            "100": convertGPA(val, convScale, "100")
        });
        setScrollTrigger(prev => prev + 1);
    };

    const generateShareText = () => {
        if (activeTab === "calc" && result) {
            return `[🎓 학점 계산 결과]\n내 총 평점은 ${result.totalGpa.toFixed(2)} / ${scale}입니다.\n(전공 평점: ${result.majorGpa.toFixed(2)})\n\n📌 JIKO 학점 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/grade`;
        } else if (activeTab === "conv" && convResult) {
            return `[🎓 학점 변환 결과]\n4.5 만점 : ${convResult["4.5"]}\n4.3 만점 : ${convResult["4.3"]}\n4.0 만점 : ${convResult["4.0"]}\n100점 만점 : ${convResult["100"]}\n\n📌 JIKO 학점 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/grade`;
        }
        return '📌 JIKO 학점 계산기에서 확인하기 : \nhttps://jiko.kr/calculator/life/grade';
    };

    const handleCopy = async () => {
        if (!result && !convResult) return;
        await navigator.clipboard.writeText(generateShareText());
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 pb-safe w-full">
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold tracking-tight">🎓 학점 계산기</div>
            </div>

            {/* 상단 탭 (계산기 / 변환기) */}
            <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-2xl mb-6">
                <button
                    onClick={() => setActiveTab("calc")}
                    className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-200 ${
                        activeTab === "calc"
                            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                    학점 계산기
                </button>
                <button
                    onClick={() => setActiveTab("conv")}
                    className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-200 ${
                        activeTab === "conv"
                            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                    학점 변환기
                </button>
            </div>

            {/* 학점 계산기 영역 */}
            {activeTab === "calc" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 mb-4">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            기준 평점 선택
                        </label>
                        <div className="flex bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
                            {(["4.5", "4.3", "4.0", "100"] as ScaleType[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setScale(s)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                        scale === s 
                                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                >
                                    {s} 만점
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 text-center mb-1">
                            <div className="col-span-4 sm:col-span-5">과목명</div>
                            <div className="col-span-3 sm:col-span-2">학점</div>
                            <div className="col-span-3 sm:col-span-3">성적</div>
                            <div className="col-span-2 sm:col-span-2">전공</div>
                        </div>

                        {subjects.map((sub, idx) => (
                            <div key={sub.id} className="grid grid-cols-12 gap-2 items-center group">
                                <div className="col-span-4 sm:col-span-5 relative">
                                    <input
                                        type="text"
                                        placeholder="과목명"
                                        value={sub.name}
                                        onChange={(e) => handleSubjectChange(sub.id, "name", e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-3 sm:col-span-2">
                                    <input
                                        type="number"
                                        placeholder="학점"
                                        value={sub.credit}
                                        onChange={(e) => handleSubjectChange(sub.id, "credit", e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-900 border ${sub.error ? 'border-red-500 ring-2 ring-red-500/20 animate-[shake_0.5s_ease-in-out]' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <div className="col-span-3 sm:col-span-3">
                                    <select
                                        value={sub.grade}
                                        onChange={(e) => handleSubjectChange(sub.id, "grade", e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-center"
                                    >
                                        {GRADES[scale].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-2 flex justify-center items-center gap-1">
                                    <input
                                        type="checkbox"
                                        checked={sub.isMajor}
                                        onChange={(e) => handleSubjectChange(sub.id, "isMajor", e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    {subjects.length > 1 && (
                                        <button 
                                            onClick={() => handleRemoveSubject(sub.id)}
                                            className="hidden sm:flex text-gray-400 hover:text-red-500 p-1 ml-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAddSubject}
                        className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        과목 추가하기
                    </button>
                </div>
            )}

            {/* 학점 변환기 영역 */}
            {activeTab === "conv" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 mb-4">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            내 대학교 기준 평점
                        </label>
                        <div className="flex bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
                            {(["4.5", "4.3", "4.0", "100"] as ScaleType[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setConvScale(s)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                        convScale === s 
                                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                            변환할 학점(평점) 입력
                        </label>
                        <input
                            type="number"
                            placeholder="예: 3.8"
                            value={convGpa}
                            onChange={(e) => setConvGpa(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {hasError && activeTab === "calc" && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 mb-4 rounded-xl text-center border border-red-100 animate-pulse">
                    🚨 필수 입력 항목(학점/과목 등)을 확인해 주세요.
                </div>
            )}
            
            {hasError && activeTab === "conv" && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 mb-4 rounded-xl text-center border border-red-100 animate-pulse">
                    🚨 변환할 학점을 정확히 입력해 주세요.
                </div>
            )}

            {/* 하단 버튼 */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <CalculatorButtons 
                    onReset={activeTab === "calc" ? handleResetCalc : handleResetConv} 
                    onCalculate={activeTab === "calc" ? handleCalculate : handleConvert} 
                    calculateText={activeTab === "calc" ? "계산하기" : "변환하기"}
                />
            </div>

            {/* 결과 영역 - 학점 계산기 */}
            {activeTab === "calc" && result && (
                <div id="result-section" ref={resultRef} className="mt-8 animate-fade-slide-up">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
                        
                        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 text-center mb-6 mt-2">
                            <p className="text-blue-100 font-medium mb-1 tracking-tight">총 평점</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl md:text-6xl font-black">{result.totalGpa.toFixed(2)}</span>
                                <span className="text-xl text-blue-200 font-medium">/ {scale}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">전공 평점</p>
                                <p className="text-2xl font-black text-gray-800 dark:text-gray-100">
                                    {result.majorGpa.toFixed(2)} <span className="text-sm font-medium text-gray-400">/ {scale}</span>
                                </p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-800/50 text-center hover:scale-105 transition-transform">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">백분위</p>
                                <p className="text-2xl font-black text-emerald-500">
                                    {result.percentile.toFixed(1)} <span className="text-sm font-medium text-emerald-400">점</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700/50 text-left">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">📊 취득 학점 요약</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center">
                                    <span className="text-[11px] font-black text-gray-400 mb-1">총 이수 학점</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{result.totalCredits} 학점</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center">
                                    <span className="text-[11px] font-black text-gray-400 mb-1">전공 이수 학점</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{result.majorCredits} 학점</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center">
                                    <span className="text-[11px] font-black text-gray-400 mb-1">P/NP 학점</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{result.pnCredits} 학점</span>
                                </div>
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

            {/* 결과 영역 - 학점 변환기 */}
            {activeTab === "conv" && convResult && (
                <div id="result-section" ref={resultRef} className="mt-8 animate-fade-slide-up">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover:scale-105 transition-transform">
                                <p className="text-xs font-black text-gray-400 mb-1">4.5 만점</p>
                                <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{convResult["4.5"]}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover:scale-105 transition-transform">
                                <p className="text-xs font-black text-gray-400 mb-1">4.3 만점</p>
                                <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{convResult["4.3"]}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center hover:scale-105 transition-transform">
                                <p className="text-xs font-black text-gray-400 mb-1">4.0 만점</p>
                                <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{convResult["4.0"]}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-800/50 flex flex-col items-center justify-center hover:scale-105 transition-transform">
                                <p className="text-xs font-black text-emerald-500 mb-1">100점 만점</p>
                                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{convResult["100"]}</p>
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
