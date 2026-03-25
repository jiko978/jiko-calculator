// app/utils/bingIndexer.ts
import fs from 'fs';
import path from 'path';

const BING_API_KEY = "4a7b68a7c5094627bb9cdec82eace89f";
const CACHE_PATH = path.join(process.cwd(), 'public', 'last_submitted_urls.json');

/**
 * Bing IndexNow API를 통해 새로운 URL을 제출합니다.
 * @param urlList 제출할 전체 URL 리스트
 * @param forceSubmit true일 경우 캐시 비교 없이 강제 제출 (오늘 날짜 이력 남기기 위함)
 */
export async function submitToBing(urlList: string[], forceSubmit: boolean = false) {
    if (!urlList || urlList.length === 0) return;

    const host = "jiko.kr";
    
    // 1. 캐시 확인 및 비교 (중복 방어 로직)
    let lastUrls: string[] = [];
    if (!forceSubmit) {
        try {
            if (fs.existsSync(CACHE_PATH)) {
                lastUrls = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
            }
        } catch (e) {
            console.error("Cache read error:", e);
        }
    }

    // 2. 신규 URL 필터링 (forceSubmit이 true면 전체를 신규로 처리)
    const newUrls = forceSubmit ? urlList : urlList.filter(url => !lastUrls.includes(url));

    if (newUrls.length === 0) {
        console.log("ℹ️ No new URLs found to submit to Bing.");
        return;
    }

    // 3. Bing IndexNow API 호출
    try {
        console.log(`🚀 Submitting ${newUrls.length} URLs to Bing IndexNow (Force: ${forceSubmit})...`);
        const response = await fetch(`https://www.bing.com/indexnow`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                host: host,
                key: BING_API_KEY,
                keyLocation: `https://${host}/${BING_API_KEY}.txt`,
                urlList: newUrls,
            }),
        });

        const resText = await response.text();
        if (response.ok) {
            console.log(`✅ Bing IndexNow submission successful! (Status: ${response.status})`);
            // 4. 성공 시 전체 목록을 캐시에 저장
            try {
                fs.writeFileSync(CACHE_PATH, JSON.stringify(urlList), 'utf-8');
            } catch (e) {
                console.error("Cache write error:", e);
            }
        } else {
            console.error(`❌ Bing IndexNow submission failed (Status: ${response.status}):`, resText);
        }
    } catch (error) {
        console.error("⚠️ Error submitting to Bing:", error);
    }
}
