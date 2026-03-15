import type { Metadata, ResolvingMetadata } from "next";
import ProfitRate from "../ProfitRate";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "../../../../utils/seo";

const BASE_URL = "https://jiko.kr";

interface Props {
    params: Promise<{ slug: string }>;
}

import stocksData from "../../data/stocks.json";

interface Stock {
    name: string;
    code: string;
    market: string;
}

function findStock(slug: string): { name: string; code?: string } {
    const decoded = decodeURIComponent(slug);
    
    // 1. 하이브리드 패턴 (삼성전자-005930)
    if (decoded.includes("-")) {
        const [name, code] = decoded.split("-");
        return { name, code };
    }
    
    // 2. 종목 코드 패턴 (005930)
    if (/^\d{6}$/.test(decoded)) {
        const stock = stocksData.find(s => s.code === decoded);
        return stock ? { name: stock.name, code: stock.code } : { name: decoded };
    }
    
    // 3. 종목명 패턴 (삼성전자)
    const stockByName = stocksData.find(s => s.name === decoded);
    return stockByName ? { name: stockByName.name, code: stockByName.code } : { name: decoded };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const { name, code } = findStock(slug);
    const displayCode = code ? `(${code})` : "";

    // 사용자 제안 기반 SEO 패턴 적용
    return {
        title: `${code || ""} ${name} 수익률 계산기 | ${name} 투자 수익 계산 - JIKO`,
        description: `${name} 수익률 계산기 | ${code || ""} 투자 수익 시뮬레이션. 매수가, 현재가, 수량만 입력하면 세금과 수수료를 제외한 실질 수익을 바로 확인하세요.`,
        keywords: [name, code, "수익률", "수익금", "주식 계산기", `${name} 수익률`, `${code} 수익률`].filter(Boolean) as string[],
        alternates: { canonical: `${BASE_URL}/calculator/stock/profit-rate/${slug}` },
        openGraph: {
            title: `${name}${displayCode} 수익률 계산기`,
            description: `${name} 수익 현황 및 투자 수익률 리포트`,
            url: `${BASE_URL}/calculator/stock/profit-rate/${slug}`,
            images: [`${BASE_URL}/calculator/jiko-calculator-icon2.png`],
        },
    };
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const { name, code } = findStock(slug);

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.STOCK_HOME,
        COMMON_BREADCRUMBS.PROFIT_RATE,
        { name: name, item: `/calculator/stock/profit-rate/${slug}` }
    ]);

    const stockSchema = code ? {
        "@context": "https://schema.org",
        "@type": "InvestmentOrDeposit",
        "name": name,
        "tickerSymbol": code,
        "url": `${BASE_URL}/calculator/stock/profit-rate/${slug}`
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
             <ProfitRate stockName={name} initialCode={code} />

             <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        💰 {name} {code ? `(${code})` : ""} 투자 수익 분석
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {name} 종목의 현재 수익금이 궁금하신가요? {code ? `티커 ${code}` : "해당 종목"}의 매수가와 현재가, 수량을 입력하여 
                        수수료를 제외한 실질 수익률을 한눈에 확인해 보세요.
                    </p>
                </section>
             </main>
        </div>
    );
}
