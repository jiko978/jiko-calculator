// ─────────────────────────────────────────────────────────
// app/components/RegisterSW.tsx
// Service Worker 등록 전용 Client Component
// ─────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";

export default function RegisterSW() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("SW registered:", reg.scope))
                .catch((err) => console.error("SW registration failed:", err));
        }
    }, []);

    return null;
}