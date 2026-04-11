import { Metadata } from "next";
import { notFound } from "next/navigation";
import NewDtiCalculator from "../NewDti";
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

    if (!product) return { title: "신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기" };

    return {
        title: `${product.name} 신DTI 계산기 | 다주택자 대출 규제 및 주담대 원리금 합산 계산 - JIKO 계산기`,
        description: `${product.name} 이용 시 적용되는 신DTI 한도를 정밀하게 계산하세요. 다주택자 부채 합산 방식을 완벽하게 반영하여 리포트를 제공합니다.`,
        keywords: [product.name, ...product.keywords, "신DTI계산기", "다주택자대출규제"]
    };
}

export async function generateStaticParams() {
    return products
        .filter(p => p.category === "NEW-DTI")
        .map((p) => ({
            slug: encodeURIComponent(p.slug),
        }));
}

const faqData = [
    {
        question: "신DTI(New DTI)는 어떤 경우에 가장 큰 영향이 있나요?",
        answer: "이미 주택담보대출이 한 건 이상 있는 상태에서 추가로 주담대를 신청할 때 가장 큰 영향을 받습니다. 기존 대출의 원금까지 부채로 잡히기 때문에 한도가 상당 부분 줄어들게 됩니다."
    },
    {
        question: "신DTI 외에 DSR 규제도 동시에 적용되나요?",
        answer: "네, 현재 은행권 대출은 DTI/신DTI 뿐만 아니라 DSR 규제도 동시에 적용됩니다. JIKO의 DSR 계산기 탭을 이용하여 두 기준을 교차 검증해보시길 권장합니다."
    }
];

export default async function NewDtiProductPage({ params }: Props) {
    const slug = (await params).slug;
    const product = products.find(p => p.slug === decodeURIComponent(slug).normalize("NFC"));

    if (!product) notFound();

    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://jiko.kr" },
            { "@type": "ListItem", "position": 2, "name": "계산기", "item": "https://jiko.kr/calculator" },
            { "@type": "ListItem", "position": 3, "name": "부동산 계산기", "item": "https://jiko.kr/calculator/real-estate/new-dti" },
            { "@type": "ListItem", "position": 4, "name": `${product.name} 신DTI 계산` }
        ]
    };

    return (
        <main>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
            
            <NavBar title={`${product.name} 리포트`} description="다주택자를 위한 강화된 신DTI 규제 완벽 대응! 기존 주택담보대출의 원리금까지 모두 합산하여 실질적인 대출 한도를 정밀하게 분석해드립니다." />

            <NewDtiCalculator />

            <div className="max-w-3xl mx-auto px-4 pb-20">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
                        {product.name} 규제 대응 가이드
                    </h2>
                    <div className="p-5 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                        <p className="text-sm font-black text-orange-800 dark:text-orange-200 mb-2 leading-relaxed tracking-tight group">
                            🚀 다주택자를 위한 전략 제안
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed font-bold tracking-tight">
                            기존 대출의 상환 기간을 늘리거나 전세 반환 자금 등을 활용하여 실제 신DTI 비율을 조정하는 시뮬레이션을 위 탭에서 진행해 보세요.
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
