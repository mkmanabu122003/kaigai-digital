"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/lib/config";
import MobileNav from "./MobileNav";

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const navItems: NavItem[] = [
  {
    label: "サービス比較",
    href: "/compare/best-vpn",
    children: [
      {
        label: "VPN比較",
        href: "/compare/best-vpn",
        description: "NordVPN・Surfshark・かべネコを徹底比較",
      },
      {
        label: "eSIM比較",
        href: "/compare/best-esim",
        description: "Airalo・Saily・trifa等おすすめ5選",
      },
      {
        label: "海外送金比較",
        href: "/compare/overseas-remittance",
        description: "Wise・PayPal・銀行送金を比較",
      },
      {
        label: "動画配信VPN",
        href: "/compare/streaming-vpn",
        description: "TVer・ABEMA・Netflixを海外から視聴",
      },
      {
        label: "番号維持SIM",
        href: "/compare/best-sim-number",
        description: "楽天・povo・LIBMOで番号を維持",
      },
    ],
  },
  {
    label: "国別ガイド",
    href: "/china/net-guide",
    children: [
      {
        label: "🇨🇳 中国",
        href: "/china/net-guide",
        description: "GFW規制対策・VPN・eSIM完全ガイド",
      },
      {
        label: "🇹🇭 タイ",
        href: "/thailand/net-guide",
        description: "VPNは必要？eSIMの選び方",
      },
      {
        label: "🇦🇪 UAE（ドバイ）",
        href: "/uae/whatsapp-line",
        description: "LINE通話・WhatsApp通話の規制と対策",
      },
      {
        label: "🇻🇳 ベトナム",
        href: "/vietnam/esim-comparison",
        description: "おすすめeSIM・容量別ガイド",
      },
    ],
  },
  {
    label: "準備ガイド",
    href: "/guide/expat-checklist",
    children: [
      {
        label: "赴任チェックリスト",
        href: "/guide/expat-checklist",
        description: "VPN・eSIM・送金・保険を完全網羅",
      },
      {
        label: "フリーWi-Fi安全対策",
        href: "/guide/hotel-wifi-safety",
        description: "ホテル・空港Wi-Fiの3大リスクと対策",
      },
      {
        label: "日本のテレビを海外で見る",
        href: "/guide/japan-streaming-abroad",
        description: "TVer・ABEMA・Netflix対応ガイド",
      },
    ],
  },
];

function DesktopDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-white/90 transition-colors hover:text-white"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        onMouseEnter={onOpen}
        className="flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white"
      >
        {item.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      {isOpen && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-lg bg-white py-2 shadow-xl ring-1 ring-black/5"
          onMouseLeave={onClose}
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onClose}
              className="block px-4 py-2.5 transition-colors hover:bg-neutral-50"
            >
              <span className="block text-sm font-medium text-neutral-900">
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
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-primary-800/95 shadow-lg backdrop-blur-sm"
          : "bg-primary-700 shadow-md"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 lg:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <DesktopDropdown
              key={item.label}
              item={item}
              isOpen={openDropdown === item.label}
              onOpen={() => setOpenDropdown(item.label)}
              onClose={() => setOpenDropdown(null)}
            />
          ))}
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
            aria-label="検索"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5"
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
            <span className="hidden lg:inline">検索</span>
          </Link>
        </nav>

        {/* Mobile: search + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
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
          <button
            className="flex items-center"
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
      </div>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}
