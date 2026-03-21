"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type Props = {
  variant?: "inline" | "sidebar" | "mobile";
};

export default function TableOfContents({ variant = "inline" }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const headings = document.querySelectorAll(
      ".article-content h2, .article-content h3"
    );
    const tocItems: TocItem[] = Array.from(headings).map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setItems(tocItems);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    const headings = document.querySelectorAll(
      ".article-content h2, .article-content h3"
    );
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  const tocList = (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
          <a
            href={`#${item.id}`}
            onClick={() => setIsOpen(false)}
            className={`block rounded px-2 py-1 transition-colors ${
              activeId === item.id
                ? "bg-primary-100 font-medium text-primary-700"
                : "text-neutral-700 hover:text-primary-700"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "mobile") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-neutral-900"
        >
          <span>目次</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        {isOpen && <div className="px-4 pb-4">{tocList}</div>}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="toc-sidebar rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-bold text-neutral-900">目次</h3>
        {tocList}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-neutral-900">目次</h3>
      {tocList}
    </div>
  );
}
