import { getAllSlugs } from "@/lib/mdx";
import { countries } from "@/lib/countries";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const slugs = getAllSlugs();

  const sitePublishedAt = "2026-03-22";

  const staticPages = [
    { url: "", lastmod: "2026-04-11" },
    { url: "/about", lastmod: "2026-04-11" },
    { url: "/editorial-policy", lastmod: "2026-04-11" },
    { url: "/affiliate-disclosure", lastmod: "2026-04-11" },
    { url: "/contact", lastmod: "2026-04-11" },
    { url: "/authors/k", lastmod: "2026-04-11" },
    { url: "/privacy-policy", lastmod: sitePublishedAt },
    { url: "/disclaimer", lastmod: sitePublishedAt },
  ];

  const countryPages = countries.map((c) => {
    // Use the latest updatedAt from articles in this country
    const countryArticles = slugs.filter(
      (s) => s.category === "country" && s.slug.startsWith(`${c.id}/`)
    );
    const latestDate = countryArticles.reduce((latest, article) => {
      const date = article.updatedAt || article.publishedAt || sitePublishedAt;
      return date > latest ? date : latest;
    }, sitePublishedAt);

    return {
      url: `/${c.id}`,
      lastmod: latestDate,
    };
  });

  const articlePages = slugs.map((s) => {
    let url: string;
    if (s.category === "country") {
      url = `/${s.slug}`;
    } else {
      url = `/${s.category}/${s.slug}`;
    }
    return {
      url,
      lastmod: s.updatedAt || s.publishedAt || sitePublishedAt,
    };
  });

  const allPages = [...staticPages, ...countryPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
