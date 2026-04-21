'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';

const INDUSTRY_RATES = [
  { label: '소매, 음식, 숙박, 운수', value: 0.15 },
  { label: '제조, 농림어업, 소매(일부)', value: 0.2 },
  { label: '건설, 부동산, 서비스업', value: 0.3 },
  { label: '금융, 보험, 부동산(임대)', value: 0.4 },
];

export default function Vat() {
  const [taxType, setTaxType] = useState<'GENERAL' | 'SIMPLIFIED'>('GENERAL');
  const [calcDirection, setCalcDirection] = useState<'FORWARD' | 'REVERSE'>('FORWARD');
  const [amount, setAmount] = useState<string>('');
  const [industryRate, setIndustryRate] = useState<number>(0.15);

  const [result, setResult] = useState<any>(null);
  const resultRef = useCalculatorScroll(result);

  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    if (value) {
      const newErrors = new Set(errors);
      newErrors.delete('amount');
      setErrors(newErrors);
      setErrorMessage('');
    }
  };

  const addAmount = (addValue: number) => {
    const currentAmount = parseInt(amount || '0', 10);
    setAmount((currentAmount + addValue).toString());
    const newErrors = new Set(errors);
    newErrors.delete('amount');
    setErrors(newErrors);
    setErrorMessage('');
  };

  const handleCalculate = () => {
    if (!amount || parseInt(amount, 10) === 0) {
      setErrors(new Set(['amount']));
      setShakeField('amount');
      setErrorMessage('금액을 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    const rawAmount = parseInt(amount, 10);
    let supplyAmount = 0;
    let vatAmount = 0;
    let totalAmount = 0;

    if (taxType === 'GENERAL') {
      if (calcDirection === 'FORWARD') {
        supplyAmount = rawAmount;
        vatAmount = rawAmount * 0.1;
        totalAmount = supplyAmount + vatAmount;
      } else {
        totalAmount = rawAmount;
        supplyAmount = totalAmount / 1.1;
        vatAmount = totalAmount - supplyAmount;
      }
    } else {
      // Simplified (General logic: Result shows Tax based on industry rate)
      totalAmount = rawAmount;
      vatAmount = totalAmount * industryRate * 0.1;
      supplyAmount = totalAmount - vatAmount;
    }

    setResult({
      supplyAmount,
      vatAmount,
      totalAmount,
      vatRate: (vatAmount / totalAmount) * 100,
    });
    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setAmount('');
    setResult(null);
    setErrors(new Set());
    setErrorMessage('');

    // Reset Shake effect
    const btn = document.getElementById("resetBtn");
    if (btn) {
      btn.classList.add("animate-[shake_0.5s_ease-in-out]");
      setTimeout(() => {
        btn.classList.remove("animate-[shake_0.5s_ease-in-out]");
      }, 500);
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[📊 부가세 계산 결과]\n\n구분 : ${taxType === 'GENERAL' ? '일반과세자' : '간이과세자'}\n기준 금액 : ${formatNumber(parseInt(amount))}원\n\n공급가액 : ${formatNumber(result.supplyAmount)}원\n부가세 : ${formatNumber(result.vatAmount)}원\n합계금액: ${formatNumber(result.totalAmount)}원\n\n📌JIKO 부가세 계산기에서 확인하기 :\nhttps://jiko.co.kr/calculator/tax/vat`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 타이틀 섹션 */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
            📊 부가세 계산기
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {/* 과세 유형 탭 */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${taxType === 'GENERAL' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setTaxType('GENERAL')}
            >
              일반과세자 (10%)
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${taxType === 'SIMPLIFIED' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setTaxType('SIMPLIFIED')}
            >
              간이과세자 (업종별)
            </button>
          </div>

          {/* 계산 방향 탭 (일반과세자일 때만) */}
          {taxType === 'GENERAL' && (
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcDirection === 'FORWARD' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setCalcDirection('FORWARD')}
              >
                순산 (공급가 → 합계)
              </button>
              <button
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${calcDirection === 'REVERSE' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setCalcDirection('REVERSE')}
              >
                역산 (합계 → 공급가)
              </button>
            </div>
          )}

          {/* 간이과세자 업종 선택 */}
          {taxType === 'SIMPLIFIED' && (
            <div className="space-y-3 px-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">업종군 선택 (부가가치율)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {INDUSTRY_RATES.map((rate) => (
                  <button
                    key={rate.value}
                    onClick={() => setIndustryRate(rate.value)}
                    className={`p-3 text-xs text-left border rounded-xl transition-all ${industryRate === rate.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                  >
                    <div className="font-bold mb-1">{rate.label}</div>
                    <div className="opacity-70">부가가치율: {rate.value * 100}%</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {taxType === 'SIMPLIFIED' ? '합계금액(공급대가)' : calcDirection === 'FORWARD' ? '공급가액(세전)' : '합계금액(세후)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount ? formatNumber(parseInt(amount)) : ''}
                  onChange={handleAmountChange}
                  placeholder="예: 10,000,000"
                  className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('amount') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'amount' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">₩</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => setAmount('')} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                {[10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => addAmount(val)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all active:scale-95"
                  >
                    +{val >= 100000000 ? `${val / 100000000}억` : val >= 10000000 ? `${val / 10000000}천` : val >= 1000000 ? `${val / 1000000}백` : `${val / 10000}만`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <CalculatorButtons onReset={handleReset} onCalculate={handleCalculate} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100 dark:border-red-800 animate-pulse">
              🚨 {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* 결과 섹션 */}
      {result && (
        <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
          <div className="bg-gradient-to-br from-indigo-600 relative to-indigo-800 rounded-3xl p-8 shadow-xl text-white overflow-hidden">
            <div className="absolute -right-10 -top-10 text-9xl opacity-10">📊</div>

            <h3 className="text-indigo-100 text-lg mb-2 opacity-80">최종 합계 금액</h3>
            <div className="text-5xl font-black tracking-tight mb-8">
              {formatNumber(result.totalAmount)}<span className="text-2xl ml-2 font-semibold">원</span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-indigo-500/30">
              <div>
                <p className="text-indigo-200 text-sm mb-1">공급가액 (Net)</p>
                <p className="text-xl font-bold">{formatNumber(result.supplyAmount)} 원</p>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-sm mb-1">부가가치세 (VAT)</p>
                <p className="text-xl font-bold text-yellow-200">+{formatNumber(result.vatAmount)} 원</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-indigo-200 mb-2">
                <span>세금 비중</span>
                <span>{result.vatRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-1000 ease-out"
                  style={{ width: `${result.vatRate}%` }}
                />
              </div>
            </div>
          </div>

          <CalculatorActions
            onCopy={handleCopy}
            shareTitle="[📊 부가세 계산 결과]"
            shareDescription={`공급가액 : ${formatNumber(result.supplyAmount)}원\n부가세 : ${formatNumber(result.vatAmount)}원\n합계 : ${formatNumber(result.totalAmount)}원`}
          />
        </div>
      )}
    </div>
  );
}
