import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

type Issue = {
  level: "ERROR" | "WARN";
  file: string;
  message: string;
};

const STRICT = process.argv.includes("--strict");

function getPathArg(): string {
  const idx = process.argv.indexOf("--path");
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return "src/content/{countries,compare,guide}/**/*.mdx";
}

function countChars(text: string): number {
  // Count characters excluding frontmatter, CTA tags, and markdown syntax
  return text
    .replace(/<CTA[^>]*\/>/g, "")
    .replace(/\[IMAGE:[^\]]*\]/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim().length;
}

function checkArticle(filePath: string): Issue[] {
  const issues: Issue[] = [];
  const relPath = path.relative(process.cwd(), filePath);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  // === Frontmatter checks ===

  // title
  if (!data.title) {
    issues.push({ level: "ERROR", file: relPath, message: "title が未設定" });
  } else if (data.title.length > 60) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: `title が60字超 (${data.title.length}字)`,
    });
  }

  // description
  if (!data.description) {
    issues.push({ level: "ERROR", file: relPath, message: "description が未設定" });
  } else if (data.description.length > 120) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `description が120字超 (${data.description.length}字)`,
    });
  }

  // category
  const validCategories = ["country", "compare", "guide"];
  if (!data.category || !validCategories.includes(data.category)) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `category が無効: "${data.category}" (country|compare|guide)`,
    });
  }

  // dates
  if (!data.publishedAt || isNaN(Date.parse(data.publishedAt))) {
    issues.push({ level: "ERROR", file: relPath, message: "publishedAt が無効" });
  }
  if (!data.updatedAt || isNaN(Date.parse(data.updatedAt))) {
    issues.push({ level: "ERROR", file: relPath, message: "updatedAt が無効" });
  }

  // FAQ
  if (!data.faq || !Array.isArray(data.faq) || data.faq.length < 2) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `FAQ が2つ未満 (${data.faq?.length || 0}個)`,
    });
  }

  // === Content checks ===

  // CTA placement
  const ctaMatches = content.match(/<CTA\s[^>]*>/g) || [];
  const ctaPlacements = ctaMatches.map((m) => {
    const match = m.match(/placement="([^"]+)"/);
    return match ? match[1] : null;
  });

  const hasTop = ctaPlacements.includes("top");
  const hasMiddle = ctaPlacements.includes("middle");
  const hasBottom = ctaPlacements.includes("bottom");

  if (!hasTop) {
    issues.push({ level: "ERROR", file: relPath, message: 'CTA placement="top" がない' });
  }
  if (!hasMiddle) {
    issues.push({ level: "ERROR", file: relPath, message: 'CTA placement="middle" がない' });
  }
  if (!hasBottom) {
    issues.push({ level: "ERROR", file: relPath, message: 'CTA placement="bottom" がない' });
  }

  if (ctaMatches.length < 3) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `CTA が3箇所未満 (${ctaMatches.length}箇所)`,
    });
  }
  if (ctaMatches.length > 5) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: `CTA が5箇所超 (${ctaMatches.length}箇所)`,
    });
  }

  // Internal links
  const linkMatches = content.match(/\[[^\]]+\]\(\/[^)]+\)/g) || [];
  const compareLinks = linkMatches.filter((l) => l.includes("/compare/"));

  if (linkMatches.length < 3) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `内部リンクが3本未満 (${linkMatches.length}本)`,
    });
  }
  if (compareLinks.length < 1) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: "比較LP (/compare/*) への内部リンクがない",
    });
  }

  // Word count
  const charCount = countChars(content);
  if (charCount < 1500) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `本文が1,500字未満 (${charCount}字)`,
    });
  } else if (charCount < 2000) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: `本文が2,000字未満 (${charCount}字)`,
    });
  }
  if (charCount > 5000) {
    issues.push({
      level: "ERROR",
      file: relPath,
      message: `本文が5,000字超 (${charCount}字)`,
    });
  }

  // h2 count
  const h2Count = (content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: `h2見出しが3個未満 (${h2Count}個)`,
    });
  }

  // affiliateServices
  if (!data.affiliateServices || data.affiliateServices.length === 0) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: "affiliateServices が未設定",
    });
  }

  // relatedSlugs
  if (!data.relatedSlugs || data.relatedSlugs.length === 0) {
    issues.push({
      level: "WARN",
      file: relPath,
      message: "relatedSlugs が未設定",
    });
  }

  return issues;
}

async function main() {
  const pattern = getPathArg();
  const files = await glob(pattern);

  if (files.length === 0) {
    console.log(`No files matched: ${pattern}`);
    process.exit(0);
  }

  console.log(`\nChecking ${files.length} file(s)...\n`);

  let totalErrors = 0;
  let totalWarns = 0;

  for (const file of files) {
    const issues = checkArticle(file);
    const errors = issues.filter((i) => i.level === "ERROR");
    const warns = issues.filter((i) => i.level === "WARN");

    totalErrors += errors.length;
    totalWarns += warns.length;

    if (issues.length > 0) {
      console.log(`📄 ${path.relative(process.cwd(), file)}`);
      for (const issue of issues) {
        const icon = issue.level === "ERROR" ? "  ❌" : "  ⚠️";
        console.log(`${icon} ${issue.message}`);
      }
      console.log("");
    }
  }

  console.log("─".repeat(50));
  console.log(`Files: ${files.length} | Errors: ${totalErrors} | Warnings: ${totalWarns}`);

  if (totalErrors > 0) {
    console.log("\n❌ Quality check failed.\n");
    process.exit(1);
  } else if (totalWarns > 0) {
    console.log("\n⚠️ Quality check passed with warnings.\n");
    if (STRICT) process.exit(1);
  } else {
    console.log("\n✅ All checks passed.\n");
  }
}

main().catch(console.error);
