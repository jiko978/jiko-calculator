import { Metadata } from "next";
import { notFound } from "next/navigation";
import Prepayment from "../Prepayment";
import NavBar from "@/app/calculator/components/NavBar";
import FAQ from "@/app/calculator/components/FAQ";
import FinanceMoreCalculators from "@/app/calculator/components/FinanceMoreCalculators";
import { generateBreadcrumbJsonLd, COMMON_BREADCRUMBS } from "@/app/utils/seo";
import productsData from "../../data/products.json";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return productsData.prepayment.map(p => ({ slug: p.slug.normalize('NFC') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.prepayment.find(p => p.slug.normalize('NFC') === normalizedSlug);
    if (!product) return {};

    return {
        title: `${product.name} 중도상환수수료 계산기 | 수수료 vs 이자 절감 분석 - JIKO 계산기`,
        description: `정확한 ${product.name} 중도상환수수료를 계산하고, 대출 유지 시 이자 비용과 비교하여 가장 유리한 상환 시점을 분석해 드립니다.`,
        keywords: [`${product.name}`, "중도상환수수료", "대출상환", "대출이자", "수수료면제"],
    };
}

const faqList = [
    {
        question: "3년이 지나면 무조건 중도상환수수료가 면제인가요?",
        answer: "일반적으로 국내 가계대출의 경우 대출 실행일로부터 3년이 경과하면 중도상환수수료가 전액 면제됩니다. 다만, 일부 특수 상품이나 사업자 대출 등은 약관이 다를 수 있으니 가입하신 대출 상품의 설명서를 꼭 확인해 주세요."
    },
    {
        question: "대출을 갚을 때 수수료를 내는 것이 유리할 수 있나요?",
        answer: "네, 그렇습니다. 남은 기간 동안 내야 할 '총 이자'가 '중도상환수수료'보다 많다면, 지금 당장 수수료를 내고서라도 원금을 갚아버리는 것이 경제적으로 이득입니다. 본 계산기는 이 두 가지 금액을 비교하여 손익을 명확히 알려드립니다."
    },
    {
        question: "은행마다 수수료율이 다른가요?",
        answer: "네, 은행과 대출 상품(담보/신용)에 따라 중도상환수수료율이 다릅니다. 통상 주택담보대출은 1.2%~1.4%, 신용대출은 0.7%~0.8% 선이며, 인터넷 은행의 경우 면제 혜택을 주기도 합니다. 정확한 요율은 각 은행 앱이나 약관에서 확인하셔서 계산기에 입력해 주세요."
    }
];

export default async function PrepaymentSlugPage({ params }: Props) {
    const { slug } = await params;
    const normalizedSlug = decodeURIComponent(slug).normalize('NFC');
    const product = productsData.prepayment.find(p => p.slug.normalize('NFC') === normalizedSlug);
    if (!product) notFound();

    const breadcrumbLd = generateBreadcrumbJsonLd([
        COMMON_BREADCRUMBS.HOME,
        COMMON_BREADCRUMBS.CALC_HOME,
        COMMON_BREADCRUMBS.FINANCE_HOME,
        COMMON_BREADCRUMBS.PREPAYMENT,
        { name: product.name, item: `/calculator/finance/prepayment/${product.slug}` }
    ]);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

            <NavBar title={`${product.name} 중도상환수수료 계산기`} description={`${product.name}을 중도에 갚을 때 발생하는 수수료와 이자 절감액을 비교하여 유리한 선택을 하세요.`} position="top" />

            <Prepayment />

            <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4 pt-2">
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💸</span> {product.name} 중도상환수수료 계산 가이드
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        대출금을 만기 전에 갚을 때 발생하는 <strong>{product.name} 중도상환수수료</strong>를 정확히 계산해 드립니다. 단순히 수수료만 확인하는 것이 아니라, 수수료를 지불하고 원금을 갚는 것이 남은 이자를 내는 것보다 이득인지 <strong>'이자 절감 분석'</strong>을 함께 제공합니다.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💡</span> 똑똑한 사용 방법
                        </h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                            <li><strong>상환할 금액</strong>과 해당 대출의 <strong>수수료율</strong>을 입력합니다. (예: 시중은행 주담대 보통 1.2%)</li>
                            <li><strong>대출 금리</strong>를 입력하면 남은 기간 대비 이자 절감액을 분석할 수 있습니다.</li>
                            <li>가장 정확한 결과를 원하시면 <strong>'날짜로 계산'</strong>을 선택해 대출 실행일을 입력하세요. (대부분 3년 후 면제)</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                            <span className="text-emerald-500">📊</span> 계산 예시 시나리오
                        </h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl space-y-2">
                            <p className="font-bold text-emerald-800 dark:text-emerald-400">"1억 상환, 수수료 1.2%, 잔존 기간 1년(365일)"</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>발생 수수료 :</strong> 약 40만 원</li>
                                <li><strong>이자 절감(금리 5% 가정) :</strong> 1년간 약 500만 원 절감</li>
                                <li className="font-bold text-blue-600 dark:text-blue-400">최종 결과 : 약 460만 원 이득!</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">* 즉, 40만원 수수료를 내고라도 빨리 갚는 것이 절대적으로 유리합니다.</p>
                        </div>
                    </section>
                </div>

                <FAQ faqList={faqList} />
                <FinanceMoreCalculators />
            </div>
        </main>
    );
}
