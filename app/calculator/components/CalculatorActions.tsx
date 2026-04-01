"use client";

import { useState } from "react";
import ShareSheet from "./ShareSheet";

interface CalculatorActionsProps {
    onCopy: () => Promise<void> | void;
    shareTitle: string;
    shareDescription: string;
}

export default function CalculatorActions({ onCopy, shareTitle, shareDescription }: CalculatorActionsProps) {
    const [copied, setCopied] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const handleCopyClick = async () => {
        try {
            await onCopy();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                <button
                    onClick={handleCopyClick}
                    className={`flex-1 py-4 font-bold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 ${copied ? "bg-green-500 text-white" : "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"} shadow-xl`}
                >
                    {copied ? (
                        <><span>✅</span> 복사 완료</>
                    ) : (
                        <><span>📋</span> 결과 복사하기</>
                    )}
                </button>
                <button 
                    onClick={() => setShowShare(true)} 
                    className="flex-1 py-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000]/80 font-bold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-xl"
                >
                    <span>💬</span> 친구에게 공유하기
                </button>
            </div>

            {showShare && (
                <ShareSheet
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    title={shareTitle}
                    description={shareDescription}
                    onClose={() => setShowShare(false)}
                />
            )}
        </>
    );
}
