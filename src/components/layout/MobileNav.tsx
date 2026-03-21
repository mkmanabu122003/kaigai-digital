"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
};

export default function MobileNav({ isOpen, onClose, navItems }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
        <div className="flex h-14 items-center justify-end px-4">
          <button onClick={onClose} aria-label="メニューを閉じる">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="border-b border-neutral-200 py-4 text-base font-medium text-neutral-900 transition-colors hover:text-primary-700"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            onClick={onClose}
            className="flex items-center gap-2 py-4 text-base font-medium text-neutral-900 transition-colors hover:text-primary-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            検索
          </Link>
        </nav>
      </div>
    </div>
  );
}
