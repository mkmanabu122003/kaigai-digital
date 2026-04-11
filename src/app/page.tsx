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
                <span className="text-xs text-white/70">200カ国対応・$3.50〜</span>
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
                <span className="text-xs text-white/70">手数料を最大91%削減</span>
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

      {/* 比較・まとめガイド */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <h2 className="mb-8 text-xl font-bold text-primary-700 lg:text-2xl">
          比較・まとめガイド
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/compare/best-vpn",
              title: "海外おすすめVPN 3選",
              desc: "NordVPN・Surfshark・かべネコを料金・速度・使いやすさで徹底比較",
            },
            {
              href: "/compare/best-esim",
              title: "海外eSIMおすすめ5選",
              desc: "公式情報と口コミを横断比較。料金・速度ランキングと失敗しない選び方",
            },
            {
              href: "/compare/streaming-vpn",
              title: "海外から日本の動画を見る方法",
              desc: "TVer・ABEMA・Netflix対応VPNを実際に検証",
            },
            {
              href: "/compare/overseas-remittance",
              title: "海外送金 手数料比較",
              desc: "Wise vs PayPal vs 銀行。手数料を最大91%安くする方法",
            },
            {
              href: "/compare/best-sim-number",
              title: "海外赴任の番号維持",
              desc: "povo・楽天・LIBMOを比較。最安で日本の番号をキープ",
            },
            {
              href: "/compare/rakuten-mobile-overseas",
              title: "楽天モバイル海外利用ガイド",
              desc: "無料2GBの活用法と足りない時の対策",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md"
            >
              <h3 className="font-bold text-neutral-900 group-hover:text-primary-700">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新記事 */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 pb-12 lg:pb-16">
          <h2 className="mb-8 text-xl font-bold text-primary-700 lg:text-2xl">
            最新記事
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 24).map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                frontmatter={article.frontmatter}
              />
            ))}
          </div>
        </section>
      )}

      {/* すべての記事一覧（カテゴリ別） */}
      <section className="mx-auto max-w-[1200px] px-4 pb-12 lg:pb-16">
        <h2 className="mb-8 text-xl font-bold text-primary-700 lg:text-2xl">
          すべての記事
        </h2>

        {/* 国別記事 */}
        {countries.map((country) => {
          const countryArticles = articles.filter(
            (a) => a.frontmatter.category === "country" && a.slug.startsWith(`${country.id}/`)
          );
          if (countryArticles.length === 0) return null;
          return (
            <div key={country.id} className="mb-8">
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-900">
                <CountryFlag flag={country.flag} name={country.name} size="sm" />
                {country.name}
              </h3>
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {countryArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/${article.slug}`}
                      className="block py-1 text-sm text-neutral-700 hover:text-primary-700 hover:underline"
                    >
                      → {article.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* 比較記事 */}
        {(() => {
          const compareArticles = articles.filter((a) => a.frontmatter.category === "compare");
          if (compareArticles.length === 0) return null;
          return (
            <div className="mb-8">
              <h3 className="mb-3 text-base font-bold text-neutral-900">比較・ランキング</h3>
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {compareArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/compare/${article.slug}`}
                      className="block py-1 text-sm text-neutral-700 hover:text-primary-700 hover:underline"
                    >
                      → {article.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

        {/* ガイド記事 */}
        {(() => {
          const guideArticles = articles.filter((a) => a.frontmatter.category === "guide");
          if (guideArticles.length === 0) return null;
          return (
            <div className="mb-8">
              <h3 className="mb-3 text-base font-bold text-neutral-900">ガイド</h3>
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {guideArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/guide/${article.slug}`}
                      className="block py-1 text-sm text-neutral-700 hover:text-primary-700 hover:underline"
                    >
                      → {article.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </section>
    </>
  );
}
