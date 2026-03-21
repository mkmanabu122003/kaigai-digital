import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

const DRY_RUN = process.argv.includes("--dry-run");

function updateArticleList(slug: string) {
  const listPath = path.join(process.cwd(), "articles-data/article-list.md");
  if (!fs.existsSync(listPath)) return;

  let content = fs.readFileSync(listPath, "utf-8");
  // Replace status emoji for matching slug
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(\\|[^|]*${escapedSlug}[^|]*\\|[^|]*\\|)\\s*🔲\\s*(\\|)`, "g");
  content = content.replace(regex, "$1 ✅ $2");
  const regex2 = new RegExp(`(\\|[^|]*${escapedSlug}[^|]*\\|[^|]*\\|)\\s*📝\\s*(\\|)`, "g");
  content = content.replace(regex2, "$1 ✅ $2");
  const regex3 = new RegExp(`(\\|[^|]*${escapedSlug}[^|]*\\|[^|]*\\|)\\s*👀\\s*(\\|)`, "g");
  content = content.replace(regex3, "$1 ✅ $2");

  fs.writeFileSync(listPath, content, "utf-8");
}

function promoteDraft(draftPath: string) {
  const fullPath = path.resolve(draftPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  data.updatedAt = new Date().toISOString().split("T")[0];

  const relativeToDrafts = path.relative(
    path.join(process.cwd(), "src/content/drafts"),
    fullPath
  );

  let destDir: string;
  let relativeFile: string;
  const category = data.category as string;

  if (category === "country") {
    destDir = path.join(process.cwd(), "src/content/countries");
    // Strip "countries/" prefix from relative path (e.g. "countries/china/net-guide.mdx" → "china/net-guide.mdx")
    relativeFile = relativeToDrafts.replace(/^countries\//, "");
  } else if (category === "compare") {
    destDir = path.join(process.cwd(), "src/content/compare");
    relativeFile = relativeToDrafts.replace(/^compare\//, "");
  } else if (category === "guide") {
    destDir = path.join(process.cwd(), "src/content/guide");
    relativeFile = relativeToDrafts.replace(/^guide\//, "");
  } else {
    console.error(`Unknown category: ${category}`);
    return;
  }

  const destPath = path.join(destDir, relativeFile);
  const destDirPath = path.dirname(destPath);

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would move: ${draftPath} → ${destPath}`);
    return;
  }

  fs.mkdirSync(destDirPath, { recursive: true });

  const updatedContent = matter.stringify(content, data);
  fs.writeFileSync(destPath, updatedContent, "utf-8");
  fs.unlinkSync(fullPath);

  // Determine slug for article-list update
  const slug = relativeToDrafts.replace(/\.mdx$/, "");
  updateArticleList(slug);

  console.log(`Promoted: ${draftPath} → ${destPath}`);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));

  if (args.length === 0) {
    console.log("Usage: npx tsx scripts/promote-draft.ts <glob_pattern> [--dry-run]");
    console.log('Example: npx tsx scripts/promote-draft.ts "src/content/drafts/china/line-vpn.mdx"');
    console.log('Example: npx tsx scripts/promote-draft.ts "src/content/drafts/**/*.mdx"');
    process.exit(1);
  }

  for (const pattern of args) {
    const files = await glob(pattern);
    if (files.length === 0) {
      // Try as literal path
      if (fs.existsSync(pattern)) {
        promoteDraft(pattern);
      } else {
        console.warn(`No files matched: ${pattern}`);
      }
    } else {
      for (const file of files) {
        promoteDraft(file);
      }
    }
  }
}

main().catch(console.error);
