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
        return { title: "LTV 계산기 - JIKO" };
    }

    return {
        title: `${product.name} 한도 계산 | 2025 최신 규제 반영 - JIKO`,
        description: `${product.name} 한도 및 실제 입금액을 계산해 보세요. 지역별 LTV와 방공제 금액을 자동으로 차산하여 정밀한 결과를 제공합니다.`,
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

            <NavBar title={`${product.name}`} description="상품별 정밀 한도 및 방공제 리포트 - JIKO" />

            <LtvCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <RealEstateMoreCalculators />
                <div className="mt-4">
                    <InstallBanner />
                </div>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    return products
        .filter(p => p.category === "LTV")
        .map((p) => ({ slug: p.slug }));
}
