import { useEffect, useRef } from "react";

export function useCalculatorScroll(dependency: any) {
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dependency) {
            // 결과 영역으로 부드럽게 스크롤
            setTimeout(() => {
                if (resultRef.current) {
                    const y = resultRef.current.getBoundingClientRect().top + window.scrollY - 125;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }, 300);
        }
    }, [dependency]);

    return resultRef;
}
