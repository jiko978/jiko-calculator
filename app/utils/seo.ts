/**
 * SEO BreadcrumbList JSON-LD Generator
 */

interface BreadcrumbItem {
    name: string;
    item: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item.startsWith("http") ? item.item : `https://jiko.kr${item.item}`,
        })),
    };
}

export const COMMON_BREADCRUMBS = {
    HOME: { name: "홈", item: "/" },
    CALC_HOME: { name: "계산기 홈", item: "/calculator" },

    FINANCE_HOME: { name: "금융 계산기", item: "/calculator/finance" },
    LOANS: { name: "대출 이자 계산기", item: "/calculator/finance/loans" },
    DEPOSITS: { name: "예금 이자 계산기", item: "/calculator/finance/deposits" },
    SAVINGS: { name: "적금 이자 계산기", item: "/calculator/finance/savings" },
    COMPOUND_INTEREST: { name: "복리 계산기", item: "/calculator/finance/compound-interest" },
    PREPAYMENT: { name: "중도상환수수료 계산기", item: "/calculator/finance/prepayment" },

    JOB_HOME: { name: "직장 계산기", item: "/calculator/job" },
    SALARY: { name: "연봉/월급 계산기", item: "/calculator/job/salary" },
    NET_PAY: { name: "실수령액 계산기", item: "/calculator/job/net-pay" },
    SEVERANCE_PAY: { name: "퇴직금 계산기", item: "/calculator/job/severance-pay" },
    UNEMPLOYMENT_BENEFIT: { name: "실업급여 계산기", item: "/calculator/job/unemployment-benefit" },
    INSURANCE: { name: "4대보험 계산기", item: "/calculator/job/insurance" },
    HOLIDAY_ALLOWANCE: { name: "주휴수당 계산기", item: "/calculator/job/holiday-allowance" },
    ANNUAL: { name: "연차 계산기", item: "/calculator/job/annual" },

    LIFE_HOME: { name: "생활 계산기", item: "/calculator/life" },
    AGE: { name: "나이 계산기", item: "/calculator/life/age" },
    DATE: { name: "날짜 계산기", item: "/calculator/life/date" },
    D_DAY: { name: "디데이 계산기", item: "/calculator/life/d-day" },
    DISCHARGE_DAY: { name: "전역일 계산기", item: "/calculator/life/discharge-day" },
    GRADE: { name: "학점 계산기", item: "/calculator/life/grade" },

    HEALTH_HOME: { name: "건강 계산기", item: "/calculator/health" },
    BMI: { name: "비만도 계산기", item: "/calculator/health/bmi" },
    OVULATION: { name: "배란일 계산기", item: "/calculator/health/ovulation" },
    BMR: { name: "기초대사량 계산기", item: "/calculator/health/bmr" },
    PREGNANCY: { name: "임신주수 계산기", item: "/calculator/health/pregnancy" },
    CALORIE: { name: "칼로리 계산기", item: "/calculator/health/calorie" },

    STOCK_HOME: { name: "주식 계산기", item: "/calculator/stock" },
    AVG_PRICE: { name: "주식 물타기 계산기", item: "/calculator/stock/avg-price" },
    PROFIT_RATE: { name: "주식 수익률 계산기", item: "/calculator/stock/profit-rate" },
    FEE: { name: "주식 수수료 계산기", item: "/calculator/stock/fee" },
    DIVIDEND: { name: "주식 배당금 계산기", item: "/calculator/stock/dividend" },

    REAL_ESTATE_HOME: { name: "부동산 계산기", item: "/calculator/real-estate" },
    DSR: { name: "DSR 계산기", item: "/calculator/real-estate/dsr" },
    NEW_DTI: { name: "신DTI 계산기", item: "/calculator/real-estate/new-dti" },
    DTI: { name: "DTI 계산기", item: "/calculator/real-estate/dti" },
    LTV: { name: "LTV 계산기", item: "/calculator/real-estate/ltv" },

    TAX_HOME: { name: "세금 계산기", item: "/calculator/tax" },
    VAT: { name: "부가세 계산기", item: "/calculator/tax/vat" },
    CAPITAL_GAINS: { name: "양도소득세 계산기", item: "/calculator/tax/capital-gains" },
    ACQUISITION: { name: "취득세 계산기", item: "/calculator/tax/acquisition" },
    CAR_TAX: { name: "자동차세 계산기", item: "/calculator/tax/car" },
    PROPERTY_TAX: { name: "재산세 계산기", item: "/calculator/tax/property" },
    COMPREHENSIVE_TAX: { name: "종합부동산세 계산기", item: "/calculator/tax/comprehensive" },
};

