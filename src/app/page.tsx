import Image from "next/image";
import Link from "next/link";
import { countries } from "@/lib/countries";
import { getAllArticles } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import CountryFlag from "@/components/ui/CountryFlag";
import Icon from "@/components/ui/Icon";
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
              旅行・出張・赴任の
              <br className="sm:hidden" />
              「海外デジタル」
              <br />
              まるごとガイド
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white drop-shadow-lg lg:mt-6 lg:text-lg">
              ネット・通信・送金・銀行・番号維持まで、渡航者のデジタル準備を国別・用途別に整理。
              <br className="hidden sm:block" />
              口コミとレビューを横断比較して、編集部が独自の見解でまとめた完全ガイド。
            </p>

            {/* Intent-based CTA cards */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3 lg:mt-10">
              {[
                {
                  href: "/compare/best-vpn",
                  icon: "shield" as const,
                  title: "VPNを選ぶ",
                  sub: "中国・地域制限対策",
                  primary: true,
                },
                {
                  href: "/compare/best-esim",
                  icon: "mobile" as const,
                  title: "eSIMを選ぶ",
                  sub: "200カ国対応・約500円〜",
                  primary: false,
                },
                {
                  href: "/compare/overseas-remittance",
                  icon: "currency" as const,
                  title: "送金を比較",
                  sub: "Wise vs PayPal vs 銀行",
                  primary: false,
                },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className={
                    c.primary
                      ? "group flex flex-col items-center gap-2 rounded-xl bg-accent-500 p-5 shadow-lg ring-1 ring-accent-400 transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-xl"
                      : "group flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:ring-white/40"
                  }
                >
                  <Icon
                    name={c.icon}
                    className={
                      c.primary ? "h-7 w-7 text-white" : "h-7 w-7 text-accent-400"
                    }
                  />
                  <span className="font-bold text-white">{c.title}</span>
                  <span
                    className={c.primary ? "text-xs text-white/90" : "text-xs text-white/70"}
                  >
                    {c.sub}
                  </span>
                </Link>
              ))}
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70 lg:mt-10 lg:text-sm">
              {[
                "公式・口コミを横断リサーチ",
                "出典付きで信頼できる",
                "独立メディア・忖度なし",
              ].map((label) => (
                <span key={label} className="flex items-center gap-1">
                  <Icon name="check" className="h-4 w-4 text-accent-400" />
                  {label}
                </span>
              ))}
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

      {/* 目的別で探す（ペルソナ分岐） */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <h2 className="mb-2 text-xl font-bold text-primary-700 lg:text-2xl">
          目的別に探す
        </h2>
        <p className="mb-8 text-sm text-neutral-700">
          あなたの渡航タイプから、必要な準備をまとめた記事へ
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/guide/smartphone-settings-before-travel",
              icon: "plane" as const,
              title: "初めての海外旅行",
              desc: "出発前のスマホ設定・eSIM・通信トラブル対策をまとめてチェック",
            },
            {
              href: "/compare/best-sim-number",
              icon: "briefcase" as const,
              title: "海外出張",
              desc: "短期間で確実に繋がる通信手段と、日本の番号を維持する方法",
            },
            {
              href: "/guide/expat-checklist",
              icon: "home" as const,
              title: "海外赴任・長期滞在",
              desc: "VPN・eSIM・送金・銀行・ストリーミングまで赴任前の全準備リスト",
            },
          ].map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon name={p.icon} className="h-8 w-8 text-primary-700" />
              <h3 className="mt-3 font-bold text-neutral-900 group-hover:text-primary-700">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-700">{p.desc}</p>
            </Link>
          ))}
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

      {/* 主要比較LP */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <h2 className="mb-2 text-xl font-bold text-primary-700 lg:text-2xl">
          比較・ランキング
        </h2>
        <p className="mb-8 text-sm text-neutral-700">
          用途別におすすめサービスを口コミ・公式情報から比較
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles
            .filter((a) => a.frontmatter.category === "compare")
            .slice(0, 6)
            .map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                frontmatter={article.frontmatter}
              />
            ))}
        </div>
      </section>

      {/* ガイド記事（ハブ） */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
        <h2 className="mb-2 text-xl font-bold text-primary-700 lg:text-2xl">
          準備・ノウハウガイド
        </h2>
        <p className="mb-8 text-sm text-neutral-700">
          赴任準備・スマホ設定・クレカ・保険・送金など渡航前の準備に役立つ記事
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles
            .filter((a) => a.frontmatter.category === "guide")
            .slice(0, 6)
            .map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                frontmatter={article.frontmatter}
              />
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
            {articles.slice(0, 12).map((article) => (
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
