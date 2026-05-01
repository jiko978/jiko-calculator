import { Metadata } from "next";
import { notFound } from "next/navigation";
import DsrCalculator from "../Dsr";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import FAQ from "@/app/calculator/components/FAQ";
import NavBar from "@/app/calculator/components/NavBar";
import products from "../../data/products.json";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const product = products.find(p => p.slug === decodeURIComponent(slug));

    if (!product) return { title: "DSR 계산기 | 총부채원리금상환비율 및 스트레스 DSR 한도 계산 - JIKO 계산기" };

    return {
        title: `${product.name} DSR 계산기 | 총부채원리금상환비율 및 스트레스 DSR 한도 계산 - JIKO 계산기`,
        description: `최신 규제 반영! ${product.name}의 DSR 및 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요.`,
        keywords: [product.name, ...product.keywords, "DSR계산기", "부동산대출규제"]
    };
}

export async function generateStaticParams() {
    return products.map((p) => ({
        slug: encodeURIComponent(p.slug),
    }));
}

const faqData = [
    {
        question: "DSR(총부채원리금상환비율)이란 무엇인가요?",
        answer: "DSR은 모든 가계대출의 원리금 상환액을 연간 소득으로 나눈 비율입니다. 현재 시중은행 기준 보통 40% 규제가 적용되어, 소득 대비 부채가 이 선을 넘으면 추가 대출이 제한됩니다."
    },
    {
        question: "스트레스 DSR이란 무엇이며 언제부터 적용되나요?",
        answer: "향후 금리 상승 가능성을 고려해 실제 금리에 '가산 금리'를 더해 대출 한도를 산정하는 제도입니다. 2024년 9월부터 2단계가 시행 중이며, 수도권 주담대에는 더 높은 가산금리가 적용됩니다."
    },
    {
        question: "DSR 계산 시 제외되는 대출도 있나요?",
        answer: "전세대출, 소액 생계비 대출, 서민금융상품(햇살론 등), 중도금대출 등은 DSR 산정 시 제외되거나 다른 기준이 적용될 수 있습니다. 정확한 규정은 금융사별로 상이할 수 있습니다."
    }
];

export default async function DsrProductPage({ params }: Props) {
    const slug = (await params).slug;
    const product = products.find(p => p.slug === decodeURIComponent(slug).normalize("NFC"));

    if (!product) notFound();

    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://jiko.kr" },
            { "@type": "ListItem", "position": 2, "name": "계산기", "item": "https://jiko.kr/calculator" },
            { "@type": "ListItem", "position": 3, "name": "부동산 계산기", "item": "https://jiko.kr/calculator/real-estate/dsr" },
            { "@type": "ListItem", "position": 4, "name": `${product.name} DSR 계산` }
        ]
    };

    return (
        <main>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
            
            <NavBar title={`${product.name} 한도 분석`} description="최신 규제 반영! 연소득 대비 대출 원리금 상환액 비율(DSR)과 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요." />

            <DsrCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        {product.name} DSR 분석 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        선택하신 <b>{product.name}</b> 조건에 최적화된 DSR 산출 환경입니다. 
                        최신 금융 규제와 <b>스트레스 DSR</b> 가산 금리를 보수적으로 적용하여, 실제 대출 신청 시 발생할 수 있는 오차를 최소화한 정밀 분석 결과를 제공합니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 부채 산정 원칙
                        </h2>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-3 list-disc ml-5 font-bold leading-relaxed">
                            <li>주담대: 최장 만기 기준 원리금 균등 산정</li>
                            <li>신용대출: 5년 균등분할 상환 간주</li>
                            <li>비주담대: 8년 균등분할 상환 간주</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-emerald-500">📌</span> 핵심 체크포인트
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            {product.name} 특성에 따른 우대 조건이나 규제 예외 항목이 있을 수 있으니, 
                            본 계산 결과를 바탕으로 반드시 해당 금융기관 상담을 받아보시기 바랍니다.
                        </p>
                    </section>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqData} />
                </div>

                <RealEstateMoreCalculators />
                
                <InstallBanner />
            </div>
        </main>
    );
}
