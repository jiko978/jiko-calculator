'use client';

import React, { useState } from 'react';
import CalculatorActions from '../../components/CalculatorActions';
import CalculatorButtons from '../../components/CalculatorButtons';
import { useCalculatorScroll } from '../../hooks/useCalculatorScroll';

export default function CapitalGains() {
  const [assetType, setAssetType] = useState('주택');
  const [acquisitionPrice, setAcquisitionPrice] = useState('');
  const [transferPrice, setTransferPrice] = useState('');
  const [expenses, setExpenses] = useState('');

  const [holdingPeriod, setHoldingPeriod] = useState('2년 이상');
  const [residencePeriod, setResidencePeriod] = useState('2년 이상');
  const [houseCount, setHouseCount] = useState('1주택');

  const [isBasicDeduction, setIsBasicDeduction] = useState(true);
  const [isJointOwnership, setIsJointOwnership] = useState(false);
  const [isRegulatedArea, setIsRegulatedArea] = useState(false);

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

  const addAmount = (setter: any, currentVal: string, field: string, addValue: number) => {
    const current = parseInt(currentVal || '0', 10);
    setter((current + addValue).toString());
    const newErrors = new Set(errors);
    newErrors.delete(field);
    setErrors(newErrors);
    setErrorMessage('');
  };

  const resetAmount = (setter: any, field: string) => {
    setter('');
  };

  const handleCalculate = () => {
    const newErrors = new Set<string>();

    if (!acquisitionPrice) newErrors.add('acquisitionPrice');
    if (!transferPrice) newErrors.add('transferPrice');

    if (newErrors.size > 0) {
      setErrors(newErrors);
      setShakeField(newErrors.has('transferPrice') ? 'transferPrice' : 'acquisitionPrice');
      setErrorMessage('양도가액과 취득가액을 모두 입력해주세요.');
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    const tPrice = parseInt(transferPrice, 10);
    const aPrice = parseInt(acquisitionPrice, 10);
    const ePrice = parseInt(expenses || '0', 10);

    let capitalGains = Math.max(0, tPrice - aPrice - ePrice);

    // 1세대 1주택 비과세 체크 (고가주택 12억 기준 간단 로직)
    let isTaxFree = false;
    let adjustedGains = capitalGains;

    if (assetType === '주택' && houseCount === '1주택' && holdingPeriod === '2년 이상') {
      const needsResidence = isRegulatedArea;
      const meetsResidence = residencePeriod === '2년 이상';

      if (!needsResidence || meetsResidence) {
        if (tPrice <= 1200000000) {
          isTaxFree = true;
          adjustedGains = 0;
        } else {
          // 고가주택 양도차익 안분 계산
          adjustedGains = Math.round(capitalGains * ((tPrice - 1200000000) / tPrice));
        }
      }
    }

    // 장기보유특별공제 (단순화: 1세대 1주택자는 최대 80%, 일반은 최대 30%)
    let longTermDeductionRate = 0;
    if (holdingPeriod === '2년 이상' && assetType !== '분양권') {
      if (houseCount === '1주택' && tPrice > 1200000000 && isTaxFree === false) {
        // 고가주택, 요건 충족 시 표2 적용 (보유+거주 최대 80%) [여기서는 단순 40%로 가정]
        longTermDeductionRate = 0.4;
      } else if (houseCount !== '2주택 이상' || !isRegulatedArea) {
        longTermDeductionRate = 0.06; // 표1 임의 값
      }
    }

    let longTermDeduction = Math.round(adjustedGains * longTermDeductionRate);
    let incomeAmount = adjustedGains - longTermDeduction;

    // 기본공제
    let basicDeduction = isBasicDeduction ? 2500000 : 0;

    // 공동명의인 경우 인별 계산 (가정: 50:50 지분)
    if (isJointOwnership) {
      incomeAmount = incomeAmount / 2;
    }

    let taxBase = Math.max(0, incomeAmount - basicDeduction);

    // 기본세율 (6% ~ 45%) & 누진공제
    let taxRate = 0;
    let progressiveDeduction = 0;

    if (taxBase <= 14000000) { taxRate = 0.06; progressiveDeduction = 0; }
    else if (taxBase <= 50000000) { taxRate = 0.15; progressiveDeduction = 1260000; }
    else if (taxBase <= 88000000) { taxRate = 0.24; progressiveDeduction = 5760000; }
    else if (taxBase <= 150000000) { taxRate = 0.35; progressiveDeduction = 15440000; }
    else if (taxBase <= 300000000) { taxRate = 0.38; progressiveDeduction = 19940000; }
    else if (taxBase <= 500000000) { taxRate = 0.40; progressiveDeduction = 25940000; }
    else if (taxBase <= 1000000000) { taxRate = 0.42; progressiveDeduction = 35940000; }
    else { taxRate = 0.45; progressiveDeduction = 65940000; }

    // 다주택 중과 (2주택 +20%p, 3주택 +30%p)
    if (isRegulatedArea && houseCount !== '1주택') {
      if (houseCount === '2주택') taxRate += 0.20;
      if (houseCount === '2주택 이상') taxRate += 0.30;
    }

    // 단기보유 중과
    if (holdingPeriod === '1년 미만') {
      taxRate = assetType === '분양권' ? 0.70 : 0.70;
      progressiveDeduction = 0;
    } else if (holdingPeriod === '1년 이상 2년 미만') {
      taxRate = assetType === '분양권' ? 0.60 : 0.60;
      progressiveDeduction = 0;
    }

    let calculatedTax = Math.max(0, (taxBase * taxRate) - progressiveDeduction);

    // 공동명의일 경우 1인당 세금을 합산 (다시 2배)
    if (isJointOwnership) {
      calculatedTax = calculatedTax * 2;
      taxBase = taxBase * 2;
    }

    let localTax = Math.round(calculatedTax * 0.1);
    let totalTax = calculatedTax + localTax;

    if (isTaxFree) {
      calculatedTax = 0;
      localTax = 0;
      totalTax = 0;
    }

    setResult({
      capitalGains,
      adjustedGains,
      longTermDeduction,
      incomeAmount: isJointOwnership ? incomeAmount * 2 : incomeAmount,
      basicDeduction,
      taxBase,
      taxRate: taxRate * 100,
      calculatedTax,
      localTax,
      totalTax,
      isTaxFree
    });

    setErrors(new Set());
    setErrorMessage('');
  };

  const handleReset = () => {
    setAssetType('주택');
    setAcquisitionPrice('');
    setTransferPrice('');
    setExpenses('');
    setHoldingPeriod('2년 이상');
    setResidencePeriod('2년 이상');
    setHouseCount('1주택');
    setIsBasicDeduction(true);
    setIsJointOwnership(false);
    setIsRegulatedArea(false);

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
      return `📌 JIKO 양도소득세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/capital-gains`;
    }
    return `[🏠 양도소득세 계산 결과]\n\n취득가액: ${formatNumber(parseInt(acquisitionPrice))}원\n양도가액: ${formatNumber(parseInt(transferPrice))}원\n필요경비: ${formatNumber(parseInt(expenses || '0'))}원\n보유기간: ${holdingPeriod}\n거주기간: ${residencePeriod}\n주택수: ${houseCount}\n\n양도차익: ${formatNumber(result.capitalGains)}원\n장기보유특별공제: -${formatNumber(result.longTermDeduction)}원\n과세표준: ${formatNumber(result.taxBase)}원\n세율: ${result.taxRate.toFixed(1)}%\n\n양도소득세: ${formatNumber(result.calculatedTax)}원\n지방소득세: ${formatNumber(result.localTax)}원\n총 납부세액: ${formatNumber(result.totalTax)}원\n\n📌 JIKO 양도소득세 계산기에서 확인하기 :\nhttps://jiko.kr/calculator/tax/capital-gains`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateShareText());
  };

  const AmountInput = ({ label, value, setter, fieldId, placeholder }: any) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value ? formatNumber(parseInt(value)) : ''}
          onChange={handleInputChange(setter, fieldId)}
          placeholder={placeholder}
          className={`w-full p-4 text-right bg-gray-50 dark:bg-gray-900 border ${errors.has(fieldId) ? 'border-red-600 ring-2 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-semibold text-gray-800 dark:text-gray-100 ${shakeField === fieldId ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium" aria-hidden="true">₩</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={() => resetAmount(setter, fieldId)} className="px-3 py-1.5 text-xs font-black bg-rose-50 dark:bg-rose-900/20 text-rose-500 border border-rose-100 dark:border-rose-800 rounded-xl hover:bg-rose-100 transition-all active:scale-95">C</button>
        {[1000000, 5000000, 10000000, 50000000, 100000000, 500000000].map((val) => (
          <button
            key={val}
            onClick={() => addAmount(setter, value, fieldId, val)}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all active:scale-95"
          >
            +{val >= 100000000 ? `${val / 100000000}억` : val >= 10000000 ? `${val / 10000000}천` : `${val / 1000000}백`}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="flex justify-center flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
            🏠 양도소득세 계산기
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">

          {/* Asset Type */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex-wrap">
            {['주택', '토지', '상가', '분양권'].map((type) => (
              <button
                key={type}
                className={`flex-1 min-w-[70px] py-2 text-sm font-bold rounded-lg transition-colors ${assetType === type ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setAssetType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">보유 기간</label>
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="1년 미만">1년 미만</option>
                <option value="1년 이상 2년 미만">1년 이상 ~ 2년 미만</option>
                <option value="2년 이상">2년 이상</option>
              </select>
            </div>
            {assetType === '주택' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">거주 기간</label>
                <select
                  value={residencePeriod}
                  onChange={(e) => setResidencePeriod(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="미거주">거주 안 함</option>
                  <option value="1년 미만">1년 미만</option>
                  <option value="1년 이상 2년 미만">1년 이상 ~ 2년 미만</option>
                  <option value="2년 이상">2년 이상</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <AmountInput label="양도가액 (매도금액)" value={transferPrice} setter={setTransferPrice} fieldId="transferPrice" placeholder="예: 1,000,000,000" />
            <AmountInput label="취득가액 (매수금액)" value={acquisitionPrice} setter={setAcquisitionPrice} fieldId="acquisitionPrice" placeholder="예: 500,000,000" />
            <AmountInput label="필요경비 (취득세, 중개수수료, 리모델링 등)" value={expenses} setter={setExpenses} fieldId="expenses" placeholder="예: 25,000,000" />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-2">세금 공제 및 특례 옵션</h3>

            {assetType === '주택' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">보유 주택 수</span>
                  <p className="text-xs text-gray-500">다주택자는 중과될 수 있습니다.</p>
                </div>
                <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                  {['1주택', '2주택', '2주택 이상'].map(hc => (
                    <button key={hc} onClick={() => setHouseCount(hc)} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${houseCount === hc ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{hc}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">기본공제 (250만원) 적용</span>
                <p className="text-xs text-gray-500">당해 연도 최초 신고 자산</p>
              </div>
              <button
                onClick={() => setIsBasicDeduction(!isBasicDeduction)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isBasicDeduction ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBasicDeduction ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">부부 공동명의 여부</span>
                <p className="text-xs text-gray-500">지분 분산으로 누진세율 절감</p>
              </div>
              <button
                onClick={() => setIsJointOwnership(!isJointOwnership)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isJointOwnership ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isJointOwnership ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {assetType === '주택' && (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">조정대상지역 양도</span>
                  <p className="text-xs text-gray-500">강남 3구, 용산구 등 지정 구역</p>
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

      {/* Result Section */}
      {result && (
        <div id="result-section" ref={resultRef} className="mt-8 space-y-6 animate-fade-in-up">
          <div className="bg-gradient-to-br from-indigo-600 relative to-indigo-800 rounded-3xl p-8 shadow-xl text-white overflow-hidden">
            <div className="absolute -right-10 -top-10 text-9xl opacity-10">💰</div>

            <h3 className="text-indigo-100 text-lg mb-2 opacity-80">총 납부세액 (예상)</h3>
            <div className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              {formatNumber(result.totalTax)}<span className="text-2xl ml-2 font-semibold">원</span>
            </div>
            {result.isTaxFree && (
              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-sm font-bold mb-4 backdrop-blur-sm shadow-sm border border-white/30">
                ✨ 1세대 1주택 비과세 요건 충족 (12억 이하 무관세)
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-indigo-500/30">
              <div>
                <p className="text-indigo-200 text-xs mb-1">양도소득세 (국세)</p>
                <p className="text-xl font-bold">{formatNumber(result.calculatedTax)} 원</p>
              </div>
              <div>
                <p className="text-indigo-200 text-xs mb-1">지방소득세 (지방세 10%)</p>
                <p className="text-xl font-bold">{formatNumber(result.localTax)} 원</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <span>과세 표준 산출 내역</span>
              {isJointOwnership && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold">인별 과세 적용됨 (1/2)</span>}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>초기 양도차익 (매도 - 매수 - 필요경비)</span>
                <span className="font-semibold">{formatNumber(result.capitalGains)} 원</span>
              </div>
              {result.capitalGains !== result.adjustedGains && (
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span>고가주택 조정차익 (12억 초과분 안분)</span>
                  <span className="font-semibold">{formatNumber(result.adjustedGains)} 원</span>
                </div>
              )}
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span className="text-indigo-500 font-bold">(-) 장기보유특별공제</span>
                <span className="font-semibold text-indigo-500">-{formatNumber(result.longTermDeduction)} 원</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span>양도소득금액</span>
                <span className="font-semibold">{formatNumber(result.incomeAmount)} 원</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                <span className="text-indigo-500 font-bold">(-) 기본공제</span>
                <span className="font-semibold text-indigo-500">-{formatNumber(result.basicDeduction)} 원</span>
              </div>
              <div className="border-t border-dashed border-gray-200 dark:border-gray-600 my-2 pt-2"></div>
              <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-100">
                <span className="text-red-500">(=) 최종 과세표준액</span>
                <span className="text-red-500">{formatNumber(result.taxBase)} 원</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 text-xs mt-2">
                <span>적용 세율구간 (산출세율)</span>
                <span className="font-bold">{result.taxRate.toFixed(1)}%</span>
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
