# 주식 수익률 계산기 (profit-rate) 설계서

## 1. 개요
보유 주식의 평균 매입가, 수량, 현재가(혹은 목표 매도가)를 입력하여 **최종 수익금과 수익률**을 확인하는 계산기 메뉴입니다.

## 2. 화면 위치
- **경로**: `/stock/profit-rate`
- **파일**: `app/stock/profit-rate/page.tsx` (서버), `app/stock/profit-rate/ProfitRate.tsx` (클라이언트)

## 3. 화면 UI/UX 구성
1. **입력폼**
   - 평균 매입가 (원)
   - 보유 수량 (주)
   - 현재가 / 목표가 (원)
2. **제어 버튼**
   - **계산하기** : 결과 도출
   - **초기화** : 입력폼 모두 비우기
3. **결과 영역**
   - 총 매수 금액 (원)
   - 총 평가 금액 (원)
   - **수익금 (원)** (양수면 붉은색, 음수면 푸른색 계열 텍스트 강조)
   - **수익률 (%)** (강조)

## 4. 상태(State) 관리
- `avgPrice`: string/number (평균 매입가)
- `quantity`: string/number (보유 수량)
- `currentPrice`: string/number (현재가)
- `result: { totalInvested: number; currentValuation: number; profit: number; yieldRate: number } | null`

## 5. 계산 로직
1. 총 매수 금액(Total Invested) = 평균 매입가 × 보유 수량
2. 총 평가 금액(Current Valuation) = 현재가 × 보유 수량
3. **수익금(Profit)** = 총 평가 금액 - 총 매수 금액
4. **수익률(Yield Rate, %)** = (수익금 / 총 매수 금액) × 100

*참고: 필요시 주식 매매 수수료 및 증권거래세를 로직에 추가할 수 있으나, MVP 버전에서는 단순 수익률부터 계산*

## 6. 예외 처리 가이드 (Validation)
- 입력칸에 숫자가 아닌 값, 혹은 음수 입력 시 알림 또는 입력 차단
- 평균 매입가가 0인 상태에서 계산할 경우, 수익률 계산 시 0으로 나누어지는 ZeroDivision 에러 처리
- 결과값이 소수점 길게 떨어질 경우, 넷째자리나 둘째자리에서 반올림 처리 (`toFixed(2)` 등 적용)

## 7. 스타일(디자인) 참고
- 프로젝트 공통 CSS (tailwind) 및 JIKO-calculator.md 디자인 패턴 준수 (카드형 UI, 다크모드 적용).
- 수익률 결과의 **플러스(+)/마이너스(-)** 에 따른 색상 구분을 통해 직관적 인지(UX) 증대.
