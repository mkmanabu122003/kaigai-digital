# Kaigai Digital - プロジェクト指示書

## このプロジェクトについて
kaigai-digital.com は「海外渡航者のネット・デジタル環境を国別に完全ガイド」するアフィリエイトサイトです。

## 技術スタック
- Next.js (App Router) + TypeScript + Tailwind CSS
- 記事はMDXファイル（gray-matterでフロントマター解析、remark-htmlでHTML変換）
- Vercel にデプロイ

## 記事を書く/生成するとき

### 手順
1. `articles-data/article-list.md` で書く記事を確認
2. `prompts/system-prompt.md` を読み、記事のトーンとルールを把握
3. `prompts/article-types/{type}.md` で記事タイプ別の構造を確認
4. 国別記事なら `prompts/country-context/{country}.md` を読む
5. MDXファイルを `src/content/drafts/{category}/{slug}.mdx` に作成
6. `npx tsx scripts/quality-check.ts --path "src/content/drafts/**/*.mdx"` で品質チェック
7. エラーがなければ `npx tsx scripts/promote-draft.ts "src/content/drafts/{path}"` で公開ディレクトリに移動

### 記事の品質基準
- フロントマター: title, description(120字以内), category, tags, publishedAt, updatedAt, author, faq(2つ以上) が必須
- CTA: `<CTA service="xxx" placement="top|middle|bottom" />` を最低3箇所
- 内部リンク: 最低3本。うち1本は比較LP（/compare/*）へ
- 文字数: 2,000〜4,500字（比較LPは3,000〜4,500字）
- FAQ: 最低2つ（フロントマターに記載）

### アフィリエイトリンク
`src/lib/affiliates.ts` に定義済みのサービスIDのみ使用可能:
- VPN: nordvpn, surfshark, kabeneko
- eSIM: airalo
- 送金: wise

記事内では `<CTA service="nordvpn" placement="middle" />` の形式で記述。
カスタムテキストも指定可能: `<CTA service="kabeneko" placement="top" text="21日間無料で試す" />`
かべネコCTAの標準文言:
- top: `text="かべネコVPNを21日間無料で試す（クレカ不要）"`
- middle: `text="21日間無料トライアルを始める"`
- bottom: `text="かべネコVPNを無料で試す"`

### 内部リンク
既存記事のslug一覧は `articles-data/article-list.md` を参照。
リンク形式: `[アンカーテキスト](/compare/best-vpn)` — アンカーにKWを含める。

### 記事を修正するとき
1. 対象ファイルを直接編集
2. `updatedAt` を今日の日付に更新
3. quality-check.ts で確認
4. git commit

### 記事公開後のワークフロー
1. `npx tsx scripts/promote-draft.ts "src/content/drafts/{path}"` で公開
2. `npx tsx scripts/ping-blogmura.ts` でブログ村ping送信
3. `npx tsx scripts/request-indexing.ts --since $(date +%Y-%m-%d)` でインデックスリクエスト
4. git commit & push

## よく使うコマンド
```bash
# 品質チェック（全記事）
npx tsx scripts/quality-check.ts

# 品質チェック（特定記事）
npx tsx scripts/quality-check.ts --path "src/content/drafts/china/*.mdx"

# ドラフトを公開（公開後にブログ村pingを自動送信）
npx tsx scripts/promote-draft.ts "src/content/drafts/china/line-vpn.mdx"

# ドラフトを公開（ping送信なし）
npx tsx scripts/promote-draft.ts "src/content/drafts/china/line-vpn.mdx" --no-ping

# ブログ村ping手動送信
npx tsx scripts/ping-blogmura.ts
npx tsx scripts/ping-blogmura.ts --url /china/net-guide
npx tsx scripts/ping-blogmura.ts --dry-run

# Google Indexing API（.env.localにキー設定済み）
npx tsx scripts/request-indexing.ts --since 2026-03-31
npx tsx scripts/request-indexing.ts --urls https://kaigai-digital.com/china/line-vpn
npx tsx scripts/request-indexing.ts --since 2026-03-31 --dry-run

# 鮮度チェック
npx tsx scripts/check-stale-articles.ts

# 内部リンクチェック
npx tsx scripts/check-internal-links.ts

# Batch API で記事生成
npx tsx scripts/batch-generate.ts --input articles-data/batch-1.csv
npx tsx scripts/batch-generate.ts --input articles-data/batch-1.csv --dry-run
npx tsx scripts/batch-generate.ts --input articles-data/batch-1.csv --filter compare --limit 3

# 開発サーバー
npm run dev

# ビルド確認
npm run build
```

## ディレクトリ構造
- `src/content/countries/{country}/` — 国別記事（公開済み）
- `src/content/compare/` — 比較LP（公開済み）
- `src/content/guide/` — ガイド記事（公開済み）
- `src/content/drafts/` — 未レビュー記事（ビルド対象外）
- `prompts/` — 記事生成プロンプト
- `articles-data/` — 記事一覧・CSV
- `scripts/` — 運用スクリプト

## 注意事項
- drafts/ 内の記事はビルドに含まれない
- 著者の個人情報（本名・資格等）は記事やコードに含めない
