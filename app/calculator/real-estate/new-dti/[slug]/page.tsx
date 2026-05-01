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

            <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
                {/* [공통 카드세션] 1.6 메뉴 설명 */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 mt-4 animate-fade-slide-up">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 tracking-tight">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        {product.name} 신DTI 대응 가이드
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        <b>{product.name}</b> 이용 시 적용되는 강화된 신DTI 한도를 정밀하게 분석합니다. 
                        다주택자에게 적용되는 부채 합산 방식을 완벽하게 반영하여, 대출 가능 여부와 최적의 상환 전략을 제안해 드립니다.
                    </p>
                </section>

                {/* [공통 카드세션] 1.7 사용 방법 & 계산 예시 (2단 그리드) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-orange-500">🚀</span> 대출 전략 제안
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            기존 대출의 원금까지 부채로 잡히는 신DTI 규제 하에서는 <b>상환 기간 설정</b>이 매우 중요합니다. 
                            JIKO에서 다양한 시뮬레이션을 진행해 보세요.
                        </p>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-slide-up">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span className="text-red-500">⚖️</span> 규제 체크포인트
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                            추가 주담대 신청 시 <b>만기 제한</b> 등 추가적인 규제가 발생할 수 있습니다. 
                            본 리포트를 바탕으로 금융 전문가와 상의하시길 권장합니다.
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
