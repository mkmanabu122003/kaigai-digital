import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white/80">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              🌏 {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">カテゴリ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/compare/best-vpn" className="hover:text-white">
                  VPN比較
                </Link>
              </li>
              <li>
                <Link href="/guide/expat-checklist" className="hover:text-white">
                  赴任準備ガイド
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white">
                  記事検索
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white">
                  免責事項
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-6 text-center text-xs">
          <p className="mb-2">
            当サイトはアフィリエイト広告を利用しています。
          </p>
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
