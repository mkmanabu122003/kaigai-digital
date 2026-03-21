import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import rehypeSlug from "rehype-slug";

export type ArticleFrontmatter = {
  title: string;
  description: string;
  category: "country" | "compare" | "guide";
  country?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  heroImage?: string;
  relatedSlugs?: string[];
  affiliateServices?: string[];
  faq?: { question: string; answer: string }[];
  seo?: {
    canonical?: string;
    noindex?: boolean;
  };
};

export type Article = {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content");

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getArticleBySlug(
  category: string,
  slug: string
): Article | null {
  const categoryDir =
    category === "country" ? "countries" : category;

  // For country articles, slug might be "china/line-vpn"
  const filePath = path.join(CONTENT_DIR, categoryDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function getAllArticles(category?: string): Article[] {
  const articles: Article[] = [];

  const dirs =
    category === "country"
      ? [path.join(CONTENT_DIR, "countries")]
      : category
        ? [path.join(CONTENT_DIR, category)]
        : [
            path.join(CONTENT_DIR, "countries"),
            path.join(CONTENT_DIR, "compare"),
            path.join(CONTENT_DIR, "guide"),
          ];

  for (const dir of dirs) {
    const files = getMdxFiles(dir);
    for (const filePath of files) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const relativePath = path.relative(
        path.join(CONTENT_DIR, dir === path.join(CONTENT_DIR, "countries") ? "countries" : path.basename(dir)),
        filePath
      );
      const slug = relativePath.replace(/\.mdx$/, "");

      articles.push({
        slug,
        frontmatter: data as ArticleFrontmatter,
        content,
      });
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export function getArticlesByCountry(countryId: string): Article[] {
  const dir = path.join(CONTENT_DIR, "countries", countryId);
  if (!fs.existsSync(dir)) return [];

  const files = getMdxFiles(dir);
  return files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = `${countryId}/${path.basename(filePath, ".mdx")}`;
    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
    };
  });
}

export function getAllSlugs(): { category: string; slug: string }[] {
  const slugs: { category: string; slug: string }[] = [];

  // Countries
  const countriesDir = path.join(CONTENT_DIR, "countries");
  if (fs.existsSync(countriesDir)) {
    for (const file of getMdxFiles(countriesDir)) {
      const rel = path.relative(countriesDir, file).replace(/\.mdx$/, "");
      const parts = rel.split(path.sep);
      if (parts.length === 2) {
        slugs.push({ category: "country", slug: rel });
      }
    }
  }

  // Compare & Guide
  for (const cat of ["compare", "guide"]) {
    const dir = path.join(CONTENT_DIR, cat);
    if (fs.existsSync(dir)) {
      for (const file of getMdxFiles(dir)) {
        const slug = path.relative(dir, file).replace(/\.mdx$/, "");
        slugs.push({ category: cat, slug });
      }
    }
  }

  return slugs;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
