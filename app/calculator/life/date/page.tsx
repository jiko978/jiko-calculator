import { Metadata } from "next";
import DateCalculator from "./Date";
import NavBar from "@/app/calculator/components/NavBar";
import LifeMoreCalculators from "@/app/calculator/components/LifeMoreCalculators";
import InstallBanner from "@/app/calculator/components/InstallBanner";
import { generateBreadcrumbJsonLd } from "@/app/utils/seo";

export const metadata: Metadata = {
  title: "날짜 계산기 | 날짜 일수 계산, 주수 계산, 개월수 확인 - JIKO 계산기",
  description: "두 날짜 사이의 정확한 기간을 계산하고, 특정 시점까지의 일수나 주수를 한눈에 확인하세요. 100일, 1주년 등 기념일 타임라인도 함께 확인하실 수 있습니다.",
  keywords: ["날짜 계산기", "날짜 수 계산", "디데이 계산", "주수 계산", "개월수 계산", "기념일 계산"],
  openGraph: {
    title: "날짜 계산기 | 날짜 일수 계산, 주수 계산 - JIKO 계산기",
    description: "두 날짜 사이의 정확한 기간을 계산하고 기념일 타임라인을 확인하세요.",
    url: "https://jiko.kr/calculator/life/date",
    type: "website",
  },
};

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: "홈", item: "https://jiko.kr" },
  { name: "계산기 홈", item: "https://jiko.kr/calculator" },
  { name: "생활", item: "https://jiko.kr/calculator/life" },
  { name: "날짜 계산기", item: "https://jiko.kr/calculator/life/date" },
]);

export default function Page() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <NavBar title="날짜 계산기" description="두 날짜 사이의 정확한 기간 확인" position="top" />
      <DateCalculator />
      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-4 mt-4">
        <LifeMoreCalculators />
        <InstallBanner />
      </main>
    </div>
  );
}
