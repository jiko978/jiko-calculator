'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';

export default function Acquisition() {
  const [acquisitionType, setAcquisitionType] = useState('매매'); // 매매, 증여, 상속, 원시
  const [assetType, setAssetType] = useState('주택'); // 주택, 오피스텔, 상가/토지
  const [areaSize, setAreaSize] = useState('85㎡ 이하'); // 85이하, 85초과
  const [houseCount, setHouseCount] = useState('1주택'); // 1주택, 2주택, 3주택 이상

  const [isFirstHome, setIsFirstHome] = useState(false); // 생애최초
  const [isRegulatedArea, setIsRegulatedArea] = useState(false); // 조정대상지역

  const [acquisitionPrice, setAcquisitionPrice] = useState('');

  const [result, setResult] = useState<any>(null);
  const resultRef = useCalculatorScroll(result);

  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAcquisitionPrice(value);
    if (value) {
      const newErrors = new Set(errors);
      newErrors.delete('acquisitionPrice');
      setErrors(newErrors);
      setErrorMessage('');
    }
  };

  const addAmount = (addValue: number) => {
    const current = parseInt(acquisitionPrice || '0', 10);
    setAcquisitionPrice((current + addValue).toString());
    const newErrors = new Set(errors);
    newErrors.delete('acquisitionPrice');
    setErrors(newErrors);
    setErrorMessage('');
  };

  const resetAmount = () => {
    setAcquisitionPrice('');
  };

  const handleCalculate = () => {
    const newErrors = new Set<string>();

    if (!acquisitionPrice || parseInt(acquisitionPrice, 10) === 0) {
      newErrors.add('acquisitionPrice');
      setErrors(newErrors);
      setShakeField('acquisitionPrice');
      setErrorMessage('취득가액을 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    const price = parseInt(acquisitionPrice, 10);

    let acqRate = 0;
    let eduRate = 0;
    let farmRate = areaSize === '85㎡ 초과' && assetType === '주택' ? 0.002 : 0; // 농특세 0.2%
    // 예외: 오피스텔/상가는 취득세율 자체에 농특세 개념이 포함되어 4.6% 처리.

    // 취득세율 판정 로직 (약식 현행법 기준 1세대 1주택, 다주택자)
    if (assetType === '오피스텔' || assetType === '상가/토지') {
      acqRate = 0.04;
      eduRate = 0.004;
      farmRate = 0.002;
    } else if (acquisitionType === '증여') {
      acqRate = 0.035;
      eduRate = 0.003;
      farmRate = areaSize === '85㎡ 초과' ? 0.002 : 0;
      // 조정지역 3억 이상 증여 중과배제 로직 생략 (표준 3.5%)
    } else if (acquisitionType === '상속') {
      // 주산 2.8%, 농지 2.3% (주택은 무주택자 여부 등에 따라 추가 감면이 있으나 2.8%로 통일)
      acqRate = 0.028;
      eduRate = 0.0016;
      farmRate = areaSize === '85㎡ 초과' ? 0.002 : 0;
    } else {
      // 매매 (유상원시취득 포함 등) 주택 취득
      // 1주택 (조정/비조정 동일)
      if (houseCount === '1주택' || (!isRegulatedArea && houseCount === '2주택')) {
        if (price <= 600000000) { acqRate = 0.01; }
        else if (price <= 900000000) { acqRate = (price * 2 / 300000000 - 3) / 100; } // 1~3% 비례
        else { acqRate = 0.03; }
      } else if (isRegulatedArea && houseCount === '2주택') {
        acqRate = 0.08;
      } else if (!isRegulatedArea && houseCount === '3주택 이상') {
        acqRate = 0.08;
      } else {
        // 조정 3주택 이상
        acqRate = 0.12;
      }

      eduRate = acqRate * 0.1; // 취득세의 10%
    }

    let rawAcqTax = price * acqRate;
    let reduction = 0;

    // 생애최초 혜택: 주택, 유상거래 1주택자, 실거래 12억 이하
    if (isFirstHome && assetType === '주택' && houseCount === '1주택' && price <= 1200000000) {
      reduction = Math.min(rawAcqTax, 2000000);
    }

    let finalAcqTax = Math.max(0, rawAcqTax - reduction);
    let finalEduTax = Math.max(0, (finalAcqTax) * 0.1);
    let finalFarmTax = price * farmRate;

    let totalTax = finalAcqTax + finalEduTax + finalFarmTax;

    setResult({
      price,
      rawAcqTax,
      reduction,
      finalAcqTax,
      finalEduTax,
      finalFarmTax,
      totalTax,
      acqRate: acqRate * 100,
    });

    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setAcquisitionType('매매');
    setAssetType('주택');
    setAreaSize('85㎡ 이하');
    setHouseCount('1주택');
    setIsFirstHome(false);
    setIsRegulatedArea(false);
    setAcquisitionPrice('');

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

  const generateShareText = () => {
    if (!result) {
      return `📌 JIKO 취득세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/acquisition`;
    }
    return `[📑 취득세 계산 결과]\n\n취득유형: ${acquisitionType}\n물건종류: ${assetType}\n취득가액: ${formatNumber(result.price)}원\n\n취득세: ${formatNumber(result.finalAcqTax)}원\n지방교육세: ${formatNumber(result.finalEduTax)}원\n농어촌특별세: ${formatNumber(result.finalFarmTax)}원\n\n총 예상납부액: ${formatNumber(result.totalTax)}원\n\n📌 JIKO 취득세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/acquisition`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateShareText());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
            📑 취득세 계산기
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
            {['매매', '증여', '상속', '원시'].map((type) => (
              <button
                key={type}
                className={`flex-1 min-w-[70px] py-2 text-sm font-bold rounded-lg transition-colors ${acquisitionType === type ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setAcquisitionType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">물건 종류 (유형)</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="주택">주택 (아파트/아파트분양권)</option>
                <option value="오피스텔">오피스텔</option>
                <option value="상가/토지">상가 / 일반 토지</option>
              </select>
            </div>

            {assetType === '주택' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">전용 면적</label>
                <select
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="85㎡ 이하">국민주택 규모 이하 (85㎡ 이하)</option>
                  <option value="85㎡ 초과">국민주택 규모 초과 (85㎡ 초과)</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">취득가액 (계약금액)</label>
              <div className="relative">
                <input
                  type="text"
                  value={acquisitionPrice ? formatNumber(parseInt(acquisitionPrice)) : ''}
                  onChange={handleInputChange}
                  placeholder="예: 600,000,000"
                  className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has('acquisitionPrice') ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === 'acquisitionPrice' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">₩</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={resetAmount} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
                {[1000000, 5000000, 10000000, 50000000, 100000000, 500000000].map((val) => (
                  <button
                    key={val}
                    onClick={() => addAmount(val)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all active:scale-95"
                  >
                    +{val >= 100000000 ? `${val / 100000000}억` : val >= 10000000 ? `${val / 10000000}천` : `${val / 1000000}백`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2">세율 판정 옵션</h3>

            {assetType === '주택' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">보유 주택 수</span>
                  <p className="text-xs text-gray-500">조정 2주택, 비조정 3주택부터 무거운 세율 부과</p>
                </div>
                <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  {['1주택', '2주택', '3주택 이상'].map(hc => (
                    <button key={hc} onClick={() => setHouseCount(hc)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${houseCount === hc ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{hc}</button>
                  ))}
                </div>
              </div>
            )}

            {assetType === '주택' && acquisitionType === '매매' && houseCount === '1주택' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">생애최초 주택 구입</span>
                  <p className="text-xs text-gray-500">1주택자 취득 시, 최대 200만 원 한도 감면</p>
                </div>
                <button
                  onClick={() => setIsFirstHome(!isFirstHome)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFirstHome ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFirstHome ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {assetType === '주택' && acquisitionType === '매매' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">조정대상지역 취득</span>
                  <p className="text-xs text-gray-500">강남 3구, 용산 등 (2주택 취득부터 중과 8%)</p>
                </div>
                <button
                  onClick={() => setIsRegulatedArea(!isRegulatedArea)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRegulatedArea ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRegulatedArea ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
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
            <div className="absolute -right-10 -top-10 text-9xl opacity-10">💸</div>

            <h3 className="text-indigo-100 text-lg mb-2 opacity-80">예상 등기 납부세액 (총합)</h3>
            <div className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              {formatNumber(result.totalTax)}<span className="text-2xl ml-2 font-semibold">원</span>
            </div>
            {result.reduction > 0 && (
              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm border border-white/30">
                ✨ 생애최초 조건으로 {formatNumber(result.reduction)}원의 할인이 적용되었습니다!
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-indigo-500/30">
              <div className="col-span-2">
                <p className="text-indigo-200 text-xs mb-1">취득세 (구간 가변)</p>
                <p className="text-xl font-bold">{formatNumber(result.finalAcqTax)} 원</p>
              </div>
              <div className="col-span-1">
                <p className="text-indigo-200 text-xs mb-1">지방교육세</p>
                <p className="text-lg font-semibold">{formatNumber(result.finalEduTax)} 원</p>
              </div>
              <div className="col-span-1">
                <p className="text-indigo-200 text-xs mb-1">농어촌</p>
                <p className="text-lg font-semibold">{formatNumber(result.finalFarmTax)} 원</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span>적용 세율 상세 안내</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>기준 취득세율 (조건 부과 기준)</span>
                <span className="font-semibold text-indigo-500">{result.acqRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>농어촌특별세 명목 (전용 85 초과 등)</span>
                <span className="font-semibold">{result.finalFarmTax > 0 ? '적용 (0.2%)' : '면제 (비과세)'}</span>
              </div>
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
  );
}
