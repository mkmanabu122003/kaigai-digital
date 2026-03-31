import { notFound } from "next/navigation";
import { getArticleBySlug, getAllSlugs, markdownToHtml } from "@/lib/mdx";
import { generateSeoMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { getServiceById } from "@/lib/affiliates";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Sidebar from "@/components/layout/Sidebar";
import ArticleBody from "@/components/article/ArticleBody";
import TableOfContents from "@/components/article/TableOfContents";
import AuthorBox from "@/components/article/AuthorBox";
import LastUpdated from "@/components/article/LastUpdated";
import PromoDisclosure from "@/components/article/PromoDisclosure";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import ComparisonTable from "@/components/affiliate/ComparisonTable";
import ArticleRenderer from "@/components/article/ArticleRenderer";
import ServiceCard from "@/components/affiliate/ServiceCard";
import FAQ from "@/components/ui/FAQ";
import {
  ArticleJsonLd,
  FaqJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import BlogMuraBanner from "@/components/ui/BlogMuraBanner";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllSlugs()
    .filter((s) => s.category === "compare")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("compare", slug);
  if (!article) return {};
  return generateSeoMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    path: `/compare/${slug}`,
  });
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("compare", slug);
  if (!article) notFound();

  const { frontmatter, content } = article;
  const breadcrumbItems = [
    { label: "比較", href: "/" },
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
        url={`${siteConfig.url}/compare/${slug}`}
      />
      {frontmatter.faq && <FaqJsonLd faqs={frontmatter.faq} />}
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="mx-auto max-w-[1200px] px-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-10 pb-12">
          <div className="min-w-0 flex-1 lg:max-w-[740px]">
            <h1 className="text-2xl font-bold text-primary-700 lg:text-[32px] lg:leading-tight">
              {frontmatter.title}
            </h1>

            <div className="mt-3">
              <LastUpdated date={frontmatter.updatedAt} />
            </div>

            <div className="mt-4">
              <PromoDisclosure />
            </div>

            {/* Comparison table at top */}
            {affiliateServices.length > 0 && (
              <ComparisonTable
                services={affiliateServices}
                articleSlug={`compare/${slug}`}
              />
            )}

            <div className="mt-6">
              <TableOfContents variant="mobile" />
            </div>

            <ArticleBody>
              <ArticleRenderer html={htmlContent} articleSlug={`compare/${slug}`} />
            </ArticleBody>

            {/* Service cards */}
            <div className="mt-8 space-y-6">
              {affiliateServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  articleSlug={`compare/${slug}`}
                />
              ))}
            </div>

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
          </div>

          <Sidebar>
            <TableOfContents variant="sidebar" />
            <BlogMuraBanner />
          </Sidebar>
        </div>
      </div>
    </>
  );
}
