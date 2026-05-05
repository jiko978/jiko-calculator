import { NextResponse } from "next/server";

const API_KEY = "dIGJfVyhYFQE9KzubziEHpJriXacRJFZ";

function getFormattedDate(date: Date) {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

export async function GET(request: Request) {
    let currentDate = new Date();
    
    // 최대 7일 전까지만 재조회 (무한 루프 방지)
    for (let i = 0; i < 7; i++) {
        const searchDate = getFormattedDate(currentDate);
        
        try {
            const url = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${searchDate}&data=AP01`;
            
            // Korea EXIM API는 1일 1회 업데이트 되므로 백엔드에서 1시간 이상 캐싱해도 무방
            const response = await fetch(url, {
                next: { revalidate: 3600 },
            });

            if (response.ok) {
                const data = await response.json();
                
                // 데이터가 배열이고 요소가 있으면 성공
                if (Array.isArray(data) && data.length > 0) {
                    return NextResponse.json({
                        success: true,
                        date: searchDate,
                        rates: data
                    });
                }
            }
        } catch (error) {
            console.error(`Korea EXIM API Error on ${searchDate}:`, error);
        }

        // 데이터가 없거나 에러가 났다면 전날로 하루 빼기
        currentDate.setDate(currentDate.getDate() - 1);
    }

    return NextResponse.json(
        { success: false, error: "Failed to fetch EXIM rates after 7 retries" },
        { status: 500 }
    );
}
