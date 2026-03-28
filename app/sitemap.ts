// app/sitemap.ts
import { MetadataRoute } from "next";

const BASE_URL = "https://jiko.kr";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        // ── 홈 ──
        { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { url: "/calculator", priority: 1.0, changeFrequency: "weekly" as const },

        // ── 주식 ──
        { url: "/calculator/stock",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/avg-price",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/profit-rate", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/dividend", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/stock/fee", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 금융 ──
        { url: "/calculator/finance",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/deposits",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/savings", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/finance/loans", priority: 0.8, changeFrequency: "monthly" as const },

        // ── 직장 ──
        { url: "/calculator/job",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/salary",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/net-pay",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/severance-pay",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/unemployment-benefit",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/job/insurance",  priority: 0.8, changeFrequency: "monthly" as const },

        // ── 건강 ──
        { url: "/calculator/health",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/bmi",  priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/bmr", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/calorie", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/ovulation", priority: 0.8, changeFrequency: "monthly" as const },
        { url: "/calculator/health/pregnancy", priority: 0.8, changeFrequency: "monthly" as const },

        // ── policy ──
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
