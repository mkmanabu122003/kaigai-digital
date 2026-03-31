import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const client = new Anthropic();

type ArticleRow = {
  slug: string;
  title: string;
  article_type: string;
  country: string;
  main_keyword: string;
  target_affiliate: string;
  internal_links: string;
};

type Options = {
  input: string;
  dryRun: boolean;
  limit: number;
  concurrency: number;
  model: string;
  filter: string;
};

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = {
    input: "",
    dryRun: false,
    limit: Infinity,
    concurrency: 3,
    model: "claude-sonnet-4-20250514",
    filter: "",
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--input":
        opts.input = args[++i];
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--limit":
        opts.limit = parseInt(args[++i], 10);
        break;
      case "--concurrency":
        opts.concurrency = Math.min(parseInt(args[++i], 10), 5);
        break;
      case "--model":
        opts.model = args[++i];
        break;
      case "--filter":
        opts.filter = args[++i];
        break;
    }
  }

  if (!opts.input) {
    console.log("Usage: npx tsx scripts/batch-generate.ts --input <csv-file> [options]");
    console.log("");
    console.log("Options:");
    console.log("  --input <file>       CSV file path (required)");
    console.log("  --dry-run            Print prompts without calling API");
    console.log("  --limit <N>          Process only first N rows");
    console.log("  --concurrency <N>    Parallel requests (default: 3, max: 5)");
    console.log("  --model <model>      Model name (default: claude-sonnet-4-20250514)");
    console.log("  --filter <type>      Filter by article_type");
    process.exit(1);
  }

  return opts;
}

function loadPromptFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return "";
  return fs.readFileSync(fullPath, "utf-8");
}

function buildSystemPrompt(row: ArticleRow): string {
  // v2があればv2を使う、なければv1にフォールバック
  const base = loadPromptFile("prompts/system-prompt-v2.md") || loadPromptFile("prompts/system-prompt.md");

  // Map article_type to prompt file
  const typeMap: Record<string, string> = {
    compare: "prompts/article-types/compare.md",
    country_hub: "prompts/article-types/country-hub.md",
    country_service: "prompts/article-types/country-service.md",
    country_comparison: "prompts/article-types/country-comparison.md",
    guide: "prompts/article-types/guide.md",
    chiebukuro: "prompts/article-types/chiebukuro.md",
  };

  const typePrompt = loadPromptFile(typeMap[row.article_type] || "");
  const countryContext = row.country
    ? loadPromptFile(`prompts/country-context/${row.country}.md`)
    : "";

  return [base, typePrompt, countryContext].filter(Boolean).join("\n\n---\n\n");
}

function buildUserPrompt(row: ArticleRow): string {
  const affiliates = row.target_affiliate
    .split(";")
    .filter(Boolean)
    .join(", ");
  const links = row.internal_links
    .split(";")
    .filter(Boolean)
    .map((l) => `/${l}`)
    .join(", ");

  return `以下の条件で記事を生成してください。

- タイトル: ${row.title}
- スラッグ: ${row.slug}
- 記事タイプ: ${row.article_type}
${row.country ? `- 国: ${row.country}` : ""}
- メインキーワード: ${row.main_keyword}
- 推奨アフィリエイト: ${affiliates}
- 含めるべき内部リンク先: ${links}
- 公開日: ${new Date().toISOString().split("T")[0]}

MDXファイルとして出力してください（フロントマター + 本文）。本文以外の説明は不要です。`;
}

async function generateOne(
  row: ArticleRow,
  opts: Options
): Promise<{ slug: string; success: boolean; chars: number; error?: string }> {
  const systemPrompt = buildSystemPrompt(row);
  const userPrompt = buildUserPrompt(row);

  if (opts.dryRun) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`SLUG: ${row.slug}`);
    console.log(`${"=".repeat(60)}`);
    console.log("\n--- SYSTEM PROMPT ---");
    console.log(systemPrompt.slice(0, 500) + "...");
    console.log("\n--- USER PROMPT ---");
    console.log(userPrompt);
    return { slug: row.slug, success: true, chars: 0 };
  }

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.messages.create({
        model: opts.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type");
      }

      // Determine output path
      let outputDir: string;
      if (row.country && row.article_type !== "guide") {
        outputDir = path.join(process.cwd(), "src/content/drafts", row.country);
      } else if (row.article_type === "compare") {
        outputDir = path.join(process.cwd(), "src/content/drafts/compare");
      } else {
        outputDir = path.join(process.cwd(), "src/content/drafts/guide");
      }

      fs.mkdirSync(outputDir, { recursive: true });

      const fileName = row.slug.includes("/")
        ? row.slug.split("/").pop()!
        : row.slug;
      const outputPath = path.join(outputDir, `${fileName}.mdx`);
      fs.writeFileSync(outputPath, content.text, "utf-8");

      console.log(`✅ ${row.slug} (${content.text.length}字) → ${outputPath}`);
      return { slug: row.slug, success: true, chars: content.text.length };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (attempt < maxRetries) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`⚠️ ${row.slug} attempt ${attempt} failed, retrying in ${wait}ms...`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        console.error(`❌ ${row.slug}: ${errorMsg}`);
        return { slug: row.slug, success: false, chars: 0, error: errorMsg };
      }
    }
  }

  return { slug: row.slug, success: false, chars: 0, error: "Max retries exceeded" };
}

async function processWithConcurrency(
  rows: ArticleRow[],
  opts: Options
): Promise<{ slug: string; success: boolean; chars: number; error?: string }[]> {
  const results: { slug: string; success: boolean; chars: number; error?: string }[] = [];
  const queue = [...rows];

  const workers = Array.from({ length: opts.concurrency }, async () => {
    while (queue.length > 0) {
      const row = queue.shift()!;
      const result = await generateOne(row, opts);
      results.push(result);
    }
  });

  await Promise.all(workers);
  return results;
}

async function main() {
  const opts = parseArgs();

  const csvContent = fs.readFileSync(opts.input, "utf-8");
  let rows: ArticleRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (opts.filter) {
    rows = rows.filter((r) => r.article_type === opts.filter);
  }

  if (opts.limit < rows.length) {
    rows = rows.slice(0, opts.limit);
  }

  console.log(`\nProcessing ${rows.length} article(s)...`);
  if (opts.dryRun) console.log("[DRY RUN MODE]");
  console.log("");

  const results = await processWithConcurrency(rows, opts);

  // Summary
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const totalChars = successful.reduce((sum, r) => sum + r.chars, 0);

  console.log(`\n${"─".repeat(50)}`);
  console.log(`成功: ${successful.length} | 失敗: ${failed.length} | 合計文字数: ${totalChars.toLocaleString()}`);

  if (!opts.dryRun) {
    // Estimate cost (Sonnet: ~$3/1M input, ~$15/1M output)
    const estimatedCost = (totalChars / 1000000) * 15;
    console.log(`推定出力コスト: ~$${estimatedCost.toFixed(2)}`);
  }

  // Write errors CSV if any
  if (failed.length > 0) {
    const errorsPath = path.join(process.cwd(), "errors.csv");
    const errorsCsv = "slug,error\n" + failed.map((f) => `${f.slug},"${f.error}"`).join("\n");
    fs.writeFileSync(errorsPath, errorsCsv, "utf-8");
    console.log(`\nErrors written to: ${errorsPath}`);
    process.exit(1);
  }
}

main().catch(console.error);
