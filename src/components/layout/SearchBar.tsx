"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchItem } from "@/lib/search";
import { trackSiteSearch } from "@/lib/ga";

type Props = {
  items: SearchItem[];
  placeholder?: string;
};

export default function SearchBar({
  items,
  placeholder = "記事を検索...",
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1 },
        { name: "tags", weight: 1.5 },
      ],
      threshold: 0.3,
    });
  }, [items]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    if (fuseRef.current) {
      const res = fuseRef.current.search(query).slice(0, 8);
      const items = res.map((r) => r.item);
      setResults(items);
      setIsOpen(true);
      trackSiteSearch(query, items.length);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-10 pr-4 text-base text-neutral-900 outline-none transition-shadow focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg">
          {results.map((item) => (
            <button
              key={item.slug}
              onClick={() => {
                router.push(item.url);
                setIsOpen(false);
                setQuery("");
              }}
              className="flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-neutral-50"
            >
              <span className="text-sm font-medium text-neutral-900">
                {item.title}
              </span>
              <span className="mt-0.5 text-xs text-neutral-700 line-clamp-1">
                {item.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-neutral-200 bg-white p-4 text-center text-sm text-neutral-700 shadow-lg">
          「{query}」に一致する記事が見つかりませんでした
        </div>
      )}
    </div>
  );
}
