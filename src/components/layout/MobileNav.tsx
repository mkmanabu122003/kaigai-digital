"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem } from "./Header";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export default function MobileNav({ isOpen, onClose, navItems }: Props) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setExpandedItem(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-xl">
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-neutral-200">
          <span className="text-sm font-bold text-primary-700">メニュー</span>
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

        {/* Nav items */}
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label
                      )
                    }
                    className="flex w-full items-center justify-between px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                  >
                    {item.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-neutral-400 transition-transform ${
                        expandedItem === item.label ? "rotate-180" : ""
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
                  {expandedItem === item.label && (
                    <div className="bg-neutral-50 pb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block px-6 py-2.5 transition-colors hover:bg-neutral-100"
                        >
                          <span className="block text-sm font-medium text-neutral-800">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="block text-xs text-neutral-400 mt-0.5">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  {item.label}
                </Link>
              )}
              <div className="mx-4 border-b border-neutral-200" />
            </div>
          ))}

          {/* Search */}
          <Link
            href="/search"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-neutral-400"
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

        {/* Popular articles (CV導線) */}
        <div className="mt-4 border-t border-neutral-200 px-4 pt-4 pb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
            人気記事
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/compare/best-vpn"
              onClick={onClose}
              className="rounded-lg bg-primary-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              🔒 海外おすすめVPN 3選
            </Link>
            <Link
              href="/compare/best-esim"
              onClick={onClose}
              className="rounded-lg bg-primary-100 px-4 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-700 hover:text-white"
            >
              📱 海外おすすめeSIM 5選
            </Link>
            <Link
              href="/compare/overseas-remittance"
              onClick={onClose}
              className="rounded-lg bg-primary-100 px-4 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-700 hover:text-white"
            >
              💸 海外送金サービス比較
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
