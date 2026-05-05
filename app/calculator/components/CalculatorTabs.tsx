"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface CalculatorTabsProps {
  tabs: Tab[];
}

/**
 * CalculatorTabs - 연관된 계산기 메뉴들을 탭 형태로 연결하는 공통 컴포넌트
 * @param tabs - 탭 목록 (라벨과 이동할 경로)
 */
const CalculatorTabs = ({ tabs }: CalculatorTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 mb-6 flex overflow-x-auto hide-scrollbar gap-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 min-w-[100px] py-3 px-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap text-center ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default CalculatorTabs;
