'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';
import CalculatorTabs from '../../components/CalculatorTabs';

export default function Property() {
  const taxTabs = [
    { label: "재산세 (7월, 9월)", href: "/calculator/tax/property" },
    { label: "종합부동산세 (12월)", href: "/calculator/tax/comprehensive" },
  ];

  const [assetType, setAssetType] = useState('주택'); // 주택, 농지, 상가, 토지
  const [isFirstHome, setIsFirstHome] = useState(true); // 1주택
  const [hasUrbanTax, setHasUrbanTax] = useState(true); // 도시지역분

  const [sharePercent, setSharePercent] = useState('100'); // %
  const [valPrice, setValPrice] = useState('');

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
      setErrorMessage('공시가격을 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    const price = parseInt(valPrice, 10);
    const sp = parseInt(sharePercent || '100', 10) / 100;

    // 명의 지분만큼 공시가격 쪼개기. 재산세는 원래 물건기준 부과이나, 납부금 안내를 위해 나눔
    // 다만 과세표준은 물건전체로 구하고 산출세액에서 지분을 곱하는 것이 원칙!
    let marketRatio = 0.6; // 주택 60%
    if (assetType === '주택' && isFirstHome && price <= 900000000) {
      marketRatio = 0.45; // 1주택 특례 (가정)
    } else if (assetType === '상가' || assetType === '토지' || assetType === '농지') {
      marketRatio = 0.7; // 건축물, 토지
    }

    const taxBase = price * marketRatio; // 물건 전체 과세표준

    let propertyTax = 0; // 물건 전체 재산세액

    if (assetType === '주택') {
      let isSpecial = isFirstHome && price <= 900000000;
      // 주택 세율 (특례시 0.05%p 인하)
      if (taxBase <= 60000000) {
        propertyTax = taxBase * (isSpecial ? 0.0005 : 0.001);
      } else if (taxBase <= 150000000) {
        propertyTax = (isSpecial ? 30000 : 60000) + (taxBase - 60000000) * (isSpecial ? 0.001 : 0.0015);
      } else if (taxBase <= 300000000) {
        propertyTax = (isSpecial ? 120000 : 195000) + (taxBase - 150000000) * (isSpecial ? 0.002 : 0.0025);
      } else {
        propertyTax = (isSpecial ? 420000 : 570000) + (taxBase - 300000000) * (isSpecial ? 0.0035 : 0.004);
      }
    } else if (assetType === '상가') {
      propertyTax = taxBase * 0.0025; // 0.25%
    } else if (assetType === '토지') {
      propertyTax = taxBase * 0.002; // 종합합산 임의 (0.2~0.5%)
    } else if (assetType === '농지') {
      propertyTax = taxBase * 0.0007; // 0.07%
    } // 도시지역분은 과세표준의 0.14%

    let urbanTax = hasUrbanTax ? taxBase * 0.0014 : 0;

    // 본인 지분별 과세액 산출
    const myShareTaxBase = taxBase * sp;
    const myPropertyTax = propertyTax * sp;
    const myUrbanTax = urbanTax * sp;
    const myEduTax = myPropertyTax * 0.2;
    // 시설세 생략 (주택/상가 등 복잡, 여기선 패스 또는 0)
    const myTotalTax = myPropertyTax + myEduTax + myUrbanTax;

    // 분납(2번 고지 여부)
    let isSplit = assetType === '주택' && myTotalTax > 200000;

    setResult({
      price,
      shareVal: price * sp,
      myShareTaxBase,
      myPropertyTax,
      myUrbanTax,
      myEduTax,
      myTotalTax,
      isSplit,
      marketRatio: marketRatio * 100
    });

    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setAssetType('주택');
    setIsFirstHome(true);
    setHasUrbanTax(true);
    setSharePercent('100');
    setValPrice('');

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
    const text = `[📋 재산세 계산 결과]\n\n보유지분 ${sharePercent}% 기준\n대상 공시가 : ${formatNumber(result.shareVal)}원\n과세 표준액 : ${formatNumber(result.myShareTaxBase)}원\n\n재산세(본세) : ${formatNumber(result.myPropertyTax)}원\n지방교육세 : ${formatNumber(result.myEduTax)}원\n${hasUrbanTax ? `도시지역분 : ${formatNumber(result.myUrbanTax)}원\n` : ''}\n총 부과세액 : ${formatNumber(result.myTotalTax)}원\n\n📌JIKO 재산세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/property`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex justify-center flex-wrap gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
              📋 재산세 계산기
            </span>
          </div>
        </div>

        <CalculatorTabs tabs={taxTabs} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
              {['주택', '농지', '상가', '토지'].map((type) => (
                <button
                  key={type}
                  className={`flex-1 min-w-[70px] py-2 text-sm font-bold rounded-lg transition-colors ${assetType === type ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setAssetType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">공시가격 (시가표준액)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={valPrice ? formatNumber(parseInt(valPrice)) : ''}
                    onChange={handleInputChange}
                    placeholder="예: 500,000,000"
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
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2">과세 특례 및 연동 옵션</h3>

              {assetType === '주택' && (
                <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div>
                    <span className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm">1세대 1주택 혜택 적용</span>
                    <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">특례 세율 인하 및 공정시장가액비율 경감</p>
                  </div>
                  <button onClick={() => setIsFirstHome(!isFirstHome)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFirstHome ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFirstHome ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">도시지역분 부과 대상</span>
                  <p className="text-xs text-gray-500">대부분의 시/구 구역 내 부동산 (0.14% 합산)</p>
                </div>
                <button onClick={() => setHasUrbanTax(!hasUrbanTax)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasUrbanTax ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasUrbanTax ? 'translate-x-6' : 'translate-x-1'}`} />
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
              <div className="absolute -right-10 -top-10 text-9xl opacity-10">🏢</div>

              <h3 className="text-indigo-100 text-lg mb-2 opacity-80">총 부과 세액 ({sharePercent}% 지분)</h3>
              <div className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                {formatNumber(result.myTotalTax)}<span className="text-2xl ml-2 font-semibold">원</span>
              </div>

              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm border border-white/30">
                📊 과세표준 적용 : {formatNumber(result.myShareTaxBase)}원 (반영비율 {result.marketRatio}%)
              </div>

              {result.isSplit ? (
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-indigo-500/30">
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">1기분 (7월 16~31일)</p>
                    <p className="text-xl font-bold">{formatNumber(result.myTotalTax / 2)} 원</p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">2기분 (9월 16~30일)</p>
                    <p className="text-xl font-bold">{formatNumber(result.myTotalTax / 2)} 원</p>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-indigo-500/30">
                  <p className="text-indigo-200 text-sm">💡 세액 총합 20만 원 이하로, 7월에 전액 고지됩니다.</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <span>산출 구성 상세 보기</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>순수 재산세 (본세)</span>
                  <span className="font-semibold text-indigo-500">{formatNumber(result.myPropertyTax)} 원</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>지방교육세 (본세의 20%)</span>
                  <span className="font-semibold">{formatNumber(result.myEduTax)} 원</span>
                </div>
                {result.myUrbanTax > 0 && (
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                    <span>도시지역분 (과표의 0.14%)</span>
                    <span className="font-semibold">{formatNumber(result.myUrbanTax)} 원</span>
                  </div>
                )}
              </div>
            </div>

            <CalculatorActions
              onCopy={handleCopy}
              shareTitle="[📋 재산세 계산 결과]"
              shareDescription={`산출 부과세액 : ${formatNumber(result.myTotalTax)}원`}
            />
          </div>
        )}
      </div>
    </>
  );
}
