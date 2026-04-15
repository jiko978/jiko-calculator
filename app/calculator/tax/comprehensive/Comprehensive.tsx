'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';
import CalculatorTabs from '../../components/CalculatorTabs';

export default function Comprehensive() {
  const taxTabs = [
    { label: "재산세 (7월, 9월)", href: "/calculator/tax/property" },
    { label: "종합부동산세 (12월)", href: "/calculator/tax/comprehensive" },
  ];

  const [isFirstHome, setIsFirstHome] = useState(true); // 1주택(12억공제), 다주택/일반(9억공제)
  const [sharePercent, setSharePercent] = useState('100'); // %
  const [valPrice, setValPrice] = useState('');

  // 1주택 전용 특별공제 (연령/보유기간 최대합 80%)
  const [ageDiscount, setAgeDiscount] = useState('0'); // 0, 20, 30, 40
  const [holdingDiscount, setHoldingDiscount] = useState('0'); // 0, 20, 40, 50

  const [result, setResult] = useState<any>(null);
  const resultRef = useCalculatorScroll(result);

  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setValPrice(value);
    if (value) {
      const newErrors = new Set(errors);
      newErrors.delete('valPrice');
      setErrors(newErrors);
      setErrorMessage('');
    }
  };

  const handleShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (parseInt(v, 10) > 100) v = '100';
    setSharePercent(v);
  };

  const addAmount = (addValue: number) => {
    const current = parseInt(valPrice || '0', 10);
    setValPrice((current + addValue).toString());
    const newErrors = new Set(errors);
    newErrors.delete('valPrice');
    setErrors(newErrors);
    setErrorMessage('');
  };

  const handleCalculate = () => {
    const newErrors = new Set<string>();

    if (!valPrice || parseInt(valPrice, 10) === 0) {
      newErrors.add('valPrice');
      setErrors(newErrors);
      setShakeField('valPrice');
      setErrorMessage('공시가격 총합을 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    const price = parseInt(valPrice, 10);
    const sp = parseInt(sharePercent || '100', 10) / 100;

    // 내 지분 만큼의 공시가격 도출
    const mySharePrice = price * sp;

    // 기본 공제액 판단. 1주택 단독 12억, 그외 9억
    const isStandardFirst = isFirstHome && sp === 1; // 1주택 단독(100%지분)이면 12억, 아니면 9억 (공동명의자 1주택특례 변경은 생략 간소화)
    const deduction = isStandardFirst ? 1200000000 : 900000000;

    let taxBase = 0;
    if (mySharePrice > deduction) {
      // 공정시장가액비율 종부세 60%
      taxBase = (mySharePrice - deduction) * 0.6;
    }

    let compTax = 0; // 종부세액
    if (taxBase > 0) {
      // 세율 계산 (참고용 약식 세율: 일반주택 기준. 3억이하 0.5%, 6억 0.7%, 12억 1.0%, 25억 1.3%)
      if (taxBase <= 300000000) {
        compTax = taxBase * 0.005;
      } else if (taxBase <= 600000000) {
        compTax = taxBase * 0.007 - 600000;
      } else if (taxBase <= 1200000000) {
        compTax = taxBase * 0.01 - 2400000;
      } else if (taxBase <= 2500000000) {
        compTax = taxBase * 0.013 - 6000000;
      } else {
        compTax = taxBase * 0.015 - 11000000;
      }
    }

    // 재산세 중복분 차감 로직 (정교한 식이 있으나 계산기에서는 통상 종부세액의 약 20%~25%를 재산세 공제분으로 단순화하거나 과표비율로 구함)
    // 여기서는 복잡한 이중과세 배제 식 대신, 모의로 약 22%로 일괄 차감 적용
    let propTaxDuplication = Math.round(compTax * 0.22);
    let netTax = compTax - propTaxDuplication; // 산출세액

    // 나이/보유 세액공제 (1주택자 단독 한정, 최대 80%)
    let specialDiscount = 0;
    let totalDiscountRate = 0;
    if (isStandardFirst && netTax > 0) {
      const aRate = parseInt(ageDiscount, 10);
      const hRate = parseInt(holdingDiscount, 10);
      totalDiscountRate = Math.min(80, aRate + hRate);
      specialDiscount = netTax * (totalDiscountRate / 100);
    }

    let finalCompTax = netTax - specialDiscount;
    if (finalCompTax < 0) finalCompTax = 0;

    // 농어촌특별세 (최종 종부세액의 20%)
    let farmTax = finalCompTax * 0.2;
    let totalTax = finalCompTax + farmTax;

    setResult({
      price,
      sp: sp * 100,
      mySharePrice,
      deduction,
      taxBase,
      compTax,
      propTaxDuplication,
      netTax,
      totalDiscountRate,
      specialDiscount,
      finalCompTax,
      farmTax,
      totalTax
    });

    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setIsFirstHome(true);
    setSharePercent('100');
    setValPrice('');
    setAgeDiscount('0');
    setHoldingDiscount('0');

    setResult(null);
    setErrors(new Set());
    setErrorMessage('');

    const btn = document.getElementById("resetBtn");
    if (btn) {
      btn.classList.add("animate-[shake_0.5s_ease-in-out]");
      setTimeout(() => {
        btn.classList.remove("animate-[shake_0.5s_ease-in-out]");
      }, 500);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[🏛️ 종합부동산세 계산 결과]\n\n보유지분 ${result.sp}% 기준 공시가 : ${formatNumber(result.mySharePrice)}원\n기본 공제액 : ${formatNumber(result.deduction)}원\n과세 표준액 : ${formatNumber(result.taxBase)}원\n\n종부세 산출(중복차감) : ${formatNumber(result.netTax)}원\n${result.specialDiscount > 0 ? `노후/보유 특별공제(-${result.totalDiscountRate}%) : -${formatNumber(result.specialDiscount)}원\n` : ''}최종 종부세 : ${formatNumber(result.finalCompTax)}원\n농어촌특별세 : ${formatNumber(result.farmTax)}원\n총 고지세액 : ${formatNumber(result.totalTax)}원\n\n📌JIKO 종합부동산세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/comprehensive`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex justify-center flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
              🏛️ 종부세 계산기
            </span>
          </div>
        </div>

        <CalculatorTabs tabs={taxTabs} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">총 주택 공시가격 (물건 전체)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={valPrice ? formatNumber(parseInt(valPrice)) : ''}
                    onChange={handleInputChange}
                    placeholder="예: 1,500,000,000"
                    className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('valPrice') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'valPrice' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">₩</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => setValPrice('')} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                  {[10000000, 50000000, 100000000, 500000000, 1000000000].map((val) => (
                    <button
                      key={val}
                      onClick={() => addAmount(val)}
                      className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all active:scale-95"
                    >
                      +{val >= 100000000 ? `${val / 100000000}억` : `${val / 10000000}천`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">보유 지분율 (%)</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={3}
                    value={sharePercent}
                    onChange={handleShareChange}
                    className="w-full p-3 pr-8 text-right bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">지분</span>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</div>
                </div>
                <p className="mt-2 text-xs text-gray-500">지분 50% 공동명의 시, 각 인별금액은 면세범위인 9억에 각각 대입됩니다.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2">기본 제반 요건</h3>

              <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <div>
                  <span className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">1세대 1주택 여부</span>
                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">1주택자일 경우 기본공제 12억 원으로 대폭 향상</p>
                </div>
                <button onClick={() => setIsFirstHome(!isFirstHome)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFirstHome ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFirstHome ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* 단독명의 1주택자 특별공제 */}
            {isFirstHome && sharePercent === '100' && (
              <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✨ 노후 및 장기보유 특별 세액공제 (최대 80%)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">고령자 공제 (나이)</label>
                    <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
                      {[{ l: '해당없음', v: '0' }, { l: '60세 이상(20%)', v: '20' }, { l: '65세 이상(30%)', v: '30' }, { l: '70세 이상(40%)', v: '40' }].map((item) => (
                        <button
                          key={item.v}
                          className={`flex-1 min-w-[70px] py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors ${ageDiscount === item.v ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                          onClick={() => setAgeDiscount(item.v)}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">장기보유 공제 (기간)</label>
                    <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
                      {[{ l: '해당없음', v: '0' }, { l: '5년 이상(20%)', v: '20' }, { l: '10년 이상(40%)', v: '40' }, { l: '15년 이상(50%)', v: '50' }].map((item) => (
                        <button
                          key={item.v}
                          className={`flex-1 min-w-[70px] py-1.5 px-1 text-[11px] font-bold rounded-lg transition-colors ${holdingDiscount === item.v ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                          onClick={() => setHoldingDiscount(item.v)}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <CalculatorButtons onReset={handleReset} onCalculate={handleCalculate} />
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
                🚨 {errorMessage}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-indigo-600 relative to-indigo-800 rounded-3xl p-8 shadow-xl text-white overflow-hidden">
              <div className="absolute -right-10 -top-10 text-9xl opacity-10">🏛️</div>

              <h3 className="text-indigo-100 text-lg mb-2 opacity-80">총 종부세 고지 합계액</h3>

              {result.totalTax === 0 ? (
                <div className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                  0 <span className="text-2xl ml-2 font-semibold">원 (과세 대상 아님)</span>
                </div>
              ) : (
                <div className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                  {formatNumber(result.totalTax)}<span className="text-2xl ml-2 font-semibold">원</span>
                </div>
              )}

              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm border border-white/30 truncate max-w-full">
                🔍 지분 {result.sp}% 환산 자산가액 : {formatNumber(result.mySharePrice)}원 (기본공제 {result.deduction / 100000000}억 적용)
              </div>

              {result.specialDiscount > 0 && (
                <div className="block mt-2 bg-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm border border-emerald-500/30 text-emerald-100 w-fit">
                  💸 무려 {result.totalDiscountRate}% 특별 세액공제로 {formatNumber(result.specialDiscount)}원 차감!
                </div>
              )}

            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <span>세액 산출 계단표 보기</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>지분 공시가 - {result.deduction / 100000000}억 (공제)</span>
                  <span className="font-semibold text-gray-400">잔액 {formatNumber(Math.max(0, result.mySharePrice - result.deduction))} 원</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>종부세 과세표준 (공정시장 60%)</span>
                  <span className="font-semibold text-indigo-500">{formatNumber(result.taxBase)} 원</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>종부세 누진세 (재산세 이중과세 차감 전)</span>
                  <span className="font-semibold">{formatNumber(result.compTax)} 원</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 line-through decoration-red-500/50">
                  <span className="text-rose-500 font-medium">(-) 재산세 기납부분 중복 차감액</span>
                  <span className="font-semibold text-rose-500">-{formatNumber(result.propTaxDuplication)} 원</span>
                </div>

                {result.specialDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>(-) 특별 공제 (나이/보수)</span>
                    <span>-{formatNumber(result.specialDiscount)} 원</span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">최종 부과 종합부동산세액</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">{formatNumber(result.finalCompTax)} 원</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>(+) 별도 부과: 농어촌특별세 (20%)</span>
                  <span className="font-semibold">{formatNumber(result.farmTax)} 원</span>
                </div>
              </div>
            </div>

            <CalculatorActions
              onCopy={handleCopy}
              shareTitle="[🏛️ 종합부동산세 계산 결과]"
              shareDescription={`공시가 : ${formatNumber(result.mySharePrice)}원\n총세액 : ${formatNumber(result.totalTax)}원`}
            />
          </div>
        )}
      </div>
    </>
  );
}
