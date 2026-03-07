// ─────────────────────────────────────────────────────────
// app/components/GA4PageTracker.tsx
// ─────────────────────────────────────────────────────────

"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = "G-VHLZBZWZC8";

function PageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();

        window.gtag("config", GA_ID, {
            page_path: url,
        });
    }, [pathname, searchParams]);

    return null;
}

// useSearchParams 는 Suspense 필수 (빌드 오류 방지)
export default function GA4PageTrackerWrapper() {
    return (
        <Suspense fallback={null}>
            <PageViewTracker />
        </Suspense>
    );
}