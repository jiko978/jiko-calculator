import { Metadata } from "next";
import DischargeDayCalculator from "./DischargeDay";
import NavBar from "@/app/calculator/components/NavBar";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd } from "@/app/utils/seo";

export const metadata: Metadata = {
  title: "전역일 계산기 | 군대 전역일 계산, 복무율 확인, 진급일 예측 - JIKO 계산기",
  description: "입대일과 복무구분(육군, 해군, 공군 등)을 선택하여 정확한 전역일과 현재 복무율을 확인하세요. 이병부터 병장까지의 진급일 타임라인도 함께 제공합니다.",
  keywords: ["전역일 계산기", "군대 전역일", "복무율 계산", "진급일 계산", "육군 전역일", "공군 전역일", "해군 전역일"],
  openGraph: {
    title: "전역일 계산기 | 군대 전역일 및 진급일 자동 계산 - JIKO 계산기",
    description: "정확한 전역일과 실시간 복무율, 진급 마일스톤을 확인하세요.",
    url: "https://jiko.kr/calculator/life/discharge-day",
    type: "website",
  },
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "홈", item: "https://jiko.kr" },
  { name: "계산기 홈", item: "https://jiko.kr/calculator" },
  { name: "생활", item: "https://jiko.kr/calculator/life" },
  { name: "전역일 계산기", item: "https://jiko.kr/calculator/life/discharge-day" },
]);

export default function Page() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NavBar title="전역일 계산기" description="정확한 전역일과 복무 진행률 확인" position="top" />
      <DischargeDayCalculator />
      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
        <LifeMoreCalculators />
        <InstallBanner />
      </main>
    </div>
  );
}
