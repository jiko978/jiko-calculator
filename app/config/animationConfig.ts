// ─────────────────────────────────────────────────────────
// app/config/animationConfig.ts
// 애니메이션 on/off 중앙 관리
// true = 활성화, false = 비활성화
// ─────────────────────────────────────────────────────────

export const ANIMATION = {
    pageEnter:  false,   // 페이지 진입 fadeIn
    resultBox:  true,   // 결과 박스 fadeIn + slideUp
    resetShake: true,   // 초기화 버튼 shake
} as const;