import { notFound } from "next/navigation";
import { getCountryById, countries } from "@/lib/countries";
import { getArticlesByCountry } from "@/lib/mdx";
import { generateSeoMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ArticleCard from "@/components/article/ArticleCard";
import CountryFlag from "@/components/ui/CountryFlag";
import StarRating from "@/components/ui/StarRating";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

type Props = {
  params: Promise<{ country: string }>;
};

export async function generateStaticParams() {
  return countries.map((c) => ({ country: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { country: countryId } = await params;
  const country = getCountryById(countryId);
  if (!country) return {};
  return generateSeoMetadata({
    title: `${country.name}のネット・デジタル環境ガイド`,
    description: country.description,
    path: `/${country.id}`,
  });
}

export default async function CountryPage({ params }: Props) {
  const { country: countryId } = await params;
  const country = getCountryById(countryId);
  if (!country) notFound();

  const articles = getArticlesByCountry(countryId);
  const breadcrumbItems = [{ label: country.name }];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="mx-auto max-w-[1200px] px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="py-8">
          <div className="flex items-center gap-4">
            <CountryFlag flag={country.flag} name={country.name} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-primary-700 lg:text-3xl">
                {country.name}のネット・デジタル環境ガイド
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
                <span>ネット規制レベル:</span>
                <StarRating rating={country.internetRestriction} />
              </div>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-neutral-700">
            {country.description}
          </p>
        </div>

        {articles.length > 0 ? (
          <section className="pb-12">
            <h2 className="mb-6 text-xl font-bold text-primary-700">
              {country.name}の記事一覧
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  slug={article.slug}
                  frontmatter={article.frontmatter}
                />
              ))}
            </div>
          </section>
        ) : (
          <p className="pb-12 text-neutral-700">
            この国の記事はまだありません。順次追加予定です。
          </p>
        )}
      </div>
    </>
  );
}
