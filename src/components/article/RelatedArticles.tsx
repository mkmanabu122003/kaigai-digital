import ArticleCard from "./ArticleCard";
import type { Article } from "@/lib/mdx";

type Props = {
  articles: Article[];
};

export default function RelatedArticles({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-primary-700">関連記事</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {articles.map((article) => (
          <div key={article.slug} className="min-w-[280px] lg:min-w-0">
            <ArticleCard
              slug={article.slug}
              frontmatter={article.frontmatter}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
