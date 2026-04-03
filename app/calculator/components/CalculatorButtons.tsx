"use client";

import React from "react";

interface CalculatorButtonsProps {
    onReset: () => void;
    onCalculate: () => void;
    calculateText?: string;
}

const CalculatorButtons: React.FC<CalculatorButtonsProps> = ({ 
    onReset, 
    onCalculate, 
    calculateText = "계산하기" 
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={onReset}
                className="py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                초기화
            </button>
            <button
                onClick={onCalculate}
                className="py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all w-full flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {calculateText}
            </button>
        </div>
    );
};

export default CalculatorButtons;
