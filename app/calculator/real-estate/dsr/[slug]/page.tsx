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

    if (!product) return { title: "DSR 계산기 | JIKO" };

    return {
        title: `${product.name} DSR 한도 계산기 | 스트레스 DSR 완벽 반영 - JIKO`,
        description: `2025 최신 규제 반영! ${product.name}의 DSR 및 스트레스 DSR 단계별 한도, 추가 대출 가능액을 정밀하게 계산해 보세요.`,
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
            
            <NavBar title={`${product.name} 한도 분석`} description="2025 최신 규제 기반 DSR 결과 레포트 - JIKO" />

            <DsrCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight group">
                        <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
                        {product.name} 핵심 가이드
                    </h2>
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-sm font-black text-emerald-800 dark:text-emerald-200 mb-2 leading-relaxed tracking-tight group">
                            📌 JIKO에서 분석한 가이드
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-bold tracking-tight">
                            {product.name}의 특성을 고려하여 가산 금리를 보수적으로 설정한 한도 데이터입니다. 실제 은행 대출 신청 전 나의 상환 능력을 미리 점검해 보세요.
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                        <p className="text-base font-black text-gray-800 dark:text-gray-200 mb-2 leading-relaxed tracking-tight group">💡 DSR 부채산정 방식의 변화</p>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2 list-disc ml-5 font-bold leading-relaxed">
                            <li>주택담보대출: 최장 만기(30~40년)를 기준으로 원리금 균등 산정</li>
                            <li>신용대출: 실제 만기 관계없이 5년 균등분할 상환으로 간주</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4">
                    <FAQ faqList={faqData} />
                </div>

                <RealEstateMoreCalculators />
                
                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </main>
    );
}
