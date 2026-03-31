import path from "path";
import { config } from "dotenv";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

config({ path: path.join(process.cwd(), ".env.local") });

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

if (!PROPERTY_ID) {
  console.error("Error: GA4_PROPERTY_ID not set in .env.local");
  process.exit(1);
}

// Use Application Default Credentials (gcloud auth application-default login)
if (process.env.GOOGLE_CLOUD_QUOTA_PROJECT) {
  process.env.GOOGLE_CLOUD_QUOTA_PROJECT =
    process.env.GOOGLE_CLOUD_QUOTA_PROJECT;
}

const args = process.argv.slice(2);
let days = 28;
let serviceFilter = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--days") days = parseInt(args[++i], 10);
  if (args[i] === "--service") serviceFilter = args[++i];
}

const client = new BetaAnalyticsDataClient({
  projectId: "seo-pipeline-490113",
  clientOptions: {
    quotaProjectId: "seo-pipeline-490113",
  },
});

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

async function runReport(
  dimensions: string[],
  metrics: string[],
  eventName: string,
  extraFilters?: { fieldName: string; stringFilter: { value: string } }[]
) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dimensionFilter: Record<string, unknown> = {
    filter: {
      fieldName: "eventName",
      stringFilter: { matchType: "EXACT", value: eventName },
    },
  };

  if (extraFilters && extraFilters.length > 0) {
    dimensionFilter.andGroup = {
      expressions: [
        {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: eventName },
          },
        },
        ...extraFilters.map((f) => ({
          filter: {
            fieldName: f.fieldName,
            stringFilter: {
              matchType: "EXACT" as const,
              value: f.stringFilter.value,
            },
          },
        })),
      ],
    };
    delete dimensionFilter.filter;
  }

  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    ],
    dimensions: dimensions.map((d) => ({ name: d })),
    metrics: metrics.map((m) => ({ name: m })),
    dimensionFilter: dimensionFilter as never,
    orderBys: [
      {
        metric: { metricName: metrics[0] },
        desc: true,
      },
    ],
    limit: 20,
  });

  return response;
}

function printTable(
  title: string,
  headers: string[],
  rows: string[][]
) {
  console.log(`\n━━━ ${title} ━━━`);
  if (rows.length === 0) {
    console.log("  (データなし)");
    return;
  }

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] || "").length))
  );

  console.log(
    "  " + headers.map((h, i) => h.padEnd(widths[i])).join(" | ")
  );
  console.log(
    "  " + widths.map((w) => "─".repeat(w)).join("─┼─")
  );
  for (const row of rows) {
    console.log(
      "  " + row.map((c, i) => c.padEnd(widths[i])).join(" | ")
    );
  }
}

async function main() {
  console.log(
    `\n📊 アフィリエイトレポート（過去${days}日間）`
  );
  if (serviceFilter) console.log(`   フィルタ: ${serviceFilter}`);
  console.log(`   プロパティ: ${PROPERTY_ID}\n`);

  const svcFilter = serviceFilter
    ? [
        {
          fieldName: "customEvent:service_name",
          stringFilter: { value: serviceFilter },
        },
      ]
    : undefined;

  // 1. サービス別クリック数
  try {
    const clickRes = await runReport(
      ["customEvent:service_name"],
      ["eventCount"],
      "affiliate_click",
      svcFilter
    );
    const rows =
      clickRes.rows?.map((r) => [
        r.dimensionValues?.[0]?.value || "",
        r.metricValues?.[0]?.value || "0",
      ]) || [];
    printTable("サービス別クリック数", ["サービス", "クリック"], rows);
  } catch (e) {
    console.log("\n━━━ サービス別クリック数 ━━━");
    console.log(`  Error: ${e instanceof Error ? e.message : e}`);
  }

  // 2. 記事別クリック数
  try {
    const articleRes = await runReport(
      ["customEvent:article_slug"],
      ["eventCount"],
      "affiliate_click",
      svcFilter
    );
    const rows =
      articleRes.rows?.map((r) => [
        r.dimensionValues?.[0]?.value || "",
        r.metricValues?.[0]?.value || "0",
      ]) || [];
    printTable("記事別クリック数", ["記事", "クリック"], rows);
  } catch (e) {
    console.log("\n━━━ 記事別クリック数 ━━━");
    console.log(`  Error: ${e instanceof Error ? e.message : e}`);
  }

  // 3. placement別クリック数
  try {
    const placementRes = await runReport(
      ["customEvent:placement"],
      ["eventCount"],
      "affiliate_click",
      svcFilter
    );
    const rows =
      placementRes.rows?.map((r) => [
        r.dimensionValues?.[0]?.value || "",
        r.metricValues?.[0]?.value || "0",
      ]) || [];
    printTable("placement別クリック数", ["位置", "クリック"], rows);
  } catch (e) {
    console.log("\n━━━ placement別クリック数 ━━━");
    console.log(`  Error: ${e instanceof Error ? e.message : e}`);
  }

  // 4. CTA表示数（cta_view）
  try {
    const viewRes = await runReport(
      ["customEvent:service_name"],
      ["eventCount"],
      "cta_view",
      svcFilter
    );
    const rows =
      viewRes.rows?.map((r) => [
        r.dimensionValues?.[0]?.value || "",
        r.metricValues?.[0]?.value || "0",
      ]) || [];
    printTable("CTA表示数", ["サービス", "表示"], rows);
  } catch (e) {
    console.log("\n━━━ CTA表示数 ━━━");
    console.log(`  Error: ${e instanceof Error ? e.message : e}`);
  }

  // 5. A/Bテスト（variant別）
  try {
    const abRes = await runReport(
      ["customEvent:variant"],
      ["eventCount"],
      "affiliate_click",
      svcFilter
    );
    const rows =
      abRes.rows?.map((r) => [
        r.dimensionValues?.[0]?.value || "(未設定)",
        r.metricValues?.[0]?.value || "0",
      ]) || [];
    printTable("A/Bテスト variant別クリック", ["variant", "クリック"], rows);
  } catch (e) {
    console.log("\n━━━ A/Bテスト variant別クリック ━━━");
    console.log(`  Error: ${e instanceof Error ? e.message : e}`);
  }

  console.log("\n");
}

main().catch(console.error);
