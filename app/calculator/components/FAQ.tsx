"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqList: FAQItem[];
}

const FAQ = ({ faqList }: FAQProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-purple-500">❓</span> 자주 묻는 질문 (FAQ)
            </h2>

            <div className="space-y-4">
                {faqList.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center text-left font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <span>Q. {item.question}</span>
                            <span className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
                                🔽
                            </span>
                        </button>
                        {openIndex === index && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-purple-300 dark:border-purple-600 leading-relaxed">
                                A. {item.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
