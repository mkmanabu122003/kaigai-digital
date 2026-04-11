import Image from "next/image";
import Link from "next/link";
import { countries } from "@/lib/countries";
import { getAllArticles } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import CountryFlag from "@/components/ui/CountryFlag";
import StarRating from "@/components/ui/StarRating";
import { WebSiteJsonLd } from "@/components/seo/JsonLd";

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <>
      <WebSiteJsonLd />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-800 py-12 text-white lg:py-20">
        {/* Background image (Next.js optimized) */}
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Gradient overlay for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-900/55 via-primary-800/45 to-primary-700/40"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1200px] px-4">
          <div className="text-center">
            {/* Pre-headline badge */}
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur lg:text-sm">
              口コミ・レビューを横断分析する独立メディア
            </span>

            {/* Main headline (H1) */}
            <h1 className="mt-5 text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl lg:mt-6 lg:text-5xl">
              海外で「ネット繋がらない」
              <br className="sm:hidden" />
              「LINE使えない」
              <br />
              を出発前に解決
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white drop-shadow-lg lg:mt-6 lg:text-lg">
              VPN・eSIM・海外送金の口コミとレビューを横断比較し、編集部が独自の見解で整理。
              <br className="hidden sm:block" />
              渡航先と用途で最適なサービスがすぐ見つかる、海外渡航者のための完全ガイド。
            </p>

            {/* Intent-based CTA cards */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3 lg:mt-10">
              <Link
                href="/compare/best-vpn"
                className="group flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:ring-white/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-accent-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-bold text-white">VPNを選ぶ</span>
                <span className="text-xs text-white/70">中国・地域制限対策</span>
              </Link>

              <Link
                href="/compare/best-esim"
                className="group flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:ring-white/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-accent-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-bold text-white">eSIMを選ぶ</span>
                <span className="text-xs text-white/70">200カ国対応・約500円〜</span>
              </Link>

              <Link
                href="/compare/overseas-remittance"
                className="group flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:ring-white/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-accent-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-bold text-white">送金を比較</span>
                <span className="text-xs text-white/70">Wise vs PayPal vs 銀行</span>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70 lg:mt-10 lg:text-sm">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                公式・口コミを横断リサーチ
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                出典付きで信頼できる
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                独立メディア・忖度なし
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 中国渡航者向け専用導線 */}
      <section className="border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 py-8 lg:py-10">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden="true">🇨🇳</span>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 lg:text-xl">
                  中国渡航の方へ — LINE・Google・Instagramは繋がりません
                </h2>
                <p className="mt-1 text-sm text-neutral-700">
                  出発前にVPN準備が必須。用途別に最適なサービスと設定方法をまとめました。
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/china/net-guide"
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700"
              >
                中国ネット環境ガイド →
              </Link>
              <Link
                href="/china/line-vpn"
                className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50"
              >
                LINEを使うVPN →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 国別ガイド */}
      <section
        id="countries"
        className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16"
      >
        <h2 className="mb-2 text-xl font-bold text-primary-700 lg:text-2xl">
          国別ガイド
        </h2>
        <p className="mb-8 text-sm text-neutral-700">
          渡航先別にネット環境・VPN・eSIM・決済の対応状況をまとめた完全ガイド
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/${country.id}`}
              aria-label={`${country.name}のネット環境・VPN・eSIM完全ガイド`}
              className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md"
            >
              <CountryFlag flag={country.flag} name={country.name} size="lg" />
              <div>
                <h3 className="font-bold text-neutral-900 group-hover:text-primary-700">
                  {country.name}のネット環境ガイド
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-700">
                  <span>ネット規制:</span>
                  <StarRating rating={country.internetRestriction} />
                </div>
                <p className="mt-1 text-xs text-neutral-700 line-clamp-2">
                  {country.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新記事 */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-xl font-bold text-primary-700 lg:text-2xl">
              最新記事
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              すべての記事を見る →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                frontmatter={article.frontmatter}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
