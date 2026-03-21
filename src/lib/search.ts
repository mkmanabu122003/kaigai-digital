import Fuse from "fuse.js";
import { getAllArticles, type Article } from "./mdx";

export type SearchItem = {
  title: string;
  description: string;
  slug: string;
  category: string;
  country?: string;
  tags: string[];
  url: string;
};

export function buildSearchIndex(): SearchItem[] {
  const articles = getAllArticles();
  return articles.map((article) => {
    const { frontmatter, slug } = article;
    let url: string;
    if (frontmatter.category === "country" && frontmatter.country) {
      url = `/${slug}`;
    } else {
      url = `/${frontmatter.category}/${slug}`;
    }
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      slug,
      category: frontmatter.category,
      country: frontmatter.country,
      tags: frontmatter.tags,
      url,
    };
  });
}

export function createSearchClient(items: SearchItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 2 },
      { name: "description", weight: 1 },
      { name: "tags", weight: 1.5 },
      { name: "country", weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
