"use client";

import { useState, useEffect } from "react";
import { ANIMATION } from "@/app/config/animationConfig";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import CalculatorActions from "@/app/calculator/components/CalculatorActions";
import { useCalculatorScroll } from "@/app/calculator/hooks/useCalculatorScroll";

const Age = () => {
    const today = new Date();
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [refDate, setRefDate] = useState(today.toISOString().split("T")[0]);

    // 결과 네비게이션을 위한 상태 (출생년도를 직접 조정함)
    const [viewAgeOffset, setViewAgeOffset] = useState(0);

    const [calculated, setCalculated] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [errorMessage, setErrorMessage] = useState("");

    const resultRef = useCalculatorScroll(calculated);

    const handleCalculate = () => {
        const newErrors = new Set<string>();
        if (!birthYear || birthYear.length !== 4) newErrors.add("birthYear");
        if (!birthMonth) newErrors.add("birthMonth");
        if (!birthDay) newErrors.add("birthDay");

        setErrors(newErrors);

        if (newErrors.size > 0) {
            setErrorMessage("생년월일을 정확히 입력해주세요.");
            setCalculated(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        const bY = Number(birthYear);
        const bM = Number(birthMonth);
        const bD = Number(birthDay);

        // 유효성 검사 (윤달 등)
        const dateObj = new Date(bY, bM - 1, bD);
        if (dateObj.getFullYear() !== bY || dateObj.getMonth() !== bM - 1 || dateObj.getDate() !== bD) {
            setErrorMessage("유효하지 않은 날짜입니다.");
            newErrors.add("birthYear");
            newErrors.add("birthMonth");
            newErrors.add("birthDay");
            setErrors(newErrors);
            setCalculated(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            return;
        }

        setErrorMessage("");
        setCalculated(true);
        setViewAgeOffset(0); // 초기화
    };

    const handleReset = () => {
        setBirthYear("");
        setBirthMonth("");
        setBirthDay("");
        setRefDate(today.toISOString().split("T")[0]);
        setCalculated(false);
        setErrors(new Set());
        setErrorMessage("");
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
        setViewAgeOffset(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const navigateResult = (offset: number) => {
        // ▶(오른쪽) 클릭시 offset=1 -> viewAgeOffset 증가 -> 나이 증가 -> 출생년도 감소
        setViewAgeOffset(prev => prev + offset);
    };

    // --- 계산 데이터 (viewAgeOffset 반영) ---
    const baseBY = Number(birthYear);
    // viewDate는 항상 현재 설정된 기준일(refDate)로 고정
    const viewDate = new Date(refDate);
    const vY = viewDate.getFullYear();
    const vM = viewDate.getMonth() + 1;
    const vD = viewDate.getDate();

    // 실제 표시되는 출생년도 (offset만큼 조절)
    const bY = baseBY - viewAgeOffset;
    const bM = Number(birthMonth);
    const bD = Number(birthDay);

    // 1. 만 나이
    let intlAge = vY - bY;
    if (vM < bM || (vM === bM && vD < bD)) {
        intlAge -= 1;
    }

    // 2. 연 나이
    const yearAge = vY - bY;

    // 3. 세는 나이
    const koreanAge = yearAge + 1;

    // 4. 띠 로직
    const zodiacs = [
        { name: "쥐", emoji: "🐭" }, { name: "소", emoji: "🐮" }, { name: "호랑이", emoji: "🐯" },
        { name: "토끼", emoji: "🐰" }, { name: "용", emoji: "🐲" }, { name: "뱀", emoji: "🐍" },
        { name: "말", emoji: "🐴" }, { name: "양", emoji: "🐑" }, { name: "원숭이", emoji: "🐵" },
        { name: "닭", emoji: "🐔" }, { name: "개", emoji: "🐶" }, { name: "돼지", emoji: "🐷" }
    ];

    const getZodiacInfo = (year: number) => {
        const index = (year - 4) % 12;
        return zodiacs[index < 0 ? index + 12 : index];
    };

    // 나의 원본 띠
    const myOriginalZodiac = getZodiacInfo(baseBY);
    // 현재 보고 있는 출생년도의 띠
    const viewZodiac = getZodiacInfo(bY);

    // 5. 육십갑자 계산 (그 해의 연도 명칭)
    const getSexagenary = (year: number) => {
        const heavenlyStems = ["갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
        const earthlyBranches = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];
        
        const hIdx = (year - 4) % 10;
        const eIdx = (year - 4) % 12;
        
        return heavenlyStems[hIdx < 0 ? hIdx + 10 : hIdx] + earthlyBranches[eIdx < 0 ? eIdx + 12 : eIdx];
    };
    
    // 타겟 연도 기준일의 육십갑자
    const sexagenaryYear = getSexagenary(vY);

    // 6. 나이별 용어 정보
    const AGE_TERMS: { [key: number]: string } = {
        15: "지학(志學)",
        20: "약관(弱冠)",
        30: "이립(而立)",
        40: "불혹(不惑)",
        50: "지명(知命)",
        60: "이순(耳順)",
        61: "환갑(還甲)",
        70: "고희(古稀)",
        80: "산수(傘壽)",
        90: "졸수(卒壽)",
        100: "상수(上壽)"
    };
    const ageTerm = AGE_TERMS[intlAge];

    // 7. 선거 정보
    const firstElectionYear = bY + 18;

    // 8. 살아온 날들
    const birthDateObj = new Date(bY, bM - 1, bD);
    const diffTime = Math.abs(viewDate.getTime() - birthDateObj.getTime());
    const daysLived = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const handleCopy = async () => {
        const text = [
            `[🎂 나이 계산기 결과]`,
            `출생일 : ${bY}-${bM}-${bD} (${viewZodiac.name}띠)`,
            `기준일 : ${vY}년 ${sexagenaryYear}년 기준`,
            `만 나이 : ${intlAge}세${ageTerm ? ` ${ageTerm}` : ""}`,
            `연 나이 : ${yearAge}세`,
            `첫 투표 가능 : ${firstElectionYear}년`,
            `\n📌JIKO 나이 계산기에서 확인하기 :`,
            `https://jiko.kr/calculator/life/age`
        ].join("\n");
        await navigator.clipboard.writeText(text);
    };

    const scrollZodiacIntoView = (name: string) => {
        const container = document.getElementById("zodiac-scroll-container");
        const activeItem = document.getElementById(`zodiac-${name}`);
        if (container && activeItem) {
            const scrollLeft = activeItem.offsetLeft - container.offsetWidth / 2 + activeItem.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    };

    // 탐색 중인 출생년도의 띠가 바뀔 때 자동 스크롤
    useEffect(() => {
        if (calculated) {
            setTimeout(() => scrollZodiacIntoView(viewZodiac.name), 100);
        }
    }, [viewZodiac.name, calculated]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className={`max-w-3xl mx-auto px-4 py-8 pb-safe ${ANIMATION.pageEnter ? "animate-fade-in" : ""}`}>

                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold tracking-tight">🎂 나이 계산기</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                    <div className="space-y-4">
                        <label htmlFor="birth-year" className="block text-sm font-bold text-gray-700 dark:text-gray-200">생년월일 (출생일)</label>
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                id="birth-year"
                                type="text"
                                inputMode="numeric"
                                placeholder="연도(4자)"
                                value={birthYear}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                    setBirthYear(val);
                                    setCalculated(false);
                                    if (val.length === 4) setErrors((prev: Set<string>) => { const n = new Set(prev); n.delete("birthYear"); return n; });
                                }}
                                className={`h-14 px-4 text-center font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none transition-all ${errors.has("birthYear") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-100 dark:border-gray-700 focus:border-blue-500 ring-blue-500/10 focus:ring-4"
                                    }`}
                            />
                            <div className="relative group">
                                <select
                                    id="birth-month"
                                    value={birthMonth}
                                    onChange={(e) => {
                                        setBirthMonth(e.target.value);
                                        setCalculated(false);
                                        setErrors((prev: Set<string>) => { const n = new Set(prev); n.delete("birthMonth"); return n; });
                                    }}
                                    className={`w-full h-14 pl-4 pr-10 text-center font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none appearance-none transition-all cursor-pointer ${errors.has("birthMonth") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-100 dark:border-gray-700 focus:border-blue-500 ring-blue-500/10 focus:ring-4"
                                        }`}
                                >
                                    <option value="">월</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m}>{m}월</option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors text-[10px]">▼</span>
                            </div>
                            <div className="relative group">
                                <select
                                    id="birth-day"
                                    value={birthDay}
                                    onChange={(e) => {
                                        setBirthDay(e.target.value);
                                        setCalculated(false);
                                        setErrors((prev: Set<string>) => { const n = new Set(prev); n.delete("birthDay"); return n; });
                                    }}
                                    className={`w-full h-14 pl-4 pr-10 text-center font-bold bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl outline-none appearance-none transition-all cursor-pointer ${errors.has("birthDay") ? "border-red-500 ring-4 ring-red-500/10" : "border-gray-100 dark:border-gray-700 focus:border-blue-500 ring-blue-500/10 focus:ring-4"
                                        }`}
                                >
                                    <option value="">일</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}일</option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors text-[10px]">▼</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="ref-date" className="block text-sm font-bold text-gray-700 dark:text-gray-200">기준일 (나이 알고 싶은 날)</label>
                        <input
                            id="ref-date"
                            type="date"
                            value={refDate}
                            onChange={(e) => { setRefDate(e.target.value); setCalculated(false); }}
                            className="w-full h-14 px-4 font-bold bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:border-blue-500 ring-blue-500/10 focus:ring-4 transition-all"
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className={`flex-1 h-14 border-2 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 ${shaking ? "animate-shake" : ""}`}
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleCalculate}
                                className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                            >
                                나이 계산하기
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-center text-red-500 text-sm font-bold animate-pulse">{errorMessage}</p>
                        )}
                    </div>
                </div>

                {/* 결과 영역 */}
                {calculated && (
                    <div ref={resultRef} className={`mt-8 space-y-6 ${ANIMATION.resultBox ? "animate-fade-slide-up" : ""}`}>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600"></div>

                            <div className="flex items-center justify-between mb-2">
                                <button onClick={() => navigateResult(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-500 transition-colors">◀</button>
                                <p className="text-[16px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full tracking-tighter">
                                    {vY}년 기준 {bY}년생({viewZodiac.name}띠)
                                </p>
                                <button onClick={() => navigateResult(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-blue-500 transition-colors">▶</button>
                            </div>

                            <p className="text-[14px] font-bold text-gray-400 mb-2">만 나이</p>
                            <h2 className="text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
                                {intlAge}<span className="text-3xl ml-1 text-gray-400 font-bold">세</span>
                                {ageTerm && <span className="block text-lg mt-1 text-blue-600 dark:text-blue-400 font-bold tracking-tight">{ageTerm}</span>}
                            </h2>

                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-gray-50 dark:border-gray-700/50">
                                <div className="space-y-1">
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">연 나이</p>
                                    <p className="text-2xl font-black text-gray-800 dark:text-gray-100">{yearAge}세</p>
                                </div>
                                <div className="space-y-1 border-l border-gray-100 dark:border-gray-700/50">
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">세는 나이</p>
                                    <p className="text-2xl font-black text-gray-800 dark:text-gray-100">{koreanAge}세</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">해당 나이의 띠</p>
                                </div>
                                <div className="relative group/zodiac">
                                    <div 
                                        id="zodiac-scroll-container"
                                        className="flex overflow-x-auto py-6 gap-6 scrollbar-hide snap-x px-4 no-scrollbar"
                                    >
                                        {[...zodiacs].reverse().map((z, idx) => {
                                            const isViewZodiac = z.name === viewZodiac.name;
                                            const isMyOriginal = z.name === myOriginalZodiac.name;
                                            return (
                                                <div
                                                    id={`zodiac-${z.name}`}
                                                    key={idx}
                                                    className={`flex flex-col items-center gap-1 shrink-0 snap-center transition-all duration-300 ${isViewZodiac ? "scale-125 opacity-100" : "opacity-40"}`}
                                                >
                                                    <span className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl relative ${isViewZodiac ? "bg-amber-100 text-amber-600 shadow-xl ring-4 ring-amber-500/20" : "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"}`}>
                                                        {z.emoji}
                                                        {isMyOriginal && (
                                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" title="나의 실제 띠"></span>
                                                        )}
                                                    </span>
                                                    <p className={`text-[11px] font-black ${isViewZodiac ? "text-amber-600" : "text-gray-400"}`}>{z.name}띠</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
                                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
                                </div>
                                <p className="mt-2 text-[10px] text-gray-400 font-bold">{bY}년생은 {viewZodiac.name}띠입니다. (나의 실제 띠: {myOriginalZodiac.name}띠)</p>
                            </div>

                            <div className="mt-8 px-4 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🗓️</span>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{bY}년생 기준 {daysLived.toLocaleString()}일째</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-md border tracking-tighter transition-all hover:scale-105">D+{daysLived}</span>
                            </div>

                            <CalculatorActions
                                onCopy={handleCopy}
                                shareTitle={`[🎂 나이 계산기 결과] ${intlAge}세 ${ageTerm || ""}`}
                                shareDescription={`${bY}년생은 만 ${intlAge}세 (${viewZodiac.name}띠) 입니다.`}
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                                나이별 용어 정보 (만 나이 기준)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(AGE_TERMS).map(([age, term]) => (
                                    <div key={age} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                        <span className={`text-sm font-black ${Number(age) === intlAge ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                                            {term}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">{age}세</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-[11px] text-gray-400 font-medium leading-relaxed">
                                ※ 공자(孔子)의 논어에서 유래하거나 동양 전통 예법에서 유래한 명칭들입니다. <br />
                                ※ 전통적으로는 '세는 나이' 기준이나, 현대적 의미 전달을 위해 만 나이 수치에 맞춰 안내해 드립니다.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                생애 주기 마일스톤 ({bY}년생 기준)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { title: "초등학교 입학", year: bY + 7, emoji: "🎒" },
                                    { title: "중학교 입학", year: bY + 13, emoji: "🏫" },
                                    { title: "고등학교 입학", year: bY + 16, emoji: "✍️" },
                                    { title: "대학교 입학", year: bY + 19, emoji: "🎓" },
                                    { title: "운전면허 취득 시작", year: bY + 18, emoji: "🏎️", highlight: true },
                                    { title: "최초 선거권 발생", year: bY + 18, emoji: "🗳️", highlight: true },
                                    { title: "청소년 보호 해제", year: bY + 19, emoji: "🎉", highlight: true },
                                    { title: "경로 우대 기점 (만 65세)", year: bY + 65, emoji: "🧓" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-900/50 p-3 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${item.highlight ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100" : "bg-white dark:bg-gray-900 border"}`}>
                                            {item.emoji}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className={`text-sm font-black ${item.highlight ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-100"}`}>{item.title}</p>
                                            <p className="text-xs text-gray-500 font-bold">{item.year}년 시작 예상</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <InstallBanner />
            </div>
        </div>
    );
};

export default Age;
