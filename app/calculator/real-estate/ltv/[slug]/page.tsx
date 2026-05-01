import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RealEstateMoreCalculators from "@/app/calculator/components/RealEstateMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import LtvCalculator from "../Ltv";
import NavBar from "@/app/calculator/components/NavBar";
import products from "../../data/products.json";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = decodeURIComponent(params.slug).normalize('NFC');
    const product = products.find((p) => p.slug === slug && p.category === "LTV");

    if (!product) {
        return { title: "LTV 계산기 | 주택담보대출 지역별 한도 및 규제 정밀 계산 - JIKO 계산기" };
    }

    return {
        title: `${product.name} LTV 계산기 | 주택담보대출 지역별 한도 및 규제 정밀 계산 - JIKO 계산기`,
        description: `${product.name} 최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요.`,
        keywords: product.keywords,
        alternates: { canonical: `https://jiko.kr/calculator/real-estate/ltv/${params.slug}` },
    };
}

export default function LtvProductPage({ params }: Props) {
    const slug = decodeURIComponent(params.slug).normalize('NFC');
    const product = products.find((p) => p.slug === slug && p.category === "LTV");

    if (!product) {
        notFound();
    }

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://jiko.kr" },
            { "@type": "ListItem", "position": 2, "name": "계산기", "item": "https://jiko.kr/calculator" },
            { "@type": "ListItem", "position": 3, "name": "부동산 계산기", "item": "https://jiko.kr/calculator/real-estate" },
            { "@type": "ListItem", "position": 4, "name": "LTV 계산기", "item": "https://jiko.kr/calculator/real-estate/ltv" },
            { "@type": "ListItem", "position": 5, "name": `${product.name} 상세 한도` }
        ]
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={`${product.name}`} description="최신 담보인정비율(LTV) 규제 완벽 반영! 규제 지역, 생애최초 혜택, 방공제 금액까지 포함하여 내 집 마련 실제 대출 가능액을 정밀하게 계산해 보세요." />

            <LtvCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        {product.name} LTV 분석 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        선택하신 <b>{product.name}</b> 조건에 최적화된 담보인정비율(LTV) 분석 환경입니다. 
                        지역별 규제 비율과 생애최초 혜택을 반영하여, 내 집 마련 시 필요한 실제 현금 규모와 대출 한도를 정밀하게 산출해 드립니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-amber-500">💡</span> 한도 산정 유의사항
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            LTV 한도는 KB시세 또는 감정가액을 기준으로 합니다. 
                            또한 대출 한도 내에서 <b>방공제(소액임차보증금 차감)</b>가 발생할 수 있으니 이를 고려해야 합니다.
                        </p>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-blue-500">🏘️</span> 생애최초 혜택
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            생애최초 주택 구입자의 경우 전 지역 LTV 80% (한도 6억) 혜택을 받을 수 있습니다. 
                            본인 조건에 맞는 최적의 한도를 지금 확인해 보세요.
                        </p>
                    </section>
                </div>

                <RealEstateMoreCalculators />
                <InstallBanner />
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    return products
        .filter(p => p.category === "LTV")
        .map((p) => ({ slug: p.slug }));
}
