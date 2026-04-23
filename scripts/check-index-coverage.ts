import fs from "fs";
import path from "path";
import { glob } from "glob";
import { google } from "googleapis";
import { config } from "dotenv";

config({ path: path.join(process.cwd(), ".env.local") });

const SITE_URL = "https://kaigai-digital.com";
const GSC_SITE_URL = "sc-domain:kaigai-digital.com";
const DATA_DIR = path.join(process.cwd(), "reports", "data", "coverage");

function getAuth() {
  const keyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyEnv) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(keyEnv),
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
  }
  const keyFile = (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").replace(
    /^~/,
    process.env.HOME || ""
  );
  if (keyFile && fs.existsSync(keyFile)) {
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
  }
  throw new Error("No credentials found");
}

async function getAllArticleUrls(): Promise<string[]> {
  const patterns = [
    "src/content/countries/**/*.mdx",
    "src/content/compare/**/*.mdx",
    "src/content/guide/**/*.mdx",
  ];
  const files: string[] = [];
  for (const pattern of patterns) {
    files.push(...(await glob(pattern)));
  }
  return files.map((f) => {
    const rel = path.relative(path.join(process.cwd(), "src/content"), f)
      .replace(/\.mdx$/, "")
      .replace(/^countries\//, "");
    return `${SITE_URL}/${rel}`;
  });
}

type CoverageRow = {
  url: string;
  verdict: string;
  coverageState: string;
  lastCrawlTime: string | null;
  indexingState: string | null;
  pageFetchState: string | null;
  robotsTxtState: string | null;
  canonical: string | null;
  userCanonical: string | null;
  googleCanonical: string | null;
};

async function inspectUrl(
  auth: InstanceType<typeof google.auth.GoogleAuth>,
  url: string
): Promise<CoverageRow> {
  const searchconsole = google.searchconsole({ version: "v1", auth });
  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: GSC_SITE_URL,
        languageCode: "ja-JP",
      },
    });
    const r = res.data.inspectionResult?.indexStatusResult;
    return {
      url,
      verdict: r?.verdict || "UNKNOWN",
      coverageState: r?.coverageState || "UNKNOWN",
      lastCrawlTime: r?.lastCrawlTime || null,
      indexingState: r?.indexingState || null,
      pageFetchState: r?.pageFetchState || null,
      robotsTxtState: r?.robotsTxtState || null,
      canonical: r?.userCanonical || r?.googleCanonical || null,
      userCanonical: r?.userCanonical || null,
      googleCanonical: r?.googleCanonical || null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      url,
      verdict: "ERROR",
      coverageState: msg.slice(0, 80),
      lastCrawlTime: null,
      indexingState: null,
      pageFetchState: null,
      robotsTxtState: null,
      canonical: null,
      userCanonical: null,
      googleCanonical: null,
    };
  }
}

async function main() {
  console.log("🔍 URL Inspection APIでインデックス状態を診断中...\n");

  const auth = getAuth();
  const urls = await getAllArticleUrls();
  urls.unshift(SITE_URL, `${SITE_URL}/articles`);

  console.log(`対象URL: ${urls.length}件\n`);

  const rows: CoverageRow[] = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] ${url.replace(SITE_URL, "")} ... `);
    const row = await inspectUrl(auth, url);
    rows.push(row);
    console.log(row.coverageState);
    await new Promise((r) => setTimeout(r, 200));
  }

  // Aggregate
  const dist: Record<string, number> = {};
  for (const r of rows) {
    dist[r.coverageState] = (dist[r.coverageState] || 0) + 1;
  }

  console.log("\n──────────────────────────────────────────────");
  console.log("📊 カバレッジ分布");
  console.log("──────────────────────────────────────────────");
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  for (const [state, count] of sorted) {
    const pct = ((count / rows.length) * 100).toFixed(1);
    console.log(`  ${state.padEnd(50)} ${String(count).padStart(3)}件 (${pct}%)`);
  }

  // List non-indexed URLs
  const notIndexed = rows.filter(
    (r) => r.verdict !== "PASS" && r.verdict !== "ERROR"
  );
  if (notIndexed.length > 0) {
    console.log("\n──────────────────────────────────────────────");
    console.log("⚠️  未インデックスURL一覧");
    console.log("──────────────────────────────────────────────");
    for (const r of notIndexed) {
      console.log(`  [${r.coverageState}] ${r.url.replace(SITE_URL, "")}`);
    }
  }

  // Save snapshot
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const today = new Date().toISOString().split("T")[0];
  const snapshotPath = path.join(DATA_DIR, `${today}.json`);
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    total: rows.length,
    distribution: dist,
    rows,
  };
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
  console.log(`\n🗄️  保存: ${snapshotPath}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
