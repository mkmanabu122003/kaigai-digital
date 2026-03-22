/**
 * ブログ村 XML-RPC ping 送信スクリプト
 *
 * 使い方:
 *   npx tsx scripts/ping-blogmura.ts                          # サイトトップのpingを送信
 *   npx tsx scripts/ping-blogmura.ts --url /china/net-guide   # 特定記事のpingを送信
 *   npx tsx scripts/ping-blogmura.ts --dry-run                # 送信せずに内容確認
 *
 * promote-draft.ts からも呼び出される。
 */

import { siteConfig } from "../src/lib/config";

const PING_ENDPOINT = "https://ping.blogmura.com/xmlrpc/dyrum45jyt8y/";
const BLOG_NAME = siteConfig.name;
const SITE_URL = siteConfig.siteUrl || siteConfig.url;

export async function sendPing(
  articleUrl?: string,
  options: { dryRun?: boolean } = {}
): Promise<{ success: boolean; message: string }> {
  const pingUrl = articleUrl
    ? `${SITE_URL}${articleUrl.startsWith("/") ? "" : "/"}${articleUrl}`
    : SITE_URL;

  // XML-RPC weblogUpdates.ping request body
  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>${escapeXml(BLOG_NAME)}</string></value></param>
    <param><value><string>${escapeXml(pingUrl)}</string></value></param>
  </params>
</methodCall>`;

  if (options.dryRun) {
    console.log("[DRY RUN] Would send ping to Blog Mura:");
    console.log(`  Endpoint: ${PING_ENDPOINT}`);
    console.log(`  Blog name: ${BLOG_NAME}`);
    console.log(`  URL: ${pingUrl}`);
    return { success: true, message: "Dry run - not sent" };
  }

  try {
    const response = await fetch(PING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "User-Agent": "Kaigai Digital Ping/1.0",
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    if (!response.ok) {
      const msg = `HTTP ${response.status}: ${responseText.slice(0, 200)}`;
      console.error(`Ping failed: ${msg}`);
      return { success: false, message: msg };
    }

    // Check XML-RPC response for flerror
    const hasError = responseText.includes("<name>flerror</name>")
      && responseText.includes("<boolean>1</boolean>");

    if (hasError) {
      const messageMatch = responseText.match(
        /<name>message<\/name>[\s\S]*?<string>([\s\S]*?)<\/string>/
      );
      const errorMsg = messageMatch?.[1]?.trim() || "Unknown error";
      console.error(`Ping rejected: ${errorMsg}`);
      return { success: false, message: errorMsg };
    }

    console.log(`Ping sent: ${BLOG_NAME} → ${pingUrl}`);
    return { success: true, message: "Ping accepted" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Ping error: ${msg}`);
    return { success: false, message: msg };
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── CLI entry point ───

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const urlFlag = args.indexOf("--url");
  const articleUrl = urlFlag !== -1 ? args[urlFlag + 1] : undefined;

  console.log("─── Blog Mura Ping ───");
  const result = await sendPing(articleUrl, { dryRun });
  console.log(`Result: ${result.success ? "✅" : "❌"} ${result.message}`);
  process.exit(result.success ? 0 : 1);
}

// Run only when executed directly (not imported)
const isDirectExecution = process.argv[1]?.includes("ping-blogmura");
if (isDirectExecution) {
  main().catch(console.error);
}
