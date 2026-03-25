import sitemap from "@/app/sitemap";
import { submitToBing } from "@/app/utils/bingIndexer";

/**
 * Bing IndexNow 수동 제출용 API
 * URL: https://jiko.kr/api/bing-submit
 */
export async function GET() {
    try {
        // 1. sitemap함수에서 전체 URL 가져오기
        const sm = sitemap();
        const urlList = Array.isArray(sm) ? sm.map(item => item.url) : [];

        if (urlList.length === 0) {
            return Response.json({ success: false, message: "No URLs found in sitemap" }, { status: 404 });
        }

        // 2. Bing으로 강제 제출 진행
        // forceSubmit=true를 통해 캐시를 무시하고 즉시 제출
        await submitToBing(urlList, true);

        return Response.json({
            success: true,
            timestamp: new Date().toISOString(),
            submittedCount: urlList.length,
            urls: urlList
        });
    } catch (error: any) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
