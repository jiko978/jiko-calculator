import type { Metadata, ResolvingMetadata } from "next";
import StockFee from "../StockFee";
import NavBar from "@/app/calculator/components/NavBar";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";
import stocksData from "../../data/stocks.json";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug;
    const decodedSlug = decodeURIComponent(slug);

    let stockName = decodedSlug;
    let stockCode = "";

    // 하이브리드 패턴 처리 (이름-코드)
    if (decodedSlug.includes("-")) {
        const parts = decodedSlug.split("-");
        stockCode = parts[parts.length - 1];
        stockName = parts.slice(0, -1).join("-");
    } else if (/^\d{6}$/.test(decodedSlug)) {
        // 코드 패턴
        const found = stocksData.find(s => s.code === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    } else {
        // 이름 패턴
        const found = stocksData.find(s => s.name === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    }

    const title = `${stockCode ? `${stockCode} ` : ""}${stockName} 주식 수수료 계산기 | ${stockName} 세금 수수료 확인 - JIKO`;
    const description = `${stockName}(${stockCode}) 매매 시 발생하는 세금과 수수료를 계산해 보세요. 코스피/코스닥 거래세와 해외주식 양도세 공제 혜택을 반영한 정확한 세후 순이익을 도출합니다.`;

    return {
        title,
        description,
        alternates: { canonical: `${BASE_URL}/calculator/stock/fee/${slug}` },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/calculator/stock/fee/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const slug = (await params).slug;
    const decodedSlug = decodeURIComponent(slug);

    let stockName = decodedSlug;
    let stockCode = "";

    if (decodedSlug.includes("-")) {
        const parts = decodedSlug.split("-");
        stockCode = parts[parts.length - 1];
        stockName = parts.slice(0, -1).join("-");
    } else if (/^\d{6}$/.test(decodedSlug)) {
        const found = stocksData.find(s => s.code === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    } else {
        const found = stocksData.find(s => s.name === decodedSlug);
        if (found) {
            stockName = found.name;
            stockCode = found.code;
        }
    }

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        { name: "수수료 계산기", item: "/calculator/stock/fee" },
        { name: `${stockName} 수수료 계산`, item: `/calculator/stock/fee/${slug}` }
    ]);

    const stockSchema = stockCode ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": stockName,
        "tickerSymbol": stockCode,
        "url": `${BASE_URL}/calculator/stock/fee/${slug}`
    } : null;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            {stockSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(stockSchema) }}
                />
            )}
            <NavBar title={`${stockName} 수수료 계산기`} description={`${stockName} 주식 매수/매도 시 발생하는 수수료와 세금을 확인하세요.`} position="top" />
            
            <StockFee stockName={stockName} initialCode={stockCode} />

            <main className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
                {/* [공통 카드세션] 1. 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        📜 {stockName} 세금 및 실전 투자 분석 리포트
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {stockName}({stockCode}) 종목을 매도할 계획이신가요? 거래 시 발생하는 증권사 수수료와 거래세(국내) 또는 양도세(해외)를 
                        미리 모의계산하여 세금 떼고도 남는 진짜 수익을 확인해 보세요. {stockName} 투자 전략의 핵심은 '세후' 순수익을 지키는 것입니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* [공통 카드세션] 2. 사용 방법 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li>{stockName} 거래 시장(국내/해외)을 선택합니다.</li>
                            <li><strong>매수가, 매도가, 수량</strong>을 입력하세요.</li>
                            <li>이용 중인 증권사의 수수료율이 있다면 수정 반영 가능합니다.</li>
                            <li>'계산하기'를 통해 <strong>최소 익절가</strong>와 실수렁액을 확인하세요.</li>
                        </ul>
                    </section>

                    {/* [공통 카드세션] 3. 계산 예시 */}
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-green-500">📊</span> 계산 예시
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-1">
                            <p>{stockName} 1,000,000원 매도 시</p>
                            <p>거래세(0.18%): <strong>1,800원</strong> / 수수료(0.01%): <strong>100원</strong></p>
                            <p className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-1 text-red-500 font-bold">
                                예상 세후 수익: -1,900원 차감
                            </p>
                        </div>
                    </section>
                </div>

                {/* [공통 카드세션] 4. FAQ */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-purple-500">❓</span> 자주 묻는 질문 (FAQ)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. {stockName} 본전 가격은 어떻게 알 수 있나요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600 text-xs leading-relaxed">
                                A. 매수가에 매수/매도 수수료와 세금을 모두 합산한 금액보다 높은 지점이 본전입니다. JIKO 계산기의 **최소 익절가** 기능을 통해 확인하세요.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                                Q. {stockName} 종목이 코스피인지 코스닥인지에 따라 세금이 다른가요?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600 text-xs leading-relaxed">
                                A. 2026년 기준 코스피와 코스닥의 증권거래세는 동일하게 0.18% 부과됩니다. 단, 코스피의 경우 농특세(0.15%)가 거래세에 포함되어 표시되는 방식의 차이가 있습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* [개별 카드세션] 1. 수수료와 세금 투자 지식 섹션 */}
                <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        📊 주식 매매 시 꼭 알아야 할 수수료 및 세금 상식
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                        주식 투자에서 가장 중요한 것은 '벌었을 때 얼마나 지키느냐'입니다.
                        수익이 났더라도 수수료와 세금을 고려하지 않으면 실질적인 이익이 생각보다 작을 수 있습니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <h3 className="font-bold text-blue-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-blue-600 rounded-full" /> 국내 주식 (거래세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1 text-xs">
                                <li>매도 시점에 즉시 부과됩니다.</li>
                                <li>2026년 기준 코스피/코스닥 공통 0.18% (변동 가능)</li>
                                <li>손실이 나더라도 세금은 발생합니다.</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-bold text-orange-600 flex items-center gap-1">
                                <span className="w-1 h-3 bg-orange-600 rounded-full" /> 해외 주식 (양도세)
                            </h3>
                            <ul className="list-disc list-inside text-gray-500 space-y-1 text-xs">
                                <li>수익이 발생했을 때만 납부합니다.</li>
                                <li>연간 합산 수익 250만 원까지 공제</li>
                                <li>공제액 초과 수익에 대해 22% 부과</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
