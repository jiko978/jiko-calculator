// app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL = "https://jiko.kr";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        // ── 홈(2) ──
        { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { url: "/calculator", priority: 1.0, changeFrequency: "weekly" as const },

        // ── 금융(4) ──
        { url: "/calculator/finance",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/deposits",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/savings", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/loans", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 직장(8) ──
        { url: "/calculator/job",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/salary",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/net-pay",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/severance-pay",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/unemployment-benefit",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/insurance",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/holiday-allowance",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/annual",  priority: 0.8, changeFrequency: "monthly" as const },

        // ── 생활(5) ──
        { url: "/calculator/life",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/life/age",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/life/date",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/life/d-day",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/life/discharge-day",  priority: 0.8, changeFrequency: "monthly" as const },

        // ── 건강(6) ──
        { url: "/calculator/health",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/bmi",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/bmr", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/calorie", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/ovulation", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/pregnancy", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 세금(7) ──
        { url: "/calculator/tax",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/vat",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/capital-gains",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/acquisition",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/car",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/property",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/tax/comprehensive",  priority: 0.8, changeFrequency: "monthly" as const },

        // ── 주식(5) ──
        { url: "/calculator/stock",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/avg-price",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/profit-rate", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/dividend", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/fee", priority: 0.8, changeFrequency: "monthly" as const },

        // ──부동산(4) ──
        { url: "/calculator/real-estate",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/real-estate/dsr",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/real-estate/new-dti",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/real-estate/dti",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/real-estate/ltv",  priority: 0.8, changeFrequency: "monthly" as const },

        // ── 정책(5) ──
        { url: "/policy/about", priority: 0.5, changeFrequency: "monthly" as const },
        { url: "/policy/contact", priority: 0.5, changeFrequency: "monthly" as const },
        { url: "/policy/privacy", priority: 0.3, changeFrequency: "monthly" as const },
        { url: "/policy/terms", priority: 0.3, changeFrequency: "monthly" as const },
        { url: "/policy/disclaimer", priority: 0.3, changeFrequency: "monthly" as const },
    ];

    const finalSitemap = routes.map(({ url, priority, changeFrequency }) => ({
        url: `${BASE_URL}${url}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    return finalSitemap;
}
