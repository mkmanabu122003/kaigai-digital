import Link from "next/link";
import { countries } from "@/lib/countries";
import { getAllArticles } from "@/lib/mdx";
import ArticleCard from "@/components/article/ArticleCard";
import CountryFlag from "@/components/ui/CountryFlag";
import StarRating from "@/components/ui/StarRating";
import { WebSiteJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <>
      <WebSiteJsonLd />

      {/* Hero */}
      <section className="bg-primary-700 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 text-center">
          <h1 className="text-2xl font-bold text-white lg:text-4xl">
            海外のネット環境、これ1サイトで解決
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 lg:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/compare/best-vpn"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent-500 px-8 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-lg lg:h-[52px] lg:text-lg"
            >
              VPN比較を見る
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 国別ガイド */}
      <section
        id="countries"
        className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16"
      >
        <h2 className="mb-8 text-xl font-bold text-primary-700 lg:text-2xl">
          国別ガイド
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/${country.id}`}
              className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md"
            >
              <CountryFlag flag={country.flag} name={country.name} size="lg" />
              <div>
                <h3 className="font-bold text-neutral-900 group-hover:text-primary-700">
                  {country.name}
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
        <section className="mx-auto max-w-[1200px] px-4 pb-12 lg:pb-16">
          <h2 className="mb-8 text-xl font-bold text-primary-700 lg:text-2xl">
            最新記事
          </h2>
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
