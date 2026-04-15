'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';

export default function Car() {
  const currentYear = new Date().getFullYear();
  const [engineType, setEngineType] = useState('내연기관'); // 내연기관, 전기차
  const [carType, setCarType] = useState('승용'); // 승용, 승합, 화물, 특수, 경차
  const [usageType, setUsageType] = useState('비영업용'); // 영업, 비영업

  const [engineCC, setEngineCC] = useState('2000');
  const [regYear, setRegYear] = useState(currentYear.toString());

  const [isYearlyPaid, setIsYearlyPaid] = useState(false);

  const [result, setResult] = useState<any>(null);
  const resultRef = useCalculatorScroll(result);

  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

  const handleInputChange = (setter: any, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setter(value);
    if (value) {
      const newErrors = new Set(errors);
      newErrors.delete(field);
      setErrors(newErrors);
      setErrorMessage('');
    }
  };

  const handleCalculate = () => {
    const newErrors = new Set<string>();

    if (engineType === '내연기관' && carType === '승용' && !engineCC) {
      newErrors.add('engineCC');
    }
    if (!regYear || parseInt(regYear) > currentYear || parseInt(regYear) < 1980) {
      newErrors.add('regYear');
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      // 첫 에러 난 곳 흔들기
      const firstError = newErrors.values().next().value as string;
      setShakeField(firstError);
      setErrorMessage(firstError === 'regYear' ? '올바른 최초 등록 연도(1980~현재)를 입력해주세요.' : '배기량을 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    let baseTax = 0;

    // 전기차 정액 (승용 기준 10만원, 영업은 2만원이나 여기서 뭉뚱그림. 비영업 10만원 기본)
    if (engineType === '전기차') {
      baseTax = usageType === '영업용' ? 20000 : 100000;
    } else {
      // 승용차 cc당 세액 (비영업용)
      if (carType === '승용') {
        const cc = parseInt(engineCC || '0', 10);
        if (usageType === '비영업용') {
          if (cc <= 1000) baseTax = cc * 80;
          else if (cc <= 1600) baseTax = cc * 140;
          else baseTax = cc * 200;
        } else { // 영업용
          if (cc <= 1000) baseTax = cc * 18;
          else if (cc <= 1600) baseTax = cc * 18;
          else if (cc <= 2000) baseTax = cc * 19;
          else if (cc <= 2500) baseTax = cc * 19;
          else baseTax = cc * 24;
        }
      } else if (carType === '경차') {
        baseTax = usageType === '비영업용' ? 1000 * 80 : 1000 * 18; // 임의 8만원. (cc에따라 다름)
      } else if (carType === '승합') {
        baseTax = usageType === '비영업용' ? 65000 : 25000; // 단순 정액
      } else if (carType === '화물') {
        baseTax = usageType === '비영업용' ? 28500 : 6600; // 단순 1톤 기준
      } else {
        baseTax = usageType === '비영업용' ? 58500 : 13500; // 특수차량 임의
      }
    }

    // 차령 경감율 산출 (비영업 승용차 대상. 화물/승합/특수 제외, 영업용/전기차 제외)
    // 그러나 전기차도 승용분류면 차령할인이 없다는 의견(법적으로 모호), 지자체마다 다르나 대개 비영업승용은 할인됨
    let discountRate = 0;
    const yearDiff = currentYear - parseInt(regYear, 10);
    const carAge = yearDiff + 1; // 1년차(신차) = 1

    if (carType === '승용' && usageType === '비영업용') {
      if (carAge >= 3) {
        discountRate = (carAge - 2) * 5;
        if (discountRate > 50) discountRate = 50;
      }
    }

    const agedDiscountAmount = Math.round(baseTax * (discountRate / 100));
    const discountedBaseTax = baseTax - agedDiscountAmount;

    // 지방교육세 (본세의 30%. 단 1000cc 이하 비영업, 영업용은 면제...이나 이 계산기에선 일반 승용 기준 30% 부과)
    let eduTax = 0;
    if (usageType === '비영업용' && carType === '승용') {
      const cc = parseInt(engineCC || '0', 10);
      if (!(engineType === '내연기관' && cc < 1000)) { // 경차급 제외
        eduTax = discountedBaseTax * 0.3;
      }
    }
    if (engineType === '전기차' && usageType === '비영업용') {
      eduTax = discountedBaseTax * 0.3; // 3만원
    }

    let rawTotal = discountedBaseTax + eduTax;

    // 연납 할인 (1월 기준 약 4.5% 전후, 편의상 연세액의 4.5%)
    let yearlyDiscount = 0;
    if (isYearlyPaid) {
      yearlyDiscount = Math.round(rawTotal * 0.045);
    }

    let finalTax = Math.floor((rawTotal - yearlyDiscount) / 10) * 10; // 10원단위 절사

    // 분할 (연납 안할 시 1기, 2기 분할 부과. 단 연세액 10만 이하면 6월 일괄납부)
    let isSinglePayment = rawTotal <= 100000;

    setResult({
      baseTax,
      discountRate,
      agedDiscountAmount,
      discountedBaseTax,
      eduTax,
      rawTotal,
      yearlyDiscount,
      finalTax,
      isSinglePayment,
      isYearlyPaid
    });

    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setEngineType('내연기관');
    setCarType('승용');
    setUsageType('비영업용');
    setEngineCC('2000');
    setRegYear(currentYear.toString());
    setIsYearlyPaid(false);

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

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[🚗 자동차세 계산 결과]\n\n차량 종류 : ${engineType} ${carType}\n납부 조건 : ${result.isYearlyPaid ? '연납 (일시납)' : '정기분 분할'}\n\n자동차세(경감후) : ${formatNumber(result.discountedBaseTax)}원\n지방교육세 : ${formatNumber(result.eduTax)}원\n${result.yearlyDiscount > 0 ? `연납 공제액 : -${formatNumber(result.yearlyDiscount)}원\n` : ''}\n총 납부세금 : ${formatNumber(result.finalTax)}원\n\n📌JIKO 자동차세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/car`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
            🚗 자동차세 계산기
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
            {['내연기관', '전기차'].map((type) => (
              <button
                key={type}
                className={`flex-1 min-w-[70px] py-2 text-sm font-bold rounded-lg transition-colors ${engineType === type ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setEngineType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">차종 구분</label>
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="승용">승용차</option>
                <option value="경차">경승용차 (1000cc 미만)</option>
                <option value="승합">승합차 (11인승 이상 버스 등)</option>
                <option value="화물">화물차 (탑차, 트럭 등)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">사용 용도</label>
              <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl h-[50px]">
                {['비영업용', '영업용'].map(use => (
                  <button key={use} onClick={() => setUsageType(use)} className={`flex-1 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${usageType === use ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{use}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engineType === '내연기관' && carType === '승용' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">배기량 (cc)</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={engineCC}
                    onChange={handleInputChange(setEngineCC, 'engineCC')}
                    placeholder="예: 1998"
                    className={`w-full p-3 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('engineCC') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'engineCC' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">cc</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">최초 등록 연도</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  value={regYear}
                  onChange={handleInputChange(setRegYear, 'regYear')}
                  placeholder="예: 2021"
                  className={`w-full p-3 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('regYear') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'regYear' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">년식</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2">할인 혜택 옵션</h3>

            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <div>
                <span className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">연납 (일시납) 신청</span>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">1월 신청 기준 약 4.5% 전후 할인</p>
              </div>
              <button
                onClick={() => setIsYearlyPaid(!isYearlyPaid)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isYearlyPaid ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearlyPaid ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

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
            <div className="absolute -right-10 -top-10 text-9xl opacity-10">🚙</div>

            <h3 className="text-indigo-100 text-lg mb-2 opacity-80">최종 청구 세액</h3>
            <div className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              {formatNumber(result.finalTax)}<span className="text-2xl ml-2 font-semibold">원</span>
            </div>
            {result.discountRate > 0 && (
              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-sm font-bold mb-2 backdrop-blur-sm shadow-sm border border-white/30 truncate max-w-full">
                ✨ 차령 {result.discountRate}% 경감 ({formatNumber(result.agedDiscountAmount)}원 할인)
              </div>
            )}
            {result.yearlyDiscount > 0 && (
              <div className="block w-fit bg-emerald-500/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm border border-emerald-500/30 text-emerald-100">
                💰 연납 신청으로 {formatNumber(result.yearlyDiscount)}원 추가 절약!
              </div>
            )}

            {!result.isYearlyPaid && (
              <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-indigo-500/30">
                <div>
                  <p className="text-indigo-200 text-xs mb-1">1기분 (6월 청구)</p>
                  <p className="text-lg font-bold">{result.isSinglePayment ? formatNumber(result.finalTax) : formatNumber(result.finalTax / 2)} 원</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-xs mb-1">2기분 (12월 청구)</p>
                  <p className="text-lg font-bold">{result.isSinglePayment ? '0' : formatNumber(result.finalTax / 2)} 원</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span>세금 산출 상세 산식</span>
              <span className="text-xs text-indigo-500">{carType}/{usageType}</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>표준 자동차세 본세액 (전액)</span>
                <span className="font-semibold">{formatNumber(result.baseTax)} 원</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span className="text-indigo-500 font-bold">(-) 차령 노후 경감액</span>
                <span className="font-semibold text-indigo-500">-{formatNumber(result.agedDiscountAmount)} 원</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>지방교육세 (경감 본세의 30%)</span>
                <span className="font-semibold">{formatNumber(result.eduTax)} 원</span>
              </div>
              <div className="border-t border-dashed border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
              <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-100">
                <span className="text-gray-700 dark:text-gray-200">연간 합계 부과액</span>
                <span>{formatNumber(result.rawTotal)} 원</span>
              </div>
              {result.yearlyDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 mt-2 font-bold">
                  <span>(-) 연납 공제 (선납 할인)</span>
                  <span>-{formatNumber(result.yearlyDiscount)} 원</span>
                </div>
              )}
            </div>
          </div>

          <CalculatorActions
            onCopy={handleCopy}
            shareTitle="[🚗 자동차세 계산 결과]"
            shareDescription={`기준연도 : ${regYear}년\n총세액 : ${formatNumber(result.finalTax)}원`}
          />
        </div>
      )}
    </div>
  );
}
