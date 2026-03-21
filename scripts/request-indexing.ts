import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import { google } from "googleapis";

const DRY_RUN = process.argv.includes("--dry-run");

function parseArgs() {
  const args = process.argv.slice(2);
  let since = "";
  let urls: string[] = [];

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--since":
        since = args[++i];
        break;
      case "--urls":
        urls = args[++i].split(",");
        break;
      case "--dry-run":
        break; // already handled
    }
  }

  return { since, urls };
}

async function getUrlsFromContent(since: string): Promise<string[]> {
  const siteUrl = "https://kaigai-digital.com";
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

  const sinceDate = new Date(since);
  const urls: string[] = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const { data } = matter(content);
    const updatedAt = new Date(data.updatedAt);

    if (updatedAt >= sinceDate) {
      const rel = path.relative(path.join(process.cwd(), "src/content"), file);
      let urlPath = rel
        .replace(/^countries\//, "")
        .replace(/\.mdx$/, "");

      // Add category prefix for non-country articles
      if (rel.startsWith("compare/") || rel.startsWith("guide/")) {
        urlPath = rel.replace(/\.mdx$/, "");
      }

      urls.push(`${siteUrl}/${urlPath}`);
    }
  }

  return urls;
}

async function requestIndexing(urls: string[]) {
  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would request indexing for:");
    for (const url of urls) {
      console.log(`  ${url}`);
    }
    console.log(`\nTotal: ${urls.length} URL(s)`);
    return;
  }

  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyFile) {
    console.error("Error: GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set.");
    console.error("Set it to the path of your service account JSON key file.");
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });

  const indexing = google.indexing({ version: "v3", auth });

  let success = 0;
  let failed = 0;

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: "URL_UPDATED",
        },
      });
      console.log(`✅ ${url}`);
      success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${url}: ${msg}`);
      failed++;
    }
  }

  console.log(`\n─${"─".repeat(49)}`);
  console.log(`Success: ${success} | Failed: ${failed}`);
}

async function main() {
  const { since, urls: directUrls } = parseArgs();

  let urls: string[];
  if (directUrls.length > 0) {
    urls = directUrls;
  } else if (since) {
    urls = await getUrlsFromContent(since);
  } else {
    console.log("Usage:");
    console.log("  npx tsx scripts/request-indexing.ts --since 2026-04-01 [--dry-run]");
    console.log("  npx tsx scripts/request-indexing.ts --urls https://example.com/path [--dry-run]");
    process.exit(1);
  }

  if (urls.length === 0) {
    console.log("No URLs to index.");
    return;
  }

  await requestIndexing(urls);
}

main().catch(console.error);
