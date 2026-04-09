# JIKO Calculator 프로젝트

**작성일** : 2026-03-09
**수정일** : 2026-04-05
**작성자** : 고재일
**프로젝트 경로** : C:\Users\kji\jiko-project



## 프로젝트 구성
**[프로젝트 개요](#프로젝트-개요)**
**[디렉토리 구조](#디렉토리-구조)**
**[메뉴 구조](#메뉴-구조)**
**[SEO 제목](#seo-제목)**
**[공통 컴포넌트 관리](#공통파일-관리)**
**[문서(MD) 기반 개발 원칙(바이브 코딩)](#md파일-관리)**
**[공통 기능](#공통-기능)**
**[SEO 구조](#seo-구조)**
**[테스트 및 품질 관리](#10-테스트-및-품질-관리-신규-추가-항목)** (신규)



## 프로젝트 개요

JIKO Calculator는 주식, 금융, 직장, 생활, 건강, 세금, 부동산 등 일상 속에서 자주 접하면서 손쉽게 계산할 수 있는 계산기 프로그램입니다.
Tool Site.


## 디렉토리 구조 

현재 구성된 프로젝트 폴더 기준으로 아래와 같이 관리됩니다.

- `app/` : Next.js App 라우터 최상위 디렉토리 (랜딩 페이지 도메인: `jiko.kr`)
  - `components/` : 전체 공통 컴포넌트 
  - `config/` : 프로젝트 전역 설정
  - `calculator/` : 계산기 통합 라우트 (계산기 도메인: `jiko.kr/calculator`)
    - `components/` : 계산기 전용 컴포넌트 (서비스별 분리 구조)
    - `stock/` : 주식 메뉴
      - `avg-price/` : 평균 단가 계산기 페이지
      - `profit-rate/` : 수익률 계산기 페이지
      - `dividend/` : 배당금 계산기 페이지
      - `fee/` : 수수료 계산기 페이지 (Fee.tsx)
    - `finance/` : 금융 메뉴
      - `deposits/` : 예금 이자 계산기 페이지
      - `savings/` : 적금 이자 계산기 페이지
      - `loans/` : 대출 이자 계산기 페이지
    `job/` : 직장 메뉴
      - `salary/` : 연봉/월급 계산기 페이지
      - `severance-pay/` : 퇴직금 계산기 페이지
      - `unemployment-benefit/` : 실업급여 계산기 페이지
      - `net-pay/` : 실수령액 계산기 페이지
      - `insurance/` : 4대보험 계산기 페이지
      - `holiday-allowance/` : 주휴수당 계산기 페이지
      - `paid-leave/` : 연차 계산기 페이지
    `life/` : 생활 메뉴
      - `age/` : 나이 계산기 페이지
      - `date/` : 날짜 계산기 페이지
      - `d-day/` : 디데이 계산기 페이지
      - `discharge-day/` : 전역일 계산기 페이지
      - `unit/` : 단위 계산기 페이지
      - `grade/` : 학점 계산기 페이지
    `health/` : 건강 메뉴
      - `bmi/` : 비만도 계산기 페이지
      - `bmr/` : 기초대사량 계산기 페이지
      - `calorie/` : 칼로리 계산기 페이지
      - `ovulation/` : 배란일 계산기 페이지
      - `pregnancy/` : 임신주수 계산기 페이지


    `tax/` : 세금 메뉴
      - `vat/` : 부가세 계산기 페이지
      - `capital-gains-tax/` : 양도세 계산기 페이지
      - `acquisition-tax/` : 취득세 계산기 페이지
      - `car-tax/` : 자동차세 계산기 페이지
      - `property-tax/` : 보유세 계산기 페이지


    `real-estate/` : 부동산 메뉴
      - `ltv/` : LTV 계산기 페이지
      - `dti/` : DTI 계산기 페이지
      - `newdti/` : 신DTI 계산기 페이지
      - `dsr/` : DSR 계산기 페이지
      - `loan-fee/` : 중도상환수수료 계산기 페이지


- `public/` : 정적 자산(이미지, 아이콘 등) 
  - `docs/` : 프로젝트 전체 문서 및 카테고리별 MD 설정/설계서
- `node_modules/`, `.next/` 등 운영/빌드용 폴더 유지

## 메뉴 구조
주식(stock)
ㄴ [1차]주식 평균단가(avg-price) : 물타기/불타기 평균 단가 계산
ㄴㄴ 계좌 개설 연동
ㄴ [1차]주식 수익률(profit-rate) : 매입가, 현재가, 수량별 수익금/수익률 계산
ㄴㄴ 계좌 개설 연동
ㄴ [1차]주식 배당금(dividend) : 주당 배당금, 배당 수익률, 목표 배당금 달성 가이드
ㄴ [1차]주식 수수료(fee) : 코스피/코스닥/해외 주식 세금 및 수수료 계산


금융(finance)
ㄴ [1차]예금 이자(deposits) : 예금이자율, 예금액, 예금기간별 예금 이자 및 만기 수령액 계산
  - 한글 슬러그 지원 (예: /일반정기예금, /고금리예금 등)
ㄴ [1차]적금 이자(savings) : 적금이자율, 적금액, 적금기간별 적금 이자 및 만기 수령액 계산
  - 한글 슬러그 지원 (예: /일반정기적금, /자유적금 등)
ㄴ [1차]대출 이자(loans) : 대출이자율, 대출액, 대출기간별 대출 이자 및 상환액 계산
  - 한글 슬러그 지원 (예: /주택담보대출, /신용대출 등)
  - 상환 기간 단축 버튼 제공 (6, 12, 24, 36개월)

ㄴ [2차]환율(exchange-rate) : 환율, 환율, 환율별 환율 계산(네이버 참고)
ㄴ [2차]복리(compound-interest) 
ㄴ [2차]퍼센트(percentage)


직장(job)
ㄴ [1차]연봉/월급(salary) : 잡코리아, 사람인 참고
ㄴ [1차]퇴직금(severance-pay) : 잡코리아, 사람인 참고
ㄴ [1차]실업급여(unemployment-benefit) : 잡코리아, 사람인, MoneyNest 참고 
ㄴ [1차]실수령액(net-pay) : 사람인, MoneyNest 참고 
ㄴ [1차]4대보험(insurance) : MoneyNest 참고 
ㄴ [1차]주휴수당(holiday-allowance) : MoneyNest 참고 
ㄴ [1차]연차(paid-leave) : 잡코리아, 사람인, MoneyNest 참고  


건강(health)
ㄴ [1차]비만도(bmi) : 키, 체중 기반 BMI 지수 산출 및 시각화 차트 제공
ㄴ [1차]기초대사량(bmr) : 성별/나이/신체정보 기반 BMR 산출 및 연령대별 평균 비교
ㄴ [1차]칼로리(calorie) : 운동 종류(METs) 및 음식 종류 선택 기반 에너지 밸런스 계산
ㄴ [1차]배란일(ovulation) : 마지막 생리일 기반 가임기 및 배란일 예측
ㄴ [1차]임신주수(pregnancy) : 마지막 생리일/초음파/예정일 기반 주수 및 D-Day 확인

생활(life)
ㄴ [1차]나이(age) : 출생일 기준 년도별 나이
ㄴㄴ 출생일 기준 만 나이/년 나이/세는 나이
ㄴㄴ 출생일 기준 띠
ㄴ [1차]날짜(date) : 두 날짜 사이의 정확한 기간 계산 (일수, 주수, 월수, 년수 등)
ㄴ [1차]디데이(d-day) : 특정 기념일까지의 남은 날짜 계산 및 기념일 타임라인 제공
ㄴ [1차]전역일(discharge-day) : 군별(육/해/공/해병 등) 전역일 계산 및 실시간 복무율 시각화 

ㄴ [2차]단위(unit)
ㄴㄴ 길이 : 네이버 참고
ㄴㄴ 넓이 : 네이버 참고
ㄴㄴ 무게 : 네이버 참고
ㄴㄴ 부피 : 네이버 참고
ㄴㄴ 온도 : 네이버 참고 
ㄴㄴ 압력 : 네이버 참고
ㄴㄴ 속도 : 네이버 참고
ㄴㄴ 연비 : 네이버 참고 
ㄴㄴ 데이터 : 네이버 참고
ㄴㄴ 시간 : 네이버 참고 
ㄴ [2차]학점(grade)


세금(tax)
ㄴ [1차]부가세 : MoneyNest 참고 
ㄴ [1차]양도세 : MoneyNest 참고 
ㄴ [1차]취득세 : 국세청 위텍스, 국토교통부 참고
ㄴ [1차]자동차세 : MoneyNest 참고 
ㄴ [1차]보유세

ㄴ [미정]종부세


부동산(real estate)
ㄴ [1차]DSR : 네이버 참고                      
ㄴ [1차]신DTI : 네이버 참고                      
ㄴ [1차]DTI : 네이버 참고                    
ㄴ [1차]LTV : 네이버 참고                      
ㄴ [1차]중도상환수수료 : 네이버 참고       

ㄴ [미정]부동산 중개수수료
ㄴ [미정]전세대출 : 주택도시보증공사, 한국주택금융공사 참고


## SEO제목
주식(stock)
1. 주식 물타기 계산기 | 물타기 평단 계산 - JIKO 계산기
2. 주식 수익률 계산기 | 매수가 현재가 수익 계산 - JIKO 계산기
3. 주식 배당금 계산기 | 배당금 배당수익률 계산 - JIKO 계산기
4. 주식 수수료 계산기 | 코스피/코스닥/해외 주식 세금 및 수수료 계산 - JIKO 계산기

금융(finance)
1. 예금 이자 계산기 | 정기예금 이자 및 만기 수령액 계산기 - JIKO 계산기
2. 적금 이자 계산기 | 정기적금 만기 수령액 및 이자 계산기 - JIKO 계산기
3. 대출 이자 계산기 | 원리금균등 및 원금균등 상환 계산기 - JIKO 계산기
4. 환율 계산기 | 환율 계산 - JIKO 계산기
5. 복리 계산기 | 복리 계산 적립식 복리 - JIKO 계산기
6. 퍼센트 계산기 | 퍼센트 계산 비율 증감 계산 - JIKO 계산기

직장(job)
1. 연봉/월급 계산기 | 연봉 실수령액 월급 계산 - JIKO 계산기
2. 퇴직금 계산기 | 퇴직금 계산 - JIKO 계산기
3. 실업급여 계산기 | 실업급여 계산 - JIKO 계산기
4. 실수령액 계산기 | 연봉 실수령액 월급 계산 - JIKO 계산기
5. 4대보험 계산기 | 국민연금 건강보험 고용보험 산재보험 계산 - JIKO 계산기
6. 주휴수당 계산기 | 알바 주휴수당 계산 - JIKO 계산기
7. 연차 계산기 | 연차 계산 - JIKO 계산기

생활(life)
1. 나이 계산기 | 나이와 띠 계산 만 나이 계산 - JIKO 계산기
2. 날짜 계산기 | 두 날짜 사이의 정확한 기간 계산 - JIKO 계산기
3. 디데이 계산기 | 디데이/날짜수 계산 만기일 계산 - JIKO 계산기
4. 전역일 계산기 | 군별(육/해/공/해병 등) 전역일 계산 및 실시간 복무율 시각화 
5. 단가 계산기 | 온라인/오프라인 상품 최저가 비교 - JIKO 계산기
6. 단위 변환기 | 길이 넓이 무게 부피 온도 변환 - JIKO 계산기
7. 물가 계산기 | 물가 상승률 화폐 가치 계산 - JIKO 계산기
8. 마진율 계산기 | 판매가 마진율 이익 계산 - JIKO 계산기
9. 확률 계산기 | 확률 계산 경우의 수 - JIKO 계산기

건강(health)
1. 칼로리 계산기 | 운동 소모 칼로리 및 음식 섭취량 계산 - JIKO 계산기
2. 비만도 계산기 | BMI 지수 측정 및 아시아 태평양 기준 차트 - JIKO 계산기
3. 기초대사량 계산기 | 연령대별 평균 BMR 비교 측정 - JIKO 계산기
4. 배란일 계산기 | 가임기 및 다음 생리 예정일 예측 - JIKO 계산기
5. 임신주수 계산기 | 출산 예정일 및 임신 주수 D-Day 확인 - JIKO 계산기

세금(tax)
1. 취득세 계산기 | 취득세 세율 계산 - JIKO 계산기
2. 양도세 계산기 | 양도소득세 계산 - JIKO 계산기
3. 종부세 계산기 | 종합부동산세 계산 - JIKO 계산기
4. 보유세 계산기 | 재산세 종부세 합계 계산 - JIKO 계산기
5. 부가세 계산기 | 부가가치세 별도 포함 계산 - JIKO 계산기
6. 자동차세 계산기 | 배기량별 자동차세 계산 - JIKO 계산기
7. 종소세 계산기 | 종합소득세 세율 계산 - JIKO 계산기
8. 자동차 할부 계산기 | 자동차 할부 원리금 상환 계산 - JIKO 계산기


부동산(real estate)
1. DSR 계산기 | DSR 비율 총부채원리금상환비율 계산 - JIKO 계산기
2. 신DTI 계산기 | 신DTI 비율 부채상환능력 계산 - JIKO 계산기
3. DTI 계산기 | DTI 비율 부채상환능력 계산 - JIKO 계산기
4. LTV 계산기 | LTV 비율 담보대출 한도 계산 - JIKO 계산기
5. 중도상환수수료 계산기 | 중도상환수수료 계산 - JIKO 계산기
6. 부동산 중개수수료 계산기 | 복비 계산 중개수수료 계산 - JIKO 계산기
7. 전세대출 계산기 | 전세대출 이자 한도 계산 - JIKO 계산기
8. 임대 수익 계산기 | 임대 수익률 월세 수익 계산 - JIKO 계산기
9. 월세 수익 계산기 | 월세 수익률 수익 계산 - JIKO 계산기
10. 청약 가점 계산기 | 아파트 청약 가점 계산 - JIKO 계산기


## 공통파일 관리
1. 뒤로가기, 공유, FAQ, 더 보기 버튼
ㄴ app/components/NavBar.tsx (뒤로가기, 공유)
ㄴ app/components/ShareSheet.tsx (공유 바텀 시트)
ㄴ app/calculator/components/CalculatorActions.tsx (결과 복사하기 및 공유하기 2분할 버튼)
ㄴ app/calculator/components/CalculatorButtons.tsx (초기화 및 계산하기 공통 버튼)
ㄴ app/calculator/components/FAQ.tsx (FAQ)
ㄴ app/calculator/components/StockMoreCalculators.tsx (주식 카테고리 더 보기)
ㄴ app/calculator/components/FinanceMoreCalculators.tsx (금융 카테고리 더 보기)
ㄴ app/calculator/components/HealthMoreCalculators.tsx (건강 카테고리 더 보기)
ㄴ app/calculator/components/LifeMoreCalculators.tsx (생활 카테고리 더 보기)
ㄴ app/calculator/components/InstallBanner.tsx (앱 설치 유도 배너 - 최하단 고정)
ㄴ app/calculator/components/CalculatorTabs.tsx (카테고리 내 메뉴 이동 탭)
2. UI 및 기타 Hook 로직
ㄴ app/calculator/hooks/useCalculatorScroll.ts (결과 화면 자동 스크롤 동기화)

## MD파일 관리 (바이브 코딩 가이드)
1. 전체 경로 : public/docs
2. 메뉴별 설계서 경로 및 명명 규칙
ㄴ 주식 : `public/docs/stock/[메뉴명]-기능명세서.md` (예: fee-기능명세서.md)
ㄴ 금융 : `public/docs/finance/[메뉴명]-기능명세서.md`
ㄴ 직장 : `public/docs/job/[메뉴명]-기능명세서.md`
ㄴ 생활 : `public/docs/life/[메뉴명]-기능명세서.md`
ㄴ 건강 : `public/docs/health/[메뉴명]-기능명세서.md`
ㄴ 세금 : `public/docs/tax/[메뉴명]-기능명세서.md`
ㄴ 부동산 : `public/docs/real-estate/[메뉴명]-기능명세서.md`
3. 기능명세서 1개로 메뉴 관리 가능 여부 : **가능합니다.**
ㄴ **메뉴 당 1개의 기능명세서(.md)** 를 유지하는 것을 강력히 권장합니다. 화면 UI, 상태(State) 관리, 계산 로직 및 예외 처리 등을 하나의 파일에 담아 AI에게 프롬프트로 제공(바이브 코딩)하면 맥락(Context)을 잃지 않고 정확한 코드를 생성할 수 있습니다.

## 공통 기능
1. 뒤로가기, 공유, FAQ, 더 보기 버튼
2. 구조 분리 (루트 랜딩 vs 도메인 허브)
ㄴ 루트 홈 (`app/page.tsx`): JIKO Platform 메인 그리드 및 서비스 핵심 가치(USP) 안내
ㄴ 계산기 홈 (`app/calculator/page.tsx`): 계산기 메뉴 특화 서브 허브 (하위 도메인 허브와 동일한 `max-w-3xl` 등 규격화된 카드 디자인 통일 적용)
ㄴ 로직 분리: Server Component(`page.tsx`) / Client Component(`메뉴명.tsx`)
3. 전역 컴포넌트 동기화 (Header & Footer)
ㄴ **루트 허브(Platform)** 와 **서브 허브(Calculator)** 상/하단바의 레이아웃, 크기 세팅 통일 (`px-4 py-6` / `max-w-3xl` 등 기본 규격 동기화)
ㄴ Cross-Navigation(교차 이동): 계산기 메뉴의 Header와 Footer에는 `🏠 JIKO 플랫폼 홈` 단축 링크를 강제 삽입하여 허브 간 자유로운 이동 보장.
3. 코어 UI/UX 표준 (전체 계산기 공통 적용 필수)
ㄴ [1] 프리미엄 격격 레이아웃: 모든 카드 섹션은 **`rounded-2xl`** 라운딩과 세로 간격 **`mt-4`**를 절대 표준으로 사용합니다. 허브 페이지의 기능 카드 세션도 이와 동일한 규격을 따릅니다.
ㄴ [2] 공통 액션 버튼 UI (CalculatorButtons.tsx) : 모든 계산기의 '초기화' 및 '계산하기' 버튼은 이 컴포넌트를 통해 디자인과 인터랙션(활성/비활성, 호버 효과 등)을 통일합니다.
ㄴ [3] 계산하기 후 화면 스크롤 (useCalculatorScroll Hook) : 모바일 가독성을 위해 [계산하기] 클릭 시 결과 영역(id="result-section")으로 부드럽게 스크롤(Smooth Scroll)됩니다.
ㄴ [4] 초기화 후 화면 스크롤 : [초기화] 클릭(handleReset) 시 setTimeout과 window.scrollTo({ top: 0, behavior: "smooth" })를 호출하여 최상단 폼으로 화면을 복귀시킵니다.
ㄴ [5] 필수 입력 체크 공통화 (Standard Validation) : 
   - 입력 누락 시 해당 필드에 빨간색 테두리(`ring-2 ring-red-500/20`) 및 흔들림(`animate-[shake_0.5s_ease-in-out]`) 효과를 적용합니다.
   - 버튼 상단에 공통 에러 카드(`bg-red-50 ... animate-pulse`)를 출력합니다.
ㄴ [6] 하단 컴포넌트 배치 및 규격 (Standard Footer Sequence) : 
   - 모든 계산기 페이지 하단은 반드시 `[연관 MoreCalculators] -> [InstallBanner]` 순서로 배치합니다.
   - 하단 푸터 컴포넌트는 반드시 **`max-w-3xl mx-auto`** 컨테이너 내부에 배치하여 상위 계산기 영역과 수직 정렬을 일치시켜야 합니다.
ㄴ [7] 카테고리 탭 시스템 (CalculatorTabs.tsx) : 
   - 생활, 직장 등 연관성이 높은 메뉴들은 상단에 탭을 배치하여 이질감 없는 이동 환경을 제공합니다.
ㄴ [기본] 바탕 및 레이아웃 : 카드 UI(흰색 배경 + 라운드 처리), 다크모드(`dark:` 접두사), 버튼 Hover 디자인 통일.
ㄴ [기본] 사용자 피드백 : 상태 알림은 alert 대신 State 기반 컴포넌트 시각적 전환 시스템을 채택하며, Bottom Sheet(`ShareSheet`)는 React Portal을 활용해 깊이(Depth) 문제를 원천 차단합니다.
ㄴ [기본] 면책 조항 : 금융/주식 등 결괏값이 민감한 계산기 사이드 설명 창에는 붉은색 계열(`bg-red-50`) 면책 조항 박스를 강제 추가합니다.
4. 전역 설정 영역별 분리 구조
ㄴ 루트 레이아웃 (`app/layout.tsx` - jiko.kr 공통) : 웹 분석(Google Analytics / GA4), 카카오 SDK 연동(KakaoInit) 등 논리적 최상단 처리
ㄴ 루트 UI 렌더링 (`app/page.tsx`) : 전역 공통 Header & Footer 래핑 및 메인 타이틀 네비게이션 적용(`🧮 JIKO 계산기` -> `/calculator`)
ㄴ 계산기 레이아웃 (`app/calculator/layout.tsx` - jiko.kr/calculator 한정) : PWA 설정(manifest), Service Worker 등록(RegisterSW), QR 코드 등 서브 라우트 특화 처리
ㄴ sw.js (오프라인 캐싱) 파일에 신규 경로 반영 수정



## SEO 구조
각 메뉴망의 `page.tsx`는 검색엔진 최적화(SEO)를 위해 **공통 카드형 UI 레이아웃**과 **정형화된 데이터 구조(JSON-LD)** 기준을 따릅니다.

### 1. 전역 SEO 설정 (프로젝트 레벨)
- **sitemap.ts / robots.ts** : 검색 엔진 크롤러가 사이트 구조를 파악하고 동적으로 맵핑할 수 있도록 설정.
- **GSC (Google Search Console)** : 루트 HTML 소유권 확인 파일을 통한 애플리케이션 검색 노출 통계/인덱싱 관리.
- **메타데이터 (Metadata)** : 전역 설정(`layout.tsx`)과 더불어 각 페이지(`page.tsx`)별 고유 값으로 덮어쓰기(override)하여 OpenGraph, Twitter 카드 등을 완벽 대응.

### 2. 구조적 데이터 (JSON-LD)
`page.tsx` 내부 최상단에 `<script type="application/ld+json">` 형태로 스크립트를 삽입합니다.
- `schema` (범용) / `WebApplication` (또는 `FinanceApplication`) : 계산기의 고유 이름, 요약 설명 및 카테고리를 명시.
- `FAQPage` : 해당 계산기와 관련된 핵심 질문과 답변 리스트를 명시하여, 구글 등 검색결과에서 리치 스니펫(FAQ)으로 노출되도록 대응.

### 3. SEO UI 레이아웃 (카드형 디자인 요소)
계산기 컴포넌트 하단 공간에 아래 요소들을 `bg-white dark:bg-gray-800 rounded-2xl shadow-sm mt-4` 등의 공통 클래스를 가진 독립 단위의 카드들로 이어서 배치합니다. 레이아웃에 맞게 컨테이너 넓이(`max-w-3xl`)를 제한합니다. 모든 섹션 카드 간격은 **`mt-4`**를 유지하여 조밀하고 짜임새 있는 레이아웃을 지향합니다.

1. **H1 (해당 계산기 이름) 및 소개문**
   - H1 태그 내부에 메인 키워드 노출. (예: `주식 평균 단가 계산기 (평단가 계산기)`)
   - 계산기의 목적과 활용도를 P 태그로 감싸서 상세 설명.
2. **사용 방법 (H2 태그)**
   - 앱의 이용 방법을 `<ul>`, `<li>` 리스트 형태로 직관적으로 안내.
3. **계산 예시 (H2 태그)**
   - 실제 사용자가 입력할 법한 금액/수치 예제를 들고, 이에 따른 결과(수익금, 수익률, 최종 단가 등)를 도출하는 과정을 스토리텔링 텍스트로 자연스럽게 제공.
4. **FAQ - 자주 묻는 질문 (H2 태그)**
   - `FAQPage` JSON-LD에 정의된 질문(Q)과 답변(A)을 화면에도 동일하게 렌더링.
   - **공통 컴포넌트(`FAQ.tsx`)**를 사용하여 모든 페이지에서 일관된 스타일 유지.
   - 사용자가 클릭 없이 즉시 정보를 확인할 수 있도록 질문과 답변을 상시 노출하는 정적 디자인 적용.
5. **주식 계산기 더 보기 (네비게이션)**
   - 페이지 최하단에 `StockMoreCalculators` 컴포넌트를 배치하여 다른 계산기 메뉴로의 이동 편의성 제공.
6. **제목 템플릿**
   - [키워드] 계산기 | [설명 키워드] - [브랜드]
   - 예 : 주식 평균 단가 계산기 | 물타기/불타기 평단 계산 - JIKO calculator
   - 예 : 주식 수익률 계산기 | 매수가 현재가 수익 계산 - JIKO calculator


### SEO 구조 및 Ticker 시스템 (신규)
- **전략**: 종목 코드(Ticker) 및 한글 키워드 슬러그를 활용한 외부 검색 유입 극대화.
- **주식 하이브리드 라우팅**: `/삼성전자-005930` 같은 가독성과 검색 노출을 동시에 잡는 URL 지원.
- **금융 한글 슬러그 라우팅**: `/calculator/finance/loans/주택담보대출` 등 직관적인 한글 URL 체계 도입.
- **URL 인코딩 및 정규화**: `generateStaticParams`에서 `encodeURIComponent`를 사용하고, 페이지 컴포넌트에서 `decodeURIComponent` 및 `normalize('NFC')`를 적용하여 검색엔진 및 호환성 문제 완벽 대응.
- **전 종목 데이터 최적화**: `stocks.json` 및 `products.json`을 통해 약 2,500개 주식 종목과 다양한 금융 상품 데이터를 경량화하여 관리.

## 10. 테스트 및 품질 관리 (신규 추가 항목)
1. 예외 처리 가이드 : 입력값이 `NaN`, `Infinity` 등일 때의 계산 오류 방지 및 빈 값에 대한 예외 처리 명시.
2. 상태 검증 테스트 : 사용자 입력에 대한 즉각적인 피드백 (예: 필수값 누락 시 붉은 테두리와 에러 메시지 표시).
- **빌드 테스트**: `npm run build`를 통한 동적 라우트 유효성 및 타입 검사 정기 수행.
- **SEO 검증**: 카카오톡 공유 디버거 및 구글 검색 결과 탭 타이틀 수동 모니터링.
3. 반응형 UI 테스트 : 모바일, 태블릿, PC 화면 크기에 따른 UI 깨짐 방지 점검. 기기(디바이스) 호환성 확인.