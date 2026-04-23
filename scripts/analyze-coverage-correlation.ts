import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

const SITE_URL = "https://kaigai-digital.com";
const CONTENT_DIR = path.join(process.cwd(), "src/content");
const COVERAGE_FILE = path.join(
  process.cwd(),
  "reports/data/coverage",
  `${new Date().toISOString().split("T")[0]}.json`
);

type CoverageRow = {
  url: string;
  verdict: string;
  coverageState: string;
};

type Article = {
  url: string;
  urlPath: string;
  filePath: string;
  category: string;
  title: string;
  wordCount: number;
  inboundLinks: number;
  h2Count: number;
  faqCount: number;
  coverageState?: string;
  isIndexed?: boolean;
};

function getAllMdxFiles(): string[] {
  const dirs = ["countries", "compare", "guide"];
  const files: string[] = [];
  for (const d of dirs) {
    const full = path.join(CONTENT_DIR, d);
    if (!fs.existsSync(full)) continue;
    files.push(...walkDir(full));
  }
  return files;
}

function walkDir(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkDir(full));
    else if (e.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function buildArticles(): Article[] {
  const files = getAllMdxFiles();
  const articles: Article[] = [];
  const linkCounts = new Map<string, number>();
  const bodies: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const { data, content: body } = matter(content);
    const rel = path.relative(CONTENT_DIR, file).replace(/\.mdx$/, "");
    const urlPath = rel.startsWith("countries/")
      ? "/" + rel.replace(/^countries\//, "")
      : "/" + rel;

    articles.push({
      url: `${SITE_URL}${urlPath}`,
      urlPath,
      filePath: file,
      category: data.category || "unknown",
      title: data.title || "",
      wordCount: body.replace(/\s/g, "").length,
      inboundLinks: 0,
      h2Count: (body.match(/^## /gm) || []).length,
      faqCount: Array.isArray(data.faq) ? data.faq.length : 0,
    });
    linkCounts.set(urlPath, 0);
    bodies.push(body);
  }

  const linkRegex = /\]\((\/[^)]+)\)/g;
  for (const body of bodies) {
    let m: RegExpExecArray | null;
    while ((m = linkRegex.exec(body)) !== null) {
      const target = m[1].replace(/#.*$/, "");
      if (linkCounts.has(target)) {
        linkCounts.set(target, (linkCounts.get(target) || 0) + 1);
      }
    }
  }

  for (const a of articles) {
    a.inboundLinks = linkCounts.get(a.urlPath) || 0;
  }
  return articles;
}

function loadCoverage(): Map<string, string> {
  if (!fs.existsSync(COVERAGE_FILE)) {
    throw new Error(`Coverage file not found: ${COVERAGE_FILE}`);
  }
  const data = JSON.parse(fs.readFileSync(COVERAGE_FILE, "utf-8"));
  const map = new Map<string, string>();
  for (const row of data.rows as CoverageRow[]) {
    map.set(row.url, row.coverageState);
  }
  return map;
}

type GroupStats = {
  count: number;
  avgWords: number;
  avgInbound: number;
  avgH2: number;
  avgFaq: number;
  minWords: number;
  maxWords: number;
  minInbound: number;
  maxInbound: number;
};

function computeStats(articles: Article[]): GroupStats {
  const n = articles.length;
  if (n === 0)
    return {
      count: 0,
      avgWords: 0,
      avgInbound: 0,
      avgH2: 0,
      avgFaq: 0,
      minWords: 0,
      maxWords: 0,
      minInbound: 0,
      maxInbound: 0,
    };
  return {
    count: n,
    avgWords: Math.round(articles.reduce((s, a) => s + a.wordCount, 0) / n),
    avgInbound: +(articles.reduce((s, a) => s + a.inboundLinks, 0) / n).toFixed(1),
    avgH2: +(articles.reduce((s, a) => s + a.h2Count, 0) / n).toFixed(1),
    avgFaq: +(articles.reduce((s, a) => s + a.faqCount, 0) / n).toFixed(1),
    minWords: Math.min(...articles.map((a) => a.wordCount)),
    maxWords: Math.max(...articles.map((a) => a.wordCount)),
    minInbound: Math.min(...articles.map((a) => a.inboundLinks)),
    maxInbound: Math.max(...articles.map((a) => a.inboundLinks)),
  };
}

function analyzeClusters(articles: Article[]): Map<string, Article[]> {
  // Group by category + country prefix
  const clusters = new Map<string, Article[]>();
  for (const a of articles) {
    let key: string;
    if (a.category === "country") {
      const parts = a.urlPath.split("/").filter(Boolean);
      key = `country:${parts[0] || "unknown"}`;
    } else {
      key = a.category;
    }
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key)!.push(a);
  }
  return clusters;
}

async function glob1() {
  await glob("src/content/**/*.mdx"); // force import
}

async function main() {
  await glob1();
  const articles = buildArticles();
  const coverage = loadCoverage();

  // Match
  for (const a of articles) {
    const state = coverage.get(a.url);
    a.coverageState = state || "未取得";
    a.isIndexed = state === "送信して登録されました";
  }

  const indexed = articles.filter((a) => a.isIndexed);
  const notIndexedDiscovered = articles.filter(
    (a) => a.coverageState === "検出 - インデックス未登録"
  );
  const unknown = articles.filter(
    (a) => a.coverageState === "URL が Google に認識されていません"
  );

  console.log("\n══════════════════════════════════════════════════════");
  console.log("① インデックス済み vs 未登録の記事特性比較");
  console.log("══════════════════════════════════════════════════════\n");

  const groups: [string, Article[]][] = [
    ["✅ インデックス済み", indexed],
    ["⚠️  検出・未登録", notIndexedDiscovered],
    ["❌ 未認識", unknown],
  ];
  console.log(
    `${"グループ".padEnd(25)} ${"件数".padStart(4)} ${"平均字数".padStart(8)} ${"平均被リンク".padStart(12)} ${"平均H2".padStart(7)} ${"平均FAQ".padStart(7)} ${"字数Min-Max".padStart(14)}`
  );
  console.log("─".repeat(90));
  for (const [label, arts] of groups) {
    const s = computeStats(arts);
    console.log(
      `${label.padEnd(25)} ${String(s.count).padStart(4)} ${String(s.avgWords).padStart(8)} ${String(s.avgInbound).padStart(12)} ${String(s.avgH2).padStart(7)} ${String(s.avgFaq).padStart(7)} ${(s.minWords + "-" + s.maxWords).padStart(14)}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("② 被リンク本数と登録状況の相関");
  console.log("══════════════════════════════════════════════════════\n");

  const inboundBuckets = [
    [0, 0, "0本"],
    [1, 1, "1本"],
    [2, 3, "2〜3本"],
    [4, 9, "4〜9本"],
    [10, 99, "10本以上"],
  ] as const;

  console.log(
    `${"被リンク".padEnd(10)} ${"全体".padStart(6)} ${"インデックス済".padStart(14)} ${"検出・未登録".padStart(14)} ${"未認識".padStart(8)} ${"登録率".padStart(8)}`
  );
  console.log("─".repeat(68));
  for (const [min, max, label] of inboundBuckets) {
    const inBucket = articles.filter(
      (a) => a.inboundLinks >= min && a.inboundLinks <= max
    );
    if (inBucket.length === 0) continue;
    const idx = inBucket.filter((a) => a.isIndexed).length;
    const ni = inBucket.filter(
      (a) => a.coverageState === "検出 - インデックス未登録"
    ).length;
    const un = inBucket.filter(
      (a) => a.coverageState === "URL が Google に認識されていません"
    ).length;
    const rate = inBucket.length > 0 ? ((idx / inBucket.length) * 100).toFixed(1) : "0";
    console.log(
      `${label.padEnd(10)} ${String(inBucket.length).padStart(6)} ${String(idx).padStart(14)} ${String(ni).padStart(14)} ${String(un).padStart(8)} ${(rate + "%").padStart(8)}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("③ 字数と登録状況の相関");
  console.log("══════════════════════════════════════════════════════\n");

  const wordBuckets = [
    [0, 1999, "<2000"],
    [2000, 2999, "2000-2999"],
    [3000, 3999, "3000-3999"],
    [4000, 4999, "4000-4999"],
    [5000, 99999, "5000+"],
  ] as const;

  console.log(
    `${"字数".padEnd(12)} ${"全体".padStart(6)} ${"インデックス済".padStart(14)} ${"登録率".padStart(8)}`
  );
  console.log("─".repeat(46));
  for (const [min, max, label] of wordBuckets) {
    const inBucket = articles.filter(
      (a) => a.wordCount >= min && a.wordCount <= max
    );
    if (inBucket.length === 0) continue;
    const idx = inBucket.filter((a) => a.isIndexed).length;
    const rate = ((idx / inBucket.length) * 100).toFixed(1);
    console.log(
      `${label.padEnd(12)} ${String(inBucket.length).padStart(6)} ${String(idx).padStart(14)} ${(rate + "%").padStart(8)}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("④ クラスタ別（カテゴリ/国別）の登録状況");
  console.log("══════════════════════════════════════════════════════\n");

  const clusters = analyzeClusters(articles);
  const clusterRows: [string, number, number, number][] = [];
  for (const [key, arts] of clusters) {
    const idx = arts.filter((a) => a.isIndexed).length;
    const rate = (idx / arts.length) * 100;
    clusterRows.push([key, arts.length, idx, rate]);
  }
  clusterRows.sort((a, b) => b[3] - a[3]);

  console.log(
    `${"クラスタ".padEnd(22)} ${"記事数".padStart(6)} ${"登録済".padStart(6)} ${"登録率".padStart(8)}`
  );
  console.log("─".repeat(46));
  for (const [key, total, idx, rate] of clusterRows) {
    console.log(
      `${key.padEnd(22)} ${String(total).padStart(6)} ${String(idx).padStart(6)} ${(rate.toFixed(1) + "%").padStart(8)}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("⑤ インデックス済み10件の特徴");
  console.log("══════════════════════════════════════════════════════\n");
  for (const a of indexed) {
    console.log(
      `  ${a.urlPath.padEnd(40)} 字数:${String(a.wordCount).padStart(5)} 被:${String(a.inboundLinks).padStart(3)} H2:${a.h2Count} FAQ:${a.faqCount}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("⑥ 最も短い未登録記事10件（字数が疑われる場合）");
  console.log("══════════════════════════════════════════════════════\n");
  const sortedShort = notIndexedDiscovered
    .slice()
    .sort((a, b) => a.wordCount - b.wordCount)
    .slice(0, 10);
  for (const a of sortedShort) {
    console.log(
      `  ${a.urlPath.padEnd(40)} 字数:${String(a.wordCount).padStart(5)} 被:${String(a.inboundLinks).padStart(3)}`
    );
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log("⑦ 被リンク最少の未登録記事10件（内部リンク不足疑い）");
  console.log("══════════════════════════════════════════════════════\n");
  const sortedLowLink = notIndexedDiscovered
    .slice()
    .sort((a, b) => a.inboundLinks - b.inboundLinks)
    .slice(0, 10);
  for (const a of sortedLowLink) {
    console.log(
      `  ${a.urlPath.padEnd(40)} 被:${String(a.inboundLinks).padStart(3)} 字数:${String(a.wordCount).padStart(5)}`
    );
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
