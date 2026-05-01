import { Metadata } from "next";
import { notFound } from "next/navigation";
import CompoundInterest from "../CompoundInterest";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import productsData from "../../data/products.json";
import InstallBanner from "@/app/calculator/components/InstallBanner";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return productsData.compoundInterest.map(p => ({ slug: p.slug.normalize('NFC') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.compoundInterest.find(p => p.slug.normalize('NFC') === normalizedSlug);
    if (!product) return {};

    return {
        title: `${product.name} | 미래가치, 필요기간, 목표수익률, 월적립액 계산 - JIKO 계산기`,
        description: `눈덩이처럼 불어나는 ${product.name}의 마법! 미래가치, 필요기간, 목표수익률, 필요 월 적립액을 계산하고 인플레이션을 반영한 실질 가치까지 확인해보세요.`,
        keywords: [product.name, "복리 계산기", "적립식 투자", "미래가치 계산", "복리 수익", "투자 수익률"],
    };
}

const faqList = [
    {
        question: "주식이나 ETF 투자도 복리로 계산할 수 있나요?",
        answer: "네! 주식/ETF 투자는 배당금을 재투자하고 장기 보유할 경우 연평균 수익률(CAGR) 개념을 적용하여 복리 계산기와 매우 유사한 궤적을 그립니다."
    },
    {
        question: "물가상승률(인플레이션)은 어떻게 고려해야 하나요?",
        answer: "JIKO 복리 계산기의 '인플레이션 반영' 기능을 켜고 예상 물가상승률(통상 2.5~3%)을 입력하면, 수십 년 뒤의 미래 금액이 '현재 가치로 얼마의 구매력'을 가지는지 현실적으로 보여줍니다."
    },
    {
        question: "실제 투자 상품에서 복리를 어떻게 적용하나요?",
        answer: "예적금은 만기 시 원금과 이자가 지급되어 자동으로 복리 효과가 없지만, 만기 후 재예치하면 복리 효과를 얻을 수 있습니다. 펀드나 ETF는 배당금을 재투자(DRIP)하면 복리 효과가 발생합니다. 주가 상승분은 자동으로 복리 효과가 적용됩니다. 연금저축펀드는 과세 이연으로 복리 효과가 극대화됩니다."
    }
];

export default async function CompoundInterestSlugPage({ params }: Props) {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.compoundInterest.find(p => p.slug.normalize('NFC') === normalizedSlug);
    if (!product) notFound();

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.COMPOUND_INTEREST,
        { name: product.name, item: `/calculator/finance/compound-interest/${product.slug}` }
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={`${product.name} 복리 계산기`} description={`${product.name}의 미래가치, 필요기간, 목표수익률, 필요 월 적립액을 4-in-1으로 정확하게 계산하세요.`} position="top" />

            <CompoundInterest />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-2">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📈</span> {product.name} 가이드 (Snowball Effect)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        복리는 원금에만 이자가 붙는 단리와 달리 '원금+발생한 이자'에 또다시 이자가 붙는 마법 같은 방식입니다. JIKO의 <strong>{product.name}</strong>는 <b>미래가치, 필요기간, 필요수익률, 월 적립액</b>을 모두 역산할 수 있는 4-in-1 통합 환경을 제공합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 모드별 똑똑한 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>미래 가치 계산 :</strong> 내 투자 습관을 유지했을 때 노후 자산이 얼마나 될지 시뮬레이션 하세요.</li>
                            <li><strong>필요 기간 계산 :</strong> 파이어족(FIRE) 등 조기 은퇴를 위해 목표 금액까지 얼마나 남았는지 확인하세요.</li>
                            <li><strong>목표 수익률 계산 :</strong> 내 목표가 현실적인지 점검하고, 필요한 투자 상품(주식, ETF 등) 기준을 세워보세요.</li>
                            <li><strong>필요 월적립액 계산 :</strong> 5년 뒤 1억 모으기 등 확실한 재무 목표를 위한 강제 저축액을 산출하세요.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-indigo-500">💰</span> 성공적인 복리 투자 3원칙 가이드
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl space-y-3">
                            <p><strong>1. 시간(Time) :</strong> 복리의 가장 큰 무기는 시간입니다. 10년 일찍 시작하는 것이 원금을 2배 늘리는 것보다 유리합니다.</p>
                            <p><strong>2. 방어(Return) :</strong> -50% 손실 시 원금 회복에 +100% 수익이 필요합니다. 잃지 않는 투자가 중요합니다.</p>
                            <p><strong>3. 재투자(Reinvest) :</strong> 배당금이나 발생한 이자를 인출하지 않고 다시 굴려야 복리가 완성됩니다.</p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-amber-500">⚖️</span> 복리 vs 단리, 차이점 비교
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                            <p><strong>단리 (Simple Interest)</strong><br />원금에 대해서만 이자가 붙는 방식입니다. 자산이 정비례 직선(Linear) 형태로 천천히 상승합니다.</p>
                            <div className="w-full h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                            <p><strong>복리 (Compound Interest)</strong><br />원금과 이자가 합쳐진 금액에 다시 이자가 붙습니다. 시간이 지날수록 자산이 눈덩이처럼 기하급수적(Exponential)으로 불어납니다. 장기 투자일수록 효과가 극대화됩니다.</p>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-emerald-500">📊</span> 복리 계산 예시 시나리오
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl space-y-2">
                            <p className="font-bold text-emerald-800 dark:text-emerald-400">"초기 1천만원, 월 50만원, 20년 투자 (연 10%)"</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>총 투자 원금 :</strong> 1억 3,000만 원</li>
                                <li><strong>20년 후 최종 자산 :</strong> 약 4억 4,700만 원</li>
                                <li className="font-bold text-blue-600 dark:text-blue-400">결과 : 원금의 3배가 넘는 자산 형성!</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">* 발생한 수익(약 3.1억)이 순수 투자원금보다 훨씬 큽니다.</p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <FinanceMoreCalculators />
                <InstallBanner />
            </div>
        </main>
    );
}
