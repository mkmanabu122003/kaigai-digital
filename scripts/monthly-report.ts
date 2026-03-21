import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";
import { glob } from "glob";

async function getArticleStats() {
  const patterns = {
    countries: "src/content/countries/**/*.mdx",
    compare: "src/content/compare/**/*.mdx",
    guide: "src/content/guide/**/*.mdx",
    drafts: "src/content/drafts/**/*.mdx",
  };

  const stats: Record<string, number> = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const files = await glob(pattern);
    stats[key] = files.length;
  }

  return stats;
}

async function main() {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  console.log(`Generating monthly report for ${yearMonth}...\n`);

  // 1. Article stats
  const stats = await getArticleStats();
  const total = stats.countries + stats.compare + stats.guide;

  let report = `# Monthly Report - ${yearMonth}\n\n`;
  report += `Generated: ${now.toISOString()}\n\n`;
  report += `## 記事統計\n\n`;
  report += `| Category | Count |\n`;
  report += `|----------|-------|\n`;
  report += `| 国別記事 | ${stats.countries} |\n`;
  report += `| 比較LP | ${stats.compare} |\n`;
  report += `| ガイド | ${stats.guide} |\n`;
  report += `| **合計** | **${total}** |\n`;
  report += `| ドラフト | ${stats.drafts} |\n\n`;

  // 2. Run stale check
  report += `## 鮮度アラート\n\n`;
  try {
    const staleOutput = execSync("npx tsx scripts/check-stale-articles.ts --output table", {
      encoding: "utf-8",
      timeout: 30000,
    });
    report += staleOutput + "\n";
  } catch (err) {
    const error = err as { stdout?: string };
    report += (error.stdout || "Check failed") + "\n";
  }

  // 3. Run internal link check
  report += `## 内部リンクチェック\n\n`;
  try {
    const linkOutput = execSync("npx tsx scripts/check-internal-links.ts", {
      encoding: "utf-8",
      timeout: 30000,
    });
    report += linkOutput + "\n";
  } catch (err) {
    const error = err as { stdout?: string };
    report += (error.stdout || "Check failed") + "\n";
  }

  // 4. Action recommendations
  report += `## アクション推奨\n\n`;

  // Check for articles updated this month
  const allFiles = await glob("src/content/{countries,compare,guide}/**/*.mdx");
  let updatedThisMonth = 0;
  let oldestArticle = { path: "", daysAgo: 0 };

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    const updatedAt = new Date(data.updatedAt);
    const daysAgo = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (
      updatedAt.getFullYear() === now.getFullYear() &&
      updatedAt.getMonth() === now.getMonth()
    ) {
      updatedThisMonth++;
    }

    if (daysAgo > oldestArticle.daysAgo) {
      oldestArticle = { path: path.relative(process.cwd(), file), daysAgo };
    }
  }

  report += `- 今月更新した記事: ${updatedThisMonth}本\n`;
  if (oldestArticle.daysAgo > 180) {
    report += `- ⚠️ 最も古い記事: ${oldestArticle.path} (${oldestArticle.daysAgo}日前)\n`;
  }
  if (stats.drafts > 0) {
    report += `- 📝 レビュー待ちドラフト: ${stats.drafts}本\n`;
  }
  report += "\n";

  // Save report
  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${yearMonth}.md`);
  fs.writeFileSync(reportPath, report, "utf-8");

  console.log(report);
  console.log(`Report saved to: ${reportPath}`);
}

main().catch(console.error);
