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
    <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-2xl mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
