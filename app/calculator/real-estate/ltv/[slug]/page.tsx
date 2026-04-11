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
