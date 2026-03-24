// app/utils/bingIndexer.ts
import fs from 'fs';
import path from 'path';

const BING_API_KEY = "4a7b68a7c5094627bb9cdec82eace89f";
const KEY_PATH = path.join(process.cwd(), 'public', 'last_submitted_urls.json');

export async function submitToBing(urlList: string[]) {
    // 1. 유효성 검사 (빈 리스트면 건너뜀)
    if (!urlList || urlList.length === 0) return;

    const host = "jiko.kr";
    
    // 2. 캐시 확인 및 비교 (중복 방어 로직)
    let lastUrls: string[] = [];
    try {
        if (fs.existsSync(KEY_PATH)) {
            lastUrls = JSON.parse(fs.readFileSync(KEY_PATH, 'utf-8'));
        }
    } catch (e) {
        console.error("Cache read error:", e);
    }

    // 3. 신규 URL 필터링 (기존 전송 이력이 없는 것만 추출)
    const newUrls = urlList.filter(url => !lastUrls.includes(url));

    if (newUrls.length === 0) {
        console.log("ℹ️ No new URLs found to submit to Bing.");
        return;
    }

    // 4. Bing IndexNow API 호출
    try {
        console.log(`🚀 Submitting ${newUrls.length} new URLs to Bing...`);
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

        if (response.ok) {
            console.log("✅ Bing IndexNow submission successful!");
            // 5. 성공 시 캐시 업데이트 (전체 전송 완료 이력 저장)
            fs.writeFileSync(KEY_PATH, JSON.stringify(urlList), 'utf-8');
        } else {
            console.error("❌ Bing IndexNow submission failed:", await response.text());
        }
    } catch (error) {
        console.error("⚠️ Error submitting to Bing:", error);
    }
}
