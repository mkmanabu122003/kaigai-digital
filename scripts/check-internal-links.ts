import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

type ArticleInfo = {
  filePath: string;
  slug: string;
  category: string;
  outgoingLinks: string[];
  incomingLinks: string[];
};

function getSlugFromPath(filePath: string): string {
  const rel = path.relative(path.join(process.cwd(), "src/content"), filePath);
  // countries/china/line-vpn.mdx → china/line-vpn
  // compare/best-vpn.mdx → compare/best-vpn
  // guide/expat-checklist.mdx → guide/expat-checklist
  return rel
    .replace(/^countries\//, "")
    .replace(/\.mdx$/, "");
}

function getUrlFromSlug(slug: string, category: string): string {
  if (category === "country") {
    // slug is already "china/line-vpn"
    return `/${slug}`;
  }
  // slug is already "compare/best-vpn" or "guide/expat-checklist"
  return `/${slug}`;
}

async function main() {
  const patterns = [
    "src/content/countries/**/*.mdx",
    "src/content/compare/**/*.mdx",
    "src/content/guide/**/*.mdx",
  ];

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const files = await glob(pattern);
    allFiles.push(...files);
  }

  // Build article map
  const articles: Map<string, ArticleInfo> = new Map();
  const allUrls: Set<string> = new Set();

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);
    const slug = getSlugFromPath(filePath);
    const category = data.category as string;
    const url = getUrlFromSlug(slug, category);

    // Extract internal links
    const linkMatches = body.match(/\[[^\]]*\]\(\/([^)]+)\)/g) || [];
    const outgoingLinks = linkMatches.map((m) => {
      const match = m.match(/\]\(\/([^)]+)\)/);
      return match ? `/${match[1]}` : "";
    }).filter(Boolean);

    articles.set(url, {
      filePath: path.relative(process.cwd(), filePath),
      slug,
      category,
      outgoingLinks,
      incomingLinks: [],
    });
    allUrls.add(url);
  }

  // Build incoming links
  for (const [, article] of articles) {
    for (const link of article.outgoingLinks) {
      const target = articles.get(link);
      if (target) {
        target.incomingLinks.push(getUrlFromSlug(article.slug, article.category));
      }
    }
  }

  // === Checks ===
  let hasIssues = false;

  // 1. Broken links
  console.log("\n## リンク切れチェック\n");
  let brokenCount = 0;
  for (const [url, article] of articles) {
    for (const link of article.outgoingLinks) {
      if (!articles.has(link)) {
        console.log(`❌ ${article.filePath}: リンク先が存在しない → ${link}`);
        brokenCount++;
        hasIssues = true;
      }
    }
  }
  if (brokenCount === 0) console.log("✅ リンク切れなし");

  // 2. Insufficient internal links
  console.log("\n## 内部リンク不足（3本未満）\n");
  let insufficientCount = 0;
  for (const [, article] of articles) {
    if (article.outgoingLinks.length < 3) {
      console.log(
        `⚠️ ${article.filePath}: 内部リンク ${article.outgoingLinks.length}本`
      );
      insufficientCount++;
    }
  }
  if (insufficientCount === 0) console.log("✅ 全記事3本以上");

  // 3. No compare LP link
  console.log("\n## 比較LPリンクなし\n");
  let noCompareCount = 0;
  for (const [, article] of articles) {
    const hasCompare = article.outgoingLinks.some((l) => l.startsWith("/compare/"));
    if (!hasCompare) {
      console.log(`⚠️ ${article.filePath}: /compare/* へのリンクなし`);
      noCompareCount++;
    }
  }
  if (noCompareCount === 0) console.log("✅ 全記事に比較LPリンクあり");

  // 4. Orphan articles (0 incoming links)
  console.log("\n## 孤立記事（被リンク0本）\n");
  let orphanCount = 0;
  for (const [url, article] of articles) {
    if (article.incomingLinks.length === 0) {
      console.log(`⚠️ ${article.filePath}: 被リンク0本`);
      orphanCount++;
    }
  }
  if (orphanCount === 0) console.log("✅ 孤立記事なし");

  // 5. Compare LP incoming link ranking
  console.log("\n## 比較LP被リンク数ランキング\n");
  const compareLPs = Array.from(articles.entries())
    .filter(([url]) => url.startsWith("/compare/"))
    .sort((a, b) => b[1].incomingLinks.length - a[1].incomingLinks.length);

  if (compareLPs.length > 0) {
    console.log("| URL | 被リンク数 |");
    console.log("|-----|-----------|");
    for (const [url, article] of compareLPs) {
      console.log(`| ${url} | ${article.incomingLinks.length} |`);
    }
  }

  // Summary
  console.log("\n─".repeat(50));
  console.log(
    `記事数: ${articles.size} | リンク切れ: ${brokenCount} | リンク不足: ${insufficientCount} | 孤立: ${orphanCount}`
  );

  if (brokenCount > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
