import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { config } from "dotenv";
import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

config({ path: path.join(process.cwd(), ".env.local") });

// ─── Config ───

const DRY_RUN = process.argv.includes("--dry-run");
const SITE_URL = "https://kaigai-digital.com";
const GSC_SITE_URL = "sc-domain:kaigai-digital.com";
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "529332559";
const CONTENT_DIR = path.join(process.cwd(), "src/content");
const REPORT_DIR = path.join(process.cwd(), "reports");

// ─── Auth ───

function getAuth() {
  const keyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyEnv) {
    const credentials = JSON.parse(keyEnv);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ],
    });
  }

  const keyFile = (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").replace(
    /^~/,
    process.env.HOME || ""
  );
  if (keyFile && fs.existsSync(keyFile)) {
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ],
    });
  }

  throw new Error(
    "No credentials found. Set GOOGLE_SERVICE_ACCOUNT_KEY_JSON or GOOGLE_SERVICE_ACCOUNT_KEY"
  );
}

// ─── GSC Data ───

type GscRow = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type GscQueryRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

async function fetchGscPerformance(auth: InstanceType<typeof google.auth.GoogleAuth>): Promise<GscRow[]> {
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const res = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      dimensions: ["page"],
      rowLimit: 500,
    },
  });

  return (res.data.rows || []).map((row) => ({
    page: (row.keys?.[0] || "").replace(SITE_URL, ""),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

async function fetchGscQueries(auth: InstanceType<typeof google.auth.GoogleAuth>): Promise<GscQueryRow[]> {
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const res = await searchconsole.searchanalytics.query({
    siteUrl: GSC_SITE_URL,
    requestBody: {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      dimensions: ["query", "page"],
      rowLimit: 1000,
    },
  });

  return (res.data.rows || []).map((row) => ({
    query: row.keys?.[0] || "",
    page: (row.keys?.[1] || "").replace(SITE_URL, ""),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

// ─── GA4 Data ───

type Ga4Row = {
  dimension: string;
  count: number;
};

async function fetchGa4Events(
  auth: InstanceType<typeof google.auth.GoogleAuth>,
  eventName: string,
  dimension: string
): Promise<Ga4Row[]> {
  const credentials = auth.jsonContent || (await auth.getCredentials());
  const client = new BetaAnalyticsDataClient({
    credentials: credentials as { client_email: string; private_key: string },
  });

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 28);

  const [response] = await client.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
    ],
    dimensions: [{ name: dimension }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        stringFilter: { matchType: "EXACT", value: eventName },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 50,
  });

  return (response.rows || []).map((row) => ({
    dimension: row.dimensionValues?.[0]?.value || "(not set)",
    count: parseInt(row.metricValues?.[0]?.value || "0", 10),
  }));
}

// ─── Analysis ───

type Issue = {
  type: "ctr_low" | "rank_opportunity" | "no_clicks" | "stale" | "cta_low";
  page: string;
  detail: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
};

function analyzeGsc(pages: GscRow[]): Issue[] {
  const issues: Issue[] = [];

  for (const p of pages) {
    // High impressions but low CTR
    if (p.impressions >= 50 && p.ctr < 0.03) {
      issues.push({
        type: "ctr_low",
        page: p.page,
        detail: `CTR ${(p.ctr * 100).toFixed(1)}% (${p.clicks}clicks / ${p.impressions}imp)`,
        severity: p.impressions >= 200 ? "high" : "medium",
        suggestion: "title/descriptionの最適化でCTR改善余地あり",
      });
    }

    // Ranking opportunity (position 5-20)
    if (p.position >= 5 && p.position <= 20 && p.impressions >= 30) {
      issues.push({
        type: "rank_opportunity",
        page: p.page,
        detail: `平均順位 ${p.position.toFixed(1)}位 (${p.impressions}imp)`,
        severity: p.position <= 10 ? "high" : "medium",
        suggestion: "コンテンツ強化で上位表示の可能性",
      });
    }

    // Has impressions but zero clicks
    if (p.impressions >= 20 && p.clicks === 0) {
      issues.push({
        type: "no_clicks",
        page: p.page,
        detail: `${p.impressions}回表示、クリック0`,
        severity: "medium",
        suggestion: "titleの訴求力を改善",
      });
    }
  }

  return issues;
}

function analyzeStaleArticles(): Issue[] {
  const issues: Issue[] = [];
  const dirs = ["countries", "compare", "guide"];
  const now = new Date();

  for (const dir of dirs) {
    const fullDir = path.join(CONTENT_DIR, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = getAllMdxFiles(fullDir);
    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const { data } = matter(content);
      if (!data.updatedAt) continue;

      const updated = new Date(data.updatedAt);
      const daysSinceUpdate = Math.floor(
        (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceUpdate >= 90) {
        const rel = path.relative(CONTENT_DIR, file);
        issues.push({
          type: "stale",
          page: "/" + rel.replace(/^countries\//, "").replace(/\.mdx$/, ""),
          detail: `最終更新: ${data.updatedAt} (${daysSinceUpdate}日前)`,
          severity: daysSinceUpdate >= 180 ? "high" : "medium",
          suggestion: "updatedAt更新 + コンテンツ鮮度チェック",
        });
      }
    }
  }

  return issues;
}

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...getAllMdxFiles(full));
    else if (entry.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

// ─── Report Generation ───

function generateReport(
  gscPages: GscRow[],
  gscQueries: GscQueryRow[],
  ga4Clicks: Ga4Row[],
  ga4Views: Ga4Row[],
  issues: Issue[]
): string {
  const today = new Date().toISOString().split("T")[0];

  const topPages = [...gscPages]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 15);

  const topQueries = [...gscQueries]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  const highIssues = issues.filter((i) => i.severity === "high");
  const medIssues = issues.filter((i) => i.severity === "medium");

  let md = `# SEO分析レポート — ${today}\n\n`;
  md += `期間: 過去28日間\n\n`;

  // Summary
  const totalClicks = gscPages.reduce((s, p) => s + p.clicks, 0);
  const totalImpressions = gscPages.reduce((s, p) => s + p.impressions, 0);
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

  md += `## サマリー\n\n`;
  md += `| 指標 | 値 |\n|------|----|\n`;
  md += `| 総クリック数 | ${totalClicks} |\n`;
  md += `| 総表示回数 | ${totalImpressions} |\n`;
  md += `| 平均CTR | ${(avgCtr * 100).toFixed(1)}% |\n`;
  md += `| 検出した課題 | ${issues.length}件（重大${highIssues.length} / 中${medIssues.length}） |\n\n`;

  // Top pages
  md += `## ページ別パフォーマンス TOP15\n\n`;
  md += `| ページ | クリック | 表示 | CTR | 順位 |\n`;
  md += `|--------|---------|------|-----|------|\n`;
  for (const p of topPages) {
    md += `| ${p.page} | ${p.clicks} | ${p.impressions} | ${(p.ctr * 100).toFixed(1)}% | ${p.position.toFixed(1)} |\n`;
  }

  // Top queries
  md += `\n## 検索クエリ TOP15\n\n`;
  md += `| クエリ | ページ | クリック | 表示 | CTR | 順位 |\n`;
  md += `|--------|--------|---------|------|-----|------|\n`;
  for (const q of topQueries) {
    md += `| ${q.query} | ${q.page} | ${q.clicks} | ${q.impressions} | ${(q.ctr * 100).toFixed(1)}% | ${q.position.toFixed(1)} |\n`;
  }

  // GA4 affiliate
  md += `\n## アフィリエイトクリック（GA4）\n\n`;
  if (ga4Clicks.length > 0) {
    md += `### サービス別\n\n`;
    md += `| サービス | クリック数 |\n|----------|----------|\n`;
    for (const r of ga4Clicks) {
      md += `| ${r.dimension} | ${r.count} |\n`;
    }
  } else {
    md += `(データなし — カスタムディメンション登録後のデータ蓄積待ち)\n`;
  }

  if (ga4Views.length > 0) {
    md += `\n### CTA表示数\n\n`;
    md += `| サービス | 表示数 |\n|----------|--------|\n`;
    for (const r of ga4Views) {
      md += `| ${r.dimension} | ${r.count} |\n`;
    }
  }

  // Issues
  md += `\n## 検出した課題\n\n`;

  if (highIssues.length > 0) {
    md += `### 重大（対応推奨）\n\n`;
    md += `| ページ | 種別 | 詳細 | 推奨アクション |\n`;
    md += `|--------|------|------|---------------|\n`;
    for (const i of highIssues) {
      md += `| ${i.page} | ${i.type} | ${i.detail} | ${i.suggestion} |\n`;
    }
  }

  if (medIssues.length > 0) {
    md += `\n### 中程度\n\n`;
    md += `| ページ | 種別 | 詳細 | 推奨アクション |\n`;
    md += `|--------|------|------|---------------|\n`;
    for (const i of medIssues) {
      md += `| ${i.page} | ${i.type} | ${i.detail} | ${i.suggestion} |\n`;
    }
  }

  if (issues.length === 0) {
    md += `課題は検出されませんでした。\n`;
  }

  // Action prompts — multi-perspective
  md += `\n## 改善アクション（Claude Codeにコピペで実行可能）\n\n`;

  const ctrIssues = issues.filter((i) => i.type === "ctr_low");
  const rankIssues = issues.filter((i) => i.type === "rank_opportunity");
  const staleIss = issues.filter((i) => i.type === "stale");
  const noClickIss = issues.filter((i) => i.type === "no_clicks");
  const highImpLowClick = topQueries
    .filter((q) => q.impressions >= 5 && q.clicks === 0)
    .slice(0, 5);

  // --- CEO: Growth Strategy ---
  md += `### CEO視点: 成長戦略\n\n`;
  md += "```\n";
  if (highImpLowClick.length > 0) {
    md += `【市場機会】以下の検索クエリでユーザーがサイトを発見しているが、クリックに至っていない。\n`;
    md += `これらは「需要があるのに獲得できていない市場」。新規記事作成 or 既存記事の最適化で取りに行く。\n\n`;
    for (const q of highImpLowClick) {
      md += `- 「${q.query}」→ ${q.page}（${q.impressions}imp, 順位${q.position.toFixed(1)}）\n`;
    }
    md += `\n`;
  }
  const totalClicks2 = gscPages.reduce((s, p) => s + p.clicks, 0);
  const totalImpressions2 = gscPages.reduce((s, p) => s + p.impressions, 0);
  md += `【KPI】クリック${totalClicks2} / 表示${totalImpressions2} = CTR${totalImpressions2 > 0 ? ((totalClicks2 / totalImpressions2) * 100).toFixed(1) : 0}%\n`;
  md += `目標: CTR 5%以上。表示回数が増えているならSEOは機能している。CTRの改善が次の成長レバー。\n`;
  md += "```\n\n";

  // --- CTO: Technical SEO ---
  md += `### CTO視点: テクニカルSEO\n\n`;
  md += "```\n";
  if (staleIss.length > 0) {
    md += `【鮮度シグナル】${staleIss.length}ページが90日以上未更新。Googleは鮮度を重視するため、updatedAtを更新しコンテンツを最新化せよ。\n\n`;
    for (const i of staleIss) {
      md += `  - ${i.page}（${i.detail}）\n`;
    }
    md += `\n実行: 各ファイルのupdatedAtを今日の日付に更新し、料金・サービス情報を最新化。\n`;
    md += `確認: npx tsx scripts/quality-check.ts && npx tsx scripts/check-internal-links.ts\n`;
  } else {
    md += `鮮度に問題なし。全記事が90日以内に更新されている。\n`;
  }
  md += `\n【構造化データ】Product schemaが適用されている記事のリッチリザルト表示をGoogle Rich Results Testで確認せよ。\n`;
  md += `【Core Web Vitals】Vercelダッシュボードでページ速度を確認。TTFB 200ms以下を維持。\n`;
  md += "```\n\n";

  // --- CMO: Content & Conversion ---
  md += `### CMO視点: コンテンツ & コンバージョン\n\n`;
  md += "```\n";
  if (ctrIssues.length > 0) {
    md += `【CTR改善】${ctrIssues.length}ページが表示されているのにクリックされていない。titleの訴求力を改善する。\n\n`;
    for (const i of ctrIssues) {
      md += `  - ${i.page}: ${i.detail}\n`;
    }
    md += `\n対応: 各ページのtitleとdescriptionを最適化。\n`;
    md += `- titleに【2026年最新】や具体的数字（「3選」「5ステップ」等）を含める\n`;
    md += `- descriptionにユーザーのペイン（「使えない」「困った」）を反映\n`;
    md += `- titleは60字以内、descriptionは120字以内\n`;
  }
  if (noClickIss.length > 0) {
    md += `\n【ゼロクリック】以下は表示されているがクリック0。titleが検索意図と合っていない可能性。\n\n`;
    for (const i of noClickIss) {
      md += `  - ${i.page}: ${i.detail}\n`;
    }
  }
  md += `\n確認: npx tsx scripts/quality-check.ts\n`;
  md += "```\n\n";

  // --- CSO (Chief Strategy Officer): Competitive & SEO ---
  md += `### CSO視点: SEO戦略 & 競合\n\n`;
  md += "```\n";
  if (rankIssues.length > 0) {
    md += `【順位改善チャンス】${rankIssues.length}ページが5〜20位圏内。コンテンツ強化で1ページ目上位を狙える。\n\n`;
    for (const i of rankIssues) {
      md += `  - ${i.page}: ${i.detail}\n`;
    }
    md += `\n対応:\n`;
    md += `- h2見出しにターゲットKWを追加\n`;
    md += `- 内部リンクを2〜3本追加（被リンクが多い記事から）\n`;
    md += `- FAQを1〜2個追加（People Also Askを参考に）\n`;
    md += `- 文字数が2,000字未満なら加筆\n`;
  } else {
    md += `5〜20位圏内のページなし。新規コンテンツの投入フェーズ。\n`;
  }
  md += `\n確認: npx tsx scripts/check-internal-links.ts（孤立ページが0であること）\n`;
  md += "```\n\n";

  // --- Top Affiliate Marketer ---
  md += `### トップアフィリエイター視点: CV最適化\n\n`;
  md += "```\n";
  // Analyze affiliate performance
  const kabenekoCicks = ga4Clicks.find((r) => r.dimension.includes("かべネコ"));
  const kabenekoViews = ga4Views.find((r) => r.dimension.includes("かべネコ"));
  const kClicks = kabenekoCicks?.count || 0;
  const kViews = kabenekoViews?.count || 0;
  const kCtr = kViews > 0 ? ((kClicks / kViews) * 100).toFixed(1) : "N/A";

  md += `【かべネコVPN CTA実績】表示${kViews}回 → クリック${kClicks}回（CTR: ${kCtr}%）\n\n`;

  if (kViews > 0 && kClicks === 0) {
    md += `CTAが表示されているがクリック0。CTA文言のA/Bテストを検討。\n`;
    md += `現在の文言: 「かべネコVPNを21日間無料で試す（クレカ不要）」\n`;
    md += `テスト候補: 「中国VPNを無料で21日間試す」「クレカ不要・21日間無料トライアル」\n\n`;
  }

  // Top converting pages
  const pagesWithClicks = gscPages.filter((p) => p.clicks > 0).sort((a, b) => b.clicks - a.clicks);
  if (pagesWithClicks.length > 0) {
    md += `【CV導線の強化】最もクリックされている記事:\n`;
    for (const p of pagesWithClicks.slice(0, 5)) {
      md += `  - ${p.page}（${p.clicks}clicks, CTR${(p.ctr * 100).toFixed(1)}%）\n`;
    }
    md += `\nこれらの記事のCTA配置を見直し、かべネコCTAが適切な位置にあるか確認。\n`;
    md += `特にbottom CTAがかべネコになっているか、kabeneko-setupへの内部リンクがあるか確認せよ。\n`;
  }

  md += `\n【季節性】4月は赴任シーズン。china/expat-digital-prep, china/vpn-free-trialの露出を強化。\n`;
  md += "```\n";

  return md;
}

// ─── Main ───

async function main() {
  console.log("🔍 SEO分析を開始...\n");

  const auth = getAuth();

  // Fetch GSC data
  console.log("📊 GSC パフォーマンスデータ取得中...");
  let gscPages: GscRow[] = [];
  let gscQueries: GscQueryRow[] = [];
  try {
    gscPages = await fetchGscPerformance(auth);
    gscQueries = await fetchGscQueries(auth);
    console.log(`  ✅ ${gscPages.length}ページ, ${gscQueries.length}クエリ取得`);
  } catch (e) {
    console.error(`  ❌ GSCデータ取得失敗: ${e instanceof Error ? e.message : e}`);
  }

  // Fetch GA4 data
  console.log("📊 GA4 アフィリエイトデータ取得中...");
  let ga4Clicks: Ga4Row[] = [];
  let ga4Views: Ga4Row[] = [];
  try {
    ga4Clicks = await fetchGa4Events(auth, "affiliate_click", "customEvent:service_name");
    ga4Views = await fetchGa4Events(auth, "cta_view", "customEvent:service_name");
    console.log(`  ✅ クリック${ga4Clicks.length}件, 表示${ga4Views.length}件`);
  } catch (e) {
    console.error(`  ❌ GA4データ取得失敗: ${e instanceof Error ? e.message : e}`);
  }

  // Analyze
  console.log("🔬 分析中...");
  const gscIssues = analyzeGsc(gscPages);
  const staleIssues = analyzeStaleArticles();
  const allIssues = [...gscIssues, ...staleIssues].sort((a, b) => {
    const sev = { high: 0, medium: 1, low: 2 };
    return sev[a.severity] - sev[b.severity];
  });
  console.log(`  ✅ ${allIssues.length}件の課題を検出`);

  // Generate report
  const report = generateReport(gscPages, gscQueries, ga4Clicks, ga4Views, allIssues);

  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

  const today = new Date().toISOString().split("T")[0];
  const reportPath = path.join(REPORT_DIR, `seo-${today}.md`);
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 レポート出力: ${reportPath}`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] レポートのみ出力。PR作成はスキップ。");
    console.log(report);
    return;
  }

  // Output for GitHub Actions
  const hasIssues = allIssues.length > 0;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `has_issues=${hasIssues}\nreport_path=${reportPath}\n`
    );
  }

  console.log(`\n✅ 分析完了。課題: ${allIssues.length}件`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
