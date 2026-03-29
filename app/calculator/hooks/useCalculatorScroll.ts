import { useEffect, useRef } from "react";

export function useCalculatorScroll(dependency: any) {
    const resultRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dependency) {
            // 결과 영역으로 부드럽게 스크롤
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [dependency]);

    return resultRef;
}
