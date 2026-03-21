import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic();

type ArticleConfig = {
  country: string;
  topic: string;
  services: string[];
  articleType: "country" | "compare" | "guide";
  slug: string;
};

const SYSTEM_PROMPT = `あなたは海外渡航者向けのデジタル環境ガイド記事を執筆するライターです。

## トーン・スタイル
- 結論ファーストで書く（最初のセクションで結論を明示）
- 実体験的な表現を使う（「実際に使ってみると〜」「現地で試したところ〜」）
- 専門用語は初出時に簡単な説明を添える
- 読者は海外渡航が初めて or 不慣れな日本人を想定

## 構成ルール
- h2/h3で構造化する
- 記事中に内部リンクを挿入する場合は [テキスト](/パス) 形式
- CTA（広告ボタン）配置箇所は本文中にコメントで [CTA:サービス名:placement] と記載
- FAQ: 最低2つ含める
- 文字数: 2,000〜3,500字

## 出力形式
MDXファイルとして出力してください。先頭にYAMLフロントマターを含めてください。`;

async function generateArticle(config: ArticleConfig) {
  const userPrompt = `以下の条件で記事を生成してください。

- 国/地域: ${config.country}
- トピック: ${config.topic}
- 紹介サービス: ${config.services.join(", ")}
- 記事タイプ: ${config.articleType}
- スラッグ: ${config.slug}

フロントマターには以下を含めてください:
- title, description, category, country(国別記事の場合), tags, publishedAt, updatedAt, author("Kaigai Digital 編集部"), affiliateServices, faq, seo`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  // Determine output directory
  let outputDir: string;
  if (config.articleType === "country") {
    outputDir = path.join(
      process.cwd(),
      "src/content/drafts",
      config.country
    );
  } else {
    outputDir = path.join(
      process.cwd(),
      "src/content/drafts",
      config.articleType
    );
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const fileName = config.slug.includes("/")
    ? config.slug.split("/").pop()!
    : config.slug;
  const outputPath = path.join(outputDir, `${fileName}.mdx`);

  fs.writeFileSync(outputPath, content.text, "utf-8");
  console.log(`Article generated: ${outputPath}`);
}

// CLI usage
const args = process.argv.slice(2);
if (args.length < 4) {
  console.log(
    "Usage: npx tsx scripts/generate-article.ts <country> <topic> <services> <slug>"
  );
  console.log(
    'Example: npx tsx scripts/generate-article.ts china "中国でGoogleを使う方法" "nordvpn,surfshark" "china/google-vpn"'
  );
  process.exit(1);
}

generateArticle({
  country: args[0],
  topic: args[1],
  services: args[2].split(","),
  articleType: args[0] === "compare" ? "compare" : args[0] === "guide" ? "guide" : "country",
  slug: args[3],
}).catch(console.error);
