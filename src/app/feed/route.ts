import { getAllArticles } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function articleUrl(article: { slug: string; frontmatter: { category: string } }): string {
  const { category } = article.frontmatter;
  if (category === "country") {
    return `${siteConfig.url}/${article.slug}`;
  }
  return `${siteConfig.url}/${category}/${article.slug}`;
}

export async function GET() {
  const articles = getAllArticles().slice(0, 20);

  const items = articles
    .map((article) => {
      const url = articleUrl(article);
      const pubDate = new Date(article.frontmatter.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(article.frontmatter.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(article.frontmatter.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
