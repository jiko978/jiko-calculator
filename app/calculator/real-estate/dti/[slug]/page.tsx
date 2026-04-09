import { Metadata } from "next";
import { notFound } from "next/navigation";
import DtiCalculator from "../Dti";
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

    if (!product) return { title: "DTI 계산기 | JIKO" };

    return {
        title: `${product.name} 한도 계산기 | DTI 정밀 분석 - JIKO`,
        description: `${product.name}의 DTI 비율과 추가 대출 가능액을 실시간으로 계산하세요. 소득 대비 부채 상환 여력을 정밀하게 분석해드립니다.`,
        keywords: [product.name, ...product.keywords, "DTI계산기", "부동산대출"]
    };
}

export async function generateStaticParams() {
    return products
        .filter(p => p.category === "DTI")
        .map((p) => ({
            slug: encodeURIComponent(p.slug),
        }));
}

const faqData = [
    {
        question: "DTI 계산 시 연소득은 어떻게 산정하나요?",
        answer: "근로소득자는 원천징수영수증상의 세전 소득을 기준으로 하며, 사업소득자는 소득금액증명원상의 금액을 기준으로 합니다. 증빙이 어려운 경우 건강보험료 등으로 추정 소득을 적용하기도 합니다."
    },
    {
        question: "주택담보대출이 여러 건인 경우 DTI는 어떻게 계산되나요?",
        answer: "주택담보대출은 신규 대출과 기존 대출의 원리금을 모두 합산하지만, 신용대출 등 기타 대출은 이자만 합산합니다. 다만 다주택자의 경우 신DTI 규제가 적용되어 기준이 더욱 강화될 수 있습니다."
    }
];

export default async function DtiProductPage({ params }: Props) {
    const slug = (await params).slug;
    const product = products.find(p => p.slug === decodeURIComponent(slug).normalize("NFC"));

    if (!product) notFound();

    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://jiko.kr" },
            { "@type": "ListItem", "position": 2, "name": "계산기", "item": "https://jiko.kr/calculator" },
            { "@type": "ListItem", "position": 3, "name": "부동산 계산기", "item": "https://jiko.kr/calculator/real-estate/dti" },
            { "@type": "ListItem", "position": 4, "name": `${product.name} DTI 계산` }
        ]
    };

    return (
        <main>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
            
            <NavBar title={`${product.name} DTI 분석`} description="상품별 맞춤형 DTI 결과 리포트 - JIKO" />

            <DtiCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        {product.name} 맞춤형 가이드
                    </h2>
                    <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm font-black text-blue-800 dark:text-blue-200 mb-2 leading-relaxed tracking-tight group">
                            💡 {product.name} 이용 시 주의사항
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed font-bold tracking-tight">
                            {product.name}의 상환 방식(원리금균등 등)과 기간에 따라 DTI 결과가 크게 달라집니다. 본 계산기는 표준적인 상품 기준을 적용하였습니다.
                        </p>
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
