import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/mdx";

type Props = {
  slug: string;
  frontmatter: ArticleFrontmatter;
};

export default function ArticleCard({ slug, frontmatter }: Props) {
  const href =
    frontmatter.category === "country"
      ? `/${slug}`
      : `/${frontmatter.category}/${slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-2">
        {frontmatter.country && (
          <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
            {frontmatter.country.toUpperCase()}
          </span>
        )}
        {frontmatter.category === "compare" && (
          <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
            比較
          </span>
        )}
        {frontmatter.category === "guide" && (
          <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
            ガイド
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-neutral-900 group-hover:text-primary-700 lg:text-lg">
        {frontmatter.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700 line-clamp-2">
        {frontmatter.description}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
        <time dateTime={frontmatter.updatedAt}>
          更新: {frontmatter.updatedAt}
        </time>
        <span>{frontmatter.author}</span>
      </div>
    </Link>
  );
}
