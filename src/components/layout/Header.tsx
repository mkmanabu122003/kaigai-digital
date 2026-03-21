"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";
import MobileNav from "./MobileNav";

const navItems = [
  { label: "VPN比較", href: "/compare/best-vpn" },
  { label: "国別ガイド", href: "/#countries" },
  { label: "赴任準備", href: "/guide/expat-checklist" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-700 text-white shadow-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 lg:h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🌏</span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="text-white/80 transition-colors hover:text-white"
            aria-label="検索"
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
          </Link>
        </nav>

        <button
          className="flex items-center md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="メニューを開く"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}
