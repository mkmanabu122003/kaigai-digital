import { getAllSlugs } from "@/lib/mdx";
import { countries } from "@/lib/countries";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const slugs = getAllSlugs();

  const staticPages = [
    { url: "", lastmod: new Date().toISOString() },
    { url: "/search", lastmod: new Date().toISOString() },
    { url: "/privacy-policy", lastmod: new Date().toISOString() },
    { url: "/disclaimer", lastmod: new Date().toISOString() },
  ];

  const countryPages = countries.map((c) => ({
    url: `/${c.id}`,
    lastmod: new Date().toISOString(),
  }));

  const articlePages = slugs.map((s) => {
    let url: string;
    if (s.category === "country") {
      url = `/${s.slug}`;
    } else {
      url = `/${s.category}/${s.slug}`;
    }
    return { url, lastmod: new Date().toISOString() };
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
