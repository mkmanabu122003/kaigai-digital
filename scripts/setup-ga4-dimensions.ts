/**
 * GA4 カスタムディメンション / カスタム指標の一括登録
 *
 * 使い方:
 *   npx tsx scripts/setup-ga4-dimensions.ts --dry-run   # 作成予定の確認
 *   npx tsx scripts/setup-ga4-dimensions.ts             # 実行
 *   npx tsx scripts/setup-ga4-dimensions.ts --list      # 登録済み一覧のみ表示
 *
 * 前提:
 *   サービスアカウントに GA4 プロパティの「編集者」以上のロールが必要。
 *   閲覧者のままだと "The caller does not have permission" で失敗する。
 *   付与手順は docs/ga4-custom-dimensions.md を参照。
 *
 * 冪等性:
 *   登録済みのパラメータはスキップするため、何度実行しても安全。
 *
 * 制約:
 *   displayName は英数字・アンダースコア・スペースのみ（日本語不可）。
 *   GA4 の仕様であり、変更できない。
 */
import path from "path";
import { config } from "dotenv";
import { google } from "googleapis";

config({ path: path.join(process.cwd(), ".env.local") });

const PROPERTY = process.env.GA4_PROPERTY_ID || "529332559";
const DRY_RUN = process.argv.includes("--dry-run");
const LIST_ONLY = process.argv.includes("--list");

function getAuth() {
  const scopes = ["https://www.googleapis.com/auth/analytics.edit"];
  const keyEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyEnv) {
    return new google.auth.GoogleAuth({ credentials: JSON.parse(keyEnv), scopes });
  }
  const keyFile = (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").replace(
    /^~/,
    process.env.HOME || ""
  );
  return new google.auth.GoogleAuth({ keyFile, scopes });
}

/** [parameterName, displayName（英数字・_・スペースのみ）, description] */
const DIMENSIONS: [string, string, string][] = [
  // 優先度 高 — 不具合の特定に必須
  ["error_type", "Error Type", "site_error: js_error か unhandled_rejection か"],
  ["error_message", "Error Message", "site_error: エラーメッセージ（先頭100文字）"],
  ["page_path", "Error Page Path", "site_error: エラーが発生したページのパス"],
  ["metric_name", "Metric Name", "web_vitals: LCP / INP / CLS / FCP / TTFB"],
  ["metric_rating", "Metric Rating", "web_vitals: good / needs-improvement / poor"],
  // 優先度 中 — コンテンツ改善の判断材料
  ["depth_percentage", "Scroll Depth", "scroll_depth: 25 / 50 / 75 / 100"],
  ["read_time_seconds", "Read Time Seconds", "article_read_complete: 記事の滞在秒数"],
  // 内部リンクの効果測定（統廃合・内部リンク改修の検証用）
  ["from_slug", "Link From Slug", "internal_link_click: クリック元の記事"],
  ["to_path", "Link To Path", "internal_link_click: クリック先のパス"],
];

/** [parameterName, displayName, description, measurementUnit] */
const METRICS: [string, string, string, string][] = [
  ["metric_value", "Web Vitals Value", "web_vitals: 計測値（CLSは1000倍した整数）", "STANDARD"],
];

async function main() {
  const auth = getAuth();
  const admin = google.analyticsadmin({ version: "v1beta", auth: auth as never });
  const parent = `properties/${PROPERTY}`;

  const dimRes = await admin.properties.customDimensions.list({ parent });
  const metRes = await admin.properties.customMetrics.list({ parent });
  const existingDims = dimRes.data.customDimensions || [];
  const existingMets = metRes.data.customMetrics || [];

  console.log(`\n=== 登録済みディメンション（${existingDims.length}件）===`);
  for (const d of existingDims) {
    console.log(`  ${(d.parameterName || "").padEnd(20)} | ${d.displayName}`);
  }
  console.log(`=== 登録済み指標（${existingMets.length}件）===`);
  for (const m of existingMets) {
    console.log(`  ${(m.parameterName || "").padEnd(20)} | ${m.displayName}`);
  }
  if (!existingMets.length) console.log("  (なし)");

  if (LIST_ONLY) return;

  const haveDim = new Set(existingDims.map((d) => d.parameterName));
  const haveMet = new Set(existingMets.map((m) => m.parameterName));

  let created = 0;
  let skipped = 0;
  let failed = 0;

  console.log("");
  for (const [param, name, description] of DIMENSIONS) {
    if (haveDim.has(param)) {
      console.log(`⏭️  登録済み: ${param}`);
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY RUN] 作成: ${param} (${name})`);
      continue;
    }
    try {
      await admin.properties.customDimensions.create({
        parent,
        requestBody: { parameterName: param, displayName: name, description, scope: "EVENT" },
      });
      console.log(`✅ 作成: ${param} — ${name}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`❌ 失敗: ${param} — ${msg.slice(0, 200)}`);
      failed++;
    }
  }

  for (const [param, name, description, unit] of METRICS) {
    if (haveMet.has(param)) {
      console.log(`⏭️  登録済み: ${param}`);
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY RUN] 作成（指標）: ${param} (${name})`);
      continue;
    }
    try {
      await admin.properties.customMetrics.create({
        parent,
        requestBody: {
          parameterName: param,
          displayName: name,
          description,
          scope: "EVENT",
          measurementUnit: unit,
        },
      });
      console.log(`✅ 作成（指標）: ${param} — ${name}`);
      created++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`❌ 失敗（指標）: ${param} — ${msg.slice(0, 200)}`);
      failed++;
    }
  }

  if (!DRY_RUN) {
    console.log(`\n作成 ${created} / スキップ ${skipped} / 失敗 ${failed}`);
    if (failed > 0) {
      console.log(
        "\n⚠️ permission エラーの場合、サービスアカウントに「編集者」ロールが必要です。" +
          "\n   手順: docs/ga4-custom-dimensions.md"
      );
    }
    if (created > 0) {
      console.log("\n※ データの反映には24〜48時間かかります。過去に遡っての反映はされません。");
    }
  }
}

main().catch((e) => {
  console.error("ERROR:", e instanceof Error ? e.message.slice(0, 400) : e);
  process.exit(1);
});
