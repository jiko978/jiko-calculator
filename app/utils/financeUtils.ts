/**
 * 숫자를 한글 금액 상세 읽기로 변환 (예: 12345678 -> 1천 2백 3십 4만 5천 6백 7십 8)
 * 억, 천, 백, 만 단위가 모두 포함되도록 상세하게 변환합니다.
 */
export const numberToKorean = (num: number | string): string => {
    const value = typeof num === "string" ? Number(num.replace(/[^0-9]/g, "")) : num;
    if (!value || isNaN(value)) return "";

    const bigUnits = ["", "만", "억", "조", "경"];
    const smallUnits = ["", "십", "백", "천"];
    const numStr = Math.floor(value).toString();
    const result = [];
    
    // 4자리씩 끊어서 (만, 억, 조 단위) 처리
    for (let i = 0; i < numStr.length; i += 4) {
        const end = numStr.length - i;
        const start = Math.max(0, end - 4);
        const chunk = numStr.substring(start, end);
        const chunkValue = parseInt(chunk, 10);
        
        if (chunkValue === 0) {
            // 만약 억 단위는 살아있는데 만 단위가 통째로 0이면 단위만 추가할지 결정 필요
            // 예: 100000001 -> 1억 1 (만 단위 생략)
            continue;
        }
        
        let chunkResult = "";
        for (let j = 0; j < chunk.length; j++) {
            const digit = parseInt(chunk[chunk.length - 1 - j], 10);
            if (digit !== 0) {
                // 숫자가 1일 때 '일천'이라고 할지 '천'이라고 할지 선택
                // 여기서는 숫자를 포함한 '1천' 형태를 유지 (가독성 목적)
                chunkResult = digit + smallUnits[j] + " " + chunkResult;
            }
        }
        
        const bigUnit = bigUnits[i / 4];
        result.push(chunkResult.trim() + bigUnit);
    }
    
    // 뒤집혀 있는 배열을 다시 세우고 공백 정리
    return result.reverse().join(" ").replace(/\s+/g, " ").trim();
};
