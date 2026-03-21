"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
};

export default function FAQ({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="my-6 space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-neutral-200 bg-white"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <span className="text-primary-700">Q.</span>
              {item.question}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === i && (
            <div className="border-t border-neutral-200 px-5 py-4">
              <p className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                <span className="font-bold text-accent-500">A.</span>
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
