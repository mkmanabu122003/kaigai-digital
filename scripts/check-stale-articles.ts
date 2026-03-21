import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

function parseArgs() {
  const args = process.argv.slice(2);
  let days = 180;
  let category = "";
  let output: "table" | "json" | "csv" = "table";

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--days":
        days = parseInt(args[++i], 10);
        break;
      case "--category":
        category = args[++i];
        break;
      case "--output":
        output = args[++i] as "table" | "json" | "csv";
        break;
    }
  }

  return { days, category, output };
}

async function main() {
  const { days, category, output } = parseArgs();
  const now = new Date();
  const staleDate = new Date(now);
  staleDate.setDate(staleDate.getDate() - days);

  let patterns: string[];
  if (category) {
    const dir = category === "country" ? "countries" : category;
    patterns = [`src/content/${dir}/**/*.mdx`];
  } else {
    patterns = [
      "src/content/countries/**/*.mdx",
      "src/content/compare/**/*.mdx",
      "src/content/guide/**/*.mdx",
    ];
  }

  const allFiles: string[] = [];
  for (const pattern of patterns) {
    const files = await glob(pattern);
    allFiles.push(...files);
  }

  const staleArticles: {
    path: string;
    title: string;
    category: string;
    updatedAt: string;
    daysAgo: number;
  }[] = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    const updatedAt = new Date(data.updatedAt);

    if (updatedAt < staleDate) {
      const daysAgo = Math.floor(
        (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      staleArticles.push({
        path: path.relative(process.cwd(), file),
        title: data.title,
        category: data.category,
        updatedAt: data.updatedAt,
        daysAgo,
      });
    }
  }

  // Sort by oldest first
  staleArticles.sort((a, b) => b.daysAgo - a.daysAgo);

  if (staleArticles.length === 0) {
    console.log(`\n✅ No stale articles found (all updated within ${days} days).\n`);
    return;
  }

  switch (output) {
    case "json":
      console.log(JSON.stringify(staleArticles, null, 2));
      break;

    case "csv":
      console.log("path,title,category,updatedAt,daysAgo");
      for (const a of staleArticles) {
        console.log(`"${a.path}","${a.title}","${a.category}","${a.updatedAt}",${a.daysAgo}`);
      }
      break;

    default:
      console.log(`\n## Stale Articles (updated more than ${days} days ago)\n`);
      console.log("| File | Title | Category | Last Updated | Days Ago |");
      console.log("|------|-------|----------|-------------|----------|");
      for (const a of staleArticles) {
        console.log(`| ${a.path} | ${a.title} | ${a.category} | ${a.updatedAt} | ${a.daysAgo} |`);
      }
      console.log(`\nTotal: ${staleArticles.length} stale article(s)\n`);
  }
}

main().catch(console.error);
