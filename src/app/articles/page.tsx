import Link from "next/link";
import { countries } from "@/lib/countries";
import { getAllArticles } from "@/lib/mdx";
import CountryFlag from "@/components/ui/CountryFlag";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata = generateSeoMetadata({
  title: "すべての記事一覧",
  description:
    "Kaigai Digital のすべての記事をカテゴリ別にまとめた一覧ページ。国別ガイド、比較・ランキング、ガイド記事から目的の記事を探せます。",
  path: "/articles",
});

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
      <h1 className="mb-2 text-2xl font-bold text-primary-700 lg:text-3xl">
        すべての記事
      </h1>
      <p className="mb-8 text-sm text-neutral-700">
        国別ガイド・比較記事・ガイド記事を一覧で掲載しています。
      </p>

      {/* 国別記事 */}
      {countries.map((country) => {
        const countryArticles = articles.filter(
          (a) => a.frontmatter.category === "country" && a.slug.startsWith(`${country.id}/`)
        );
        if (countryArticles.length === 0) return null;
        return (
          <div key={country.id} className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-neutral-900">
              <CountryFlag flag={country.flag} name={country.name} size="sm" />
              {country.name}
            </h2>
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
            <h2 className="mb-3 text-base font-bold text-neutral-900">比較・ランキング</h2>
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
            <h2 className="mb-3 text-base font-bold text-neutral-900">ガイド</h2>
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
    </div>
  );
}
