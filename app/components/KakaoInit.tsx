// ─────────────────────────────────────────────────────────
// KakaoInit.tsx — 카카오 SDK 초기화 전용 Client Component
// layout.tsx 에서 <KakaoInit /> 으로 사용
// ─────────────────────────────────────────────────────────

"use client";

import Script from "next/script";

// 카카오 SDK 전체 타입 선언 (init 포함)
declare global {
    interface Window {
        Kakao: {
            init: (appKey: string | undefined) => void;
            isInitialized: () => boolean;
            Share: {
                sendDefault: (settings: object) => void;
            };
        };
    }
}

export default function KakaoInit() {
    return (
        <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
            strategy="afterInteractive"
            onLoad={() => {
                if (window.Kakao && !window.Kakao.isInitialized()) {
                    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
                }
            }}
        />
    );
}