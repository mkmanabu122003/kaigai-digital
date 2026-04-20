import { notFound } from "next/navigation";
import { getCountryById, countries } from "@/lib/countries";
import { getArticleBySlug, getAllSlugs, getRelatedArticles, markdownToHtml } from "@/lib/mdx";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Sidebar from "@/components/layout/Sidebar";
import ArticleBody from "@/components/article/ArticleBody";
import TableOfContents from "@/components/article/TableOfContents";
import AuthorBox from "@/components/article/AuthorBox";
import RelatedArticles from "@/components/article/RelatedArticles";
import LastUpdated from "@/components/article/LastUpdated";
import PromoDisclosure from "@/components/article/PromoDisclosure";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import ComparisonTable from "@/components/affiliate/ComparisonTable";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import FAQ from "@/components/ui/FAQ";
import {
  ArticleJsonLd,
  FaqJsonLd,
  BreadcrumbJsonLd,
  ProductJsonLd,
} from "@/components/seo/JsonLd";
import { getServiceById } from "@/lib/affiliates";
import BlogMuraBanner from "@/components/ui/BlogMuraBanner";

type Props = {
  params: Promise<{ country: string; slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs
    .filter((s) => s.category === "country")
    .map((s) => {
      const parts = s.slug.split("/");
      return { country: parts[0], slug: parts[1] };
    });
}

export async function generateMetadata({ params }: Props) {
  const { country, slug } = await params;
  const article = getArticleBySlug("country", `${country}/${slug}`);
  if (!article) return {};
  return generateSeoMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/${country}/${slug}`,
    noindex: article.frontmatter.seo?.noindex,
    canonical: article.frontmatter.seo?.canonical,
  });
}

export default async function CountryArticlePage({ params }: Props) {
  const { country, slug } = await params;
  const article = getArticleBySlug("country", `${country}/${slug}`);
  if (!article) notFound();

  const countryData = getCountryById(country);
  const { frontmatter, content } = article;

  const relatedArticles = getRelatedArticles(article, 4);

  const breadcrumbItems = [
    { label: countryData?.name || country, href: `/${country}` },
    { label: frontmatter.title },
  ];

  const affiliateServices = (frontmatter.affiliateServices || [])
    .map((id) => getServiceById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getServiceById>>[];

  const htmlContent = await markdownToHtml(content);

  return (
    <>
      <ArticleJsonLd
        title={frontmatter.title}
        description={frontmatter.description}
        publishedAt={frontmatter.publishedAt}
        updatedAt={frontmatter.updatedAt}
        author={frontmatter.author}
        url={`${siteConfig.url}/${country}/${slug}`}
        image={frontmatter.heroImage}
      />
      {frontmatter.faq && <FaqJsonLd faqs={frontmatter.faq} />}
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {frontmatter.productReview && (
        <ProductJsonLd
          name={frontmatter.productReview.name}
          description={frontmatter.productReview.description}
          rating={frontmatter.productReview.rating}
          ratingCount={frontmatter.productReview.ratingCount}
          price={frontmatter.productReview.price}
          priceCurrency={frontmatter.productReview.priceCurrency}
          url={`${siteConfig.url}/${country}/${slug}`}
        />
      )}

      <div className="mx-auto max-w-[1200px] px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-10 pb-12">
          {/* Main content */}
          <div className="min-w-0 flex-1 lg:max-w-[740px]">
            <h1 className="text-2xl font-bold text-primary-700 lg:text-[32px] lg:leading-tight">
              {frontmatter.title}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <LastUpdated date={frontmatter.updatedAt} publishedAt={frontmatter.publishedAt} />
            </div>

            <div className="mt-4">
              <PromoDisclosure />
            </div>

            {/* Mobile TOC */}
            <div className="mt-6">
              <TableOfContents variant="mobile" />
            </div>

            {/* Article body */}
            <ArticleBody>
              <ArticleRenderer html={htmlContent} articleSlug={`${country}/${slug}`} />
            </ArticleBody>

            {/* Comparison table */}
            {affiliateServices.length > 1 && (
              <ComparisonTable
                services={affiliateServices}
                articleSlug={`${country}/${slug}`}
              />
            )}

            {/* FAQ */}
            {frontmatter.faq && frontmatter.faq.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-primary-700 lg:text-2xl">
                  よくある質問
                </h2>
                <FAQ items={frontmatter.faq} />
              </section>
            )}

            <div className="mt-12">
              <AuthorBox />
            </div>

            <div className="mt-6">
              <BlogMuraBanner />
            </div>

            <RelatedArticles articles={relatedArticles} />
          </div>

          {/* Sidebar */}
          <Sidebar>
            <TableOfContents variant="sidebar" />
            {affiliateServices[0] && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-bold text-neutral-900">
                  おすすめVPN
                </h3>
                <AffiliateButton
                  serviceId={affiliateServices[0].id}
                  placement="middle"
                  articleSlug={`${country}/${slug}`}
                />
              </div>
            )}
            <BlogMuraBanner />
          </Sidebar>
        </div>
      </div>
    </>
  );
}
