import { Metadata } from "next";
import DDayCalculator from "./DDay";
import NavBar from "@/app/calculator/components/NavBar";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd } from "@/app/utils/seo";

export const metadata: Metadata = {
  title: "디데이 계산기 | 커플 기념일, 시험일, 생일 D-day 계산 - JIKO 계산기",
  description: "중요한 날까지 남은 기간을 D-day로 확인하거나, 특정 일수 전후의 날짜를 계산해보세요. 100일, 1주년 등 주요 기념일 자동 계산 기능도 제공합니다.",
  keywords: ["디데이 계산기", "D-day 계산", "기념일 계산기", "수능 디데이", "커플 디데이", "날짜 계산"],
  openGraph: {
    title: "디데이 계산기 | 기념일 및 목표일 D-day 계산 - JIKO 계산기",
    description: "목표일까지 남은 날짜와 주요 기념일을 한눈에 확인하세요.",
    url: "https://jiko.kr/calculator/life/d-day",
    type: "website",
  },
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "홈", item: "https://jiko.kr" },
  { name: "계산기 홈", item: "https://jiko.kr/calculator" },
  { name: "생활", item: "https://jiko.kr/calculator/life" },
  { name: "디데이 계산기", item: "https://jiko.kr/calculator/life/d-day" },
]);

export default function Page() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NavBar title="디데이 계산기" description="중요한 날까지 남은 기간 확인" position="top" />
      <DDayCalculator />
      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
        <LifeMoreCalculators />
        <InstallBanner />
      </main>
    </div>
  );
}
